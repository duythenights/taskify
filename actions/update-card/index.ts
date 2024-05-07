"use server"

import { auth } from "@clerk/nextjs/server"
import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import {  UpdateCard} from "./schema";
import { ACTION, ENTIFY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";


const handler = async (data: InputType) : Promise<ReturnType> => {

    const {userId ,orgId} = auth();

    if(!userId || !orgId){
        return {
            error: "Unauthorized"
        }
    }


    const {id, boardId, ...values} = data

    let card;

    try {

        card = await db.card.update({
            where: {
                id,
                list:{
                    board:{
                        orgId
                    }
                } 
            },
            data: {
                ...values 
            }
        })

        await createAuditLog({
            entityID: card.id,
            entityTitle: card.title,
            entityType: ENTIFY_TYPE.CARD,
            action: ACTION.UPDATE,
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

export const updateCard = createSafeAction(UpdateCard, handler)