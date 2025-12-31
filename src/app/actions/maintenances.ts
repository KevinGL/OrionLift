"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const addMaintenance = async (maint: any) =>
{
    const session = await getServerSession(authOptions as any);

    if(!session)
    {
        return "";
    }

    const userId: number = session?.user?.id;

    console.log(maint);

    maint.userId = userId;
    maint.beginAt = maint.beginAt === "" ? new Date(Date.now()) : new Date(maint.beginAt);
    maint.phoneAt = maint.phoneAt === "" ? new Date(Date.now()) : new Date(maint.phoneAt);
    maint.safetyAt = maint.safetyAt === "" ? new Date(Date.now()) : new Date(maint.safetyAt);
    maint.wiresAt = maint.wiresAt === "" ? new Date(Date.now()) : new Date(maint.wiresAt);
    maint.endAt = maint.endAt === "" ? new Date(Date.now()) : new Date(maint.endAt);

    try
    {
        await prisma.maintenance.create({
            data: maint
        });

        return true;
    }

    catch(error)
    {
        console.log(error);
        return false;
    }
}