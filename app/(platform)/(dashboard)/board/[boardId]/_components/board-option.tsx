"use client";
import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface BoardOptionsProps {
    id: string;
}

export default function BoardOptions({ id }: BoardOptionsProps) {
    const { execute, isLoading } = useAction(deleteBoard, {
        onError: (error) => {
            toast.error(error);
        },
    });

    const onDelete = () => {

        execute({
            id
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"transparent"} className="h-auto w-auto p-2">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="px-0 py-3" side="bottom" align="start">
                <div className="text-sm font-medium text-center">
                    Board actions
                </div>
                <PopoverClose asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                        variant={"ghost"}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </PopoverClose>
                <Button
                    className="w-full h-auto px-2 mt-4 justify-start font-normal"
                    variant={"ghost"}
                    onClick={onDelete}
                    disabled={isLoading}
                >
                    Delete this board
                </Button>
            </PopoverContent>
        </Popover>
    );
}
