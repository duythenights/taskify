"use client";
import { updateCard } from "@/actions/update-card";
import FormSubmit from "@/components/form/form-submit";
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
            disableEditing();

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
        <div className="flex items-start gap-x-3 w-full">
            <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
            <div className="w-full">
                <p className="font-semibold text-neutral-700 mb-2">
                    Description
                </p>

                {isEditing ? (
                    <form action={onSubmit} className="space-y-2">
                        <FormTextArea
                            onKeyDown={onTextAreaKeyDown}
                            ref={textareaRef}
                            id="description"
                            defaultValue={description as string}
                            placeholder={"Enter description here..."}
                            className="w-full mt-2"
                        />
                        <div className="flex items-center gap-x-2">
                            <FormSubmit>Save</FormSubmit> 
                            <Button variant={"ghost"} onClick={disableEditing} size={"sm"}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div
                        className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
                        role="button"
                        onClick={enableEditing}
                    >
                        {description || "Add a more detailed description..."}
                    </div>
                )}
            </div>
        </div>
    );
}

Description.Skeleton = function DescriptionSkeleton() {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className="w-6 h-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-[78px] bg-neutral-200" />
            </div>
        </div>
    );
};
