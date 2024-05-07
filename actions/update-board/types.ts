import { z } from "zod";
import { Updateboard } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Board } from "@prisma/client";

export type InputType = z.infer<typeof Updateboard>

export type ReturnType = ActionState<InputType,Board>