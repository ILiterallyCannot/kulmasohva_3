import { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserService from "../services/user-service";
import IApartment from "../types/apartment-type";
import PostComponent from "./post-component";
import { PostContent } from "../types/post-type";
import ApartmentComponent from "./apartment-component";
import ApartmentService from "../services/apartment-service";

const UserComponent: React.FC = () => {
  const [apartments, setApartments] = useState<IApartment[]>([]);
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<PostContent[]>([]);
  useEffect(() => {
    UserService.getUserBoard().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        );
      }
    );
    loadApartments();
  }, []);

  const loadApartments = () => {
    ApartmentService.getAllApartments().then(
      (response) => {
        setApartments(response.data);
      },
      (error) => {
        console.error("Error fetching apartments:", error);
      }
    );
  };

  const handlePostDelete = (updatedPosts: PostContent[]) => {
    setPosts(updatedPosts);
  }
  
    const handleApartmentDelete = (apartment: IApartment) => {
      ApartmentService.deleteApartment(apartment.id).then(
        () => {
          const updatedApartments = apartments.filter(
            (currentApartment) => currentApartment.id !== apartment.id
          );
          setApartments(updatedApartments);
        },
        (error) => {
          console.error(error);
        }
      );
    };
  

    return (
      <div className="container">
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/user/posts"} className="nav-link">
                Posts
              </Link>
              <Link to={"/user/apartments"} className="nav-link">
                Apartments
              </Link>
            </li>
          </div>
        </nav>
        <div className="container mt-3"></div>
        <header className="jumbotron">
          <h2>User Dashboard</h2>
        </header>
        <div>
          <Routes>
            <Route
              path="apartments"
              element={
                <ApartmentComponent
                  canDelete={true}
                  onDelete={handleApartmentDelete}
                  loadApartments={loadApartments}
                  apartments={apartments}
                />
              }
            />
            <Route
              path="posts"
              element={
                <PostComponent
                  canDelete={false}
                  posts={posts}
                  onDelete={handlePostDelete}
                />
              }
            />
            <Route
              path="/"
              element={
                <PostComponent
                  canDelete={false}
                  posts={posts}
                  onDelete={handlePostDelete}
                />
              }
            />
          </Routes>
        </div>
      </div>
    );
  };
export default UserComponent;
