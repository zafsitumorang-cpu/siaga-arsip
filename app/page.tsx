import { chatGPTSignOutPath, getChatGPTUser } from "./chatgpt-auth";
import { DashboardPro } from "./dashboard-pro";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getChatGPTUser();
  return <DashboardPro initialUser={{ name: user?.displayName || "Administrator", email: user?.email || "admin@bawaslu.go.id" }} signOutPath={chatGPTSignOutPath("/")} />;
}
