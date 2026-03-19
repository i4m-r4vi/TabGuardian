# 💊 Tablet Reminder App with Proof & Email Alert

## 🚀 Overview
Build a full-stack web application using **Next.js (frontend)**, **Node.js + Express (backend)**, and **MongoDB (database)**.

The app reminds users to take tablets and requires them to upload a **photo as proof**.  
If the user does not upload proof within a defined time, an **email alert is sent to a parent/guardian**.

---

## 🎯 Core Functionality
- Schedule tablet reminders
- Upload photo proof after taking medicine
- Detect missed doses
- Send email alert if proof is not uploaded

---

## 👤 User Features
- User registration & login (JWT authentication)
- Add tablet schedules:
  - Tablet name
  - Time (e.g., 9:45 AM)
  - Frequency (daily or custom days)
- Upload proof image
- View history of taken/missed doses

---

## ⏰ Reminder System
- Trigger reminders at scheduled times
- Show notifications in frontend
- Allow a **grace period (15–30 minutes)** for proof upload

---

## 📸 Proof System
- Upload image from frontend
- Store images using:
  - Cloud storage (Cloudinary)
- Save image URL and timestamp in database

---

## 🚨 Missed Dose Logic
- If proof is not uploaded within grace period:
  - Mark dose as **missed**
  - Trigger email alert

---

## 📧 Email Notification
- Use **Nodemailer**
- Send email to parent/guardian
- Email content:
  - User name
  - Tablet name
  - Scheduled time
  - Message indicating missed dose

---

## 🛠️ Tech Stack

### Frontend
- Next.js (React)
- Tailwind CSS
- Axios
- Image upload UI
- Notification system

### Backend
- Node.js
- Express.js
- JWT authentication
- Multer (file upload)
- Nodemailer (email)
- node-cron (background jobs)

### Database
- MongoDB

---

## 🗂️ Database Collections

### Users
- name
- email
- password (hashed)
- parentEmail

### Tablets
- userId
- tabletName
- scheduleTime
- frequency

### Logs
- userId
- tabletId
- status (taken / missed)
- imageUrl
- timestamp

---

## 🔄 API Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Tablets
- `POST /tablet/add`
- `GET /tablet/list`

### Proof
- `POST /tablet/upload-proof`

### Logs
- `GET /logs`

---

## ⏱️ Background Jobs
Use **node-cron**:
- Runs every minute
- Checks for missed schedules
- Sends email alerts if needed

---

## 🔐 Security
- Hash passwords using bcrypt
- Use JWT for authentication
- Protect private routes
- Validate inputs

---

## 🎨 UI Pages
- Login / Register
- Dashboard (today’s tablets)
- Upload proof page
- History page

---

## 💡 Optional Features
- Push notifications
- Mobile responsive design
- WhatsApp alerts
- AI face verification for proof

---

## ⚙️ Environment Variables
- `MONGO_URI`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`

---

## 📦 Deliverables
- Complete frontend and backend
- Clean folder structure
- Setup instructions in README

---

## 📁 Suggested Folder Structure


root/
│
├── client/ (Next.js)
│ ├── app/
│ ├── components/
│ └── utils/
│
├── server/ (Node.js + Express)
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ └── cron/
│
└── README.md


---

## ✅ Summary
This app ensures accountability in taking medicines by:
- Reminding users
- Requiring proof
- Alerting guardians if missed