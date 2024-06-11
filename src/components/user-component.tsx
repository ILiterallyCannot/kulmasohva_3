import { ChangeEvent, Component } from "react";
import { Routes, Route, Link } from "react-router-dom";
import UserService from "../services/user-service";
import AuthService from "../services/auth-service";
import { PostContent } from "../types/post-type";
import PostComponent from "./post-component";
import ApartmentComponent from "./apartment-component";

type Props = {};

type State = {
  content: string;
  posts: PostContent[];
  postTitle: string;
  postContent: string;
};

export default class BoardUser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "",
      posts: [],
      postTitle: "",
      postContent: "",
    };
  }

  componentDidMount() {
    UserService.getUserBoard().then(
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

  handleDelete = (postId: string) => {
    UserService.deletePost(postId).then(
      () => {
        const updatedPosts = this.state.posts.filter(
          (post) => post.id !== postId
        );
        this.setState({ posts: updatedPosts });
      },
      (error) => {
        console.error(error);
      }
    );
  };

  saveUserPost() {
    const currentUser = AuthService.getCurrentUser();
    const newPost: PostContent = {
      id: "",
      title: this.state.postTitle,
      content: this.state.postContent,
      date: new Date().toISOString(),
      userId: currentUser.id,
    };

    UserService.createPost(newPost).then(
      (response) => {
        this.setState((prevState) => ({
          posts: [...prevState.posts, response.data],
          postTitle: "",
          postContent: "",
        }));
      },
      (error) => {
        console.error(error);
      }
    );
    this.loadAllPosts();
  }

  handlePostChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  handlePostSubmit = () => {
    this.saveUserPost();
  };

  render() {
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
          <h3>Create a New Post</h3>
          <h4>Title:</h4>
          <textarea
            name="postTitle"
            value={this.state.postTitle}
            onChange={this.handlePostChange}
          />
          <h4>Content:</h4>
          <textarea
            name="postContent"
            value={this.state.postContent}
            onChange={this.handlePostChange}
          />
          <button onClick={this.handlePostSubmit}>Submit</button>
        </div>
        <div>
          <Routes>
            <Route path="apartments" element={<ApartmentComponent />} />
            <Route
              path="posts"
              element={
                <PostComponent
                  canDelete={false}
                  posts={this.state.posts}
                  onDelete={this.handleDelete}
                />
              }
            />
            <Route
              path="/"
              element={
                <PostComponent
                  canDelete={false}
                  posts={this.state.posts}
                  onDelete={this.handleDelete}
                />
              }
            />
          </Routes>
        </div>
      </div>
    );
  }
}
