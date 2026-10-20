# Easily — Find Your Dream Job

A complete Express + EJS MVC job portal project built from scratch for learning and local evaluation.

## Features
- Responsive landing page and job listings UI
- Registration and login with hashed passwords (`bcryptjs`)
- Session-based authentication and recruiter/job-seeker authorization
- Recruiter dashboard; create, edit, delete job postings
- Job search and pagination
- Job seeker applications and duplicate-application prevention
- Resume upload (PDF/DOC/DOCX, max 5 MB) stored outside the public static directory
- Recruiter-only applicant view, protected resume download, application status updates
- Last-visit cookie
- Optional confirmation email through SMTP environment variables
- MVC-style models, controllers, routes, middleware, and EJS views

## Setup
1. Install Node.js (18 or newer recommended).
2. Open this folder in VS Code.
3. In the terminal run:
   ```bash
   npm install
   npm run dev
   ```
4. Open `http://localhost:3000`.

## Try it
- Create an account as a **Recruiter**, log in, then post a job from the dashboard.
- Create another account as a **Job seeker**, browse the job and apply with a PDF/DOC/DOCX resume.
- Log back in as the recruiter to review applicants and change their status.

## Email confirmation (optional)
Copy `.env.example` to `.env` and fill in your SMTP values. The project loads `.env` automatically via `dotenv`. The application remains usable without SMTP and displays a clear on-screen confirmation.

## Notes
- The project uses in-memory arrays for users, jobs, and applications, as is common for starter projects. Data resets when the server restarts.
- The default session secret is for local development only. Set `SESSION_SECRET` before deployment.
- Uploaded resumes are private: they are not served by `express.static`; download access is checked against the owning job's recruiter.
