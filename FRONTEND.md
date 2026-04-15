# Smart Traffic Dashboard — Frontend Implementation Guide

คู่มือนี้ใช้สำหรับการพัฒนา React frontend ของระบบ Dashboard ควบคุมสัญญาณไฟจราจร

---

## Stack ที่แนะนำ

- React + Vite
- Font: **Itim** (Google Fonts) — ใส่ใน `index.html` หรือ `index.css`
- ไม่ต้องใช้ UI Library — ออกแบบเองตาม Design System ด้านล่าง

```html
<!-- index.html -->
<link href="https://fonts.googleapis.com/css2?family=Itim&display=swap" rel="stylesheet" />
```

```css
/* index.css */
* {
  font-family: 'Itim', sans-serif;
}
```

---

## Design System

> ออกแบบสำหรับเจ้าหน้าที่ตำรวจที่อาจมองหน้าจอจากระยะห่าง — **font ใหญ่ อ่านง่าย ชัดเจน**

### สี (Colors)

| ชื่อ | HEX | ใช้สำหรับ |
|------|-----|-----------|
| Background | `#0a0a0a` | พื้นหลังหน้าจอ |
| Surface | `#141414` | Card / Panel |
| Border | `#2a2a2a` | เส้นขอบ |
| Text Primary | `#ffffff` | ข้อความหลัก |
| Text Secondary | `#888888` | ข้อความรอง / label |
| Text Muted | `#444444` | ข้อมูลไม่สำคัญ |
| Phase Active | `#166534` | พื้นหลัง Card ของเฟสที่กำลัง Active |
| Phase Inactive | `#1f1f1f` | พื้นหลัง Card ของเฟสที่ไม่ Active |
| Phase Active Border | `#16a34a` | เส้นขอบ Card เฟส Active |
| Phase Inactive Border | `#2a2a2a` | เส้นขอบ Card เฟส Inactive |

### สีไฟสัญญาณ (Traffic Light Signal — ใช้เฉพาะวงกลมไฟในไดอะแกรม)

| สถานะ | HEX | ความหมาย |
|--------|-----|-----------|
| Green | `#22c55e` | สัญญาณไฟเขียว — ภายใน Card ที่ Active |
| Yellow | `#eab308` | สัญญาณไฟเหลือง — ช่วงเปลี่ยนเฟส |
| Red | `#ef4444` | สัญญาณไฟแดง — ภายใน Card ที่ไม่ Active |

> สรุป: **Phase card ใช้ dark green / gray** ส่วน **วงกลมไฟในไดอะแกรมใช้ green/yellow/red**

### Typography — ขนาดใหญ่ อ่านง่าย

ตัวอักษรโดยรวมใหญ่กว่าปกติ เพื่อรองรับผู้ใช้งานที่อาจมองหน้าจอจากระยะห่าง

```css
html { font-size: 20px; } /* base ใหญ่กว่าปกติ (ปกติ 16px) */

h1    { font-size: 3rem;    color: #ffffff; }  /* ชื่อเฟส / ตัวเลขใหญ่ */
h2    { font-size: 2rem;    color: #ffffff; }  /* หัวข้อ section */
h3    { font-size: 1.5rem;  color: #ffffff; }  /* หัวข้อ card */
p     { font-size: 1.25rem; color: #888888; }  /* ข้อความทั่วไป */
small { font-size: 1rem;    color: #444444; }  /* ข้อความรอง */
```

### Card

```css
.card {
  background: #141414;
  border: 1px solid #2a2a2a;
  border-radius: 16px;
  padding: 28px;
}

/* Active phase card */
.card.active {
  background: #166534;
  border-color: #16a34a;
}

/* Inactive phase card */
.card.inactive {
  background: #1f1f1f;
  border-color: #2a2a2a;
}
```

---

## Authentication

### ขั้นตอน

