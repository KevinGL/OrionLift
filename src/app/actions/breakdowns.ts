"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const getBreakdownsBySectorDB = async (sectorId: number) =>
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

    const devices = await prisma.device.findMany({
        where: { sectorId },
        select: { id: true },
    });

    const deviceIds = devices.map(d => d.id);

    if (deviceIds.length === 0)
    {
        return [];
    }

    const breakdowns = await prisma.breakdown.findMany({
        where:
        {
            deviceId: { in: deviceIds },
        },
        orderBy:
        {
            createdAt: "desc",
        },
        include:
        {
            user: true,
            device: true,
            onCall: true
        },
    });

    //console.log(breakdowns);

    return breakdowns;
}

export const getBreakdownsByDeviceDB = async (ref: string) =>
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

    const device = (await prisma.device.findFirst({where: {ref}}));

    console.log(device);

    if(!device)
    {
        return [];
    }

    const deviceId: number = device?.id;

    const breakdowns = await prisma.breakdown.findMany({
        where:
        {
            deviceId
        },
        orderBy:
        {
            createdAt: "desc",
        },
        include:
        {
            user: true,
            device: true,
            onCall: true
        },
    });

    //console.log(breakdowns);

    return breakdowns;
}