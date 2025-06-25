// context/carteContext.js
import { createContext, useState, useContext, useEffect } from "react";
const userContext = createContext();

export function UserProvider({ children }) {
   const [userLog, setUserLog] = useState(null);  //to check whether user has login or not
   async function handleUserLog(){
      const authToken = localStorage.getItem('authToken');
      if (authToken){
        const response = await fetch('/api/verify-user', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
       
        if (!response.ok){
          localStorage.removeItem('authToken');
          setUserLog(null);
        }else{
          const data = await response.json();
          setUserLog(data.existingUser);
        }
        
      }else{
        setUserLog(null);
      }
    }

    useEffect(()=>{
     handleUserLog();
    }, []);
  return (
    <userContext.Provider
      value={{userLog, setUserLog, handleUserLog}}
    >
      {children}
    </userContext.Provider>
  );
}

export function useAuth() {
  return useContext(userContext);
}