```
1. ผู้ใช้กรอก username / password
2. POST /auth/login  →  server ตอบกลับ { ok: true, token }
   และ set HttpOnly cookie ชื่อ "token" อัตโนมัติ
3. ทุก request ถัด ๆ ไปให้ใส่ credentials: 'include'
   browser จะส่ง cookie ให้เองโดยอัตโนมัติ
4. EventSource ใช้ withCredentials: true
```

### Login Request

```js
const res = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password }),
});
const data = await res.json();
// data = { ok: true, token: "..." }
```

### Error Responses

| HTTP | Body | สาเหตุ |
|------|------|--------|
| 400 | `{ ok: false, error: "username and password are required" }` | ไม่ได้ส่ง field |
| 401 | `{ ok: false, error: "Invalid credentials" }` | username/password ผิด |

---

## API Endpoints

### 1. `POST /auth/login` — เข้าสู่ระบบ

- **Auth:** ไม่ต้องการ
- **Body:** `{ username: string, password: string }`
- **Response:** `{ ok: true, token: string }` + ตั้ง cookie อัตโนมัติ

---

### 2. `GET /dashboard/status` — ดึงข้อมูลปัจจุบัน (Snapshot)

- **Auth:** JWT cookie (ส่งอัตโนมัติหลัง login)
- **ใช้เมื่อ:** โหลดหน้าครั้งแรก ก่อนเปิด SSE stream

```js
const res = await fetch(`${API_URL}/dashboard/status`, {
  credentials: 'include',
});
const { data } = await res.json();
```

**Response:**

```json
{
  "ok": true,
  "data": {
    "intersectionId": "INT-001",
    "currentPhase": "N_GO",
    "nextPhase": "E_GO",
    "greenTimeSec": 23,
    "phaseStartedAt": "2026-04-14T10:30:00.000Z",
    "lastDecision": {
      "strategy": "SIMPLE_CYCLE_BASED",
      "phase": "N_GO",
      "greenTimeSec": 23,
      "meta": {
        "from": "W_GO",
        "laneTotals": { "N": 10, "S": 5, "E": 8, "W": 3 },
        "chosenDir": "N",
        "actualCars": 10,
        "perCarRate": 2.0,
        "sampleCount": 5,
        "fallback": false
      }
    }
  }
}
```

---

### 3. `GET /dashboard/stream` — SSE Live Updates

- **Auth:** JWT cookie (ส่งอัตโนมัติ)
- **ใช้เมื่อ:** หลัง snapshot load แล้ว — รับ event ทุกครั้งที่มีการตัดสินใจเฟสใหม่

```js
const source = new EventSource(`${API_URL}/dashboard/stream`, {
  withCredentials: true,
});

source.onmessage = (e) => {
  const data = JSON.parse(e.data);
  setStatus(data);
};

source.onerror = () => {
  // handle disconnect / reconnect
};

// cleanup
return () => source.close();
```

> Server ส่ง event ทันทีเมื่อ connect (initial state) และส่งอีกครั้งทุกครั้งที่มี decision ใหม่

---

## ความหมายของข้อมูลแต่ละ field

| Field | ภาษาไทย | ใช้แสดงอะไร |
|-------|---------|------------|
| `currentPhase` | เฟสปัจจุบัน | ทิศที่ได้ไฟเขียวตอนนี้ เช่น `N_GO` = เหนือ |
| `nextPhase` | เฟสถัดไป | ทิศที่จะได้ไฟเขียวต่อไป |
| `greenTimeSec` | เวลาไฟเขียว (วินาที) | ระยะเวลาไฟเขียวของเฟสนี้ |
| `phaseStartedAt` | เวลาที่เริ่มเฟส | ใช้คำนวณนับถอยหลัง |
| `lastDecision.meta.laneTotals` | จำนวนรถแต่ละทิศ | `{ N, S, E, W }` = จำนวนรถที่ตรวจจับได้ |
| `lastDecision.meta.actualCars` | รถในทิศปัจจุบัน | จำนวนรถที่ใช้ในการคำนวณ |
| `lastDecision.meta.from` | เฟสก่อนหน้า | เพิ่งมาจากเฟสไหน |
| `lastDecision.meta.fallback` | `true` = ไม่มีข้อมูล | แสดงเตือนว่าไม่มีข้อมูลกล้อง |
| `lastDecision.meta.sampleCount` | จำนวน samples | ใช้กรองค่า median กี่ samples |

