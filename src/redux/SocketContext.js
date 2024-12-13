import React, {createContext, useContext, useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setInfluencerApprovedAccounts} from "./slice/influencer-approved-accounts";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
        
    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SERVER);
        setSocket(newSocket);

        newSocket.on('brands approved', (data) => {
            setMessage(data);
            if (data.isVerified) {
                dispatch(setInfluencerApprovedAccounts(data.updatedAccounts));
                navigate('/account/influencer/approved-accounts');
            }
        });

        return () => {
            newSocket.off('brand approved');
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{socket, message}}>
            {children}
        </SocketContext.Provider>
    );
};
