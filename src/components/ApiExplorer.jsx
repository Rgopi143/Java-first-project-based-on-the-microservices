import React, { useState } from 'react';
import { Send, Key, CheckCircle2, AlertCircle, RefreshCw, Layers, ShieldCheck, Cpu } from 'lucide-react';

export default function ApiExplorer() {
  const [selectedMethod, setSelectedMethod] = useState('GET');
  const [selectedPath, setSelectedPath] = useState('/api/products');
  const [tokenType, setTokenType] = useState('none'); // none, user, admin
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestTab, setRequestTab] = useState('headers'); // headers, body, params

  const endpoints = [
    { method: 'GET', path: '/api/products', auth: 'Public', desc: 'Retrieve list of all active products', body: null, params: [{ key: 'featured', value: 'true' }] },
    { method: 'GET', path: '/api/products/shopflow-runner-alpha', auth: 'Public', desc: 'Fetch details for a specific product by slug', body: null, params: [] },
    { method: 'GET', path: '/api/products/categories', auth: 'Public', desc: 'Retrieve product categories list', body: null, params: [] },
    { method: 'POST', path: '/api/products', auth: 'Admin JWT', desc: 'Create or update a product catalog entry', body: JSON.stringify({ name: 'Speed-Runner Beta', slug: 'runner-beta', price: 4299, stock: 15, category_id: 'cat-shoes', is_featured: true, is_active: true }, null, 2), params: [] },
    { method: 'GET', path: '/api/cart/user_98231', auth: 'User/Admin JWT', desc: 'Retrieve active shopping cart items', body: null, params: [] },
    { method: 'POST', path: '/api/cart', auth: 'Authenticated JWT', desc: 'Add item to user cart', body: JSON.stringify({ userId: 'user_98231', product: { id: 'prod-993' }, quantity: 2 }, null, 2), params: [] },
    { method: 'POST', path: '/api/orders', auth: 'Authenticated JWT', desc: 'Submit cart for order processing', body: JSON.stringify({ userId: 'user_98231', paymentMethod: 'credit_card', shippingAddress: { street: '12 Main Road', city: 'Mumbai', zip: '400001' } }, null, 2), params: [] },
    { method: 'GET', path: '/api/recommendations/user_98231', auth: 'Public / Personalized', desc: 'Retrieve AI-driven suggestions based on click telemetry', body: null, params: [] }
  ];

  const mockResponses = {
    '/api/products': {
      status: 200,
      statusText: 'OK',
      data: [
        { id: 'demo-1', name: 'Premium Leather Boots', slug: 'leather-boots', price: 5499, compare_price: 7999, stock: 12, rating: 4.8, reviews_count: 34, is_featured: true },
        { id: 'demo-2', name: 'ShopFlow Speed-Runner Alpha', slug: 'shopflow-runner-alpha', price: 3499, compare_price: 5999, stock: 45, rating: 4.9, reviews_count: 128, is_featured: true },
        { id: 'demo-3', name: 'Ergonomic Desk Chair', slug: 'ergonomic-chair', price: 12999, compare_price: 18999, stock: 5, rating: 4.6, reviews_count: 19, is_featured: false }
      ]
    },
    '/api/products/shopflow-runner-alpha': {
      status: 200,
      statusText: 'OK',
      data: {
        id: 'demo-2',
        name: 'ShopFlow Speed-Runner Alpha',
        slug: 'shopflow-runner-alpha',
        description: 'Elite athletic footwear featuring mesh upper panels, responsive foam cushioning, and high-traction rubber outsoles.',
        price: 3499,
        compare_price: 5999,
        stock: 45,
        rating: 4.9,
        reviews_count: 128,
        is_featured: true,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff']
      }
    },
    '/api/products/categories': {
      status: 200,
      statusText: 'OK',
      data: [
        { id: 'cat-footwear', name: 'Footwear', slug: 'footwear', description: 'Shoes and athletic boots' },
        { id: 'cat-office', name: 'Office Furniture', slug: 'office', description: 'Ergonomic tables and seating options' }
      ]
    },
    'POST:/api/products': {
      admin: {
        status: 201,
        statusText: 'Created',
        data: { id: 'new-prod-43', name: 'Speed-Runner Beta', slug: 'runner-beta', price: 4299, stock: 15, rating: 0, reviews_count: 0, created_at: '2026-06-06T08:15:00Z' }
      },
      unauthorized: {
        status: 401,
        statusText: 'Unauthorized',
        error: 'Authentication failed',
        message: 'Full authentication is required to access this resource (Supabase JWT verified, but role claim was not ADMIN).'
      }
    },
    '/api/cart/user_98231': {
      auth: {
        status: 200,
        statusText: 'OK',
        data: [
          { id: 'cart-item-1', product_id: 'demo-2', quantity: 1, product: { name: 'ShopFlow Speed-Runner Alpha', price: 3499 } }
        ]
      },
      unauthorized: {
        status: 401,
        statusText: 'Unauthorized',
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Provide a valid Supabase Bearer JWT.'
      }
    },
    'POST:/api/cart': {
      auth: {
        status: 201,
        statusText: 'Created',
        data: { id: 'cart-item-2', user_id: 'user_98231', product_id: 'prod-993', quantity: 2, created_at: '2026-06-06T08:16:00Z' }
      },
      unauthorized: {
        status: 401,
        statusText: 'Unauthorized',
        error: 'Unauthorized',
        message: 'Missing token. Cannot modify shopping cart.'
      }
    },
    '/api/orders': {
      auth: {
        status: 201,
        statusText: 'Created',
        data: {
          id: 'ord-8a8b8c8d8e',
          user_id: 'user_98231',
          total: 10497,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'credit_card',
          shipping_address: { street: '12 Main Road', city: 'Mumbai', zip: '400001' },
          created_at: '2026-06-06T08:17:00Z'
        }
      },
      unauthorized: {
        status: 401,
        statusText: 'Unauthorized',
        error: 'Unauthorized',
        message: 'Checkout requires a validated Supabase user authentication principal.'
      }
    },
    '/api/recommendations/user_98231': {
      status: 200,
      statusText: 'OK',
      data: {
        userId: 'user_98231',
        algorithm: 'collaborative_filtering_plus_clickstream',
        suggestedProducts: [
          { id: 'demo-1', name: 'Premium Leather Boots', price: 5499, matchConfidence: '94%' },
          { id: 'demo-3', name: 'Ergonomic Desk Chair', price: 12999, matchConfidence: '82%' }
        ]
      }
    }
  };

  const activeEndpoint = endpoints.find(ep => ep.method === selectedMethod && ep.path === selectedPath) || endpoints[0];

  const handleEndpointSelect = (ep) => {
    setSelectedMethod(ep.method);
    setSelectedPath(ep.path);
    setRequestBody(ep.body || '');
    setResponse(null);
    if (ep.method === 'POST') {
      setRequestTab('body');
    } else {
      setRequestTab('headers');
    }
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);

    const targetUrl = `http://localhost:8080${selectedPath}`;
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    if (tokenType !== 'none') {
      headers['Authorization'] = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${tokenType === 'admin' ? 'admin_claim' : 'user_claim'}`;
    }

    try {
      const options = {
        method: selectedMethod,
        headers: headers
      };
      if (selectedMethod === 'POST' && requestBody) {
        options.body = requestBody;
      }

      // Try actual HTTP network request to localized service gateway
      const res = await fetch(targetUrl, options);
      const contentType = res.headers.get('content-type');
      const data = contentType && contentType.includes('application/json') ? await res.json() : await res.text();
      
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data: data
      });
      setLoading(false);
    } catch (err) {
      // Fallback to simulated response if no backend server runs on localhost:8080
      setTimeout(() => {
        let resp = null;
        
        if (selectedMethod === 'GET') {
          const routeData = mockResponses[selectedPath];
          if (routeData) {
            if (selectedPath.startsWith('/api/cart/')) {
              resp = tokenType === 'none' ? mockResponses[selectedPath].unauthorized : mockResponses[selectedPath].auth;
            } else {
              resp = routeData;
            }
          }
        } else if (selectedMethod === 'POST') {
          if (selectedPath === '/api/products') {
            resp = tokenType === 'admin' ? mockResponses['POST:/api/products'].admin : mockResponses['POST:/api/products'].unauthorized;
          } else if (selectedPath === '/api/cart') {
            resp = tokenType !== 'none' ? mockResponses['POST:/api/cart'].auth : mockResponses['POST:/api/cart'].unauthorized;
          } else if (selectedPath === '/api/orders') {
            resp = tokenType !== 'none' ? mockResponses['/api/orders'].auth : mockResponses['/api/orders'].unauthorized;
          }
        }
        
        if (!resp) {
          resp = {
            status: 404,
            statusText: 'Not Found',
            error: 'Resource not found',
            message: `Endpoint ${selectedMethod} ${selectedPath} is not registered on the Gateway Router.`
          };
        }
        
        setResponse(resp);
        setLoading(false);
      }, 700);
    }
  };

  const renderJsonHighlight = (jsonObj) => {
    const rawString = JSON.stringify(jsonObj, null, 2);
    return rawString.split('\n').map((line, idx) => {
      // Basic JSON formatting styles
      let color = '#a7f3d0'; // values
      if (line.includes('":')) {
        // Line has key and value
        const parts = line.split('":');
        return (
          <div key={idx} style={{ fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#818cf8' }}>{parts[0]}":</span>
            <span style={{ color: '#60a5fa' }}>{parts[1]}</span>
          </div>
        );
      }
      return (
        <div key={idx} style={{ color: '#94a3b8', fontFamily: 'var(--font-mono)' }}>{line}</div>
      );
    });
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-purple" style={{ marginBottom: '0.8rem' }}>Interactive Sandbox</span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.6rem' }}>
          API Sandbox Playground
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Simulate frontend HTTP requests routed through the Spring Cloud API Gateway. Test authentication scopes using synthetic Supabase Bearer tokens.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '2rem' }} className="grid-cols-2">
        
        {/* Endpoint List */}
        <div className="glass-card" style={{ padding: '1.5rem', margin: '0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem', letterSpacing: '0.05em' }}>
            GATEWAY ROUTER MAP
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', overflowY: 'auto', maxHeight: '480px', paddingRight: '0.2rem' }}>
            {endpoints.map((ep, idx) => {
              const isSelected = selectedMethod === ep.method && selectedPath === ep.path;
              const isGet = ep.method === 'GET';
              return (
                <div 
                  key={idx} 
                  onClick={() => handleEndpointSelect(ep)}
                  style={{
                    padding: '0.9rem',
                    borderRadius: '0.75rem',
                    backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                    border: '1px solid',
                    borderColor: isSelected ? 'rgba(59, 130, 246, 0.25)' : 'var(--border-color)',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                  className="endpoint-item"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span 
                      style={{ 
                        fontSize: '0.65rem', 
                        fontWeight: '800', 
                        padding: '0.15rem 0.4rem', 
                        borderRadius: '0.25rem',
                        backgroundColor: isGet ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: isGet ? 'var(--accent-emerald)' : 'var(--primary)'
                      }}
                    >
                      {ep.method}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {ep.path}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {ep.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Console */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          
          {/* Controls Card */}
          <div className="glass-card" style={{ padding: '1.8rem', margin: '0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Request input bar */}
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.4rem' }}>
                HTTP Request Dispatcher
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.6rem 1rem',
                  backgroundColor: selectedMethod === 'GET' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                  color: selectedMethod === 'GET' ? 'var(--accent-emerald)' : 'var(--primary)',
                  fontWeight: '800',
                  fontSize: '0.85rem',
                  borderRadius: '0.6rem 0 0 0.6rem',
                  border: '1px solid var(--border-color)',
                  borderRight: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {selectedMethod}
                </span>
                
                <div style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.6rem 1rem', border: '1px solid var(--border-color)', fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>http://localhost:8080</span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '600' }}>{selectedPath}</span>
                </div>

                <button
                  onClick={handleSend}
                  disabled={loading}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '0 1.5rem',
                    fontSize: '0.88rem',
                    fontWeight: '600',
                    borderRadius: '0 0.6rem 0.6rem 0',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <Send style={{ width: '0.9rem', height: '0.9rem' }} /> {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>

            {/* JWT Configuration Selector */}
            <div>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '0.5rem' }}>
                Authorization Bearer Role
              </label>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {[
                  { id: 'none', label: 'Guest (No Token)', desc: 'Public routes only' },
                  { id: 'user', label: 'User JWT Token', desc: 'Access private user data' },
                  { id: 'admin', label: 'Admin JWT Token', desc: 'Full configuration access' }
                ].map(auth => (
                  <button
                    key={auth.id}
                    onClick={() => setTokenType(auth.id)}
                    style={{
                      padding: '0.6rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      borderRadius: '0.6rem',
                      border: '1px solid',
                      borderColor: tokenType === auth.id ? 'var(--primary)' : 'var(--border-color)',
                      backgroundColor: tokenType === auth.id ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                      color: tokenType === auth.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                      textAlign: 'left',
                      flex: '1',
                      minWidth: '160px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Key style={{ width: '0.85rem', height: '0.85rem', color: tokenType === auth.id ? 'var(--primary)' : 'var(--text-muted)' }} />
                      <span>{auth.label}</span>
                    </div>
                    <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.15rem', fontWeight: '400' }}>
                      {auth.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Parameter Tabs */}
            <div>
              <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', marginBottom: '0.8rem' }}>
                {['headers', 'params', 'body'].map(tab => {
                  const showTab = tab !== 'body' || selectedMethod === 'POST';
                  if (!showTab) return null;
                  return (
                    <button
                      key={tab}
                      onClick={() => setRequestTab(tab)}
                      style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: requestTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                        borderBottom: requestTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                        padding: '0.3rem 0.8rem',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        textTransform: 'capitalize'
                      }}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Tab Outputs */}
              {requestTab === 'headers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', padding: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Accept:</span>
                    <span style={{ color: 'var(--text-primary)' }}>application/json</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Content-Type:</span>
                    <span style={{ color: 'var(--text-primary)' }}>application/json</span>
                  </div>
                  {tokenType !== 'none' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                      <span>Authorization:</span>
                      <span style={{ color: 'var(--primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.{tokenType === 'admin' ? 'admin_claim' : 'user_claim'}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {requestTab === 'params' && (
                <div style={{ padding: '0.5rem', fontSize: '0.78rem' }}>
                  {activeEndpoint.params && activeEndpoint.params.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                      {activeEndpoint.params.map((p, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                          <span>{p.key}:</span>
                          <span style={{ color: 'var(--text-primary)' }}>{p.value}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>No query parameters needed for this path.</span>
                  )}
                </div>
              )}

              {requestTab === 'body' && selectedMethod === 'POST' && (
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  style={{
                    width: '100%',
                    height: '110px',
                    backgroundColor: 'var(--code-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.6rem',
                    padding: '0.8rem',
                    color: '#60a5fa',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    resize: 'none',
                    lineHeight: '1.4'
                  }}
                />
              )}
            </div>

          </div>

          {/* Response Displays */}
          <div className="glass-card" style={{ flex: '1', margin: '0', padding: '1.8rem', minHeight: '260px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.6rem' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                CLIENT RESPONSE INGEST
              </h3>
              {response && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {response.status < 300 ? (
                    <CheckCircle2 style={{ width: '0.95rem', height: '0.95rem', color: 'var(--accent-emerald)' }} />
                  ) : (
                    <AlertCircle style={{ width: '0.95rem', height: '0.95rem', color: 'var(--accent-rose)' }} />
                  )}
                  <span style={{ fontSize: '0.8rem', fontWeight: '800', color: response.status < 300 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                    Status: {response.status} {response.statusText}
                  </span>
                </div>
              )}
            </div>

            {loading ? (
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', minHeight: '180px' }}>
                <RefreshCw style={{ width: '1.8rem', height: '1.8rem', color: 'var(--primary)' }} className="animate-spin" />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Awaiting gateway routing execution...</span>
              </div>
            ) : response ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Simulated Response Metadata Headers */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.6rem 0.8rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.72rem', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Content-Type</span>
                    <span style={{ color: 'var(--text-primary)' }}>application/json</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'var(--text-muted)' }}>X-Response-Time</span>
                    <span style={{ color: 'var(--accent-emerald)' }}>14ms</span>
                  </div>
                </div>

                {/* Response Code Block */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="code-block-header">
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Response Body</span>
                    <span className="badge badge-emerald" style={{ fontSize: '0.62rem', padding: '0.1rem 0.4rem' }}>json</span>
                  </div>
                  <pre className="code-block" style={{ margin: 0, maxHeight: '200px', overflowY: 'auto' }}>
                    {renderJsonHighlight(response.data || response)}
                  </pre>
                </div>

              </div>
            ) : (
              <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', minHeight: '180px' }}>
                Press "Send" to dispatch simulated REST request to the cloud endpoint.
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
