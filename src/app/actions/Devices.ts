"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const getDevicesByUser = async () =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return [];
    }

    //console.log(session?.user?.id);

    const sector: any = await prisma.sector.findFirst({
        where: { user: session?.user }
    });

    const devices: any[] = await prisma.device.findMany({
        where : { sector: sector }
    });

    const devicesUpdated = await Promise.all(devices.map(async (device) =>
    {
        const lastVisit = await prisma.maintenance.findFirst({
            where: { deviceId: device.id },
            orderBy: { endAt: "desc" },
        });

        return { ...device, lastVisit };
    }));

    return devicesUpdated;
}