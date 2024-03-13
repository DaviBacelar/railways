import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';


const LoadingDiv = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100wv',
        height: '100vh',
    }}>
        <CircularProgress color='success' />
    </div>
);

export default LoadingDiv;