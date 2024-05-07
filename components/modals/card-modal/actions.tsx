"use client";

import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { useCardModel } from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
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
        <div className="flex">
            Actions
            <div>
                <Button disabled={isLoadingCopy} onClick={onCopy}>
                    Copy
                </Button>
                <Button disabled={isLoadingDelete} onClick={onDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
}

Actions.Skeleton = function ActionSkeleton() {
    return (
        <div>
            <Skeleton className="w-4 bg-slate-200 h-4" />
        </div>
    );
};
