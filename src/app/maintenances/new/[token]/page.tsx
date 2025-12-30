"use server"

import { getDeviceByToken } from "@/app/actions/tokens";
import { NewMaintenance } from "@/components/tech/new_maintenance";

export default async function maintenance({params}: {params: {token: string }})
{
    //console.log(await params);
    const token: string = (await params).token;

    return (
        <NewMaintenance token={token} />
    )
}