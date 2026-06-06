# 📦 ShopFlow E-Commerce Microservices Platform
###  Interactive Software Requirements Specification (SRS) & Live Architecture Portal

ShopFlow is an enterprise-grade, highly scalable microservices-based e-commerce ecosystem. This repository contains the **Interactive SRS Documentation & Simulator Portal**, a single-page React client designed to document, visualize, and simulate the system's microservice infrastructure, database schemas, REST APIs, and real-time stream telemetry.

---

## Key Features

* ** Interactive System Architecture Map**
  * Visualize the service topology featuring Spring Cloud Gateway, Netflix Eureka Registry, database boundaries, and client storefront connections.
  * Live inspector displaying metadata overview, exposed REST endpoint routes, and microservice `application.yml` YAML config files.

* ** Postman-Style API Sandbox Explorer**
  * Test backend endpoints using dynamic parameter, header, and payload tabs.
  * Injects synthetic JWT authorization scopes (*Guest, User, Admin*) to simulate gateway-level role security.
  * **Hybrid Fetch Client**: Directly executes HTTP requests if your local Spring Boot services are running on port `8080`, with automatic fallback to high-fidelity simulated responses.

* ** Database-per-Service Schema Sandbox**
  * Explores relational table designs (**PostgreSQL**) for transactional services and document structures (**MongoDB**) for telemetry data.
  * View field names, primary/foreign keys, and data types.
  * One-click copy for complete **SQL DDL scripts** and **JSON Validation schemas**.

* ** Live Analytics Telemetry Simulator**
  * Embedded stream engine showing continuous telemetry logs (Views, Clicks, Add-to-carts, Purchases).
  * Real-time charts rendered with **Recharts** (Stream rates area charts, action distribution donut charts).
  * Checkout Conversion Funnel analysis tracking shopping drop-offs.
  * Custom stream event injector testing recommendation matrix recalibration weights.

* **📋 Implementation Roadmap Checklist**
  * Track project completion milestones across 6 defined phases (Planning, Backend core, Infrastructure, Storefront client, Analytics processing, and DevOps/Deployment).
  * Interactive checks synced dynamically with a global sidebar readiness progress indicator.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Core** | React.js 19 + Vite | Fast, responsive single-page web client. |
| **Styling** | Vanilla CSS (Light & Dark) | High-contrast, slate-based premium visual design. |
| **Data Visuals** | Recharts 3.8.1 | Real-time processing stream charts & donuts. |
| **Backend Core** | Spring Boot + Spring Core | Java 17 enterprise framework structure. |
| **Infrastructure** | Spring Cloud Gateway + Netflix Eureka | Edge routing, JWT relaying, and Service Registry. |
| **Relational Storage** | PostgreSQL | Catalog and Order transactional databases. |
| **NoSQL Storage** | MongoDB | Telemetry logging and clickstream database. |
| **DevOps** | Docker + GitHub Actions | Containerization and CI/CD pipelines. |

---

## 📂 Project Structure

```bash
new-folder/
├── src/
│   ├── components/
│   │   ├── Architecture.jsx        # SVG System topology map and configs
│   │   ├── ApiExplorer.jsx         # REST Playground & hybrid fetch relay
│   │   ├── SchemaViewer.jsx        # Postgres SQL DDL & MongoDB schemas
│   │   ├── DashboardSimulator.jsx  # Live stream console & Recharts
│   │   └── Checklist.jsx           # Bounded milestone tracker
│   ├── App.jsx                     # Layout & persistent theme/states
│   ├── index.css                   # Custom responsive light/dark design
│   └── main.jsx                    # React entrypoint
├── index.html                      # HTML head imports and global fonts
├── package.json                    # Dependencies (React, Recharts, Lucide)
└── vite.config.js                  # Vite builder config
```

---

## ⚙️ Quick Start

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (v9 or higher)
* **Java SDK 17** (for compiling and executing backend services)
* **Apache Maven** (for dependency resolution and module builds)
* **Docker / Docker Compose** (Optional, for containerized deployments)

### Installation & Run

#### 1. Frontend Client Storefront (SRS Portal)
Navigate to the root workspace directory:

1. **Install Node Dependencies**
   ```bash
   npm install
   ```
2. **Start Frontend Dev Server**
   ```bash
   npm run dev
   ```
   Open your browser at: **[http://localhost:5173](http://localhost:5173)**

#### 2. Backend Spring Boot Microservices
Navigate to the `backend-microservices` subdirectory:
```bash
cd backend-microservices
```

1. **Build and Install Maven Modules**
   Compile and package all sub-modules (Eureka, API Gateway, Auth, Catalog, Order) in order:
   ```bash
   mvn clean install
   ```

2. **Launch Services Individually (Development Mode)**
   Run the following Maven plugin commands to start each service in a separate terminal:
   * **Eureka Discovery Server** (Port 8761):
     ```bash
     mvn spring-boot:run -pl eureka-server
     ```
   * **API Gateway Service** (Port 8080):
     ```bash
     mvn spring-boot:run -pl api-gateway
     ```
   * **Auth & Profile Service** (Port 8081):
     ```bash
     mvn spring-boot:run -pl auth-service
     ```
   * **Product Catalog Service** (Port 8082):
     ```bash
     mvn spring-boot:run -pl catalog-service
     ```
   * **Order Management Service** (Port 8083):
     ```bash
     mvn spring-boot:run -pl order-service
     ```

3. **Launch Services in Containerized Sandbox (Alternative)**
   If you have Docker running, spin up the entire backend database & service cluster in one command:
   ```bash
   docker-compose up --build
   ```

---

## 🔒 Security Best Practices
* Direct implementation of **OWASP Top 10** defenses.
* Centralized request interceptors handling CORS filters.
* TokenRelay filters pushing Supabase validated Bearer JWT tokens to lower tiers.

---
*Developed by **RANBIDGE Solutions Pvt. Ltd.***
