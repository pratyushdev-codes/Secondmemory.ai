// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';
// import { ClerkProvider } from '@clerk/clerk-react';
// const { VITE_CLERK_PUBLISHABLE_KEY } = import.meta.env;

// const publishableKey = VITE_CLERK_PUBLISHABLE_KEY;

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <ClerkProvider publishableKey={publishableKey}>
//       <App />
//     </ClerkProvider>
//   </React.StrictMode>
// );

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// More defensive environment variable handling
const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Log for debugging
console.log('Environment check:', {
  hasClerkKey: !!publishableKey,
  nodeEnv: import.meta.env.MODE
});

// Show a helpful error if the key is missing
if (!publishableKey) {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div style={{ color: 'white', padding: '20px' }}>
      <h1>Configuration Error</h1>
      <p>Missing Clerk publishable key. Check environment variables.</p>
    </div>
  );
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ClerkProvider publishableKey={publishableKey}>
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}