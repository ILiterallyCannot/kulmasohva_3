import axios from "axios";
import { IRole } from "../types/user-type";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/api/v1/";

class RoleService {
  getAllRoles() {
    return axios.get(`${API_URL}roles`, { headers: authHeader() });
  }

  updateUserRoles(id: string, newRoles: IRole[]): Promise<void> {
    return axios.put(
      `${API_URL}users/${id}/roles`,
      { roles: newRoles },
      { headers: authHeader() }
    );
  }
}

export default new RoleService();
