/* Location service APIs */
import axios from 'axios';

const api_url = process.env.REACT_APP_LOCATION_URL

class LocationServiceApi {
    getAllLocations() {
        return axios.get(api_url);
    }

    getLocationFromId(id) {
        return axios.get(`${api_url}/${id}`);
    }

    createNewLocation(newLocation) {
        return axios.post(api_url, newLocation);
    }

    getGeocodeFromAddress(address) {
        const url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        const api_key = process.env.REACT_APP_API_KEY;
        const formatted_address = address.replace(/ /g, "+");
        const key_input = "&key="
        // create new axios instance without auth token for third party API
        const axiosThirdParty = axios.create();
        return axiosThirdParty.get(`${url + formatted_address + key_input + api_key}`);
    }

    updateLocation(location) {
        return axios.patch(api_url + `/${location._id}`, location);
    }
}

export default new LocationServiceApi();
