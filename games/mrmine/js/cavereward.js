class CaveReward
{
    name;
    icon;
    caveDepth;
    locationNode;
    activateOnPickup;
    rewardAmount = 0;
    collectionTime = 60;

    isClaimed = false;
    distanceFromNode = 0;

    constructor(node)
    {
        this.locationNode = node;
    }

    pickUp()
    {
        this.locationNode = null;
    }

    drop(node)
    {
        this.locationNode = node;
    }

    grant() { }
    setRewardAmount(difficulty, nodeDepth, caveDepth) { }
    loadRewardAmount(amount) { }

    canBeCollected(drone)
    {
        // Prevent multiple drones from attempting to collect the same reward
        return !this.isClaimed;
    }

    getName() {return _(this.name);}
}

class CaveBasicChest extends CaveReward
{
    name = "Basic Chest";
    icon = caveIconBasicChest;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        chestService.spawnChest(0, Chest.cave, ChestType.basic);
        chestService.presentChest(0);
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.rewardAmount = 1;
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = parseInt(amount);
    }
}

class CaveBuff extends CaveReward
{
    name = "Buff";
    icon = caveIconBuff;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        grantStaticBuff();
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.rewardAmount = 1;
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = parseInt(amount);
    }
}

class CaveBuildingMaterials extends CaveReward
{
    name = "Building Materials";
    icon = caveIconBuildingMaterials;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        var amount = parseInt(this.rewardAmount);
        worldResources[BUILDING_MATERIALS_INDEX].numOwned += amount;
        newNews(_("You collected {0} Building Materials from a cave", amount));
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        //randomly chooses a number between 1 and your difficulty up to a max of 10
        this.rewardAmount = caveRoller.rand(1, Math.min(10, Math.ceil(difficulty)));
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = parseInt(amount);
    }

    getName()
    {
        return this.rewardAmount + "x " + _(this.name);
    }
}

class CaveGoldChest extends CaveReward
{
    name = "Gold Chest";
    icon = caveIconGoldChest;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        chestService.spawnChest(0, Chest.cave, ChestType.gold);
        chestService.presentChest(0);
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.rewardAmount = 1;
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = parseInt(amount);
    }
}

class CaveHealthPack extends CaveReward
{
    name = "Health Pack";
    icon = caveIconHealthPack;
    activateOnPickup = true;
    healAmount = 10;
    difficultyReduction = 3;

    pickUp(drone)
    {
        // if(drone.currentHealth < drone.totalHealth)
        // {
        //     this.locationNode = null;
        // }
    }

    grant(drone)
    {
        drone.currentHealth = Math.min(drone.totalHealth, drone.currentHealth + parseInt(this.rewardAmount * 4));
        drone.currentFuel = Math.min(drone.totalFuel, drone.currentFuel + parseInt(this.rewardAmount));
    }

    canBeCollected(drone)
    {
        return drone.currentHealth < drone.totalHealth || drone.currentFuel < drone.totalFuel;
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.rewardAmount = this.healAmount + (5 * Math.floor(nodeDepth / 10));
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = parseInt(amount);
    }
}

class CaveMineralPile extends CaveReward
{
    name = "Mineral Pile";
    icon = caveIconMineralPile;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        trackEvent_GainedMoney(this.rewardAmount, 3, true);
        var indexOfMineralAtCaveDepth = mineralIds.indexOf(levels[this.caveDepth][0][0]);
        var mineralToGrant = mineralIds[caveRoller.rand(Math.max(0, indexOfMineralAtCaveDepth - 2), indexOfMineralAtCaveDepth)]
        var valuePerMineral = worldResources[mineralToGrant].sellValue;
        var numMineralsToReward = this.rewardAmount.divide(valuePerMineral);
        worldResources[mineralToGrant].numOwned += parseInt(numMineralsToReward);
        newNews(_("You gained {0} x {1}", beautifynum(numMineralsToReward), worldResources[mineralToGrant].name), true);
        // grantMineralsForHour(mineralToGrant, this.rewardAmount, true);
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.caveDepth = caveDepth;
        var multiplier = Math.floor((nodeDepth + 1) * difficulty * depthMultiplier() * 100) / 100;
        var moneyMadeInTime = valueOfMineralsPerSecond().multiply(multiplier * 60);
        this.rewardAmount = new BigNumber(moneyMadeInTime);
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = new BigNumber(amount);
    }
}

