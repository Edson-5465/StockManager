import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../styles/theme.css";
import "../styles/ManagerDashboard.css";

const ManagerDashboard = () => {
  const [batches, setBatches] = useState([]);
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    const res = await fetch("http://localhost:5000/api/stock/batches/1"); // example itemId
    const data = await res.json();
    setBatches(data);

    // Simple analytics: count statuses
    const statusCounts = data.reduce((acc, batch) => {
      acc[batch.status] = (acc[batch.status] || 0) + 1;
      return acc;
    }, {});
    setAnalytics(Object.entries(statusCounts).map(([status, count]) => ({ status, count })));
  };

  return (
    <div className="manager-dashboard">
      <h2>Manager Dashboard</h2>

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
