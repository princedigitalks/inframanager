# Quick Setup Guide

## Problem Fixed
The 404 error was happening because:
1. User creation requires authentication (JWT token)
2. No login functionality was implemented

## Solution
Added complete authentication flow with Redux state management.

## Steps to Use:

### 1. Start Backend Server
```bash
cd new-crm-back
npm start
```
Backend will run on: http://localhost:3000

### 2. Create First Admin User (One-time setup)
You need to create an admin user directly in MongoDB or temporarily remove auth middleware from POST /user route.

**Option A - Using MongoDB Compass/Shell:**
```javascript
db.users.insertOne({
  name: "Admin",
  email: "admin@test.com",
  password: "ENCRYPTED_PASSWORD", // Use your crypto.js to encrypt
  role: "admin",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Option B - Temporarily remove auth (Quick Test):**
In `new-crm-back/routes/user.js`, change:
```javascript
router.post("/", auth, userController.createUser);
```
To:
```javascript
router.post("/", userController.createUser); // Remove auth temporarily
```

### 3. Start Frontend
```bash
cd inframanager
npm run dev
```
Frontend will run on: http://localhost:3001

### 4. Login
1. Go to: http://localhost:3001/login
2. Enter credentials
3. After login, you'll be redirected to /users
4. Now you can create/edit/delete users

## Test Credentials (if you created admin user)
- Email: admin@test.com
- Password: (whatever you set)

## API Endpoints
- Base URL: http://localhost:3000/v1/api
- Login: POST /user/login
- Create User: POST /user (requires auth)
- Get Users: GET /user (requires auth)
- Update User: PUT /user/:id (requires auth)
- Delete User: DELETE /user/:id (requires auth)
- Update Status: PATCH /user/:id/status (requires auth)
