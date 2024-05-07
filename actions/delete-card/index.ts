"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import {  DeleteCard} from "./schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTIFY_TYPE } from "@prisma/client";


const handler = async (data: InputType) : Promise<ReturnType> => {

    const {userId ,orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Unauthorized"
        }
    }


    const {id,  boardId} = data

    let card;

    try {
        card = await db.card.delete({
            where: {
                id,
                list:{
                    board:{
                        orgId
                    }
                } 
            },
        })
        

        await createAuditLog({
            entityID: card.id,
            entityTitle: card.title,
            entityType: ENTIFY_TYPE.CARD,
            action: ACTION.DELETE,
        });
    } catch (error) {
       return {
        error: "Failed to update."
       } 
    }
    
    revalidatePath(`/board/${boardId}`)

    return {
        data: card
    }

}

export const deleteCard = createSafeAction(DeleteCard, handler)