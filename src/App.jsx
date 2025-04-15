import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import { Toaster } from 'react-hot-toast';
import TalktoCode from './pages/TalktoCode.jsx';
import { CodeProvider } from './hooks/CodeContext.jsx';
import { useAuth } from './components/authContext';

// Protected Route component to check authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  return user ? children : <Navigate to="/" />;
};

function AppRouter() {
  return (
    <CodeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '20px',
            background: '#242323',
            color: '#fff',
          },
          success: {
            theme: {
              primary: '#65A0FB',
            },
          },
        }}
      />
      <RouterProvider 
        router={createBrowserRouter(
          createRoutesFromElements(
            <Route path="/">
              <Route index element={<Home />} />
              <Route
                path="chat"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="talktocode"
                element={
                  <ProtectedRoute>
                    <TalktoCode />
                  </ProtectedRoute>
                }
              />
            </Route>
          )
        )} 
      />
    </CodeProvider>
  );
}

function App() {
  return (
    <AppRouter />
  );
}

export default App;