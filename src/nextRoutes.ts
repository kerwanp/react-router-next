import path from "node:path";
import fs from "node:fs";
import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
  type RouteConfigEntry,
} from "@react-router/dev/routes";

/**
 * Build routes configuration.
 *
 * @param appDirectory - Absolute app directory path
 * @param prefix - Relative path to the routes directory
 * @param extensions - File extensions
 */
export function nextRoutes(
  appDirectory: string,
  prefix: string,
  extensions = ["js", "jsx", "ts", "tsx", "md", "mdx"],
): RouteConfig {
  const routesDir = path.join(appDirectory, prefix);

  if (!fs.existsSync(routesDir)) {
    throw new Error(
      `Could not find the routes directory: ${routesDir}. Did you forget to create it?`,
    );
  }

  const routes = buildDirectoryRoutes(
    routesDir,
    appDirectory,
    routesDir,
    extensions,
  );

  return routes || [];
}

/**
 * Build routes from a directory.
 *
 * @param rootDirectory - Absolute path to the root directory (`/app/routes`)
 * @param appDirectory - Absolute path of the app directory (`/app`)
 * @param directory - Absolute path to the directory (`/routes/subdirectory`)
 */
function buildDirectoryRoutes(
  rootDirectory: string,
  appDirectory: string,
  directory: string,
  extensions: string[],
): RouteConfigEntry[] {
  const entries = fs.readdirSync(directory, {
    withFileTypes: true,
    encoding: "utf-8",
  });

  const routePath = getRouteSegment(rootDirectory, directory);
  const layoutModule = findFile(directory, "layout", extensions);
  const pageModule = findFile(directory, "page", extensions);

  // Collect child directories (static segments)
  const childRoutes: RouteConfigEntry[] = [];

  if (pageModule) {
    childRoutes.push(index(getRelativeFile(appDirectory, pageModule)));
  }

  if (routePath === "*" && layoutModule) {
    if (!pageModule) {
      return [];
    }

    // Splat routes does not expand to children
    return [
      layout(getRelativeFile(appDirectory, layoutModule), [
        route("*", getRelativeFile(appDirectory, pageModule)),
      ]),
    ];
  }

  for (const entry of entries) {
    if (entry.isFile()) {
      continue;
    }

    if (entry.isDirectory()) {
      const childPath = path.join(directory, entry.name);
      const childRoute = buildDirectoryRoutes(
        rootDirectory,
        appDirectory,
        childPath,
        extensions,
      );
      if (childRoute) {
        childRoutes.push(...childRoute);
      }
    }
  }

  if (layoutModule) {
    return routePath === undefined
      ? [layout(getRelativeFile(appDirectory, layoutModule), childRoutes)]
      : [
          route(
            routePath,
            getRelativeFile(appDirectory, layoutModule),
            childRoutes,
          ),
        ];
  }

  return routePath ? prefix(routePath, childRoutes) : childRoutes;
}

const regexes = {
  splat: /\[\.\.\.\]/g,
  dynamic: /\[(\w+)\]/g,
  group: /\((\w+)\)/g,
};

/**
 * Get the route path segment for a directory.
 *
 * @param rootDirectory - Absolute root directory path
 * @param directory - Absolute directory path
 */
function getRouteSegment(
  rootDirectory: string,
  directory: string,
): string | undefined {
  if (directory === rootDirectory) {
    return "";
  }

  const segment = path.basename(directory);

  if (segment.match(regexes.group)) {
    return;
  }

  return segment.replace(/\[\.\.\.\]/g, "*").replace(/\[(\w+)\]/g, ":$1");
}

/**
 * Get relative file path from app directory
 *
 * @param rootDirectory - Absolute root directory path
 * @param file - Absolute file path
 *
 * @returns Relative file path to the root directory
 */
function getRelativeFile(rootDirectory: string, file: string): string {
  const relative = path.relative(rootDirectory, file);
  return normalizeSlashes(relative);
}

function findFile(
  dir: string,
  basename: string,
  extensions: string[],
): string | undefined {
  for (let ext of extensions) {
    let name = basename + `.${ext}`;
    let file = path.join(dir, name);

    if (fs.existsSync(file)) return file;
  }

  return undefined;
}

export function normalizeSlashes(file: string) {
  return file.replaceAll(path.win32.sep, "/");
}
