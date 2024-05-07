import { z } from "zod";

// type for model Board => return type for model Board it's mean type return
import { List } from "@prisma/client";

// type for return
import { ActionState } from "@/lib/create-safe-action";

// schema for input value
import { CreateList } from "./schema";

export type InputType = z.infer<typeof CreateList>;

export type ReturnType = ActionState<InputType, List>;