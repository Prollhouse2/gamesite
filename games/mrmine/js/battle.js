var monsterskilled = 0;
var whackosKilled = 0;
var battleWaiting = [];

var dealtDmg = [];
var takenDmg = [];

//########## BATTLE SETUP #####################################

var monsterAtkTime = 0;
var monsterAtk = 1; //adjust for hp growth rate
var monsterMaxHP = 1; //adjust for atk growth rate
var monsterHP = 1;
var activeMonster;
var depthOfMonster = 0;
function userMaxHealth()
{
    var baseHealth = 800;
    var depthBonus = depth - 300 + Math.max(((depth - 1000) * 2), 0);
    var questBonus = (numQuestsCompleted() * 3);
    var buildingBonus = (gemForgeStructure.level * 3 * oilrigStructure.level);
    var weaponBonus = 0;
    for(var i = 0; i < battleInventory.length; i++)
    {
        if(battleInventory[i].length > 7)
        {
            weaponBonus += battleInventory[i][4]
        }
    }
    return (baseHealth + weaponBonus + ((depthBonus + questBonus + buildingBonus) * 4)) * STAT.battleHealthMultiplier();
}

var atkWeps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var battleActive = false;
var userMaxHP = 1000;
var userHP = 1000;

function getEquip(E)
{
    if(E < 0 || E >= battleEquipStats.length || E == undefined)
    {
        console.warn("Attempting to grant invalid weapon");
        return;
    }
    var doesntHave = true;
    var emptySlot = 999;
    for(var Es = 0; Es < battleInventory.length; Es++)
    {
        if(battleInventory[Es].length > 0)
        {
            if(E == battleInventory[Es][0])
            {
                doesntHave = false;
                Es = 999; //exit loop check
            }
        }
        else
        {
            if(emptySlot == 999)
            {
                emptySlot = Es;
            }
        }
    }
    if(doesntHave && emptySlot < 999)
    {
        battleInventory[emptySlot] = [E, 0, 0, 0, 0, 0, 0, 0];
        makeBlueprintAvailable(2, E);
        learnBlueprint(2, E);
        newNews(_("The monster dropped a") + " " + getInventoryWeaponName(emptySlot) + "!", true);
    }
}

function hasEquip(E)
{
    var doesntHave = true;
    var emptySlot = 999;
    for(var Es = 0; Es < battleInventory.length; Es++)
    {
        if(battleInventory[Es].length > 0)
        {
            if(E == battleInventory[Es][0])
            {
                doesntHave = false;
                Es = 999; //exit loop check
            }
        }
        else
        {
            if(emptySlot == 999)
            {
                emptySlot = Es;
            }
        }
    }

    if(doesntHave && emptySlot < 999)
    {
        return false;
    }
    else
    {
        return true;
    }
}

var bossesDefeated = 0;

class battleManager
{
    monsters = [];
    bosses = [];
    eventMonsterOverrides = [];

    registerMonster(monster)
    {
        if(!monster.isBoss)
        {
            this.monsters.push(monster);
        }
        else
        {
            this.bosses.push(monster);
        }
    }

    registerEventMonster(monsterStats)
    {
        this.eventMonsterOverrides.push(monsterStats);
    }

    getMonstersAtDepth(depth)
    {
        return this.monsters.filter(monster => depth >= monster.minDepth && depth <= monster.maxDepth);
    }

    getBossLevelAsset(depth)
    {
        let boss = this.bosses.find(monster => monster.isBoss && monster.minDepth == depth && monster.maxDepth == depth);
        return boss.levelAsset;
    }

    isActiveBossLevel(depth)
    {
        for(var i = bossesDefeated; i < this.bosses.length; i++)
        {
            if(this.bosses[i].minDepth == depth)
            {
                return true;
            }
        }
        return false;
    }

    isStalledDueToBoss()
    {
        if(bossesDefeated < this.bosses.length)
        {
            if(this.bosses[bossesDefeated].minDepth <= depth)
            {
                return true;
            }
        }
        return false;
    }

    startBossBattle()
    {
        bossBattleId = bossesDefeated;
        preparebattle(true);
        isBossBattleActive = true;
    }

    depthOfDeepestBossReached()
    {
        return this.bosses[bossesDefeated].minDepth;
    }

