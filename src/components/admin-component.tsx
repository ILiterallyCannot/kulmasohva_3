import React, { useState, useEffect, useCallback } from "react";
import { Routes, Route, Link } from "react-router-dom";
import AuthService from "../services/auth-service";
import UserService from "../services/user-service";
import RoleService from "../services/role-service";
import PostComponent from "./post-component";
import { PostContent } from "../types/post-type";
import IApartment from "../types/apartment-type";
import ApartmentComponent from "./apartment-component";
import ApartmentService from "../services/apartment-service";
import IUser, { IRole } from "../types/user-type";

const AdminComponent: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<PostContent[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [apartments, setApartments] = useState<IApartment[]>([]);

  const loadApartments = useCallback(() => {
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
    const currentUser = AuthService.getCurrentUser();
    if (currentUser && currentUser.roles.includes("ROLE_ADMIN")) {
      UserService.getAdminBoard().then(
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
      loadAllPosts();
      loadApartments();
      loadAllRoles();
    } else {
      setContent("You do not have access to this page.");
    }
  }, [loadApartments]);

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
  };

  const loadAllRoles = () => {
    RoleService.getAllRoles().then(
      (response) => {
        const roles = response.data.map((role: any) => ({
          id: role._id,
          name: role.name,
        }));
        setRoles(roles);
      },
      (error) => {
        console.error("Error fetching roles:", error);
      }
    );
  };

  const handlePostDelete = (updatedPosts: PostContent[]) => {
    setPosts(updatedPosts);
  }

  const handleApartmentDelete = (apartment: IApartment) => {
    console.log("Attempting delete of", apartment.id);
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

  const handleSearch = () => {
    UserService.searchUsers(searchCriteria)
      .then((response) => {
        const usersById = response.data.map((user: any) => ({
          ...user,
          id: user._id,
        }));
        setUsers(usersById);
        if (usersById.length > 0) {
          setSelectedUser(usersById[0].id);
          if (usersById[0].roles) {
            setSelectedRole(usersById[0].roles[0]);
          }
        } else {
          setSelectedUser("");
          setSelectedRole(null);
        }
      })
      .catch((error) => {
        console.error("Error searching users:", error);
      });
  };

  const handleRoleUpdate = () => {
    if (selectedUser && selectedRole && selectedRole.id) {
      RoleService.updateUserRoles(selectedUser, [selectedRole])
        .then(() => {
          console.log("Roles updated successfully.");
          handleSearch(); // Refresh the user list
        })
        .catch((error) => {
          console.error("Error updating roles:", error);
        });
    }
  };

  const handleUserDelete = (userId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      UserService.deleteUsers(userId)
        .then(() => {
          console.log("User deleted successfully");
          handleSearch();
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
    } else {
      console.log("User deletion cancelled.");
    }
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link to={"/admin/posts"} className="nav-link">
              Posts
            </Link>
            <Link to={"/admin/apartments"} className="nav-link">
              Apartments
            </Link>
          </li>
        </div>
      </nav>
      <header className="jumbotron">
        <h3>Admin Component: {content}</h3>
      </header>
      <h2>User Dashboard</h2>
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
      <h3>Users and roles</h3>
      <input
        type="text"
        value={searchCriteria}
        onChange={(e) => setSearchCriteria(e.target.value)}
        placeholder="Search users..."
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {users.map((user) => (
          <div key={user.id}>
            <li
              onClick={() => setSelectedUser(user.id)}
              className={selectedUser === user.id ? "selected" : ""}
            >
              <p>username: {user.username}</p>
              <p>userID: {user.id}</p>
              <p>email: {user.email}</p>
              {user.roles &&
                user.roles.map((roleId: string, index: number) => {
                  const role = roles.find((r) => r.id === roleId);
                  return <p key={index}>Role: {role ? role.name : roleId}</p>;
                })}
            </li>
            <button onClick={() => handleUserDelete(user.id)}>
              Delete User
            </button>
          </div>
        ))}
      </ul>
      {selectedUser && (
        <div>
          <select
            value={selectedRole?.id || ""}
            onChange={(e) => {
              const selectedRoleId = e.target.value;
              const role = roles.find((role) => role.id === selectedRoleId);
              setSelectedRole(role ? role : null);
            }}
          >
            <option value="">User Privilages</option>
            {roles.map((role) => (
              <option key={role.id} value={role?.id || ""}>
                {role.name}
              </option>
            ))}
          </select>
          <button onClick={handleRoleUpdate}>Update Privilages</button>
        </div>
      )}
    </div>
  );
};

export default AdminComponent;
