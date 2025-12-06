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

    return breakdowns;
}

export const addBreakdownDB = async (breakdown: any): boolean =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return false;
    }

    if(session.user?.role !== "admin")
    {
        return false;
    }

    try
    {
        await prisma.breakdown.create({
            data: breakdown
        });

        return true;
    }
    catch(error)
    {
        console.error(error);
        return false;
    }
}

export const getBreakdownsByTechDB = async () =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return [];
    }

    const breakdowns = await prisma.breakdown.findMany({
        where:
        {
            userId: session.user?.id,
            endAt: null
        },

        include:
        {
            device: true
        }
    });

    return breakdowns;
}

export const setTaken = async (id: number) =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return false;
    }

    try
    {
        await prisma.breakdown.update({
            where:
            {
                id
            },
            data:
            {
                takenAt: new Date(Date.now())
            }
        });

        return true;
    }
    catch(error)
    {
        console.error(error);
        return false;
    }
}

export const getBreakdownById = async (id: number) =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return null;
    }

    const breakdown = await prisma.breakdown.findFirst({where: {id}});

    if(!breakdown)
    {
        return null;
    }

    if(breakdown.userId !== session?.user?.id)
    {
        return null;
    }

    return breakdown;
}