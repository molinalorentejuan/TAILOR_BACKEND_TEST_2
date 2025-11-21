import bcrypt from "bcryptjs";
import { injectable, inject } from "tsyringe";
import { signToken } from "../utils/jwt";
import { AuthRepository } from "../repositories/authRepository";
import { AppError } from "../errors/appError";
import { RegisterParamsInput, LoginParamsInput } from "../dto/authDTO";

@injectable()
export class AuthService {
  constructor(
    @inject(AuthRepository)
    private authRepo: AuthRepository
  ) {}

  registerUser(data: RegisterParamsInput): string {
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();
    const name = data.name.trim();

    if (this.authRepo.emailExists(email)) {
      throw new AppError("Email already in use", 409, "EMAIL_IN_USE");
    }

    const hash = bcrypt.hashSync(password, 10);
    const finalName = name || email.split("@")[0];

    this.authRepo.createUser(finalName, email, hash);

    const user = this.authRepo.findUserBasic(email);
    if (!user) {
      throw new AppError(
        "User could not be created",
        500,
        "USER_CREATION_FAILED"
      );
    }

    return signToken({ id: user.id, role: user.role });
  }

  loginUser(data: LoginParamsInput) {
    const email = data.email.trim().toLowerCase();
    const password = data.password.trim();

    const user = this.authRepo.findUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401, "INVALID_CREDENTIALS");
    }

    const token = signToken({ id: user.id, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}