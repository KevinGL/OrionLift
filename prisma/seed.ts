import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { fa, fakerFR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function main()
{
    await prisma.device.deleteMany();
    await prisma.user.deleteMany();
    await prisma.sector.deleteMany();

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

    sectors.map(async (sector) =>
    {
        const minDevices = 80;
        const maxDevices = 150;
        const nbDevices = Math.floor(Math.random() * (maxDevices - minDevices)) + minDevices;

        for(let i = 0 ; i < nbDevices ; i++)
        {
            const prefixes: string[] = [ "DA", "SA", "TA", "OA", "KA"];
            
            const ref: string = prefixes[Math.floor(Math.random() * prefixes.length)] + faker.string.numeric(5);
            
            await prisma.device.create({
                data: {
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
            });
        }
    });

    console.log("✅ Seed OK");
}

main();