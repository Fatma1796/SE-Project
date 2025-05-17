import React from 'react';

function UnauthorizedPage() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Unauthorized Access</h1>
            <p>You do not have permission to view this page.</p>
            <p>Please contact the administrator if you believe this is an error.</p>
        </div>
    );
}

export default UnauthorizedPage;