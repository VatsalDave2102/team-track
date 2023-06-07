interface SignUpUserValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
interface LoginUserValues {
  email: string;
  password: string;
}
interface User {
  name: string;
  email: string;
  uid: string;
}
export type { SignUpUserValues, LoginUserValues, User };
