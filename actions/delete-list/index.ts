"use server"
import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";
import { redirect } from "next/navigation";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTIFY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
    const { orgId, userId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { id, boardId } = data;

    let list;

    try {
        list = await db.list.delete({
            where: {
                boardId,
                id,
                board:{
                    orgId
                }
            },
        });

        await createAuditLog({
            entityID: list.id,
            entityTitle: list.title,
            entityType: ENTIFY_TYPE.LIST,
            action: ACTION.DELETE,
        });
    } catch (error) {
        return {
            error: "Failed to delete.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: list
    }
};

export const deleteList = createSafeAction(DeleteList, handler);
