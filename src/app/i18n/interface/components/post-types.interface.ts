export interface PostTypesMessagesInterface {
  heading: string;
  loading: string;
  tile: {
    all_types: PostType;
    feedback: PostType;
    questions: PostType;
    resources: PostType;
    showcase: PostType;
    snippets: PostType;
    tutorials: PostType;
  };
  ariaLabel: {
    totalCounts: string;
  };
}

interface PostType {
  title: string;
  description: string;
}
