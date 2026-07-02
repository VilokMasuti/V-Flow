"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface Prop{
  type:string;
  itemId:string;
}
const EditDeleteAction = ({ type, itemId }: Prop) => {
  const router = useRouter()

  const handleEdit = () => {
    router.push(`/question/${itemId}/edit`);
  }

  const handleDelete =  async () => {
  if( type ==='question'){
    //api

    toast.success('Question deleted successfully',{
      description:'Add question again if you want'
    })
  } else if(type === 'answer'){
    //api
    toast.success('Answer deleted successfully',{
      description:'Add answer again if you want'
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
              {type === "Question" ? "question" : "answer"} and remove it from
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
