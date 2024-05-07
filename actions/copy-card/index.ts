"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTIFY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data;

    let card;

    try {
        const cardToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    }
                }
            },
        });

        if(!cardToCopy){
            return {
                error: "Not found card."
            }
        }


        const lastCard= await db.card.findFirst({
            where: {
                listId: cardToCopy.listId,
                list:{
                    board:{
                        orgId
                    }
                }  
            },
            orderBy: {
                order: "desc"
            }
        })

        const newOrder = lastCard ? lastCard.order + 1: 1;

        card = await db.card.create({
            data: {
                title: cardToCopy.title + " - copy",
                order: newOrder,
                description: cardToCopy.description,
                listId: cardToCopy.listId
            }
        }) 

        await createAuditLog({
            entityID: card.id,
            entityTitle: card.title,
            entityType: ENTIFY_TYPE.CARD,
            action: ACTION.CREATE,
        });

    } catch (error) {
        return {
            error: "Failed to update.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: card,
    };
};

export const copyCard = createSafeAction(CopyCard, handler);
