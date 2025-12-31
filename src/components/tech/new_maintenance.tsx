"use client"

import { getDeviceByToken } from "@/app/actions/tokens";
import { useEffect, useState } from "react"
import { Error } from "@/components/Error";
import { getLocalDateISO } from "@/lib/dates";
import { addMaintenance } from "@/app/actions/maintenances";
import { useRouter } from "next/navigation";

export const NewMaintenance = ({token}: {token: string}) =>
{
    const [device, setDevice] = useState<any>({});
    const [maint, setMaint] = useState<any>({
        beginAt : "",
        phoneAt : "",
        phoneText: "",
        phoneOK: false,
        briefing: "",
        safetyAt: "",
        safety: "",
        wiresAt: "",
        wires: ""
    });

    const [showSafety, setShowSafety] = useState<boolean>(false);
    const [showWires, setShowWires] = useState<boolean>(false);

    const [modal, setModal] = useState<string>("");
    const [modal2, setModal2] = useState<string>("");

    const router = useRouter();
    
    useEffect(() =>
    {
        //console.log(token);
        const getDevice = async () =>
        {
            setDevice(await getDeviceByToken(token));
        }

        getDevice();

        setMaint({
            ...maint,
            beginAt: getLocalDateISO()
        });
    }, []);

    const handleBeginAt = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setMaint({...maint, beginAt: e.target.value});
    }

    const handlePhone = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, phoneText: e.target.value, phoneAt: getLocalDateISO()});
    }

    const handlePhoneOK = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setMaint({...maint, phoneOK: e.target.checked, phoneAt: getLocalDateISO()});
    }

    const handleBriefing = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, briefing: e.target.value});
    }

    const handleSafety = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, safety: e.target.value, safetyAt: getLocalDateISO()});
    }

    const handleWires = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, wires: e.target.value, wiresAt: getLocalDateISO()});
    }

    const handleMaint = async () =>
    {
        maint.deviceId = device.id;
        maint.endAt = getLocalDateISO();
        
        //console.log(maint);

        setModal("");

        if(await addMaintenance(maint))
        {
            router.push("/tech_home");
        }

        else
        {
            setModal2("Une erreur s'est produite");
        }
    }

    return (
        <>
            {
                device !== null &&

                <div>
                    <h1>{ device.ref }</h1>
                    <h2>{ device.address } { device.zipCode } { device.city }</h2>

                    <div>
                        <div>
                            <label htmlFor="">Début de la maintenance</label>
                            <input type="datetime-local" value={maint.beginAt} onChange={handleBeginAt} />
                        </div>

                        <div>
                            <label htmlFor="">Bilan essai téléphonique</label>
                            <textarea value={maint.phoneText} onChange={handlePhone} />
                        </div>

                        <div>
                            <label htmlFor="">Fonctionne ?</label>
                            <input type="checkbox" value={maint.phoneOK} onChange={handlePhoneOK} />
                        </div>

                        <div>
                            <label htmlFor="">Bilan global</label>
                            <textarea value={maint.briefing} onChange={handleBriefing} />
                        </div>

                        <div>
                            <button onClick={() => setShowSafety(!showSafety)}>
                                {
                                    !showSafety &&

                                    <div>Entrer bilan essai parachute</div>
                                }

                                {
                                    showSafety &&

                                    <div>Masquer bilan essai parachute</div>
                                }
                            </button>
                        </div>

                        {
                            showSafety &&

                            <div>
                                <label htmlFor="">Bilan essai parachute</label>
                                <textarea value={maint.safety} onChange={handleSafety} />
                            </div>
                        }

                        <div>
                            <button onClick={() => setShowWires(!showWires)}>
                                {
                                    !showWires &&

                                    <div>Entrer bilan contrôle des câbles</div>
                                }

                                {
                                    showWires &&

                                    <div>Masquer bilan contrôle des câbles</div>
                                }
                            </button>
                        </div>

                        {
                            showWires &&

                            <div>
                                <label htmlFor="">Bilan contrôle câbles</label>
                                <textarea value={maint.wires} onChange={handleWires} />
                            </div>
                        }
                    </div>

                    <button onClick={() => setModal("Confirmer la fin de la maintenance ?")}>Valider la maintenance</button>
                    
                    {
                        modal !== "" &&

                        <div>
                            <p>
                                { modal }
                            </p>

                            <div>
                                <button onClick={handleMaint}>Oui</button>
                                <button onClick={() => setModal("")}>Non</button>
                            </div>
                        </div>
                    }

                    {
                        modal2 !== "" &&

                        <div>
                            <p>
                                { modal2 }
                            </p>

                            <div>
                                <button onClick={() => setModal2("")}>Ok</button>
                            </div>
                        </div>
                    }
                </div>
            }

            {
                !device &&

                <Error />
            }
        </>
    )
}