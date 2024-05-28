import axios from "axios";
import authHeader from "./auth-header";
import { PostContent } from "../types/post-type";

const API_URL = "http://localhost:8080/api/test/";

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
    return axios.get(`${API_URL}posts/`, { headers: authHeader() });
  }

  getAllPosts() {
    return axios.get(API_URL + 'posts', { headers: authHeader() });
  }
  
  createPost(postContent: PostContent) {
    return axios.post(API_URL + 'posts', postContent, { headers: authHeader() });
  }

  deletePost(postId: string) {
    return axios.delete(`${API_URL}posts/${postId}`, { headers: authHeader() });
  }
}

export default new UserService();
