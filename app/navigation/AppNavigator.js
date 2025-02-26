import React, { Suspense, useEffect } from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../app/context/AuthContext';
import DrawerButton from "../components/DrawerButton";
import screens from "../../app/screens";
import AboutNavigation from "./SubNavigator/AboutNavigation";
import { Ionicons } from '@expo/vector-icons';
import { checkAuthStatus } from '../../app/utils/authUtils';
import { navigationRef } from '../navigation/NavigationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import { ROUTES, SCREEN_NAMES } from '../config/routes';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const {
    FrontPage_StartScreen,
    FrontPage_LoginScreen,
    FrontPage_RegisterScreen,
    FrontPage_ResetLinkScreen,
    FrontPage_NewPasswordScreen,
    FrontPage_ResetPasswordScreen,
    FrontPage_CreateAccountScreen,
    FrontPage_SuccessScreen,
    // FrontPage_OTPVerificationScreen,
    FrontPage_OTPSuccess,
    FrontPage_AgentRegistrationScreen,
    FrontPage_AgentRegistrationSuccess,
    FrontPage_SubscriptionScreen,
    FrontPage_HomeScreen,
    FrontPage_PaymentScreen,
    FrontPage_PaymentSuccess,
    FrontPage_CompanyDetailsScreen,
    FrontPage_PasswordResetOTP,
    FrontPage_PasswordResetSuccess,
    AuthPage_HomeScreen,
    AuthPage_DashboardScreen ,
    AuthPage_ProfileScreen,
    AuthPage_PropertiesScreen,
    AuthPage_AddPropertiesScreen,
    AuthPage_AddPropertyImage,
    AuthPage_PropertyDetails,
    AuthPage_CalendarScreen,
    AuthPage_NotificationScreen,
    AuthPage_StatisticsScreen,
    AuthPage_SettingsScreen,

} = screens;

// Define AuthStack as a separate component
const AuthStack = () => {
    const { authState, isRole, hasCan } = useAuth();  // Get functions from context
    console.log("auth user:", authState);
    console.log("role permissions:", authState.rolePermission);

    return (
        <Stack.Navigator
            initialRouteName={"DashboardScreen"}
            screenOptions={({ navigation }) => ({
                headerLeft: () => <DrawerButton navigation={navigation} />,
                headerShown: false,
            })}
            headerMode="none"
        >
            <Stack.Screen 
                name={"DashboardScreen"} 
                options={{ title: 'Dashboard', headerShown: false }} 
                component={AuthPage_DashboardScreen} />

            <Stack.Screen
                name={"ProfileScreen"}
                options={{ title: "Profile", headerShown: false }}
                component={AuthPage_ProfileScreen} />

            <Stack.Screen
                name={"PropertiesScreen"}
                options={{ title: "Properties", headerShown: false }}
                component={AuthPage_PropertiesScreen} />

            <Stack.Screen
                name={"AddPropertiesScreen"}
                options={{ title: "Add Properties", headerShown: false }}
                component={AuthPage_AddPropertiesScreen} />

            <Stack.Screen
                name={"AddPropertyImage"}
                options={{ title: "Add Property Image", headerShown: false }}
                component={AuthPage_AddPropertyImage} />

            <Stack.Screen
                name={"PropertyDetails"}
                options={{ title: "Property Details", headerShown: false }}
                component={AuthPage_PropertyDetails} />

            <Stack.Screen
                name={"CalendarScreen"}
                options={{ title: "Calendar", headerShown: false }}
                component={AuthPage_CalendarScreen} />

            <Stack.Screen
                name={"NotificationScreen"}
                options={{ title: "Notification", headerShown: false }}
                component={AuthPage_NotificationScreen} />

            <Stack.Screen
                name={"StatisticsScreen"}
                options={{ title: "Statistics", headerShown: false }}
                component={AuthPage_StatisticsScreen} />

            <Stack.Screen
                name={"SettingsScreen"}
                options={{ title: "Settings", headerShown: false }}
                component={AuthPage_SettingsScreen} />

            {hasCan("View Users") && (
                <Stack.Screen 
                    name={"UsersScreen"} 
                    options={{title:"Users", headerShown: false}}
                    component={UsersScreen}
                />
            )}
            
            {hasCan("update-user") &&
                <Stack.Screen
                    name={"AboutUsScreen"}
                    options={{
                        headerShown:true,
                        title: 'About'
                    }}
                    component={AboutNavigation}/>
            }
        </Stack.Navigator>
    );
};