    getMonsterToSpawn(depthToRollFor)
    {
        let possibleMonsters = this.getMonstersAtDepth(depthToRollFor);
        return possibleMonsters[rand(0, possibleMonsters.length - 1)];
    }
}
const BattleManager = new battleManager();

class monster
{
    name;
    animation;
    levelAsset;
    isBoss = false;
    minDepth;
    maxDepth;
    baseDamage;
    attackSpeed;
    baseHealth;
    possibleEquipId;
    bonusReward;

    grantReward()
    {
        if(this.isBoss) openGoldChest();
        if(this.bonusReward) this.bonusReward();
    }

    rollLevel(depthToRollFor)
    {
        let percentTowardsMaxDepth = depthToRollFor / this.maxDepth;
        let extraLevels = Math.floor(Math.random() * percentTowardsMaxDepth * 3);

        return 1 + extraLevels;
    }
}

//depth, activeMonster, name, level, rewardFunction

function grantChestCompressor()
{
    chestCompressorStructure.level = 1;
    learnBlueprint(3, 12);
    newNews(_("Discovered the Chest Compressor!"));
}

var isBossBattleActive = false;
var bossBattleId = 0;


var monstersOnLevels = [
    [[1, 1], [1, 2], [1, 2]], //300
    [[1, 2], [1, 3], [1, 3]],
    [[1, 4], [2, 1], [2, 2]],
    [[2, 1], [2, 2], [1, 3]],
    [[2, 1], [2, 2], [2, 3]],
    [[2, 2], [2, 3], [2, 1]],
    [[2, 3], [2, 3], [2, 2]],
    [[2, 3], [2, 3], [2, 3]],
    [[2, 3], [2, 3], [2, 3]],
    [[2, 4], [2, 4], [2, 4]],

    [[2, 5], [2, 5], [3, 1]], //400
    [[3, 1], [3, 2], [3, 2]],
    [[3, 1], [3, 2], [3, 2]],
    [[3, 2], [3, 2], [3, 3]],
    [[3, 3], [3, 3], [3, 3]],
    [[3, 3], [3, 1], [3, 3]],
    [[3, 3], [3, 2], [3, 3]],
    [[3, 3], [3, 3], [3, 4]],
    [[3, 4], [3, 4], [3, 4]],
    [[3, 4], [3, 4], [3, 4]],

    [[3, 5], [3, 5], [4, 1]], //500
    [[4, 1], [4, 2], [3, 2]],
    [[4, 1], [4, 2], [3, 2]],
    [[4, 2], [4, 2], [3, 3]],
    [[4, 3], [4, 3], [3, 3]],
    [[4, 3], [4, 1], [3, 3]],
    [[4, 3], [4, 2], [3, 3]],
    [[4, 3], [4, 3], [3, 4]],
    [[4, 4], [4, 4], [3, 4]],
    [[4, 4], [4, 4], [3, 4]],

    [[4, 5], [4, 5], [5, 1]], //600
    [[5, 1], [5, 2], [4, 2]],
    [[5, 1], [5, 2], [4, 2]],
    [[5, 2], [5, 2], [4, 3]],
    [[5, 3], [5, 3], [4, 3]],
    [[5, 3], [5, 1], [4, 3]],
    [[5, 3], [5, 2], [4, 3]],
    [[5, 3], [5, 3], [4, 4]],
    [[5, 4], [5, 4], [4, 4]],
    [[5, 4], [5, 4], [4, 4]],

    [[5, 5], [5, 5], [6, 1]], //700
    [[6, 1], [6, 2], [5, 2]],
    [[6, 1], [6, 2], [5, 2]],
    [[6, 2], [6, 2], [5, 3]],
    [[6, 3], [6, 3], [5, 3]],
    [[6, 3], [6, 1], [5, 3]],
    [[6, 3], [6, 2], [5, 3]],
    [[6, 3], [6, 3], [5, 4]],
    [[6, 4], [6, 4], [5, 4]],
    [[6, 4], [6, 4], [7, 1]],

    [[6, 5], [6, 5], [7, 1]], //800
    [[6, 6], [6, 6], [7, 2]],
    [[7, 1], [7, 2], [6, 6]],
    [[7, 1], [7, 2], [6, 6]],
    [[7, 2], [7, 3], [7, 1]],
    [[7, 2], [7, 3], [7, 1]],
    [[7, 3], [7, 3], [7, 2]],
    [[7, 3], [7, 3], [7, 2]],
    [[7, 4], [7, 3], [7, 3]],
    [[7, 4], [7, 4], [7, 3]],

    [[7, 4], [7, 4], [7, 4]], //900
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],
    [[7, 4], [7, 4], [7, 4]],

    [[7, 4], [7, 4], [7, 4]], //1000
    [[7, 4], [7, 4], [7, 4]],
    [[14, 1], [14, 1], [14, 1]],
    [[14, 1], [14, 2], [14, 1]],
    [[15, 1], [14, 2], [14, 3]],
    [[15, 1], [15, 1], [15, 2]],
    [[15, 1], [15, 2], [15, 3]],
    [[15, 2], [15, 3], [16, 1]],
    [[15, 3], [15, 4], [16, 1]],
    [[15, 4], [16, 1], [16, 2]],

    [[16, 1], [16, 1], [16, 2]], //1100
    [[16, 1], [16, 2], [16, 3]],
    [[16, 2], [16, 3], [17, 1]],
    [[16, 3], [17, 1], [17, 1]],
    [[17, 1], [17, 1], [17, 2]],
    [[17, 1], [17, 2], [17, 3]],
    [[17, 2], [17, 2], [17, 3]],
    [[17, 3], [17, 4], [18, 1]],
    [[17, 4], [18, 1], [18, 1]],
    [[18, 1], [18, 1], [18, 2]],

    [[18, 1], [18, 1], [18, 2]], //1200
    [[18, 1], [18, 2], [18, 2]],
    [[18, 1], [18, 2], [18, 3]],
    [[18, 2], [18, 2], [18, 3]],
    [[18, 2], [18, 3], [18, 3]],
    [[18, 2], [18, 3], [18, 4]],
    [[18, 3], [18, 3], [18, 4]],
    [[18, 3], [18, 4], [19, 1]],
    [[18, 4], [18, 4], [19, 1]],
    [[18, 5], [19, 1], [19, 2]],

    [[19, 1], [19, 1], [19, 2]], //1300
    [[19, 1], [19, 2], [19, 2]],
    [[19, 1], [19, 2], [19, 3]],
    [[19, 2], [19, 2], [19, 3]],
    [[19, 2], [19, 3], [19, 3]],
    [[19, 2], [19, 3], [19, 4]],
    [[19, 3], [19, 3], [19, 4]],
    [[19, 4], [19, 4], [27, 1]],
    [[19, 4], [19, 4], [27, 1]],
    [[19, 4], [27, 1], [27, 2]],

    [[27, 1], [27, 1], [27, 2]], //1400
    [[27, 1], [27, 2], [27, 2]],
    [[27, 1], [27, 2], [27, 3]],
    [[27, 2], [27, 2], [27, 3]],
    [[27, 2], [27, 3], [27, 3]],
    [[27, 2], [27, 3], [27, 4]],
    [[27, 3], [27, 3], [27, 4]],
    [[27, 4], [27, 4], [28, 1]],
    [[27, 4], [27, 4], [28, 1]],
    [[28, 1], [28, 2], [28, 2]],

    [[28, 1], [28, 1], [28, 2]], //1500
    [[28, 1], [28, 2], [28, 2]],
    [[28, 1], [28, 2], [28, 3]],
    [[28, 2], [28, 2], [28, 3]],
    [[28, 2], [28, 3], [28, 3]],
    [[28, 2], [28, 3], [28, 4]],
    [[28, 3], [28, 3], [28, 4]],
    [[28, 4], [28, 4], [29, 1]],
    [[28, 4], [28, 4], [29, 1]],
    [[29, 1], [29, 2], [29, 2]],

    [[29, 1], [29, 1], [29, 2]], //1600
    [[29, 1], [29, 2], [29, 2]],
    [[29, 1], [29, 2], [29, 3]],
    [[29, 2], [29, 2], [29, 3]],
    [[29, 2], [29, 3], [29, 3]],
    [[29, 2], [29, 3], [29, 4]],
    [[29, 3], [29, 3], [29, 4]],
    [[29, 4], [29, 4], [30, 1]],
    [[29, 4], [29, 4], [30, 1]],
    [[30, 1], [30, 2], [30, 2]],

    [[30, 1], [30, 1], [30, 2]], //1700
    [[30, 1], [30, 2], [30, 2]],
    [[30, 1], [30, 2], [30, 3]],
    [[30, 2], [30, 2], [30, 3]],
    [[30, 2], [30, 3], [30, 3]],
    [[30, 2], [30, 3], [30, 4]],
    [[30, 3], [30, 3], [30, 4]],
    [[30, 4], [30, 4], [30, 4]],
    [[30, 4], [30, 4], [30, 4]],
    [[30, 4], [30, 4], [30, 4]],

    [[7, 4], [7, 4], [7, 4]], //1800
    [[31, 1], [31, 1], [31, 1]],
    [[31, 1], [31, 1], [31, 1]],
    [[31, 1], [31, 1], [31, 2]],
    [[31, 1], [31, 2], [31, 2]],
    [[31, 2], [31, 2], [31, 2]],
    [[31, 2], [31, 2], [31, 3]],
    [[31, 2], [31, 3], [31, 3]],
    [[31, 3], [31, 3], [31, 3]],
    [[31, 3], [31, 4], [31, 4]],

    [[32, 1], [32, 1], [32, 2]], //1900
    [[32, 1], [32, 2], [32, 2]],
    [[32, 1], [32, 2], [32, 3]],
    [[32, 2], [32, 2], [32, 3]],
    [[32, 2], [32, 3], [32, 3]],
    [[32, 2], [32, 3], [32, 4]],
    [[32, 3], [32, 3], [32, 4]],
    [[32, 4], [32, 4], [32, 4]],
    [[32, 4], [32, 4], [32, 4]],
    [[32, 4], [32, 4], [32, 4]]
];

