"use client";
import { createCard } from "@/actions/create-card";
import FormSubmit from "@/components/form/form-submit";
import { FormTextArea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { cn } from "@/lib/utils";
import { Plus, PlusCircle, X } from "lucide-react";
import React, {
    ElementRef,
    KeyboardEventHandler,
    forwardRef,
    useRef,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface CardFormProps {
    listId: string;
    enableEditing: () => void;
    disableEditing: () => void;
    isEditing: boolean;
    boardId: string;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
    ({ listId, disableEditing, enableEditing, isEditing, boardId }, ref) => {
        console.log(ref)
        const formRef = useRef<ElementRef<"form">>(null);
        const { execute, fieldErrors } = useAction(createCard, {
            onSuccess: (data) => {
                toast.success(`Card "${data.title}" added.`);
                formRef.current?.reset();
            },
            onError: (error) => {
                toast.error(error);
            },
        });

        const handleSubmit = (formData: FormData) => {
            const title = formData.get("title") as string;
            const boardId = formData.get("boardId") as string;
            const listId = formData.get("listId") as string;

            execute({
                title,
                boardId,
                listId,
            });
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                disableEditing();
            }
        };
        useOnClickOutside(formRef, disableEditing);
        useEventListener("keydown", handleKeyDown);

        const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
            e
        ) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                formRef.current?.requestSubmit();
            }
        };

        if (isEditing) {
            return (
                <form
                    action={handleSubmit}
                    ref={formRef}
                    className="m-1 py-0.5 px-1 space-y-4"
                >
                    <FormTextArea
                        id="title"
                        placeholder="Enter title for this card..."
                        onKeyDown={onTextAreaKeyDown}
                        ref={ref}
                        errors={fieldErrors}
                    />
                    <input
                        hidden
                        id="listId"
                        name="listId"
                        defaultValue={listId}
                    />
                    <input
                        hidden
                        id="boardId"
                        name="boardId"
                        defaultValue={boardId}
                    />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit variant={"primary"} className="w-full">Add card</FormSubmit>
                        <Button onClick={disableEditing} size={"sm"} variant={"ghost"}>
                            <X className="w-5 h-5"/>
                        </Button>
                    </div>
                </form>
            );
        }

        return (
            <div className="text-black pt-2">
                <Button
                    className="w-full rounded-none justify-start text-sm text-muted-foreground"
                    variant={"ghost"}
                    onClick={() => enableEditing()}
                    size={"sm"}
                >
                    <Plus size={16} className="mr-2" />
                    Add a card
                </Button>
            </div>
        );
    }
);

CardForm.displayName = "CardForm";
