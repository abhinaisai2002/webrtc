import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { XCircle } from "lucide-react";
import { Input } from "../ui/input";
import { useSocket } from "@/context/socket";
import { useParams } from "next/navigation";


function Sidenav() {
  
  const [show, setShow] = useState(true);

  const [text,setText] = useState("");
  
  const socket = useSocket();

  const [messages, setMessages] = useState([]);

  const roomId = useParams()?.roomId;

  function handleMessageFromUser({message,mine}) {
    setMessages((messages) => [...messages, { message, mine }]);
  }

  useEffect(() => {
    socket.on("message", handleMessageFromUser)

    return () => {
      socket.off("message", handleMessageFromUser)
    }
  },[])

  function handleSendMessage() {
    if(!text) return;
    socket.emit("message", {message:text,roomId})
    setText("");
  }

  if (!show) {
    return <div
      className="absolute text-white cursor-pointer"
      onClick={() => setShow(true)}
    >
      Message
    </div>;
  }

  return (
    <div className='w-1/6 h-screen'>
      <Command className="flex flex-col h-full">
        <CommandList className="overflow-hidden h-12">
          <CommandGroup>
            <div
              className="flex justify-end items-center w-full z-10"
            >
              <Button
                className="bg-white hover:bg-white"
                onClick={() => setShow(false)}>
                <XCircle
                  color="black"
                  className="w-8 h-8 bg-white" /> 
              </Button>
            </div>
          </CommandGroup>
        </CommandList> 
        <div className="flex-1 flex overflow-auto max-h-fit flex-col justify-center items-center">
          <div className="w-full h-full overflow-scroll">
            <div className="px-4 ">
              {messages && messages.map(({ message, mine }, index) => {
                return (
                  <div
                    className={
                      `
                      text-2xl py-2 flex w-full ${mine ? "justify-end" : "justify-start"
                      }
                      `
                    }
                  >
                    {message}
                  </div>
                )
              })}
            </div>
          </div>
          <div className="pb-8 w-full px-2">
            <div className="flex w-full">
              <Input
                placeholder="Type a message"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1" />
              <Button
                role="button"
                tabIndex={0}
                onClick={handleSendMessage}
              >Send</Button>
            </div>
          </div>
        </div>
      </Command>
    </div>

  )
}

export default Sidenav;