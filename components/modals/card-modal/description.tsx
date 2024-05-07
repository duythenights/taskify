"use client";
import { updateCard } from "@/actions/update-card";
import { FormTextArea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, {
    ElementRef,
    KeyboardEventHandler,
    useRef,
    useState,
} from "react";
import { toast } from "sonner";
interface DescriptionProps {
    data: CardWithList;
}

export default function Description({ data }: DescriptionProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [description, setDesciption] = useState(data.description);
    const textareaRef = useRef<ElementRef<"textarea">>(null);
    const queryClient = useQueryClient();
    const params = useParams();

    const { execute, fieldErrors } = useAction(updateCard, {
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["card", data.id],
            });

            queryClient.invalidateQueries({
                queryKey: ["card-logs", data.id],
            });
            setDesciption(data.description);
            disableEditing()

            toast.success("Description updated.");
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const enableEditing = () => {
        setIsEditing(true);
    };

    const disableEditing = () => {
        setIsEditing(false);
    };


    const onSubmit = (formData: FormData) => {
        const description = formData.get("description") as string;

        if (description === data.description) return;

        execute({
            id: data.id,
            boardId: params.boardId as string,
            description: description,
        });
    };

    const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
        e
    ) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            textareaRef.current?.form?.requestSubmit();
        }
    };

    return (
        <div>
            <div className="flex">
                <AlignLeft />
                <p>Description</p>
            </div>

            {isEditing ? (
                <form action={onSubmit}>
                    <FormTextArea
                        onKeyDown={onTextAreaKeyDown}
                        ref={textareaRef}
                        id="description"
                        defaultValue={description as string}
                        placeholder={"Enter description here..."}
                    />
                    <div>
                        <Button type="submit">Save</Button>
                        <Button variant={"ghost"} onClick={disableEditing}>Cancel</Button>
                    </div>
                </form>
            ) : (
                <div
                    className="w-full h-full mt-3 p-5 rounded-md bg-gray-400"
                    role="button"
                    onClick={enableEditing}
                >
                    {description || "Add a more detailed description..."}
                </div>
            )}
        </div>
    );
}

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div>
            <Skeleton className="w-6 h-6 bg-neutral-400" />
            <Skeleton className="w-6 h-6 bg-neutral-400" />
            <Skeleton className="w-6 h-6 bg-neutral-400" />
            <Skeleton className="w-6 h-6 bg-neutral-400" />
        </div>
    );
};
