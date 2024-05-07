import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

import { MAX_FREE_BOARD } from "@/constants/boards";
import { Oranienbaum } from "next/font/google";

export const increatementAvailabelCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized.");
    }

    try {
        const orgLimit = await db.orgLimit.findUnique({
            where: {
                orgId: orgId,
            },
        });

        if (orgLimit) {
            await db.orgLimit.update({
                where: {
                    orgId,
                },
                data: { count: orgLimit.count + 1 },
            });
        } else {
            await db.orgLimit.create({
                data: {
                    orgId,
                    count: 1,
                },
            });
        }
    } catch (error) {
        throw new Error(error as string);
    }
};
export const descreatementAvailabelCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized.");
    }

    try {
        const orgLimit = await db.orgLimit.findUnique({
            where: {
                orgId: orgId,
            },
        });

        if (orgLimit) {
            await db.orgLimit.update({
                where: {
                    orgId,
                },
                data: { count: orgLimit.count - 1 },
            });
        } else {
            throw Error("Org not found.");
        }
    } catch (error) {
        throw new Error(error as string);
    }
};

export const hasAvailableCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized.");
    }

    try {
        const orgLimit = await db.orgLimit.findUnique({
            where: {
                orgId,
            },
        });

        if (!orgLimit || orgLimit.count < MAX_FREE_BOARD) return true;

        return false;
    } catch (error) {
        throw new Error(error as string);
    }
};

export const getAvailableCount = async () => {
    const { orgId } = auth();

    if (!orgId) {
        throw new Error("Unauthorized.");
    }
    try {
        const orgLimit = await db.orgLimit.findUnique({
            where: {
                orgId,
            },
        });

        if (!orgLimit) return 5;

        return MAX_FREE_BOARD - orgLimit.count;

    } catch (error) {
        throw new Error(error as string);
    }
};
