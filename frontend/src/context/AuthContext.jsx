// import { createContext, useContext, useState } from "react";
// import { useEffect } from "react";
// import React from "react";
// import { useTasks } from "./TasksContext";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [token, setToken] = useState(localStorage.getItem("token"));
//     const [isLoggedIn, setLoggedIn] = useState(!!token);
//     // const { resetTasks } = useTasks();
//     const [authReady, setAuthReady] = useState(false);

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     if (storedToken) {
//       setToken(storedToken);
//     }
//     setAuthReady(true); // 🔥 AUTH HYDRATED
//   }, []);

//     const login = (token) => {
//         localStorage.setItem("token", token);
//         setLoggedIn(true);
//     }

//     const logout = () => {
//         localStorage.removeItem("token");
//         localStorage.removeItem("tokenExpiry");
//         setToken(null);
//         setLoggedIn(false);

//     }

//     useEffect(() => {
//         const token = localStorage.getItem("token");
//         const expiry = localStorage.getItem("tokenExpiry");

//         if (!token || !expiry) {
//             setLoggedIn(false);
//             return;
//         }

//         const now = new Date().getTime();
//         if (now > expiry) {
//             logout();
//         } else {
//             setLoggedIn(true);
//             const timeout = expiry - now;
//             const timer = setTimeout(() => logout(), timeout);
//             return () => clearTimeout(timer); // cleanup
//         }
//     }, []);


//     return (
//         <AuthContext.Provider value={{ isLoggedIn, token, login, logout, authReady }}>
//             {children}
//         </AuthContext.Provider>
//     )
// }

// export const useAuth = () => useContext(AuthContext);

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // 🔑 SINGLE hydration effect
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const expiry = localStorage.getItem("tokenExpiry");

    let logoutTimer;


    if (storedToken) {
      setToken(storedToken);
      if(  expiry && Date.now() < Number(expiry) ) {
      const timeout = Number(expiry) - Date.now();
      logoutTimer = setTimeout(logout, timeout);
      }
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      setToken(null);
    }

    setAuthReady(true);
    return () => {
    if (logoutTimer) clearTimeout(logoutTimer);
  };
  }, []);

  const login = (newToken, expiry) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("tokenExpiry", expiry);
    setToken(newToken); // 🔥 THIS WAS MISSING
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isLoggedIn: !!token,
        login,
        logout,
        authReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
