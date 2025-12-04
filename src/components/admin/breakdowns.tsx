"use client"

import { addBreakdownDB, getBreakdownsByDeviceDB, getBreakdownsBySectorDB } from "@/app/actions/breakdowns";
import { getDevicesDB } from "@/app/actions/devices";
import { getSectorsDB } from "@/app/actions/sectors";
import { getTechsDB } from "@/app/actions/Users";
import { useEffect, useState } from "react";

export const ManageBreakdowns = () =>
{
    const [sectors, setSectors] = useState<any[]>([]);
    const [techs, setTechs] = useState<any[]>([]);
    const [breakdowns, setBreakdowns] = useState<any[]>([]);
    const [devices, setDevices] = useState<any[]>([]);
    const [showInputDevice, setShowInputDevice] = useState<boolean>(false);
    const [ref, setRef] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showCreateBr, setShowCreateBr] = useState<boolean>(false);
    const [breakdown, setBreakdown] = useState<any>({type: "ASCBLQ"});

    useEffect(() =>
    {
        const getDevices = async () =>
        {
            setDevices(await getDevicesDB());
        }

        const getTechs = async () =>
        {
            setTechs(await getTechsDB());
        }

        getDevices();
        getTechs();
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

    const setDevice = (value: string) =>
    {
        //console.log(value);

        const device = devices.find((d: any) =>
        {
            return d.id === parseInt(value) || d.ref === value;
        });

        if(device)
        {
            setBreakdown({...breakdown, device});
        }
    }

    const setTech = (value: string) =>
    {
        const tech = techs.find((t: any) =>
        {
            return `${t.firstname} ${t.lastname}` === value;
        });

        if(tech)
        {
            setBreakdown({...breakdown, user: tech});
        }
    }

    const setDescription = (value: string) =>
    {
        setBreakdown({...breakdown, description: value});
    }

    const setType = (value: string) =>
    {
        setBreakdown({...breakdown, type: value});
    }

    const createBreakDown = async () =>
    {
        const breakdownDB =
        {
            createdAt: new Date(),
            takenAt: null,
            beginAt: null,
            endAt: null,
            briefing: "",
            description: breakdown.description,
            type: breakdown.type,

            device: { connect: { id: breakdown.device.id } },
            user: { connect: { id: breakdown.user.id } }
        };

        if(await addBreakdownDB(breakdownDB))
        {
            setMessage("Panne créée");
        }
        else
        {
            setMessage("Une erreur s'est produite");
        }
    }

    return (
        <>
            <datalist id="devices">
                {
                    devices.map((device: any) =>
                    {
                        return <option key={device.id} value={device.id}>{device.ref} (Secteur {device.sector.ref})</option>
                    })
                }
            </datalist>

            <datalist id="techs">
                {
                    techs.map((tech: any) =>
                    {
                        return <option key={tech.id} value={`${tech.firstname} ${tech.lastname}`}>{`${tech.firstname} ${tech.lastname} (Secteur ${tech.sector.ref})`}</option>
                    })
                }
            </datalist>
            
            <div>
                <button className="hover:cursor-pointer" onClick={getSectors}>Historique par secteur</button>
                <button className="hover:cursor-pointer" onClick={() => setShowInputDevice(true)}>Historique par appareil</button>
                <button className="hover:cursor-pointer" onClick={() => {setShowCreateBr(true)}}>Créer une panne</button>
            </div>

            {
                sectors.length > 0 &&

                <div>
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
                    <button className="hover:cursor-pointer" onClick={() => setSectors([])}>Annuler</button>
                </div>
            }

            {
                showInputDevice &&

                <div>
                    <input type="text" list="devices" onChange={(e) => setRef(e.target.value)} />
                    <button className="hover:cursor-pointer" onClick={getByDevice}>Valider</button>
                    <button className="hover:cursor-pointer" onClick={() => setShowInputDevice(false)}>Annuler</button>
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
                showCreateBr &&

                <div>
                    <label htmlFor="">Appareil</label>
                    <input type="text" list="devices" onChange={(e) => setDevice(e.target.value)} />

                    <label htmlFor="">Technicien</label>
                    <input type="text" list="techs" onChange={(e) => setTech(e.target.value)} />

                    <label htmlFor="">Description</label>
                    <input type="textarea" onChange={(e) => setDescription(e.target.value)} />

                    <label htmlFor="">Type de panne</label>
                    <select name="" id="" onChange={(e) => setType(e.target.value)}>
                        <option value="ASCBLQ">Ascenseur bloqué</option>
                        <option value="ASCBRU">Ascenseur bruyant</option>
                        <option value="PBETAG">Problème à un étage</option>
                        <option value="OBJFOS">Objet en fosse</option>
                        <option value="PERSBLQ">Personne(s) bloquée(s)</option>
                    </select>

                    <button className="hover:cursor-pointer" onClick={createBreakDown}>Valider</button>
                    <button className="hover:cursor-pointer" onClick={() => setShowCreateBr(false)}>Annuler</button>
                </div>
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