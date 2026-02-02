type Result = {
  [key: string]: unknown;
};

export type AppResponse<T = Result> = {
  success: boolean;
  message: string;
  result: T;
};
