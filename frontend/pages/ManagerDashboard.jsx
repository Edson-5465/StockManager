import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../styles/theme.css";
import "../styles/ManagerDashboard.css";

const ManagerDashboard = () => {
  const [items, setItems] = useState([]);
  const [batches, setBatches] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", sku: "", min_stock_level: "" });

  useEffect(() => {
    fetchItems();
    fetchBatches();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/stock/items");
    const data = await res.json();
    setItems(data);
  };

  const fetchBatches = async () => {
    const res = await fetch("http://localhost:5000/api/stock/batches/1"); // example itemId
    const data = await res.json();
    setBatches(data);

    const statusCounts = data.reduce((acc, batch) => {
      acc[batch.status] = (acc[batch.status] || 0) + 1;
      return acc;
    }, {});
    setAnalytics(Object.entries(statusCounts).map(([status, count]) => ({ status, count })));
  };

  const handleAddItem = async () => {
    const payload = {
      name: newItem.name,
      sku: newItem.sku,
      min_stock_level: parseInt(newItem.min_stock_level, 10)
    };

    const res = await fetch("http://localhost:5000/api/stock/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert(`Item ${data.item_id} added successfully`);
      setNewItem({ name: "", sku: "", min_stock_level: "" });
      fetchItems(); // refresh list
    } else {
      alert(`Error: ${data.error}`);
    }
  };

  return (
    <div className="manager-dashboard">
      <h2>Manager Dashboard</h2>

      {/* Add Item Form */}
      <h3>Add Item</h3>
      <input
        placeholder="Name"
        value={newItem.name}
        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
      />
      <input
        placeholder="SKU"
        value={newItem.sku}
        onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
      />
      <input
        placeholder="Min Stock Level"
        type="number"
        value={newItem.min_stock_level}
        onChange={(e) => setNewItem({ ...newItem, min_stock_level: e.target.value })}
      />
      <button onClick={handleAddItem}>Add Item</button>

      {/* Item List */}
      <h3>Current Stock Items</h3>
      <ul>
        {items.map((item) => (
          <li key={item.item_id}>
            {item.name} ({item.sku}) — Min Stock: {item.min_stock_level}
          </li>
        ))}
      </ul>

      {/* Batch Overview */}
      <h3>Batch Status Overview</h3>
      <ul>
        {batches.map((batch) => (
          <li key={batch.batch_id}>
            Batch {batch.batch_number} — Qty: {batch.quantity} — Expiry: {batch.expiry_date} — Status: {batch.status}
          </li>
        ))}
      </ul>

      {/* Analytics Chart */}
      <div className="chart-container">
        <h3>Expiry Analytics</h3>
        <BarChart width={500} height={300} data={analytics}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="var(--color-secondary)" />
        </BarChart>
      </div>
    </div>
  );
};

export default ManagerDashboard;
