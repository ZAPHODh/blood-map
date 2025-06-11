"use client";


import { SESSION_CHECK_INTERVAL } from "@/lib/auth/helper";
import { Session } from "@/lib/auth/types";
import { useRouter } from "next/navigation";


import React, { ReactNode, useContext, useEffect, useRef, useState } from "react";

interface SessionProvider {
    session: Session | undefined;
    setSession: (session: Session | undefined) => void;
    logout: () => void;
}

export const SessionContext = React.createContext<SessionProvider>({
    session: undefined,
    setSession: () => { },
    logout: () => { },
});

interface Props {
    children: ReactNode;
    initialSession: Session | undefined;
}

const SessionProvider = ({ children, initialSession }: Props) => {
    const intervalRef = useRef<number>(0);
    const [session, setSession] = useState<Session | undefined>(initialSession);
    const { refresh } = useRouter();

    const logout = async () => {
        console.log("Logging out...");
        if (!session) return;
        console.log("Session before logout:", session);
        const res = await fetch("/api/auth/signout", { method: "POST" });
        const result = await res.json();
        if (res.ok && !!result?.success) {
            setSession(undefined);
            refresh();
        }
    };

    async function checkSession() {
        if (session) {
            const res = await fetch("/api/auth/session", { method: "POST" });

            if (!res.ok) {
                clearInterval(intervalRef.current);
                setSession(undefined);
                refresh();
            }
        }
    }

    useEffect(() => {
        checkSession();
        //@ts-expect-error setInterval retorna NodeJS.Timer em vez de number
        intervalRef.current = setInterval(checkSession, SESSION_CHECK_INTERVAL);

        return () => clearInterval(intervalRef.current);
    }, []);

    return (
        <SessionContext.Provider value={{ session, setSession, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => useContext(SessionContext);

export default SessionProvider;