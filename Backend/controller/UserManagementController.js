const {default: axios} = require("axios");
const UserManagementService = require("../service/UserManagementService")

class UserManagementController{
    constructor() {
        this.userManagementService = new UserManagementService()
        this.getUserBearerToken();
    }

    getUserBearerToken(){
        app.get('/authTwitch',(req,res)=>{
            //TODO: Post auth to Twitch
            let client_id=process.env.CLIENT_ID;
            let client_secret=process.env.SECRET_ID;
            let code=req.query.code;
            let grant_type="authorization_code";
            let redirect_uri=process.env.REDIRECT_URI+"/authTwitch";
            axios.post('https://id.twitch.tv/oauth2/token', null,{
                params:{
                    client_id,
                    client_secret,
                    code,
                    grant_type,
                    redirect_uri
                }
            }).then((result) =>{
                console.log("[GETUSERBEARERTOKEN]: Success: "+result);
                let refresh_token=result.data.refresh_token;
                let access_token=result.data.access_token;
                let id_token=result.data.id_token;
                this.userManagementService.manageUser(access_token,refresh_token,id_token,res);
            }).catch((error)=>{
                console.log("[GETUSERBEARERTOKEN]: Error: "+error);
                //res.status(500).redirect_uri("https://twitch.tv.com");
                //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS HIBA
            })
        });
    }
}module.exports=UserManagementController;