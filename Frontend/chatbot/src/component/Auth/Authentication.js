import { useLocation } from "react-router-dom";
import AuthenticationService from "../../service/AuthenticationService";
import { useEffect, useContext } from "react";

function Authentication() {

    const location = useLocation()
    
    const code = new URLSearchParams(location.search).get('code');

    let called = false;



    useEffect(()=>{
        const authentication = () => {
            if(!called){
                called=!called
                AuthenticationService.login(code)
            }
        }
        authentication()
    },[])
    
    return (
        <>
            <div>
                {code}
            </div>
        </>
    );
  }
  
  export default Authentication;