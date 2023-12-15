import { useSocket } from "@/context/socket";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useRef } from "react";

const usePeer = () => {
    
    const [peer, setPeer] = useState(null)
    
    const [myId, setMyId] = useState(null);
    const isPeerSet = useRef(null);
    const roomId = useParams()?.roomId;
    const socket = useSocket();

    useEffect(() => {
        if(isPeerSet.current || !roomId || !socket) return;
        isPeerSet.current = true;
        let myPeer
        (
            async function () {
                myPeer = new (await import('peerjs')).default();
                console.log(myPeer);
                setPeer(myPeer);
                myPeer.on('open', (id) => {
                    console.log("My peer id is: " + id);
                    setMyId(id);
                    socket?.emit('join-room', roomId,id);
                });
            }
        )()
    }, [roomId,socket])
    
    return {
        peer,myId
    }

}

export default usePeer;