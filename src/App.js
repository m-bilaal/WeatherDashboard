import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";
import CitiesList from "./components/citieslist/CitiesList";
import AddCity from "./components/addcity/AddCity";

const App = () => {
  const [cities, setCities] = useState([
    { name: "New York", weather: null },
    { name: "London", weather: null },
    { name: "Islamabad", weather: null },
  ]);

  useEffect(() => {
    const fetchWeather = async () => {
      const updatedCities = await Promise.all(
        cities.map(async (city) => {
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=cf02b36efc7a15ef1a7ad442935ab007&units=metric`
            );
            return { ...city, weather: response.data };
          } catch (error) {
            console.error("Error fetching weather data:", error);
            return city;
          }
        })
      );
      setCities(updatedCities);
    };

    fetchWeather();
  }, [cities.length]);

  const removeCity = (cityName) => {
    setCities((prevCities) =>
      prevCities.filter((city) => city.name !== cityName)
    );
  };

  return (
    <section className="weatherSec">
      <div className="container">
        <div className="weatherWrapper">
          <h1>Weather Dashboard</h1>
          <div className="addCity">
            <AddCity setCities={setCities} />
          </div>
          <div className="citiesList">
            {cities.map((city, index) => (
              <CitiesList key={index} city={city} removeCity={removeCity} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default App;
