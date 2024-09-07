import React from "react";
import "../citieslist/CitiesList.css";

const CitiesList = ({ city, removeCity }) => {
  if (!city.weather) {
    return <div>Loading weather for {city.name}...</div>;
  }

  const { name, weather } = city;
  const { main, description, icon } = weather.weather[0];
  const { temp } = weather.main;

  return (
    <div className="cityInfo">
      <div>
        <div className="removeCity">
          <h2>{name}</h2>
          <img
            src={`http://openweathermap.org/img/wn/${icon}.png`}
            alt={description}
          />
        </div>
        <p>Temperature: {temp}°C</p>
        <p>{description}</p>
        <button onClick={() => removeCity(name)}>Remove</button>
      </div>
    </div>
  );
};

export default CitiesList;
