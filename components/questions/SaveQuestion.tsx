"use client";

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { use, useState } from 'react';
import { toast } from 'sonner';

import { ToggleQuestion } from '@/lib/actions/collection.action';
const SaveQuestion = ({ questionId, hasSavedQuestionPromise, }: { questionId: string,  hasSavedQuestionPromise: Promise<ActionResponse<{ saved: boolean }>> }) => {

  const session = useSession()

  const userId = session.data?.user?.id
  const [isLoading, setIsLoading] = useState(false);

  const {data} = use(hasSavedQuestionPromise)
    const { saved: hasSaved } = data || {};
  const handleSaveQuestion = async () => {
    if (isLoading) return;
    if (!userId) {
      return toast.error("You need to be logged in to save questions.")
    }
    setIsLoading(true);
    try {
      const { data, error, success } = await ToggleQuestion({ questionId })
      if (!success) throw new Error(error?.message || "An error occurred");
      toast.success(`Question ${data?.saved ? "saved" : "unsaved"} successfully`)

    } catch {
      toast.error("An error occurred while saving the question. Please try again.")
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Image
      src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
      width={18}
      height={18}
      alt="save"
      className={`cursor-pointer ${isLoading && "opacity-50"}`}
      aria-label="Save question"
      onClick={handleSaveQuestion}
    />
  )
}

export default SaveQuestion
