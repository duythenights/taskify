"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    // because we don't have BE to check the jwt, so we need to check userId here before go foward
    const { userId, orgId } = auth();

    console.log("okay");
    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { items , boardId} = data;

    let updatedCards;
    console.log('okay im here')

    try {
        const transaction = await items.map((card)=>db.card.update({
            where:{
                id: card.id,
                list: {
                    board: {
                        orgId
                    }
                }
            },
            data: {
                order: card.order,
                listId: card.listId
            }
        }))

        updatedCards = await db.$transaction(transaction)


       
    } catch (error) {
        return {
            error: "Failed to reorder.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: updatedCards,
    };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