//done in increments of ten representing the x*10 amount after 500
//micro [monster id, monster lvl]
//macro [75%,20%,5%]

//##############################################################

function preparebattle(isBossBattle = false)
{
    if(!battleActive && !isBossBattleActive)
    {

        if(isBossBattle)
        {
            activeMonster = BattleManager.bosses[bossBattleId];
            if(activeMonster)
            {
                monsterAtk = activeMonster.baseDamage;
                monsterMaxHP = activeMonster.baseHealth;
            }
        }
        else
        {
            activeMonster = battleWaiting[2];

            if(BattleManager.eventMonsterOverrides.length > 0 && Math.random() > 0.66)
            {
                let overrideMonster = BattleManager.eventMonsterOverrides[rand(0, BattleManager.eventMonsterOverrides.length - 1)];
                Object.assign(activeMonster, overrideMonster);
            }

            let monsterLevel = activeMonster.rollLevel(battleWaiting[1]);
            monsterAtk = Math.floor(activeMonster.baseDamage * Math.pow(1.05, monsterLevel));
            monsterMaxHP = Math.floor(activeMonster.baseHealth * Math.pow(1.05, monsterLevel));
        }

        monsterAtkTime = currentTime();
        monsterHP = monsterMaxHP;
        dealtDmg = [];
        takenDmg = [];

        atkWeps = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        //battleActive = true;

        userMaxHP = userMaxHealth();
        userHP = userMaxHP;
        openUi(BattleWindow, null, activeMonster);
    }
}

