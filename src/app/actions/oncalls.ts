"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";

export const getOnCallsByTeam = async (team: number) =>
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

    const users = await prisma.user.findMany({where: {teamId: team}});

    const usersUpdated = await Promise.all(
        users.map(async (user: any) =>
        {
            const onCalls = await prisma.onCall.findMany({where: {userId: user.id}});

            return {...user, onCalls};
        })
    );

    return usersUpdated;
}