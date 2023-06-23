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
  profileImage?: string;
  bio?: string;
  phone: string;
}

interface CustomListInfo {
  label: string;
  link: string;
  icon: JSX.Element;
}
interface CustomListItem {
  info: CustomListInfo;
  children?: CustomListInfo[];
}

interface TeamMemberData {
  name: string;
  email: string;
  uid: string;
}
interface TeamOwnerData {
  name: string;
  email: string;
}
interface CreateTeamValues {
  teamName: string;
  overview: string;
  members: string[];
}
interface Comment {
  id: string;
  postedBy: string;
  text: string;
  commentedOn: string;
}
export enum PriorityOption {
  Low,
  Medium,
  High,
  Urgent,
}
interface Task {
  title: string;
  description: string;
  priority: string;
  deadline: string;
  assignedTo: string[];
  id: string;
  comments: Comment[];
}
interface Tasks {
  todo: Task[];
  ongoing: Task[];
  review: Task[];
  completed: Task[];
}
interface TeamData extends CreateTeamValues {
  owner: string;
  id: string;
  image?: string;
  tasks?: Tasks;
}
type TaskColor = "primary" | "info" | "warning" | "error";
export type {
  SignUpUserValues,
  LoginUserValues,
  User,
  CustomListItem,
  TeamMemberData,
  CreateTeamValues,
  TeamOwnerData,
  Task,
  TeamData,
  Comment,
  Tasks,
  TaskColor,
};