function atk(x)
{
    if(battleActive && x > -1 && ((currentTime() - atkWeps[x]) >= getInventoryWeaponSpeed(x)))
    {
        atkWeps[x] = currentTime();
        var damageToDeal = Math.round(getInventoryWeaponAttack(x) * STAT.battleDamageMultiplier());
        var critChance = STAT.battleCritChance();
        var isCrit = rand(0, 100) < critChance;
        if(isCrit)
        {
            damageToDeal *= 2;
        }

        monsterHP -= damageToDeal;
        if(damageToDeal > 0)
        {
            dealtDmg.push([damageToDeal, currentTime(), isCrit]);
        }
        if(battleInventory[x][0] == 10)
        {
            userHP += (userMaxHP * .05);
            if(userHP > userMaxHP)
            {
                userHP = userMaxHP;
            }
        }
        if(battleInventory[x][0] == 11)
        {
            for(var i = 0; i < atkWeps.length; i++)
            {
                if(i != x)
                {
                    atkWeps[i] -= getInventoryWeaponSpeed(i) * 0.33;
                }
            }
        }
        if(monsterHP <= 0)
        {
            wonBattle();
        }
    }
}

function monsterAttacked()
{
    var monDmgTemp = rand(Math.ceil(monsterAtk * .5), Math.floor(monsterAtk * 1.5));
    userHP -= monDmgTemp;
    takenDmg.push([monDmgTemp, currentTime()]);
    if(userHP <= 0)
    {
        lostBattle();
    }
}

