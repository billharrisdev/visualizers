import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function ProtectedPage() {
  const session = await getServerSession(authOptions);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
      <p className="mb-4">
        This page is protected. You can only see it if you are signed in.
      </p>
      <p>Welcome, {session?.user?.name}!</p>
      <pre className="bg-gray-100 p-4 rounded-lg mt-4">
        {JSON.stringify(session, null, 2)}
      </pre>
    </div>
  );
}
