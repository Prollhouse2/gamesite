class PurchaseHistory
{
    _history = [];

    get saveState()
    {
        return btoa(JSON.stringify(this._history));
    }

    set saveState(value)
    {
        this._history = JSON.parse(atob(value));
    }

    logPurchase(sku, price)
    {
        this._history.push(
            {
                sku: sku,
                price: price,
                timestamp: Math.floor(Date.now() / 1000)
            }
        )
    }

    getPurchases(searchCondition = null)
    {
        var purchases = [];
        if(searchCondition)
        {
            for(var i = 0; i < this._history.length; ++i)
            {
                if(searchCondition(this._history[i]))
                {
                    purchases.push(this._history[i]);
                }
            }
        }
        else
        {
            purchases = this._history;
        }

        return purchases;
    }

    toJson()
    {
        return JSON.stringify(this._history);
    }
}

var purchaseHistory = new PurchaseHistory();