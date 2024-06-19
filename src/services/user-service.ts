import axios from "axios";
import { PostContent } from "../types/post-type";
import IUser from "../types/user-type";
import authHeader from "./auth-header";
const API_URL = "http://localhost:8080/api/v1/";

class UserService {
  getPublicContent() {
    return axios.get(API_URL + "all");
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }

  getUserPosts(userId: string) {
    return axios.get(`${API_URL}posts/${userId}`, { headers: authHeader() });
  }

  getAllPosts() {
    return axios.get(`${API_URL}posts/`, { headers: authHeader() });
  }

  createPost(postContent: PostContent) {
    return axios.post(`${API_URL}posts/`, postContent, {
      headers: authHeader(),
    });
  }

  updateProfile(userId: string, profileContent: IUser) {
    return axios.put(`${API_URL}users/${userId}`, profileContent, {
      headers: authHeader(),
    });
  }

  getUserInfo(userId: string) {
    return axios.get(`${API_URL}users/${userId}`, { headers: authHeader() });
  }

  deletePost(postId: string) {
    return axios.delete(`${API_URL}posts/${postId}`, { headers: authHeader() });
  }

  searchUsers(username: string): Promise<{ data: IUser[] }> {
    return axios.get(`${API_URL}users/`, {
      params: { username },
      headers: authHeader(),
    });
  }

  deleteUsers(userId: string) {
    return axios.delete(`${API_URL}users/${userId}`, { headers: authHeader() });
  }
}

export default new UserService();
