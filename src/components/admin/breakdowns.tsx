"use client"

import { getBreakdownsByDeviceDB, getBreakdownsBySectorDB } from "@/app/actions/breakdowns";
import { getDevicesDB } from "@/app/actions/devices";
import { getSectorsDB } from "@/app/actions/sectors";
import { useEffect, useState } from "react"

export const ManageBreakdowns = () =>
{
    const [sectors, setSectors] = useState<any[]>([]);
    const [breakdowns, setBreakdowns] = useState<any[]>([]);
    const [devices, setDevices] = useState<any[]>([]);
    const [showInputDevice, setShowInputDevice] = useState<boolean>(false);
    const [ref, setRef] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    useEffect(() =>
    {
        const getDevices = async () =>
        {
            setDevices(await getDevicesDB());
        }

        getDevices();
    }, []);

    const getSectors = async () =>
    {
        setSectors(await getSectorsDB());
    }

    const getBySector = async (id: number) =>
    {
        setBreakdowns(await getBreakdownsBySectorDB(id));
    }

    const getByDevice = async () =>
    {
        setBreakdowns([]);
        
        const list = await getBreakdownsByDeviceDB(ref);

        if(!list.length)
        {
            setMessage("Appareil introuvable");
        }
        else
        {
            setBreakdowns(list);
        }
    }

    return (
        <>
            <datalist id="devices">
                {
                    devices.map((device: any) =>
                    {
                        return <option key={device.id} value={device.ref}>{device.ref}</option>
                    })
                }
            </datalist>
            
            <div>
                <button className="hover:cursor-pointer" onClick={getSectors}>Historique par secteur</button>
                <button className="hover:cursor-pointer" onClick={() => setShowInputDevice(true)}>Historique par appareil</button>
            </div>

            {
                sectors.length > 0 &&

                <ul>
                    {
                        sectors.map((sector: any) =>
                        {
                            return (
                                <li key={sector.id}><button className="hover:cursor-pointer" onClick={() => getBySector(sector.id)}>Secteur {sector.ref}</button></li>
                            )
                        })
                    }
                </ul>
            }

            {
                showInputDevice &&

                <div>
                    <input type="text" list="devices" onChange={(e) => setRef(e.target.value)} />
                    <button className="hover:cursor-pointer" onClick={getByDevice}>Valider</button>
                </div>
            }

            {
                breakdowns.length > 0 &&

                <table>
                    <thead>
                        <tr>
                            <th>Créée le</th>
                            <th>Prise en charge le</th>
                            <th>Traitée le</th>
                            <th>Clôturée le</th>
                            <th>Technicien affilée</th>
                            <th>Appareil concerné</th>
                            <th>Bilan technicien</th>
                            <th>Astreinte ?</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            breakdowns.map((b: any) =>
                            {
                                return (
                                    <tr key={b.id}>
                                        <td>{new Date(b.createdAt).toLocaleDateString()} à {new Date(b.createdAt).toLocaleTimeString()}</td>
                                        <td>{new Date(b.takenAt).toLocaleDateString()} à {new Date(b.createdAt).toLocaleTimeString()}</td>
                                        <td>{new Date(b.beginAt).toLocaleDateString()} à {new Date(b.createdAt).toLocaleTimeString()}</td>
                                        <td>{new Date(b.endAt).toLocaleDateString()} à {new Date(b.createdAt).toLocaleTimeString()}</td>
                                        <td>{b.user.firstname} {b.user.lastname}</td>
                                        <td>{b.device.ref}</td>
                                        <td>{b.briefing}</td>
                                        <td>{b.oncall !== null ? "Oui" : "Non"}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            }

            {
                message !== "" &&

                <div>
                    <div>{message}</div>
                    <button className="hover:cursor-pointer" onClick={() => setMessage("")}>OK</button>
                </div>
            }
        </>
    )
}