const DAO = require("../dao/dao");
const Command = require("../model/command");
const WebSocketClient = require('websocket').client;

class Twitch{

    constructor(users) {
        this.connection=""
        this.client = new WebSocketClient();
        this.connectionHandler(users);

    }

/*
Csatlakozik a Twitch IRC-hez, és fogadja az üzeneteket
*/
    connectionHandler(users){

        this.client.on('connect', (connection) => {
            console.log('[CONNECTION]: WebSocket Client Connected');
            this.connection=connection;
            this.connection.sendUTF('CAP REQ :twitch.tv/membership twitch.tv/tags twitch.tv/commands');
            this.connection.sendUTF(`PASS ${process.env.OAUTH}`);
            this.connection.sendUTF(`NICK ${process.env.BOT}`);
            this.joinChannel(users)

            this.connectionClose();
            this.connectionFail();
            this.connectionMessage();
        });
        this.client.connect('ws://irc-ws.chat.twitch.tv:80');
    }

    connectionMessage(){
        this.connection.on('message', (message) => {
            if (message.type === 'utf8') {
                //console.log("[RECEIVED]: '" + message.utf8Data + "'");
                let messageTypes=this.getMessageType(message.utf8Data);
                this.typeHandler(messageTypes,message.utf8Data)
            }
        });
    }

    connectionFail(){
        this.client.on('connectFailed', (error) => {
            console.log('[CONNECTION]: Connect Error: ' + error.toString());
        });
    }

    connectionClose(){
        this.connection.on('close', () => {
            console.log('[CONNECTION]: Connection Closed');
        });
    }


    joinChannel(users){
        this.connection.sendUTF('JOIN '+users);
    }
/*
Kiszedi milyen fajta a message, amit kapunk és visszaadja az összes message type-ot,
amit tartalmaz 1 üzenetünk.
*/
    getMessageType(message){
        let data = message.split("\r\n");
        data.pop();
        let result = []
        if(data[0].startsWith("PING")){
            result.push("PING");
            return result;
        }
        for(let d of data){
            d=d.slice(d.indexOf("tmi.twitch.tv")+14)
            let messageType=d.split(" ")[0]
            result.push(messageType);
        }
        return result;
    }

/*
Megkapja milyen típusú az üzenet és eldönti mi a következő lépés
 */
    typeHandler(type,message){
        let messages=message.split("\r\n");
        messages.pop();
        for(let i=0;i<messages.length;i++){
            switch(type[i]){
                case "PRIVMSG":
                    console.log("[PRIVMSG] PRIVMSG RECEIVED")
                    let [userData,msg,channel]=this.messageHandler(messages[i])
                    this.commandHandler(userData,msg,channel)
                    break;
                case "JOIN":
                    console.log("[JOIN] JOIN RECEIVED: "+
                        messages[i].slice(messages[i].indexOf("JOIN")+5))
                    break;
                case "NOTICE":
                    console.log("[NOTICE] NOTICE RECEIVED")
                    break;
                case "PART":
                    console.log("[PART] PART RECEIVED")
                    break
                case "PING":
                    this.connection.sendUTF(message.replace("PING","PONG"));
                    console.log("[PING] PING RECEIVED")
                    break;
                case "GLOBALUSERSTATE":
                    console.log("[GLOBALUSERSTATE] GLOBALUSERSTATE RECEIVED")
                    break;
                case "ROOMSTATE":
                    console.log("[ROOMSTATE] ROOMSTATE RECEIVED")
                    break;
                case "USERSTATE":
                    console.log("[USERSTATE] USERSTATE RECEIVED")
                    break;
                case "CAP":
                    console.log("[CAP * ACK] CAP * ACK RECEIVED")
                    break;
                default:
                    console.log("["+type[i]+"] CODE RECEIVED: '" + messages[i] + "'");
                    break;
            }
        }
    }
/*
Az üzenet küldőjéről és az üzenetről ad vissza információt
 */
    messageHandler(data){
        let message=data.split("tmi.twitch.tv PRIVMSG #")[1];
        message=message.slice(message.indexOf(":")+1);
        let channel=data.split("tmi.twitch.tv PRIVMSG #")[1].split(" ")[0];
        let userData=data.split("tmi.twitch.tv PRIVMSG #")[0].split(" :")[0].split(";");
        userData.pop();
        const user=new Map();
        for(let object of userData){
            let key=object.split("=")[0];
            let value=object.split("=")[1];
            user.set(key,value);
        }
        console.log("[MESSAGE: "+channel+"]: "+user.get("display-name")+": "+message);
        return [user,message,channel];
    }

    sendMessage(channel,message){
        this.connection.sendUTF("PRIVMSG #"+channel+" :"+message);
    }
/*
A bejövő üzenetekből kiválasztja a kommandokat és választ ad a kommandokra
 */
    commandHandler(userData,message,channel){
        if(!message.startsWith("!")){
            return
        }
        let splittedMessage=message.split(" ");
        let command=splittedMessage[0];
        if(splittedMessage.length>1){
            this.adminCommands(userData,message,channel,command,splittedMessage)
        }
        else{
            this.basicCommands(channel,command)
        }
    }
/*
Átlagos nézők által beváltható, és egyszerű kommandok
 */
    basicCommands(channel,command){
        new DAO().getCommand(channel,command).then((rows)=>{
            let data = Object.values(JSON.parse(JSON.stringify(rows)));
            if(data[0]!==undefined){
                this.sendMessage(channel,data[0]["result"]);
            }

        });
    }
/*
Admin kommandok, létrehozás, változtatás, törlés
 */
    adminCommands(userData,message,channel,command,splittedMessage){
        if(userData.get("badges").indexOf("moderator")===-1 && userData.get("user-id")!==userData.get("room-id")){
            return
        }
        let channelId=userData.get("room-id");
        let workOnCmd=splittedMessage[1].startsWith("!") ? splittedMessage[1]: "!"+splittedMessage[1];
        let workOnMsg=""
        if(splittedMessage.length>2){
            workOnMsg=message.split(workOnCmd)[1];
        }
        let cmd = new Command(channelId,workOnCmd,workOnMsg)
        switch(command){
            case "!add":
                new DAO().createCommand(cmd).then(()=>{
                    console.log("[!ADD]: Successfully added: "+cmd.userid+" "+cmd.command+" "+cmd.result);
                    this.sendMessage(channel,"Successfully added: "+cmd.command);
                }).catch((err)=>{
                    console.log("[!ADD]: "+err)
                });
                break
            case "!update":
                new DAO().updateCommand(cmd).then(()=>{
                    console.log("[!UPDATE]: Successfully updated: "+cmd.userid+" "+cmd.command+" "+cmd.result);
                    this.sendMessage(channel,"Successfully updated: "+workOnCmd);
                }).catch((err)=>{
                    console.log("[!UPDATE]: "+err)
                });
                break
            case "!delete":
                new DAO().deleteCommand(cmd).then(()=>{
                    console.log("[!DELETE]: Successfully deleted: "+cmd.userid+" "+cmd.command);
                    this.sendMessage(channel,"Successfully deleted: "+cmd.command);
                }).catch((err)=>{
                    console.log("[!DELETE]: "+err)
                });
                break
            default:
                console.log("[!"+cmd.command+"]: Can't understand that command");
        }
    }
}
module.exports=Twitch;



