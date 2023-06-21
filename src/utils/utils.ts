import { TaskColor } from "./types";

const MAX_SIZE = 2 * 1024 * 1024;

function genreateId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

const taskColor: TaskColor[] = ["primary", "info", "warning", "error"];
export { MAX_SIZE, genreateId, taskColor };
