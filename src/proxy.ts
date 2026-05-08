import { auth as middleware } from "@/auth";

export default middleware;

export const config = {
  matcher: ["/admin/:path*"],
};
