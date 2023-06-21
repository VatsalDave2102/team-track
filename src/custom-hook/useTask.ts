import { useEffect, useState } from "react";
import { Task, Tasks, TeamData } from "../utils/types";

const useTask = (
  taskId: string,
  team: TeamData
): [Task | null, keyof Tasks | null] => {
  const [task, setTask] = useState<Task | null>(null);
  const [taskColumn, setTaskColumn] = useState<keyof Tasks | null>(null);

  useEffect(() => {
    if (team.tasks) {
      const columns: Array<keyof Tasks> = [
        "todo",
        "ongoing",
        "review",
        "completed",
      ];
      for (const column of columns) {
        const foundTask = team.tasks[column].find((task) => task.id === taskId);
        if (foundTask) {
          setTask(foundTask as Task);
          setTaskColumn(column);
          break;
        }
      }
    }
  }, [taskId, team.tasks, task]);

  return [task, taskColumn];
};

export default useTask;
