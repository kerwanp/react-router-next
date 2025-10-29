import type { Route } from "./+types/page";

export default function Page({ params }: Route.ComponentProps) {
  return <div>Segments: {params["*"]}</div>;
}
