# TIA Employee Management Portal

A modern, enterprise-grade Employee Management System designed for TIA Software Solutions. This application provides a comprehensive suite of tools for employees, managers, HR staff, and administrators to streamline daily operations, track performance, and manage human resources.

## 🌟 Key Features

* **Secure Authentication:** Role-based access control (Admin, HR, Manager, Employee) powered by Supabase.
* **Interactive Dashboard:** Personalized overview of attendance, pending tasks, leave balances, and company announcements.
* **Attendance Tracking:** Daily check-in/check-out functionality with historical records and worked hours calculation.
* **Leave Management:** Request time off, track balances across different leave types, and review approval workflows.
* **Task & Project Management:** Kanban-style task boards, project progress tracking, and priority management.
* **Payroll & Timesheets:** View monthly payslips, track billable hours, and manage expense reimbursements.
* **Company Communication:** Centralized announcements, department notifications, and event calendars.
* **Admin Controls:** Comprehensive user management, department configuration, and system audit logs.

## 🛠️ Tech Stack

* **Frontend:** React 19, Vite, React Router DOM
* **Styling:** Custom CSS with modern glassmorphic UI design, Lucide React icons
* **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Auth)
* **Deployment:** Pre-configured for Netlify and Vercel

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* A [Supabase](https://supabase.com) account and project

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vasikaran46/TIA-Employee-Website.git
   cd TIA-Employee-Website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the Database:**
   Run the SQL scripts provided in `supabase-schema.sql` within your Supabase project's SQL Editor to create the necessary tables, policies, and seed data.

5. **Start the development server:**
   ```bash
   npm run dev
   ```

## 📦 Deployment

The project includes configuration files for seamless deployment to modern hosting platforms.

### Vercel
The repository includes a `vercel.json` file for SPA routing. Simply import the project into Vercel and ensure you add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` environment variables in the Vercel dashboard.

### Netlify
The repository includes a `netlify.toml` and `public/_redirects` file for SPA fallback. Import the project into Netlify and add the required environment variables in the site settings.

## 🎨 Design Philosophy

The portal features a "modern, corporate, and production-ready" aesthetic, drawing inspiration from the TIA Software Solutions brand. It utilizes a sophisticated dark mode interface with glassmorphism effects, smooth micro-animations, and a highly responsive grid layout to ensure optimal user experience across all devices.
