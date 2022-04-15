export interface UserLogin {
  phoneNumber: string;
}

declare global {
  namespace Express {
    interface User extends UserLogin {}
  }
}
