import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import FullPageSpinner from '../components/common/FullPageSpinner';

function UpdateProfilePage() {
    const { user, updateProfile } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setEmail(user.email || '');
            setPageLoading(false);
        }
    }, [user]);

const handleUpdateProfile = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    await updateProfile({ name, email });
    toast.success('Profile updated successfully!');
    setTimeout(() => {
      navigate('/profile', { state: { profileUpdated: true } });
    }, 3000);
  } catch (error) {
    toast.error(error.message || 'Failed to update profile');
  } finally {
    setLoading(false);
  }
};


    if (pageLoading) {
        return <FullPageSpinner text="Loading profile data..." />;
    }

    return (
        <div className="card">
            <div className="card-header">
                <h1>Update Profile</h1>
            </div>
            <div className="card-body">
                <form onSubmit={handleUpdateProfile}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? <LoadingSpinner size="small" text="Updating..." /> : 'Confirm Update'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateProfilePage;