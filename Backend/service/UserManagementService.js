const {default: axios} = require("axios");
const DAO = require("../dao/dao");
const User = require("../model/user");
const Twitch = require("../events/twitch");
const TwitchService = require("./TwitchService");

class UserManagementService{

    constructor() {}
    /*
    With the bearer token we can get user information
     */

    manageUser(access_token,refresh_token,id_token){
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

    createUser(user){
        new DAO().createUser(user)
            .then(()=>{
                    console.log("[MANAGEUSER]: User successfully created: #"+user.username);
                    new TwitchService().subscribeToRequiredEvents(user);
                    /*res.status(200).redirect_uri("")*/
                    //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS BEJELENTKEZVE, ÉS CSATLAKOZÁS A CHATRE REGISZTRÁCIÓKOR
                    twitch.joinChannel("#"+user.username)
                }
            ).catch((error)=>{
                if(error.toString().indexOf("Duplicate entry")===-1){
                    console.log("[MANAGEUSER]: User Creation Error: #"+error);
                    //res.status(500).redirect_uri("");
                    //TODO: WEBOLDALRA VISSZAIRÁNYÍRÁS HIBA
                    return
                }
            //NOTE: If the user already exists in the db it updates the user
            this.updateUser(user);
        });
    }
    /*
    Updates the existing user in the database
     */
    updateUser(user){
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
}module.exports=UserManagementService;