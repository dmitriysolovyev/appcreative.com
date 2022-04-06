import { APIGatewayEvent } from 'aws-lambda';
import { WeatherService } from '../openweathermap';

export const handle = async function (event: APIGatewayEvent) {
  let result = '';
  let city = '';
  try {
    city = event.queryStringParameters?.city ?? '';
    if (city) {
      const weatherService = new WeatherService();
      const geo = await weatherService.getGeoData(city);
      const {lon, lat} = geo[0];
      if (lon !== undefined && lat !== undefined) {
        const weather = await weatherService.getWeather(lat, lon);

        /*** {@todo Use template for html} */
        result = `
          <br>
          Weather for city ${weather.name} <br><br>
          Temperature: ${weather.main.temp} C <br>
          Weather conditions: ${weather.weather[0].main} <br>
          Wind: ${weather.wind.speed} km/h <br>
          Wind direction ${weatherService.windToTextualDescription(weather.wind.deg)} <br>
          Pressure: ${weather.main.pressure} <br>
          Humidity: ${weather.main.humidity} <br>
        `
        weather.weather[0].main;
      }
    }
  } catch (err) {
    result = `Error: ${err.message}`;
  }

  /*** {@todo Use template for html} */
  return {
    statusCode: 200,
    "headers": {
      "content-type": "text/html"
    },
    body: `
    <!doctype html>
    <html>
      <head>
        <link rel="shortcut icon" href="#" />
        <title>Weather</title>
        <meta name="description" content="Weather in a specific city">
      </head>
      <body>
        <form>
          <label for="fname">City:</label><br>
          <input type="text" id="city" name="city" value="${city}"><br>
          <input type="submit" value="Search">
        </form>
        <p>${result}</p>
      </body>
    </html>`,
  };
};
