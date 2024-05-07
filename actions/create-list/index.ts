"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";
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

    const { title, boardId } = data;

    let list;

    if(!boardId){
        return {
            error: "Board not found...."
        }
    }

    try {
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId,
            },
        });

        if (!board) {
            return {
                error: "Board not found.",
            };
        }

        const lastList = await db.list.findFirst({
            where: { boardId },
            orderBy: { order: "desc" },
            select: { order: true },
        });

        const newOrder = lastList ? lastList.order + 1 : 1;

        list = await db.list.create({
            data: {
                title,
                boardId,
                order: newOrder,
            },
        });

        await createAuditLog({
            entityID: list.id,
            entityTitle: list.title,
            entityType: ENTIFY_TYPE.LIST,
            action: ACTION.CREATE,
        });
    } catch (error) {
        return {
            error: "Failed to create.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: list,
    };
};

export const createList = createSafeAction(CreateList, handler);
