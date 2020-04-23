import React, {useState} from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';


export default function App() {
  const [location, setLocation] = useState(false);
  const [coordinates, setCoordinates] = useState({latitude: 0, longitude: 0});
  const [weatherInfo, setWeatherInfo] = useState(null);

  // PUT YOUR API KEY HERE
  const apiKey = "YOU API HERE";

  async function getWeatherfromAPI() {
    try {
      let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${apiKey}`);
      let json = await response.json();
      console.log(json);
      setWeatherInfo(json);
    } catch (error) {
      console.error(error);
      setWeatherInfo(null);
    }
  }


  async function getLocationAsync () {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      setLocation(false);
    } else {
      setLocation(true);
      
      let currentLocation = await Location.getCurrentPositionAsync({});
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
        weatherInfo !== null
        ? <Text>Weather Data Here</Text>
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
    justifyContent: 'center',
    padding:22,
  },
});