function wonBattle()
{
    //handle possible equip drops
    //end battle
    battleActive = false;
    closeUiByName("Battle");
    monsterskilled++;
    if(activeMonster && activeMonster.name == "Whacko")
    {
        whackosKilled++;
    }

    if(!isBossBattleActive)
    {
        //process drops
        var dropMultiplier = new BigNumber(Math.floor(Math.pow((depthOfMonster / depth), 2) * 100 * depthMultiplier()));
        var dropCoin = dropMultiplier.multiply(valueOfMineralsPerSecond()).multiply(60 * 60 * 3 / 100);
        trackEvent_GainedMoney(dropCoin, 5);
        addMoney(dropCoin);
        newNews(activeMonster.name + " " + _("dropped") + " $" + beautifynum(dropCoin) + "", true);

        var randomDrop = rand(0, 1000);
        if(randomDrop < 35 && activeMonster.possibleEquipId)
        {
            getEquip(activeMonster.possibleEquipId);
        }
    }
    else
    {
        trackEvent_FinishBossBattle(1);
        isBossBattleActive = false;
        bossesDefeated++;
        if(!mutebuttons) defeatBossAudio.play();
    }
    activeMonster.grantReward();
}

function lostBattle()
{
    if(isBossBattleActive)
    {
        trackEvent_FinishBossBattle(0);
    }
    newNews(_("You lost the Battle"), true);
    newNews(_("Become stronger by upgrading your weapons or finding more in chests"), true);
    battleActive = false;
    closeUiByName("Battle");
    isBossBattleActive = false;
    bossBattleId = 0;
}

function upgradeInventory(x)
{
    if(battleInventory[x].length > 2)
    {
        var currentEquipLvl = battleInventory[x][4];
        if(worldResources[OIL_INDEX].numOwned >= upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][0] &&
            money.greaterThanOrEqualTo(upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][1]) &&
            !battleInventory[x][6])
        {
            worldResources[OIL_INDEX].numOwned -= upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][0];
            subtractMoney((upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][1]));
            battleInventory[x][6] = 1;
            battleInventory[x][5] = (upgradeEquipCosts[battleInventory[x][0]][currentEquipLvl][2] * STAT.gemSpeedMultiplier());
        }
        else
        {
            newNews(_("An Error occured. Do you have enough money and oil?"));
        }
    }
}

function upgradelogic(t)
{
    /*for(var Inv = 0; Inv < battleInventory.length; Inv++)
    {
        if(battleInventory[Inv].length > 2)
        {
            if(battleInventory[Inv][6] == 1)
            {
                battleInventory[Inv][5] -= t;
                if(battleInventory[Inv][5] < 0)
                {
                    battleInventory[Inv][5] = 0;
                    battleInventory[Inv][6] = 0;

                    battleInventory[Inv][3] += upgradeEquipCosts[battleInventory[Inv][0]][battleInventory[Inv][4]][3];
                    battleInventory[Inv][2] -= upgradeEquipCosts[battleInventory[Inv][0]][battleInventory[Inv][4]][4];

                    battleInventory[Inv][4]++;

                    newNews(battleEquipStats[battleInventory[Inv][0]][3] + " " + _("Upgraded to Lvl") + " " + battleInventory[Inv][4] + "", true);
                }
            }
        }
    }*/
    oilLogic(t);
}

function battlerand()
{
    if(battleSpawnRoller.boolean(.07))
    {
        var workersAtDepth = workersHiredAtDepth(depth);
        var spawnX = battleSpawnRoller.rand(1, workersAtDepth);
        var spawnY = battleSpawnRoller.rand(Math.max(304, Math.floor(depth * .5)), depth);
        spawnBattleOnFloor(spawnY, spawnX);
    }
}

