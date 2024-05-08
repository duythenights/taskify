"use client";
import { ElementRef, KeyboardEvent, useRef, useState } from "react";
import ListWrapper from "./list-wrapper";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

export default function ListForm() {
    const params = useParams();
    const router = useRouter()
    const formRef = useRef<ElementRef<"form">>(null);
    const inputRef = useRef<ElementRef<"input">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);

        setTimeout(() => {
            inputRef.current?.focus();
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
    };

    const onKeyDown = (e: globalThis.KeyboardEvent) => {
        if (e.key === "Escape") {
            disableEditing();
        }
    };

    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const {isLoading, execute, fieldErrors} = useAction(createList, {
        onSuccess: (data) => {
            toast.success(`List "${data.title}" created.`)
            disableEditing()
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const boardId= formData.get("boardId") as string
        execute({
            title,
            boardId
        })
    }


    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    action={onSubmit}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                    ref={formRef}
                >
                    <FormInput
                        ref={inputRef}
                        id="title"
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                        placeholder="Enter list title..."
                        errors={fieldErrors}
                        disabled={isLoading}
                    
                    />
                    <input id="boardId" name="boardId" defaultValue={params.boardId} hidden />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit disabled={isLoading} className="flex-1" variant={"primary"}>Add a list</FormSubmit>
                        <Button onClick={disableEditing} variant={"ghost"} size={"sm"} >
                            <X />
                        </Button>
                    </div>
                </form>
            </ListWrapper>
        );
    }

    return (
        <ListWrapper>
            <button
                onClick={enableEditing}
                className="w-full text-black text-start flex gap-2 bg-white/80 hover:bg-white/50 rounded-md p-3 items-center text-sm transition"
            >
                <Plus /> Add a list
            </button>
        </ListWrapper>
    );
}
