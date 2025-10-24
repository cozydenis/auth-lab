import { createContext, useContext, useEffect, useState } from 'react';
import { AuthAPI } from './api';


//lightweight auth context (keeps user state)

type User = { id: number, email: string, nickname: string } | null;

type AuthCtx = {
    user: User;
    loading: boolean;
    refresh: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>(null!);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);


    const refresh = async () => {
        try {
            const u = await AuthAPI.me();
            setUser(u || null);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        const u = await AuthAPI.register(email, password);
        setUser(u);
    }

    const login = async (email: string, password: string) => {
        const u = await AuthAPI.login(email, password);
        setUser(u);
    };

    const logout = async () => {
        await AuthAPI.logout();
        setUser(null);
    };

    useEffect(() => { void refresh(); }, []);

    return (<Ctx.Provider value={{ user, loading, refresh, register, login, logout }}>
        {children}
    </Ctx.Provider>);
}

