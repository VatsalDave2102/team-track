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
}
interface TeamOwnerData {
  name: string;
  email: string;
}
interface CreateTeamValues {
  teamName: string;
  overview: string;
  members: TeamMemberData[];
}
interface Comment {
  id: string;
  postedBy: User;
  text: string;
  commentedOn: string;
}
interface Task {
  title: string;
  description: string;
  priority: string;
  deadline: string;
  assignedTo: TeamMemberData[];
  status: string;
  id: string;
  comments: Comment[];
}

interface TeamData extends CreateTeamValues {
  owner: TeamOwnerData;
  id: string;
  image?: string;
  tasks?: Task[];
}
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
};
