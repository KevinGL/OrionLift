"use client"

import { addDeviceDB, getDevicesDB, setSectorToDevice } from "@/app/actions/devices";
import { getSectorsDB } from "@/app/actions/sectors";
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
    const [showAdd, setShowAdd] = useState<boolean>(false);
    const [device, setDevice] = useState<any>({});

    useEffect(() =>
    {
        const getAllDevices = async () =>
        {
            const list = await getDevicesDB();
            setDevices(list);
            setNbPages(list.length / sizePage + 1);
        }

        getAllDevices();

        const getAllSectors = async () =>
        {
            setSectors(await getSectorsDB());
        }

        getAllDevices();
        getAllSectors();
    }, []);

    const setSector = (id: number) =>
    {
        setShowSectors(true);
        setDeviceId(id);
    }

    const setDeviceRef = (value: string) =>
    {
        setDevice({...device, ref: value});
    }

    const setAddress = (value: string) =>
    {
        setDevice({...device, address: value});
    }

    const setZipCode = (value: string) =>
    {
        setDevice({...device, zipCode: value});
    }

    const setCity = (value: string) =>
    {
        setDevice({...device, city: value});
    }

    const setDeviceSector = (value: number) =>
    {
        setDevice({...device, sectorId: value});
    }

    const addDevice = async () =>
    {
        setShowAdd(false);
        
        if(await addDeviceDB(device))
        {
            setMessage(`Appareil ${device.ref} ajouté avec succès au secteur ${device.sector.ref}`);
        }

        else
        {
            setMessage("Une erreur s'est produite");
        }
    }
    
    return (
        <>
            <datalist id="sectors">
                {
                    sectors.map((sector: any) =>
                    {
                        return (
                            <option key={sector.id} value={sector.id}>Secteur num {sector.ref}</option>
                        )
                    })
                }
            </datalist>
            
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
                        .map((device: any) =>
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

            <button className="hover:cursor-pointer" onClick={() => setShowAdd(true)}>Ajouter un appareil</button>

            {
                showSectors &&

                <>
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

                    <button className="hover:cursor-pointer" onClick={() => setShowSectors(false)}>Annuler</button>
                </>
            }

            {
                message !== "" &&

                <div>
                    <p>{ message }</p>
                    <button className="hover:cursor-pointer" onClick={() => setMessage("")}>OK</button>
                </div>
            }

            {
                showAdd &&

                <div>
                    <div>
                        <input type="text" placeholder="Réf ?" onChange={(e) => setDeviceRef(e.target.value)} />
                        <input type="text" placeholder="Adresse ?" onChange={(e) => setAddress(e.target.value)} />
                        <input type="text" placeholder="Code postal ?" onChange={(e) => setZipCode(e.target.value)} />
                        <input type="text" placeholder="Ville ?" onChange={(e) => setCity(e.target.value)} />
                        <input type="text" placeholder="Secteur ?" list="sectors" onChange={(e) => setDeviceSector(parseInt(e.target.value))} />
                    </div>

                    <button className="hover:cursor-pointer" onClick={() => setShowAdd(false)}>Annuler</button>
                    <button className="hover:cursor-pointer" onClick={addDevice}>Valider</button>
                </div>
            }
        </>
    )
}