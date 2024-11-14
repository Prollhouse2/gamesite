class World
{
    //Static
    name;
    index;
    startDepth;
    endDepth;
    workerHireCosts;
    workerUpgradeCosts;
    mineralIdsToSell;
    isotopeIdsToSell;

    //Dynamic
    workersHired;
    workerLevel;

    getResources()
    {
        return getMineralsForWorld(this.index);
    }

    hasReached()
    {
        return depth >= this.startDepth;
    }

    depthReached()
    {
        return Math.min(depth - this.startDepth, this.endDepth);
    }

    //############### WORKER FUNCTIONS ###############
    workerUpgradeCost()
    {
        if(this.workerLevel >= 10) return false;
        let miner = getBlueprintById(craftingCategories.minerLevels, this.index);
        let level = miner.craftedItem.item.getCurrentLevel();
        let ingredients = getIngredientListWithDiscounts(miner.levels[level].ingredients, true);
        return ingredients[0].quantity;
    }

    canUpgradeWorkersLevel()
    {
        if(this.workerLevel >= 10) return false;
        if(this.workersHired < 10) return false;
        return money.greaterThanOrEqualTo(this.workerUpgradeCost());
    }

    upgradeWorkers()
    {
        let miner = getBlueprintById(craftingCategories.minerLevels, this.index);
        let level = miner.craftedItem.item.getCurrentLevel();
        let ingredients = getIngredientListWithDiscounts(miner.levels[level].ingredients, true);
        craftBlueprint(craftingCategories.minerLevels, this.index, level + 1, ingredients)
    }

    workerHireCost()
    {
        if(this.workersHired >= 10) return false;
        let miner = getBlueprintById(craftingCategories.miners, this.index);
        let level = miner.craftedItem.item.getCurrentLevel();
        let ingredients = getIngredientListWithDiscounts(miner.levels[level].ingredients, true)
        return ingredients[0].quantity;
    }

    canHireWorker()
    {
        if(this.workersHired >= 10) return false;
        return money.greaterThanOrEqualTo(this.workerHireCost());
    }

    hireWorker()
    {
        let miner = getBlueprintById(craftingCategories.miners, this.index);
        let level = miner.craftedItem.item.getCurrentLevel();
        let ingredients = getIngredientListWithDiscounts(miner.levels[level].ingredients, true);
        craftBlueprint(craftingCategories.miners, this.index, level + 1, ingredients)
    }
}

var worlds = [];

var earth = new World();
earth.name = "Earth";
earth.index = EARTH_INDEX;
earth.startDepth = -3;
earth.endDepth = 1031;
earth.mineralIdsToSell = [COAL_INDEX, COPPER_INDEX, SILVER_INDEX, GOLD_INDEX, PLATINUM_INDEX, DIAMOND_INDEX, COLTAN_INDEX, PAINITE_INDEX, BLACK_OPAL_INDEX, RED_DIAMOND_INDEX, BLUE_OBSIDIAN_INDEX, CALIFORNIUM_INDEX];
earth.isotopeIdsToSell = [URANIUM1_INDEX, URANIUM2_INDEX, URANIUM3_INDEX, PLUTONIUM1_INDEX, PLUTONIUM2_INDEX, PLUTONIUM3_INDEX, POLONIUM1_INDEX, POLONIUM2_INDEX, POLONIUM3_INDEX];
earth.workerLevel = 0;
earth.workersHired = 0;
earth.workerHireCosts = [new BigNumber(50),
new BigNumber(500),
new BigNumber(2000),
new BigNumber(10000),
new BigNumber(25000),
new BigNumber(75000),
new BigNumber(150000),
new BigNumber(500000),
new BigNumber(3000000),
new BigNumber(10000000),
new BigNumber(999999999999)
];
earth.workerLevelCosts = [new BigNumber(0),
new BigNumber(10000000),
new BigNumber(50000000),
new BigNumber(200000000),
new BigNumber(1000000000),
new BigNumber(6000000000),
new BigNumber(40000000000),
new BigNumber(350000000000),
new BigNumber(1000000000000),
new BigNumber(10000000000000),
new BigNumber(100000000000000)
];
worlds.push(earth);

var moon = new World();
moon.name = "Moon";
moon.index = MOON_INDEX;
moon.startDepth = 1032;
moon.endDepth = 1813;
moon.mineralIdsToSell = [CARBON_INDEX, IRON_INDEX, ALUMINUM_INDEX, MAGNESIUM_INDEX, TITANIUM_INDEX, SILICON_INDEX, PROMETHIUM_INDEX, NEODYMIUM_INDEX, YTTERBIUM_INDEX];
moon.isotopeIdsToSell = [NITROGEN1_INDEX, NITROGEN2_INDEX, NITROGEN3_INDEX, HELIUM1_INDEX, HELIUM2_INDEX, HELIUM3_INDEX, EINSTEINIUM1_INDEX, EINSTEINIUM2_INDEX, EINSTEINIUM3_INDEX, FERMIUM1_INDEX, FERMIUM2_INDEX, FERMIUM3_INDEX];
moon.workerLevel = 0;
moon.workersHired = 1;
moon.workerHireCosts = [
    new BigNumber(0),
    new BigNumber(10000000000000),
    new BigNumber(25000000000000),
    new BigNumber(100000000000000),
    new BigNumber(400000000000000),
    new BigNumber(1800000000000000),
    new BigNumber(8000000000000000),
    new BigNumber(30000000000000000),
    new BigNumber(110000000000000000),
    new BigNumber(300000000000000000),
    new BigNumber(1000000000000000000)
];
moon.workerLevelCosts = [
    new BigNumber(0),
    new BigNumber(2000000000000000000),
    new BigNumber(8000000000000000000),
    new BigNumber(20000000000000000000),
    new BigNumber(50000000000000000000),
    new BigNumber(80000000000000000000),
    new BigNumber(100000000000000000000),
    new BigNumber(140000000000000000000),
    new BigNumber(200000000000000000000),
    new BigNumber(300000000000000000000),
    new BigNumber(500000000000000000000)
];
worlds.push(moon);

