import React, { useState, useEffect, useRef } from "react";
import Tesseract from "tesseract.js";
import Webcam from "react-webcam";
import "../styles/theme.css";
import "../styles/StaffDashboard.css";

const StaffDashboard = () => {
  const [items, setItems] = useState([]);
  const [ocrResult, setOcrResult] = useState("");
  const [ocrMode, setOcrMode] = useState("upload"); // "upload" or "webcam"

  const [newBatch, setNewBatch] = useState({
    item_id: "",
    batch_number: "",
    quantity: "",
    expiry_date: "",
    sku: "",
    name: ""
  });

  const webcamRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch("http://localhost:5000/api/stock/items");
    const data = await res.json();
    setItems(data);
  };

  // OCR from uploaded file
  const handleOCRUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    runOCR(file);
  };

  // OCR from webcam capture
  const captureAndOCR = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;
    runOCR(imageSrc);
  };

  // Shared OCR logic
  const runOCR = async (image) => {
    setOcrResult("Processing...");
    Tesseract.recognize(image, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setOcrResult(text);

        // Extract expiry date
        const dateRegex = /\b(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/;
        const matchDate = text.match(dateRegex);

        // Extract SKU
        const skuRegex = /\b[A-Z0-9]{3,}\b/;
        const matchSku = text.match(skuRegex);

        // Extract product name
        const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
        const productName = lines.length > 0 ? lines[0] : "";

        setNewBatch((prev) => ({
          ...prev,
          expiry_date: matchDate ? matchDate[0] : prev.expiry_date,
          sku: matchSku ? matchSku[0] : prev.sku,
          name: productName || prev.name
        }));
      })
      .catch((err) => {
        console.error(err);
        setOcrResult("Error processing image");
      });
  };

  const handleAddBatch = async () => {
    await fetch("http://localhost:5000/api/stock/batches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newBatch)
    });
    alert("Batch added successfully");
  };

  return (
    <div className="staff-dashboard">
      <h2>Staff Dashboard</h2>

      {/* OCR Mode Toggle */}
      <div>
        <button onClick={() => setOcrMode("upload")}>Switch to Upload Mode</button>
        <button onClick={() => setOcrMode("webcam")}>Switch to Webcam Mode</button>
      </div>

      {/* Conditional OCR UI */}
      {ocrMode === "upload" ? (
        <div>
          <h3>Scan Expiry via OCR (Upload)</h3>
          <input type="file" accept="image/*" onChange={handleOCRUpload} />
          <p>OCR Result: {ocrResult}</p>
        </div>
      ) : (
        <div style={{ position: "relative", display: "inline-block" }}>
          <h3>Scan Label via Webcam OCR</h3>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            width={320}
            height={240}
          />
          <button onClick={captureAndOCR}>Capture & Scan</button>
          <p>OCR Result: {ocrResult}</p>
        </div>
      )}

      {/* Batch Entry Form */}
      <div>
        <h3>Add Batch</h3>
        <input placeholder="Item ID" value={newBatch.item_id} onChange={(e) => setNewBatch({ ...newBatch, item_id: e.target.value })} />
        <input placeholder="Batch Number" value={newBatch.batch_number} onChange={(e) => setNewBatch({ ...newBatch, batch_number: e.target.value })} />
        <input placeholder="Quantity" type="number" value={newBatch.quantity} onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })} />
        <input placeholder="Expiry Date" type="text" value={newBatch.expiry_date} onChange={(e) => setNewBatch({ ...newBatch, expiry_date: e.target.value })} />
        <input placeholder="SKU" type="text" value={newBatch.sku} onChange={(e) => setNewBatch({ ...newBatch, sku: e.target.value })} />
        <input placeholder="Product Name" type="text" value={newBatch.name} onChange={(e) => setNewBatch({ ...newBatch, name: e.target.value })} />
        <button onClick={handleAddBatch}>Add Batch</button>
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
