import { Outlet } from "react-router";

export default function Page() {
  return (
    <div>
      <h3>Nested layout</h3>
      <Outlet />
    </div>
  );
}
