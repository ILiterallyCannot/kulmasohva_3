export interface PostContent {
    id: string;
    title: string;
    content: string;
    date: string;
    userId: string;
}

export interface PostComponentProps {
    canDelete: boolean;
    onDelete: (posts: PostContent[]) => void;
    posts: PostContent[];
  }