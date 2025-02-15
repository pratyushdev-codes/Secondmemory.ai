import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import Chat from './pages/Chat';
import { Toaster } from 'react-hot-toast';
import TalktoCode from './pages/talktocode';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route index element={<Home />} />
      <Route
        path="/Chat"
        element={
          <>
            <SignedIn>
              <Chat />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn redirectUrl="/Chat" />
            </SignedOut>
          </>
        }
      />
      <Route
        path="/talktocode"
        element={
          <>
            <SignedIn>
              <TalktoCode />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn redirectUrl="/talktocode" />
            </SignedOut>
          </>
        }
      />
    </>
  )
);

function App() {
  return (
    <>
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
      <RouterProvider router={router} />
    </>
  );
}

export default App;