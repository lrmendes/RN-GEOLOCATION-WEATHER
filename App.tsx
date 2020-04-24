import React, {useState} from 'react';
import { StyleSheet, Button, Text, View, ScrollView } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
  const [weatherInfo, setWeatherInfo] = useState({data: null, city: null});

  // PUT YOUR API KEY HERE - GOT FROM: https://home.openweathermap.org/api_keys
  const apiKey = "PUT YOUR API KEY HERE";

  async function getWeatherfromAPI() {
    try {
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}`);
      let json = await response.json();
      console.log(json.city);
      setWeatherInfo({data: json.list, city: json.city });
    } catch (error) {
      setWeatherInfo({data: null, city: null});
    }
  }


  async function getLocationAsync () {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setLocation(false);
    } else {
      setLocation(true);
      
      let currentLocation = await Location.getCurrentPositionAsync({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000
      });
      setCoordinates({latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude});
    }
  }

  return (
    <View style={styles.container}>

      { !location

        ? <React.Fragment>
          <Text>Location Permission: Deny.</Text>
          <Button onPress={getLocationAsync} title="Set Permission"/>
          </React.Fragment>

        : coordinates.latitude === 0

          ? <React.Fragment>
            <Text>Location Permission: OK.</Text>
            <Text>Getting current location...</Text>
            </React.Fragment>
          
          : <React.Fragment>
            <Text>Your coordinates:{"\n\n"}</Text>
              <Text>Latitude: {coordinates.latitude} {"\n"}</Text>
              <Text>Longitute: {coordinates.longitude} {"\n"}</Text>
              <Button onPress={getWeatherfromAPI} title="Get Current Weather"/>
            </React.Fragment> 
      }

      {
        weatherInfo.data !== null
        ? <View style={styles.weatherView}>
            <Text style={styles.item}>City: {weatherInfo.city.name}</Text>
            <Text style={styles.item}>Country: {weatherInfo.city.country}</Text>

            <ScrollView style={{ width: '80%'}}>
            {
              weatherInfo.data.map( (item) => {
              console.log("-",item);
              return (
                <View style={styles.card} key={item.dt}>
                <Text style={styles.item2}>Date: {item.dt_txt }</Text>
                <Text style={styles.item2}>Temperature: { (item.main.temp -273.15).toFixed(2) } °C</Text>
                <Text style={styles.item2}>Description: {item.weather[0].description }</Text>
                </View>
              )
              })
            }
            </ScrollView>

          </View>
        : null
      }

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop:80,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  item2: {
    padding: 5,
    fontSize: 18,
    height: 44,
  },
  weatherView: {
    width: '100%',
    height: 400, 
    alignItems:'center',
    paddingTop: 25,
  },
  card: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#ede8e8'
  }
});
