"use client";
import { ListWithCards } from "@/types";
import React, { ElementRef, useRef, useState } from "react";
import ListHeader from "./list-header";
import { CardForm } from "./card-form";
import CardItem from "./card-item";

import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface ListItemProps {
    index: number;
    data: ListWithCards;
}

export default function ListItem({ index, data }: ListItemProps) {
    const textAreaRef = useRef<ElementRef<"textarea">>(null);
    const [isEditing, setIsEditing] = useState(false);

    const disableEditing = () => {
        setIsEditing(false);
    };

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            textAreaRef.current?.focus();
        });
    };

    return (
        <Draggable draggableId={data.id} index={index}>
            {(provided) => (
                <li
                    className="shrink-0 w-[272px] select-none"
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                >
                    <div
                        className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
                        {...provided.dragHandleProps}
                    >
                        <ListHeader data={data} onAddCard={enableEditing} />

                        <Droppable droppableId={data.id} type="card">
                            {(provided) => (
                                <ol
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={cn("mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                                        data.cards.length > 0 ? "mt-2": "mt-0"
                                     )}
                                >
                                    {data.cards.map((item, index) => (
                                        <CardItem
                                            key={item.id}
                                            index={index}
                                            data={item}
                                        />
                                    ))}

                                    {provided.placeholder}
                                </ol>
                            )}
                        </Droppable>

                        <CardForm
                            listId={data.id}
                            ref={textAreaRef}
                            isEditing={isEditing}
                            enableEditing={enableEditing}
                            disableEditing={disableEditing}
                            boardId={data.boardId}
                        />
                    </div>
                </li>
            )}
        </Draggable>
    );
}
