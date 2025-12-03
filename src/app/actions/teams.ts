"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { Rye } from "next/font/google";

export const getTeams = async () =>
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

    const teams = await prisma.team.findMany();

    let teamsUpdated = await Promise.all(teams.map(async (team) =>
    {
        const techs = await prisma.user.findMany({where: {teamId: team.id}});
        const leader = await prisma.user.findFirst({where: {id: team.leaderId}});

        console.log(techs);

        return {...team, techs, leader};
    }));

    return teamsUpdated;
}

export const addTeamDB = async (techs: any[], leader: number) =>
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
        const res = await prisma.team.create({
            data:
            {
                leaderId: leader
            }
        });

        techs.map(async (tech) =>
        {
            await prisma.user.update({
                where:
                {
                    id: tech.id
                },
                data:
                {
                    teamId: res.id
                }
            });
        });

        return true;
    }

    catch(error)
    {
        console.error(error);
        return false;
    }
}