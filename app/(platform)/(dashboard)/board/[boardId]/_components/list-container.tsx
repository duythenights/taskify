"use client";
import { ListWithCards } from "@/types";
import React, { useEffect, useState } from "react";
import ListForm from "./list-form";
import ListItem from "./list-item";

import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { List } from "@prisma/client";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";
import CardModal from "@/components/modals/card-modal";

interface ListContainerProps {
    boardId: string;
    data: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

export default function ListContainer({ boardId, data }: ListContainerProps) {
    const [orderedData, setOrderedData] = useState(data);
    const { execute: orderListExecute } = useAction(updateListOrder, {
        onSuccess: () => {
            toast.success("Reordered list.");
        },
        onError: () => {
            toast.error("Failed to reordered list.");
        },
    });

    const { execute: orderCardExecute } = useAction(updateCardOrder, {
        onSuccess: () => {
            toast.success("Reordered card.");
        },
        onError: () => {
            toast.error("Failed to reordered card.");
        },
    });

    useEffect(() => {
        setOrderedData(data);
    }, [data]);

    const onDragEnd = (result: any) => {
        const { destination, source, type } = result;

        if (!destination) {
            return;
        }

        // Drop in the smae position

        if (
            destination.draggableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // User move a list

        if (type === "list") {
            const items = reorder(
                orderedData,
                source.index,
                destination.index
            ).map((item, index) => {
                return {
                    ...item,
                    order: index,
                };
            });

            setOrderedData(items);
            orderListExecute({
                boardId: boardId,
                items: items,
            });
        }

        // User move a card

        if (type === "card") {
            let newOrderData = [...orderedData];

            // source and destination list
            const sourceList = newOrderData.find(
                (list) => list.id === source.droppableId
            );
            const destinationList = newOrderData.find(
                (list) => list.id === destination.droppableId
            );

            if (!sourceList || !destinationList) {
                return;
            }

            // Check if card exist on the sourceList
            if (!sourceList.cards) {
                sourceList.cards = [];
            }

            // Check if cards exist on the destinationList
            if (!destinationList.cards) {
                destinationList.cards = [];
            }

            // Moving the card in the same list

            if (source.droppableId === destination.droppableId) {
                const reorderdCards = reorder(
                    sourceList.cards,
                    source.index,
                    destination.index
                );

                reorderdCards.forEach((card, idx) => {
                    card.order = idx;
                });

                sourceList.cards = reorderdCards;

                setOrderedData(newOrderData);

                orderCardExecute({
                    boardId,
                    items: reorderdCards,
                });
            }

            // moving the card to another list
            else {
                // remove card form the source list
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // assign the new listId to the moved card
                movedCard.listId = destination.droppableId;

                // add card to the destination list
                destinationList.cards.splice(destination.index, 0, movedCard);

                // update order for card in source list
                sourceList.cards.forEach((card, index) => {
                    card.order = index;
                });

                // update order for cards in destination list
                destinationList.cards.forEach((card, index) => {
                    card.order = index;
                });

                setOrderedData(newOrderData);
                orderCardExecute({
                    boardId,
                    items: destinationList.cards,
                });
            }
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol
                        className="flex gap-x-3 h-full"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {orderedData.map((list, index) => {
                            return (
                                <ListItem
                                    key={list.id}
                                    index={index}
                                    data={list}
                                />
                            );
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div className="flex-shrink-0 w-1" />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    );
}
