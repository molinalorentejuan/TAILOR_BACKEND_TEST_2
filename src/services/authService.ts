// src/services/AuthService.ts
import bcrypt from "bcryptjs";
import { injectable, inject } from "tsyringe";
import { signToken } from "../utils/jwt";
import { AuthRepository, DBUser } from "../repositories/authRepository";
import { AppError } from "../errors/appError";
import { RegisterInput, LoginInput } from "../dto/auth.dto";

@injectable()
export class AuthService {
  constructor(
    @inject(AuthRepository)
    private authRepo: AuthRepository
  ) {}

  /**
   * Registro de usuario usando RegisterDTO ya validado.
   */
  registerUser(data: RegisterInput ): string {
    const { email, password, name } = data;

    if (this.authRepo.emailExists(email)) {
      throw new AppError("Email already in use", 409, "EMAIL_IN_USE");
    }

    const hash = bcrypt.hashSync(password, 10);
    const finalName = name.trim() || email.split("@")[0];

    this.authRepo.createUser(finalName, email, hash);

    const user = this.authRepo.findUserBasic(email);
    if (!user) {
      throw new AppError("User could not be created", 500, "USER_CREATION_FAILED");
    }

    return signToken({ id: user.id, role: user.role });
  }

  /**
   * Login usando LoginDTO ya validado.
   */
  loginUser(data: LoginInput) {
    const { email, password } = data;

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