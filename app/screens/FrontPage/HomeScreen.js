import React , {useContext, useState , useEffect} from "react";

import AnimatedBackground from "../../components/AnimatedBackground";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import AdminLayout from '../../layout/Admin';
import { useNetworkStatus } from '../../hooks/useNetworkStatus';

// import { AuthContext} from '../../context/AuthContext';
import * as NavigationService from '../../navigation/NavigationService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/apiClient';
import { FlatList } from "react-native-gesture-handler";
import { View , StyleSheet} from "react-native";

export default function HomeScreen({ navigation }) {

  const isConnected = useNetworkStatus();
  const { authState } = useAuth();
  const { property } = useData();
  const [token ,setToken] = useState("");
  const [user ,setUserList] = useState([]);

  // Example usage in a component or service
  const fetchUsers = async () => {
    try {
      const response = await api.get('/login');

      setUserList(response.data);
      console.log(response.data);
      // return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const checkToken = async () => {
    try {
      const storedToken = await  AsyncStorage.getItem('accessToken');
      if (storedToken) {
        console.log('Token exists:', storedToken);
        setToken(storedToken);
      } else {
        console.log('No token found');
        
      }
    } catch (error) {
      console.error('Check token error:', error);
      
    }
  };
 
  return (
    <AdminLayout>
   
      <Logo />
      <Header>Welcome 💫</Header>


      <Paragraph>Congratulations you are logged in.</Paragraph>

      <Paragraph>Network Status: {isConnected ? 'Connected' : 'Disconnected'}</Paragraph>

      <Paragraph>{JSON.stringify(property)}</Paragraph>

     <Paragraph>{JSON.stringify(authState)}</Paragraph> 
      
      <FlatList
                data={user?.users}
                keyExtractor={(item)=>item.id}
                renderItem={({item})=>(
                    <View style={styles.flatitemcontainer}>
                        <Paragraph>{item.firstName} {item.lastName} ===  {item.gender}</Paragraph>
                    </View>
                )}
            /> 
      <Paragraph>{token}</Paragraph>


      <Button
          mode="outlined"
          onPress={() =>{
            
            fetchUsers();
          }
          
          }
        >
          Request List
        </Button>

       <Button
          mode="outlined"
          onPress={() =>{
            
            checkToken();
          }
          
          }
        >
          Show Token
        </Button>

      {authState.isRole("Admin")  && (
        <Button
          mode="outlined"
          onPress={() =>{
            
            NavigationService.navigate('DashboardScreen', { someParam: 'high 5' });
          }
          
          }
        >
          Dashboard
        </Button>
      )}

      {authState.hasCan("Generate Ticket")  && (
          <Button
          mode="outlined"
          onPress={() =>{
            
              NavigationService.navigate('AboutUsScreen', { someParam: 'high 5' });
          }
            
          }
        >
          About Us
        </Button>
        )}

      
      <Button
        mode="outlined"
        onPress={async () =>{

           authState.logout(); 

        }
         
        }
      >
        Sign out
      </Button>
    
    </AdminLayout>
  );
}



const styles = StyleSheet.create({
  flatitemcontainer: {
    
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
});