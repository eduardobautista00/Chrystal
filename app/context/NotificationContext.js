import React, { createContext, useState, useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            setNotifications(prev => [...prev, remoteMessage]);
        });

        return unsubscribe;
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, setNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};

export { NotificationContext, NotificationProvider };
