import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import QuestionForm from "@/components/froms/QuestionForm";

export const metadata: Metadata = {
  title: "Ask a Question | V-Flow",
  description: "Post a new programming question and get help from the community.",
  openGraph: {
    title: "Ask a Question | V-Flow",
    description: "Post a new programming question and get help from the community.",
    type: "website",
    images: [{ url: "/images/logo.png", width: 1200, height: 630, alt: "V-Flow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask a Question | V-Flow",
    description: "Post a new programming question and get help from the community.",
    images: ["/images/logo.png"],
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
