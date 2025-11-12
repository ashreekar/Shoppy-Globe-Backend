# 🛒 ShoppyGlobe Backend

Backend API for **ShoppyGlobe**, a multi-vendor e-commerce application built using **Node.js**, **Express.js**, and **MongoDB**.  
This project handles authentication, product management, cart operations, vendor management, checkout, and order processing with proper error handling and validations.

#GitHub link:
[https://github.com/ashreekar/Shoppy-Globe-Backend](https://github.com/ashreekar/Shoppy-Globe-Backend)
---

## 🚀 Features

✅ **Authentication & Authorization**
- JWT-based login and registration for both Users and Vendors  
- Secure cookie-based access and refresh tokens  
- Protected routes using middleware (`verifyJwt`, `verifyVendor`)

✅ **Product Management**
- Vendors can add, update, and delete products  
- Products can include images, thumbnails, and detailed information  
- Users can view products and post reviews

✅ **Cart Management**
- Add, update, or delete items from cart  
- Retrieve full cart with product details  
- Only accessible to authenticated users

✅ **Checkout & Orders**
- Checkout splits orders by vendor automatically  
- Total price calculation for each vendor  
- Vendors can view orders placed for their products

✅ **Reviews**
- Authenticated users can add reviews for products

✅ **Error Handling**
- Centralized error handler using `APIerror`, `APIresponse`, and `asyncHandler`  
- Comprehensive validation for inputs

✅ **File Upload**
- Image uploads handled by `multer` middleware  
- Static files served from `/public`

---

## 🏗️ Tech Stack

| Layer | Technology |
|--------|-------------|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT + Cookies |
| **File Uploads** | Multer |
| **Validation** | Custom middlewares |
| **Testing** | ThunderClient / Postman |

---

## 📁 Folder Structure

```

Shoppy-Globe-Backend/
│
├── controller/
│   ├── user.controller.js
│   ├── vendor.controller.js
│   ├── product.controller.js
│   ├── cart.controller.js
│   ├── checkout.controller.js
│   └── review.controller.js
│
├── middleware/
│   ├── AsyncHandler.js
│   ├── APIError.js
│   ├── APIResponse.js
│   ├── verifyJWT.js
│   ├── verifyVendor.js
│   ├── verifyUsercontrols.js
│   └── error.middleware.js
│
├── models/
│   ├── user.model.js
│   ├── vendor.model.js
│   ├── product.model.js
│   ├── cart.model.js
│   ├── checkout.model.js
│   └── review.model.js
│
├── routes/
│   ├── user.route.js
│   ├── vendor.route.js
│   ├── product.route.js
│   ├── cart.route.js
│   └── checkout.route.js
│
├── utils/
│   ├── APIError.js
│   ├── APIResponse.js
│   └── AsyncHandler.js
│
├── public/                 # Static uploads (thumbnails, product images)
├── .env                    # Environment variables
├── app.js                  # Express app configuration
├── server.js               # Server start file
└── README.md

````

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3317
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/shoppyglobe
ACCESS_TOKEN_SECRET=<your-secret-key>
REFRESH_TOKEN_SECRET=<your-refresh-secret>
CORS_ORIGIN=http://localhost:3000
REFRESH_TOCKEN_EXPIRY=<your-expiry-val>
ACCESS_TOCKEN_EXPIRY=<your-expiry-val>
````

---

## 🧩 API Routes Overview

### 👤 User Routes (`/api/v1/user`)

| Method | Endpoint    | Description                  |
| ------ | ----------- | ---------------------------- |
| POST   | `/register` | Register new user            |
| POST   | `/login`    | Login user and return tokens |
| POST   | `/logout`   | Logout authenticated user    |

---

### 🏪 Vendor Routes (`/api/v1/vendor`)

| Method | Endpoint    | Description               |
| ------ | ----------- | ------------------------- |
| POST   | `/register` | Register new vendor       |
| POST   | `/login`    | Vendor login              |
| POST   | `/logout`   | Vendor logout             |
| GET    | `/orders`   | Get all orders for vendor |

---

### 🛍️ Product Routes (`/api/v1/products`)

| Method | Endpoint | Description                          |
| ------ | -------- | ------------------------------------ |
| GET    | `/`      | Get all products                     |
| GET    | `/:id`   | Get a single product                 |
| POST   | `/`      | Add new product *(Vendor only)*      |
| PUT    | `/:id`   | Update product *(Vendor only)*       |
| DELETE | `/:id`   | Delete product *(Vendor only)*       |
| POST   | `/:id`   | Add review for product *(User only)* |

---

### 🛒 Cart Routes (`/api/v1/cart`)

| Method | Endpoint | Description                  |
| ------ | -------- | ---------------------------- |
| GET    | `/`      | Get all items in user’s cart |
| POST   | `/`      | Add product to cart          |
| PUT    | `/`      | Update quantity in cart      |
| DELETE | `/`      | Remove product from cart     |

---

### 💳 Checkout Routes (`/api/v1/checkout`)

| Method | Endpoint | Description                         |
| ------ | -------- | ----------------------------------- |
| GET    | `/`      | Get all orders of logged-in user    |
| POST   | `/`      | Perform checkout for all cart items |

---

## 🔒 Middleware Summary

| Middleware                               | Purpose                                                 |
| ---------------------------------------- | ------------------------------------------------------- |
| `verifyJwt`                              | Verifies JWT token from cookies or Authorization header |
| `verifyVendor`                           | Ensures current user is a vendor                        |
| `verifyUserExists`, `verifyVendorExists` | Checks duplicates before registration                   |
| `AsyncHandler`                           | Wraps async routes for error-free handling              |
| `errorHandler`                           | Centralized error middleware                            |

---

## 🧪 Testing with ThunderClient / Postman

### 1️⃣ User Authentication

* **Register** → `POST /api/v1/user/register`
* **Login** → `POST /api/v1/user/login`
* Copy cookies or use Bearer token for subsequent routes

### 2️⃣ Product Routes

* Get all or add new products (with form-data for images)

### 3️⃣ Cart Routes

* Add, update, and delete items from cart while logged in

### 4️⃣ Checkout

* Post checkout request, then verify orders in `/checkout` and vendor `/orders`

---

## 🛠️ Installation and Running Locally

```bash
# Clone repository
git clone https://github.com/ashreekar/Shoppy-Globe-Backend.git

# Move into project
cd Shoppy-Globe-Backend

# Install dependencies
npm install

# Create .env file and fill credentials
touch .env

# Run the app
npm run dev
```

App runs on:
👉 `http://localhost:3317`

---

## 🧑‍💻 Developer

**👤 Ashreek A R**
📧 [ashreekar767@gmail.com](mailto:ashreekar767@gmail.com)

---