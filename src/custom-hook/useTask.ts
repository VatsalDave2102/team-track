import { useEffect, useState } from "react";
import { Task, Tasks, TeamData } from "../utils/types";

const useTask = (
  taskId: string,
  team: TeamData
): [Task | null, keyof Tasks | null] => {
  const [task, setTask] = useState<Task | null>(null);
  const [taskColumn, setTaskColumn] = useState<keyof Tasks | null>(null);

  // effect to find task from column
  useEffect(() => {
    // if given team has tasks
    if (team.tasks) {
      // creating an array of columnc
      const columns: Array<keyof Tasks> = [
        "todo",
        "ongoing",
        "review",
        "completed",
      ];

      // looping through columns to find the task from team
      for (const column of columns) {
        const foundTask = team.tasks[column].find((task) => task.id === taskId);

        // if found then update task and taskColumn
        if (foundTask) {
          setTask(foundTask as Task);
          setTaskColumn(column);
          break;
        }
      }
    }
  }, [taskId, team.tasks, task]);

  // returning task and taskColumn
  return [task, taskColumn];
};

export default useTask;