function spawnBattleOnFloor(spawnY, spawnX)
{
    if(battleWaiting.length == 0 && depth > 303 && !isDepthWithoutWorkers(spawnY))
    {
        newNews(_("Miner #{0} is being attacked at Depth {1}km!", spawnX, spawnY), true);
        battleWaiting = [spawnX, spawnY, BattleManager.getMonsterToSpawn(spawnY)];
    }
}

// MONSTERS

var newMonster = new monster();
newMonster.name = "Rocket";
newMonster.animation = new SpritesheetAnimation(monster01, 4, 4);
newMonster.minDepth = 300;
newMonster.maxDepth = 340;
newMonster.baseDamage = 12;
newMonster.attackSpeed = 1000;
newMonster.baseHealth = 70;
newMonster.possibleEquipId = 2;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Ramer";
newMonster.animation = new SpritesheetAnimation(monster02, 4, 4);
newMonster.minDepth = 330;
newMonster.maxDepth = 410;
newMonster.baseDamage = 22;
newMonster.attackSpeed = 1000;
newMonster.baseHealth = 120;
newMonster.possibleEquipId = 3;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Stoner";
newMonster.animation = new SpritesheetAnimation(monster03, 4, 4);
newMonster.minDepth = 400;
newMonster.maxDepth = 520;
newMonster.baseDamage = 30;
newMonster.attackSpeed = 1200;
newMonster.baseHealth = 270;
newMonster.possibleEquipId = 3;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "RockLord";
newMonster.animation = new SpritesheetAnimation(monster04, 4, 4);
newMonster.minDepth = 500;
newMonster.maxDepth = 620;
newMonster.baseDamage = 40;
newMonster.attackSpeed = 1200;
newMonster.baseHealth = 500;
newMonster.possibleEquipId = 4;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Ting";
newMonster.animation = new SpritesheetAnimation(monster05, 4, 4);
newMonster.minDepth = 605;
newMonster.maxDepth = 720;
newMonster.baseDamage = 60;
newMonster.attackSpeed = 1200;
newMonster.baseHealth = 500;
newMonster.possibleEquipId = 5;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Blurk";
newMonster.animation = new SpritesheetAnimation(monster06, 4, 4);
newMonster.minDepth = 700;
newMonster.maxDepth = 840;
newMonster.baseDamage = 125;
newMonster.attackSpeed = 2250;
newMonster.baseHealth = 600;
newMonster.possibleEquipId = 6;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Necro";
newMonster.animation = new SpritesheetAnimation(monster07, 4, 4);
newMonster.minDepth = 795;
newMonster.maxDepth = 1020;
newMonster.baseDamage = 200;
newMonster.attackSpeed = 1500;
newMonster.baseHealth = 600;
newMonster.possibleEquipId = 7;
BattleManager.registerMonster(newMonster);

//w2 monsters

var newMonster = new monster();
newMonster.name = "Purpa";
newMonster.animation = new SpritesheetAnimation(monster08, 4, 4);
newMonster.minDepth = 1020;
newMonster.maxDepth = 1050;
newMonster.baseDamage = 250;
newMonster.attackSpeed = 2200;
newMonster.baseHealth = 760;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Blurb";
newMonster.animation = new SpritesheetAnimation(monster09, 4, 4);
newMonster.minDepth = 1045;
newMonster.maxDepth = 1095;
newMonster.baseDamage = 275;
newMonster.attackSpeed = 2200;
newMonster.baseHealth = 1500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Blinky";
newMonster.animation = new SpritesheetAnimation(monster10, 4, 4);
newMonster.minDepth = 1090;
newMonster.maxDepth = 1135;
newMonster.baseDamage = 300;
newMonster.attackSpeed = 2200;
newMonster.baseHealth = 1500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Bulda";
newMonster.animation = new SpritesheetAnimation(monster11, 4, 4);
newMonster.minDepth = 1130;
newMonster.maxDepth = 1185;
newMonster.baseDamage = 324;
newMonster.attackSpeed = 2500;
newMonster.baseHealth = 2000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Whacko";
newMonster.animation = new SpritesheetAnimation(monster12, 4, 4);
newMonster.minDepth = 1170;
newMonster.maxDepth = 1300;
newMonster.baseDamage = 350;
newMonster.attackSpeed = 1300;
newMonster.baseHealth = 2000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Godu";
newMonster.animation = new SpritesheetAnimation(monster13, 4, 4);
newMonster.minDepth = 1280;
newMonster.maxDepth = 1390;
newMonster.baseDamage = 375;
newMonster.attackSpeed = 1500;
newMonster.baseHealth = 3000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Woobla";
newMonster.animation = new SpritesheetAnimation(monster14, 4, 4);
newMonster.minDepth = 1370;
newMonster.maxDepth = 1490;
newMonster.baseDamage = 600;
newMonster.attackSpeed = 1000;
newMonster.baseHealth = 1500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Wormer";
newMonster.animation = new SpritesheetAnimation(monster15, 4, 4);
newMonster.minDepth = 1475;
newMonster.maxDepth = 1580;
newMonster.baseDamage = 650;
newMonster.attackSpeed = 1000;
newMonster.baseHealth = 1700;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Wooblo";
newMonster.animation = new SpritesheetAnimation(monster16, 4, 4);
newMonster.minDepth = 1575;
newMonster.maxDepth = 1685;
newMonster.baseDamage = 675;
newMonster.attackSpeed = 1500;
newMonster.baseHealth = 1800;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Sploog";
newMonster.animation = new SpritesheetAnimation(monster17, 4, 4);
newMonster.minDepth = 1675;
newMonster.maxDepth = 1810;
newMonster.baseDamage = 750;
newMonster.attackSpeed = 1500;
newMonster.baseHealth = 2000;
BattleManager.registerMonster(newMonster);

