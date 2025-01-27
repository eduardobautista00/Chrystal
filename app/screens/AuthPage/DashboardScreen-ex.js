import React , {useContext} from "react";

import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Paragraph from "../../components/Paragraph";
import Button from "../../components/Button";
import AdminLayout from '../../layout/Admin';
// import BackButton from "../../components/BackButton";
// import { useAuth } from '../../context/AuthContext';
import { Dimensions , StyleSheet } from 'react-native';
import { LineChart , PieChart } from 'react-native-chart-kit';
import { Card, Title } from 'react-native-paper';
import { theme } from "../../core/theme";


const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen({ navigation }) {
  // const {  authState} = useAuth();

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => theme.colors.primary,
        strokeWidth: 2
      }
    ]
  };
  
const PieChartData = [
  {
    name: 'Seoul',
    population: 21500000,
    color: 'rgba(131, 167, 234, 1)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'Toronto',
    population: 2800000,
    color: '#F00',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
  {
    name: 'New York',
    population: 8400000,
    color: 'rgb(0, 0, 255)',
    legendFontColor: '#7F7F7F',
    legendFontSize: 15,
  },
];

  const chartConfig = {
    backgroundGradientFrom: "red",
    backgroundGradientTo:"white",
    color: (opacity = 1) => "black",
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false
  };



  return (
    <AdminLayout>
    <Background>
    {/* <BackButton goBack={navigation.goBack} />    */}
      <Logo />
      <Header>Dashboard</Header>
      <Paragraph>DashboardScreen you are logged in.</Paragraph>
      
      <Card style={{ margin: 16 }}>
      <Card.Content>
        <Title>Monthly Sales</Title>
        <Paragraph>Sales data for the first half of the year</Paragraph>
        <LineChart
          data={data}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />

        <PieChart
          data={PieChartData}
          width={screenWidth - 50}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={styles.chart}
        />
      </Card.Content>
    </Card>

    </Background>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});