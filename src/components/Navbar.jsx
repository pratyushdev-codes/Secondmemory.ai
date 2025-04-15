import React, { useState } from 'react';
import { cn } from "../utils/cn";
import { Menu } from "./ui/navbar-menu";
import logo from "../../public/images/supermemoryailogo.svg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/authContext";
import { useEffect } from "react";
// import { SignInButton } from '@clerk/clerk-react';
import Chat from '../pages/Chat';
  const signUp = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("User Logged in", result.user);
      // Make sure your authContext is properly updating with this user
      navigate("/Chat"); // Navigate after successful login
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  }
  
export function Navbar() {
  return (
    <Navbar1 className="top-2" />
  );
}


function Navbar1({ className }) {
  const [active, setActive] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={cn(`fixed top-10 inset-x-0 max-w-2xl mx-auto z-50 flex flex-row rounded-full`, className)}>
    <Menu setActive={setActive} className="bg-white flex flex-row">
      <a href="#" className="flex items-center space-x-2">
        <img src={logo} alt="Logo" className="h-7" />
        <p className='text-xl font-semibold'>Secondmemory.ai</p>
      </a>


<div className="flex flex-row py-2 px-3 gap-1 border border-[#666] rounded-full text-white">
<button onClick={signUp}>Login</button>
<svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 -960 960 960" width="24px" fill="#D9D9D9"><path d="m480-320 160-160-160-160-56 56 64 64H320v80h168l-64 64 56 56Zm0 240q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>

    </div>

      </Menu>
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-black shadow-lg">
          <div className='flex flex-col space-y-4 px-8 py-6'>
            <a href="#" className='text-white'>Login</a>
          </div>
        </div>
      )}
    </div>
  );
}