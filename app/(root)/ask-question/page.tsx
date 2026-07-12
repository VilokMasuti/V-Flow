import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import QuestionForm from "@/components/froms/QuestionForm";

export const metadata: Metadata = {
  title: "Ask a Question | DevFlow",
  description: "Post a new programming question and get help from the community.",
  openGraph: {
    title: "Ask a Question | DevFlow",
    description: "Post a new programming question and get help from the community.",
    type: "website",
 siteName: "DevFlow",   // ← MUST repeat this in every child openGraph block
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask a Question | DevFlow",
    description: "Post a new programming question and get help from the community.",

    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

const AskAQuestion = async () => {
  const session = await auth()
  if (!session) return redirect('/sign-in')


  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Ask a question</h1>

      <div className="mt-9">
        <QuestionForm />
      </div>
    </>
  );
};

export default AskAQuestion;
