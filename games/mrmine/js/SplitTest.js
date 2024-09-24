/*
Split test values are randomly pulled from the options array
Tests are run at game start after game loads
Change the latestTestNumber value in app.js to
Do not remove existing test values from runSplitTestSetup()
*/
var splitTestValue1Options = [0, 10, 11, 12];
var splitTestValue1 = splitTestValue1Options[rand(0, splitTestValue1Options.length - 1)];
//The below no longer runs
function runSplitTestSetup()
{
    //###### Split Test 1 ######
    switch(splitTestValue1)
    {
        case 0:
            //do nothing (base case)
            break;
        case 1:
            //change starting minerals (slightly with sudden ramp)
            levels[0] = [[1, 200]];
            levels[1] = [[1, 305]];
            levels[2] = [[1, 510]];
            levels[3] = [[1, 535]];
            levels[4] = [[1, 550], [2, 20]];
            levels[5] = [[1, 500], [2, 70]];
            levels[6] = [[1, 487], [2, 100]];
            levels[7] = [[1, 500], [2, 150]];
            levels[8] = [[1, 510], [2, 250], [3, 1]];
            levels[9] = [[1, 520], [2, 200], [3, 2]];
            levels[10] = [[1, 530], [2, 216], [3, 5]];
            levels[11] = [[1, 540], [2, 253], [3, 10]];
            levels[12] = [[1, 550], [2, 290], [3, 10], [4, 2]];
            levels[13] = [[1, 560], [2, 300], [3, 20], [4, 1]];
            levels[14] = [[1, 570], [2, 335], [3, 21], [4, 1]];
            levels[15] = [[1, 580], [2, 360], [3, 32]];
            levels[16] = [[1, 100], [2, 330], [3, 190]];
            levels[17] = [[2, 480], [3, 230], [4, 2]];
            levels[18] = [[2, 480], [3, 280], [4, 10]];
            levels[19] = [[2, 490], [3, 310], [4, 10]];
            break;
        case 2:
            //change starting minerals (more)
            levels[0] = [[1, 500]];
            levels[1] = [[1, 505]];
            levels[2] = [[1, 510]];
            levels[3] = [[1, 535]];
            levels[4] = [[1, 550], [2, 50]];
            levels[5] = [[1, 570], [2, 60]];
            levels[6] = [[1, 587], [2, 90]];
            levels[7] = [[1, 600], [2, 110]];
            levels[8] = [[1, 610], [2, 160], [3, 3]];
            levels[9] = [[1, 620], [2, 180], [3, 5]];
            levels[10] = [[1, 630], [2, 216], [3, 7]];
            levels[11] = [[1, 640], [2, 253], [3, 5]];
            levels[12] = [[1, 650], [2, 290], [3, 2], [4, 4]];
            levels[13] = [[1, 660], [2, 300], [3, 2], [4, 2]];
            levels[14] = [[1, 670], [2, 335], [3, 50], [4, 2]];
            levels[15] = [[1, 680], [2, 360], [3, 52]];
            levels[16] = [[1, 200], [2, 330], [3, 290]];
            levels[17] = [[2, 580], [3, 230], [4, 4]];
            levels[18] = [[2, 580], [3, 280], [4, 16]];
            levels[19] = [[2, 590], [3, 310], [4, 20]];
            break;
        case 3:
            //change starting hire cost
            getEarth().workerHireCosts[0] = new BigNumber(20);
            getEarth().workerHireCosts[1] = new BigNumber(250);
            break;
        case 4:
            //change starting hire cost
            getEarth().workerHireCosts[0] = new BigNumber(30);
            getEarth().workerHireCosts[1] = new BigNumber(250);
            break;
        case 5:
            //change level difficulty for early levels
            depthDifficultyTable[0] = new BigNumber(120);
            depthDifficultyTable[1] = new BigNumber(120);
            depthDifficultyTable[2] = new BigNumber(120);
            depthDifficultyTable[3] = new BigNumber(130);
            depthDifficultyTable[4] = new BigNumber(155);
            depthDifficultyTable[5] = new BigNumber(190);
            depthDifficultyTable[6] = new BigNumber(220);
            depthDifficultyTable[7] = new BigNumber(283);
            depthDifficultyTable[8] = new BigNumber(320);
            depthDifficultyTable[9] = new BigNumber(386);
            depthDifficultyTable[10] = new BigNumber(450);
            depthDifficultyTable[11] = new BigNumber(503);
            depthDifficultyTable[12] = new BigNumber(605);
            depthDifficultyTable[13] = new BigNumber(755);
            depthDifficultyTable[14] = new BigNumber(1000);
            depthDifficultyTable[15] = new BigNumber(1350);
            depthDifficultyTable[16] = new BigNumber(1850);
            depthDifficultyTable[17] = new BigNumber(2000);
            depthDifficultyTable[18] = new BigNumber(3000);
            depthDifficultyTable[19] = new BigNumber(4000);
            break;
        case 6:
            //change level difficulty for early levels
            depthDifficultyTable[0] = new BigNumber(140);
            depthDifficultyTable[1] = new BigNumber(140);
            depthDifficultyTable[2] = new BigNumber(140);
            depthDifficultyTable[3] = new BigNumber(140);
            depthDifficultyTable[4] = new BigNumber(140);
            depthDifficultyTable[5] = new BigNumber(140);
            depthDifficultyTable[6] = new BigNumber(200);
            depthDifficultyTable[7] = new BigNumber(250);
            depthDifficultyTable[8] = new BigNumber(300);
            depthDifficultyTable[9] = new BigNumber(400);
            depthDifficultyTable[10] = new BigNumber(500);
            break;
        case 7:
            //no hint arrows
            showHintArrows = false;
            break;

        case 8:
            //Combine tests 3 & 5

            //## Test 3 ##
            getEarth().workerHireCosts[0] = new BigNumber(20);
            getEarth().workerHireCosts[1] = new BigNumber(250);

            //## Test 5 ##
            depthDifficultyTable[0] = new BigNumber(120);
            depthDifficultyTable[1] = new BigNumber(120);
            depthDifficultyTable[2] = new BigNumber(120);
            depthDifficultyTable[3] = new BigNumber(130);
            depthDifficultyTable[4] = new BigNumber(155);
            depthDifficultyTable[5] = new BigNumber(190);
            depthDifficultyTable[6] = new BigNumber(220);
            depthDifficultyTable[7] = new BigNumber(283);
            depthDifficultyTable[8] = new BigNumber(320);
            depthDifficultyTable[9] = new BigNumber(386);
            depthDifficultyTable[10] = new BigNumber(450);
            depthDifficultyTable[11] = new BigNumber(503);
            depthDifficultyTable[12] = new BigNumber(605);
            depthDifficultyTable[13] = new BigNumber(755);
            depthDifficultyTable[14] = new BigNumber(1000);
            depthDifficultyTable[15] = new BigNumber(1350);
            depthDifficultyTable[16] = new BigNumber(1850);
            depthDifficultyTable[17] = new BigNumber(2000);
            depthDifficultyTable[18] = new BigNumber(3000);
            depthDifficultyTable[19] = new BigNumber(4000);
            break;

        case 9:
            //Combine tests 2, 3, 5

            //## Test 2 ##
            levels[0] = [[1, 500]];
            levels[1] = [[1, 505]];
            levels[2] = [[1, 510]];
            levels[3] = [[1, 535]];
            levels[4] = [[1, 550], [2, 50]];
            levels[5] = [[1, 570], [2, 60]];
            levels[6] = [[1, 587], [2, 90]];
            levels[7] = [[1, 600], [2, 110]];
            levels[8] = [[1, 610], [2, 160], [3, 3]];
            levels[9] = [[1, 620], [2, 180], [3, 5]];
            levels[10] = [[1, 630], [2, 216], [3, 7]];
            levels[11] = [[1, 640], [2, 253], [3, 5]];
            levels[12] = [[1, 650], [2, 290], [3, 2], [4, 4]];
            levels[13] = [[1, 660], [2, 300], [3, 2], [4, 2]];
            levels[14] = [[1, 670], [2, 335], [3, 50], [4, 2]];
            levels[15] = [[1, 680], [2, 360], [3, 52]];
            levels[16] = [[1, 200], [2, 330], [3, 290]];
            levels[17] = [[2, 580], [3, 230], [4, 4]];
            levels[18] = [[2, 580], [3, 280], [4, 16]];
            levels[19] = [[2, 590], [3, 310], [4, 20]];

            //## Test 5 ##
            depthDifficultyTable[0] = new BigNumber(120);
            depthDifficultyTable[1] = new BigNumber(120);
            depthDifficultyTable[2] = new BigNumber(120);
            depthDifficultyTable[3] = new BigNumber(130);
            depthDifficultyTable[4] = new BigNumber(155);
            depthDifficultyTable[5] = new BigNumber(190);
            depthDifficultyTable[6] = new BigNumber(220);
            depthDifficultyTable[7] = new BigNumber(283);
            depthDifficultyTable[8] = new BigNumber(320);
            depthDifficultyTable[9] = new BigNumber(386);
            depthDifficultyTable[10] = new BigNumber(450);
            depthDifficultyTable[11] = new BigNumber(503);
            depthDifficultyTable[12] = new BigNumber(605);
            depthDifficultyTable[13] = new BigNumber(755);
            depthDifficultyTable[14] = new BigNumber(1000);
            depthDifficultyTable[15] = new BigNumber(1350);
            depthDifficultyTable[16] = new BigNumber(1850);
            depthDifficultyTable[17] = new BigNumber(2000);
            depthDifficultyTable[18] = new BigNumber(3000);
            depthDifficultyTable[19] = new BigNumber(4000);

            //## Test 3 ##
            getEarth().workerHireCosts[0] = new BigNumber(20);
            getEarth().workerHireCosts[1] = new BigNumber(250);
            break;

        case 10:
            //do nothing (base case A/A)
            break;

        case 11:
            drillBlueprints[12].ingredients[1] = {item: new MineralCraftingItem(COAL_INDEX), quantity: 5000};
            break;

        case 12:
            mainMusic = "Shared/Audio/music.mp3";
            headerFont = "KanitM";
            break;
    }
}