var titan = new World();
titan.name = "Titan";
titan.index = TITAN_INDEX;
titan.startDepth = 1814;
titan.endDepth = 2589;
titan.mineralIdsToSell = [TIN_INDEX, SULFUR_INDEX, LITHIUM_INDEX, MANGANESE_INDEX, MERCURY_INDEX, NICKEL_INDEX, ALEXANDRITE_INDEX, BENITOITE_INDEX, COBALT_INDEX];
titan.isotopeIdsToSell = [HYDROGEN1_INDEX, HYDROGEN2_INDEX, HYDROGEN3_INDEX, OXYGEN1_INDEX, OXYGEN2_INDEX, OXYGEN3_INDEX];
titan.workerLevel = 0;
titan.workersHired = 1;
titan.workerHireCosts = [
    new BigNumber(0),
    new BigNumber(100000000000000000000),
    new BigNumber(300000000000000000000),
    new BigNumber(1000000000000000000000),
    new BigNumber(5000000000000000000000),
    new BigNumber(25000000000000000000000),
    new BigNumber(100000000000000000000000),
    new BigNumber(300000000000000000000000),
    new BigNumber(900000000000000000000000),
    new BigNumber(3000000000000000000000000),
    new BigNumber(9000000000000000000000000)
];
titan.workerLevelCosts = [
    new BigNumber(0),
    new BigNumber(20000000000000000000000000),
    new BigNumber(80000000000000000000000000),
    new BigNumber(320000000000000000000000000),
    new BigNumber(1280000000000000000000000000),
    new BigNumber(5120000000000000000000000000),
    new BigNumber(20480000000000000000000000000),
    new BigNumber(81920000000000000000000000000),
    new BigNumber(327680000000000000000000000000),
    new BigNumber(1310720000000000000000000000000),
    new BigNumber(5242880000000000000000000000000)
];
worlds.push(titan);

//#################################################
//#################### HELPERS ####################
//#################################################

function worldAtDepth(depthToCheck)
{
    for(var i = 0; i < worlds.length; i++)
    {
        if(worlds[i].startDepth <= depthToCheck && worlds[i].endDepth >= depthToCheck)
        {
            return worlds[i];
        }
    }
}

function worldBeingViewed()
{
    let mineralDisplayOffset = 3;

    return worldAtDepth(currentlyViewedDepth + mineralDisplayOffset);
}

function currentWorld()
{
    return worldAtDepth(depth);
}

function getEarth()
{
    return worlds[EARTH_INDEX];
}

function getMoon()
{
    return worlds[MOON_INDEX];
}

function getTitan()
{
    return worlds[TITAN_INDEX];
}

function getRandomMineableDepthInRange(min, max, skew = 1)
{
    let foundMineableDepth = false;
    let attempts = 0;
    let depth = biasedRand(min, max, skew);

    while(!foundMineableDepth)
    {
        attempts++;
        if(!isDepthWithoutWorkers(depth))
        {
            foundMineableDepth = true;
        }
        else if(attempts > 10)
        {
            depth = 0;
            foundMineableDepth = true;
        }
        else
        {
            depth = biasedRand(min, max, skew);
        }
    }

    return depth;
}

function isDepthWithoutWorkers(depth)
{
    return depth < 0
        || (depth >= 300 && depth < 304)
        || depth == 501
        || (depth == tradeConfig.tradingPosts[EARTH_INDEX].depth)
        || (depth > 999 && depth < 1032)
        || (depth == tradeConfig.tradingPosts[MOON_INDEX].depth)
        || (depth >= REACTOR_DEPTH && depth < REACTOR_DEPTH + 3)
        || depth == CAVE_BUILDING_DEPTH
        || (depth > 1782 && depth < 1814)
        || (depth == SUPER_MINER_DEPTH)
}

function getGlobalDepth(worldIndex, depthInWorld)
{
    var globalDepth = 0;
    for(var i = 0; i < worldIndex && i < worlds.length; ++i)
    {
        globalDepth += worlds[i].endDepth;
    }
    globalDepth += depthInWorld;
    return globalDepth;
}

function getSpecialLevelForDepth(levelDepth)
{
    if(worldConfig.specialLevels[levelDepth])
    {
        return worldConfig.specialLevels[levelDepth];
    }
    for(var i in worldConfig.specialLevels)
    {
        if(levelDepth >= worldConfig.specialLevels[i].depth && levelDepth < worldConfig.specialLevels[i].depth + worldConfig.specialLevels[i].height)
        {
            return worldConfig.specialLevels[i];
        }
    }
    return null;
}

function getSpecialLevelImageSegment(specialLevel, levelDepth)
{
    if(specialLevel == null)
    {
        return null;
    }
    else if(specialLevel.height == 1)
    {
        return specialLevel.image;
    }
    var segmentIndex = levelDepth - specialLevel.depth;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = worldConfig.levelWidth;
    canvas.height = worldConfig.levelHeight;
    context.drawImage(
        specialLevel.image,
        0,
        segmentIndex * specialLevel.image.height / specialLevel.height,
        specialLevel.image.width,
        specialLevel.image.height / specialLevel.height,
        0,
        0,
        canvas.width,
        canvas.height
    )
    var image = new Image();
    image.src = canvas.toDataURL();
    return image;
}