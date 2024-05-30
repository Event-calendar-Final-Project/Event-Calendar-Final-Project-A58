import React, { useState, useEffect } from 'react';
import { WiCloud, WiDayCloudy, WiDayFog, WiDaySunny, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

export default function Weather() {
    const [data, setData] = useState({})

    const url = `https://api.openweathermap.org/data/2.5/weather?q=Sofia&units=metric&appid=1a2b3200b2a3430a0147247f682cab07`

    useEffect(() => {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                setData(data)
                console.log(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])

    const getWeatherIcon = (weatherCode) => {
        switch (weatherCode) {
            case '01d':
                return <WiDaySunny />;
            case '01n':
                return <WiDaySunny />;
            case '02d':
                return <WiDayCloudy />;
            case '02n':
                return <WiDayCloudy />;
            case '03d':
            case '03n':
                return <WiCloud />;
            case '04d':
            case '04n':
                return <WiCloud />;
            case '09d':
            case '09n':
                return <WiRain />;
            case '10d':
            case '10n':
                return <WiRain />;
            case '11d':
            case '11n':
                return <WiThunderstorm />;
            case '13d':
            case '13n':
                return <WiSnow />;
            case '50d':
            case '50n':
                return <WiDayFog />;
            default:
                return null;
        }
    }

    return (
        <div className="container">
            <div className="top" style={{ display: 'flex', gap: '10px' }}>
                <div className="stat-value">
                    <p>{data.name}</p>
                </div> 
                <div className="stat-value text-secondary">
                    {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
                </div>
                <div className="stat-value text-info">
                    {data.weather ? <p>{data.weather[0].main}</p> : null}
                </div>
                <div className="weather-icon" style={{ fontSize: '3rem' }}>
                    {data.weather ? getWeatherIcon(data.weather[0].icon) : null}
                </div>
            </div>
        </div>
    );
}
