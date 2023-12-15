import { useState } from "react";
import Card from "@/components/app/Card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function generateRandomString(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}


export default function Home() {

  const [roomId, setRoomId] = useState('');
  const router = useRouter();
  function handleJoinRoom() {
    console.log('Joining Room');
    if (!roomId) {
      alert('Please enter a RoomId');
      return
    }
    router.push(`/${roomId}`);
  }

  function handleCreateRoom() {
    console.log('Creating Room');
    router.push(`/${generateRandomString(16)}`);
  }

  return (
    <div className="flex h-screen justify-center items-center  ">
      <Card
        className="p-3 md:px-8 md:py-4 border-black"
        title={
          <div className="text-3xl">Enter a RoomId to join</div>
        }
        description={
          null 
        }
        content={
          <div>
            <Input
              value={roomId} type="text"
              onChange={e => setRoomId(e.target.value)}
              placeholder="Enter your RoomId"
            />
          </div>
        }
        footer={
          <div className="flex w-full justify-end">
            <Button onClick={handleJoinRoom}>Join Room</Button>
            <Button onClick={handleCreateRoom}>Create Room</Button>
          </div>
        }
      />
    </div>
  )
}