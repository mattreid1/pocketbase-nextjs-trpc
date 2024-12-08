import { ClientDemoCard } from "./client-page";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <ClientDemoCard />
    </main>
  );
}
