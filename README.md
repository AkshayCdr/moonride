# Moonrider

A stealthy backend service to track & merge customer identities across multiple purchases using contact information.

---

## 🚀 How to Run the App

### Prerequisites

- Node.js v18+
- MongoDB Atlas URI

### Setup & Execution

1. **Clone Repository**  
   `git clone https://github.com/yourusername/contact-consolidator.git`

2. **Install Dependencies**
   ```bash
   cd contact-consolidator
   npm install
   ```

### create env file

cp .env.example env

### start server

npm start

### run test

npm test

+---------------+
| Client |
+-------+-------+
|
▼
+-------+-------+
| Express API |
+-------+-------+
|
▼
+-------+-------+
| MongoDB |
| (Contact DB)|
+---------------+

## 🔧 Key Features

### Identity Resolution Engine

- 🎯 Automatic primary/secondary contact linking
- 🔄 Real-time contact graph updates
- 🕵️♂️ Stealthy information merging

### 🛠️ Tech Stack

Layer Technology
Database 🍃 MongoDB Atlas (NoSQL)
Backend 🟢 Node.js + Express
Testing 🧪 Vitest + Supertest

### 📡 API Endpoints

Endpoint Method Description
/identify POST Identity resolution endpoint
/contacts GET List all contacts (debug)
/contacts/:id GET Get specific contact details
/contacts POST Manual contact creation
/contacts/:id DELETE Soft-delete contact
