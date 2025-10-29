import { expect, test } from "vitest";
import { nextRoutes } from "../src/nextRoutes";
import { join } from "node:path";

test("", () => {
  expect(1 + 2).toBe(3);

  const routes = nextRoutes(
    join(import.meta.dirname, "./fixtures/routes"),
    "./",
  );
});
