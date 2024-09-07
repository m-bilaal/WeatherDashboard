import React, { useState, useEffect, useRef } from "react";
import "../addcity/AddCity.css";
import axios from "axios";

const AddCity = ({ setCities }) => {
  const [cityName, setCityName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1); // Track the active suggestion index
  const [showSuggestions, setShowSuggestions] = useState(false); // Track whether suggestions are shown
  const wrapperRef = useRef(null); // Ref to detect outside click

  // Fetch city suggestions as the user types
  const handleCityNameChange = async (e) => {
    const value = e.target.value;
    setCityName(value);
    setActiveSuggestionIndex(-1); // Reset active suggestion index

    if (value.length > 0) {
      try {
        const response = await axios.get(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${value}&types=CITY&limit=5&minPopulation=50000`,
          {
            headers: {
              "X-RapidAPI-Key":
                "6ed4bcb9e1mshaed8eaad5fcf81ep16dd65jsnb65c42a5433d",
              "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            },
          }
        );
        setSuggestions(response.data.data.map((city) => city.city));
        setShowSuggestions(true); // Show suggestions on valid input
      } catch (error) {
        console.error("Error fetching city suggestions:", error);
      }
    } else {
      setSuggestions([]); // Clear suggestions if input is too short
      setShowSuggestions(false); // Hide suggestions
    }
  };

  // Handle form submission for adding a city
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If user presses "Enter" while navigating suggestions, add the highlighted city
    if (activeSuggestionIndex >= 0 && suggestions.length > 0) {
      setCityName(suggestions[activeSuggestionIndex]);
      setSuggestions([]);
      setShowSuggestions(false); // Hide suggestions after selection
      setActiveSuggestionIndex(-1); // Reset active suggestion index
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=cf02b36efc7a15ef1a7ad442935ab007&units=metric`
      );
      setCities((prevCities) => [
        ...prevCities,
        { name: cityName, weather: response.data },
      ]);
      setCityName(""); // Clear input after submission
      setSuggestions([]); // Clear suggestions after submission
      setShowSuggestions(false); // Hide suggestions after submission
    } catch (error) {
      console.error("Error fetching city weather:", error);
      alert("Invalid city name or error fetching weather data.");
    }
  };

  // Handle click on a suggestion to autofill the input
  const handleSuggestionClick = (suggestion) => {
    setCityName(suggestion);
    setSuggestions([]); // Clear suggestions after selection
    setShowSuggestions(false); // Hide suggestions after selection
  };

  // Handle keyboard navigation on the suggestions list
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      // Move the highlight down
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
    } else if (e.key === "ArrowUp") {
      // Move the highlight up
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : 0
      );
    } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
      // Select the highlighted suggestion on Enter key
      setCityName(suggestions[activeSuggestionIndex]);
      setSuggestions([]); // Clear suggestions after selection
      setShowSuggestions(false); // Hide suggestions after selection
      setActiveSuggestionIndex(-1); // Reset active suggestion index
    }
  };

  // Detect clicks outside the component
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowSuggestions(false); // Hide suggestions if click outside
    }
  };

  useEffect(() => {
    // Add event listener when component is mounted
    document.addEventListener("mousedown", handleClickOutside);

    // Remove event listener when component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="addCityForm">
      <form onSubmit={handleSubmit}>
        <div className="addCityInput">
          <input
            type="text"
            value={cityName}
            onChange={handleCityNameChange}
            onKeyDown={handleKeyDown} // Add key down event handler
            placeholder="Enter city name"
            required
          />
          {/* Display suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className={index === activeSuggestionIndex ? "active" : ""} // Add active class if highlighted
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type="submit">Add City</button>
      </form>
    </div>
  );
};

export default AddCity;
