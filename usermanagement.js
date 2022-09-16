const {default: axios} = require("axios");
const DAO = require("./dao/dao");
const User = require("./modul/user");
const Twitch = require("./twitch");

class UserManagement{

    constructor() {
        this.app=app;
        this.getUserBearerToken();
    }

/*
Get the users access token (bearer)
 */

    getUserBearerToken(){
        this.app.get('/authTwitch',(req,res)=>{
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
                this.manageUser(access_token,refresh_token,id_token,res);
            }).catch((error)=>{
                console.log("[GETUSERBEARERTOKEN]: Error: "+error);
                //res.status(500).redirect_uri("");
                //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS HIBA
            })

        });
    }
/*
With the bearer token we can get user information
 */
    manageUser(access_token,refresh_token,id_token,res){
        axios.get("https://id.twitch.tv/oauth2/userinfo", {
            headers:{
                "Content-Type": "application/json",
                "Authorization": "Bearer "+access_token
            }
        }).then((result)=>{
            console.log(result);
            let id=result.data.sub;
            let username=result.data.preferred_username.toLowerCase();
            let email=result.data.email;
            let picture=result.data.picture;
            let user=new User(id,username,email,picture,access_token,refresh_token,id_token);
            this.createUser(user);
        }).catch((error)=>{
            console.log("[MANAGEUSER]: Error Getting User Data: #"+error);
            //res.status(500).redirect_uri("");
            //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS HIBA
        });
    }

/*
Creates the user in the database
 */

    createUser(user,res){
        new DAO().createUser(user)
            .then(()=>{
                    console.log("[MANAGEUSER]: User successfully created: #"+user.username);
                    /*res.status(200).redirect_uri("")*/
                    //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS BEJELENTKEZVE, ÉS CSATLAKOZÁS A CHATRE REGISZTRÁCIÓKOR
                    new Twitch("#"+user.username)
                }
            ).catch((error)=>{
            if(error.toString().indexOf("Duplicate entry")===-1){
                console.log("[MANAGEUSER]: User Creation Error: #"+error);
                //res.status(500).redirect_uri("");
                //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS HIBA
                return
            }
            this.updateUser(user);
        });
    }
/*
Updates the existing user in the database
 */
    updateUser(user,res){
        new DAO().updateUser(user)
            .then(()=>{
                    console.log("[MANAGEUSER]: User Successfully Updated: #"+user.username);
                    /*res.status(200).redirect_uri("")*/
                    //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS BEJELENTKEZVE, ÉS CSATLAKOZÁS A CHATRE REGISZTRÁCIÓKOR
                    new Twitch("#"+user.username)
                }
            ).catch((error)=>{
            console.log("[MANAGEUSER]: User Update Error: #"+error);
            //res.status(500).redirect_uri("");
            //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS HIBA
        });
    }
}module.exports=UserManagement;