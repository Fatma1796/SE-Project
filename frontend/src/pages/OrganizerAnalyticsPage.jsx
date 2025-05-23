import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventAnalytics from '../components/EventAnalytics';
import FullPageSpinner from '../components/common/FullPageSpinner';

const OrganizerAnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          'http://localhost:3000/api/v1/events/users/events/analytics',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log('Analytics response:', response.data); // Debug log
        setAnalyticsData(response.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setError(err.response?.data?.message || 'Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <FullPageSpinner text="Loading analytics data..." />;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!analyticsData) return <div className="text-center p-8">No analytics data available</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Event Analytics</h2>
      <EventAnalytics analyticsData={analyticsData} />
    </div>
  );
};

export default OrganizerAnalyticsPage;