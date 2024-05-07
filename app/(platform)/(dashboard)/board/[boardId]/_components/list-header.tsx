"use client";
import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import React, { ElementRef, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import ListOptions from "./list-options";

interface ListHeaderProps {
    data: List;
    onAddCard: () => void
}

export default function ListHeader({ data, onAddCard }: ListHeaderProps) {
    const inputRef = useRef<ElementRef<"input">>(null);
    const formRef = useRef<ElementRef<"form">>(null);

    const [isEditing, setIsEditing] = useState(false);

    const { execute, fieldErrors} = useAction(updateList, {
        onSuccess: (data) => {
            toast.success(`Renamed to ${data.title}`);
            disableEditing();
        },
        onError: (error) => {
            toast.error("Fail to update.");
        },
    });

    const enableEditing = () => {
        setIsEditing(true);

        setTimeout(() => {
            setTimeout(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            });
        });
    };

    const disableEditing = () => {
        setIsEditing(false);
        formRef.current?.requestSubmit();
    };

    const OnKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            formRef.current?.requestSubmit();
        }
        if (e.key === "Enter") {
            formRef.current?.requestSubmit();
        }
    };
    useEventListener("keydown", OnKeyDown);
   

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const boardId = formData.get("boardId") as string;
        const id = formData.get("id") as string;

        if(title === data.title) {
            disableEditing()
            return;
        }

        execute({
            title,
            boardId,
            id,
        });
    };


    const onBlur = () =>{
        formRef.current?.requestSubmit()
    }

    return (
        <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
            {isEditing ? (
                <form
                    action={onSubmit}
                    ref={formRef}
                    className="w-full h-7 flex items-center"
                >
                    <FormInput
                        ref={inputRef}
                        defaultValue={data.title}
                        id="title"
                        className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
                        placeholder="Enter list title"
                        errors={fieldErrors}
                        onBlur={onBlur}

                    />
                    <input
                        hidden
                        id="boardId"
                        name="boardId"
                        defaultValue={data.boardId}
                    />
                    <input hidden id="id" name="id" defaultValue={data.id} />
                </form>
            ) : (
                <div
                    className="w-full h-7 flex items-center"
                    onClick={enableEditing}
                >
                    {data.title}
                </div>
            )}


            <ListOptions onAddCard={onAddCard} data={data}/>
        </div>
    );
}
