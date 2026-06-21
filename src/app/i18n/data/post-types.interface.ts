export interface PostTypesMessagesInterface {
  all_types: PostType;
  feedback: PostType;
  questions: PostType;
  resources: PostType;
  showcase: PostType;
  snippets: PostType;
  tutorials: PostType;
}

interface PostType {
  title: string;
  description: string;
}
