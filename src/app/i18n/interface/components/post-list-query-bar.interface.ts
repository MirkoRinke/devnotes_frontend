export interface PostListQueryBarMessagesInterface {
  languages: {
    languages: string;
    ariaLabel: {};
  };
  technologies: {
    technologies: string;
    ariaLabel: {};
  };
  postTypes: {
    postTypes: string;
    all: string;
    all_types: string;
    feedback: string;
    questions: string;
    resources: string;
    showcase: string;
    snippets: string;
    tutorials: string;
    ariaLabel: {};
  };
  category: {
    category: string;
    all: string;
    ariaLabel: {};
  };
  status: {
    status: string;
    all: string;
    ariaLabel: {};
  };
  dateFrom: string;
  dateTo: string;
  sort: {
    sort: string;
    '-updated_at': string;
    updated_at: string;
    '-likes_count': string;
    ariaLabel: {};
  };
}
