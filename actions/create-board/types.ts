import { z } from "zod";

// type for model Board => return type for model Board it's mean type return
import { Board } from "@prisma/client";

// type for return
import { ActionState } from "@/lib/create-safe-action";

// schema for input value
import { CreateBoard } from "./schema";

export type InputType = z.infer<typeof CreateBoard>;

export type ReturnType = ActionState<InputType, Board>;