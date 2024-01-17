import {createContext, useCallback, useState} from "react";
import {claim, keeperLogin} from "./WavesKeeper";


export type TAppState = {
    user: null|string;
    userName: null|string;
    nodeUrl: string;
    isLogin: boolean;
    vestingContract: string;
    login: () => Promise<void>;
    logout: () => void;
    claimWX: () => Promise<void>;
};

export const AppContext = createContext<TAppState>({} as TAppState);

export const AppState = () => {

    const [vestingContract] = useState('3P3zKMa8PAdp3uDECXYvvHdqzyS2dh81gfJ');
    const [ nodeUrl, setNodeUrl] = useState('https://nodes.waves.exchange');
    const [ user, setUser ] = useState<string|null>(null);
    const [ userName, setUserName ] = useState<string|null>(null);

    const login = useCallback(async () => {
        const { user, server, userName } = await keeperLogin();
        setUser(user);
        setUserName(userName);
        setNodeUrl(server);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setUserName(null);
        setNodeUrl('');
    }, []);

    const claimWX = useCallback(async () => {
        await claim(nodeUrl, vestingContract);
    }, []);

    const isLogin = !!user;

    return { user, userName, login, nodeUrl, isLogin, logout, vestingContract, claimWX } as TAppState;
};