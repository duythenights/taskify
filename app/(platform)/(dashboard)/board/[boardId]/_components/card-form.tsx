"use client";
import { createCard } from "@/actions/create-card";
import FormSubmit from "@/components/form/form-submit";
import { FormTextArea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
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
                <form action={handleSubmit} ref={formRef}>
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
                    <FormSubmit>ADD</FormSubmit>
                    <Button onClick={disableEditing}>
                        <X />
                    </Button>
                </form>
            );
        }

        return (
            <div className="text-black pt-2">
                <Button
                    className="w-full rounded-none justify-start text-sm text-neutral-400"
                    variant={"ghost"}
                    onClick={() => enableEditing()}
                >
                    <Plus size={16} className="mr-2" />
                    Add a card
                </Button>
            </div>
        );
    }
);

CardForm.displayName = "CardForm";
