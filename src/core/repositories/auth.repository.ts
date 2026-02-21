import type {
  AuthSessionDTO,
  ResetPasswordDTO,
  SignInDTO,
  SignUpDTO,
  SignUpResultDTO,
} from '@core/dto/auth.dto';

export interface AuthRepository {
  getSession(): Promise<AuthSessionDTO | null>;
  refreshSession(): Promise<AuthSessionDTO | null>;
  onAuthStateChange(listener: (session: AuthSessionDTO | null) => void): () => void;
  signIn(credentials: SignInDTO): Promise<void>;
  signUp(data: SignUpDTO): Promise<SignUpResultDTO>;
  resetPassword(data: ResetPasswordDTO): Promise<void>;
  signOut(): Promise<void>;
}
