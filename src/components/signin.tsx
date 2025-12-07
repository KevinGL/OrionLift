"use client"

import { connectSocket } from "@/lib/ws";
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
        const result = await signIn("credentials",
        {
            redirect: false,
            email,
            password,
        });

        if(!result?.error)
        {
            const session = await getSession();

            //connectSocket(session?.user?.id, session?.user?.role);

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200">
            <div className="bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 w-full max-w-sm border border-sky-200">
                <h1 className="text-2xl font-semibold text-center text-sky-700 mb-6">
                    Connexion
                </h1>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-sky-800">
                            Email
                        </label>
                        <input
                            type="email"
                            className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
                            placeholder="email@example.com"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-sky-800">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            className="mt-1 w-full px-3 py-2 rounded-lg border border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent bg-white"
                            placeholder="********"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSignin}
                        className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 rounded-lg transition shadow-md hover:shadow-lg"
                    >
                        Se connecter
                    </button>
                </div>

                {showModal && (
                    <div className="mt-4 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center">
                        {message}
                        <button
                            className="block mx-auto mt-2 text-sm text-red-600 underline"
                            onClick={() => setShowModal(false)}
                        >
                            OK
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}