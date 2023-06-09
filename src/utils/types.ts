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

interface CustomListInfo{
  label: string;
  link: string;
  icon: JSX.Element;
}
interface CustomListItem {
  info: CustomListInfo
  children?: CustomListInfo[]
}
export type { SignUpUserValues, LoginUserValues, User, CustomListItem };
