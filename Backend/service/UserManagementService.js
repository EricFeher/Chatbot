const jwt = require("jsonwebtoken")
const DAO = require("../dao/dao");
const TwitchService = require("./TwitchService");
class UserManagementService{

    constructor() {}
    /*
    With the bearer token we can get user information
     */

    async manageUser(user){
        try{
            return await this.createUser(user);
        } catch (error){
            throw Error(error.message)
        }
    }

    /*
    Creates the user in the database
     */

    async createUser(user){
        try{
            await new DAO().createUser(user)
            console.log("[MANAGEUSER]: User successfully created: #"+user.username);
            await new TwitchService().subscribeToRequiredEvents(user);
            twitch.joinChannel("#"+user.username)
            return user.id;
        }catch(error){
            if(error.toString().indexOf("Duplicate entry")===-1){
                throw Error("[MANAGEUSER]: User Creation Error: #"+error)
            }
            //NOTE: If the user already exists in the db it updates the user
            return await this.updateUser(user);
        }
    }
    /*
    Updates the existing user in the database
     */
    async updateUser(user){
        try{
            await new DAO().updateUser(user)
            console.log("[MANAGEUSER]: User Successfully Updated: #"+user.username);
            twitch.joinChannel("#"+user.username)
            return user.id
        }catch (error){
            throw Error("[MANAGEUSER]: User Update Error: #"+error)
        }
    }

    async addRefreshTokenToUser(id){
        let data = await new DAO().getRefreshTokenById(id)
        let token = Object.values(JSON.parse(JSON.stringify(data)))
        if(token[0]!==undefined){
            return token[0].refresh_token
        }
        let refresh_token = jwt.sign({id},process.env.REFRESH_TOKEN_SECRET)
        await new DAO().addRefreshToken(id,refresh_token)
        return refresh_token
    }

    createAccessToken(refresh_token) {
        return jwt.sign({refresh_token},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '600s'});
    }

    getCookie(nameOfSearchedCookie, cookies){
        if(!cookies) return ""
        if (!cookies.includes(nameOfSearchedCookie)){
            return false
        }
        let cookie = cookies.substring(cookies.indexOf(nameOfSearchedCookie))
        cookie = cookie.substring(0, cookie.indexOf(";")===-1 ? cookie.length : cookie.indexOf(";")).split("=")[1]
        return cookie.trim()
    }

    async validateSession(accessToken, refreshToken){
        try {
            await this.validateAccessToken(accessToken)
            return accessToken
        } catch (err) {
            let data = await new DAO().getRefreshTokenByToken(refreshToken)
            let token = Object.values(JSON.parse(JSON.stringify(data)))
            if(token[0]!==undefined){
                return 401
            }
            return await this.createAccessToken(refreshToken)
        }
    }

    async validateAccessToken(access_token){
        await jwt.verify(access_token,process.env.ACCESS_TOKEN_SECRET, (err,res) =>{
            if(err) throw Error(err.message)
        })
    }

}module.exports=UserManagementService;