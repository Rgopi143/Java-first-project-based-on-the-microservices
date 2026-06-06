import React, { useState, useEffect } from 'react';
import { FileCheck, CheckCircle2, Circle, Search, RotateCcw, Filter, Check } from 'lucide-react';

export default function Checklist() {
  const defaultTasks = [
    { id: 1, text: 'Define microservice boundaries: Product Catalog, Order Management, User Authentication, Payment Gateway, Recommendation Engine.', phase: 'Phase 1: Planning & Boundaries', checked: true },
    { id: 2, text: 'Implement each microservice independently with Spring Boot and Spring Core; assign dedicated databases.', phase: 'Phase 2: Backend Development', checked: true },
    { id: 3, text: 'Build RESTful Web Services for inter-service and frontend communication.', phase: 'Phase 2: Backend Development', checked: true },
    { id: 4, text: 'Utilize Spring Data JPA for efficient database access within each microservice.', phase: 'Phase 2: Backend Development', checked: true },
    { id: 5, text: 'Set up API Gateway and service discovery using Spring Cloud.', phase: 'Phase 3: Microservices Infrastructure', checked: true },
    { id: 6, text: 'Develop responsive React.js e-commerce storefront consuming backend microservice APIs.', phase: 'Phase 4: Frontend Storefront', checked: true },
    { id: 7, text: 'Implement user behavior tracking and stream processing for real-time analytics.', phase: 'Phase 5: Real-time Analytics', checked: true },
    { id: 8, text: 'Build a basic recommendation engine and analytics dashboard.', phase: 'Phase 5: Real-time Analytics', checked: true },
    { id: 9, text: 'Implement Web Security best practices (OWASP, HTTPS, Encryption).', phase: 'Phase 3: Microservices Infrastructure', checked: true },
    { id: 10, text: 'Write Unit Tests using JUnit for backend microservices.', phase: 'Phase 2: Backend Development', checked: true },
    { id: 11, text: 'Containerize each microservice and frontend with Docker; implement CI/CD and deploy to cloud.', phase: 'Phase 6: DevOps & Deployment', checked: true },
    { id: 12, text: 'Use Git & GitHub for version control with structured branching.', phase: 'Phase 1: Planning & Boundaries', checked: true }
  ];

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('srs_checklist_tasks_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return defaultTasks;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, completed, pending
  const [activePhase, setActivePhase] = useState('all');

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('srs_checklist_tasks_v2', JSON.stringify(tasks));
  }, [tasks]);

  const handleToggle = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, checked: !t.checked } : t));
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the roadmap progress to initial defaults?')) {
      setTasks(defaultTasks);
      setSearchQuery('');
      setStatusFilter('all');
      setActivePhase('all');
    }
  };

  const completedCount = tasks.filter(t => t.checked).length;
  const totalCount = tasks.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  // Group tasks by Phase
  const phases = ['all', ...new Set(tasks.map(t => t.phase))];

  // Filtering logic
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          task.phase.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'completed' && task.checked) || 
                          (statusFilter === 'pending' && !task.checked);
    
    const matchesPhase = activePhase === 'all' || task.phase === activePhase;

    return matchesSearch && matchesStatus && matchesPhase;
  });

  const getPhaseColorClass = (phase) => {
    if (phase.includes('Phase 1')) return 'badge-blue';
    if (phase.includes('Phase 2')) return 'badge-purple';
    if (phase.includes('Phase 3')) return 'badge-emerald';
    if (phase.includes('Phase 4')) return 'badge-amber';
    return 'badge-rose';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-emerald" style={{ marginBottom: '0.8rem' }}>Project Roadmap</span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.6rem' }}>
          Implementation Checklist
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Track implementation progress. Toggle completion boxes to update the overall platform readiness metrics dynamically.
        </p>
      </div>

      {/* Progress Bar Header */}
      <div className="glass-card" style={{ padding: '1.8rem', margin: '0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-primary)' }}>Platform Readiness</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: '0.6rem' }}>
              ({completedCount} of {totalCount} tasks completed)
            </span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)' }}>
              {percentage}%
            </span>
            <button
              onClick={handleReset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                backgroundColor: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: '0.4rem',
                padding: '0.3rem 0.6rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
              title="Reset progress to default values"
            >
              <RotateCcw style={{ width: '0.8rem', height: '0.8rem' }} /> Reset
            </button>
          </div>
        </div>
        
        {/* Progress Background */}
        <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--border-color)', borderRadius: '999px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${percentage}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--primary), var(--accent-purple))', 
              borderRadius: '999px',
              transition: 'width var(--transition-slow)' 
            }} 
          />
        </div>
      </div>

      {/* Search & Filtering Utilities */}
      <div className="glass-card" style={{ padding: '1.2rem 1.5rem', margin: '0', display: 'flex', flexWrap: 'wrap', gap: '1.2rem', alignItems: 'center' }}>
        
        {/* Search Input */}
        <div style={{ flex: '1', minWidth: '240px', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <Search style={{ width: '1rem', height: '1rem', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search tasks or phases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '0.88rem' }}
          />
        </div>

        {/* Status Filter buttons */}
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginRight: '0.4rem' }}>STATUS:</span>
          {['all', 'completed', 'pending'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                backgroundColor: statusFilter === status ? 'var(--primary)' : 'transparent',
                border: '1px solid',
                borderColor: statusFilter === status ? 'var(--primary)' : 'var(--border-color)',
                color: statusFilter === status ? 'white' : 'var(--text-secondary)',
                padding: '0.35rem 0.8rem',
                borderRadius: '0.4rem',
                fontSize: '0.78rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Phase selection */}
        <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '700', marginRight: '0.4rem' }}>PHASE:</span>
          <select
            value={activePhase}
            onChange={(e) => setActivePhase(e.target.value)}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '0.4rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              fontSize: '0.78rem',
              fontWeight: '600',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {phases.map(p => (
              <option key={p} value={p}>{p === 'all' ? 'All Phases' : p.split(':')[0]}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Checklist Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <span>No tasks found matching current filters.</span>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id}
              onClick={() => handleToggle(task.id)}
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: '1rem',
                padding: '1.2rem 1.5rem',
                backgroundColor: task.checked ? 'rgba(16, 185, 129, 0.02)' : 'var(--glass-bg)',
                border: '1px solid',
                borderColor: task.checked ? 'rgba(16, 185, 129, 0.15)' : 'var(--border-color)',
                borderRadius: '0.85rem',
                cursor: 'pointer',
                transition: 'var(--transition-fast)',
                boxShadow: 'var(--shadow-sm)'
              }}
              className="task-row"
            >
              {/* Checkbox Trigger */}
              <button 
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer', 
                  color: task.checked ? 'var(--accent-emerald)' : 'var(--text-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginTop: '0.15rem' 
                }}
                aria-label={`Mark task ${task.id} as ${task.checked ? 'incomplete' : 'complete'}`}
              >
                {task.checked ? (
                  <CheckCircle2 style={{ width: '1.3rem', height: '1.3rem', filter: 'drop-shadow(0 0 3px rgba(16, 185, 129, 0.3))' }} />
                ) : (
                  <Circle style={{ width: '1.3rem', height: '1.3rem' }} />
                )}
              </button>
              
              {/* Task Details */}
              <div style={{ flex: '1' }}>
                <span 
                  style={{ 
                    fontSize: '0.925rem', 
                    color: task.checked ? 'var(--text-secondary)' : 'var(--text-primary)',
                    textDecoration: task.checked ? 'line-through' : 'none',
                    lineHeight: '1.5',
                    fontWeight: task.checked ? '400' : '500',
                    display: 'block'
                  }}
                >
                  {task.text}
                </span>
                
                {/* Phase tag badge */}
                <span className={`badge ${getPhaseColorClass(task.phase)}`} style={{ marginTop: '0.5rem', fontSize: '0.65rem', padding: '0.1rem 0.5rem' }}>
                  {task.phase}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
