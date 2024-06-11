import axios from "axios";
import authHeader from "./auth-header";
import IApartment from "../types/apartment-type";
//import { IApartment } from "../types/apartment-type";
//import IUser from "../types/user-type";
const API_URL = "http://localhost:8080/api/test/";

class ApartmentService {
    getAllApartments() {
        return axios.get(`${API_URL}apartments/`, { headers: authHeader() });
      }

    listApartment(apartmentContent: IApartment) {
        return axios.post(`${API_URL}apartments/`, apartmentContent, { headers: authHeader() });
    }

    deleteApartment(apartmentId : string) {
        return axios.delete(`${API_URL}apartments/${apartmentId}/`, { headers: authHeader() });
    }
}

export default new ApartmentService();
