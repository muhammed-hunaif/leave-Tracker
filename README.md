# Leave Tracker

A modern leave management system built with React, Vite, and Node.js for managing employee leave requests, approvals, and records.

## GitHub Repository

- GitHub: https://github.com/muhammed-hunaif/leave-Tracker

## Overview

Leave Tracker is a full-stack web application that helps organizations manage employee leave efficiently. It supports separate admin and employee roles, enabling employees to submit leave requests and admins to review, approve, or reject them.

## Features

- Employee authentication and registration
- Admin dashboard for managing employees and leave requests
- Employee dashboard for applying and tracking leave
- Leave history with status tracking
- Leave approval and rejection workflow
- Employee profile and management views
- Responsive UI for desktop and tablet use

## Tech Stack

- Frontend: React, Vite, React Router
- State Management: Redux Toolkit
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Authentication: JWT and bcryptjs
- HTTP Client: Axios

## Project Structure

```bash
leave-Tracker/
├── src/
│   ├── Components/
│   ├── Layouts/
│   ├── Pages/
│   ├── api/
│   ├── context/
│   ├── App.jsx
│   └── main.jsx
├── package.json
├── vite.config.js
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- MongoDB instance or MongoDB Atlas connection

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/muhammed-hunaif/leave-Tracker.git
   cd leave-Tracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure environment variables
   Create a `.env` file in the root directory and add your MongoDB connection string and JWT secret if required.

4. Run the application
   ```bash
   npm run dev
   ```

5. Build for production
   ```bash
   npm run build
   ```

## Usage

- Admin users can create employee profiles, view leave requests, and approve or reject applications.
- Employees can sign up or log in, apply for leave, and track the status of their requests.

## License

This project is currently unlicensed unless otherwise specified by the repository owner.

## Contact

For questions or contributions, visit the GitHub repository:
https://github.com/muhammed-hunaif/leave-Tracker

