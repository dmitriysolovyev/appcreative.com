import axios from 'axios';

/*** {@link https://openweathermap.org/api/geocoding-api} */
type GeoData =  {
  name: string;
  local_names: any;
  lat: number;
  lon: number;
  country: string;
}

/*** {@link https://openweathermap.org/current} */
type Weather = {
  coord: {
    lon: number;
    lat: number;
  },
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ],
  base: string,
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  },
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  },
  clouds: {
    all: number;
  },
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  },
  timezone: number;
  id: number;
  name: string;
  cod: number;
}


export class WeatherService {

  /*** {@todo Move to secret or .env} */
  private APP_ID = 'f5f637dbc21857905fe2899694875356';

  /*** {@link https://openweathermap.org/api/geocoding-api} */
  static URL_GEO = 'https://api.openweathermap.org/geo/1.0/direct';
  /*** {@link https://openweathermap.org/current} */
  static URL_WEATHER = 'https://api.openweathermap.org/data/2.5/weather';

  async getGeoData(city: string): Promise<GeoData[]> {
    const result = await axios.get<GeoData[]>(
      WeatherService.URL_GEO,
      {
        params: {
          q: city,
          limit: 1,
          appid: this.APP_ID,
        },
      },
    );
    return result.data;
  }

  async getWeather(lat: number, lon: number): Promise<Weather> {
    const result = await axios.get<Weather>(
      WeatherService.URL_WEATHER,
      {
        params: {
          lat,
          lon,
          units: 'metric',
          appid: this.APP_ID,
        },
      },
    );
    return result.data;
  }

  windToTextualDescription(degree: number){
    if (degree>337.5) return 'N (Northerly)';
    if (degree>292.5) return 'NW (North Westerly)';
    if(degree>247.5) return 'W (Westerly)';
    if(degree>202.5) return 'SW (South Westerly)';
    if(degree>157.5) return 'S (Southerly)';
    if(degree>122.5) return 'SE (South Easterly)';
    if(degree>67.5) return 'E (Easterly)';
    if(degree>22.5){return 'NE (North Easterly)';}
    return 'N (Northerly)';
  }
}
