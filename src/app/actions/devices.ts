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

export const getDevicesDB = async () =>
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

    const devices = await prisma.device.findMany();

    const devicesUpdated = await Promise.all(
        devices.map(async (device: any) =>
        {
            const sector: any = await prisma.sector.findFirst({where: {id: device.sectorId}});

            return { ...device, sectorRef: sector.ref };
        })
    );

    return devicesUpdated;
}

export const setSectorToDevice = async (deviceId: number, sectorId: number) =>
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

    //console.log(sectorId);

    try
    {
        await prisma.device.update({
            where: {
                id: deviceId
            },
            data: {
                sectorId
            },
        })
    }

    catch(error)
    {
        console.log(`Error update device : ${error}`);
        return false;
    }

    return true;
}

export const addDeviceDB = async (device: any) =>
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

    console.log(device.sectorId);

    try
    {
        if(await prisma.device.create({
            data:
            {
                ref: device.ref,
                createdAt: new Date(Date.now()),
                address: device.address,
                zipCode: device.zipCode,
                city: device.city,
                sector: { connect: { id: device.sectorId } }
            }
        }))
        {
            return true;
        }
    }

    catch(error)
    {
        console.error(error);
        return false;
    }
}