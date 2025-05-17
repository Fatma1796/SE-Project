import React from 'react';

const UserTable = ({ users }) => {
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user._id || user.id}>
                <td>{user._id || user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1">Edit</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;