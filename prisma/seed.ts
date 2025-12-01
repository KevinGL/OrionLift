import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { fa, fakerFR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function main()
{
    await prisma.device.deleteMany();
    await prisma.user.deleteMany();
    await prisma.sector.deleteMany();
    await prisma.maintenance.deleteMany();
    await prisma.breakdown.deleteMany();

    let sectors = [];
    
    for(let i = 0 ; i < 10 ; i++)
    {
        const sector = await prisma.sector.create({
            data: {
                ref: (i + 1).toString()
            }
        });

        sectors.push(sector);
    }
    
    ////////////////////////////////////////
    
    await prisma.user.create({
    data:
        {
            role: "admin",
            email: "kevinferrogl@gmail.com",
            phone: "0642427521",
            firstname: "Kévin",
            lastname: "Gay",
            password: await bcrypt.hash("admin", 10)
        }
    });

    for(let i = 0 ; i < 10 ; i++)
    {
        await prisma.user.create({
            data: {
                role: "tech",
                email: faker.internet.email(),
                phone: faker.phone.number(),
                firstname: faker.person.firstName(),
                lastname: faker.person.lastName(),
                password: await bcrypt.hash("tech", 10),
                sector: { connect: { id: sectors[i].id } }
            }
        });
    }

    ////////////////////////////////////////

    const devices: any[] = [];

    sectors.map(async (sector) =>
    {
        const minDevices = 80;
        const maxDevices = 150;
        const nbDevices = Math.floor(Math.random() * (maxDevices - minDevices)) + minDevices;

        for(let i = 0 ; i < nbDevices ; i++)
        {
            const prefixes: string[] = ["AA", "DA", "SA", "TA", "OA", "KA"];
            
            const ref: string = prefixes[Math.floor(Math.random() * prefixes.length)] + faker.string.numeric(5);

            const device =
            {
                ref,
                createdAt: faker.date.between({
                    from: new Date(2020, 0, 1),
                    to: new Date(2024, 11, 31)
                }),
                address: faker.location.streetAddress(),
                zipCode: faker.location.zipCode(),
                city: faker.location.city(),
                sector: { connect: { id: sector.id } }
            }

            devices.push(device);
            
            await prisma.device.create({
                data: device
            });
        }
    });

    ////////////////////////////////////////

    /*devices.map(async (device) =>
    {
        const date: Date = new Date();

        date.setFullYear(2024);
        date.setDate(Math.floor(Math.random() * 27) + 1);
        date.setMonth(Math.floor(Math.random() * 11) + 1);
        date.setHours(Math.floor(Math.random() * 8) + 9);
        date.setMinutes(Math.floor(Math.random() * 60));
        date.setSeconds(Math.floor(Math.random() * 60));

        const beginAt: Date = new Date();
        beginAt.setTime(date.getDate() - 30 * 60 * 1000);

        const phoneAt: Date = new Date();
        phoneAt.setTime(date.getDate() - 15 * 60 * 1000);

        while(1)
        {
            await prisma.maintenance.create({
                data: {
                    device: { connect: { id: device.id } },
                    user: { connect: { id: device.sector.user.id } },
                    beginAt,
                    endAt: date,
                    phoneAt,
                    phoneOK: Math.random() > 0.5 ? true : false,
                    phoneText: faker.lorem.sentence(),
                    briefing: faker.lorem.sentence(),
                    safetyAt: date,
                    safety: Math.random() > 0.5 ? "" : faker.lorem.sentence(),
                    wiresAt: date,
                    wires: Math.random() > 0.5 ? "" : faker.lorem.sentence()
                }
            });

            const gap: number = Math.floor(5 * Math.random() - 2);

            date.setTime(date.getTime() + 6 * 7 * 24 * 3600 * 1000 + gap * 24 * 3600 * 1000);
        }

        //////////////////////////////////////////////////////////////////////////////////

        const nbBreakdowns: number = Math.floor(Math.random() * 14) + 1;
        
        for(let i = 0 ; i < nbBreakdowns ; i++)
        {
            const duration: number = Math.floor(Math.random() * 30) + 30;
            beginAt.setTime(date.getDate() - duration * 60 * 1000);
            
            await prisma.breakdown.create({
                data: {
                    device: { connect: { id: device.id } },
                    user: { connect: { id: device.sector.user.id } },
                    beginAt,
                    endAt: date
                }
            });
        }
    });*/

    console.log("✅ Seed OK");
}

main();