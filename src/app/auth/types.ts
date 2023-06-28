interface SignupParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}
interface LoginParams {
  email: string;
  password: string;
}
interface ImageUploadParams {
  file: File;
  uid: string;
}
interface UpdateUserDetailsParams {
    userData: { bio: string; phone: string };
    uid: string;
  }
export type { SignupParams, LoginParams, ImageUploadParams, UpdateUserDetailsParams, };
