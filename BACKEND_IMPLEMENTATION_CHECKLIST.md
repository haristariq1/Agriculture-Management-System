# U Devs Batch 6 Backend Assignment Checklist

Source: *Backend Development Guide – Batch 6: Node.js + Express + PostgreSQL + Sequelize + JWT* (21 pages). Status reflects implementation and commands actually run in this repository.

| # | Guide section | Requirement | Status | Evidence / limitation |
|---:|---|---|---|---|
| 1 | 1, 4–6 | Preserve React + Redux frontend and organize `frontend/`, `backend/`, root README | Complete | Original UI moved intact; API adapters replace mock APIs |
| 2 | 2, 5 | Node, Express, PostgreSQL, Sequelize and required security/upload packages | Complete | Backend dependencies installed; production audit reports zero vulnerabilities |
| 3 | 3, 7–8 | PostgreSQL configuration, `.env.example`, secret handling, connection test | Complete | `testConnection.js` passed against local PostgreSQL 16; ignored `.env` used locally |
| 4 | 6, 8 | Required config, controllers, middleware, models, routes, utils, uploads and entry files | Complete | `backend/` follows the guide’s folder layout |
| 5 | 8.3–8.5 | User, Crop, Order, Buyer, Task, Expense, Inventory, Worker, Attendance, Equipment, Maintenance and Activity models | Complete | Sequelize models include guide fields, ENUMs, validation, UUID IDs and timestamps; optional buyer unit price retained for existing sales analytics |
| 6 | 8.6 | Required model relationships and deletion rules | Complete | Associations in `models/associations.js`; restrictive buyer crop deletion, cascading orders/attendance/services |
| 7 | 8.7–8.10 | Registration, login, logout, JWT verification, bcrypt hashing, profile and user CRUD | Complete | Signup/login/me and Admin user CRUD exercised in integration tests |
| 8 | 8.7, 9, 11 | Admin full access; Manager view/add; backend returns 403 for Manager edits/deletes | Complete | Integration tests verify Manager restrictions and Admin writes |
| 9 | 8.11–8.13, 11 | Complete CRUD endpoints for crops, orders, tasks, expenses, inventory, workers, attendance, equipment and maintenance | Complete | Create/read/update/delete paths exercised in backend integration suite; auth enforced per route |
| 10 | 8.13 | Buyer CRUD, name/CNIC validation, duplicate CNIC, photo upload and crop stock check | Complete | Tests cover create/update/delete, duplicate CNIC, overselling, unsupported MIME and >1 MB image |
| 11 | 8.8 | JPG/PNG only, maximum 1 MB, persistent server file and image URL | Complete | Multer disk storage under `backend/public/Images`; static `/images` route and CORS image policy |
| 12 | 8.12–8.13 | Activity records use authenticated username, add/edit/delete, entity, ID and timestamp | Complete | Controllers log events; integration test reads audit rows and checks actor/action/entity |
| 13 | 8.5, 8.12 | Attendance statuses, duplicate worker/date prevention and monthly wage formula | Complete | Unique database index; Present=1, Half-day=0.5, Absent/Leave=0; integration test checks 1.5 × daily wage |
| 14 | 8.5, 8.12 | Pay Wages creates one Labour expense and locks paid attendance | Complete | API calculates from saved attendance, prevents repeat payments, and rejects later attendance edits |
| 15 | 8.5, 8.13 | Maintenance CRUD creates/updates/removes one linked Repair/Fuel expense | Complete | Service transaction synchronizes expense and equipment’s last-service date; tested no duplicate expense and date restoration |
| 16 | 8.5, 8.12 | Inventory usage decrements quantity and records user/date/history | Complete | `POST /api/inventory/:id/usage` is transactionally tested |
| 17 | 8.12, 9 | Overdue task status and service scheduling | Complete | Task reads mark past Pending tasks Overdue; service due date is derived in existing Redux selectors |
| 18 | 8.14–8.15 | Express security, CORS, rate limiting, JSON handling, static images, health, DB sync and seed script | Complete | Server started on port 5001 (local port 5000 occupied); live `/api/health` returned 200; seed completed |
| 19 | 10 | Axios base URL, JWT request header, expired-session handling and backend error messages | Complete | Shared Axios client reads `agri_session`, normalizes API errors, and clears/redirects on 401 |
| 20 | 10 | Existing Redux actions/reducers and request/success/failure flow remain compatible | Complete | Existing async thunks/reducers retained; adapters normalize login/user response shapes |
| 21 | 10 | Signup route/form and role-aware UI actions | Complete | Manager signup form/route added; Admin-only edit/delete controls remain role-gated |
| 22 | 10 | Buyer photo URL works in existing UI | Complete | Forms send multipart `photo`; table/details build image URL from API base |
| 23 | 10 | Redux selectors still derive dashboard/report metrics from API-loaded state | Complete | Existing dashboard selectors retained; payroll selector now recognizes database-linked wage expenses |
| 24 | 10 | Browser localStorage retains auth session after refresh without storing application records | Complete | Persistence middleware stores only session and theme; startup rehydrates token session; records load from PostgreSQL |
| 25 | 11 | Monthly reports, CSV/PDF export and activity read endpoint | Complete | Existing report/CSV/print UI retained; `GET /api/activity` implemented. PDF export uses browser print/save dialog |
| 26 | 12 | Automated API, permission, validation, linked expense and PostgreSQL checks | Complete | `backend/npm test`: one integration workflow passed with assertions across all resources; `npm run test:db` passed |
| 27 | 12 | Frontend tests, lint and production build | Complete | Frontend `npm test`: 12 passed; `npm run lint` passed; `npm run build` passed |
| 28 | 12 | Dependency audit | Complete | Frontend and backend `npm audit`: zero vulnerabilities after updates/overrides |
| 29 | 13 | README setup, database instructions, API reference, demo credentials, state tree and data flow | Complete | Root `README.md`; includes existing dashboard screenshot and developer/Batch 6 information |
| 30 | 13 | `.gitignore` protects `.env`, dependencies, build output and uploaded photos | Complete | Root and backend ignore files; verified local env files and dependencies are ignored |
| 31 | 13 | Git develop/merge workflow and GitHub readiness | Partial | Remote exists; changes are local only. No push or external submission performed |
| 32 | — | Full interactive browser/device regression and console inspection | Partial | Live frontend serves HTTP 200 and production build passes; no automated browser/device suite is configured. Responsive CSS remains from the existing UI |

## Test commands and outcomes

- `backend/npm run test:db` — PostgreSQL connection passed.
- `backend/npm run seed` — seed completed with documented demo Admin/Manager accounts and sample crops, worker, equipment, inventory and task.
- `backend/npm test` — passed against PostgreSQL; HTTP tests include signup/login, user CRUD/permissions, crop/order/buyer/task/expense/inventory/worker/attendance/equipment/maintenance flows, buyer image/stock validation, duplicate attendance, wage calculation/expense link, maintenance expense link/date restoration, task overdue and activity attribution.
- `frontend/npm test` — 12 passed. Twenty old localStorage-mock scenarios remain explicitly skipped because that API was replaced by PostgreSQL; their active API equivalents are exercised by the backend integration suite.
- `frontend/npm run lint` — passed.
- `frontend/npm run build` — passed. Vite reports the pre-existing large JavaScript chunk warning; the build completes successfully.
- `npm audit` in both apps — zero vulnerabilities.
- Live server smoke checks — backend `/api/health` returned HTTP 200 and Vite `/` returned HTTP 200.

No GitHub push or email submission has been made.
