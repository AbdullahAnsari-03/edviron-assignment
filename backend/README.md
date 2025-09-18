# School Payment and Dashboard Application - Backend

A complete NestJS backend application for managing school payments with MongoDB integration.

## Features

- User authentication with JWT tokens
- Payment gateway integration (Edviron API)
- Webhook handling for payment status updates
- Transaction management and querying
- Input validation and error handling
- Database indexing for performance

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
   npm install

Create .env file with these variables:

   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PG_KEY=edvtest01
   PAYMENT_API_KEY=your_payment_api_key
   CALLBACK_URL=http://localhost:3000/payments/webhook

Start the application:

bash   npm run start:dev
API Endpoints
Authentication

POST /auth/register - Register new user
POST /auth/login - User login

Payments (Protected)

POST /payments/create-payment - Create new payment
GET /payments/transactions - Get all transactions
GET /payments/transactions/school/:schoolId - Get school transactions
GET /payments/transaction-status/:orderId - Check transaction status

Webhooks (Public)

POST /payments/webhook - Payment gateway callback

Database Schema
Order

school_id, trustee_id, student_info, gateway_name, amount, status

OrderStatus

collect_id, order_amount, transaction_amount, payment details, status

User

email, password, name, school_id, role

WebhookLog

webhook_id, event_type, payload, status, timestamps

Testing with Postman
Import the provided Postman collection or use these example requests:
Register User
jsonPOST /auth/register
{
  "email": "test@school.com",
  "password": "password123",
  "name": "Test User", 
  "school_id": "65b0e6293e9f76a9694d84b4"
}
Create Payment
jsonPOST /payments/create-payment
Headers: Authorization: Bearer <token>
{
  "school_id": "65b0e6293e9f76a9694d84b4",
  "amount": "100",
  "trustee_id": "65b0e552dd319550a9b41c5ba",
  "student_info": {
    "name": "John Doe",
    "id": "STU001", 
    "email": "john@student.com"
  }
}
Technology Stack

NestJS framework
MongoDB with Mongoose
JWT authentication
Class-validator for input validation
bcrypt for password hashing
Axios for HTTP requests

Production Deployment

Set environment variables in your hosting platform
Ensure MongoDB Atlas is accessible
Update CALLBACK_URL to your production domain
Enable CORS for your frontend domain