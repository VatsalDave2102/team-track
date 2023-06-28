import { Comment, Task, Tasks } from "../../utils/types";

interface CreateTeamParams {
  teamName: string;
  overview: string;
  members: string[];
  owner: string;
  image: string;
}
interface UpdateTeamParams {
  teamId: string;
  newOverview: string;
  newMembers: string[];
}
interface uploadTeamImageParams {
  file: File;
  teamId: string;
}
interface AssignTaskParams {
  teamId: string;
  taskData: Task;
}
interface UpdateTaskParams {
  teamId: string;
  taskData: {
    id: string;
    description: string;
    deadline: string;
    priority: string;
    assignedTo: string[];
  };
}
interface PostCommentParams {
  teamId: string;
  taskId: string;
  newComment: Comment;
  column: keyof Tasks;
}
interface UpdateTaskOrderSameColumnParams {
  teamId: string;
  updatedTasks: Task[];
  column: keyof Tasks;
}
interface UpdateTaskOrderDifferentColumnParams {
  teamId: string;
  updatedTasksObject: Tasks;
}
interface DeleteTaskParams {
  teamId: string;
  taskId: string;
  updatedTasksArray: Task[];
  column: keyof Tasks;
}
export type {
  CreateTeamParams,
  UpdateTeamParams,
  uploadTeamImageParams,
  AssignTaskParams,
  UpdateTaskParams,
  PostCommentParams,
  UpdateTaskOrderSameColumnParams,
  UpdateTaskOrderDifferentColumnParams,
  DeleteTaskParams,
};
