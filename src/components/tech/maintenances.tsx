"use client"

import { getDevicesByUser } from "@/app/actions/devices";
import { createMaintenanceToken } from "@/app/actions/tokens";
import { encrypt } from "@/lib/crypt";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export const Maintenances = () =>
{
    const [devices, setDevices] = useState<any[]>([]);
    const router = useRouter();
    const session = useSession();

    useEffect(() =>
    {
        const getDevices = async () =>
        {
            setDevices(await getDevicesByUser());
        }

        getDevices();
    }, []);

    const handleNewMaintenance = async (deviceId: number) =>
    {
        const token: string = await createMaintenanceToken(deviceId);
        //console.log(token);
        router.push("maintenances/new/" + token);
    }

    return (
        <>
            <h1>Liste des maintenances à effectuer</h1>

            <table>
                <thead>
                    <tr>
                        <th>Réf</th>
                        <th>Date de début de contrat</th>
                        <th>Adresse</th>
                        <th>Prochaine visite avant le</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        devices
                        .filter((device) =>
                            {
                                if(!device.lastVisit)
                                {
                                    return true;
                                }
                                
                                const delay: number = (Date.now() - device.lastVisit.endAt.getTime()) / (7 * 24 * 3600 * 1000);

                                return delay > 5;
                            }
                        )
                        .map((device) =>
                        {
                            const nextVisit = new Date();
                            let color: string = "text-red-500";
                            const delay: number = (Date.now() - device.lastVisit?.endAt.getTime()) / (7 * 24 * 3600 * 1000);

                            if(device.lastVisit)
                            {
                                nextVisit.setTime(device.lastVisit?.endAt.getTime() + 6 * 7 * 24 * 3600 * 1000);

                                if(delay < 6)
                                {
                                    color = "text-green-500";
                                }

                                else
                                if(delay >= 6 && delay < 7)
                                {
                                    color = "text-orange-500";
                                }

                                else
                                if(delay >= 7)
                                {
                                    color = "text-red-500";
                                }
                            }
                            
                            return (
                                <tr key={device.id}>
                                    <td>{ device.ref }</td>
                                    <td>{ new Date(device.createdAt).toLocaleDateString() }</td>
                                    <td>{ device.address } { device.zipCode } { device.city }</td>
                                    <td className={color}>{ device.lastVisit ? nextVisit.toLocaleDateString() : "N/A" }</td>
                                    <td><button className="hover:cursor-pointer" onClick={() => handleNewMaintenance(device.id)}>Traiter la maintenance</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </>
    )
}