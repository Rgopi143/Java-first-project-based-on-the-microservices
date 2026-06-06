import React, { useState } from 'react';
import { Database, Table, FileText, Share2, Clipboard, Check } from 'lucide-react';

export default function SchemaViewer() {
  const [selectedDb, setSelectedDb] = useState('postgres');
  const [selectedTable, setSelectedTable] = useState('products');
  const [schemaViewTab, setSchemaViewTab] = useState('columns'); // columns, ddl
  const [copied, setCopied] = useState(false);

  const databaseSchemas = {
    postgres: {
      name: 'PostgreSQL Relational DBs',
      desc: 'Used by Catalog Service and Order Service to maintain transactional ACID consistency. Schema tables are linked via foreign keys.',
      entities: {
        products: {
          title: 'products Table (Catalog DB)',
          description: 'Holds primary catalog items with inventory stock parameters.',
          ddl: `CREATE TABLE products (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  stock INT NOT NULL,
  category_id VARCHAR(36) REFERENCES categories(id),
  images VARCHAR(255)[],
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  reviews_count INT NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);`,
          columns: [
            { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: 'NO', extra: 'Primary Identifier' },
            { name: 'name', type: 'VARCHAR(255)', key: '', nullable: 'NO', extra: 'Product Display Name' },
            { name: 'slug', type: 'VARCHAR(255)', key: 'UNI', nullable: 'NO', extra: 'URL-friendly slug index' },
            { name: 'description', type: 'TEXT', key: '', nullable: 'YES', extra: 'Product description detail' },
            { name: 'price', type: 'DECIMAL(10,2)', key: '', nullable: 'NO', extra: 'Active selling price' },
            { name: 'compare_price', type: 'DECIMAL(10,2)', key: '', nullable: 'YES', extra: 'Original retail price' },
            { name: 'stock', type: 'INT', key: '', nullable: 'NO', extra: 'Quantity available' },
            { name: 'category_id', type: 'VARCHAR(36)', key: 'FK', nullable: 'YES', extra: 'References categories(id)' },
            { name: 'images', type: 'VARCHAR[]', key: '', nullable: 'YES', extra: 'Image URL paths array' },
            { name: 'rating', type: 'DECIMAL(2,1)', key: '', nullable: 'NO', extra: 'Average review score (0.0-5.0)' },
            { name: 'reviews_count', type: 'INT', key: '', nullable: 'NO', extra: 'Count of user reviews' },
            { name: 'is_featured', type: 'BOOLEAN', key: '', nullable: 'NO', extra: 'Featured status' },
            { name: 'is_active', type: 'BOOLEAN', key: '', nullable: 'NO', extra: 'Active listing status' }
          ]
        },
        categories: {
          title: 'categories Table (Catalog DB)',
          description: 'Holds categorical classification parameters.',
          ddl: `CREATE TABLE categories (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(500),
  image_url VARCHAR(1000)
);`,
          columns: [
            { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: 'NO', extra: 'Primary Identifier' },
            { name: 'name', type: 'VARCHAR(100)', key: '', nullable: 'NO', extra: 'Category name' },
            { name: 'slug', type: 'VARCHAR(100)', key: 'UNI', nullable: 'NO', extra: 'Category slug' },
            { name: 'description', type: 'VARCHAR(500)', key: '', nullable: 'YES', extra: 'Summary of category' },
            { name: 'image_url', type: 'VARCHAR(1000)', key: '', nullable: 'YES', extra: 'Banner image' }
          ]
        },
        orders: {
          title: 'orders Table (Order DB)',
          description: 'Records final shopping checkouts with transactional ledger states.',
          ddl: `CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  status VARCHAR(30) NOT NULL,
  total DECIMAL(12,2) NOT NULL,
  payment_method VARCHAR(30),
  payment_status VARCHAR(30) NOT NULL,
  notes VARCHAR(1000),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`,
          columns: [
            { name: 'id', type: 'VARCHAR(50)', key: 'PK', nullable: 'NO', extra: 'Primary order identifier' },
            { name: 'user_id', type: 'VARCHAR(50)', key: '', nullable: 'NO', extra: 'Owner customer id reference' },
            { name: 'status', type: 'VARCHAR(30)', key: '', nullable: 'NO', extra: 'Values: pending, processing, shipped, delivered, cancelled' },
            { name: 'total', type: 'DECIMAL(12,2)', key: '', nullable: 'NO', extra: 'Grand total invoice amount' },
            { name: 'payment_method', type: 'VARCHAR(30)', key: '', nullable: 'YES', extra: 'e.g. credit_card, stripe_intent' },
            { name: 'payment_status', type: 'VARCHAR(30)', key: '', nullable: 'NO', extra: 'Values: pending, paid, failed, refunded' },
            { name: 'notes', type: 'VARCHAR(1000)', key: '', nullable: 'YES', extra: 'Delivery notes' },
            { name: 'created_at', type: 'TIMESTAMP', key: '', nullable: 'NO', extra: 'Timestamp of checkout' }
          ]
        },
        order_items: {
          title: 'order_items Table (Order DB)',
          description: 'Independently maps purchased products inside an order ledger.',
          ddl: `CREATE TABLE order_items (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(50) REFERENCES orders(id),
  product_id VARCHAR(36) NOT NULL,
  quantity INT NOT NULL,
  price_at_purchase DECIMAL(10,2) NOT NULL
);`,
          columns: [
            { name: 'id', type: 'VARCHAR(36)', key: 'PK', nullable: 'NO', extra: 'Primary item ID' },
            { name: 'order_id', type: 'VARCHAR(50)', key: 'FK', nullable: 'NO', extra: 'References orders(id)' },
            { name: 'product_id', type: 'VARCHAR(36)', key: '', nullable: 'NO', extra: 'Product reference key' },
            { name: 'quantity', type: 'INT', key: '', nullable: 'NO', extra: 'Quantity bought' },
            { name: 'price_at_purchase', type: 'DECIMAL(10,2)', key: '', nullable: 'NO', extra: 'Price lock at checkout' }
          ]
        }
      }
    },
    mongodb: {
      name: 'MongoDB Document DB',
      desc: 'Used by Recommendation & Analytics Service to process heavy streams of clickstream telemetry and cache recommendation profiles.',
      entities: {
        user_events: {
          title: 'user_events Collection (Analytics DB)',
          description: 'Document structure collecting click, view, and shopping cart operations telemetry.',
          ddl: `{
  "$jsonSchema": {
    "bsonType": "object",
    "required": [ "userId", "sessionId", "eventType", "timestamp" ],
    "properties": {
      "userId": { "bsonType": "string" },
      "sessionId": { "bsonType": "string" },
      "eventType": { 
        "enum": [ "view", "click", "cart_add", "purchase" ] 
      },
      "eventMetadata": { 
        "bsonType": "object" 
      },
      "timestamp": { "bsonType": "date" }
    }
  }
}`,
          columns: [
            { name: '_id', type: 'ObjectId', key: 'PK', nullable: 'NO', extra: 'Unique MongoDB identifier' },
            { name: 'userId', type: 'String', key: 'Index', nullable: 'NO', extra: 'Target customer ID' },
            { name: 'sessionId', type: 'String', key: '', nullable: 'NO', extra: 'Session identifier tracking bounce rates' },
            { name: 'eventType', type: 'String', key: '', nullable: 'NO', extra: 'Values: view, click, cart_add, purchase' },
            { name: 'eventMetadata', type: 'Document', key: '', nullable: 'YES', extra: 'Context specific log fields' },
            { name: 'timestamp', type: 'Date', key: 'TTL Index', nullable: 'NO', extra: 'Time of telemetry ingestion (has TTL of 90 days)' }
          ]
        },
        recommendations: {
          title: 'recommendations Collection (Analytics DB)',
          description: 'Document schema caching pre-calculated matrix factorization suggestions profiles.',
          ddl: `{
  "$jsonSchema": {
    "bsonType": "object",
    "required": [ "userId", "algorithm", "recommendedProducts" ],
    "properties": {
      "userId": { "bsonType": "string" },
      "algorithm": { "bsonType": "string" },
      "recommendedProducts": {
        "bsonType": "array",
        "items": {
          "bsonType": "object",
          "required": [ "productId", "score" ],
          "properties": {
            "productId": { "bsonType": "string" },
            "score": { "bsonType": "double" }
          }
        }
      },
      "lastUpdated": { "bsonType": "date" }
    }
  }
}`,
          columns: [
            { name: '_id', type: 'ObjectId', key: 'PK', nullable: 'NO', extra: 'Unique identifier' },
            { name: 'userId', type: 'String', key: 'Index (Unique)', nullable: 'NO', extra: 'Target customer' },
            { name: 'algorithm', type: 'String', key: '', nullable: 'NO', extra: 'Algorithm variant model' },
            { name: 'recommendedProducts', type: 'Array(Doc)', key: '', nullable: 'NO', extra: 'Item ID list sorted by match relevance score' },
            { name: 'lastUpdated', type: 'Date', key: '', nullable: 'NO', extra: 'Timestamp of calculation compile' }
          ]
        }
      }
    }
  };

  const handleDbSelect = (dbKey) => {
    setSelectedDb(dbKey);
    const tableKeys = Object.keys(databaseSchemas[dbKey].entities);
    setSelectedTable(tableKeys[0]);
    setSchemaViewTab('columns');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentDb = databaseSchemas[selectedDb];
  const currentEntity = currentDb.entities[selectedTable];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <span className="badge badge-emerald" style={{ marginBottom: '0.8rem' }}>Database Schemas</span>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.6rem' }}>
          Database Schema Sandbox
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '750px' }}>
          Analyze database entities. This section isolates relational order/catalog tables from unstructured telemetry document collections, maintaining strict database-per-service boundaries.
        </p>
      </div>

      {/* DB Selector tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        {[
          { id: 'postgres', label: 'PostgreSQL (Relational DB)', icon: Database, color: 'var(--accent-emerald)' },
          { id: 'mongodb', label: 'MongoDB (NoSQL Document)', icon: FileText, color: 'var(--accent-amber)' }
        ].map(db => {
          const Icon = db.icon;
          const isActive = selectedDb === db.id;
          return (
            <button
              key={db.id}
              onClick={() => handleDbSelect(db.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                borderRadius: '0.6rem',
                border: '1px solid',
                borderColor: isActive ? db.color : 'var(--border-color)',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'var(--transition-fast)'
              }}
            >
              <Icon style={{ width: '1.1rem', height: '1.1rem', color: isActive ? db.color : 'var(--text-muted)' }} />
              {db.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }} className="grid-cols-2">
        
        {/* Table Selector */}
        <div className="glass-card" style={{ padding: '1.2rem', margin: '0', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
            ENTITIES / COLLECTIONS
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {Object.keys(currentDb.entities).map(entityKey => {
              const isActive = selectedTable === entityKey;
              return (
                <button
                  key={entityKey}
                  onClick={() => setSelectedTable(entityKey)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid',
                    borderColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.06)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    fontWeight: isActive ? '600' : '500',
                    cursor: 'pointer',
                    transition: 'var(--transition-fast)',
                    width: '100%'
                  }}
                >
                  <Table style={{ width: '0.95rem', height: '0.95rem', color: isActive ? 'var(--primary)' : 'var(--text-muted)' }} />
                  {entityKey}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schema details grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Table Description card */}
          <div className="glass-card" style={{ padding: '1.8rem', margin: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.6rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', fontWeight: '800' }}>
                  {currentEntity.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  {currentEntity.description}
                </p>
              </div>

              {/* Inspector Mode Selection */}
              <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'rgba(0,0,0,0.1)', padding: '0.2rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                {[
                  { id: 'columns', label: 'Columns Schema' },
                  { id: 'ddl', label: selectedDb === 'postgres' ? 'DDL Script' : 'JSON Validator' }
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setSchemaViewTab(view.id)}
                    style={{
                      backgroundColor: schemaViewTab === view.id ? 'var(--bg-card)' : 'transparent',
                      border: 'none',
                      color: schemaViewTab === view.id ? 'var(--primary)' : 'var(--text-secondary)',
                      padding: '0.3rem 0.8rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      borderRadius: '0.4rem',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {view.label}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Columns Table View */}
            {schemaViewTab === 'columns' ? (
              <div style={{ overflowX: 'auto', marginTop: '1.2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1.5px solid var(--border-color)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '0.6rem 0.4rem', fontWeight: '700' }}>Field Name</th>
                      <th style={{ padding: '0.6rem 0.4rem', fontWeight: '700' }}>Data Type</th>
                      <th style={{ padding: '0.6rem 0.4rem', fontWeight: '700', textAlign: 'center' }}>Key</th>
                      <th style={{ padding: '0.6rem 0.4rem', fontWeight: '700', textAlign: 'center' }}>Null</th>
                      <th style={{ padding: '0.6rem 0.4rem', fontWeight: '700' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEntity.columns.map((col, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                        <td style={{ padding: '0.75rem 0.4rem', fontFamily: 'var(--font-mono)', fontWeight: '600', color: 'var(--text-primary)' }}>{col.name}</td>
                        <td style={{ padding: '0.75rem 0.4rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--primary)' }}>{col.type}</td>
                        <td style={{ padding: '0.75rem 0.4rem', textAlign: 'center' }}>
                          {col.key && (
                            <span style={{ 
                              fontSize: '0.62rem', 
                              fontWeight: '800', 
                              padding: '0.1rem 0.35rem', 
                              borderRadius: '0.25rem',
                              backgroundColor: col.key === 'PK' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(124, 58, 237, 0.15)',
                              color: col.key === 'PK' ? 'var(--accent-emerald)' : 'var(--accent-purple)'
                            }}>
                              {col.key}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem 0.4rem', textAlign: 'center', fontSize: '0.8rem', color: col.nullable === 'YES' ? 'var(--text-muted)' : 'var(--text-secondary)' }}>{col.nullable}</td>
                        <td style={{ padding: '0.75rem 0.4rem', fontSize: '0.825rem' }}>{col.extra}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* DDL Syntax View */
              <div className="animate-fade-in" style={{ marginTop: '1.2rem', display: 'flex', flexDirection: 'column' }}>
                <div className="code-block-header">
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {selectedDb === 'postgres' ? `${selectedTable}.sql` : `${selectedTable}.json`}
                  </span>
                  
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(currentEntity.ddl)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: copied ? 'var(--accent-emerald)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: '600'
                    }}
                  >
                    {copied ? <Check style={{ width: '0.85rem', height: '0.85rem' }} /> : <Clipboard style={{ width: '0.85rem', height: '0.85rem' }} />}
                    {copied ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="code-block" style={{ margin: 0, maxHeight: '280px', overflowY: 'auto' }}>
                  {currentEntity.ddl}
                </pre>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
