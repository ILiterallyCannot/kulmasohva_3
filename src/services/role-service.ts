import axios from "axios";
import authHeader from "./auth-header";
import { IRole } from "../types/user-type";

const API_URL = "http://localhost:8080/api/test/";

class RoleService {
  getAllRoles() {
    return axios.get(API_URL + "roles", { headers: authHeader() });
  };

  updateUserRoles(id: string, newRoles: IRole[]): Promise<void> {
    return axios.put(
      `${API_URL}users/${id}/roles`,
      { roles: newRoles },
      { headers: authHeader() }
    );
  }
}

export default new RoleService();
