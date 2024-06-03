import React, { useState, useEffect } from "react";
import authService from "../services/auth-service";
import UserService from "../services/user-service";
import PostComponent from "./post-component";
import { PostContent } from "../types/post-type";
import IUser, { IRole } from "../types/user-type";

const AdminComponent: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<PostContent[]>([]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
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
    } else {
      setContent("You do not have access to this page.");
    }
  }, []);

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

  const handleDelete = (postId: string) => {
    UserService.deletePost(postId).then(
      () => {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const handleSearch = (criteria: string) => {
    UserService.searchUsers(criteria)
      .then((response) => {
        const usersById = response.data.map((user: any) => ({
          ...user,
          id: user._id,
          username: user.username
        }));
        setUsers(usersById);
      })
      .catch((error) => {
        console.error("Error searching users:", error);
      });
  };

  const handleRoleUpdate = (userId: string, newRoles: IRole[]) => {
    const roleIds = newRoles.map(role => role.id) as IRole[];
    UserService.updateUserRoles(userId, roleIds)
      .then(() => {
        console.log("Roles updated successfully.");
        handleSearch(searchCriteria);
      })
      .catch((error) => {
        console.error("Error updating users:", error);
      });
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Admin Component: {content}</h3>
      </header>
      <h2>User Dashboard</h2>
      <PostComponent
        canDelete={true}
        posts={posts}
        onDelete={handleDelete}
      />
      <h3>Users and roles</h3>
      <input
      type="text"
      value={searchCriteria}
      onChange={(e) => setSearchCriteria(e.target.value)}
      placeholder="Search users..."
      />
      <button onClick={() => handleSearch(searchCriteria)}>Search</button>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>username: {user.username}</p>
            <p>userID: {user.id}</p>
            <p>email: {user.email}</p>
            <p>Roles: {user.roles?.join(', ')}</p>
            <button onClick={() => handleRoleUpdate(user.id ?? '', [{ id: '6654583a3095bace9e96ec01'}])}>
              Update Roles
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminComponent;
