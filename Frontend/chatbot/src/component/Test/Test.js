import React, {useEffect, useState} from 'react'
import AuthenticationService from "../../service/AuthenticationService";



const Test = () => {

    let [called, setCalled] = useState(false)
    let [loaded, setLoaded] = useState(false)

    const access = async () => {
        if(!called){
            called=true
            let result = await AuthenticationService.isAccessable()
            console.log(result)
            //TODO: WHAT IF RESULT FALSE => DO SOMETHING
            setLoaded(true)
        }
    }

    useEffect(() => {
        access()
      }, []);

    return(<>{ loaded ?(
    <>Helo</>) : <></>
    }</>);
}

export default Test