//w3 monsters

var newMonster = new monster();
newMonster.name = "Razors";
newMonster.animation = new SpritesheetAnimation(monster18, 4, 4);
newMonster.minDepth = 1810;
newMonster.maxDepth = 1900;
newMonster.baseDamage = 750;
newMonster.attackSpeed = 1250;
newMonster.baseHealth = 2500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Wriggleys";
newMonster.animation = new SpritesheetAnimation(monster19, 4, 4);
newMonster.minDepth = 1900;
newMonster.maxDepth = 2000;
newMonster.baseDamage = 775;
newMonster.attackSpeed = 1250;
newMonster.baseHealth = 2500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Hooksley";
newMonster.animation = new SpritesheetAnimation(monster20, 4, 4);
newMonster.minDepth = 2000;
newMonster.maxDepth = 2100;
newMonster.baseDamage = 800;
newMonster.attackSpeed = 1250;
newMonster.baseHealth = 2500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = "Verdantis";
newMonster.animation = new SpritesheetAnimation(monster21, 4, 4);
newMonster.minDepth = 2100;
newMonster.maxDepth = 2200;
newMonster.baseDamage = 400;
newMonster.attackSpeed = 625;
newMonster.baseHealth = 2500;
BattleManager.registerMonster(newMonster);

//BOSSES

//w1 bosses

