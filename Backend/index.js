const express = require('express');
const cors = require('cors');
const router = express.Router()

const Twitch = require("./events/twitch");
const DAO = require("./dao/dao");
const UserManagementController = require("./controller/UserManagementController");
const TwitchController = require("./controller/TwitchController");
require('dotenv').config()

//TODO: Make exceptions which sites can reach it
/*app.use(cors({
    origin: ['http://example.com', 'https://example.com']
}));*/


class Index{
    constructor() {
        global.app = express();
        global.router = router;
        this.port = process.env.PORT;
        app.use(cors({
            credentials: true,
            origin: ['http://localhost:8080','http://localhost:3000','https://c149-91-83-37-184.ngrok.io'],
            optionSuccessStatus:200,
        }));
        //(EVENTSUB) Need raw message body for signature verification
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
            this.setUpControllerClasses()
        });
    }

    listen(){
        app.listen(this.port, () => {
            console.log(`Example app listening at http://localhost:${this.port}`);
        })
    }

    setUpControllerClasses(){
        new UserManagementController();
        new TwitchController()
    }

    //TODO: REGISTER USERS TO THE DATABASE
}

new Index();
