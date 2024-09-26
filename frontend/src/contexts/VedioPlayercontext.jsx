import react from 'react'
import {createContext,useContext,useState,useEffect} from 'react'

export const vedioPlayerContext= createContext();

export const VedioProvider=({children})=>{
    const [link,setLink]=useState('');

    return(
        <vedioPlayerContext.Provider value={{link,setLink}}>
        {children}
        </vedioPlayerContext.Provider>
    )
}




