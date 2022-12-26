class User{

    constructor(id="",username="",email="",picture="",access_token="",refresh_token="",id_token="") {
        this._id = id;
        this._username = username;
        this._email = email;
        this._access_token = access_token;
        this._refresh_token = refresh_token;
        this._id_token = id_token;
    }


    get picture() {
        return this._picture;
    }

    set picture(value) {
        this._picture = value;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get username() {
        return this._username;
    }

    set username(value) {
        this._username = value;
    }

    get email() {
        return this._email;
    }

    set email(value) {
        this._email = value;
    }

    get access_token() {
        return this._access_token;
    }

    set access_token(value) {
        this._access_token = value;
    }

    get refresh_token() {
        return this._refresh_token;
    }

    set refresh_token(value) {
        this._refresh_token = value;
    }

    get id_token() {
        return this._id_token;
    }

    set id_token(value) {
        this._id_token = value;
    }
} module.exports=User;