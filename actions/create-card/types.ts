import { z } from "zod";

// type for model Board => return type for model Board it's mean type return
import { Card, List } from "@prisma/client";

// type for return
import { ActionState } from "@/lib/create-safe-action";

// schema for input value
import { CreateCard } from "./schema";

export type InputType = z.infer<typeof CreateCard>;

export type ReturnType = ActionState<InputType, Card>;