class BigNumber
{
    // value = coefficient * 10 ^ exponent
    coefficient;
    exponent;

    constructor(...args)
    {
        this.setValue(...args);
    }

    setValue(...args)
    {
        if(args.length == 0)
        {
            this.coefficient = 0;
            this.exponent = 0;
        }
        if(args.length == 1)
        {
            if(typeof (args[0]) == "string")
            {
                // String constructor, e.g. new BigNumber("432e2")
                var parts = args[0].toLowerCase().split("e");
                this.coefficient = parseFloat(parts[0]);
                if(parts.length > 1)
                {
                    this.exponent = parseFloat(parts[1]);
                }
                else
                {
                    this.exponent = 0;
                }
                this.normalize();
            }
            else if(typeof (args[0]) == "number")
            {
                // Number constructor, e.g. new BigNumber(43200)
                this.coefficient = args[0];
                this.exponent = 0;
                this.normalize();
            }
            else if(this.isBigNumber(args[0]))
            {
                // Copy constructor, e.g. new BigNumber(otherBigNumber)
                this.coefficient = args[0].coefficient;
                this.exponent = args[0].exponent;
            }
        }
        else if(args.length == 2)
        {
            // Coefficient + exponent constructor, e.g. new BigNumber(4.32, 2)
            this.coefficient = args[0];
            this.exponent = args[1];
            this.normalize();
        }
    }

    add(other)
    {
        if(!this.isBigNumber(other))
        {
            other = new BigNumber(other);
        }
        var result = new BigNumber(this);
        var powerDifference = result.exponent - other.exponent;
        if(powerDifference > 10)
        {
            return result;
        }
        if(powerDifference < -10)
        {
            result.coefficient = other.coefficient;
            result.exponent = other.exponent;
        }
        else if(powerDifference == 0)
        {
            result.coefficient = result.coefficient + other.coefficient;
            result.normalize();
        }
        else if(powerDifference > 0)
        {
            result.coefficient = result.coefficient * Math.pow(10, powerDifference);
            result.exponent = other.exponent;
            result.coefficient = result.coefficient + other.coefficient;
            result.normalize();
        }
        else if(powerDifference < 0)
        {
            var tempBase = other.coefficient * Math.pow(10, -powerDifference);
            result.coefficient = result.coefficient + tempBase;
            result.normalize();
        }
        return result;
    }

    addInPlace(other)
    {
        this.setValue(this.add(other));
    }

    subtract(other)
    {
        if(!this.isBigNumber(other))
        {
            other = -other;
        }
        else
        {
            other = other.negate();
        }
        return this.add(other);
    }

    subtractInPlace(other)
    {
        this.setValue(this.subtract(other));
    }

    multiply(other)
    {
        if(!this.isBigNumber(other))
        {
            other = new BigNumber(other);
        }
        var result = new BigNumber();
        result.coefficient = this.coefficient * other.coefficient;
        result.exponent = this.exponent + other.exponent;
        result.normalize();
        return result;
    }

    divide(other)
    {
        if(!this.isBigNumber(other))
        {
            other = new BigNumber(other);
        }
        var result = new BigNumber();
        result.coefficient = this.coefficient / other.coefficient;
        result.exponent = this.exponent - other.exponent;
        if(result.coefficient < 10000)
        {
            result.coefficient *= 10000;
            result.exponent = result.exponent - 4;
        }
        result.normalize();
        return result;
    }

    increment()
    {
        this.setValue(this.add(1));
        return this;
    }

    decrement()
    {
        this.setValue(this.subtract(1));
        return this;
    }

    pow(other)
    {
        var result = new BigNumber();
        result.coefficient = Math.pow(this.coefficient, other);
        result.exponent = this.exponent * other;
        result.normalize();
        return result;
    }

    invert()
    {
        return new BigNumber(1 / this.coefficient, -this.exponent);
    }

    negate()
    {
        return new BigNumber(-this.coefficient, this.exponent);
    }

    equals(other)
    {
        if(!this.isBigNumber(other))
        {
            other = new BigNumber(other);
        }
        return other.exponent == this.exponent && other.coefficient == this.coefficient;
    }

    lessThan(other)
    {
        if(!this.isBigNumber(other))
        {
            other = new BigNumber(other);
        }
        if(this.coefficient == 0)
        {
            return other.coefficient > 0;
        }
        if(other.coefficient == 0)
        {
            return this.coefficient < 0;
        }
        if((this.coefficient < 0) != (other.coefficient < 0))
        {
            return this.coefficient < other.coefficient;
        }
        var sign = this.coefficient > 0 ? 1 : -1;
        if(sign * this.exponent > sign * other.exponent)
        {
            return false;
        }
        else
        {
            if(this.exponent == other.exponent)
            {
                return this.coefficient < other.coefficient;
            }
            else
            {
                return true;
            }
        }
    }

    greaterThan(other)
    {
        if(!this.isBigNumber(other))
        {
            other = new BigNumber(other);
        }
        return other.lessThan(this);
    }

    greaterThanOrEqualTo(other)
    {
        return !this.lessThan(other);
    }

    lessThanOrEqualTo(other)
    {
        return !this.greaterThan(other);
    }

    floor()
    {
        var result = new BigNumber();
        if(this.exponent < 15 && this.exponent > -15)
        {
            result.coefficient = this.coefficient * Math.pow(10, this.exponent);
            result.coefficient = Math.floor(result.coefficient);
            result.exponent = 0;
            result.normalize();
        }
        return result;
    }

