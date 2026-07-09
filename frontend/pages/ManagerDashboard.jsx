import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "../styles/theme.css";
import "../styles/ManagerDashboard.css";

const ManagerDashboard = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [batches, setBatches] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", sku: "", min_stock_level: "" });

  // Modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState({});

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchBatches(selectedItem);
    }
  }, [selectedItem]);

  // Fetch all items
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stock/items");
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching items:", err);
      setItems([]);
    }
  };

  // Fetch batches for selected item
  const fetchBatches = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stock/batches/${itemId}`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        setBatches([]);
        setAnalytics([]);
        return;
      }
      setBatches(data);
      const statusCounts = data.reduce((acc, batch) => {
        acc[batch.status] = (acc[batch.status] || 0) + 1;
        return acc;
      }, {});
      setAnalytics(Object.entries(statusCounts).map(([status, count]) => ({ status, count })));
    } catch (err) {
      console.error("Error fetching batches:", err);
      setBatches([]);
      setAnalytics([]);
    }
  };

  // Add new item
  const handleAddItem = async () => {
    const payload = {
      name: newItem.name,
      sku: newItem.sku,
      min_stock_level: parseInt(newItem.min_stock_level, 10)
    };
    try {
      const res = await fetch("http://localhost:5000/api/stock/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Item ${data.item_id} added successfully`);
        setNewItem({ name: "", sku: "", min_stock_level: "" });
        fetchItems();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error("Add item error:", err);
    }
  };

  // Delete item
  const handleDeleteItem = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/stock/items/${itemId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (res.ok) {
        alert("Item deleted successfully");
        fetchItems();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditItem(item);
    setEditModalOpen(true);
  };

  // Update item
  const handleUpdateItem = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/stock/items/${editItem.item_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Item updated successfully");
        setEditModalOpen(false);
        fetchItems();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Update error:", err);
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
            <button onClick={() => openEditModal(item)}>Edit</button>
            <button onClick={() => handleDeleteItem(item.item_id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Item</h3>
            <input
              placeholder="Name"
              value={editItem.name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            />
            <input
              placeholder="SKU"
              value={editItem.sku}
              onChange={(e) => setEditItem({ ...editItem, sku: e.target.value })}
            />
            <input
              placeholder="Min Stock Level"
              type="number"
              value={editItem.min_stock_level}
              onChange={(e) => setEditItem({ ...editItem, min_stock_level: e.target.value })}
            />
            <button onClick={handleUpdateItem}>Save</button>
            <button onClick={() => setEditModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Two‑pane layout */}
      <div className="dashboard-row">
        {/* Left side: Item selection */}
        <div className="dashboard-left">
          <h3>Select Item to View Batches</h3>
          <select value={selectedItem} onChange={(e) => setSelectedItem(e.target.value)}>
            <option value="">-- Select Item --</option>
            {items.map((item) => (
              <option key={item.item_id} value={item.item_id}>
                {item.name} ({item.sku})
              </option>
            ))}
          </select>
        </div>

        {/* Right side: Batch overview */}
        <div className="dashboard-right">
          {selectedItem && (
            <>
              <h3>Batch Status Overview</h3>
              {batches.length === 0 ? (
                <p className="no-batches">No batches found for this item.</p>
              ) : (
                <ul>
                  {batches.map((batch) => (
                    <li key={batch.batch_id}>
                      Batch {batch.batch_number} — Qty: {batch.quantity} — Expiry: {batch.expiry_date} — Status: {batch.status}
                    </li>
                  ))}
                </ul>
              )}

              {analytics.length > 0 ? (
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
              ) : (
                <p className="no-analytics">No analytics available for this item.</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
