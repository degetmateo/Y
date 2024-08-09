export default class Token {
    private readonly code: string;
    private expire_date: Date;

    constructor (_code: string, _expire_date: Date) {
        this.code = _code;
        this.expire_date = _expire_date;
    }

    public getCode () {
        return this.code;
    }

    public getExpireDate () {
        return this.expire_date;
    }

    public setExpireDate (_expire_date: Date) {
        this.expire_date = _expire_date;
    }
}