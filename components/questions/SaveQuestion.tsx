"use client";

import { ToggleQuestion } from '@/lib/actions/collection.action';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

const SaveQuestion = ({ questionId }: { questionId: string }) => {

const session = useSession()

const userId = session.data?.user?.id
  const [isLoading, setIsLoading] = useState(false);
  const handleSaveQuestion = async () => {
    if(isLoading) return;
    if(!userId){
      return toast.error("You need to be logged in to save questions.")
    }
    setIsLoading(true);
    try {
const {data,error,success} =  await ToggleQuestion({questionId})
  if (!success) throw new Error(error?.message || "An error occurred");
  toast.success( `Question ${data?.saved ? "saved" : "unsaved"} successfully`)

    } catch (error) {
      toast.error("An error occurred while saving the question. Please try again.")
    } finally {
      setIsLoading(false);
    }
  }
  const hasSaved = false;
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
