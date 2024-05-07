"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTIFY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    // because we don't have BE to check the jwt, so we need to check userId here before go foward
    const { userId, orgId } = auth();

    console.log("okay");
    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { title, listId, boardId } = data;

    let card;

    if (!listId || !boardId) {
        return {
            error: "List not found....",
        };
    }

    try {
        const list = await db.list.findUnique({
            where: {
                id: listId,
                board: {
                    orgId,
                },
            },
        });

        if (!list) {
            return {
                error: "List not found.",
            };
        }

        const lastCard = await db.card.findFirst({
            where: { listId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastCard ? lastCard.order + 1 : 1;

        card = await db.card.create({
            data: {
                title,
                listId,
                order: newOrder,
            },
        });
        await createAuditLog({
            entityID: card.id,
            entityTitle: card.title,
            entityType: ENTIFY_TYPE.CARD,
            action: ACTION.CREATE,
        });
    } catch (error) {
        return {
            error: "Failed to create.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: card,
    };
};

export const createCard = createSafeAction(CreateCard, handler);
