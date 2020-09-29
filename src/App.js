import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData, prettyPrintStat, date2str } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import displayLanguage from './language/index';

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [language, setLanguage] = useState(1);
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 13.4853773, lng: 20.3800329 });
  const [mapZoom, setMapZoom] = useState(2);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setLoading(false)
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  const onLanguageChange = async (e) => {
    if (displayLanguage[language].key == "th") {
      setLanguage(1);
      setMapCenter({ lat: 13.485377, lng: 102.284564 });
      setMapZoom(5);
    } else {
      setLanguage(0);
      setMapCenter({ lat: 13.485377, lng: 20.380032 });
      setMapZoom(2);
    }
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>{displayLanguage[language].head}</h1>
          <div className="app__language">
            <img src={displayLanguage[language].image} onClick={onLanguageChange} />
          </div>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          {loading ?
            <Skeleton variant="rect" width={362} height={155} />
            :
            <InfoBox
              onClick={(e) => setCasesType("cases")}
              title={displayLanguage[language].menuTitle[0].tltle1}
              isRed
              active={casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={numeral(countryInfo.cases).format("0.0a")}
              displayLanguage={displayLanguage[language]}
            />}
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title={displayLanguage[language].menuTitle[1].tltle2}
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
            displayLanguage={displayLanguage[language]}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title={displayLanguage[language].menuTitle[2].tltle3}
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
            displayLanguage={displayLanguage[language]}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
        <div className="app__timeUpdate">
          <label style={{ marginBottom: 20 }}>
            {displayLanguage[language].timeDisplay.text1}
            {date2str(new Date(countryInfo.updated), displayLanguage[language].timeDisplay.text2, displayLanguage[language].key)}
          </label>
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>{displayLanguage[language].information}</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
