"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const getSectors = async () =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return [];
    }

    if(session.user?.role !== "admin")
    {
        return [];
    }

    const sectors = await prisma.sector.findMany();

    const sectorsUpdated = await Promise.all(sectors.map(async (sector: any) =>
    {
        const nbDevices: number = (await prisma.device.findMany({ where: { sectorId: sector.id } })).length;
        return { ...sector, nbDevices };
    }));

    return sectorsUpdated;
}