import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import screens from "../../../app/screens";
import { Ionicons } from '@expo/vector-icons';
const { 
  AuthPage_HomeScreen , 
  AuthPage_AboutScreen ,
  AuthPage_PolicyScreen ,
  
} = screens; 

const Tab = createBottomTabNavigator(); 

export default function AboutNavigation() {
  return (  
    <Tab.Navigator>
        <Tab.Screen name='AuthPage_AboutScreen' component={AuthPage_AboutScreen} 
            options={
                {
                    tabBarLabel: 'About',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="information-circle" color={color} size={size} />
                      ),
                }
            }
        />
        <Tab.Screen name='AuthPage_PolicyScreen' component={AuthPage_PolicyScreen} 
            options={
                {
                    tabBarLabel: 'Policy',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="shield-half" color={color} size={size} />
                      ),
                }
            }
        />
    </Tab.Navigator>
  );
}
