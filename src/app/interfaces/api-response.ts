export interface ApiResponseArrayInterface<T> {
  status: string;
  message: string;
  code: number;
  count: number;
  data: {
    data: T[];
  };
}

export interface ApiResponseObjektInterface<T> {
  status: string;
  message: string;
  code: number;
  count: number;
  data: {
    data: T;
  };
}
