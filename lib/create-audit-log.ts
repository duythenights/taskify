import { auth, currentUser } from "@clerk/nextjs/server"
import { ACTION, ENTIFY_TYPE } from "@prisma/client"
import { db } from "./db"

interface Props {
    entityID: string
    entityType: ENTIFY_TYPE
    entityTitle: string
    action: ACTION
}


export const createAuditLog = async (props: Props) => {
    try{
        const {orgId } = auth()
        const user = await currentUser()

        if(!user || !orgId){
           throw new Error("User not found.")
        }


        const {action,entityID,entityTitle,entityType} = props

        await db.auditLog.create({
            data: {
                orgID:orgId as string,
                entityID,
                entityType,
                action,
                entityTitle,
                userId: user.id,
                userImage: user?.imageUrl,
                userName: user.firstName + " " + user.lastName,
            }
        })


    }
    catch(error){
        console.log("[AUDIT_LOG_ERROR]", error)
    }
}