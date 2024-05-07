import {z} from "zod";

// T can be an object => FieldErrors is an object with keys are key of object T and value is string[]
export type FieldErrors<T> = {
    [K in keyof T] : string[] 
}

export type ActionState<TInput, TOutput> = {
    fieldErros?: FieldErrors<TInput>,
    error?: string | null
    data?: TOutput
}

export const createSafeAction = <TInput, TOutput>(
    schema: z.Schema<TInput>,
    handler: (validatedData: TInput) => Promise<ActionState<TInput,TOutput>>
)  => {
    return async (data: TInput) : Promise<ActionState<TInput, TOutput>> => {
        const validationResult = schema.safeParse(data);

        if(!validationResult.success){
            return {
                fieldErros: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>,
            }
        }

        return handler(validationResult.data)
    }
}