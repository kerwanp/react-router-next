import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <div>Catch-all layout 1</div>
      <Outlet />
    </div>
  );
}
