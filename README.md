# 🏀 NBA Kèo Bot System

Hệ thống full-stack quản lý và tracking kèo NBA gồm:
- **Backend**: Express + MongoDB — API + cron job auto-gửi kèo
- **Bot**: Discord.js — commands `!verify`, `!keo`, `!stats`
- **Frontend**: React Dashboard — thêm kèo, tracking winrate/ROI

---

## 🚀 Khởi động nhanh

### 1. Tạo file `.env` từ template
```bash
copy .env.example .env
```
Điền vào `.env`:
- `DISCORD_TOKEN` — Bot token từ Discord Developer Portal
- `KEO_CHANNEL_ID` — ID channel muốn gửi kèo tự động

### 2. Khởi động MongoDB (Docker)
```bash
docker compose up -d
```
> Mongo Express UI: http://localhost:8081 (admin / admin123)

### 3. Cài dependencies & chạy Backend
```bash
cd backend
npm install
npm run dev
```
> API: http://localhost:3000

### 4. Chạy Discord Bot
```bash
cd bot
npm install
npm run dev
```

### 5. Chạy Dashboard
```bash
cd frontend
npm run dev
```
> Dashboard: http://localhost:5173

---

## 🤖 Discord Commands

| Command | Mô tả |
|---------|-------|
| `!verify 21/06/2004` | Xác minh thành viên, gán role Verified |
| `!keo` | Xem kèo đang pending |
| `!keo all` | Xem tất cả kèo (50 mới nhất) |
| `!keo send` | Gửi tất cả kèo pending lên channel ngay |
| `!stats` | Xem winrate, ROI, profit tổng |

---

## 🔌 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/health` | Health check |
| GET | `/api/bets` | Lấy danh sách kèo (filter: `?status=pending`) |
| POST | `/api/bets` | Thêm kèo mới |
| PATCH | `/api/bets/:id/status` | Cập nhật kết quả (win/lose/void...) |
| DELETE | `/api/bets/:id` | Xoá kèo |
| GET | `/api/bets/stats` | Winrate, ROI, Profit tổng |

---

## 📊 Trạng thái kèo

| Status | Ý nghĩa | Profit |
|--------|---------|--------|
| `pending` | Đang chờ | — |
| `win` | Thắng full | `stake × (odds - 1)` |
| `lose` | Thua full | `-stake` |
| `half_win` | Thắng nửa | `stake × (odds-1) / 2` |
| `half_lose` | Thua nửa | `-stake / 2` |
| `void` | Huỷ kèo | `0` |

---

## 🏗️ Cấu trúc project

```
verify_discord_bot/
├── docker-compose.yml   # MongoDB + Mongo Express
├── .env.example         # Template biến môi trường
├── backend/
│   ├── app.js           # Express entry point
│   ├── models/Bet.js    # MongoDB schema
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   └── services/        # Cron + Discord notifier
├── bot/
│   ├── index.js         # Bot entry point
│   └── commands/        # !verify, !keo, !stats
└── frontend/
    └── src/
        ├── pages/        # Dashboard, BetsPage
        └── components/   # AddBetModal
```