function AppStack() {
    return (
        <Stack.Navigator
            initialRouteName={"StartScreen"}
            screenOptions={{headerShown: false,}}
        >
            <Stack.Screen name={"StartScreen"} component={FrontPage_StartScreen} />
            <Stack.Screen name={"LoginScreen"} component={FrontPage_LoginScreen} />
            <Stack.Screen name={"RegisterScreen"} component={FrontPage_RegisterScreen} />
            <Stack.Screen name={"ResetLinkScreen"} component={FrontPage_ResetLinkScreen} />
            <Stack.Screen name={"ResetPasswordScreen"} component={FrontPage_ResetPasswordScreen}/>
            <Stack.Screen name={"NewPasswordScreen"} component={FrontPage_NewPasswordScreen}/>
            <Stack.Screen name={"SuccessScreen"} component={FrontPage_SuccessScreen}/>
            <Stack.Screen name={"CreateAccountScreen"} component={FrontPage_CreateAccountScreen}/>
            {/* <Stack.Screen name={"OTPVerificationScreen"} component={FrontPage_OTPVerificationScreen}/> */}
            <Stack.Screen name={"OTPSuccess"} component={FrontPage_OTPSuccess}/>
            <Stack.Screen name={"AgentRegistrationScreen"} component={FrontPage_AgentRegistrationScreen}/>
            <Stack.Screen name={"SubscriptionScreen"} component={FrontPage_SubscriptionScreen}/>
            <Stack.Screen name={"PaymentScreen"} component={FrontPage_PaymentScreen}/>
            <Stack.Screen name={"PaymentSuccess"} component={FrontPage_PaymentSuccess}/>
            {/* <Stack.Screen name={"HomeScreen"} component={FrontPage_HomeScreen}/> */}
            <Stack.Screen name={"CompanyDetailsScreen"} component={FrontPage_CompanyDetailsScreen}/>
            <Stack.Screen name={"AgentRegistrationSuccess"} component={FrontPage_AgentRegistrationSuccess}/>
            <Stack.Screen name={"PasswordResetOTP"} component={FrontPage_PasswordResetOTP}/>
            <Stack.Screen name={"PasswordResetSuccess"} component={FrontPage_PasswordResetSuccess}/>
        </Stack.Navigator>
    );
}

// Main Navigation component
export default function Navigation() {
    const { authState, setAuthenticated } = useAuth();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log('Checking auth state...');
                const token = await AsyncStorage.getItem('access_token');
                console.log('access_token:', token);
                
                if (token && token.split('.').length === 3) {
                    console.log('Token is valid, setting authenticated state');
                    await setAuthenticated(token);
                    console.log('Auth state after update:', authState);
                } else {
                    console.log('Token is invalid or missing');
                }
            } catch (error) {
                console.error('Auth check error:', error);
            }
        };
        
        checkAuth();
    }, []);

    // Add this console log to track auth state changes
    useEffect(() => {
        console.log('Auth state changed:', authState);
    }, [authState]);

    console.log('Rendering Navigation, isAuthenticated:', authState.isAuthenticated);

    return (
        <>
        {authState.isAuthenticated === true ? (
            console.log('Rendering AuthStack'),
            <AuthStack />  // Use the AuthStack component
            ) : (
                console.log('Rendering AppStack'),
                <AppStack />
            )}
        </>
    );
}
