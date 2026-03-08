# Catchy Shop - E-Commerce Fashion Platform

This repository contains the Catchy Shop E-Commerce platform with a complete, production-ready Authentication and User Management system built on the MERN stack.

## 🚀 Features Implemented
- **Comprehensive Auth**: Email/Password, Mobile OTP, Google OAuth, Facebook OAuth.
- **Security**: HttpOnly Cookies for Refresh Tokens, Rate Limiting, Helmet.js Headers, CSRF protection.
- **User Dashboard**: Profile management, Address book, Security controls.
- **UI/UX**: Beautiful framer-motion powered Modal, responsive layouts, realtime password strength indicators.

---

## 🛠️ Environment Variables Configuration
Create a `.env` file in the `/backend` directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/catchy-shop

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=15m
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRE=30d

# OAuth Credentials (Get these from Google Cloud Console & Facebook Developers)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Email Service (Nodemailer / SMTP)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=your_smtp_user
SMTP_PASSWORD=your_smtp_password
FROM_NAME="Catchy Shop"
FROM_EMAIL=noreply@catchyshop.com

# Twilio (For OTP SMS - Optional if Mocking)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone
```

Create a `.env` file in the `/frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Postman API Testing Instructions

### 1. Register a new user
**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/register`  
**Body (JSON):**  
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "Password123!"
}
```
**Expected Result:** `201 Created` with an Access Token. A Refresh Token is automatically set via an `HttpOnly` Cookie.

### 2. Login User
**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/login`  
**Body (JSON):**  
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```
**Expected Result:** `200 OK` with User profile and Access Token.

### 3. Send Mobile OTP
**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/send-otp`  
**Body (JSON):**  
```json
{
  "phone": "9876543210"
}
```
**Expected Result:** `200 OK`. Check the server console for the generated OTP (or SMS if configured).

### 4. Verify Mobile OTP
**Method:** `POST`  
**URL:** `http://localhost:5000/api/auth/verify-otp`  
**Body (JSON):**  
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```
**Expected Result:** `200 OK` and Access Token.

### 5. Protected User Routes
Always include the Access Token in your Headers for protected routes:
**Header:** `Authorization: Bearer <your_access_token>`

Testing the Profile endpoint:
**Method:** `GET`  
**URL:** `http://localhost:5000/api/user/profile`  
**Expected Result:** `200 OK` with full profile data, hiding passwords and tokens.

---

## 🏃‍♂️ How to Run

1. Start Backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Start Frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Visit `http://localhost:5173` to experience the beautiful new Auth system!
# Catchy-Shop
