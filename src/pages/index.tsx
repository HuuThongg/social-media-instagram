import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react"
import  useOnChange  from "../hooks/useOnChange"
import { api } from "../utils/api";
import { customAlphabet } from "nanoid";
import { useRouter } from "next/router";
import { type } from "os";
import NavBar from "../components/NavBar/NavBar";
import Image from "next/image";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABCDEF0123456789");
type InputWLabelsPros = {
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWLabels = ({ name, value, onChange } : InputWLabelsPros) =>{
  return(
    <div className="flex flex-col space-y-2">
      <label htmlFor={name}>Change {name}</label>
      <input
        name={name}
        id={name}
        placeholder={name}
        onChange={onChange}
        value={value}
        className="h-10 w-full rounded-lg bg-level2 px-3 py-2 outline-none placeholder:text-quaternaryText"
      />
    </div>
  )
}

const  Home: NextPage = () => {
  const {data} = api.chat.hello.useQuery({ text: " there, welcome to the chat app" });
  const {
    values: { name, username, image },
    setValues,
    handleChange,
  } = useOnChange({ name: "", username: "", image: "" });

  const changeUserDataMutation = api.user.changeUserData.useMutation();
  const { data: sessionData } = useSession();
  const changeUserData = (event: React.SyntheticEvent) => {
    event.preventDefault();
    changeUserDataMutation.mutate({
      name: name || undefined,
      username: username || undefined,
      image: image || undefined,
    });
  };
  useEffect(() => {
    if (sessionData?.user) {
      setValues({
        name: sessionData.user.name || "",
        username: sessionData.user.username || "",
        image: sessionData.user.image || "",
      });
    }
  }, [sessionData]);
  return (
    <>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar/>
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
          {data ? <p>{data.greeting}</p> : <p>Loading..</p>}
        </div>
        <form
          className="flex flex-col space-y-5 rounded-xl bg-level1 p-8 shadow-sm"
          onSubmit={changeUserData}
        >
          {sessionData?.user?.image && (
            <Image
              src={sessionData.user.image}
              alt="profile image"
              className="mx-auto h-11 w-11 rounded-full"
              width={44}
              height={44}
            />
          )}
          <InputWLabels name="name" value={name!} onChange={handleChange} />
          <InputWLabels
            name="username"
            value={username!}
            onChange={handleChange}
          />
          <InputWLabels name="image" value={image!} onChange={handleChange} />
          <button
            type="submit"
            className="h-9 w-full rounded-lg bg-primaryText text-invertedPrimaryText"
          >
            Submit
          </button>
        </form>
        <AuthShowcase />
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: secretMessage } = api.user.getSecretMessage.useQuery();

  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
// type TechnologyCardProps = {
//   name: string;
//   description: string;
//   documentation: string;
// };

// const TechnologyCard = ({
//   name,
//   description,
//   documentation,
// }: TechnologyCardProps) => {
//   return (
//     <section className="flex flex-col justify-center rounded border-2 border-gray-500 p-6 shadow-xl duration-500 motion-safe:hover:scale-105">
//       <h2 className="text-lg text-gray-700">{name}</h2>
//       <p className="text-sm text-gray-600">{description}</p>
//       <a
//         className="m-auto mt-3 w-fit text-sm text-violet-500 underline decoration-dotted underline-offset-2"
//         href={documentation}
//         target="_blank"
//         rel="noreferrer"
//       >
//         Documentation
//       </a>
//     </section>
//   );
// };
