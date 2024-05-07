import { z } from "zod";

// type for model Board => return type for model Board it's mean type return
import { Card } from "@prisma/client";

// type for return
import { ActionState } from "@/lib/create-safe-action";

// schema for input value
import { UpdateCardOrder } from "./schema";

export type InputType = z.infer<typeof UpdateCardOrder>;

export type ReturnType = ActionState<InputType, Card[]>;