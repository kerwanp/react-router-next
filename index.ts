import { getAppDirectory } from "@react-router/dev/routes";
import path from "node:path";
import fs from "node:fs";
import {
  nextRoutes as nextRoutesImpl,
  normalizeSlashes,
} from "./src/nextRoutes";

export function nextRoutes(
  options: {
    /**
     * The directory containing file system routes, relative to the app directory.
     * Defaults to `"./routes"`.
     */
    rootDirectory?: string;
  } = {},
) {
  const { rootDirectory: userRootDirectory = "routes" } = options;
  const appDirectory = getAppDirectory();
  const rootDirectory = path.resolve(appDirectory, userRootDirectory);
  const relativeRootDirectory = path.relative(appDirectory, rootDirectory);
  const prefix = normalizeSlashes(relativeRootDirectory);

  return fs.existsSync(rootDirectory)
    ? nextRoutesImpl(appDirectory, prefix)
    : [];
}
