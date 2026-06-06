import React, { useState } from 'react';
import { Layers, Database, Network, Key, ShoppingCart, Award, CreditCard, Sparkles, HelpCircle, Code, List, FileText } from 'lucide-react';

export default function Architecture() {
  const [selectedService, setSelectedService] = useState('gateway');
  const [detailTab, setDetailTab] = useState('description');

  const services = {
    gateway: {
      name: 'API Gateway',
      tech: 'Spring Cloud Gateway',
      port: '8080',
      role: 'Unified entrance for client storefront requests. Handles request routing, CORS configuration, centralized security filters, rate limiting, and forwards valid tokens to downstream services.',
      endpoints: [
        'GET /api/products/** -> routed to Catalog',
        'POST /api/orders/** -> routed to Order',
        'POST /api/auth/** -> routed to Auth',
      ],
      db: 'None (Stateless routing layer)',
      config: `server:
  port: 8080
spring:
  cloud:
    gateway:
      default-filters:
        - TokenRelay
      routes:
        - id: catalog-service
          uri: lb://catalog-service
          predicates:
            - Path=/api/products/**
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
        - id: auth-service
          uri: lb://auth-service
          predicates:
            - Path=/api/auth/**`
    },
    eureka: {
      name: 'Service Discovery',
      tech: 'Spring Cloud Netflix Eureka Server',
      port: '8761',
      role: 'Central registry where all microservices register themselves on startup. Allows the API Gateway and services to dynamically discover instances via logical names (e.g. lb://order-service) without hardcoded IP configurations.',
      endpoints: [
        'GET /eureka/apps (Discovery lookup endpoints)',
      ],
      db: 'In-memory registry state',
      config: `server:
  port: 8761
eureka:
  instance:
    hostname: localhost
  client:
    registerWithEureka: false
    fetchRegistry: false
    serviceUrl:
      defaultZone: http://\${eureka.instance.hostname}:\${server.port}/eureka/`
    },
    auth: {
      name: 'Auth & Profile Service',
      tech: 'Spring Boot + Supabase Auth',
      port: '8081',
      role: 'Responsible for user profile bootstrapping, role-based authorization (User/Admin claims), and synchronizing sign-ups handled by Supabase Auth with backend databases.',
      endpoints: [
        'POST /api/auth/register (Bootstrap profile)',
        'GET /api/profiles/{id} (Retrieve profile metadata)',
        'PUT /api/profiles (Update contact/shipping address)',
      ],
      db: 'H2 (Development) / PostgreSQL (Production) - `authdb`',
      config: `server:
  port: 8081
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/authdb
    username: postgres
    password: \${DB_PASSWORD}
supabase:
  jwt:
    secret: \${SUPABASE_JWT_SECRET}
    issuer: \${SUPABASE_PROJECT_URL}/auth/v1`
    },
    catalog: {
      name: 'Product Catalog Service',
      tech: 'Spring Boot + Spring Data JPA',
      port: '8082',
      role: 'Handles product information, inventory status, categories, and reviews. Performs inventory checks prior to order finalization.',
      endpoints: [
        'GET /api/products (List active/featured items)',
        'GET /api/products/{slug} (Product details)',
        'GET /api/products/categories (Category browsing)',
        'POST /api/products (Admin product creation)',
      ],
      db: 'PostgreSQL / H2 - `catalogdb` (Tables: products, categories, reviews)',
      config: `server:
  port: 8082
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/catalogdb
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect`
    },
    order: {
      name: 'Order & Cart Service',
      tech: 'Spring Boot + JPA + Feign Client',
      port: '8083',
      role: 'Coordinates transactional user shopping carts and processes new order checkouts. Communicates with Catalog Service for stock validation and Auth Service for user shipping addresses.',
      endpoints: [
        'GET /api/cart/{userId} (Fetch active cart)',
        'POST /api/cart (Add item to cart)',
        'POST /api/orders (Create order/Checkout)',
        'POST /api/orders/{id}/cancel (Cancel order)',
      ],
      db: 'PostgreSQL / H2 - `orderdb` (Tables: orders, order_items, cart_items)',
      config: `server:
  port: 8083
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/orderdb
feign:
  client:
    config:
      default:
        connectTimeout: 5000
        readTimeout: 5000
  catalog-service:
    url: http://catalog-service`
    },
    payment: {
      name: 'Payment Gateway Service',
      tech: 'Spring Boot + External Stripe/PayPal Mock API',
      port: '8084',
      role: 'Secure transactional processor. Handles tokenized checkout verification, captures webhooks, and updates payment states (PENDING, PAID, REFUNDED) asynchronously.',
      endpoints: [
        'POST /api/payments/charge (Execute card charge)',
        'POST /api/payments/webhook (Handle stripe state changes)',
      ],
      db: 'Mock transaction ledger log',
      config: `server:
  port: 8084
stripe:
  apiKey: \${STRIPE_API_KEY}
  webhookSecret: \${STRIPE_WEBHOOK_SECRET}
spring:
  kafka:
    producer:
      bootstrap-servers: localhost:9092
      key-serializer: org.apache.kafka.common.serialization.StringSerializer`
    },
    recommendation: {
      name: 'Recommendation & Analytics Engine',
      tech: 'Spring Boot + MongoDB + Stream Processor',
      port: '8085',
      role: 'Ingests real-time user behavior events (viewed, clicked, bought) from client tracking. Processes interaction streams to dynamically serve personalized product recommendation cards.',
      endpoints: [
        'GET /api/recommendations/{userId} (Personalized recommendations)',
        'POST /api/analytics/track (Ingest telemetry behavior logs)',
      ],
      db: 'MongoDB (Unstructured clickstream collections: user_events, recommendations)',
      config: `server:
  port: 8085
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/analyticsdb
  stream:
    bindings:
      telemetry-in:
        destination: clickstream-events
        group: analytics-group`
    },
    'db-sql': {
      name: 'PostgreSQL Databases',
      tech: 'Relational Database Engine',
      port: '5432',
      role: 'Highly relational data tier isolating Catalog tables (products, categories) and Transactional tables (orders, order items). Strict DB-per-service isolation ensures modularity.',
      endpoints: [
        'jdbc:postgresql://localhost:5432/catalogdb',
        'jdbc:postgresql://localhost:5432/orderdb',
        'jdbc:postgresql://localhost:5432/authdb'
      ],
      db: 'Physical disk volume storage',
      config: `-- SQL Initialization DDL Sample
CREATE DATABASE catalogdb;
CREATE DATABASE orderdb;
CREATE DATABASE authdb;`
    },
    'db-nosql': {
      name: 'MongoDB Analytics DB',
      tech: 'NoSQL Document Store',
      port: '27017',
      role: 'Document oriented tier housing clickstream collection logs. Supports high write throughput for customer telemetry tracking. Data is cached for the personalized recommendation algorithm.',
      endpoints: [
        'mongodb://localhost:27017/analyticsdb'
      ],
      db: 'NoSQL disk volume storage',
      config: `// MongoDB Collection Setup
db.createCollection("user_events");
db.user_events.createIndex({ "userId": 1, "timestamp": -1 });
db.createCollection("recommendations");
db.recommendations.createIndex({ "userId": 1 }, { unique: true });`
    }
  };

  const currentService = services[selectedService];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Page Header */}
      <div>
        <span className="badge badge-blue" style={{ marginBottom: '0.8rem' }}>System Architecture</span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.6rem' }}>
          Interactive Architecture Visualizer
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Click on any node in the dynamic architectural layout below to inspect ports, internal tasks, endpoints, and dedicated database tiers.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }} className="grid-cols-2">
        
        {/* Interactive SVG Diagram */}
        <div className="glass-card" style={{ margin: '0', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Network style={{ width: '1.1rem', height: '1.1rem', color: 'var(--primary)' }} /> Interactive System Map
          </h3>
          
          <svg viewBox="0 0 800 550" width="100%" height="auto" style={{ maxWidth: '750px' }}>
            <defs>
              <linearGradient id="primary-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="purple-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6d28d9" />
              </linearGradient>
              <linearGradient id="emerald-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="amber-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              
              <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connection Lines */}
            {/* Storefront to API Gateway */}
            <path d="M400 70 L400 130" stroke="var(--border-color)" strokeWidth="3" strokeDasharray="5 5" />
            
            {/* Gateway to Services */}
            <path d="M400 180 L200 280" stroke={selectedService === 'gateway' ? 'var(--primary)' : 'var(--border-color)'} strokeWidth={selectedService === 'gateway' ? '2.5' : '1.5'} style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }} />
            <path d="M400 180 L300 280" stroke={selectedService === 'gateway' ? 'var(--primary)' : 'var(--border-color)'} strokeWidth={selectedService === 'gateway' ? '2.5' : '1.5'} style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }} />
            <path d="M400 180 L400 280" stroke={selectedService === 'gateway' ? 'var(--primary)' : 'var(--border-color)'} strokeWidth={selectedService === 'gateway' ? '2.5' : '1.5'} style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }} />
            <path d="M400 180 L500 280" stroke={selectedService === 'gateway' ? 'var(--primary)' : 'var(--border-color)'} strokeWidth={selectedService === 'gateway' ? '2.5' : '1.5'} style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }} />
            <path d="M400 180 L600 280" stroke={selectedService === 'gateway' ? 'var(--primary)' : 'var(--border-color)'} strokeWidth={selectedService === 'gateway' ? '2.5' : '1.5'} style={{ transition: 'stroke-width 0.2s, stroke 0.2s' }} />
            
            {/* Services to Databases */}
            <path d="M200 335 L200 450" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M300 335 L300 450" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M400 335 L300 450" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M500 335 L300 450" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M600 335 L600 450" stroke="var(--border-color)" strokeWidth="1.5" strokeDasharray="3 3" />

            {/* Eureka Discovery links */}
            <path d="M120 155 H310" stroke="var(--accent-purple)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
            <text x="210" y="145" fill="var(--accent-purple)" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="var(--font-mono)">Registration Zone</text>
            
            {/* 1. Client Storefront Node */}
            <g transform="translate(310, 20)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('eureka')}>
              <rect x="0" y="0" width="180" height="50" rx="10" fill="url(#primary-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
              <text x="90" y="28" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">React Storefront SPA</text>
              <text x="90" y="42" fill="#bfdbfe" fontSize="9" textAnchor="middle" fontFamily="var(--font-mono)">Port: 5173</text>
            </g>

            {/* 2. Eureka Service Discovery Node */}
            <g transform="translate(10, 130)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('eureka')}>
              <rect x="0" y="0" width="130" height="60" rx="10" fill="url(#purple-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" filter={selectedService === 'eureka' ? 'url(#glow-active)' : ''} />
              <text x="65" y="24" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">Eureka Server</text>
              <text x="65" y="38" fill="#e9d5ff" fontSize="9" textAnchor="middle">Service Discovery</text>
              <text x="65" y="50" fill="#f3e8ff" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Port: 8761</text>
            </g>

            {/* 3. API Gateway Node */}
            <g transform="translate(310, 130)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('gateway')}>
              <rect x="0" y="0" width="180" height="55" rx="10" fill="var(--bg-card)" stroke={selectedService === 'gateway' ? 'var(--primary)' : 'var(--border-color)'} strokeWidth="2" filter={selectedService === 'gateway' ? 'url(#glow-active)' : ''} style={{ transition: 'stroke 0.2s' }} />
              <text x="90" y="23" fill="var(--text-primary)" fontSize="12" fontWeight="bold" textAnchor="middle">API Gateway</text>
              <text x="90" y="36" fill="var(--text-secondary)" fontSize="9" textAnchor="middle">Spring Cloud Gateway</text>
              <text x="90" y="47" fill="var(--primary)" fontSize="8.5" textAnchor="middle" fontFamily="var(--font-mono)">Port: 8080</text>
            </g>

            {/* 4. Auth Service Node */}
            <g transform="translate(140, 280)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('auth')}>
              <rect x="0" y="0" width="110" height="55" rx="8" fill="var(--bg-card)" stroke={selectedService === 'auth' ? 'var(--accent-purple)' : 'var(--border-color)'} strokeWidth="1.5" filter={selectedService === 'auth' ? 'url(#glow-active)' : ''} style={{ transition: 'stroke 0.2s' }} />
              <text x="55" y="20" fill="var(--text-primary)" fontSize="10.5" fontWeight="bold" textAnchor="middle">Auth Svc</text>
              <text x="55" y="33" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Spring + Supabase</text>
              <text x="55" y="45" fill="var(--accent-purple)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Port: 8081</text>
            </g>

            {/* 5. Catalog Service Node */}
            <g transform="translate(260, 280)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('catalog')}>
              <rect x="0" y="0" width="110" height="55" rx="8" fill="var(--bg-card)" stroke={selectedService === 'catalog' ? 'var(--primary)' : 'var(--border-color)'} strokeWidth="1.5" filter={selectedService === 'catalog' ? 'url(#glow-active)' : ''} style={{ transition: 'stroke 0.2s' }} />
              <text x="55" y="20" fill="var(--text-primary)" fontSize="10.5" fontWeight="bold" textAnchor="middle">Catalog Svc</text>
              <text x="55" y="33" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Spring Boot + JPA</text>
              <text x="55" y="45" fill="var(--primary)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Port: 8082</text>
            </g>

            {/* 6. Order Service Node */}
            <g transform="translate(380, 280)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('order')}>
              <rect x="0" y="0" width="110" height="55" rx="8" fill="var(--bg-card)" stroke={selectedService === 'order' ? 'var(--accent-emerald)' : 'var(--border-color)'} strokeWidth="1.5" filter={selectedService === 'order' ? 'url(#glow-active)' : ''} style={{ transition: 'stroke 0.2s' }} />
              <text x="55" y="20" fill="var(--text-primary)" fontSize="10.5" fontWeight="bold" textAnchor="middle">Order Svc</text>
              <text x="55" y="33" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Cart & Checkout</text>
              <text x="55" y="45" fill="var(--accent-emerald)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Port: 8083</text>
            </g>

            {/* 7. Payment Service Node */}
            <g transform="translate(500, 280)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('payment')}>
              <rect x="0" y="0" width="110" height="55" rx="8" fill="var(--bg-card)" stroke={selectedService === 'payment' ? 'var(--accent-amber)' : 'var(--border-color)'} strokeWidth="1.5" filter={selectedService === 'payment' ? 'url(#glow-active)' : ''} style={{ transition: 'stroke 0.2s' }} />
              <text x="55" y="20" fill="var(--text-primary)" fontSize="10.5" fontWeight="bold" textAnchor="middle">Payment Svc</text>
              <text x="55" y="33" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Stripe Ledger</text>
              <text x="55" y="45" fill="var(--accent-amber)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Port: 8084</text>
            </g>

            {/* 8. Recommendation Service Node */}
            <g transform="translate(620, 280)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('recommendation')}>
              <rect x="0" y="0" width="110" height="55" rx="8" fill="var(--bg-card)" stroke={selectedService === 'recommendation' ? 'var(--accent-rose)' : 'var(--border-color)'} strokeWidth="1.5" filter={selectedService === 'recommendation' ? 'url(#glow-active)' : ''} style={{ transition: 'stroke 0.2s' }} />
              <text x="55" y="20" fill="var(--text-primary)" fontSize="10.5" fontWeight="bold" textAnchor="middle">Telemetry Svc</text>
              <text x="55" y="33" fill="var(--text-secondary)" fontSize="8" textAnchor="middle">Recommender ML</text>
              <text x="55" y="45" fill="var(--accent-rose)" fontSize="8" textAnchor="middle" fontFamily="var(--font-mono)">Port: 8085</text>
            </g>

            {/* 9. Relational Databases Node */}
            <g transform="translate(160, 450)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('db-sql')}>
              <path d="M 0,0 C 0,-10 80,-10 80,0 L 80,45 C 80,55 0,55 0,45 Z" fill="url(#emerald-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" filter={selectedService === 'db-sql' ? 'url(#glow-active)' : ''} />
              <ellipse cx="40" cy="0" rx="40" ry="10" fill="#34d399" opacity="0.8" />
              <text x="40" y="24" fill="white" fontSize="10.5" fontWeight="bold" textAnchor="middle">PostgreSQL</text>
              <text x="40" y="36" fill="#a7f3d0" fontSize="8" textAnchor="middle">ACID Tables</text>
            </g>

            {/* 10. NoSQL Database Node */}
            <g transform="translate(560, 450)" style={{ cursor: 'pointer' }} onClick={() => setSelectedService('db-nosql')}>
              <path d="M 0,0 C 0,-10 80,-10 80,0 L 80,45 C 80,55 0,55 0,45 Z" fill="url(#amber-grad)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" filter={selectedService === 'db-nosql' ? 'url(#glow-active)' : ''} />
              <ellipse cx="40" cy="0" rx="40" ry="10" fill="#fbbf24" opacity="0.8" />
              <text x="40" y="24" fill="white" fontSize="10.5" fontWeight="bold" textAnchor="middle">MongoDB</text>
              <text x="40" y="36" fill="#fde68a" fontSize="8" textAnchor="middle">Clickstream logs</text>
            </g>
          </svg>
        </div>

        {/* Dynamic Detail Panel */}
        <div style={{ margin: '0', display: 'flex', flexDirection: 'column' }}>
          {currentService ? (
            <div className="glass-card animate-fade-in" style={{ height: '100%', margin: '0', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.2rem', minHeight: '400px' }}>
              
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }}>
                  {currentService.name}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                  Port: {currentService.port} | {currentService.tech}
                </p>
              </div>

              {/* Inspector Tabs */}
              <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {[
                  { id: 'description', label: 'Overview', icon: FileText },
                  { id: 'endpoints', label: 'APIs', icon: List },
                  { id: 'config', label: 'YAML Config', icon: Code }
                ].map(tab => {
                  const Icon = tab.icon;
                  const isActive = detailTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDetailTab(tab.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        border: 'none',
                        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        borderRadius: '0.4rem',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <Icon style={{ width: '0.85rem', height: '0.85rem' }} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Inspector Content */}
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                {detailTab === 'description' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {currentService.role}
                    </p>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem', fontWeight: '700' }}>
                        Storage Integration
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                        <Database style={{ width: '0.9rem', height: '0.9rem' }} />
                        {currentService.db}
                      </div>
                    </div>
                  </div>
                )}

                {detailTab === 'endpoints' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <h4 style={{ fontSize: '0.825rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Exposed Route Contexts
                    </h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {currentService.endpoints.map((ep, idx) => (
                        <li 
                          key={idx} 
                          style={{ 
                            fontSize: '0.78rem', 
                            color: 'var(--text-secondary)', 
                            fontFamily: 'var(--font-mono)', 
                            backgroundColor: 'rgba(0,0,0,0.15)', 
                            padding: '0.5rem 0.8rem', 
                            borderRadius: '0.4rem', 
                            borderLeft: '3px solid var(--primary)',
                            border: '1px solid var(--border-color)',
                            borderLeftWidth: '3px'
                          }}
                        >
                          {ep}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailTab === 'config' && (
                  <div className="animate-fade-in" style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    <div className="code-block-header">
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>application.yml</span>
                      <span className="badge badge-purple" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>yaml</span>
                    </div>
                    <pre className="code-block" style={{ margin: 0, maxHeight: '220px' }}>
                      {currentService.config}
                    </pre>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="glass-card" style={{ height: '100%', margin: '0', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderStyle: 'dashed' }}>
              <HelpCircle style={{ width: '2.5rem', height: '2.5rem', color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Select a microservice or database in the diagram to inspect its parameters.
              </p>
            </div>
          )}
        </div>
        
      </div>

    </div>
  );
}
