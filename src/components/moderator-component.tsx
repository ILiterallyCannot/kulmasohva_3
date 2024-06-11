import { Component } from "react";
import { Routes, Route, Link} from "react-router-dom";
import ApartmentComponent from "./apartment-component";
import UserService from "../services/user-service";
import authService from "../services/auth-service";
import PostComponent from './post-component';
import { PostContent } from "../types/post-type";
import IApartment from "../types/apartment-type";
import ApartmentService from "../services/apartment-service";

type Props = {};

type State = {
  content: string;
  posts: PostContent[];
  apartments: IApartment[];
};

export default class BoardModerator extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "",
      posts: [],
      apartments: [],
    };
  }

  handlePostDelete = (postId: string) => {
    UserService.deletePost(postId).then(() => {
      const updatedPosts = this.state.posts.filter((post) => post.id !== postId);
      this.setState({ posts: updatedPosts });
    },
    (error) => {
      console.error(error);
    });
  };

  handleApartmentDelete = (apartment: IApartment) => {
    ApartmentService.deleteApartment(apartment.id).then(
      () => {
        const updatedApartments = this.state.apartments.filter(
          (apartment) => apartment.id !== apartment.id
        );
        this.setState({ apartments: updatedApartments });
        this.loadApartments();
      },
      (error) => {
        console.error(error);
      }
    );
  };

  componentDidMount() {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.roles.includes("ROLE_ADMIN" || "ROLE_MODERATOR")) {
      UserService.getModeratorBoard().then(
        (response) => {
          this.setState({
            content: response.data,
          });
        },
        (error) => {
          this.setState({
            content:
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString(),
          });
        }
      );
      this.loadAllPosts();
      this.loadApartments();
    } else {
      this.setState({
        content: "You do not have access to this page.",
      });
    }
  }

  loadAllPosts() {
    UserService.getAllPosts().then(
      (response) => {
        const posts = response.data.map((post: any) => ({
          id: post._id,
          title: post.title,
          content: post.content,
          date: post.date,
          userId: post.userId,
        }));
        this.setState({ posts });
      },
      (error) => {
        console.error(error);
      }
    );
  }

  loadApartments = () => {
    ApartmentService.getAllApartments().then(
      (response) => {
        this.setState({apartments: response.data});
      },
      (error) => {
        console.error('Error fetching apartments:', error);
      }
    );
  };

  render() {
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
          <h3>Moderator board: {this.state.content}</h3>
        </header>
        <h2>User Dashboard</h2>
        <div>
          <Routes>
            <Route path="apartments" element={<ApartmentComponent canDelete={true} onDelete={this.handleApartmentDelete} loadApartments={this.loadApartments} apartments={this.state.apartments} />} />
            <Route
              path="posts"
              element={
                <PostComponent
                  canDelete={true}
                  posts={this.state.posts}
                  onDelete={this.handlePostDelete}
                />
              }
            />
            <Route
              path="/"
              element={
                <PostComponent
                  canDelete={true}
                  posts={this.state.posts}
                  onDelete={this.handlePostDelete}
                />
              }
            />
          </Routes>
        </div>
      </div>
    );
  }
}
