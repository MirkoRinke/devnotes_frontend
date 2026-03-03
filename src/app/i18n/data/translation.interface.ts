export interface Content {
  PostTypes: PostTypes;
}

export interface PostTypes {
  all_types: PostType;
  feedback: PostType;
  questions: PostType;
  resources: PostType;
  showcase: PostType;
  snippets: PostType;
  tutorials: PostType;
}

export interface PostType {
  title: string;
  description: string;
}
