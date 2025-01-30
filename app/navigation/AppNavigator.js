import React, { Suspense } from 'react';
import 'react-native-gesture-handler';

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../app/context/AuthContext';
import DrawerButton from "../components/DrawerButton";
import screens from "../../app/screens";
import AboutNavigation from "./SubNavigator/AboutNavigation";
import { Ionicons } from '@expo/vector-icons';

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

function AuthStack() {
    const { authState } = useAuth();
    console.log("auth user:", authState)

    return (
        <Stack.Navigator
            initialRouteName={"DashboardScreen"}
            screenOptions={({ navigation }) => ({
                headerLeft: () => <DrawerButton navigation={navigation} />,
                headerShown: false, // Globally hide headers
                
            })}
            headerMode="none"
        >
            <Stack.Screen name={"DashboardScreen"} options={{ title: 'Dashboard', headerShown: false,}} component={AuthPage_DashboardScreen} />

            {(authState.isRole("Agent") || authState.isRole("Admin")) && (
                <Stack.Screen name={"ProfileScreen"} options={{title:"Profile", headerShown: false,}}>
                    {/* Inline Sub Navigator */}
                    {() => (
                        <Tab.Navigator screenOptions={{
                            headerShown: false, // Ensure headers don't reserve space
                            tabBarStyle: { display: 'none' }, // Hide tab bar globally if needed
                        }}>
                            <Tab.Screen name='AuthPage_ProfileScreen' component={AuthPage_ProfileScreen}
                                options={{
                                    tabBarLabel: 'Profile',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' },
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="person" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen name='AuthPage_PropertiesScreen' component={AuthPage_PropertiesScreen}
                                options={{
                                    tabBarLabel: 'Properties',
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="home" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen name='AuthPage_AddPropertyImage' component={AuthPage_AddPropertyImage}
                                options={{
                                    tabBarLabel: 'Add Property Images',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' }, // Hide the tab item in the tab bar
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="images" color={color} size={size} />
                                    ),
                                   
                                }}
                            />
                            <Tab.Screen name='AuthPage_AddPropertiesScreen' component={AuthPage_AddPropertiesScreen}
                                options={{
                                    tabBarLabel: 'Add Properties',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' },
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="add" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen name='AuthPage_PropertyDetails' component={AuthPage_PropertyDetails}
                                options={{
                                    tabBarLabel: 'Property Details',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' },
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="home" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen name='AuthPage_CalendarScreen' component={AuthPage_CalendarScreen}
                                options={{
                                    tabBarLabel: 'Calendar',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' },
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="calendar" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen name='AuthPage_NotificationScreen' component={AuthPage_NotificationScreen}
                                options={{
                                    tabBarLabel: 'Notifications',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' },
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="notifications" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen name='AuthPage_SettingsScreen' component={AuthPage_SettingsScreen}
                                options={{
                                    tabBarLabel: 'Settings',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' },
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="settings" color={color} size={size} />
                                    ),
                                }}
                            />
                            <Tab.Screen name='AuthPage_StatisticsScreen' component={AuthPage_StatisticsScreen}
                                options={{
                                    tabBarLabel: 'Statistics',
                                    headerShown: false,
                                    tabBarStyle: { display: 'none' },
                                    tabBarIcon: ({ color, size }) => (
                                        <Ionicons name="bar-chart" color={color} size={size} />
                                    ),
                                }}
                            />
                        </Tab.Navigator>
                    )}
                </Stack.Screen>
            )}

            {authState.hasCan("update-user") &&
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
}

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

export default function Navigation() {
    const { authState } = useAuth();
    return (
        <>
            {authState.isAuthenticated ? <AuthStack/> : <AppStack />}
        </>
    );
}
