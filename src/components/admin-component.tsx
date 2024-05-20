import { Component } from "react";
import authService from "../services/auth-service";
import UserService from "../services/user-service";

type Props = {};

type State = {
  content: string;
}

export default class BoardAdmin extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: ""
    };
  }

  componentDidMount() {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.roles.includes("ROLE_ADMIN")) {
      UserService.getAdminBoard().then(
        response => {
          this.setState({
            content: response.data
          });
        },
        error => {
          this.setState({
            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString()
          });
        }
      );
    } else {
      this.setState({
        content: "You do not have access to this page."
      });
    }
  }

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Admin Component: {this.state.content}</h3>
        </header>
      </div>
    );
  }
}