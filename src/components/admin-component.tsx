import { Component } from "react";
import authService from "../services/auth-service";
import UserService from "../services/user-service";
import PostComponent from './post-component';
import { PostContent } from "../types/post-type";

type Props = {};

type State = {
  content: string,
  posts: PostContent[];
};

export default class BoardAdmin extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "",
      posts: [],
    };
  }

  componentDidMount() {
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.roles.includes("ROLE_ADMIN")) {
      UserService.getAdminBoard().then(
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

  handleDelete = (postId: string) => {
    UserService.deletePost(postId).then(() => {
      const updatedPosts = this.state.posts.filter((post) => post.id !== postId);
      this.setState({ posts: updatedPosts });
    },
    (error) => {
      console.error(error);
    });
  };

  render() {
    return (
      <div className="container">
        <header className="jumbotron">
          <h3>Admin Component: {this.state.content}</h3>
        </header>
        <h2>User Dashboard</h2>
        <PostComponent canDelete={true} posts={this.state.posts} onDelete={this.handleDelete} />
      </div>
    );
  }
}
