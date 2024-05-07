"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { Updateboard } from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTIFY_TYPE } from "@prisma/client";


const handler = async (data: InputType) : Promise<ReturnType> => {

    const {userId ,orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Unauthorized"
        }
    }


    const {title, id} = data

    let board;

    try {

        board = await db.board.update({
            where: {
                id, orgId
            },
            data: {
                title
            }
        })

        await createAuditLog({
            entityID: board.id,
            entityTitle: board.title,
            entityType: ENTIFY_TYPE.BOARD,
            action: ACTION.UPDATE,
        });
        
    } catch (error) {
       return {
        error: "Failed to update."
       } 
    }
    
    revalidatePath(`/board/${id}`)

    return {
        data: board
    }

}

export const updateBoard = createSafeAction(Updateboard, handler)