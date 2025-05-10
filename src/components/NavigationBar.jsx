import React from 'react';
import { getAuth } from "firebase/auth";
import logo from "../../public/images/supermemoryailogo.svg";

const NavigationBar = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  // Determine the greeting based on the current hour
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  };
  
  // Extract first name from the display name
  const getFirstName = (fullName) => {
    if (!fullName) return 'User';
    return fullName.split(' ')[0];
  };
  
  return (
    <div className="hidden lg:block">
      <nav className="bg-[#1F2C74] backdrop-blur-sm px-4 py-3 w-1/2 max-w-4xl mx-auto flex items-center justify-between shadow-sm rounded-full border-gray-700 sticky top-0 z-50">
        {user ? (
          <>
            <div className="flex items-center space-x-2">
              <img src={logo} alt="Logo" className="h-5" />
              <h1 className="text-base font text-transparent" style={{
                background: 'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {getGreeting()}, {getFirstName(user.displayName)} !
              </h1>
            </div>
            <div className="flex items-center">
              {user.photoURL && (
                <img src={user.photoURL} referrerPolicy="no-referrer" alt="User" className="h-8 shadow-xl opacity-80 rounded-full" />
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <h1 className="text-base font text-transparent" style={{
              background: 'linear-gradient(154deg, rgb(221, 230, 232), rgb(221, 230, 232), rgb(51, 152, 219))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {getGreeting()}, Guest !
            </h1>
          </div>
        )}
      </nav>
    </div>
  );
};

export default NavigationBar;
