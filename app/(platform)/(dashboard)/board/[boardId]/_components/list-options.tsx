import { copyList } from '@/actions/copy-list'
import { deleteList } from '@/actions/delete-list'
import FormSubmit from '@/components/form/form-submit'
import { Button } from '@/components/ui/button'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { useAction } from '@/hooks/use-action'
import { List } from '@prisma/client'
import { MoreHorizontal, X } from 'lucide-react'
import React, { ElementRef, useRef } from 'react'
import { toast } from 'sonner'

interface ListOptionsProps {
    data: List,
    onAddCard: () => void
}

export default function ListOptions({data, onAddCard}: ListOptionsProps) {
    const closedRef = useRef<ElementRef<"button">>(null)
    const {execute: deleteExecute} = useAction(deleteList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" deleted.`)
            closedRef.current?.click()
        },
        onError:(error) => {
            toast.error("Failed to detele.")
        }
    })
    const {execute: copyExecute} = useAction(copyList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" copied.`)
            closedRef.current?.click()
        },
        onError:(error) => {
            toast.error("Failed to copy.")
        }
    })


    const handleDeleteList = (formData: FormData) =>{
        const id = formData.get("id") as string
        const boardId= formData.get("boardId") as string

        deleteExecute({
            id,
            boardId
        })

    }

    const handleCopyList = (formData: FormData) =>{
        const id = formData.get("id") as string
        const boardId= formData.get("boardId") as string

        copyExecute({
            id,
            boardId
        })

    }

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button  variant={"ghost"} className='w-auto h-auto '>
                <MoreHorizontal size={14}/>
            </Button>
        </PopoverTrigger>
        <PopoverContent className='px-0'>
            <div className='text-center text-sm'>List actions</div>
            <PopoverClose ref={closedRef} className='absolute top-2 right-2' asChild>
                <Button variant={"ghost"} className='h-auto w-auto'>
                    <X size={14}/>
                </Button>
            </PopoverClose>

            <Button
                onClick={onAddCard} 

                className='w-full mt-2 justify-start rounded-none'
                variant={"ghost"}
            >
                Add card...
            </Button>
            <form action={handleCopyList}>
                <input type="text" hidden id="id" name="id" defaultValue={data.id} />
                <input type="text" hidden id="boardId" name="boardId" defaultValue={data.boardId}/>
                <FormSubmit className='w-full mt-2 justify-start rounded-none' variant={"ghost"}>Copy list...</FormSubmit> 
            </form>

            <Separator/>

            <form action={handleDeleteList}>
                <input type="text" hidden id="id" name="id" defaultValue={data.id} />
                <input type="text" hidden id="boardId" name="boardId" defaultValue={data.boardId}/>
                <FormSubmit className='w-full mt-2 justify-start rounded-none' variant={"ghost"}>Delete this list</FormSubmit> 
            </form>


        </PopoverContent>
    </Popover>

  )
}