### การแปล Phase ID → ภาษาไทย

```js
const PHASE_LABEL = {
  N_GO: 'เหนือ',
  S_GO: 'ใต้',
  E_GO: 'ตะวันออก',
  W_GO: 'ตะวันตก',
};
```

---

## การคำนวณ Countdown Timer (Client-Side)

Server ไม่ส่ง `timeRemainingMs` — คำนวณเองใน React:

```js
const YELLOW_SEC = 3;
const ALL_RED_SEC = 2;

useEffect(() => {
  const interval = setInterval(() => {
    if (!status.phaseStartedAt || !status.greenTimeSec) return;
    const elapsed = Date.now() - new Date(status.phaseStartedAt).getTime();
    const totalMs = (status.greenTimeSec + YELLOW_SEC + ALL_RED_SEC) * 1000;
    setRemaining(Math.max(0, totalMs - elapsed));
  }, 500);
  return () => clearInterval(interval);
}, [status]);
```

---

## หน้าที่ควรมีใน Dashboard

### 1. หน้า Login
- Input username / password — ขนาดใหญ่ ชัดเจน
- ปุ่ม เข้าสู่ระบบ
- แสดง error เมื่อ credentials ผิด

### 2. หน้า Dashboard หลัก

**ส่วนที่ 1 — สถานะปัจจุบัน (Current Phase)**
- แสดงทิศที่ได้ไฟเขียว ข้อความใหญ่มาก (`h1`) พร้อม Card สีเขียวเข้ม (`#166534`)
- นับถอยหลัง (countdown) ตัวเลขใหญ่ หน่วยเป็นวินาที
- แสดงเฟสถัดไปใน Card สีเทา

**ส่วนที่ 2 — ไฟจราจร 4 ทิศ (Traffic Light Diagram)**
- แสดง N / S / E / W เป็น 4 Card เรียงกัน
- Card ที่ Active: พื้นหลัง `#166534` + border `#16a34a` + วงกลมไฟสีเขียว (`#22c55e`)
- Card ที่ไม่ Active: พื้นหลัง `#1f1f1f` + border `#2a2a2a` + วงกลมไฟสีแดง (`#ef4444`)
- แสดงจำนวนรถ (`laneTotals`) ใต้ชื่อทิศ ตัวเลขใหญ่

**ส่วนที่ 3 — เหตุผลที่ตัดสินใจ (Decision Reason)**
- รถในทิศนี้: `actualCars` คัน
- เวลาไฟเขียว: `greenTimeSec` วินาที
- สูตรที่ใช้: `3 + (perCarRate × actualCars)`
- มาจากเฟส: `from`
- แสดง warning badge ถ้า `fallback: true` — "ไม่มีข้อมูลกล้อง ใช้ค่า default"

---

## ตัวอย่าง Component Structure

```
src/
├── pages/
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── components/
│   ├── TrafficLight.jsx      — แสดง 4 ทิศ + วงกลมไฟ
│   ├── PhaseInfo.jsx         — เฟสปัจจุบัน + countdown
│   ├── LaneTotals.jsx        — จำนวนรถแต่ละทิศ
│   └── DecisionReason.jsx    — อธิบายการตัดสินใจ
├── hooks/
│   ├── useAuth.js            — login / logout state
│   ├── useDashboard.js       — fetch snapshot + SSE stream
│   └── useCountdown.js       — คำนวณ countdown จาก phaseStartedAt
└── constants/
    └── phases.js             — PHASE_LABEL map
```

---

## Environment Variable

ใน `.env` ของ React (Vite):

```env
VITE_API_URL=http://localhost:3000
```

```js
const API_URL = import.meta.env.VITE_API_URL;
```
