import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { fa, fakerFR as faker } from '@faker-js/faker';

const prisma = new PrismaClient();

export async function main()
{
    await prisma.maintenance.deleteMany();
    await prisma.breakdown.deleteMany();
    await prisma.intervention.deleteMany();
    await prisma.onCall.deleteMany();
    await prisma.device.deleteMany();
    await prisma.team.deleteMany();
    await prisma.sector.deleteMany();
    await prisma.user.deleteMany();

    const sectors = [];
    for (let i = 0; i < 9; i++)
    {
        sectors.push(await prisma.sector.create({ data: { ref: `S-${i + 1}` } }));
    }
    
    ////////////////////////////////////////
    
    await prisma.user.create({
        data:
        {
            role: "admin",
            email: "admin@test.com",
            phone: "0600000000",
            firstname: "Admin",
            lastname: "Test",
            password: await bcrypt.hash("admin", 10),
        },
    });

    const techs = [];
    for (let i = 0; i < 10; i++)
    {
        techs.push(
            await prisma.user.create({
                data:
                {
                    role: i === 0 ? "admin" : "tech",
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    firstname: faker.person.firstName(),
                    lastname: faker.person.lastName(),
                    password: await bcrypt.hash("tech", 10),
                    ...(
                        i === 0
                        ? {}
                        : { sector: { connect: { id: sectors[i - 1].id } } }
                    )
                },
            })
        );
    }

    ////////////////////////////////////////

    const team = await prisma.team.create({
        data:
        {
            leaderId: techs[0].id,
        },
    });

    for (const tech of techs)
    {
        await prisma.user.update({
            where: { id: tech.id },
            data: { teamId: team.id },
        });
    }

    ////////////////////////////////////////

    const devices: any[] = [];
    const prefixes: string[] = ["AA", "DA", "SA", "TA", "OA", "KA"];

    for (const sector of sectors)
    {
        for (let i = 0; i < 5; i++)
        {
            const indexPrefix = Math.floor(Math.random() * prefixes.length);
            
            devices.push(
                await prisma.device.create({
                    data:
                    {
                        ref: `${prefixes[indexPrefix]}${faker.string.numeric(5)}`,
                        createdAt: faker.date.past(),
                        address: faker.location.streetAddress(),
                        zipCode: faker.location.zipCode(),
                        city: faker.location.city(),
                        sector: { connect: { id: sector.id } },
                    }
                })
            );
        }
    }

    ////////////////////////////////////////

    const types: string[] =
    [
        "ASCBLQ",
        "ASCBRU",
        "PBETAG",
        "OBJFOS",
        "PERSBLQ"
    ];

    for(const device of devices)
    {
        const tech = techs.find((t) => t.sectorId === device.sectorId) ?? techs[0];

        const indexTech = Math.floor(Math.random() * techs.length);
        const onCall = await prisma.onCall.create({
            data:
            {
                user: {connect: {id: techs[indexTech].id}},
                beginAt: faker.date.recent(),
                endAt: faker.date.recent()
            }
        });

        const indexType = Math.floor(Math.random() * types.length);
        await prisma.breakdown.create({
            data:
            {
                device: { connect: { id: device.id } },
                user: { connect: { id: tech.id } },
                createdAt: faker.date.recent(),
                takenAt: faker.date.recent(),
                beginAt: faker.date.recent(),
                endAt: faker.date.recent(),
                type: types[indexType],
                description: faker.lorem.sentence(),
                briefing: faker.lorem.sentence(),
                onCall: {connect: {id: onCall.id}}
            },
        });

        await prisma.maintenance.create({
            data:
            {
                device: { connect: { id: device.id } },
                user: { connect: { id: tech.id } },
                phoneAt: faker.date.recent(),
                phoneOK: true,
                phoneText: "OK",
                beginAt: faker.date.recent(),
                endAt: faker.date.recent(),
                safetyAt: faker.date.recent(),
                wiresAt: faker.date.recent(),
                briefing: faker.lorem.sentence(),
                safety: faker.lorem.sentence(),
                wires: faker.lorem.sentence()
            },
        });
    }

    await prisma.$disconnect();

    console.log("✅ Seed OK");
}

main();