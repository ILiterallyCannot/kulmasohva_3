import React, { useState, useEffect } from "react";
import authService from "../services/auth-service";
import UserService from "../services/user-service";
import RoleService from "../services/role-service";
import PostComponent from "./post-component";
import { PostContent } from "../types/post-type";
import IUser, { IRole } from "../types/user-type";

const AdminComponent: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<PostContent[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);

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
      loadAllRoles();
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

  const handleSearch = () => {
    UserService.searchUsers(searchCriteria)
      .then((response) => {
        const usersById = response.data.map((user: any) => ({
          ...user,
          id: user._id,
        }));
        setUsers(usersById);
        //if (usersById.length > 0) {
        //  setSelectedUser(usersById[0]); // Automatically select the first user
        //  setSelectedRole(usersById[0].roles[0] || null); // Automatically select the user's first role
        //} else {
        //  setSelectedUser(null);
        //  setSelectedRole(null);
        //}
      })
      .catch((error) => {
        console.error("Error searching users:", error);
      });
  };

  const handleRoleUpdate = () => {
    if (selectedUser && selectedRole) {
      RoleService.updateUserRoles(selectedUser.id, [selectedRole])
        .then(() => {
          console.log("Roles updated successfully.");
          handleSearch(); // Refresh the user list
        })
        .catch((error) => {
          console.error("Error updating roles:", error);
        });
    }
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>Admin Component: {content}</h3>
      </header>
      <h2>User Dashboard</h2>
      <PostComponent canDelete={true} posts={posts} onDelete={handleDelete} />
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
          <li key={user.id} onClick={() => setSelectedUser(user)}>
            <p>username: {user.username}</p>
            <p>userID: {user.id}</p>
            <p>email: {user.email}</p>
            <p>Role: {user.roles}</p> {/* assuming roles is an array of role IDs */}
          </li>
        ))}
      </ul>
      {selectedUser && (
        <div>
          <h3>User: {selectedUser.username}</h3>
          <select
            value=""
            onChange={(e) => {
              const selectedRoleId = e.target.value;
              const role = roles.find((role) => role.id === selectedRoleId);
              setSelectedRole(role || null);
            }}
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value="">
                {role.name}
              </option>
            ))}
          </select>
          <button onClick={handleRoleUpdate}>Update Role</button>
        </div>
      )}
    </div>
  );
};

export default AdminComponent;
