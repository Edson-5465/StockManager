import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/list", {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/approve/${id}`, {
        method: "PUT",
        credentials: "include"
      });
      const data = await res.json();
      if (res.ok) {
        alert("User approved successfully");
        fetchUsers(); // refresh list
      } else {
        alert(data.error || "Failed to approve user");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/logout", {
        method: "POST",
        credentials: "include"
      });
      if (res.ok) {
        alert("Logged out successfully");
        navigate("/login");
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p className="status">Loading users...</p>;
  if (error) return <p className="status error">Error: {error}</p>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      {users.length === 0 ? (
        <p className="status">No users found.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Approved By</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>{u.approved_by || "-"}</td>
                <td>{new Date(u.created_at).toLocaleString()}</td>
                <td>
                  {u.status !== "active" && (
                    <button
                      className="approve-btn"
                      onClick={() => handleApprove(u.id)}
                    >
                      Approve
                    </button>
                  )}
                  {/* No reject button after approve */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;
