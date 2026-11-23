# FixMate — Smart Device & Home Appliance Repair Service Platform

FixMate is a full-stack repair service platform that connects customers with technicians for smart device and home appliance repair services.

Customers can explore repair services, book technicians, track booking status, and make secure payments through Stripe. Technicians can manage their services and customer bookings.

## Live Website

- **Frontend:** https://fixmate-gules-three.vercel.app
- **Backend API:** https://fixmate-server-navy.vercel.app

## Admin & Test Credentials

> Replace the placeholders below with your live seeded accounts before final submission.

- **Admin Email:** `<your-admin-email>`
- **Admin Password:** `<your-admin-password>`
- **Technician Account:** `<technician-email>` / `<technician-password>`
- **Customer Account:** `<customer-email>` / `<customer-password>`

## GitHub Repositories

- **Frontend:** https://github.com/swagatamondalahona/fixmate
- **Backend:** https://github.com/swagatamondalahona/fixmate-server

## Technologies & npm Packages Used

### Frontend (`fixmate`)
- `next` (`16.4.6`) — React App Router framework
- `react` & `react-dom` (`19.3.0`) — UI library
- `better-auth` (`^1.7.26`) & `@better-auth/mongo-adapter` (`^1.7.26`) — Authentication, sessions & JWT
- `mongodb` (`^7.9.0`) — Database driver for BetterAuth adapter
- `sonner` — Toast notifications across auth, CRUD, bookings & payments
- `tailwindcss` (`4.3.3`) & `@tailwindcss/turbopack` — Responsive styling with dark/light theme support
- `typescript` (`^5`) & `eslint` (`^9`) — Type safety and linting

### Backend (`fixmate-server`)
- `express` (`^5.3.0`) — REST API server & role-based middlewares
- `mongodb` (`^7.9.0`) — Database operations (4 collections: `users`, `services`, `bookings`, `payments`)
- `stripe` (`^23.2.0`) — Stripe Checkout (USD test mode) & webhook integration

## Main Features

### Authentication & Authorization
- Customer and Technician registration
- Secure login and authentication
- Role-based access control
- Protected dashboard routes

### Customer Features
- Browse approved repair services
- Search and filter services
- Book repair services
- View booking history
- Track booking status
- Pay for completed services
- View payment history

### Technician Features
- Create and manage repair services
- Manage customer bookings
- Accept or reject booking requests
- Update repair progress
- Mark repairs as completed

### Payment Features
- Stripe Checkout integration
- Server-side payment verification
- Payment history
- Duplicate payment protection
- Stripe webhook endpoint

## Project Structure

```text
fixmate/
├── public/
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   └── ...
├── .env.local
├── package.json
└── README.md
```

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/swagatamondalahona/fixmate.git
cd fixmate
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Use the deployed backend URL when connecting to the live backend:

```env
NEXT_PUBLIC_API_URL=https://fixmate-server-navy.vercel.app
```

Add any other required authentication or application environment variables according to your project configuration.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Repository

The backend source code and setup instructions are available here:

https://github.com/swagatamondalahona/fixmate-server

## Deployment

The frontend is deployed on Vercel.

Live URL: https://fixmate-gules-three.vercel.app

## Author

**Swagata Mondal**

Diploma in Computer Engineering Student

GitHub: https://github.com/swagatamondalahona

---

Made with ❤️ for FixMate.
