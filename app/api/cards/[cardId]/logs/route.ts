import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTIFY_TYPE } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { cardId: string } }
) {
    try {
        const { userId, orgId } = auth();
        if (!userId || !orgId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const logs = await db.auditLog.findMany({
            where: {
                entityID: params.cardId,
                orgID:orgId,
                userId,
                entityType: ENTIFY_TYPE.CARD
            },
            orderBy:{
                createdAt: "desc"
            },
            take: 3
        });

        return NextResponse.json(logs)

    } catch (error) {
        return new NextResponse("Internal Error", { status: 500 });
    }
}
