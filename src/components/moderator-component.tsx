import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link} from "react-router-dom";
import ApartmentComponent from "./apartment-component";
import UserService from "../services/user-service";
import authService from "../services/auth-service";
import PostComponent from './post-component';
import { PostContent } from "../types/post-type";
import IApartment from "../types/apartment-type";
import ApartmentService from "../services/apartment-service";

const ModeratorComponent: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<PostContent[]>([]);
  const [apartments, setApartments] = useState<IApartment[]>([]);

  const loadApartments = useCallback(() => {
    console.log("loading apartments");
    ApartmentService.getAllApartments()
      .then((response) => {
        const apartments = response.data.map((apartment: any) => ({
          id: apartment._id,
          address: apartment.address,
          city: apartment.city,
          country: apartment.country,
          size: apartment.size,
          description: apartment.description,
          price: apartment.price,
        }));
        setApartments(apartments);
      })
      .catch((error) => {
        console.error('Error fetching apartments:', error);
      });
  }, []);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.roles.includes("ROLE_ADMIN" || "ROLE_MODERATOR")) {
      UserService.getModeratorBoard().then(
        (response) => {
          setContent(
            response.data,
          );
        },
        (error) => {
          setContent(
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          );
        }
      );
      loadAllPosts();
      loadApartments();
    } else {
      setContent(
        "You do not have access to this page.",
      );
    }
  }, [loadApartments])

  const loadAllPosts = () => {
    UserService.getAllPosts().then(
      (response) => {
        const posts = response.data.map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          date: post.date,
          userId: post.userId,
        }));
        setPosts(posts);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  const handlePostDelete = (updatedPosts: PostContent[]) => {
    setPosts(updatedPosts);
  }

  const handleApartmentDelete = (apartment: IApartment) => {
    console.log("Attempting delete of", apartment.id)
    ApartmentService.deleteApartment(apartment.id).then(
      () => {
        const updatedApartments = apartments.filter(
          (currentApartment) => currentApartment.id !== apartment.id
        );
        console.log("Deleted apartment!");
        setApartments(updatedApartments);
        loadApartments();
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
              <Link to={"/mod/posts"} className="nav-link">
                Posts
              </Link>
              <Link to={"/mod/apartments"} className="nav-link">
                Apartments
              </Link>
            </li>
          </div>
        </nav>
        <header className="jumbotron">
          <h3>Moderator board: {content}</h3>
        </header>
        <h2>User Dashboard</h2>
        <div>
          <Routes>
            <Route path="apartments" element={<ApartmentComponent canDelete={true} onDelete={handleApartmentDelete} loadApartments={loadApartments} apartments={apartments} />} />
            <Route
              path="posts"
              element={
                <PostComponent
                  canDelete={true}
                  posts={posts}
                  onDelete={handlePostDelete}
                />
              }
            />
            <Route
              path="/"
              element={
                <PostComponent
                  canDelete={true}
                  posts={posts}
                  onDelete={handlePostDelete}
                />
              }
            />
          </Routes>
        </div>
      </div>
    );
}

export default ModeratorComponent;
