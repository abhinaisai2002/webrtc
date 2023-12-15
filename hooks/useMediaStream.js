import { useEffect, useRef, useState } from "react";

const useMediaStream = () => {

    const [stream, setStream] = useState(null);
    const streamSet = useRef(null);

    useEffect(() => {
        if (streamSet.current) return;

        streamSet.current = true;
        navigator.mediaDevices.getUserMedia({ video: true, audio: true, }).then((stream) => {
            console.log(stream);
            window.z = stream
            setStream(stream);
        }).catch(err => {
            console.log(err.message);
        })
    }, [])


    return {
        stream
    }
}

export default useMediaStream;