var newMonster = new monster();
newMonster.name = _("Imp Overlord");
newMonster.animation = new SpritesheetAnimation(ImpBoss, 4, 4);
newMonster.levelAsset = bossLevel1;
newMonster.isBoss = true;
newMonster.minDepth = 400;
newMonster.maxDepth = 400;
newMonster.baseDamage = 30;
newMonster.attackSpeed = 1000;
newMonster.baseHealth = 300;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("The Unnamed");
newMonster.animation = new SpritesheetAnimation(AbominationBoss, 4, 4);
newMonster.levelAsset = bossLevel2;
newMonster.isBoss = true;
newMonster.minDepth = 500;
newMonster.maxDepth = 500;
newMonster.baseDamage = 45;
newMonster.attackSpeed = 2000;
newMonster.baseHealth = 780;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Immortal Warlock");
newMonster.animation = new SpritesheetAnimation(WarlockBoss, 4, 4);
newMonster.levelAsset = bossLevel3;
newMonster.isBoss = true;
newMonster.minDepth = 600;
newMonster.maxDepth = 600;
newMonster.baseDamage = 55;
newMonster.attackSpeed = 2000;
newMonster.baseHealth = 900;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Demon Beast");
newMonster.animation = new SpritesheetAnimation(DemonBoss, 4, 4);
newMonster.levelAsset = bossLevel4;
newMonster.isBoss = true;
newMonster.minDepth = 700;
newMonster.maxDepth = 700;
newMonster.baseDamage = 65;
newMonster.attackSpeed = 2500;
newMonster.baseHealth = 950;
newMonster.bonusReward = grantChestCompressor;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Ancient Wizard");
newMonster.animation = new SpritesheetAnimation(AncientBoss, 4, 4);
newMonster.levelAsset = bossLevel5;
newMonster.isBoss = true;
newMonster.minDepth = 800;
newMonster.maxDepth = 800;
newMonster.baseDamage = 105;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 1300;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Radioactive Butcher");
newMonster.animation = new SpritesheetAnimation(RadioactiveBoss, 4, 4);
newMonster.levelAsset = bossLevel6;
newMonster.isBoss = true;
newMonster.minDepth = 900;
newMonster.maxDepth = 900;
newMonster.baseDamage = 150;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 1500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("The Infected");
newMonster.animation = new SpritesheetAnimation(ImpBoss, 4, 4);
newMonster.levelAsset = bossLevel7;
newMonster.isBoss = true;
newMonster.minDepth = 1132;
newMonster.maxDepth = 1132;
newMonster.baseDamage = 200;
newMonster.attackSpeed = 2500;
newMonster.baseHealth = 2500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("The Infector");
newMonster.animation = new SpritesheetAnimation(TheInfected, 4, 4);
newMonster.levelAsset = bossLevel8;
newMonster.isBoss = true;
newMonster.minDepth = 1232;
newMonster.maxDepth = 1232;
newMonster.baseDamage = 300;
newMonster.attackSpeed = 2700;
newMonster.baseHealth = 3500;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Zorgax - 036");
newMonster.animation = new SpritesheetAnimation(Zorgax, 4, 4);
newMonster.levelAsset = bossLevel9;
newMonster.isBoss = true;
newMonster.minDepth = 1332;
newMonster.maxDepth = 1332;
newMonster.baseDamage = 375;
newMonster.attackSpeed = 2800;
newMonster.baseHealth = 4000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Ancient Defender");
newMonster.animation = new SpritesheetAnimation(AncientDefender, 4, 4);
newMonster.levelAsset = bossLevel10;
newMonster.isBoss = true;
newMonster.minDepth = 1432;
newMonster.maxDepth = 1432;
newMonster.baseDamage = 500;
newMonster.attackSpeed = 4000;
newMonster.baseHealth = 8000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Squido");
newMonster.animation = new SpritesheetAnimation(Squido, 4, 4);
newMonster.levelAsset = bossLevel11;
newMonster.isBoss = true;
newMonster.minDepth = 1532;
newMonster.maxDepth = 1532;
newMonster.baseDamage = 500;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 9000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Lunarios");
newMonster.animation = new SpritesheetAnimation(Lunarios, 4, 4);
newMonster.levelAsset = bossLevel12;
newMonster.isBoss = true;
newMonster.minDepth = 1632;
newMonster.maxDepth = 1632;
newMonster.baseDamage = 550;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 9000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Bargo");
newMonster.animation = new SpritesheetAnimation(Bargo, 4, 4);
newMonster.levelAsset = bossLevel13;
newMonster.isBoss = true;
newMonster.minDepth = 1732;
newMonster.maxDepth = 1732;
newMonster.baseDamage = 600;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 10000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Angler");
newMonster.animation = new SpritesheetAnimation(Angler, 4, 4);
newMonster.levelAsset = bossLevel14;
newMonster.isBoss = true;
newMonster.minDepth = 1914;
newMonster.maxDepth = 1914;
newMonster.baseDamage = 600;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 10000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Muscylon");
newMonster.animation = new SpritesheetAnimation(Muscylon, 4, 4);
newMonster.levelAsset = bossLevel15;
newMonster.isBoss = true;
newMonster.minDepth = 2014;
newMonster.maxDepth = 2014;
newMonster.baseDamage = 650;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 10000;
BattleManager.registerMonster(newMonster);

var newMonster = new monster();
newMonster.name = _("Muscylon");
newMonster.animation = new SpritesheetAnimation(Muscylon, 4, 4);
newMonster.levelAsset = bossLevel15;
newMonster.isBoss = true;
newMonster.minDepth = 2114;
newMonster.maxDepth = 2114;
newMonster.baseDamage = 700;
newMonster.attackSpeed = 3000;
newMonster.baseHealth = 10000;
BattleManager.registerMonster(newMonster);