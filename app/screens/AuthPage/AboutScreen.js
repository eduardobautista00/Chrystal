import React , {useContext} from "react";

import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import AdminLayout from '../../layout/Admin';
// import BackButton from "../../components/BackButton";
import { useAuth } from '../../context/AuthContext';


export default function AboutScreen({ navigation }) {
  const { authState} = useAuth();
  return (
    <AdminLayout>
    <Background>
   {/*  <BackButton goBack={navigation.goBack} /> */}
      <Logo />
      <Header>wfhdshfahds 💫</Header>
      <Paragraph>orem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to mak</Paragraph>


      <Button
        mode="outlined"
        onPress={() =>{
          authState.logout(); 
        /*   navigation.reset({
            index: 0,
            routes: [{ name: "StartScreen" }],
          }) */
        }
         
        }
      >
        Sign out
      </Button>
    </Background>
    </AdminLayout>
  );
}
