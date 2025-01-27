import React from "react";

import Background from "../../components/Background";

import AdminLayout from '../../layout/Admin';
import Paragraph from "../../components/Paragraph";
import { FlatList } from "react-native-gesture-handler";
import { useData } from '../../context/DataContext';
import { View , StyleSheet} from "react-native";

export default function PropertiesScreen({ navigation }) {
  const {property} = useData();
  return (
    <AdminLayout>
        <Background>
       
       <Paragraph>Properties List</Paragraph>
  
       <FlatList
                data={property.list}
                keyExtractor={(item , index)=>{
                    // console.log(item.Title);
                    return index;
                }}
                renderItem={({item , index})=>(
                    <View style={styles.flatitemcontainer}>
                      
                        <Paragraph>{item.Title}</Paragraph>
                    </View>
                )}
            /> 
        </Background>
    </AdminLayout>
  );
}


const styles = StyleSheet.create({
  flatitemcontainer: {
    
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
});