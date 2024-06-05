import React, { useState, useEffect, ChangeEvent } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth-service";
import UserService from "../services/user-service";
import IUser from "../types/user-type";

const ProfileComponent: React.FC = () => {
  const [content, setContent] = useState<string>("");
  const [redirect, setRedirect] = useState<string | null>(null);
  const [userReady, setUserReady] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<
    IUser & { accessToken: string }
  >({ accessToken: "" });
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phonenumber: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setCurrentUser(currentUser);
      setUserReady(true);
      setFormData(formData);
      getUserInformation(currentUser).then(() => {
        setFormData({
          name: currentUser.name || "",
          surname: currentUser.surname || "",
          phonenumber: currentUser.phonenumber || "",
          city: currentUser.city || "",
          country: currentUser.country || "",
        });
      });
    } else {
      setContent("You do not have access to this page.");
      setRedirect("/home");
    }
  }, []);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  const getUserInformation = async (user: IUser & { accessToken: string }) => {
    try {
      const currentUser = AuthService.getCurrentUser();
      if (!user || !user.id) {
        console.error("User not logged in or missing ID");
        return;
      }
      UserService.getUserInfo(currentUser.id).then((response) => {
        const userInfo = response.data;
        setCurrentUser({
          ...currentUser,
          name: userInfo.name,
          surname: userInfo.surname,
          phonenumber: userInfo.phonenumber,
          city: userInfo.city,
          country: userInfo.country,
        });
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const currentUser = AuthService.getCurrentUser();
      if (!currentUser || !currentUser.id) {
        console.error("User not logged in or missing ID");
        return;
      }

      const profileContent: IUser = {
        id: currentUser.id,
        name: formData.name,
        surname: formData.surname,
        phonenumber: formData.phonenumber,
        city: formData.city,
        country: formData.country,
      };
      await UserService.updateProfile(currentUser.id, profileContent);
      console.log("Profile updated!");
      getUserInformation(currentUser);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="container">
      {userReady && (
        <div>
          <header className="">
            <h3>
              <strong>Welcome, {currentUser.username}</strong>
            </h3>
          </header>
          <p>
            <strong>Name:</strong> {currentUser.name} {currentUser.surname}
          </p>
          <p>
            <strong>Phone:</strong> {currentUser.phonenumber}
          </p>
          <p>
            <strong>Location:</strong> {currentUser.city}, {currentUser.country}
          </p>
          <p>
            <strong>Email:</strong> {currentUser.email}
          </p>
          <strong>Privilages:</strong>
          <ul>
            {currentUser.roles &&
              currentUser.roles.map((role: string, index: number) => (
                <p key={index}>{role}</p>
              ))}
          </ul>
          <h4>Update Profile Information</h4>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="name"
            />
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="last/surname"
            />
            <input
              type="number"
              name="phonenumber"
              value={formData.phonenumber}
              onChange={handleChange}
              placeholder="phone number"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="home city"
            />
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="home country"
            />
            <button type="submit">Save Details</button>
          </form>
        </div>
      )}
    </div>
  );
};
export default ProfileComponent;
