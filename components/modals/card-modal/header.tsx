"use client";

import { updateCard } from "@/actions/update-card";
import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import {  Layout } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";

interface HeaderProps {
    data: CardWithList;
}

export default function Header({ data }: HeaderProps) {
    const queryClient = useQueryClient()
    const params = useParams()


    const {execute, fieldErrors} = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id]
            })

            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id]
            })

            toast.success(`Updated card title to "${data.title}"`)
            setTitle(data.title)
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const inputRef= useRef<ElementRef<"input">>(null)

    const [title, setTitle] = useState(data.title)

    const onBlur = () =>{
        inputRef.current?.form?.requestSubmit()
    }

    const onSubmit = (formData: FormData) =>{
        const cardTitle = formData.get("title") as string
        if(title === cardTitle) return;

        execute({
            title: cardTitle,
            boardId: params.boardId as string,
            id: data.id
        })

    }

    return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
        <Layout className="h-5 w-5 mt-1 text-neutral-700"/>
        <div className="w-full">
            <form action={onSubmit}>
                <FormInput ref={inputRef} errors={fieldErrors} onBlur={onBlur} id="title" defaultValue={title} className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate" />
                <div className="text-muted-foreground-foreground text-sm">
                   in list <span className="underline">{data.list.title}</span>
                </div>
            </form>
        </div> 
    </div>
)
}

Header.Skeleton = function HeaderSkeleton(){
    return (
        <div className="flex items-start gap-x-3 mb-6">
            <Skeleton className="h-6 w-6 mt-1 bg-neutral-200"/>
            <div>
                <Skeleton className="h-6 w-24 mt-1 mb-1 bg-neutral-500"/>
                <Skeleton className="h-4 w-12 mt-1 bg-neutral-500"/>
            </div>
        </div>
    )
}