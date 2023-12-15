import { createContext, useContext, useEffect, useState } from "react"
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io();
        setSocket(newSocket); 

        newSocket.on("connect_error", async () => {
            await fetch('/api/_socket');
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider;