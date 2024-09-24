const ShopCategories = Object.freeze({
    FREE: 0,
    CHESTS: 1,
    BUFFS: 2,
    BUILDING_MATERIALS: 3,
    MISC: 4,
    INGAME_PURCHASE: 5
})

class ShopManager
{
    shopItems = [];

    getAvailableShopItems()
    {
        return this.shopItems.filter(shopItem => shopItem.isAvailable());
    }

    registerShopItem(shopItem)
    {
        this.shopItems.push(shopItem);
    }

}
const shopManager = new ShopManager();

class BaseShopItem
{
    categoryType;
    subtype;
    image;
    name;
    baseCost = 0;
    quantityToGrant = 1;

    //overridable functions
    getCost()
    {
        return this.baseCost;
    }

    getCurrentQuantity()
    {
        return 0;
    }

    isMaxedOut()
    {
        return false;
    }

    tooltip(x, y)
    {
        return false;
    }

    isPurchaseable()
    {
        return tickets >= this.getCost() && !this.isMaxedOut() && this.isAvailable();
    }

    onPurchase()
    {
        console.log(`purchased ${this.name} for ${this.getCost()}`);
        tickets -= this.getCost();
        trackEvent_SpentTickets(this.getCost(), this.categoryType, this.subtype);
        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
        this.grant();
    }

    grant()
    {
        newNews(_("You received {0} from the shop!", this.name));
    }

    isAvailable()
    {
        return true;
    }
}

class ChestShopItem extends BaseShopItem
{
    categoryType = ShopCategories.CHESTS;
    type;

    constructor(name, type, image, baseCost)
    {
        super();
        this.name = name;
        this.type = type;
        this.image = image;
        this.baseCost = baseCost;

        this.subtype = type;

    }

    grant()
    {
        super.grant();
        chestService.spawnChest(0, Chest.purchased, this.type);
        chestService.presentChest(0);
    }
}

class BuffShopItem extends BaseShopItem
{
    categoryType = ShopCategories.BUFFS;

    buff;
    id;
    durationSecs;
    buffAmount;

    constructor(id, durationSecs, buffAmount, baseCost)
    {
        super();
        this.id = id;
        this.durationSecs = durationSecs;
        this.buffAmount = buffAmount;
        this.baseCost = baseCost;

        this.buff = buffs.getStaticBuffById(id);
        this.name = _("{0} Buff", this.buff.name);
        this.image = this.buff.image;

        this.subtype = id;
    }

    tooltip(x, y)
    {
        buffs.showInactiveBuffTooltip(this.buff.id, x, y, this.buffAmount, this.durationSecs / 60)
    }

    grant()
    {
        super.grant();
        buffs.startBuff(this.buff.id, this.durationSecs, "Shop", this.buffAmount);
    }
}

class BuildingMaterialsShopItem extends BaseShopItem
{
    categoryType = ShopCategories.BUILDING_MATERIALS;

    constructor(name, quantity, cost)
    {
        super();
        this.name = name;
        this.image = buildingMaterials.largeIcon;
        this.quantityToGrant = quantity;
        this.baseCost = cost;

        this.subtype = quantity;
    }

    grant()
    {
        super.grant();
        buildingMaterials.numOwned += this.quantityToGrant;
    }
}

class ReducedOrangeFishShopItem extends BaseShopItem
{
    categoryType = ShopCategories.MISC;
    maxQuantity = 5;

    constructor()
    {
        super();
        this.name = _("Fast Fish");
        this.image = orangeFishIcon;
        this.baseCost = 10;

        this.subtype = 0;
    }

    getCost()
    {
        return 10 * (1 + (2 * reducedOrangeFishLevels));
    }

    getCurrentQuantity()
    {
        return reducedOrangeFishLevels;
    }

    tooltip(x, y)
    {
        let currentReduction = MAX_ORANGE_FISH_SPAWN_TIME_REDUCTION * reducedOrangeFishLevels;
        let minTime = MIN_ORANGE_FISH_SPAWN_TIME_SECONDS - currentReduction;
        let maxTime = MAX_ORANGE_FISH_SPAWN_TIME_SECONDS - currentReduction;
        let averageTime = ((minTime + maxTime) / 2);

        let flattendBaseReduction = MAX_ORANGE_FISH_SPAWN_TIME_REDUCTION / 60 / 60

        showUpdatingTooltip(() => {return {"header": this.name, "body": _("Permanently reduces the Orange Fish's average respawn time by {0} hours<br><br>Current Average: {1}", flattendBaseReduction, shortenedFormattedTime(averageTime))}},
            x + (mainw * .05),
            y,
        )
    }

    grant()
    {
        super.grant();
        reducedOrangeFishLevels++;
        secondsSinceOrangeFishSpawn += MAX_ORANGE_FISH_SPAWN_TIME_REDUCTION;
    }

    isMaxedOut()
    {
        return reducedOrangeFishLevels >= this.maxQuantity;
    }

    isAvailable()
    {
        return orangeFishCollected >= 1;
    }
}

class DroneReturnOnFullShopItem extends BaseShopItem
{
    categoryType = ShopCategories.MISC;

    constructor()
    {
        super();
        this.name = _("Know when to stop");
        this.image = groundDrone1_icon;
        this.baseCost = 50;
        this.maxQuantity = 1;

        this.subtype = 1;
    }

    grant()
    {
        super.grant();
        dronesReturnOnFull = true;
    }

    isAvailable()
    {
        return depth >= 45;
    }

