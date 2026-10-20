# Easily — Job Portal

A full-stack job portal web application built with Node.js, Express.js, and EJS. Easily connects recruiters and job seekers through job posting, job searching, and application management features.

## 🌐 Live Demo

**Live Website:** https://easily-job-portal-wh2u.onrender.com

**GitHub Repository:** https://github.com/sarucodeeng1-lgtm/Easily-Job-Portal

## ✨ Features

- User registration and login
- Password hashing for secure password storage
- Role-based access for recruiters and job seekers
- Recruiter dashboard for managing job postings
- Create, edit, and delete job listings
- Search and paginate job listings
- Apply for jobs and prevent duplicate applications
- Upload resumes in PDF, DOC, and DOCX formats
- Recruiter access to applicants and application status updates
- Session-based authentication
- Last-visit cookie functionality
- Optional application confirmation emails through SMTP
- Responsive user interface

## 🛠️ Tech Stack

**Backend**
- Node.js
- Express.js

**Frontend**
- EJS
- HTML
- CSS
- JavaScript

**Authentication and Utilities**
- bcryptjs
- express-session
- cookie-parser
- Multer
- Nodemailer
- dotenv

## 📁 Project Structure

```text
Easily-Job-Portal/
├── controllers/
├── middleware/
├── models/
├── public/
│   └── css/
├── routes/
├── services/
├── uploads/
├── views/
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### Prerequisites

- Node.js 18 or newer
- npm

### 1. Clone the repository

```bash
git clone https://github.com/sarucodeeng1-lgtm/Easily-Job-Portal.git
```

### 2. Open the project directory

```bash
cd Easily-Job-Portal
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file using `.env.example` as a reference.

Configure a strong session secret:

```env
PORT=3000
SESSION_SECRET=your-unique-random-secret
```

SMTP variables are optional and are only needed if you want to enable confirmation emails.

**Never commit your `.env` file or expose secret credentials.**

### 5. Start the application

```bash
npm start
```

For development:

```bash
npm run dev
```

Open the application at:

http://localhost:3000

## 🧪 How to Test

1. Register an account as a recruiter.
2. Log in and create a job posting.
3. Register another account as a job seeker.
4. Browse the available jobs and submit an application with a resume.
5. Log in as the recruiter to review applicants and update application statuses.

## 📌 Project Notes

- The application currently uses in-memory arrays for users, jobs, and applications. Data resets when the server restarts.
- SMTP email confirmation is optional.
- Resume downloads are protected by application authorization checks.
- The deployed application uses Render.

## 👩‍💻 Author

**Sarika Sindhu**

GitHub: https://github.com/sarucodeeng1-lgtm

---

If you find this project useful, feel free to explore the repository!