    ceiling()
    {
        var result = new BigNumber();
        if(this.exponent < 15 && this.exponent > -15)
        {
            result.coefficient = this.coefficient * Math.pow(10, this.exponent);
            result.coefficient = Math.ceil(result.coefficient);
            result.exponent = 0;
            result.normalize();
        }
        return result;
    }

    round()
    {
        var floorResult = this.floor();
        if(this.subtract(floorResult).greaterThan(0.5))
        {
            return this.ceiling();
        }
        else
        {
            return floorResult;
        }
    }

    normalize()
    {
        var exponentFraction = this.exponent - Math.floor(this.exponent);
        if(exponentFraction > 0)
        {
            // Convert fractional exponents into integers (e.g., x * 10^2.5 => (x * 10^0.5) * 10^2)
            this.coefficient *= Math.pow(10, exponentFraction);
            this.exponent -= exponentFraction;
        }
        if(this.coefficient == 0)
        {
            this.exponent = 0;
        }
        else
        {
            var absCoefficient = Math.abs(this.coefficient);
            if(absCoefficient >= 10)
            {
                var deltaExponent = Math.floor(Math.log10(absCoefficient));
                this.coefficient /= Math.pow(10, deltaExponent);
                this.exponent += deltaExponent;
            }
            else if(absCoefficient < 1)
            {
                var deltaExponent = -Math.floor(Math.log10(absCoefficient));
                this.coefficient *= Math.pow(10, deltaExponent);
                this.exponent -= deltaExponent;
            }
        }
    }

    toFloat(maxDigits = -1)
    {
        if(maxDigits > 0)
        {
            return this.coefficient * Math.pow(10, Math.min(maxDigits, this.exponent));
        }
        return this.coefficient * Math.pow(10, this.exponent);
    }

    toString()
    {
        var maxDigits = 15;
        var floatValue = Math.floor(this.toFloat(maxDigits));
        var stringValue = floatValue.toString()
        if(this.exponent > maxDigits)
        {
            stringValue += "0".repeat(this.exponent - maxDigits);
        }
        return stringValue;
    }

    isBigNumber(other)
    {
        return typeof (other) == "object" && other.constructor.name == "BigNumber";
    }

    isNaN()
    {
        var result = false;
        result = result || Number.isNaN(this.coefficient);
        result = result || Number.isNaN(this.exponent);
        result = result || !Number.isFinite(this.coefficient);
        result = result || !Number.isFinite(this.exponent);
        result = result || this.toString() == "NaN";
        result = result || this.toString() == "NaNeInfinity";
        return result;
    }
}

function testBigNumbers()
{
    var a = new BigNumber();
    var b = new BigNumber();

    // Value assignment
    a.setValue(1);
    assert(a.coefficient == 1 && a.exponent == 0);

    a.setValue(10);
    assert(a.coefficient == 1 && a.exponent == 1);

    a.setValue(0.1);
    assert(a.coefficient == 1 && a.exponent == -1);

    a.setValue(-0.1);
    assert(a.coefficient == -1 && a.exponent == -1);

    a.setValue("123456789");
    assert(a.coefficient == 1.23456789 && a.exponent == 8);

    a.setValue("432e38");
    assert(a.coefficient == 4.32 && a.exponent == 40);

    a.setValue(1.5, 10);
    assert(a.coefficient == 1.5 && a.exponent == 10);

    // Comparison
    a.setValue(1);
    b.setValue(1);
    assert(a.equals(b));
    assert(b.equals(a));

    a.setValue(123456789);
    b.setValue(1.23456789, 8);
    assert(a.equals(b));
    assert(b.equals(a));
    assert(!a.lessThan(b));
    assert(!b.lessThan(a));
    assert(!a.greaterThan(b));
    assert(!b.greaterThan(a));

    a.setValue(123);
    b.setValue(12);
    assert(!a.equals(b));
    assert(!b.equals(a));
    assert(!a.lessThan(b));
    assert(b.lessThan(a));
    assert(a.greaterThan(b));
    assert(!b.greaterThan(a));

    a.setValue(-9999999999999);
    b.setValue(1);
    assert(!a.equals(b));
    assert(!b.equals(a));
    assert(a.lessThan(b));
    assert(!b.lessThan(a));
    assert(!a.greaterThan(b));
    assert(b.greaterThan(a));

    // Arithmetic
    a.setValue(1234);
    b.setValue(200);
    assert(a.add(b).equals(1434));
    assert(a.subtract(b).equals(1034));
    assert(a.multiply(b).equals(246800));
    assert(a.divide(b).equals(6.17));
    assert(a.invert().equals(1 / 1234))
    assert(a.negate().equals(-1234))

    a.setValue(16);
    assert(a.add(14).equals(30));
    assert(a.subtract(8).equals(8));
    assert(a.multiply(4).equals(64));
    assert(a.divide(99).equals(16 / 99));
    assert(a.invert().equals(1 / 16))
    assert(a.negate().equals(-16))

    console.log("Success");
}

function enableBigIntWarnings()
{
    (function (nativeBigInt)
    {
        window.BigInt = function (...args)
        {
            console.warn("CREATING BIG INT", args);
            return nativeBigInt(...args);
        }
    })(BigInt);
}

enableBigIntWarnings();