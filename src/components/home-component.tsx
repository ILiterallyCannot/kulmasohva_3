import { useState, useEffect } from "react";

import UserService from "../services/user-service";

const Home: React.FC = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    UserService.getPublicContent()
      .then((response) => {
        setContent(response.data);
      })
      .catch((error) => {
        const content =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();

          setContent(content);
      });
  });

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
        <h3>Welcome to Kulmasohva.fi</h3>
      </header>
    </div>
  );
};

export default Home;
