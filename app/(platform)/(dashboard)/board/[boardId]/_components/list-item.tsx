"use client";
import { ListWithCards } from "@/types";
import React, { ElementRef, useRef, useState } from "react";
import ListHeader from "./list-header";
import { CardForm } from "./card-form";
import CardItem from "./card-item";

import { Draggable, Droppable } from "@hello-pangea/dnd";

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
                    className="p-3 shrink-0  rounded-md w-[272px]  select-none  min-h-[200px]"
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
                                    className="min-h-[100px] w-full"
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
