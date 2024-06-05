import { Component } from "react";

type Props = {
  canDelete: boolean;
  posts: Post[];
  onDelete: (postId: string) => void;
};

type Post = {
  id: string;
  title: string;
  content: string;
  date: string;
  userId: string;
};

export default class PostComponent extends Component<Props> {
  render() {
    const { canDelete, posts, onDelete } = this.props;
    return (
      <div className="container">
        <header className="jumbotron">
          <h2>Posts</h2>
        </header>
        <ul>
          {posts.map((post) => (
            <div key={post.id}>
              <p>
                {new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                }).format(new Date(post.date))}
              </p>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              {canDelete && (
                <button onClick={() => onDelete(post.id)}>Delete</button>
              )}
            </div>
          ))}
        </ul>
      </div>
    );
  }
}
