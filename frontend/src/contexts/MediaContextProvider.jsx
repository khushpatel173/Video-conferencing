import { useState } from "react";
import MediaContext from "./MediaContext";
const MediaContextProvider = ({children})=>{
      const [isAudio , setIsAudio] = useState(false);
        const [isVideo , setIsVideo] = useState(false);
        const [stream , setStream] = useState(null);
        const [name , setName] = useState('');
    return(
        <MediaContext.Provider value={{isAudio , isVideo , stream , setStream , setIsAudio , setIsVideo , name , setName}}>
            {children}
        </MediaContext.Provider>
    )
}

export default MediaContextProvider