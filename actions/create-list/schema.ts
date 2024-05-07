import {z} from 'zod'

export const CreateList = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title is required"
    }).min(3, {
        message: "Tittle is too short."
    }),
    boardId: z.string({
        required_error: "BoardId is required",
        invalid_type_error: "BoardId is required"
    })
     
})