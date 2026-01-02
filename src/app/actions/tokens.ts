"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const createMaintenanceToken = async (deviceId: number) =>
{
    const session = await getServerSession(authOptions as any);

    if(!session)
    {
        return "";
    }

    const userId: number = session?.user?.id;
    const token = crypto.randomBytes(16).toString("hex");

    await prisma.token.create({
        data :
        {
            user: { connect: { id: userId } },
            device: { connect: { id: deviceId } },
            token,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        }
    });

    return token;
}

export const getDeviceByToken = async (token: string) =>
{
    const session = await getServerSession(authOptions as any);

    if(!session)
    {
        return null;
    }

    const userId: number = session?.user?.id;

    const dataToken = await prisma.token.findFirst({
        where:
        {
            token,
            userId
        }
    });

    //console.log(dataToken);

    if(!dataToken || dataToken.expiresAt.getTime() < Date.now())
    {
        console.log("Forbidden : token expired");
        return null;
    }

    const device = await prisma.device.findFirst({
        where:
        {
            id: dataToken.deviceId
        }
    });

    return device;
}