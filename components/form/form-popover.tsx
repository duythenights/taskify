"use client";
import React, { ElementRef, useRef } from "react";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover";
import { CreateBoard } from "@/actions/create-board/schema";
import { useAction } from "@/hooks/use-action";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { FormInput } from "./form-input";
import FormSubmit from "./form-submit";
import { createBoard } from "@/actions/create-board";
import { toast } from "sonner";
import FormPicker from "./form-picker";
import { useRouter } from "next/navigation";
import { useProModal } from "@/hooks/use-pro-modal";
interface FormPopoverProps {
    children: React.ReactNode;
    side?: "left" | "right" | "top" | "bottom";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}

export default function FormPopover({
    children,
    align,
    side = "bottom",
    sideOffset = 0,
}: FormPopoverProps) {
    const closedRef = useRef<ElementRef<"button">>(null);
    const router = useRouter()
    const proModal = useProModal()

    const { execute, fieldErrors } = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Board created!");
            closedRef?.current?.click();
            const link = `/board/${data.id}`
            console.log(link)
            router.push(link)
        },
        onError: (error) => {
            toast.error(error);
            proModal.onOpen()
        },
    });

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string;
        const image = formData.get("image") as string;
        execute({ title, image });
    };
    return (
        <>
            <Popover>
                <PopoverTrigger asChild>{children}</PopoverTrigger>
                <PopoverContent
                    align={align}
                    side={side}
                    sideOffset={sideOffset}
                    className="w-80 pt-3"
                >
                    <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                        Create board
                    </div>
                    <PopoverClose asChild ref={closedRef}>
                        <Button
                            variant={"ghost"}
                            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        >
                            <X className="w-4 h-4"/>
                        </Button>
                    </PopoverClose>

                    <form action={onSubmit}>
                        <div className="space-y-4">

                        <FormPicker id="image" errors={fieldErrors} />
                        <FormInput
                            label="Board title"
                            id="title"
                            errors={fieldErrors}
                        />
                        <FormSubmit className="w-full">Create</FormSubmit>

                        </div>
                    </form>
                </PopoverContent>
            </Popover>
        </>
    );
}
