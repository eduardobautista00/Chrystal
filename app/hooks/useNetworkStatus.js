import { useState, useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkNetworkStatus = async () => {
    
      NetInfo.fetch().then(state => {
        
        setIsConnected(state.isConnected); 
      });
    };

    checkNetworkStatus();

    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }; 
  }, []);

  return isConnected;
};