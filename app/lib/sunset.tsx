/**
 * Fetches the sunset time for a fixed latitude/longitude (Holy Trinity) from the sunrise-sunset.org API.
 *
 * Performs a GET request to with cache: 'no-store'.
 *
 * The function logs the API's `results.sunset` value to the console and returns the sunset time
 * string if available. If the request or parsing fails, the error is logged and the function
 * resolves to undefined.
 *
 * @async
 * @returns {Promise<string | undefined>} A promise that resolves to the sunset time string
 * (ISO 8601 UTC format as provided by the API) when available, otherwise undefined.
 *
 * @remarks
 * - Side effects: console.log on success and console.error on failure.
 *
 * @example
 * // Usage
 * const sunsetTime = await Sunset();
 * if (sunsetTime) {
 *   console.log('Sunset at:', sunsetTime);
 * }
 */
const Sunset = async () => {
  try {
    const response = await fetch('https://api.sunrise-sunset.org/json?lat=35.670256636954576&lng=-105.93922058021896&formatted=0', 
      {
        method: 'GET',
        cache: 'no-store',
      });
    const data = await response.json();
    console.log('Sunset time:', data.results.sunset);
    return data.results.sunset;
  } catch (error) {
    console.error('Error fetching sunset data:', error);
  }
}

export default Sunset;