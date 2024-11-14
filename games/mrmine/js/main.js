class PlaysaurusPayments
{
    ready = false;
    token;

    iframeHost = "https://payments.playsaurus.com";
    iframePath = "/v1/"
    iframeFile = "popup/index.html"
    iframeSrc;

    paypalToken;
    stripeToken;
    products = [];

    popup;
    targetOrigin;

    successCallback;
    failureCallback;
    closureCallback;

    constructor()
    {
        this.iframeSrc = this.iframeHost + this.iframePath + this.iframeFile;
        window.addEventListener("message", this.receiveMessage.bind(this));
        this.targetOrigin = this.iframeHost;
        this.app = document.currentScript.getAttribute("data-app");
    }

    // PUBLIC INTERFACE

    createPopup()
    {
        var iframe = document.createElement("iframe");
        var css = document.createElement("link");
        
        iframe.src = this.iframeSrc + "?r=" + window.location.origin + "&app=" + this.app;
        iframe.id = "playsaurusPaymentsFrame";
        iframe.allow = "payment";
        iframe.classList.add("playsaurus-payments-frame");
        iframe.classList.add("playsaurus-payments-frame--hidden");
        this.popup = iframe;

        css.rel = "stylesheet";
        css.href = this.iframeHost + this.iframePath + "popup/style/iframe.css";

        document.body.appendChild(css);

        const iframePromise = new Promise((resolve, reject) => {
            iframe.addEventListener("load", function()
            {
                playsaurusPayments.ready = true;
                resolve();
            });
        });

        const cssPromise = new Promise((resolve, reject) => {
            css.addEventListener("load", function() {
                document.body.appendChild(iframe);
                resolve();
            });
        })

        return Promise.all([iframePromise, cssPromise]);
    }

    initializePaypalSandbox()
    {
        alert ("Warning: Using Paypal sandbox");
        this.initializePaypal("sb");
    }

    initializePaypal(token)
    {
        this.paypalToken = token;
        this.sendMessage({mode: "initializePaypal", token: token});
    }

    initializeStripeSandbox()
    {
        alert ("Warning: Using Stripe sandbox");
        this.initializeStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
    }

    initializeStripe(token)
    {
        this.stripeToken = token;
        this.sendMessage({mode: "initializeStripe", token: token});
    }

    registerProducts(productArray)
    {
        var startLength = this.products.length;
        productArray = [...productArray];
        for (var p of productArray)
        {
            if (typeof(p.price) === "undefined" || 
                typeof(p.name) === "undefined" ||  
                typeof(p.image) === "undefined")
            {
                throw "Error: Attempting to register invalid product"
            }
            Object.freeze(p);
            Object.seal(p);
            this.products.push(p);
        }
        // Object.defineProperty( this, "products", {
        //     value: productArray,
        //     writable: false,
        //     enumerable: true,
        //     configurable: false
        // });
        // Object.freeze(this.products);
    }

    setPurchaseSuccessCallback(callback)
    {
        this.successCallback = callback;
    }

    setPurchaseFailureCallback(callback)
    {
        this.failureCallback = callback;
    }

    setPurchaseClosureCallback(callback)
    {
        this.closureCallback = callback;
    }

    startPurchase(productIndex, token="", overrides={})
    {
        if (!this.ready)
        {
            throw "Error: Payment popup isn't loaded!";
        }

        this.token = token;
        var product = {}; 
        if (!parseInt(productIndex))
        {
            for (var i = 0; i < this.products.length; ++i)
            {
                if (this.products[i].sku == productIndex)
                {
                    productIndex = i;
                    break;
                }
            }
        }
        Object.assign(product, this.products[productIndex]);
        
        if(overrides.name) product.name = overrides.name;
        if(overrides.image) product.image = overrides.image;

        this.popup.classList.remove("playsaurus-payments-frame--hidden");
        this.popup.contentWindow.postMessage(
            {
                mode: "setProduct",
                product: product,
                token: token
            },
            this.targetOrigin
        )
    }

    hidePopup()
    {
        this.popup.classList.add("playsaurus-payments-frame--hidden");
        this.token = null;
    }

    // PRIVATE

    onPurchaseSuccess(purchaseData, token)
    {
        if (token == this.token)
        {
            this.successCallback(purchaseData, token);
        }
        else
        {
            this.failureCallback(purchaseData);
        }
        this.hidePopup();
    }

    onPurchaseClosure(purchaseData)
    {
        if (this.closureCallback)
        {
            this.closureCallback(purchaseData);
        }
        /*
        if (typeof this.closureCallback === 'function') {
            this.closureCallback(purchaseData);
        } else {
            console.error('Closure callback is not defined. Client scripts might not be updated.');
        }
        */
    }

    sendMessage(data)
    {
        if (!this.ready)
        {
            throw "Error: Payment popup isn't loaded!";
        }
        this.popup.contentWindow.postMessage(data, this.targetOrigin);
    }

    receiveMessage(e)
    {
        if (e.origin != this.targetOrigin)
        {
            return;
        }
        console.log("FROM IFRAME: ");
        console.log(e);
        switch(e.data.mode)
        {
            case "purchaseComplete":
                this.onPurchaseSuccess(e.data.product, e.data.token)
                break;
            case "close":
                if (typeof this.onPurchaseClosure === 'function') {
                    this.onPurchaseClosure(e.data.product);
                } else {
                    console.error('onPurchaseClosure is not a function');
                }
                this.hidePopup();
                break;
        }
    }

    getQueryVariable(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                if (decodeURIComponent(pair[0]) == variable) {
                    return decodeURIComponent(pair[1]);
                }
            }
            console.log('Query variable %s not found', variable);
        }
}

const playsaurusPayments = new PlaysaurusPayments();