class CaveMoneyBag extends CaveReward
{
    name = "Money Bag";
    icon = caveIconMoneyBag;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        trackEvent_GainedMoney(this.rewardAmount, 3);
        addMoney(this.rewardAmount);
        newNews(_("You gained ${0} from a cave", beautifynum(this.rewardAmount)), true);
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        var minimumMultiplier = (nodeDepth + 1) * 2;
        var difficultyMultiplier = Math.max(1.5, difficulty);
        var maximumMultiplier = minimumMultiplier * difficultyMultiplier * depthMultiplier();
        var multiplier = caveRoller.rand(minimumMultiplier, maximumMultiplier);
        this.rewardAmount = doBigNumberDecimalMultiplication(valueOfMineralsPerSecond(), multiplier * 60 * STAT.chestMoneyMultiplier());
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = new BigNumber(amount);
    }

    getName()
    {
        return "$" + beautifynum(this.rewardAmount);
    }
}

class CaveScientist extends CaveReward
{
    name = "Scientist";
    icon = caveIconScientist;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        if(!isActiveScientistsFull())
        {
            grantRandomScientist();
        }
        else
        {
            var scientistsToLevel = caveRoller.rand(1, 3) - 1;
            var maximumExperience = 45 * getScientistLevel(scientistsToLevel);
            var minimumExperience = Math.floor(maximumExperience / 2);
            var experienceToGrant = caveRoller.rand(minimumExperience, maximumExperience);

            activeScientists[scientistsToLevel][1] += experienceToGrant;
            newNews(_("Your scientist slots are full. {0} was granted {1} experience instead!", scientists[activeScientists[scientistsToLevel][0]].name, experienceToGrant))
        }
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth) { }

    loadRewardAmount(amount)
    {
        this.rewardAmount = parseInt(amount);
    }
}

class CaveTimelapse extends CaveReward
{
    name = "Timelapse";
    icon = caveIconTimelapse;
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        var rewardText = grantTimelapse(this.rewardAmount);
        newNews(_("You collected a {0} from a cave", rewardText));
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.rewardAmount = Math.round(Math.max(10, 1.5 * difficulty) + caveRoller.rand(0, 3));
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = parseInt(amount);
    }

    getName()
    {
        return _("{0} Minute Timelapse", this.rewardAmount);
    }
}

class CaveCandyCane extends CaveReward
{
    name = "CandyCane";
    icon = holidayCurrencyIcon; //need to set this in loader
    activateOnPickup = true;
    difficultyReduction = 0;

    grant()
    {
        if(limitedTimeEventManager.isXmas())
        {
            worldResources[HOLIDAY_RESOURCE_INDEX].numOwned++;
            newNews(_("You collected a Candy Cane from a cave"));
        }
        else
        {
            newNews(_("Unable to collect {0} the event is over", "Candy Cane"));
        }
    }

    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.rewardAmount = 1;
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = 1;
    }

    getName()
    {
        return _("Candy Cane");
    }
}

class CaveTicket extends CaveReward
{
    name = "Ticket";
    icon = smallShopTicketGold; //need to set this in loader
    activateOnPickup = false;
    difficultyReduction = 0;

    grant()
    {
        addTickets(this.rewardAmount, "cave");

        if(this.rewardAmount > 1)
        {
            newNews(_("You collected {0} tickets from a cave", this.rewardAmount));
        }
        else
        {
            newNews(_("You collected {0} ticket from a cave", this.rewardAmount));
        }
    }


    setRewardAmount(difficulty, nodeDepth, caveDepth)
    {
        this.rewardAmount = 1;
    }

    loadRewardAmount(amount)
    {
        this.rewardAmount = 1;
    }

    getName()
    {
        return _("Ticket");
    }
}

class CaveDroneReward extends CaveReward
{
    name = "Drone";
    icon = null;
    rewardAmount = -1;

    constructor(node)
    {
        super(node);
    }

    grant()
    {
        learnBlueprint(craftingCategories.drones, this.rewardAmount);
        learnBlueprint(craftingCategories.droneUpgrades, this.rewardAmount);
        newNews(_("You collected a {0} from a cave", this.getName()));
    }

    getName()
    {
        return this.name + " " + _("Blueprint");
    }

    setRewardAmount(droneId)
    {
        this.setDroneId(droneId);
    }

    loadRewardAmount(droneId)
    {
        this.setDroneId(droneId);
    }

    setDroneId(droneId)
    {
        this.rewardAmount = droneId;
        var drone = getDroneById(droneId);
        this.name = drone.translatedName;
        this.icon = drone.icon;
    }
}

function testCaveReward(rewardClass, testsToRun)
{
    let rewards = 0;

    for(var i = 0; i < testsToRun; i++)
    {
        spawnTestCaves();
        getActiveCaves().forEach(cave =>
        {
            rewards += cave.rewards.filter(reward => reward instanceof rewardClass).length;
            cave.isActive = false;
        })
    }

    let cavesSpawned = (7 * testsToRun)
    console.log("caves spawned: " + cavesSpawned);
    console.log("rewards total: " + (rewards));
    console.log("average per cave: " + (rewards / cavesSpawned));
}