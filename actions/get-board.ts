"use server";
import { db } from "@/lib/db";

export const getBoards = async ({ orgId }: { orgId: string }) => {
    const data = await db.board.findMany({
        where: {
            orgId: orgId as string,
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return data;
};
