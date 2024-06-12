import { useState, useEffect, ChangeEvent } from "react";
import UserService from "../services/user-service";
import { PostContent, PostComponentProps } from "../types/post-type";
import AuthService from "../services/auth-service";

const PostComponent: React.FC<PostComponentProps> = ({canDelete, onDelete, posts}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [postTitle, setPostTitle] = useState<string>("");
  const [postContent, setPostContent] = useState<string>("");

  useEffect(() => {
    loadAllPosts();
  });

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
        setIsLoading(false);
        setError(null);
        onDelete(posts);
      },
      (error) => {
        setIsLoading(false);
        setError("Error fetching posts");
        console.error(error);
      }
    );
  };
  const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostTitle(event.target.value);
  };

  const handleContentChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPostContent(event.target.value);
  };

  const handlePostSubmit = async () => {
    try {
      const currentUser = AuthService.getCurrentUser();
      const newPost: PostContent = {
        id: "",
        title: postTitle,
        content: postContent,
        date: new Date().toISOString(),
        userId: currentUser.id,
      };

      await UserService.createPost(newPost);
      setPostTitle("");
      setPostContent("");
      loadAllPosts();
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostDelete = (post: PostContent) => {
    UserService.deletePost(post.id).then(
      () => {
        onDelete(posts.filter((currentPost) => currentPost.id !== post.id));
      },
      (error) => {
        console.error(error);
      }
    );
  };

  return (
    <div className="container">
      <header className="jumbotron">
        <h2>Posts</h2>
      </header>

      {isLoading && <p>Loading posts...</p>}
      {error && <p className="error">Error: {error}</p>}
      <div>
        <h3>Create a New Post</h3>
        <h4>Title:</h4>
        <textarea
          name="postTitle"
          value={postTitle}
          onChange={handleTitleChange}
        />
        <h4>Content:</h4>
        <textarea
          name="postContent"
          value={postContent}
          onChange={handleContentChange}
        />
        <button onClick={handlePostSubmit}>Submit</button>
      </div>
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
              <button onClick={() => handlePostDelete(post)}>Delete</button>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default PostComponent;
