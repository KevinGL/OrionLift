"use client"

import { getDevices, setSectorToDevice } from "@/app/actions/devices";
import { getSectors } from "@/app/actions/sectors";
import { useEffect, useState } from "react";

export const ManageDevices = () =>
{
    const sizePage = 20;
    const [page, setPage] = useState<number>(0);
    const [nbPages, setNbPages] = useState<number>(1);
    const [devices, setDevices] = useState<any[]>([]);
    const [sectors, setSectors] = useState<any[]>([]);
    const [showSectors, setShowSectors] = useState<boolean>(false);
    const [deviceId, setDeviceId] = useState<number>(0);
    const [message, setMessage] = useState<string>("");
    const [ref, setRef] = useState<string>("");

    useEffect(() =>
    {
        const getAllDevices = async () =>
        {
            const list = await getDevices();
            setDevices(list);
            setNbPages(list.length / sizePage);
        }

        getAllDevices();

        const getAllSectors = async () =>
        {
            setSectors(await getSectors());
        }

        getAllDevices();
        getAllSectors();
    }, []);

    const setSector = (id: number) =>
    {
        setShowSectors(true);
        setDeviceId(id);
    }
    
    return (
        <>
            <input type="text" placeholder="Rechercher ..." onChange={(e) => setRef(e.target.value)} />

            {
                ref === "" &&

                <div>
                    {Array.from({ length: nbPages }).map((_, i) => (
                        <span className={"hover:cursor-pointer" + (page === i ? " text-blue-500" : "")} key={i} onClick={() => setPage(i)}>{i + 1} </span>
                    ))}
                </div>
            }
            
            <table>
                <thead>
                    <tr>
                        <th>Réf</th>
                        <th>Date de début de contrat</th>
                        <th>Adresse</th>
                        <th>Secteur</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        devices
                        .filter((device: any, index: number) =>
                            {
                                if(ref === "")
                                {
                                    return index >= page * sizePage && index < (page + 1) * sizePage;
                                }

                                else
                                {
                                    return device.ref.toUpperCase().indexOf(ref.toUpperCase()) > -1 || device.address.toUpperCase().indexOf(ref.toUpperCase()) > -1;
                                }
                            })
                        .map((device: any, index: number) =>
                        {
                            return (
                                <tr key={device.id}>
                                    <td>{ device.ref }</td>
                                    <td>{ new Date(device.createdAt).toLocaleDateString() }</td>
                                    <td>{ device.address } { device.zipCode } { device.city }</td>
                                    <td>
                                        {
                                            device.sectorRef ? <><span>{device.sectorRef}</span> <button className="hover:cursor-pointer" onClick={() => setSector(device.id)}>Modifier le secteur</button></> :
                                            <button className="hover:cursor-pointer" onClick=
                                            {() =>
                                                {
                                                    setSector(device.id);
                                                    setIndexDevice(index);
                                                }}>Assigner à un secteur
                                            </button>
                                        }
                                    </td>
                                    <td><button className="hover:cursor-pointer">Voir l'historique</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {
                ref === "" &&

                <div>
                    {Array.from({ length: nbPages }).map((_, i) => (
                        <span className={"hover:cursor-pointer" + (page === i ? " text-blue-500" : "")} key={i} onClick={() => setPage(i)}>{i + 1} </span>
                    ))}
                </div>
            }

            {
                showSectors &&

                <table>
                    <thead>
                        <tr>
                            <th>Réf</th>
                            <th>Nombre d'appareils</th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            sectors.map((sector: any) =>
                            {
                                return (
                                    <tr key={sector.id}>
                                        <td>{ sector.ref }</td>
                                        <td>{ sector.nbDevices }</td>
                                        <td><button className="hover:cursor-pointer" onClick={async () =>
                                            {
                                                if(await setSectorToDevice(deviceId, sector.id))
                                                {
                                                    setShowSectors(false);
                                                    
                                                    setMessage(`Appareil assigné au secteur ${sector.ref}`);
                                                }
                                                else
                                                {
                                                    setMessage("Une erreur s'est produite");
                                                }
                                            }
                                        }>Assigner</button></td>
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
                    <p>{ message }</p>
                    <button className="hover:cursor-pointer" onClick={() => setMessage("")}>OK</button>
                </div>
            }
        </>
    )
}