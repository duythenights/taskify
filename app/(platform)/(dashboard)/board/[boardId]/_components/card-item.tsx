"use client";
import { useCardModel } from "@/hooks/use-card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import React from "react";
interface CardItemProps {
    data: Card;
    index: number;
}

export default function CardItem({ data, index }: CardItemProps) {
    const cardModal = useCardModel();

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <div
                    onClick={() => cardModal.onOpen(data.id)}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    role="button"
                    className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm transition"
                >
                    {data.title}
                </div>
            )}
        </Draggable>
    );
}
