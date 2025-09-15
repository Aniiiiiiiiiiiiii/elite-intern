import fs from "fs/promises";

export const saveFile = async (path, data, encoding = "utf8") => {
  await fs.writeFile(path, data, encoding);
};