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