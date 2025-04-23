import { useEffect, useState } from "react"
import axios from "axios";
import WMO from "./WMO.json"
const SearchFilter = ({ search, countriesAll }) => {
    const [result, setResult] = useState([])
    const [showBool, setShowBool] = useState(false)
    const [weatherData, setWeatherData] = useState([])
    const weatherCodes = WMO //weather codes from openweather to use with current API (open meteo)

    useEffect(() => {
        // Mltiple matching countries
        let countriesFound = countriesAll.filter(forCountry => forCountry.name.common.toLowerCase().includes(search.toLowerCase()))
        let length = countriesFound.length
        // Countries found over 10
        if (length > 10 && showBool == false) {
            setResult(<div>Too many matches, specify another filter</div>);
        }
        // One country found
        if (length === 1 && showBool == false) {

            // Gives current weather variables
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${countriesFound[0].capitalInfo.latlng[0]}&longitude=${countriesFound[0].capitalInfo.latlng[1]}&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=ms`).then(response => {
                setWeatherData(response.data)
                console.log(response.data);

                setResult(
                    <div>
                        <h2> {countriesFound[0].name.common}</h2>
                        <div>capital {countriesFound[0].capital}</div>
                        <div> area {countriesFound[0].area}</div>
                        <br></br>
                        <div><b>languages:</b></div>
                        <br></br>
                        {Object.values(countriesFound[0].languages).map(forLanguage => <li key={forLanguage}>{forLanguage}</li>)}
                        <img src={countriesFound[0].flags.png} width={150}></img>
                        <h2>Weather in {countriesFound[0].capital}</h2>
                        <img
                            src={weatherCodes[weatherData.current.weather_code]}
                            alt="Weather icon"
                            onError={(e) => console.error("Image failed to load", e)}
                        />
                        <div> temperature {weatherData.current.temperature_2m} Celcius</div>
                        <div> wind {weatherData.current.wind_speed_10m} m/s</div>

                    </div>
                )
                console.log(weatherCodes[weatherData.current.weather_code]);
            })




        }
        const showCountry = (countriesFound) => {
            setShowBool(true)
            axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${countriesFound.capitalInfo.latlng[0]}&longitude=${countriesFound.capitalInfo.latlng[1]}&current=temperature_2m,weather_code,wind_speed_10m&wind_speed_unit=ms`).then(response => {
                setWeatherData(response.data)
                setResult(
                    <div>
                        <h2> {countriesFound.name.common}</h2>
                        <div> capital {countriesFound.capital}</div>
                        <div> area {countriesFound.area}</div>
                        <br></br>
                        <div><b>languages:</b></div>
                        <br></br>
                        {Object.values(countriesFound.languages).map(forLanguage => <li key={forLanguage}>{forLanguage}</li>)}
                        <img src={countriesFound.flags.png} width={150}></img>
                        <h2>Weather in {countriesFound.capital}</h2>
                        <img
                            src={weatherCodes[weatherData.current.weather_code]}
                            alt="Weather icon"
                            onError={(e) => console.error("Image failed to load", e)}
                        />
                        <div> temperature {weatherData.current.temperature_2m} Celcius</div>
                        <div> wind {weatherData.current.wind_speed_10m} m/s</div>
                        <div> <button onClick={() => setShowBool(false)}>Return</button></div>
                    </div>)
            })
        }
        // Countries found between 1 and 10
        if (length > 1 && length < 10 && showBool == false) {
            setResult(
                <div>
                    {countriesFound.map(forCountry => <div key={forCountry.name.common}>{forCountry.name.common} <button onClick={() => showCountry(forCountry)}>show</button></div>)}
                </div>
            )
        }
    }, [search, showBool])
    return result
}
function App() {
    const [countriesAll, setCountriesAll] = useState([])
    const [search, setSearch] = useState('')
    useEffect(() => {
        if (search) {
            axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`).then(response => setCountriesAll(response.data))
        }
    }, [search])
    const handleSearch = (event) => {
        setSearch(event.target.value)
    }
    return (
        <div>
            find countries
            <input value={search} onChange={handleSearch} />
            <SearchFilter search={search} countriesAll={countriesAll} ></SearchFilter>
        </div>
    )
}

export default App