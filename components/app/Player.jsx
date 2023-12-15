import { CircleUserIcon, MicOff } from "lucide-react";
import ReactPlayer from "react-player";


export default function Player(props) {

  const { playerId,url,showIcons,muted,playing,videoDetails,...remaining} = props;
  console.log("PLAYING", playing)

  if (!playing) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="bg-gray-500 w-full h-3/4 flex items-center "> 
          <CircleUserIcon
            color="white"
            className="h-48 w-48 mx-auto"
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full relative flex justify-center items-center">
      {showIcons && !videoDetails.mic &&
        <div className="absolute top-0 right-0">
          <MicOff color='white'
            className='w-8 h-8'
          />
        </div>
      }
      <ReactPlayer
        className="rounded-sm"
        width={'100%'}
        height={'100%'}
        playing={true}
        url={url}
        muted={true} key={playerId}
        {...remaining}
      />
    </div>
  )

}