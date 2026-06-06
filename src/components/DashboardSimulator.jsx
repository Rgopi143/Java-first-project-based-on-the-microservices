import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, PlusCircle, Activity, Users, ShoppingCart, RefreshCw, Sparkles, Sliders, ArrowRight, Layers, FileText } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export default function DashboardSimulator() {
  const [isActive, setIsActive] = useState(true);
  const [simulationSpeed, setSimulationSpeed] = useState(2000); // ms
  const [filterType, setFilterType] = useState('all');
  const [logs, setLogs] = useState([]);
  const [customUser, setCustomUser] = useState('user_98231');
  const [customAction, setCustomAction] = useState('click');
  const [customProduct, setCustomProduct] = useState('ShopFlow Speed-Runner Alpha');
  
  // Running charts timeline tracking
  const [timeline, setTimeline] = useState([
    { name: '10s', Ingested: 15 },
    { name: '20s', Ingested: 22 },
    { name: '30s', Ingested: 19 },
    { name: '40s', Ingested: 28 },
    { name: '50s', Ingested: 35 },
    { name: '60s', Ingested: 42 },
    { name: '70s', Ingested: 51 },
  ]);

  const [chartData, setChartData] = useState({
    view: 24,
    click: 15,
    cart_add: 8,
    purchase: 4
  });

  const [metrics, setMetrics] = useState({
    eventsIngested: 51,
    activeSessions: 124,
    cartConversions: 12,
    avgLatency: 8.5
  });
  
  const [recommendations, setRecommendations] = useState([
    { id: 'demo-1', name: 'Premium Leather Boots', category: 'Footwear', score: 0.942 },
    { id: 'demo-2', name: 'ShopFlow Speed-Runner Alpha', category: 'Footwear', score: 0.898 },
    { id: 'demo-3', name: 'Ergonomic Desk Chair', category: 'Furniture', score: 0.824 }
  ]);

  const consoleContainerRef = useRef(null);

  const productNames = [
    'Premium Leather Boots',
    'ShopFlow Speed-Runner Alpha',
    'Ergonomic Desk Chair',
    'Wireless Noise-Canceling Headphones',
    'Smart Fitness Band Pro',
    'Minimalist Leather Wallet',
    'Mechanical Gaming Keyboard'
  ];

  const actions = ['view', 'click', 'cart_add', 'purchase'];
  const userIds = ['user_98231', 'user_11942', 'user_38210', 'user_77194', 'user_88201'];

  const filteredLogs = logs.filter(log => filterType === 'all' || log.type === filterType);

  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [filteredLogs]);

  // Event loop
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      const user = userIds[Math.floor(Math.random() * userIds.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const product = productNames[Math.floor(Math.random() * productNames.length)];
      const timestamp = new Date().toLocaleTimeString();

      let eventIcon = '📄';
      if (action === 'click') eventIcon = '🖱️';
      if (action === 'cart_add') eventIcon = '🛒';
      if (action === 'purchase') eventIcon = '💰';
      if (action === 'view') eventIcon = '👁️';

      const newLog = {
        id: Math.random().toString(36).substring(7),
        icon: eventIcon,
        type: action,
        text: `Telemetry: User ${user} ${action.replace('_', ' ')}ed "${product}"`,
        raw: { user, action, product, time: new Date().toISOString() }
      };

      setLogs(prev => [...prev.slice(-30), newLog]);

      // Update Chart Frequency
      setChartData(prev => ({
        ...prev,
        [action]: prev[action] + 1
      }));

      // Update Metrics
      setMetrics(prev => {
        const addedEvents = 1;
        const isCart = action === 'cart_add' ? 1 : 0;
        const isPurchase = action === 'purchase' ? 1 : 0;
        const nextIngested = prev.eventsIngested + addedEvents;

        // Add telemetry point to the chart timeline occasionally
        setTimeline(tPrev => {
          const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
          const delta = Math.floor(Math.random() * 6) + 4; // simulated processing rate
          return [...tPrev.slice(-8), { name: nextTime, Ingested: delta }];
        });
        
        return {
          eventsIngested: nextIngested,
          activeSessions: prev.activeSessions + (Math.random() > 0.85 ? (Math.random() > 0.5 ? 1 : -1) : 0),
          cartConversions: prev.cartConversions + isCart + isPurchase,
          avgLatency: parseFloat((8.2 + Math.random() * 0.7).toFixed(1))
        };
      });

      // Update recommendations
      if (Math.random() > 0.5) {
        setRecommendations(prev => {
          return prev.map(rec => {
            const delta = Math.random() * 0.03 - 0.015;
            let newScore = parseFloat((rec.score + delta).toFixed(3));
            if (newScore > 0.99) newScore = 0.99;
            if (newScore < 0.65) newScore = 0.65;
            return { ...rec, score: newScore };
          }).sort((a, b) => b.score - a.score);
        });
      }

    }, simulationSpeed);

    return () => clearInterval(interval);
  }, [isActive, simulationSpeed]);

  const handleInjectCustom = (e) => {
    e.preventDefault();
    const timestamp = new Date().toLocaleTimeString();
    
    let eventIcon = '📄';
    if (customAction === 'click') eventIcon = '🖱️';
    if (customAction === 'cart_add') eventIcon = '🛒';
    if (customAction === 'purchase') eventIcon = '💰';
    if (customAction === 'view') eventIcon = '👁️';

    const newLog = {
      id: Math.random().toString(36).substring(7),
      icon: eventIcon,
      type: customAction,
      text: `Telemetry (INJECTED): User ${customUser} ${customAction.replace('_', ' ')}ed "${customProduct}"`,
      raw: { user: customUser, action: customAction, product: customProduct, time: new Date().toISOString() }
    };

    setLogs(prev => [...prev, newLog]);

    // Recalculate chart data
    setChartData(prev => ({
      ...prev,
      [customAction]: prev[customAction] + 1
    }));

    // Instantly affect recommendations
    setRecommendations(prev => {
      return prev.map((rec) => {
        if (customProduct.toLowerCase().includes(rec.name.toLowerCase().split(' ')[1] || 'boots')) {
          return { ...rec, score: Math.min(0.99, parseFloat((rec.score + 0.045).toFixed(3))) };
        }
        return rec;
      }).sort((a, b) => b.score - a.score);
    });

    setMetrics(prev => ({
      ...prev,
      eventsIngested: prev.eventsIngested + 1,
      cartConversions: prev.cartConversions + (customAction === 'cart_add' || customAction === 'purchase' ? 1 : 0)
    }));
  };

  // Conversion calculations
  const totalViews = chartData.view || 1;
  const clickRatio = Math.round((chartData.click / totalViews) * 100);
  const cartRatio = Math.round((chartData.cart_add / totalViews) * 100);
  const purchaseRatio = Math.round((chartData.purchase / totalViews) * 100);

  // Data mapping for Recharts Pie
  const pieData = [
    { name: 'Views', value: chartData.view, color: '#3b82f6' },
    { name: 'Clicks', value: chartData.click, color: '#8b5cf6' },
    { name: 'Cart Adds', value: chartData.cart_add, color: '#10b981' },
    { name: 'Purchases', value: chartData.purchase, color: '#f59e0b' }
  ];

  const getActionColor = (type) => {
    switch (type) {
      case 'view': return 'var(--primary)';
      case 'click': return 'var(--accent-purple)';
      case 'cart_add': return 'var(--accent-emerald)';
      case 'purchase': return 'var(--accent-amber)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-emerald" style={{ marginBottom: '0.8rem' }}>Interactive Simulation</span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.6rem' }}>
          Real-Time Analytics Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Interact with the live stream processing engine. Inject custom events, filter specific telemetry action logs, adjust simulation speeds, and watch the recommendation weights recalibrate instantly.
        </p>
      </div>

      {/* Control Panel: Simulation variables */}
      <div className="glass-card" style={{ padding: '1.25rem 1.8rem', margin: '0', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Speed Slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1', minWidth: '260px' }}>
          <Sliders style={{ width: '1.2rem', height: '1.2rem', color: 'var(--primary)' }} />
          <div style={{ flex: '1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '600', marginBottom: '0.3rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Simulation Ingestion Speed</span>
              <span style={{ color: 'var(--primary)' }}>{simulationSpeed / 1000}s per event</span>
            </div>
            <input 
              type="range" 
              min="500" 
              max="5000" 
              step="500"
              value={simulationSpeed} 
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button 
            onClick={() => setIsActive(!isActive)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: isActive ? 'rgba(220, 38, 38, 0.08)' : 'rgba(5, 150, 105, 0.08)',
              color: isActive ? 'var(--accent-rose)' : 'var(--accent-emerald)',
              border: '1px solid',
              borderColor: isActive ? 'rgba(220, 38, 38, 0.2)' : 'rgba(5, 150, 105, 0.2)',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.6rem',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            {isActive ? <Pause style={{ width: '0.9rem', height: '0.9rem' }} /> : <Play style={{ width: '0.9rem', height: '0.9rem' }} />}
            {isActive ? 'Pause Simulator' : 'Start Simulator'}
          </button>
          <button 
            onClick={() => {
              setLogs([]);
              setChartData({ click: 0, view: 0, cart_add: 0, purchase: 0 });
              setMetrics(prev => ({ ...prev, eventsIngested: 0, cartConversions: 0 }));
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-color)',
              padding: '0.6rem 1.2rem',
              borderRadius: '0.6rem',
              fontSize: '0.85rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'var(--transition-fast)'
            }}
          >
            <RefreshCw style={{ width: '0.9rem', height: '0.9rem' }} /> Clear Stats
          </button>
        </div>
      </div>

      {/* Metrics & Graph Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="grid-cols-2">
        
        {/* Real-time telemetry metrics */}
        <div className="glass-card" style={{ margin: '0', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Activity style={{ width: '1.1rem', height: '1.1rem', color: 'var(--primary)' }} /> Live Network Metrics
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Ingested Streams</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.eventsIngested}</span>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Active Users</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.activeSessions}</span>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Conversions</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)' }}>{metrics.cartConversions}</span>
            </div>
            <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Ingest Latency</span>
              <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>{metrics.avgLatency} ms</span>
            </div>
          </div>
        </div>

        {/* Real-time Ingestion Area Chart */}
        <div className="glass-card" style={{ margin: '0', padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            <Activity style={{ width: '1.1rem', height: '1.1rem', color: 'var(--primary)' }} /> Processing Stream Rate (events/sec)
          </h3>
          
          <div style={{ width: '100%', height: '150px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={9} />
                <YAxis stroke="var(--text-muted)" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontSize: '11px' }} />
                <Area type="monotone" dataKey="Ingested" stroke="var(--primary)" fillOpacity={1} fill="url(#colorIngested)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Funnel & Pie Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }} className="grid-cols-2">
        
        {/* Dynamic Funnel */}
        <div className="glass-card" style={{ margin: 0, padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700' }}>
            🛒 Conversion Funnel Insight
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center', flex: 1 }}>
            {[
              { label: 'Page Views', count: chartData.view, percent: 100, color: 'var(--primary)' },
              { label: 'Item Clicks', count: chartData.click, percent: clickRatio, color: 'var(--accent-purple)' },
              { label: 'Cart Adds', count: chartData.cart_add, percent: cartRatio, color: 'var(--accent-emerald)' },
              { label: 'Purchases', count: chartData.purchase, percent: purchaseRatio, color: 'var(--accent-amber)' }
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '90px', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-secondary)' }}>{step.label}</div>
                <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.1)', height: '24px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)', position: 'relative' }}>
                  <div style={{ width: `${step.percent}%`, backgroundColor: step.color, height: '100%', transition: 'width 0.4s ease' }} />
                  <span style={{ position: 'absolute', right: '10px', top: '2px', fontSize: '0.72rem', fontWeight: '700', color: 'white', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {step.count} ({step.percent}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Pie Volume */}
        <div className="glass-card" style={{ margin: 0, padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', alignSelf: 'flex-start' }}>
            📊 Telemetry Distribution
          </h3>
          
          <div style={{ width: '100%', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-primary)', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Custom Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem', fontWeight: '600' }}>
              {pieData.map((d, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: d.color, display: 'inline-block' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{d.name}: {d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Main logs & Recommendation layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem' }} className="grid-cols-2">
        
        {/* Terminal clickstream log */}
        <div className="glass-card" style={{ padding: '1.8rem', margin: '0', display: 'flex', flexDirection: 'column', gap: '1rem', height: '500px', minHeight: '500px', maxHeight: '500px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.8rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: isActive ? 'var(--accent-rose)' : 'var(--text-muted)', borderRadius: '50%', display: 'inline-block' }} />
              Live Ingest Stream Console
            </h3>
            
            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.2rem', backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
              {['all', 'view', 'click', 'cart_add', 'purchase'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  style={{
                    backgroundColor: filterType === tab ? 'var(--bg-card)' : 'transparent',
                    border: 'none',
                    color: filterType === tab ? 'var(--primary)' : 'var(--text-secondary)',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: '600',
                    borderRadius: '0.35rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab === 'cart_add' ? 'Cart' : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Console Output */}
          <div 
            ref={consoleContainerRef}
            style={{
              backgroundColor: 'var(--code-bg)',
              borderRadius: '0.6rem',
              padding: '1rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              overflowY: 'auto',
              height: '180px',
              minHeight: '180px',
              maxHeight: '180px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem'
            }}
          >
            {filteredLogs.length === 0 ? (
              <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                {filterType === 'all' ? 'System idle. Events will print here...' : `No events matching filter: "${filterType}"`}
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} style={{ display: 'flex', gap: '0.5rem', lineHeight: '1.4', borderBottom: '1px solid rgba(255,255,255,0.01)', paddingBottom: '0.2rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>[{new Date(log.raw.time).toLocaleTimeString()}]</span>
                  <span style={{ color: getActionColor(log.type), fontWeight: '700', fontSize: '0.75rem' }}>{log.type.toUpperCase()}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>User:</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{log.raw.user}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>Item:</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>{log.raw.product}</span>
                </div>
              ))
            )}
          </div>

          {/* Manual Telemetry Injection Form */}
          <form onSubmit={handleInjectCustom} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', display: 'block' }}>
              Custom Telemetry Injector
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>User Identifier</label>
                <select 
                  value={customUser} 
                  onChange={(e) => setCustomUser(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '0.35rem', fontSize: '0.78rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                >
                  {userIds.map(id => <option key={id} value={id}>{id}</option>)}
                </select>
              </div>
              
              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Behavior Action</label>
                <select 
                  value={customAction} 
                  onChange={(e) => setCustomAction(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '0.35rem', fontSize: '0.78rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                >
                  {actions.map(act => <option key={act} value={act}>{act}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '0.2rem' }}>Catalog Product</label>
                <select 
                  value={customProduct} 
                  onChange={(e) => setCustomProduct(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '0.35rem', fontSize: '0.78rem', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}
                >
                  {productNames.map(prod => <option key={prod} value={prod}>{prod}</option>)}
                </select>
              </div>
            </div>
            
            <button 
              type="submit"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '0.6rem 1rem',
                borderRadius: '0.5rem',
                fontSize: '0.825rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <PlusCircle style={{ width: '0.9rem', height: '0.9rem' }} /> Inject Stream Event
            </button>
          </form>
        </div>

        {/* Real-time Recommendations List */}
        <div className="glass-card" style={{ padding: '1.8rem', margin: '0', display: 'flex', flexDirection: 'column', gap: '1rem', height: '500px', minHeight: '500px', maxHeight: '500px' }}>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: '700' }}>
            <Sparkles style={{ width: '1.1rem', height: '1.1rem', color: 'var(--accent-amber)' }} /> ML Suggestion Feed
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            Dynamic recommendation weights updating as the telemetry pipeline captures preferences.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', flex: 1, overflowY: 'auto', paddingRight: '0.2rem' }}>
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                className="glass-card" 
                style={{ 
                  margin: '0', 
                  padding: '0.85rem 1rem', 
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.6rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                    {rec.category}
                  </span>
                  <span className="badge badge-purple" style={{ fontSize: '0.6rem', padding: '0.05rem 0.35rem' }}>
                    {(rec.score * 100).toFixed(0)}% Match
                  </span>
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', display: 'block', margin: '0.2rem 0' }}>
                  {rec.name}
                </span>
                
                {/* Score slider indicator */}
                <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '0.4rem' }}>
                  <div style={{ width: `${rec.score * 100}%`, height: '100%', backgroundColor: 'var(--accent-amber)', borderRadius: '2px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
