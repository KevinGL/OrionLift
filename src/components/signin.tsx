"use client"

import { getSession, signIn } from "next-auth/react"
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignIn()
{
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const router = useRouter();
    
    const handleSignin = async () =>
    {
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if(!result?.error)
        {
            const session = await getSession();

            if (session?.user?.role === "admin") 
            {
                router.push("/admin_home");
            }
            else
            {
                router.push("/tech_home");
            }
        }

        else
        {
            //console.log(result?.error);
            setShowModal(true);
            setMessage("Erreur lors de l'autnentification");
        }
    }
    
    return (
        <>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="********" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleSignin}>Valider</button>

            {
                showModal &&

                <div>
                    {message}
                    <button onClick={() => setShowModal(false)}>OK</button>
                </div>
            }
        </>
    )
}