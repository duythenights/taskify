"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTIFY_TYPE } from "@prisma/client";
import { hasAvailableCount, increatementAvailabelCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
    // because we don't have BE to check the jwt, so we need to check userId here before go foward
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    let hasAvailabelCount = false;
    let isPro = false;

    try {
        hasAvailabelCount = await hasAvailableCount();
        isPro = await checkSubscription();
    } catch {
        return {
            error: "Org has limited boards it can have.",
        };
    }

    if (!hasAvailabelCount && !isPro) {
        return {
            error: "Org has limited boards it can have.",
        };
    }

    const { title, image } = data;

    const [imageId, imageThumbUrl, imageFullUrl, imageLinkHtml, imageUserName] =
        image.split("|");

    if (
        !imageId ||
        !imageThumbUrl ||
        !imageFullUrl ||
        !imageLinkHtml ||
        !imageUserName
    ) {
        return {
            error: "Missing fields. Failed to create board.",
        };
    }

    let board;

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageFullUrl,
                imageId,
                imageLinkHtml,
                imageThumbUrl,
                imageUserName,
            },
        });

        if (!isPro) {
            await increatementAvailabelCount();
        }

        await createAuditLog({
            entityID: board.id,
            entityTitle: board.title,
            entityType: ENTIFY_TYPE.BOARD,
            action: ACTION.CREATE,
        });
    } catch (error) {
        return {
            error: "Failed to create.",
        };
    }

    revalidatePath(`/board/${board.id}`);

    return {
        data: board,
    };
};

export const createBoard = createSafeAction(CreateBoard, handler);
