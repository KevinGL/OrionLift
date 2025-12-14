"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const getUsers = async () =>
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

    const users = await prisma.user.findMany();

    const usersUpdated = await Promise.all(
        users.map(async (user) =>
        {
            const sectorRef = user.sectorId ? (await prisma.sector.findFirst({where: {id: user.sectorId}}))?.ref : "N/A";
            return {...user, sectorRef};
        })
    );

    return usersUpdated;
}

export const addUser = async (newUser: any) =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return;
    }

    if(session.user?.role !== "admin")
    {
        return;
    }

    //console.log(newUser);

    const minCharsPW: number = 15;
    const maxCharsPW: number = 25;
    const nbCharsPW: number = Math.floor(Math.random() * (maxCharsPW - minCharsPW)) + minCharsPW;

    let password: string = "";
    const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(let i = 0 ; i < nbCharsPW ; i++)
    {
        const index: number = Math.floor(Math.random() * chars.length);
        password += chars.at(index);
    }

    const sectorRef: string = newUser.sectorRef ? newUser.sectorRef.toString() : "";

    const sectorId = sectorRef !== "" ? (await prisma.sector.findFirst({ where: { ref: sectorRef } }))?.id : null;

    console.log(password);

    try
    {
        await prisma.user.create({
            data: {
                role: newUser.role,
                email: newUser.email,
                password: await bcrypt.hash(password, 10),
                phone: newUser.phone,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                sectorId: sectorId,
                teamId: newUser.teamId
            }
        });

        return true;
    }
    catch(error)
    {
        console.log(`Error add user : ${error}`);
        return false;
    }
}

export const getTechsDB = async () =>
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

    const users = await prisma.user.findMany({
        where:
        {
            role: "tech"
        },
        include:
        {
            sector: true
        }
    });

    return users;
}

export const getActivityByTech = async (userId: number, page: number) =>
{
    const session = await getServerSession(authOptions);

    if(!session)
    {
        return null;
    }

    if(session.user?.role !== "admin")
    {
        return null;
    }
    
    const breakdowns = await prisma.breakdown.findMany({
        where:
        {
            userId
        },

        include:
        {
            device: true
        }
    });
    
    const maintenances = await prisma.maintenance.findMany({
        where:
        {
            userId
        },

        include:
        {
            device: true
        }
    });

    /////////////////////////////////////////////////////////////////////////////

    const events: any[] = [];

    breakdowns.map((br: any) =>
    {
        if(br.takenAt && !br.beginAt && !br.endAt)
        {
            events.push({
                date: br.takenAt,
                type: "Prise en charge panne",
                briefing: br.briefing,
                location: `${br.device.address} ${br.device.zipCode} ${br.device.city}`
            });
        }
    });

    breakdowns.map((br: any) =>
    {
        if(br.beginAt && !br.endAt)
        {
            events.push({
                date: br.beginAt,
                type: "Début panne",
                briefing: br.briefing,
                location: `${br.device.address} ${br.device.zipCode} ${br.device.city}`
            });
        }
    });

    breakdowns.map((br: any) =>
    {
        if(br.endAt)
        {
            events.push({
                date: br.endAt,
                type: "Fin panne",
                briefing: br.briefing,
                location: `${br.device.address} ${br.device.zipCode} ${br.device.city}`
            });
        }
    });

    /////////////////////////////////////////////////////////////////////////////

    maintenances.map((br: any) =>
    {
        if(br.beginAt && !br.endAt)
        {
            events.push({
                date: br.beginAt,
                type: "Début maintenance",
                briefing: br.briefing,
                location: `${br.device.address} ${br.device.zipCode} ${br.device.city}`
            });
        }
    });

    maintenances.map((br: any) =>
    {
        if(br.endAt)
        {
            events.push({
                date: br.endAt,
                type: "Fin maintenance",
                briefing: br.briefing,
                location: `${br.device.address} ${br.device.zipCode} ${br.device.city}`
            });
        }
    });

    events.sort((a: any, b: any) =>
    {
        return a.date.getTime() <= b.date.getTime() ? 1 : -1;
    });

    const sizePage: number = 20;
    const nbPages: number = Math.floor(events.length / sizePage) + 1;
    const offset: number = (page - 1) * sizePage;

    return {
        results: events.slice(offset, offset + sizePage),
        nbPages
    };
}