import React, { useState } from 'react';
import { 
  Server, 
  Cpu, 
  Layers, 
  Database, 
  TrendingUp, 
  ShieldAlert, 
  FileCheck, 
  CloudLightning,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function Overview() {
  const [comparisonTab, setComparisonTab] = useState('microservices');

  const techStack = [
    { 
      category: 'Backend Core', 
      icon: Server, 
      color: 'badge-blue',
      desc: 'Robust Spring Boot backend microservices ecosystem.',
      items: ['Java 17 & Spring Boot', 'Spring Dependency Injection', 'Spring Data JPA', 'RESTful API contracts'] 
    },
    { 
      category: 'Microservices Infra', 
      icon: Layers, 
      color: 'badge-purple',
      desc: 'Service coordination and routing infrastructure.',
      items: ['Spring Cloud Gateway', 'Netflix Eureka Discovery', 'Declarative Feign Clients', 'Resilience4j Circuit Breakers'] 
    },
    { 
      category: 'Frontend Client', 
      icon: Cpu, 
      color: 'badge-emerald',
      desc: 'Blazing-fast responsive single page client.',
      items: ['React.js 19 + Vite', 'Context State Management', 'React Router client routing', 'Premium CSS transitions'] 
    },
    { 
      category: 'Polyglot Storage', 
      icon: Database, 
      color: 'badge-amber',
      desc: 'Isolated database engines per microservice.',
      items: ['PostgreSQL (ACID Transactions)', 'MongoDB (Telemetry JSON logs)', 'H2 Database (Dev In-Memory)'] 
    },
    { 
      category: 'Stream Analytics', 
      icon: TrendingUp, 
      color: 'badge-blue',
      desc: 'Real-time telemetry event processor.',
      items: ['User interaction telemetry streams', 'Real-time ingestion gateway', 'ML matrix matchmaking feed'] 
    },
    { 
      category: 'Security Tier', 
      icon: ShieldAlert, 
      color: 'badge-rose',
      desc: 'Enterprise security standards.',
      items: ['OWASP Top 10 defenses', 'HTTPS transit encryption', 'Supabase JWT verification', 'Gateway role verification'] 
    },
    { 
      category: 'Testing Framework', 
      icon: FileCheck, 
      color: 'badge-emerald',
      desc: 'Full testing coverage suite.',
      items: ['JUnit 5 Unit Tests', 'Spring Security Test mocks', 'Vite test integration'] 
    },
    { 
      category: 'Cloud DevOps', 
      icon: CloudLightning, 
      color: 'badge-purple',
      desc: 'Modern deployment and lifecycle management.',
      items: ['GitHub Actions CI/CD pipelines', 'Docker container configurations', 'AWS/Cloud hosting structures', 'Structured Git branching'] 
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Title Header */}
      <div>
        <span className="badge badge-purple" style={{ marginBottom: '0.8rem' }}>Project Specification</span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '800', marginBottom: '0.6rem' }}>
          Scalable Microservices-Based E-Commerce Ecosystem with Integrated Analytics
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px' }}>
          Software Requirements Specification (SRS) Interactive Documentation Portal
        </p>
      </div>

      {/* Grid: Problem Statement & Expected Outcome */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.8rem' }} className="grid-cols-2">
        {/* Problem Statement Card */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-rose)', margin: 0 }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-rose)' }} /> Problem Statement
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
            Traditional monolithic e-commerce applications struggle with scalability, maintainability, and the ability to rapidly introduce new features. There is a pressing need for a microservices-based e-commerce ecosystem that provides modularity, independent deployability, and integrated analytics to offer personalized customer experiences, optimize inventory management, and drive sales through data-driven insights.
          </p>
        </div>

        {/* Expected Outcome Card */}
        <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-emerald)', margin: 0 }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: 'var(--accent-emerald)' }} /> Expected Outcome
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
            A cloud-deployed, microservices-based e-commerce ecosystem with a React.js storefront, real-time analytics, and a personalized recommendation engine — demonstrating enterprise-grade scalability, fault tolerance, modularity, and secure deployment practices, showcasing best practices in enterprise application development.
          </p>
        </div>
      </div>

      {/* Interactive Monolith vs Microservices Widget */}
      <div className="glass-card" style={{ padding: '2.2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '800' }}>
            Architectural Paradigm: Monolith vs. Microservices
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Toggle the architectural tabs below to inspect how modular microservices address monolithic scalability and deployment limitations.
          </p>
        </div>

        {/* Selector Tabs */}
        <div style={{ display: 'flex', gap: '0.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.8rem' }}>
          <button
            onClick={() => setComparisonTab('monolith')}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '0.5rem',
              border: '1px solid',
              borderColor: comparisonTab === 'monolith' ? 'var(--accent-rose)' : 'var(--border-color)',
              backgroundColor: comparisonTab === 'monolith' ? 'rgba(220, 38, 38, 0.08)' : 'transparent',
              color: comparisonTab === 'monolith' ? 'var(--accent-rose)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Monolithic Limitations
          </button>
          <button
            onClick={() => setComparisonTab('microservices')}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '0.5rem',
              border: '1px solid',
              borderColor: comparisonTab === 'microservices' ? 'var(--accent-emerald)' : 'var(--border-color)',
              backgroundColor: comparisonTab === 'microservices' ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
              color: comparisonTab === 'microservices' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            Microservices Solution
          </button>
        </div>

        {/* Comparison Content */}
        <div style={{ minHeight: '220px' }}>
          {comparisonTab === 'monolith' ? (
            <div className="monolith-card animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
              <div>
                <h3 style={{ color: 'var(--accent-rose)', fontSize: '1.15rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <AlertTriangle style={{ width: '1.1rem', height: '1.1rem' }} /> Why Monoliths Struggle
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <li>⚠️ <strong>Coupled Codebase:</strong> A bug in the Recommendation logic can crash the entire storefront checkout system.</li>
                  <li>⚠️ <strong>Scaling Overhead:</strong> Scaling the app requires duplicating the entire monolith block, wasting costly memory and CPU.</li>
                  <li>⚠️ <strong>Deployment Bottlenecks:</strong> Code releases require compiling and deploying the complete codebase, causing slow deployment cycles.</li>
                  <li>⚠️ <strong>Database Contention:</strong> Single central database leads to resource locking and schema synchronization bottlenecks.</li>
                </ul>
              </div>
              <div className="comparison-box monolith">
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: '700', textTransform: 'uppercase' }}>Monolith Architecture Concept</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', border: '1px dashed rgba(220, 38, 38, 0.25)', padding: '1rem', borderRadius: '0.6rem', backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.6rem 1.2rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', width: '100%', textAlign: 'center', fontWeight: '600', fontSize: '0.8rem' }}>
                    📦 Single Large Application Archive (.war / .jar)
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Storefront + Auth + Catalog + Order + Payment + Analytics</div>
                  </div>
                  <ArrowRight style={{ transform: 'rotate(90deg)', width: '1rem', height: '1rem', color: 'var(--text-muted)' }} />
                  <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.5rem 1rem', borderRadius: '0.4rem', border: '1px solid var(--border-color)', fontWeight: '600', fontSize: '0.8rem' }}>
                    🗄️ Single Shared Database Instance
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="microservices-card animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
              <div>
                <h3 style={{ color: 'var(--accent-emerald)', fontSize: '1.15rem', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Sparkles style={{ width: '1.1rem', height: '1.1rem', color: 'var(--accent-emerald)' }} /> The Microservices Advantage
                </h3>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <li>✅ <strong>Domain Isolation:</strong> Individual services are bounded (Catalog, Order, Payment). Failure in one service does not crash others.</li>
                  <li>✅ <strong>Localized Scaling:</strong> Scale the Recommendation service horizontally without scaling the rest of the application.</li>
                  <li>✅ <strong>Independent Deployments:</strong> Build, test, and containerize individual JAR files and deploy them with independent CI/CD pipelines.</li>
                  <li>✅ <strong>Database-per-Service:</strong> Complete database separation (PostgreSQL for transactions, MongoDB for clickstream tracking).</li>
                </ul>
              </div>
              <div className="comparison-box micro">
                <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: '700', textTransform: 'uppercase' }}>Microservices Architecture Concept</span>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', border: '1px dashed rgba(16, 185, 129, 0.25)', padding: '0.75rem', borderRadius: '0.6rem', backgroundColor: 'rgba(0, 0, 0, 0.15)' }}>
                  {['Auth Svc (8081)', 'Catalog Svc (8082)', 'Order Svc (8083)', 'Payment Svc (8084)', 'Analytics Svc (8085)'].map((svc, idx) => (
                    <div key={idx} style={{ backgroundColor: 'var(--bg-main)', padding: '0.4rem 0.6rem', borderRadius: '0.35rem', border: '1px solid var(--border-color)', fontSize: '0.75rem', fontWeight: '500', minWidth: '95px', textAlign: 'center' }}>
                      ⚙️ {svc}
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 2rem', marginTop: '0.3rem' }}>
                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.3rem 0.6rem', borderRadius: '0.35rem', border: '1px solid var(--border-color)', fontSize: '0.7rem' }}>🗄️ postgres (SQL)</div>
                    <div style={{ backgroundColor: 'var(--bg-main)', padding: '0.3rem 0.6rem', borderRadius: '0.35rem', border: '1px solid var(--border-color)', fontSize: '0.7rem' }}>🍃 mongodb (NoSQL)</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: '800' }}>
            Enterprise Technology Stack
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            The integrated developer tools and framework choices establishing best practices in high-scale ecosystems.
          </p>
        </div>
        
        <div className="grid-cols-2" style={{ gap: '1.5rem' }}>
          {techStack.map((stack, idx) => {
            const IconComponent = stack.icon;
            return (
              <div key={idx} className="glass-card" style={{ padding: '1.8rem', margin: '0', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem' }}>
                  <div className={`badge ${stack.color}`} style={{ padding: '0.5rem', borderRadius: '0.6rem' }}>
                    <IconComponent style={{ width: '1.2rem', height: '1.2rem' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: '700' }}>
                      {stack.category}
                    </h3>
                  </div>
                </div>
                
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: '1.4' }}>
                  {stack.desc}
                </p>
                
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {stack.items.map((item, itemIdx) => (
                    <li key={itemIdx} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold', marginTop: '0.1rem' }}>•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
