import { getChatGPTUser } from "./chatgpt-auth";
import { Dashboard } from "./dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getChatGPTUser();
  return <Dashboard initialUser={{ name: user?.name || "Administrator", email: user?.email || "admin@bawaslu.go.id" }} />;
}
