import React, { useState, useEffect } from "react";
import "../styles/theme.css";
import "../styles/StaffDashboard.css";

const StaffDashboard = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    sku: "",
    name: "",
    quantity: "",
    expiry_date: ""
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/stock/items");
    const data = await res.json();
    setItems(data);
  };

  const handleAddItem = async () => {
    await fetch("http://localhost:5000/api/stock/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });
    fetchItems();
  };

  return (
    <div className="staff-dashboard">
      <h2>Staff Dashboard</h2>

      {/* Manual Entry Form */}
      <div>
        <h3>Add Item Manually</h3>
        <input placeholder="SKU" onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })} />
        <input placeholder="Name" onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
        <input placeholder="Quantity" type="number" onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })} />
        <input placeholder="Expiry Date" type="date" onChange={(e) => setNewItem({ ...newItem, expiry_date: e.target.value })} />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {/* OCR Scanning Button */}
      <div>
        <h3>Scan Expiry via OCR</h3>
        <button onClick={() => alert("OCR scanning coming soon!")}>Scan with Webcam</button>
      </div>

      {/* Item List */}
      <h3>Current Items</h3>
      <ul>
        {items.map((item) => (
          <li key={item.item_id}>
            {item.name} ({item.sku}) — Min Stock: {item.min_stock_level}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffDashboard;
