export default class Vector {
    constructor(e, t) {
        this.x = e,
        this.y = t
    }
    
    add(e) {
        this.x += e,
        this.y += e
    }

    divide(e) {
        this.x /= e,
        this.y /= e
    }

    multiply(e) {
        this.x *= e,
        this.y *= e
    }

    limit(e) {
        this.divide(this.length()),
        this.multiply(e)
    }

    clone() {
        return new Vector(this.x,this.y)
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    angle() {
        return Math.atan2(this.y, this.x) - Math.PI / 2
    }

    ceil(e) {
        this.x > e && (this.x = e),
        this.y > e && (this.y = e)
    }

    floor(e) {
        this.x < e && (this.x = e),
        this.y < e && (this.y = e)
    }

    both(e) {
        this.x = e,
        this.y = e
    }

    static zero() {
        return new Vector(0,0)
    }

    static diag(e) {
        return new Vector(e,e)
    }

    static create(e, t) {
        return new Vector(Math.sin(e) * t,-Math.cos(e) * t)
    }

    static createOff(e, t, n) {
        return new Vector(e.x + Math.sin(t) * n,e.y - Math.cos(t) * n)
    }
}
