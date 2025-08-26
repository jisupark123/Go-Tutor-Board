type Result = {
  [key: string]: any;
};

export type AppResponse<T = Result> = {
  success: boolean;
  message: string;
  result: T;
};
