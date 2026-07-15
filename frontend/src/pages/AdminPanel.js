import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AdminPanel = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRows = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/suggestions");
      setRows(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/suggestions/${id}`);
      setRows((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete entry");
    }
  };

  return (
    <div className="page-content">
      <h1 className="admin-title">Admin Panel - User Suggestions</h1>
      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Age</th>
              <th>Height (cm)</th>
              <th>Weight (kg)</th>
              <th>BMI</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No suggestions found.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row._id}>
                  <td>{row.email}</td>
                  <td>{row.age}</td>
                  <td>{row.height}</td>
                  <td>{row.weight}</td>
                  <td>{row.bmi}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDelete(row._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
