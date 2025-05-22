
import React, { useState } from 'react';

const UserTable = ({ users, onDelete, onUpdateRole }) => {
  const [editingId, setEditingId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (e, user) => {
    setSelectedRole(e.target.value);
  };

  const saveRoleChange = (userId) => {
    onUpdateRole(userId, selectedRole);
    setEditingId(null);
    setSelectedRole("");
  };

  const startEditing = (user) => {
    setEditingId(user._id);
    setSelectedRole(user.role);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setSelectedRole("");
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created At</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map(user => (
              <tr key={user._id || user.id}>
                <td>{user._id || user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {editingId === user._id ? (
                    <select 
                      className="form-select" 
                      value={selectedRole} 
                      onChange={(e) => handleRoleChange(e, user)}
                    >
                      <option value="Standard User">Standard User</option>
                      <option value="Organizer">Organizer</option>
                      <option value="System Admin">System Admin</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}</td>
                <td>
                  {editingId === user._id ? (
                    <>
                      <button 
                        className="btn btn-sm btn-success me-1" 
                        onClick={() => saveRoleChange(user._id)}
                      >
                        Save
                      </button>
                      <button 
                        className="btn btn-sm btn-secondary" 
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        className="btn btn-sm btn-primary me-1" 
                        onClick={() => startEditing(user)}
                      >
                        Edit Role
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => onDelete(user._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;