var pushUpdateText1 = "Your mine needs attention!";
var shopVariantId = 5;
var purchaseWindowTabOrder = 1;
var showShopButtonOnBottom = false;
var showGarageSparkles = true;
var unlockScientistsEarly = false;
var isHeaderTextBolded = false;
var showShopBadges = false;
var showShopPurchaseHeaders = false;
var offerButtonIcon = new Image();
offerButtonIcon.src = "Shared/Assets/UI/Bundles/bundle_button_1.png";

function initializeTests()
{
    if(UID == "" || UID == 0)
    {
        console.error("NO UID!");
    }
    console.log(UID);
    console.log(statsigUser);
    console.log(statsig.instance.getCurrentUser().custom);

    //###################### This will be PC and Mobile ######################

    basicChestRewardRoller.srand(rand(1, 9999));

    var firstBlackChestSeedPool = [2, 3, 5, 6, 7];
    var randomOfflineSeed = firstBlackChestSeedPool[rand(0, firstBlackChestSeedPool.length - 1)];
    blackChestRewardRoller.srand(randomOfflineSeed);

    tradeRoller.srand(rand(1, 9999));

    pinnedBlueprintsManager.isEnabled = false;

    var shopBadgeBonusTest = statsig.getExperiment("shop_bonus_badges");
    var shopBadgeBonusTestValue = shopBadgeBonusTest.get("Value", 0);
    console.log(shopBadgeBonusTestValue);
    showShopBadges = shopBadgeBonusTestValue == 1;

    var shopBestValueHeaderTest = statsig.getExperiment("shop_most_popular_best_value_headers");
    var shopBestValueHeaderValue = shopBestValueHeaderTest.get("Value", 0);
    console.log(shopBestValueHeaderValue);
    showShopPurchaseHeaders = shopBestValueHeaderValue == 1;

    var offerButtonIcons = [bundleButton1, bundleButton2, bundleButton3, bundleButton4];
    var offerButtonIconTest = statsig.getExperiment("offer_button_icon");
    var offerButtonIconValue = offerButtonIconTest.get("Value", 0);
    console.log(offerButtonIconValue);
    offerButtonIcon = offerButtonIcons[offerButtonIconValue];


    //#########################################################################


    //#########################################################################


    //######################### This will be Mobile Only ######################



    //########################## FINISHED TESTS ################################

    //re-initialize the push updates
    if(platform.setupPushUpdates)
    {
        platform.setupPushUpdates();
    }
    spawnRateMultiplier = 1;

    timeBetweenTradesTestMultiplier = 0.9;

    cavesSpawnDuringOfflineProgress = 1;

    userExperienceRoller.srand(22);

    ticketicon = ticketIconGold;
    smallShopTicket = smallShopTicketGold;
    chest1 = chest1gold;
    chest2 = chest2gold;
    chest3 = chest3gold;
}


/*
Test ideas:

Multivariate:
- Test old music track and music off by default
- Test diff font for header
- Test arrow on new game button if no saves exist (check new game setup completion rates)

Other tests:
- Remove the first hire, make them start with a miner by default
- Introduce scientists and chests significantly earlier
- Test having all quests visible from the start

More involved tests:
- The drill level up upgrading
- Progress bars for quests and other stuff
- Test no language selection on first game startup
- Different first and second trades
- Test auto creating a game when player first starts the game up
  - Or a different screen with just a new game and import button
- Test hints provided by Mr.Mine in speech bubbles
*/