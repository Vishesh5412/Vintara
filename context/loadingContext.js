// context/loadingContext.js

//next didn't suppose useLocation like react
import { createContext, useContext, useState, useEffect } from "react";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const router = useRouter();

  //given below is the logic for loading bar to run when i move from one page to another
  useEffect(() => {
    const handleStart = () => setProgress(30);
    const handleComplete = () => setProgress(100);
  
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  const [progress, setProgress] = useState(0);

  return (
    <LoadingContext.Provider value={{ setProgress }}>
      {/* Loading bar UI */}
      <LoadingBar
        color="#ff4d4d"
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
        height={4}
        shadow={true}
        waitingTime={400}
      />
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
