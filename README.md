# Bus Reservation Frontend

A Vue.js-based frontend application for a bus ticket reservation system.

---

## Overview

This project is a web application that allows users to search, book, and manage bus tickets. It includes features for both customers and staff (drivers/assistants).

---

## Key Features

### Authentication & User Management
- Login/Register with phone number verification (OTP)
- Password reset functionality
- Profile management
- Phone number change with verification

### Customer Features
- Search bus routes and trips
- View seat availability
- Book tickets
- View booking history and e-tickets
- View invoices and payment history
- Print tickets

### Staff Features (Drivers/Assistants)
- Track and update trip status
- Manage departure/arrival times
- View assigned trips

---

## Technical Stack
- **Frontend Framework:** Vue 3
- **Build Tool:** Vite
- **State Management:** Pinia
- **UI Components:**
  - Bootstrap for styling
  - FontAwesome for icons
  - Custom components

---

## Project Structure

### Key Components
- **Authentication:** Complete login/register flow with OTP verification
- **Seat Selection:** Interactive seat map for bus booking
- **Payment Processing:** Support for cash and card payments
- **Ticket Management:** Digital ticket system with printing capability
- **Route Tracking:** Real-time trip status updates for staff

---

## Development Setup

### Install dependencies:

```sh
npm install
```

### Run development server:

```sh
npm run dev
```

### Build for production:

```sh
npm run build
```

---

## Demo

### Home Page
![Home Page](public/images/UIKhach/TrangChu.png)

### Login
![Login](public/images/UIKhach/DangNhap.png)

### Register
![Register](public/images/UIKhach/DangKy.png)

### Book Ticket
![Book Ticket](public/images/UIKhach/Datve.png)

### Ticket Details
![Ticket Details](public/images/UIKhach/ChiTietVe.png)

### Enter OTP
![Enter OTP](public/images/UIKhach/NhapOTP.png)

### Phone Number to Send OTP
![Phone Number to Send OTP](public/images/UIKhach/SDTDeGuiOTP.png)

### Change Password
![Change Password](public/images/UIKhach/DoiMatKhau.png)

### Change Phone Number
![Change Phone Number](public/images/UIKhach/DoiSDT.png)

### Invoice Information
![Invoice](public/images/UIKhach/HoaDon.png)

### Payment
![Payment](public/images/UIKhach/ThanhToan.png)

### Success
![Success](public/images/UIKhach/ThanhCong.png)

### Edit Information
![Edit Information](public/images/UIKhach/SuaThongTin.png)

### Ticket
![Ticket](public/images/UIKhach/Ve.png)

### Manage Trips (Staff)
![Manage Trips](public/images/UINhanVien/Quản lý chuyến xe.png)
