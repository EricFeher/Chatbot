const {default: axios} = require("axios");
const UserManagementService = require("../service/UserManagementService")
const User = require("../model/user");
const TwitchService = require("../service/TwitchService");

class UserManagementController{
    constructor() {
        this.userManagementService = new UserManagementService()
        this.twitchService = new TwitchService()
        this.userAuth();
        this.validateSession();
        this.test();
    }

    userAuth(){
        app.post('/auth',async (req,res)=>{
            let body = JSON.parse(req.body.toString());
            let result;
            let code=body.data.code;
            try{
                result = await this.twitchService.getUserBearerToken(code);
            }catch (error){
                console.log("[GETUSERBEARERTOKEN]: Error: "+error.message);
                res.sendStatus(500);
            }

            let response;
            let access_token = result.data.access_token
            let refresh_token = result.data.refresh_token;
            let id_token = result.data.id_token;
            try{
                response = await this.twitchService.getUserInfo(access_token);
            } catch (error){
                throw Error("[MANAGEUSER]: Error Getting User Data: #"+error);
            }
            console.log(response);
            let id=response.data.sub;
            let username=response.data.preferred_username.toLowerCase();
            let displayName=response.data.preferred_username;
            let picture=response.data.picture;
            let email=response.data.email;

            let user=new User(id,username,email,access_token,refresh_token,id_token);
            try{
                await this.userManagementService.manageUser(user);
            }catch(err){
                console.log(err.message)
                return
            }

            let session_refresh_token = this.userManagementService.addRefreshTokenToUser(id)
            let session_access_token = this.userManagementService.createAccessToken(session_refresh_token)

            res.cookie("refresh_token",session_refresh_token, {httpOnly:true, sameSite: 'none', secure: true});
            res.send({user: {id, displayName, picture}  ,access_token: session_access_token,status:200});
        });
    }

    validateSession(){
        app.post("/validateSession",async (req, res) => {
            //NEEDED: ACCESS TOKEN => from context, REFRESH TOKEN => from cookie
            let body = JSON.parse(req.body.toString())
            let cookies = req.headers.cookie
            let refreshToken;
            let accessToken = body.accessToken;
            //NOTE: GETS REFRESH TOKEN FROM COOKIE STRING
            let token = this.userManagementService.getCookie("refresh_token", cookies)
            if (!token) return res.status(401).send({message: "Missing refreshToken"})
            refreshToken = token
            //TODO: VALIDATE REFRESH TOKEN LOGIC STATUS CODE 432 IF INVALID ACCESS TOKEN

            let result = await this.userManagementService.validateSession(accessToken,refreshToken)
            if(result===401) return res.status(401).send({message: "Bad refreshToken"})
            res.send({access_token: result,status:200})
        })
    }

    test(){
        app.post("/test",(req,res)=>{
            console.log(req.headers.cookie)
            res.cookie("Helo","Bela");
            res.sendStatus(200);
        })
    }
}module.exports=UserManagementController;