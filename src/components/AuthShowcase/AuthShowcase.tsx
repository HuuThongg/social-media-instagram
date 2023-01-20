import { signIn, signOut, useSession } from "next-auth/react";

const AuthShowcase = () => {
  const { data: sessionData } = useSession();

  return (
    <div className=" px-[13px] flex items-center justify-between gap-4 bg-white border-b border-black ">
      <p className="text-center text-2xl text-black">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        
      </p>
      <button
        className="rounded-lg bg-gray-400 px-2 py-3 font-semibold text-black no-underline transition hover:bg-gray-300"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
export default AuthShowcase;
