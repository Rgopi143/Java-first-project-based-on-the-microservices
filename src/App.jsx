import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Network, 
  Terminal, 
  Database, 
  LineChart, 
  CheckSquare, 
  Menu, 
  X, 
  ShoppingBag,
  Info,
  Sun,
  Moon
} from 'lucide-react';

// Import components
import Architecture from './components/Architecture';
import ApiExplorer from './components/ApiExplorer';
import SchemaViewer from './components/SchemaViewer';
import DashboardSimulator from './components/DashboardSimulator';
import Checklist from './components/Checklist';

export default function App() {
  const [activeTab, setActiveTab] = useState('architecture');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('srs_portal_theme') || 'light';
  });

  // Persist theme choice
  useEffect(() => {
    localStorage.setItem('srs_portal_theme', theme);
  }, [theme]);

  // Poll checklist progress from localStorage
  const updateProgress = () => {
    const saved = localStorage.getItem('srs_checklist_tasks_v2');
    if (saved) {
      try {
        const tasks = JSON.parse(saved);
        const completed = tasks.filter(t => t.checked).length;
        const total = tasks.length;
        setChecklistProgress(Math.round((completed / total) * 100));
      } catch (e) {
        // ignore
      }
    } else {
      // Default initial progress (12 tasks completed out of 12)
      setChecklistProgress(100);
    }
  };

  useEffect(() => {
    // Defer state update to next microtask to satisfy React linter rules
    Promise.resolve().then(updateProgress);
    
    // Set up window listener for localstorage changes so progress bar syncs in real-time
    const handleStorageChange = () => {
      updateProgress();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event polling since localStorage events don't fire on same window
    const interval = setInterval(updateProgress, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const navItems = [
    { id: 'architecture', label: 'Architecture Map', icon: Network },
    { id: 'apiexplorer', label: 'API Explorer', icon: Terminal },
    { id: 'schemas', label: 'Database Schemas', icon: Database },
    { id: 'analytics', label: 'Analytics Simulator', icon: LineChart },
    { id: 'checklist', label: 'Roadmap Checklist', icon: CheckSquare },
  ];

  return (
    <div className={`theme-${theme}`}>
      <div className="app-container">
        {/* Mobile Toggle Button */}
        <button 
          className="mobile-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {sidebarOpen ? <X style={{ width: '1.25rem', height: '1.25rem' }} /> : <Menu style={{ width: '1.25rem', height: '1.25rem' }} />}
        </button>

        {/* Left Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <div className="sidebar-logo">
              <ShoppingBag style={{ width: '1.4rem', height: '1.4rem', color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <span className="sidebar-title">ShopFlow SRS</span>
              <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '0.1rem' }}>
                Microservices Site
              </span>
            </div>
            
            {/* Theme Toggle Switcher */}
            <button 
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Theme Mode"
            >
              {theme === 'dark' ? <Sun style={{ width: '1rem', height: '1rem' }} /> : <Moon style={{ width: '1rem', height: '1rem' }} />}
            </button>
          </div>

          {/* Navigation list */}
          <nav style={{ flex: '1' }}>
            <ul className="sidebar-nav">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id} className="nav-item">
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false);
                      }}
                      className={`nav-link ${isActive ? 'active' : ''}`}
                      style={{ background: 'none', width: '100%', textAlign: 'left', border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent' }}
                    >
                      <Icon className="nav-link-icon" />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            
            {/* Progress bar in sidebar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem', fontWeight: '600' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Roadmap Progress</span>
                <span style={{ color: 'var(--primary)' }}>{checklistProgress}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--border-color)', borderRadius: '3px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${checklistProgress}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, var(--primary), var(--accent-purple))',
                    transition: 'width 0.4s ease' 
                  }} 
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Info style={{ width: '0.85rem', height: '0.85rem' }} />
              <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                RANBIDGE Solutions Pvt. Ltd.
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Render and toggle visibility to preserve internal states */}
          <div style={{ display: activeTab === 'architecture' ? 'block' : 'none' }}>
            <Architecture />
          </div>
          <div style={{ display: activeTab === 'apiexplorer' ? 'block' : 'none' }}>
            <ApiExplorer />
          </div>
          <div style={{ display: activeTab === 'schemas' ? 'block' : 'none' }}>
            <SchemaViewer />
          </div>
          <div style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}>
            <DashboardSimulator />
          </div>
          <div style={{ display: activeTab === 'checklist' ? 'block' : 'none' }}>
            <Checklist />
          </div>
        </main>
      </div>
    </div>
  );
}
