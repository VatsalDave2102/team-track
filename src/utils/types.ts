interface SignUpUserValues{
    name: string;
    email:string;
    phone: string;
    password: string;
    confirmPassword: string;
  }
interface LoginUserValues{
  email: string;
  password: string;
}
  export type {SignUpUserValues, LoginUserValues}