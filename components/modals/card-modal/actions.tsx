"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModel } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface ActionsProps {
    data: CardWithList;
}

export default function Actions({ data }: ActionsProps) {
    const params = useParams();
    const { onClose } = useCardModel();
    const { execute: deleteExecute, isLoading: isLoadingDelete } = useAction(
        deleteCard,
        {
            onSuccess: (data) => {
                toast.success(`Card named "${data.title}" deleted.`);

                onClose();
            },
            onError: (error) => {
                toast.error(error);
            },
        }
    );

    const { execute: copyExecute, isLoading: isLoadingCopy } = useAction(
        copyCard,
        {
            onSuccess: (data) => {
                toast.success(`Card named "${data.title}" copied.`);
                onClose();
            },
            onError: (error) => {
                toast.error(error);
            },
        }
    );

    const onDelete = () => {
        deleteExecute({
            id: data.id,
            boardId: params.boardId as string,
        });
    };

    const onCopy = () => {
        copyExecute({
            id: data.id,
            boardId: params.boardId as string,
        });
    };
    return (
        <div className="space-y-2">
            <p className=" font-semibold">Actions</p>
            <Button disabled={isLoadingCopy} onClick={onCopy} variant={"gray"} size={"inline"} className="w-full justify-start">
                <Copy className="h-4 w-4 mr-2"/>
                Copy
            </Button>
            <Button disabled={isLoadingDelete} onClick={onDelete} variant={"gray"} size={"inline"} className="w-full justify-start">
                <Trash className="h-4 w-4 mr-2"/>
                Delete
            </Button>
        </div>
    );
}

Actions.Skeleton = function ActionSkeleton() {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className="w-20 h-4 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
            <Skeleton className="w-full h-8 bg-neutral-200" />
        </div>
    );
};