    isMaxedOut()
    {
        return dronesReturnOnFull;
    }

    tooltip(x, y)
    {
        showUpdatingTooltip(() => {return {"header": this.name, "body": _("Basic drones will always turn around when their inventory is full.")}},
            x,
            y,
        )
    }
}

class SeeHiddenExcavationsShopItem extends BaseShopItem
{
    categoryType = ShopCategories.MISC;

    constructor()
    {
        super();
        this.name = _("Illuminating Crown");
        this.image = crown;
        this.baseCost = 50;
        this.maxQuantity = 1;

        this.subtype = 2;
    }

    grant()
    {
        super.grant();
        displayHiddenExcavations = true;
    }

    isAvailable()
    {
        return hasUnlockedScientists;
    }

    isMaxedOut()
    {
        return displayHiddenExcavations;
    }

    tooltip(x, y)
    {
        showUpdatingTooltip(() => {return {"header": this.name, "body": _("Scientist excavations are always displayed and never hidden.")}},
            x,
            y,
        )
    }
}



class MobileAdReward extends BaseShopItem
{
    categoryType = ShopCategories.FREE;

    //STATIC
    maxRewardsAvailable = 3;
    fullRefreshPeriodsHours = 24;
    hoursBetweenSingleAdRefresh = this.fullRefreshPeriodsHours / this.maxRewardsAvailable;
    msBetweenSingleAdRefresh = (1000 * 60 * 60 * this.hoursBetweenSingleAdRefresh);

    constructor()
    {
        super()
        this.name = _("Mystery Chest")
        this.image = mystery
        this.baseCost = 0;
        this.possibleRewards = [
            {
                reward: new ChestShopItem(_("Basic Chest"), ChestType.basic, basicChestIconClosed, 1),
                chance: () => .74,
            },
            {
                reward: new ChestShopItem(_("Gold Chest"), ChestType.gold, goldChestIconClosed, 10),
                chance: () => .19,
            },
            {
                reward: new ChestShopItem(_("Ethereal Chest"), ChestType.black, blackChestIconClosed, 30),
                chance: () => .07
            }
        ]

        this.adsAvailable = this.maxRewardsAvailable;
        this.lastAdWatched = Date.now() - (this.msBetweenSingleAdRefresh * this.maxRewardsAvailable);
        this.lastRefresh = this.lastAdWatched;

        this.subtype = 0;
    }


    selectRandomReward()
    {
        let cumulativeWeights = [];
        let totalWeight = 0;
        for(let i = 0; i < this.possibleRewards.length; i++)
        {
            totalWeight += this.possibleRewards[i].chance();
            cumulativeWeights[i] = totalWeight;
        }

        var rand = Math.random();

        for(var i = 0; i < cumulativeWeights.length; i++)
        {
            if(rand <= cumulativeWeights[i])
            {
                return this.possibleRewards[i].reward;
            }
        }
    }

    grant()
    {
        this.selectRandomReward().grant();
        this.adsAvailable--;

        if(this.adsAvailable == this.maxRewardsAvailable - 1) 
        {
            this.lastRefresh = Date.now();
        }
    }

    update()
    {
        if(this.adsAvailable != this.maxRewardsAvailable)
        {
            let time = Date.now()
            let timeSinceRefresh = time - this.lastRefresh;
            let adsToRefresh = Math.floor(timeSinceRefresh / this.msBetweenSingleAdRefresh);

            if(adsToRefresh > 0)
            {
                console.log(adsToRefresh);
                this.adsAvailable = Math.min(this.maxRewardsAvailable, this.adsAvailable + adsToRefresh)
                this.lastRefresh = time;
            }
        }
    }

    isPurchaseable()
    {
        return this.adsAvailable > 0;
    }

    get saveState()
    {
        return [this.adsAvailable, this.timeSinceRefresh, this.lastRefresh].join("*");
    }

    set saveState(value)
    {
        if(value != "")
        {
            var saveArray = value.split("*");
            this.adsAvailable = parseInt(saveArray[0]);
            this.timeSinceRefresh = parseInt(saveArray[1]);
            this.lastRefresh = parseInt(saveArray[2]);
        }
    }

    isAvailable()
    {
        return isMobile() && adManager.isReady() && earth.workersHired > 0;
    }
}

var mobileAdReward = new MobileAdReward();
shopManager.registerShopItem(mobileAdReward);
shopManager.registerShopItem(new ChestShopItem(_("Basic Chest"), ChestType.basic, basicChestIconClosed, 1));
shopManager.registerShopItem(new ChestShopItem(_("Gold Chest"), ChestType.gold, goldChestIconClosed, 10));
shopManager.registerShopItem(new ChestShopItem(_("Ethereal Chest"), ChestType.black, blackChestIconClosed, 30));
shopManager.registerShopItem(new BuildingMaterialsShopItem(_("{0} Building Materials", 10), 10, 2));
shopManager.registerShopItem(new BuildingMaterialsShopItem(_("{0} Building Materials", 50), 50, 9));
shopManager.registerShopItem(new BuildingMaterialsShopItem(_("{0} Building Materials", 100), 100, 17));
shopManager.registerShopItem(new BuffShopItem(0, 60 * 60, 100, 2));
shopManager.registerShopItem(new BuffShopItem(1, 60 * 60, 100, 6));
shopManager.registerShopItem(new ReducedOrangeFishShopItem());
shopManager.registerShopItem(new DroneReturnOnFullShopItem());
shopManager.registerShopItem(new SeeHiddenExcavationsShopItem());
