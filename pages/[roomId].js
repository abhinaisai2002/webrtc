import React, { useEffect, useState } from 'react'
import { useSocket } from "../context/socket";
import usePeer from "../hooks/usePeer";
import { redirect, useParams, useRouter } from 'next/navigation';
import useMediaStream from '@/hooks/useMediaStream';
import ReactPlayer from 'react-player';
import Player from '@/components/app/Player';
import Sidenav from '@/components/app/Sidenav';
import { Camera, CameraOff, Mic, Mic2Icon, MicIcon, MicOff, Phone, Videotape } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Room() {
  const socket = useSocket();
  const r = useRouter();
  const { peer, myId } = usePeer();
  const router = useParams();
  const roomId = useParams()?.roomId;
  const stream = useMediaStream();
  const [incomingUserVideoStream, setIncomingUserVideoStream] = useState(null);
  const [myVideoDetails, setMyVideoDetails] = useState({
    mic: true,
    video: true,
  })
  const [incomingVideoDetails, setIncomingVideoDetails] = useState({
    mic: true,
    video: true,
  })
  function handleUserConnected(userId) {

    console.log("user connected", userId);
    const call = peer.call(userId, stream.stream);



    call.on('stream', (incomingUserVideoStream) => {
      console.log(incomingUserVideoStream);
      setIncomingUserVideoStream(incomingUserVideoStream);
    })

    call.on('close', () => {
      console.log("USER CLOSED")
      setIncomingUserVideoStream(null)
      setIncomingVideoDetails({
        mic: true,
        video: true,
      })
    })

    console.log(call);
  }

  function handleUserSettings(settings) {
    console.log(settings);
    setIncomingVideoDetails(settings);
  }

  useEffect(() => {
    if (!socket) return;
    socket.on("user-connected", handleUserConnected)

    socket.on('user-settings', handleUserSettings)

    return () => {
      socket.off('user-connected', handleUserConnected)
      socket.off('user-settings', handleUserSettings)
    }
  }, [[peer, socket, stream]])

  useEffect(() => {
    if (!peer) return;
    peer.on('call', (call) => {
      call.answer(stream.stream);

      call.on('stream', (incomingUserVideoStream) => {
        console.log(incomingUserVideoStream);
        setIncomingUserVideoStream(incomingUserVideoStream);
      })
    })
  }, [peer])




  function handleMicClick() {
    setMyVideoDetails(prev => {
      return { ...prev, mic: !prev.mic }
    });
    socket.emit('user-settings', {
      roomId,
      settings: { ...myVideoDetails, mic: !myVideoDetails.mic }
    })
    stream.stream.getTracks()[0].enabled = !myVideoDetails.mic;
  }
  function handleVideoClick() {
    setMyVideoDetails(prev => {
      return { ...prev, video: !prev.video }
    });
    socket.emit('user-settings', {
      roomId,
      settings: { ...myVideoDetails, video: !myVideoDetails.video }
    })
    stream.stream.getTracks()[1].enabled = !myVideoDetails.video;
  }

  if (!router || !router.roomId) {
    // redirect('/404')
    return null;
  }

  return (
    <div className=' h-screen bg-black'>
      <div className='h-full flex'>

        <Sidenav />
        <div className='flex-1 h-full '>
          <div className='p-4 pb-14 pt-8 flex gap-8 justify-center h-[90%]'>
            <div className={cn('h-full', {
              'flex-1': incomingUserVideoStream
            })}>
              <Player
                videoDetails={myVideoDetails}
                playing={myVideoDetails.video} url={stream.stream} />
            </div>
            {incomingUserVideoStream && <div className='h-full flex-1'>
              <Player showIcons={true} videoDetails={incomingVideoDetails} playing={incomingVideoDetails.video} url={incomingUserVideoStream} />
            </div>}
          </div>
          <footer className='h-[10%]'>
            <ul className='flex justify-center gap-x-8'>
              <li onClick={handleMicClick}>
                {myVideoDetails.mic ?
                  <Mic color='white'
                    className='w-14 h-14 p-2 bg-gray-500 rounded-lg cursor-pointer'
                  /> :
                  <MicOff color='white'
                    className='w-14 h-14 p-2 bg-red-500 rounded-lg cursor-pointer'
                  />
                }
              </li>
              <li onClick={handleVideoClick}>
                {myVideoDetails.video ?
                  <Camera color='white'
                    className='w-14 h-14 p-2 bg-gray-500 rounded-lg cursor-pointer'
                  /> :
                  <CameraOff color='white'
                    className='w-14 h-14 p-2 bg-red-500 rounded-lg cursor-pointer'
                  />
                }
              </li>
              <li>
                <Mic color='white'
                  className='w-14 h-14 p-2 bg-gray-500 rounded-lg cursor-pointer'
                />
              </li>
              <li onClick={() => {
                r.replace('/')
              }}>
                <Phone color='white'
                  className='w-14 h-14 bg-red-500 p-2 rounded-lg cursor-pointer'
                />
              </li>
            </ul>
          </footer>
        </div>
      </div>
    </div >
  )
}
