export class AppError extends Error {
  public status: number;
  public code: string;

  constructor(
    message: string,
    status: number = 400,
    code: string = "BAD_REQUEST"
  ) {
    super(message);
    this.status = status;
    this.code = code;
  }
}