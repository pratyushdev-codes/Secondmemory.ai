

// import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
// import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
// import Home from './pages/Home';
// import Chat from './pages/Chat';
// import { Toaster } from 'react-hot-toast';
// import TalktoCode from './pages/TalktoCode';
// import { CodeProvider } from './hooks/CodeContext.jsx'; // Import the CodeProvider

// const router = createBrowserRouter(
//   createRoutesFromElements(
//     <>
//       <Route index element={<Home />} />
//       <Route
//         path="/Chat"
//         element={
//           <>
//             <SignedIn>
//               <Chat />
//             </SignedIn>
//             <SignedOut>
//               <RedirectToSignIn redirectUrl="/Chat" />
//             </SignedOut>
//           </>
//         }
//       />
//       <Route
//         path="/talktocode"
//         element={
//           <>
//             <SignedIn>
//               <TalktoCode />
//             </SignedIn>
//             <SignedOut>
//               <RedirectToSignIn redirectUrl="/talktocode" />
//             </SignedOut>
//           </>
//         }
//       />
//     </>
//   )
// );

// function App() {
//   return (
//     <CodeProvider> {/* Wrap entire app with CodeProvider */}
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           style: {
//             borderRadius: '20px',
//             background: '#242323',
//             color: '#fff',
//           },
//           success: {
//             theme: {
//               primary: '#65A0FB',
//             },
//           },
//         }}
//       />
//       <RouterProvider router={router} />
//     </CodeProvider>
//   );
// }

// export default App;


import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import { Toaster } from 'react-hot-toast';
import TalktoCode from './pages/TalktoCode.jsx';
import { CodeProvider } from './hooks/CodeContext.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<Home />} />
      <Route
        path="chat"
        element={
          <>
            <SignedIn>
              <Chat />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn redirectUrl="/chat" />
            </SignedOut>
          </>
        }
      />
      <Route
        path="talktocode"
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
    </Route>
  )
);

function App() {
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
      <RouterProvider router={router} />
    </CodeProvider>
  );
}

export default App;