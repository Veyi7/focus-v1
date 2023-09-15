import React, { createContext, useContext, useState, useEffect } from 'react';
import * as firebase from 'firebase/app';
import { auth } from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    
    // Escucha los cambios de autenticación de Firebase
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    // Detener la escucha cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}