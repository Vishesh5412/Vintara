import { createContext, useContext } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const router = useRouter();
  const showToast=(type, message)=>{
    const styling = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        newestOnTop: true,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light"
    }
    if (type === 'success'){
    return toast.success(message, styling);
    }else if (type === 'error'){
    return toast.error(message, styling);
    }
    return {
      notFound: true,
  };
  }
  

  return (
    <AlertContext.Provider value={{showToast}}>
     
      
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
