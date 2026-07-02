"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { deleteQuestion } from '@/lib/actions/question.action';

import { deleteAnswer } from '@/lib/actions/answer.action';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface Prop{
  type:"Question" | "Answer";
  itemId:string;
}
const EditDeleteAction = ({ type, itemId }: Prop) => {
  const router = useRouter()
  const itemType = type.toLowerCase() as "question" | "answer";

  const handleEdit = () => {
    router.push(`/question/${itemId}/edit`);
  }

  const handleDelete =  async () => {
  if( itemType ==='question'){
    const result = await deleteQuestion({questionId:itemId})

    if (!result.success) {
      toast.error('Failed to delete question', {
        description: result.error?.message || 'Please try again.',
      })
      return;
    }

    toast.error('Question deleted',{
      description: "Your question has been successfully deleted.",

    })
    router.refresh();
  } else if(itemType === 'answer'){
    //api
     await deleteAnswer({ answerId: itemId });
    toast.success('Answer deleted successfully',{
       description: "Your answer has been successfully deleted.",
    })

  }
}
  return (
    <div className={`flex items-center justify-center gap-4 max-sm:w-full ${type==='Answer' && 'gap-0 justify-center' }`} >
{type === "Question" && (
        <Image
          src="/icons/edit.svg"
          alt="edit"
          width={14}
          height={14}
          className="cursor-pointer object-contain"
          onClick={handleEdit}
        />
      )}
       <AlertDialog>
        <AlertDialogTrigger className="cursor-pointer">
          <Image src="/icons/trash.svg" alt="trash" width={14} height={14} />
        </AlertDialogTrigger>
        <AlertDialogContent className="background-light800_dark300">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              {itemType} and remove it from
              our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="!border-primary-100 !bg-primary-500 !text-light-800"
              onClick={handleDelete}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default EditDeleteAction
