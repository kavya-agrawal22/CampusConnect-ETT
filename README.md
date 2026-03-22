#  Campus Connect - Club Event Management System

**Campus Connect** is a comprehensive full-stack platform designed to streamline event management for college clubs. It features a modern, responsive **React + TypeScript** frontend and a robust **Spring Boot** backend, enabling students to discover, register for, and manage events effortlessly while providing admins with powerful tools for event oversight.

---

##  Tech Stack

### **Frontend**
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Shadcn/UI
- **State Management:** React Context API
- **Routing:** React Router DOM
- **HTTP Client:** Axios

### **Backend**
- **Framework:** Java Spring Boot 3
- **Security:** Spring Security + JWT (JSON Web Tokens)
- **Database:** MySQL
- **ORM:** Hibernate / Spring Data JPA
- **File Storage:** Cloudinary
- **Payment Gateway:** Razorpay

---

##  Project Structure

This project follows a **Monorepo** structure, housing both the client and server applications in a single repository.

```text
CampusConnect-FullStack/
├── backend/                          #  Spring Boot Application
│   ├── src/
│   │   ├── main/java/com/college/    # Controllers, Services, Entities
│   │   └── main/resources/           # Configuration files
│   ├── mvnw                          # Maven Wrapper
│   └── pom.xml                       # Maven Dependencies
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── api/                      # Axios configuration
│   │   ├── components/               # Reusable UI components
│   │   ├── context/                  # Auth & Global State
│   │   ├── pages/                    # Application Views
│   │   └── types/                    # TypeScript Interfaces
│   ├── public/                       # Static Assets
│   └── package.json                  # Frontend Dependencies
│
└── README.md                         # Project Documentation
##  Getting Started

### 1. Backend Setup (Spring Boot)
**Prerequisites:** Java 17+, MySQL running locally.

1.  Navigate to `backend/` and create `src/main/resources/application.properties`.
2.  Paste the configuration below (update your keys):
    ```properties
    # Database
    spring.datasource.url=jdbc:mysql://localhost:3306/campus_connect_db
    spring.datasource.username=root
    spring.datasource.password=YOUR_MYSQL_PASSWORD
    spring.jpa.hibernate.ddl-auto=update

    # Security & Keys
    jwt.secret-key=YOUR_GENERATED_SECRET_KEY
    cloudinary.cloud-name=YOUR_CLOUD_NAME
    cloudinary.api-key=YOUR_API_KEY
    cloudinary.api-secret=YOUR_API_SECRET
    razorpay.key.id=YOUR_RAZORPAY_ID
    razorpay.key.secret=YOUR_RAZORPAY_SECRET
    ```
3.  **Run:** `./mvnw spring-boot:run` (Starts on port 8080).

### 2. Frontend Setup (React)
**Prerequisites:** Node.js 18+.

1.  Navigate to `frontend/` and install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file in the `frontend/` root:
    ```env
    VITE_API_BASE_URL=http://localhost:8080
    VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_TEST_ID
    ```
3.  **Run:** `npm run dev` (Starts on port 5173).

---

##  Key API Endpoints

| Access | Endpoint | Description |
| :--- | :--- | :--- |
| **Public** | `/api/public/events` | Browse all events |
| **Public** | `/api/auth/login` | User login (returns JWT) |
| **Student** | `/api/user/events/{id}/register` | Register for an event |
| **Student** | `/api/user/my-events` | View registered history |
| **Admin** | `/api/admin/events` | Create/Edit/Delete events |
| **Admin** | `/api/admin/events/{id}/attendees` | View attendee list |

> **Auth Flow:** Login returns a JWT token. The frontend automatically attaches this token (`Authorization: Bearer <token>`) to requests for protected Student/Admin routes.

---

##  User Roles & Testing

**Default Test Accounts** (Seed these in your DB first):

* **Admin:** `admin@example.com` / `password123`
    * *Capabilities:* Manage events, categories, and view attendees.
* **Student:** `student@example.com` / `password123`
    * *Capabilities:* Browse, register, and manage own registrations.

---

##  Common Troubleshooting

* **Images fail to upload?** Check Cloudinary keys in `application.properties` and ensure file size is small.
* **CORS Error?** Confirm backend `SecurityConfig` permits `http://localhost:5173`.
* **Payment Popup missing?** Check `VITE_RAZORPAY_KEY_ID` in `.env`.

---

##  License
This project is developed for educational purposes as a Full Stack Portfolio Project.
