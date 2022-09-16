const Twitch = require("./twitch");
const DAO = require("./dao/dao");
const EventSub = require("./eventsub");
const express = require('express');
const UserManagement = require("./usermanagement");
require('dotenv').config()

class Index{
    constructor() {
        global.app = express();
        this.port = process.env.PORT;

        //(EVENTSUB)Need raw message body for signature verification
        app.use(express.raw({
            type: 'application/json'
        }))
        this.start();
        this.listen();
    }

    start(){
        new DAO().getUsers().then((rows) => {
            let userData = Object.values(JSON.parse(JSON.stringify(rows)));
            let result="";
            userData.forEach((object)=>{
               result+="#"+object["username"]+",";
            });
            result=result.slice(0,-1)
            console.log(result)
            global.twitch=new Twitch(result);
            new EventSub();
            new UserManagement();
        });
    }

    listen(){
        app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        })
    }

    //TODO: REGISTER USERS TO THE DATABASE
}

new Index();
