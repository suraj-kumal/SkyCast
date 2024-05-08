import React, { useState, useEffect } from "react";
import moment from "moment";
import "./App.css"; // Import your CSS file
import { FiSearch } from "react-icons/fi";
import { IconContext } from "react-icons";
import Popup from "./components/Popup.jsx";
const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    getWeatherData();
  }, []);

  const getWeatherData = () => {
    navigator.geolocation.getCurrentPosition((success) => {
      let { latitude, longitude } = success.coords;

      fetchWeatherData(latitude, longitude);
    });
  };

  const fetchWeatherData = (latitude, longitude) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setPopupMessage("An error occurred while fetching weather data.");
        setShowPopup(true);
      });
  };
  useEffect(() => {
    Default();
  }, []);

  const Default = () => {
    // Default coordinates for Kathmandu
    const defaultLatitude = 27.7172;
    const defaultLongitude = 85.324;

    fetchWeatherData(defaultLatitude, defaultLongitude);
  };
  const handleSearch = () => {
    let location = document.getElementById("location-input").value.trim();
    if (location !== "") {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}`
      )
        .then((res) => res.json())
        .then((data) => {
          const { coord } = data;
          if (coord) {
            const { lat, lon } = coord;
            fetchWeatherData(lat, lon);
          } else {
            setPopupMessage("Location not found.");
            setShowPopup(true);
          }
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
          setShowPopup("An error occurred while fetching weather data.");
          setShowPopup(true);
        });
    } else {
      setPopupMessage("Please enter a location.");
      setShowPopup(true);
    }
  };
  const getWeatherBackgroundClass = () => {
    if (!weatherData) return "";
    const weather = weatherData.current.weather[0].main.toLowerCase();
    switch (weather) {
      case "clear":
        return "clear";
      case "clouds":
        return "cloudy";
      case "rain":
        return "rainy";
      case "thunderstorm":
        return "stormy";
      case "snow":
        return "snowy";
      case "haze":
        return "haze";
      case "mist":
        return "mist";
      case "drizzle":
        return "drizzle";
      case "fog":
        return "foggy";
      case "smoke":
        return "smoky";
      case "dust":
        return "dusty";
      case "sand":
        return "sandy";
      case "ash":
        return "ashy";
      case "squall":
        return "squally";
      case "tornado":
        return "tornado";
      case "hurricane":
        return "hurricane";
      case "blizzard":
        return "blizzard";
      default:
        return "";
    }
  };
  const handleTeam = () => {
    const team = "Suraj Kumal, Supreme Bhatta, Rijan Maharjan, Asal Paudel";
    setPopupMessage(team);
    setShowPopup(true);
  };

  return (
    <div className={`container ${getWeatherBackgroundClass()}`}>
      <div className="container-input">
        <input type="text" id="location-input" placeholder="Enter location" />

        <button type="submit" id="search-button" onClick={handleSearch}>
          <IconContext.Provider
            value={{
              color:
                weatherData &&
                (weatherData.current.weather[0].main.toLowerCase() === "snow" ||
                  weatherData.current.weather[0].main.toLowerCase() ===
                    "haze" ||
                  weatherData.current.weather[0].main.toLowerCase() === "mist")
                  ? "black"
                  : "white",
              size: "28px",
            }}
          >
            <FiSearch />
          </IconContext.Provider>
        </button>
      </div>

      {weatherData && (
        <div className="current-info">
          <div className="date-container">
            <div className="time">
              {moment().format("hh:mm A")}
              <span id="am-pm">{moment().format("A")}</span>
            </div>
            <div className="date">{moment().format("dddd, DD MMM")}</div>

            <div className="others">
              <div className="weather-item">
                <div>Humidity</div>
                <div>{weatherData.current.humidity}%</div>
              </div>
              <div className="weather-item">
                <div>Pressure</div>
                <div>{weatherData.current.pressure}</div>
              </div>
              <div className="weather-item">
                <div>Wind Speed</div>
                <div>{weatherData.current.wind_speed}</div>
              </div>

              <div className="weather-item">
                <div>Sunrise</div>
                <div>
                  {moment.unix(weatherData.current.sunrise).format("hh:mm A")}
                </div>
              </div>
              <div className="weather-item">
                <div>Sunset</div>
                <div>
                  {moment.unix(weatherData.current.sunset).format("hh:mm A")}
                </div>
              </div>
            </div>
          </div>

          <div className="place-container">
            <p>Time Zone</p>
            <div className="time-zone">{weatherData.timezone}</div>
            <div className="country">
              {weatherData.lat}N {weatherData.lon}E
            </div>
          </div>
        </div>
      )}

      <div className="dt">
        <button className="dtbtn" onClick={handleTeam}>
          Development Team
        </button>
      </div>
      {weatherData && (
        <div className="future-forecast">
          <div className="today">
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.daily[0].weather[0].icon}.png`}
              alt="weather icon"
              className="w-icon"
            />
            <div className="other">
              <div className="day">
                {moment.unix(weatherData.daily[0].dt).format("dddd")}
              </div>
              <div className="temp">
                Night - {weatherData.daily[0].temp.night}&#176;C
              </div>
              <div className="temp">
                Day - {weatherData.daily[0].temp.day}&#176;C
              </div>
            </div>
          </div>

          <div className="weather-forecast">
            {weatherData.daily.slice(1).map((day, idx) => (
              <div key={idx} className="weather-forecast-item">
                <div className="day">{moment.unix(day.dt).format("ddd")}</div>
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                  alt="weather icon"
                  className="w-icon"
                />
                <div className="temp">Night - {day.temp.night}&#176;C</div>
                <div className="temp">Day - {day.temp.day}&#176;C</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Popup */}
      {showPopup && (
        <Popup message={popupMessage} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

export default App;
