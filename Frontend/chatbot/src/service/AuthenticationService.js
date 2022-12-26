import axios from "axios"
import Cookies from 'universal-cookie';


const login = async (code) => {
    let response
    const data = {
        code: code,
    }
    try{
        response = await axios.post("http://localhost:8080/auth",{data},{withCredentials: true})
    }catch(error){
        console.log(error.response)
        return
    }
    //NOTE: LOGIN WAS SUCCESSFUL
    localStorage.setItem("access_token", response.data.access_token)
    localStorage.setItem("username", response.data.user.displayName)
    localStorage.setItem("picture", response.data.user.picture)
    localStorage.setItem("id", response.data.user.id)
    window.location="/";
}

const logout = () => {
    const cookies = new Cookies();
    cookies.set("refresh_token",'',{
        maxAge: 0,
        httpOnly: true,
    })
    localStorage.removeItem("access_token")
    localStorage.removeItem("username")
    localStorage.removeItem("picture")
    localStorage.removeItem("id")
    window.location.href="/";
}

const isAccessable = async () => {
    let accessToken = localStorage.getItem("access_token")
    try{
        let response = await axios.post("http://localhost:8080/validateSession", {accessToken},{withCredentials: true})
        localStorage.setItem("access_token", response.data.access_token)
        return true;
    }catch (error){
        console.log(error)
        logout()
        return false
    }
}

const AuthenticationService = {
    login,
    logout,
    isAccessable
}

export default AuthenticationService