"use server";

import { auth } from "@clerk/nextjs/server";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    // because we don't have BE to check the jwt, so we need to check userId here before go foward
    const { userId, orgId } = auth();

    console.log("okay");
    if (!userId || !orgId) {
        return {
            error: "Unauthorized",
        };
    }

    const { items , boardId } = data;

    let lists;

    if(!boardId){
        return {
            error: "Board not found...."
        }
    }

    try {
       const transaction = items.map((list)=> db.list.update({
        where: {
            id: list.id,
            board: {
                orgId
            },
        },
        data: {
            order: list.order
        }
       })) 
       
       lists = await db.$transaction(transaction)

    } catch (error) {
        return {
            error: "Failed to reorder.",
        };
    }

    revalidatePath(`/board/${boardId}`);

    return {
        data: lists,
    };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
