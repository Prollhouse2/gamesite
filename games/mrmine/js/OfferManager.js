class OfferManager
{
    gameId = "mrmine";
    _isEnabled = true;

    currentOffer = null;
    isOfferLocked = false;

    lastRequestTime = 0;
    lastOfferStartTime = 0;
    lastOfferEndTime = 0;
    offerHistory = [];
    nextRequestTime = 0;

    hasSeenOffer = false;
    hasCheckedDeviceValue = false;

    logDebugMessages = false;
    requireStore = true;

    availableRewards = {
        tickets: {
            image: smallShopTicketGold,
            name: _("Tickets"),
            grant: function (quantity)
            {
                addTickets(quantity, "bundle");
                newNews(_("You got {0} Tickets!", quantity));
            }
        },
        basicChest: {
            image: basicChestIconClosed,
            name: _("Basic Chest"),
            grant: function (quantity)
            {
                rewardedChestStorage.storeChests(ChestType.basic, quantity);
            }
        },
        goldChest: {
            image: goldChestIconClosed,
            name: _("Gold Chest"),
            grant: function (quantity)
            {
                rewardedChestStorage.storeChests(ChestType.gold, quantity);
            }
        },
        blackChest: {
            image: blackChestIconClosed,
            name: _("Ethereal Chest"),
            grant: function (quantity)
            {
                rewardedChestStorage.storeChests(ChestType.black, quantity);
            }
        },
        buildingMaterials: {
            image: buildingMaterialsIcon,
            name: _("Building Materials"),
            grant: function (quantity)
            {
                worldResources[BUILDING_MATERIALS_INDEX].numOwned += quantity;
                newNews(_("You got {0} Building Materials!", quantity));
            }
        },
    };

    offerSaveDataMap = {
        id: {index: 0},
        sku: {index: 1},
        name: {index: 2},
        image: {index: 3, loadFunction: (src) => {var img = new Image(); img.src = src; return img;}, saveFunction: (img) => img.src},
        price: {index: 4, loadFunction: parseInt},
        valueDescription: {index: 5},
        rewards: {index: 6, loadFunction: (x) => JSON.parse(atob(x)), saveFunction: (x) => btoa(JSON.stringify(x))},
        duration: {index: 7, loadFunction: parseInt},
        startTime: {index: 8, loadFunction: parseInt},
        languageCode: {index: 9},
        name_en: {index: 10},
        valueDescription_en: {index: 11},
        steamItemId: {index: 12, loadFunction: (value) => {if(value == "") return null; return value;}}
    };

    offerUrl = "https://offers.playsaurus.com/";
    offerRequestEndpoint = "requestoffer.php";
    offerTranslationEndpoint = "gettranslatedtext.php";
    logEventEndpoint = "logevent.php";
    getValueEndpoint = "getdevicevalue.php";

    constructor()
    {
        this.init();
    }

    init()
    {
        if(!this.isEnabled())
        {
            return false;
        }
        this.currentOffer = null;

        this.lastRequestTime = 0;
        this.lastOfferStartTime = 0;
        this.offerHistory = [];
        this.nextRequestTime = 0;

        this.initRewards();
        return true;
    }

    initRewards()
    {
        this.availableRewards.minerSpeedPotionBuff = new BuffShopItem(0, 60, 100, 2);
        this.availableRewards.keyOfLuckBuff = new BuffShopItem(1, 60, 100, 6);
        this.availableRewards.fastFish = new ReducedOrangeFishShopItem();
        this.availableRewards.droneReturnUpgrade = new DroneReturnOnFullShopItem();
        this.availableRewards.seeHiddenExcavations = new SeeHiddenExcavationsShopItem();
    }

    update()
    {
        if(!this.isEnabled())
        {
            return false;
        }
        if(this.isOfferExpired())
        {
            this.clearOffer();
        }
        if(this.isReadyForOffer())
        {
            this.requestOffer();
        }
        return true;
    }

    requestOffer()
    {
        if(!this.isEnabled() || (this.requireStore && !this.isStoreReady()))
        {
            return false;
        }
        if(this.nextRequestTime > Math.floor(Date.now() / 1000))
        {
            return false;
        }
        if(Math.floor(Date.now() / 1000) - this.lastRequestTime < this.getTimeBetweenRequests())
        {
            return false;
        }
        this.lastRequestTime = Math.floor(new Date().getTime() / 1000);
        this.offer = null;
        ajax(
            this.offerUrl + this.offerRequestEndpoint,
            this.getRequestParams(),
            "GET",
            function (responseJson)
            {
                var response = JSON.parse(responseJson);
                if(this.logDebugMessages)
                {
                    console.log(response);
                }
                if(response.code == 200)
                {
                    if(response.data.offer)
                    {
                        this.updateOffer(response.data.offer);
                    }
                    else if(response.data.nextOfferAvailable)
                    {
                        this.nextRequestTime = Math.floor(Date.now() / 1000) + response.data.nextOfferAvailable;
                    }
                    else
                    {
                        this.nextRequestTime = Math.floor(Date.now() / 1000) + this.getTimeBetweenRequests();
                    }
                }
            }.bind(this)
        );
        return true;
    }

    getRequestParams()
    {
        return {
            gameId: this.gameId,
            uid: UID,
            lastOfferStartTime: this.lastOfferStartTime,
            lastOfferEndTime: this.lastOfferEndTime,
            offerHistory: JSON.stringify(this.offerHistory),
            platform: platformName(),
            gameStateInfo: JSON.stringify(this.getGameStateInfo()),
            purchaseHistory: purchaseHistory.toJson(),
            device: JSON.stringify(this.getDeviceInfo()),
            adConversionData: JSON.stringify(this.getAdConversionData())
        }
    }

    getGameStateInfo()
    {
        var tempCentsSpent = centsSpent;
        if(!tempCentsSpent)
        {
            tempCentsSpent = 0;
        }
        return {
            depth: depth,
            money: money.toString(),
            buildingMaterials: worldResources[BUILDING_MATERIALS_INDEX].numOwned,
            totalBuildingMaterialsNeeded: getTotalBuildingMaterialsNeeded(),
            minBuildingMaterialsNeeded: getBuildingMaterialsNeededForOneUpgrade(),
            superMinerSouls: worldResources[SUPER_MINER_SOULS_INDEX].numOwned,
            superMinerCount: superMinerManager.currentSuperMiners.length,
            superMinerSlots: superMinerManager.slots,
            centsSpent: tempCentsSpent,
            playtime: playtime,
            gameVersion: version
        }
    }

    getDeviceInfo()
    {
        if(typeof (device) != "undefined")
        {
            var screenWidth = Math.floor(window.screen.width * window.devicePixelRatio);
            var screenHeight = Math.floor(window.screen.height * window.devicePixelRatio);
            return {
                manufacturer: device.manufacturer,
                model: device.model,
                os: device.platform,
                osVersion: device.version,
                screenWidth: screenWidth,
                screenHeight: screenHeight
            }
        }
        return null;
    }

    getAdConversionData()
    {
        if(typeof (appsFlyer) != "undefined")
        {
            return appsFlyer.conversionData;
        }
        return {};
    }

    updateOffer(newOffer)
    {
        if(!this.isEnabled())
        {
            return false;
        }
        this.hasSeenOffer = false;
        this.currentOffer = newOffer;
        this.currentOffer.image = new Image();
        this.currentOffer.image.src = newOffer.imageUrl;
        this.currentOffer.languageCode = getLanguageCode(languageOverride);
        this.lastOfferStartTime = Math.floor(Date.now() / 1000);
        this.lastOfferEndTime = this.lastOfferStartTime + newOffer.duration;
        this.offerHistory.push(newOffer.id);
        if(platform.registerSinglePurchasePack)
        {
            platform.registerSinglePurchasePack(newOffer.sku, newOffer.name, newOffer.image.src, newOffer.price);
            if(typeof (store) != "undefined" && store.update)
            {
                store.update();
            }
        }
        return true;
    }

    purchaseOffer()
    {
        if(!this.isEnabled())
        {
            return false;
        }
        this.lockOffer();
        if(this.requireStore)
        {
            return platform.buyPack(this.currentOffer.sku);
        }
        else
        {
            return this.completePurchase();
        }
    }

    grantRewards()
    {
        if(!this.isEnabled())
        {
            return false;
        }
        for(var i in this.currentOffer.rewards)
        {
            this.availableRewards[i].grant(this.currentOffer.rewards[i])
        }
        return true;
    }

    completePurchase()
    {
        if(!this.isEnabled())
        {
            return false;
        }
        this.grantRewards();
        if(typeof (purchaseHistory) != "undefined")
        {
            purchaseHistory.logPurchase(
                this.currentOffer.sku,
                this.currentOffer.price
            );
        }
        centsSpent += this.currentOffer.price;
        logRevenue(this.currentOffer.sku);
        if(typeof (appsFlyer) != "undefined")
        {
            try
            {
                appsFlyer.logPurchase(this.currentOffer.sku, this.currentOffer.price / 100);
            }
            catch(e) { }
        }
        trackEvent_MadePurchase(this.currentOffer.sku, this.currentOffer.price);
        this.logPurchase();
        this.unlockOffer();
        this.clearOffer();
        closeUiByName("offerWindow");
        return true;
    }

    clearOffer()
    {
        if(!this.isOfferLocked)
        {
            this.currentOffer = null;
        }
    }

    isReadyForOffer()
    {
        if(!this.isEnabled())
        {
            return false;
        }
        return !this.currentOffer;
    }

    isOfferExpired()
    {
        if(!this.isEnabled())
        {
            return false;
        }
        if(this.currentOffer)
        {
            return this.getTimeRemainingForOffer() <= 0;
        }
        return false;
    }

    getTimeBetweenRequests()
    {
        if(this.offerHistory.length == 0)
        {
            return 600;
        }
        return 3600;
    }

    updateOfferLanguage(newLanguageCode = "")
    {
        if(!this.isEnabled() || (this.requireStore && !this.isStoreReady()) || !this.currentOffer)
        {
            return false;
        }
        if(newLanguageCode == "")
        {
            newLanguageCode = getLanguageCode(languageOverride);
        }
        var textToTranslate = JSON.stringify({
            name: this.currentOffer.name_en,
            valueDescription: this.currentOffer.valueDescription_en
        });
        ajax(
            this.offerUrl + this.offerTranslationEndpoint,
            {
                gameId: this.gameId,
                languageCode: newLanguageCode,
                textToTranslate: textToTranslate
            },
            "GET",
            function (responseJson)
            {
                var response = JSON.parse(responseJson);
                if(this.logDebugMessages)
                {
                    console.log(response);
                }
                if(response.code == 200)
                {
                    if(response.data.translatedText)
                    {
                        for(var key in response.data.translatedText)
                        {
                            this.currentOffer[key] = response.data.translatedText[key];
                        }
                    }
                    this.currentOffer.languageCode = newLanguageCode;
                }
            }.bind(this)
        );
        return true;
    }

    getOfferPriceCents()
    {
        return this.currentOffer.price;
    }

    getOfferPriceString()
    {
        if(this.isEnabled() && this.requireStore && this.isStoreReady() && isMobile())
        {
            return platform.getPackPrice(this.currentOffer.sku);
        }
        else if(this.requireStore)
        {
            return "$" + Math.ceil(this.currentOffer.price) / 100;
        }
        else if(!this.requireStore)
        {
            return "$0.00";
        }
    }

    getOfferLongDescription()
    {
        var description = "";
        if(this.isEnabled() && this.requireStore && this.isStoreReady())
        {
            description = this.currentOffer.name;
            var rewards = [];
            for(var i in this.currentOffer.rewards)
            {
                rewards.push(this.currentOffer.rewards[i] + "x " + this.availableRewards[i].name);
            }
            description += " - " + rewards.join(", ");
        }
        return description;
    }

    getTimeRemainingForOffer()
    {
        if(this.isEnabled() && this.currentOffer)
        {
            var now = Math.floor(Date.now() / 1000);
            return this.lastOfferStartTime + this.currentOffer.duration - now;
        }
        return 0;
    }

    getCurrentOffer()
    {
        if(!this.isEnabled())
        {
            return null;
        }
        if(!this.requireStore || this.isStoreReady())
        {
            return this.currentOffer;
        }
        return null;
    }

    getReward(rewardId)
    {
        if(this.availableRewards[rewardId])
        {
            return this.availableRewards[rewardId];
        }
        console.error("Attempting to access invalid reward '%s'", rewardId);
        return null;
    }

    getRewardName(rewardId)
    {
        if(this.availableRewards[rewardId])
        {
            return this.availableRewards[rewardId].name;
        }
        console.error("Attempting to access invalid reward '%s'", rewardId);
        return "ERROR";
    }

    getRewardImage(rewardId)
    {
        if(this.availableRewards[rewardId])
        {
            return this.availableRewards[rewardId].image;
        }
        console.error("Attempting to access invalid reward '%s'", rewardId);
        return closei;
    }

    getRewardPurchaseFunction(rewardId)
    {
        if(this.availableRewards[rewardId])
        {
            return this.availableRewards[rewardId].grant;
        }
        console.error("Attempting to access invalid reward '%s'", rewardId);
        return function () { };
    }

    isStoreReady()
    {
        return !isMobile() || typeof (store) != "undefined"
    }

    isEnabled()
    {
        return this._isEnabled && platform.domain != "armorgames";
    }

    lockOffer()
    {
        this.isOfferLocked = true;
    }

    unlockOffer()
    {
        this.isOfferLocked = false;
    }

    logPurchase()
    {
        var requestParams = this.getRequestParams();
        requestParams.eventData = JSON.stringify({
            eventKey: "purchase",
            offerId: this.currentOffer.id
        });
        ajax(
            this.offerUrl + this.logEventEndpoint,
            requestParams,
            "GET"
        );
    }

    logClick()
    {
        if(this.hasSeenOffer)
        {
            return;
        }
        var requestParams = this.getRequestParams();
        requestParams.eventData = JSON.stringify({
            eventKey: "click",
            offerId: this.currentOffer.id
        });
        ajax(
            this.offerUrl + this.logEventEndpoint,
            requestParams,
            "GET"
        );

        trackEvent_ViewedOffer(this.currentOffer.sku);
    }

    logDeviceValue()
    {
        if(!this.hasCheckedDeviceValue && isMobile() && typeof (appsFlyer) != "undefined")
        {
            var deviceInfo = this.getDeviceInfo();
            ajax(
                this.offerUrl + this.getValueEndpoint,
                {device: JSON.stringify(this.getDeviceInfo())},
                "GET",
                function (responseJson)
                {
                    var response = JSON.parse(responseJson);
                    if(this.logDebugMessages)
                    {
                        console.log(response);
                    }
                    if(response.code == 200)
                    {
                        this.hasCheckedDeviceValue = true;
                        if(response.data.value && response.data.value >= 300)
                        {
                            appsFlyer.logEvent("highValueDevice", {value: response.data.value, device: deviceInfo})
                        }
                    }
                }.bind(this)
            );
        }
    }

    get saveState()
    {
        var offerSaveArray = [];
        if(this.currentOffer)
        {
            for(var key in this.offerSaveDataMap)
            {
                if(this.offerSaveDataMap[key].saveFunction)
                {
                    offerSaveArray[this.offerSaveDataMap[key].index] = this.offerSaveDataMap[key].saveFunction(this.currentOffer[key]);
                }
                else if(typeof (this.currentOffer[key]) != "undefined")
                {
                    offerSaveArray[this.offerSaveDataMap[key].index] = this.currentOffer[key];
                }
                else
                {
                    offerSaveArray[this.offerSaveDataMap[key].index] = null;
                }
            }
        }
        var saveArray = [
            this.lastOfferStartTime,
            this.offerHistory.join(".!"),
            offerSaveArray.join(".!"),
            "X",
            this.nextRequestTime,
            this.hasSeenOffer,
            this.hasCheckedDeviceValue
        ];
        return saveArray.join(".*.");
    }

    set saveState(value)
    {
        var valueArray = value.split(".*.");
        this.lastOfferStartTime = parseInt(valueArray[0]);
        if(isNaN(this.lastOfferStartTime))
        {
            this.lastOfferStartTime = 0;
        }

        var offerHistory = valueArray[1].split(".!");
        if(offerHistory.length == 1 && offerHistory[0] == "")
        {
            this.offerHistory = [];
        }
        else
        {
            this.offerHistory = offerHistory;
        }

        var offerArray = valueArray[2].split(".!");
        if(offerArray.length == 1 && offerArray[0] == "")
        {
            this.offerArray = null;
        }
        else
        {
            this.currentOffer = {};
            for(var key in this.offerSaveDataMap)
            {
                this.currentOffer[key] = offerArray[this.offerSaveDataMap[key].index];
                if(this.offerSaveDataMap[key].loadFunction)
                {
                    this.currentOffer[key] = this.offerSaveDataMap[key].loadFunction(this.currentOffer[key]);
                }
            }
        }

        this.nextRequestTime = parseInt(valueArray[4]);
        this.hasSeenOffer = valueArray[5] == "true";
        this.hasCheckedDeviceValue = valueArray.length >= 7 && valueArray[6] == "true";

        if(this.currentOffer && getLanguageCode(languageOverride) != this.currentOffer.languageCode)
        {
            this.updateOfferLanguage(getLanguageCode(languageOverride));
        }

        if(this.currentOffer && platform.registerSinglePurchasePack)
        {
            platform.registerSinglePurchasePack(this.currentOffer.sku, this.currentOffer.name, this.currentOffer.image.src, this.currentOffer.price);
            if(typeof (store) != "undefined" && store.update)
            {
                store.update();
            }
        }

        this.logDeviceValue();

        if(valueArray[3].length > 1)
        {
            // Migrate old chest storage to new system
            var storedChests = JSON.parse(atob(valueArray[3]));
            rewardedChestStorage.storeChests(0, storedChests[0]);
            rewardedChestStorage.storeChests(1, storedChests[1]);
            rewardedChestStorage.storeChests(2, storedChests[2]);
        }
    }
}

var offerManager = new OfferManager();