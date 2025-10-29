import { Outlet } from "react-router";

export default function Layout() {
  return (
    <div>
      <div>Auth layout</div>
      <Outlet />
    </div>
  );
}
