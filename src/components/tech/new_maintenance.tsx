"use client"

import { getDeviceByToken } from "@/app/actions/tokens";
import { useEffect, useState } from "react"

export const NewMaintenance = ({token}: {token: string}) =>
{
    const [device, setDevice] = useState<any>({});
    
    useEffect(() =>
    {
        //console.log(token);
        const getDevice = async () =>
        {
            setDevice(await getDeviceByToken(token));
        }

        getDevice();
    }, []);

    return (
        <>
            <h1>{ device.ref }</h1>
        </>
    )
}