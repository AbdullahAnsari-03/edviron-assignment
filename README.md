# 🏫 Edviron School-Payments Portal  
> Full-stack MERN assignment – NestJS REST API + React dashboard with live payment gateway integration.

---

## 🔗 Quick Links
|  | URL |
|---|---|
| **Front-End** | https://edviron-assignment-lemon.vercel.app |
| **Back-End** | https://edviron-backend-365u.onrender.com |

---

## 🧩 Tech Stack
| Layer | Tech |
|---|---|
| **Back-End** | NestJS, MongoDB Atlas, JWT, class-validator |
| **Front-End** | React 18 + Vite, TypeScript, Tailwind CSS, React-Router v6 |
| **Payment GW** | Edviron Collect-Request API (JWT signed) |
| **Hosting** | Render (BE) + Vercel (FE) |
| **CI / CD** | Auto-deploy on `git push` |

---

## ✨ Implemented Features (Assignment Checklist ✅)

### Back-End – NestJS micro-service
| Requirement | Status | Endpoint |
|-------------|--------|----------|
| JWT auth (login / register) | ✅ | `POST /auth/login` `POST /auth/register` |
| Create signed payment link | ✅ | `POST /payments/create-payment` |
| Redirect user to payment page | ✅ | returns `collect_request_url` |
| Webhook endpoint | ✅ | `POST /payments/webhook` |
| Fetch **all** transactions (paginated, sortable) | ✅ | `GET /payments/transactions` |
| Fetch by school | ✅ | `GET /payments/transactions/school/:id` |
| Check status by custom-order-id | ✅ | `GET /payments/transaction-status/:id` |
| Mongo aggregation pipeline join | ✅ | between `Order` & `OrderStatus` |
| Pagination & sorting | ✅ | `?page=1&limit=10&sort=payment_time&order=desc` |
| Validation & error handling | ✅ | class-validator + global filters |
| Security best practices | ✅ | CORS, helmet, env secrets, HTTPS |

### Front-End – React Dashboard
| Requirement | Status | Route |
|-------------|--------|-------|
| Responsive layout (Tailwind) | ✅ | all pages |
| Dark-mode toggle | ✅ | persists in localStorage |
| All-transactions table | ✅ | `/dashboard` |
| Search & filters (status, school, date) | ✅ | UI + URL persistence |
| Column sorting (asc/desc) | ✅ | click headers |
| Pagination controls | ✅ | server-side |
| School-specific view | ✅ | `/school/:schoolId` |
| Status-check modal | ✅ | `/dashboard` (modal) |
| Hover effects on table | ✅ | see video reference |
| Hosted & auto-deploy | ✅ | Vercel |

---

## 📦 Installation (local dev)

### 1. Clone
```bash
git clone https://github.com/AbdullahAnsari-03/edviron-assignment.git
cd edviron-assignment
```

### 2. Back-End
```bash
cd backend
npm install
# create .env (see sample below)
npm run start:dev
```
Nest runs on http://localhost:3000

### 3. Front-End
```bash
cd frontend
npm install
# create .env.production (see sample below)
npm run dev
```
Vite runs on http://localhost:5173

---

## 🔐 Sample Environment Files

### backend/.env
```bash
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.lzayo1d.mongodb.net/school-payments?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret
PG_KEY=edvtest01
PAYMENT_API_KEY=your_api_key
CALLBACK_URL=https://edviron-assignment-lemon.vercel.app/payment-callback
```

### frontend/.env.production
```bash
VITE_API_URL=https://edviron-backend-365u.onrender.com
```

---

## 🔌 API Highlights

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | JWT login |
| `POST` | `/payments/create-payment` | Create signed collect-request |
| `GET`  | `/payments/transactions` | All transactions (paginated, sortable) |
| `GET`  | `/payments/transactions/school/:id` | Filter by school |
| `GET`  | `/payments/transaction-status/:customOrderId` | Live status |
| `POST` | `/payments/webhook` | Idempotent webhook handler |

Sure — replace the Mermaid diagram with a clean, expandable folder-tree that matches your repo exactly.

Swap this block into the README where the Mermaid section was:

---

## 📁 Project Tree
```
edviron-assignment/
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── dto/
│   │   ├── payments/
│   │   │   ├── payments.controller.ts
│   │   │   ├── payments.service.ts
│   │   │   └── dto/
│   │   ├── schemas/
│   │   │   ├── order.schema.ts
│   │   │   ├── order-status.schema.ts
│   │   │   └── user.schema.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/
│   ├── .env
│   ├── .env.example
│   ├── nest-cli.json
│   ├── tsconfig.json
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── SchoolTransactions.tsx
│   │   │   └── CreatePayment.tsx
|   |   |   └── Login.tsx
│   │   │   └── TransactionStatus.tsx
│   │   │   └── PaymentCallback.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── .env.production
│   ├── vercel.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── package.json
├── README.md
└── LICENSE
```
---

## 🧪 Test Credentials (Edviron Sandbox)
| Key | Value |
|-----|-------|
| school_id | `65b0e6293e9f76a9694d84b4` |
| PG key | `edvtest01` |
| API key | your_api_key |

---

## 📝 License
MIT © Abdullah Ansari

---

> Made with ❤️ for Edviron Software Developer Assessment.
