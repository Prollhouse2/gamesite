class RewardedChestStorage
{
    storedChests = {
        [ChestType.basic]: 0,
        [ChestType.gold]: 0,
        [ChestType.black]: 0
    };

    constructor()
    {
        this.init();
    }

    init()
    {
        this.storedChests = {
            [ChestType.basic]: 0,
            [ChestType.gold]: 0,
            [ChestType.black]: 0
        };
    }

    storeChests(chestType, quantity)
    {
        if(typeof (this.storedChests[chestType]) != "undefined")
        {
            this.storedChests[chestType] += quantity;
            return true;
        }
        return false;
    }

    grantStoredChest(chestType)
    {
        if(this.storedChests[chestType] && this.storedChests[chestType] > 0)
        {
            if(chestService.spawnChest(0, Chest.metaldetector, chestType))
            {
                chestService.presentChest(0);
                this.storedChests[chestType]--;
                return true;
            }
        }
        return false;
    }

    getStoredChestsOfType(chestType)
    {
        if(typeof (this.storedChests[chestType]) != "undefined")
        {
            return this.storedChests[chestType];
        }
        return -1;
    }

    hasUnclaimedChests()
    {
        for(var i in this.storedChests)
        {
            if(this.storedChests[i] > 0)
            {
                return true;
            }
        }
        return false;
    }

    get saveState()
    {
        var storedChestsString = btoa(JSON.stringify(this.storedChests));
        return storedChestsString
    }

    set saveState(value)
    {
        var storedChests = JSON.parse(atob(value));
        this.storeChests(0, storedChests[0]);
        this.storeChests(1, storedChests[1]);
        this.storeChests(2, storedChests[2]);
    }
}

var rewardedChestStorage = new RewardedChestStorage();