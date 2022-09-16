class Command {

    constructor(userid="",command="",result="") {
        this._userid = userid;
        this._command = command;
        this._result = result;
    }

    get userid() {
        return this._userid;
    }

    set userid(value) {
        this._userid = value;
    }

    get command() {
        return this._command;
    }

    set command(value) {
        this._command = value;
    }

    get result() {
        return this._result;
    }

    set result(value) {
        this._result = value;
    }
} module.exports=Command;