# Task Management System

A simple, robust, and modern CRUD Task Management web application built with **Laravel 13**, **Inertia.js v3**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## ⚡ How to Run It

### Prerequisites
- **PHP** >= 8.3 with extensions (`pdo_sqlite` or `pdo_mysql`, `mbstring`, `openssl`, etc.)
- **Composer**
- **Node.js** >= 18.x & **npm**

### Step-by-Step Setup

1. **Clone the repository & enter directory**:
   ```bash
   git clone <repository-url>
   cd TaskManagement
   ```

2. **Install dependencies**:
   ```bash
   composer install
   npm install
   ```

3. **Configure environment & application key**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run database migrations**:
   ```bash
   php artisan migrate
   ```

5. **Start the development servers**:
   - Backend: `php artisan serve`
   - Frontend: `npm run dev`

6. **Access the Application**:
   Open [http://localhost:8000](http://localhost:8000) in your browser. Register or log in to access the Tasks module at `/tasks`.

7. **Run automated tests**:
   ```bash
   php artisan test --compact
   ```

---
