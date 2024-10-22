//##############################################
//################### STUBS ####################
//##############################################

var main = document.getElementById("WRAPPER");
var MAIN = main.getContext("2d");
main.style.width = "100%";
main.style.height = "100%";
main.width = main.offsetWidth;
main.height = main.offsetHeight;
var mainw = main.width;
var mainh = main.height;
var mainwInit = mainw;
var mainhInit = mainh;
MAIN.font = "18px CFont";

if(isMobile())
{
    var mobileFooter = document.getElementById("MOBILEFOOTER");
    var MOBILEFOOTER = mobileFooter.getContext("2d");
    mobileFooter.style.width = "100%";
    mobileFooter.style.height = "100%";
    mobileFooter.width = mobileFooter.offsetWidth;
    mobileFooter.height = mobileFooter.offsetHeight;
    var mobileFooterW = mobileFooter.width;
    var mobileFooterH = mobileFooter.height;
    var mobileFooterWInit = mobileFooterW;
    var mobileFooterHInit = mobileFooterH;
    MOBILEFOOTER.font = "18px CFont";
}

var stage = document.getElementById("STAGE");
var STAGE = stage.getContext("2d");
stage.style.width = "100%";
stage.style.height = "100%";
stage.width = stage.offsetWidth;
stage.height = stage.offsetHeight;
var stagew = stage.width;
var stageh = stage.height;
var stagewInit = stagew;
var stagehInit = stageh;
STAGE.font = "18px CFont";

var particles = document.getElementById("PARTICLES");
var PARTICLES = particles.getContext("2d");
particles.style.width = "100%";
particles.style.height = "100%";
particles.width = particles.offsetWidth;
particles.height = particles.offsetHeight;
var particlesw = particles.width;
var particlesh = particles.height;
var particleswInit = particlesw;
var particleshInit = particlesh;
PARTICLES.font = "18px CFont";

var transientEffectContainer = document.getElementById("TRANSIENTEFFECTS");
var TransientEffectsC = transientEffectContainer.getContext("2d");
transientEffectContainer.style.width = "100%";
transientEffectContainer.style.height = "100%";
transientEffectContainer.width = transientEffectContainer.offsetWidth;
transientEffectContainer.height = transientEffectContainer.offsetHeight;
var transientEffectContainerW = transientEffectContainer.width;
var transientEffectContainerH = transientEffectContainer.height;
TransientEffectsC.font = "24px CFont";

var tut = document.getElementById("TUTORIAL");
var TUT = tut.getContext("2d");
tut.style.width = "100%";
tut.style.height = "100%";
tut.width = tut.offsetWidth;
tut.height = tut.offsetHeight;
var tutw = tut.width;
var tuth = tut.height;
TUT.font = "16px Verdana";
minimizeCanvas(TUT.canvas);

var dialogueCanvas = document.getElementById("DIALOGUE");
if(dialogueCanvas)
{
    var DIALOGUE = dialogueCanvas.getContext("2d");
    dialogueCanvas.style.width = "100%";
    dialogueCanvas.style.height = "100%";
    dialogueCanvas.width = dialogueCanvas.offsetWidth;
    dialogueCanvas.height = dialogueCanvas.offsetHeight;
}
else
{
    console.error("Dialogue canvas is missing!");
}

var sell = document.getElementById("SELL");
var SL = sell.getContext("2d");
SL.font = "16px Verdana";
minimizeCanvas(SL.canvas);

var buyd = document.getElementById("BUY");
var BY = buyd.getContext("2d");
buyd.style.width = "100%";
buyd.style.height = "100%";
buyd.width = buyd.offsetWidth;
buyd.height = buyd.offsetHeight;
var buydw = buyd.width;
var buydh = buyd.height;
BY.font = "16px Verdana";
minimizeCanvas(BY.canvas);

var oild = document.getElementById("OIL");
var OIL = oild.getContext("2d");
OIL.font = "16px Verdana";
minimizeCanvas(OIL.canvas);

var drilld = document.getElementById("DRILL");
var DRILL = drilld.getContext("2d");
DRILL.font = "16px Verdana";
minimizeCanvas(DRILL.canvas);

var offlineprogressd = document.getElementById("OFFLINEPROGRESS");
var OFFLINEPROGRESS = offlineprogressd.getContext("2d");
offlineprogressd.style.width = "100%";
offlineprogressd.style.height = "100%";
offlineprogressd.width = offlineprogressd.offsetWidth;
offlineprogressd.height = offlineprogressd.offsetHeight;
var offlineprogressdw = offlineprogressd.width;
var offlineprogressdh = offlineprogressd.height;
OFFLINEPROGRESS.font = "16px Verdana";
minimizeCanvas(OFFLINEPROGRESS.canvas);

var archd = document.getElementById("ARCH");
var ARCH = archd.getContext("2d");
ARCH.font = "16px Verdana";
minimizeCanvas(ARCH.canvas);

var craftingd = document.getElementById("CRAFTING");
var CRAFTING = craftingd.getContext("2d");
CRAFTING.font = "16px Verdana";
minimizeCanvas(CRAFTING.canvas);

var settingsd = document.getElementById("SETTINGS");
var SETTINGS = settingsd.getContext("2d");
SETTINGS.font = "16px Verdana";
minimizeCanvas(SETTINGS.canvas);

var questsd = document.getElementById("QUESTS");
var QUESTS = questsd.getContext("2d");
QUESTS.font = "16px Verdana";
minimizeCanvas(QUESTS.canvas);

var purchased = document.getElementById("PURCHASE");
var PU = purchased.getContext("2d");
purchased.style.width = "100%";
purchased.style.height = "100%";
purchased.width = purchased.offsetWidth;
purchased.height = purchased.offsetHeight;
var purchasedw = purchased.width;
var purchasedh = purchased.height;
PU.font = "16px Verdana";
minimizeCanvas(PU.canvas);

var hired = document.getElementById("HIRE");
var HR = hired.getContext("2d");
HR.font = "16px Verdana";
minimizeCanvas(HR.canvas);

var superd = document.getElementById("SUPER");
var SPR = superd.getContext("2d");
SPR.font = "16px Verdana";
minimizeCanvas(SPR.canvas);

var supselld = document.getElementById("SUPSELL");
var SSD = supselld.getContext("2d");
SSD.font = "16px Verdana";
minimizeCanvas(SSD.canvas);

var supbd = document.getElementById("SUPB");
var SBD = supbd.getContext("2d");
SBD.font = "16px Verdana";
minimizeCanvas(SBD.canvas);

var battled = document.getElementById("BATTLE");
var BA = battled.getContext("2d");
BA.font = "16px Verdana";
minimizeCanvas(BA.canvas);

var chestc = document.getElementById("CHEST");
var CH = chestc.getContext("2d");
chestc.style.width = "100%";
chestc.style.height = "100%";
chestc.width = chestc.offsetWidth;
chestc.height = chestc.offsetHeight;
var chestcw = chestc.width;
var chestch = chestc.height;
CH.font = "18px Verdana";
minimizeCanvas(CH.canvas);

var helpc = document.getElementById("HELP");
var HE = helpc.getContext("2d");
HE.font = "18px Verdana";
minimizeCanvas(HE.canvas);

if(!isMobile())
{
    var titlec = document.getElementById("TITLE");
    var TI = titlec.getContext("2d");
    titlec.style.width = "100%";
    titlec.style.height = "100%";
    titlec.width = titlec.offsetWidth;
    titlec.height = titlec.offsetHeight;
    var titlecw = titlec.width;
    var titlech = titlec.height;
    TI.font = "18px Verdana";
}

var tradingpostd = document.getElementById("TRADINGPOST");
var TRADINGPOST = tradingpostd.getContext("2d");
TRADINGPOST.font = "16px Verdana";
minimizeCanvas(TRADINGPOST.canvas);

var reactord = document.getElementById("REACTOR");
var REACTOR = reactord.getContext("2d");
REACTOR.font = "16px Verdana";
minimizeCanvas(REACTOR.canvas);

var cavesystemd = document.getElementById("CAVESYSTEM");
var CAVESYSTEM = cavesystemd.getContext("2d");
CAVESYSTEM.font = "16px Verdana";
minimizeCanvas(CAVESYSTEM.canvas);

var newsd = document.getElementById("NEWS");
var NEWS = newsd.getContext("2d");
NEWS.font = "16px Verdana";
minimizeCanvas(NEWS.canvas);

var promod = document.getElementById("PROMO");
var PROMO = promod.getContext("2d");
PROMO.font = "16px Verdana";
minimizeCanvas(PROMO.canvas);

var weaponForgeD = document.getElementById("WEAPONFORGE");
var WEAPONFORGE = weaponForgeD.getContext("2d");
WEAPONFORGE.font = "16px Verdana";
minimizeCanvas(WEAPONFORGE.canvas);

var gemForgeD = document.getElementById("GEMFORGE");
var GEMFORGE = gemForgeD.getContext("2d");
GEMFORGE.font = "16px Verdana";
minimizeCanvas(GEMFORGE.canvas);

var pitd = document.getElementById("PIT");
var PIT = pitd.getContext("2d");
PIT.font = "16px Verdana";
minimizeCanvas(PIT.canvas);

var smsd = document.getElementById("SMS");
var SMS = smsd.getContext("2d");
SMS.font = "16px Verdana";
minimizeCanvas(SMS.canvas);

var offerDiv = document.getElementById("OFFER");
var OFF = offerDiv.getContext("2d");
OFF.font = "18px Verdana";
minimizeCanvas(OFF.canvas);

var special = document.getElementById("SPECIAL");
var SPC = special.getContext("2d");
SPC.font = "18px Verdana";
minimizeCanvas(SPC.canvas);

window.addEventListener('resize', handleWindowResizeEvent);

var hasResized = false;
function handleWindowResizeEvent()
{
    main.style.width = "100%";
    main.style.height = "100%";
    main.width = main.offsetWidth;
    main.height = main.offsetHeight;
    mainw = main.width;
    mainh = main.height;
    MAIN.font = "18px CFont";

    stage.style.width = "100%";
    stage.style.height = "100%";
    stage.width = stage.offsetWidth;
    stage.height = stage.offsetHeight;
    stagew = stage.width;
    stageh = stage.height;
    STAGE.font = "18px CFont";

    particles.style.width = "100%";
    particles.style.height = "100%";
    particles.width = particles.offsetWidth;
    particles.height = particles.offsetHeight;
    particlesw = particles.width;
    particlesh = particles.height;
    PARTICLES.font = "18px CFont";

    if(hasResized)
    {
        uiScaleX = mainw / mainwInit;
        uiScaleY = mainh / mainhInit;
        if(activeLayers.MainUILayer)
        {
            activeLayers.MainUILayer.setBoundingBox();
            activeLayers.WorldLayer.setBoundingBox();
            activeLayers.Stage.setBoundingBox();
            activeLayers.Particles.setBoundingBox();

            if(activeLayers.PinnedBlueprintsLayer)
            {
                activeLayers.PinnedBlueprintsLayer.setBoundingBox();
            }
        }
    }
    hasResized = true;

    if(isMobile())
    {
        setGlobalDpiScale(GLOBAL_DPI_SCALE);
    }
    if(initWorldConfig)
    {
        initWorldConfig();
    }
}

function openUi(popupWindowClass, ...params)
{
    var layer = new popupWindowClass(...params);

    if(closeOtherUIs(layer.layerName))
    {
        activeLayers[layer.layerName] = layer;
        activeLayers[layer.layerName].open();
        maximizeCanvas(layer.context.canvas);
        animate();
        return layer;
    }
    return null;
}

function openUiWithoutClosing(popupWindowClass, ...params)
{
    var layer = new popupWindowClass(...params);

    if(activeLayers[layer.layerName])
    {
        closeUi(activeLayers[layer.layerName]);
        maximizeCanvas(layer.context.canvas);
    }
    activeLayers[layer.layerName] = layer;
    activeLayers[layer.layerName].open();
    animate();
    return layer;
}

function closeUi(uiElement)
{
    if(uiElement.close())
    {
        delete activeLayers[uiElement.layerName];

        return true;
    }

    return false;
}

function getUiByName(layerName)
{
    if(activeLayers[layerName])
    {
        return activeLayers[layerName];
    }
}

function closeUiByName(layerName)
{
    if(activeLayers[layerName])
    {
        return closeUi(activeLayers[layerName]);
    }

    return false;
}

function closeOtherUIs(currentUiName)
{
    // Close all legacy UI's
    // Delete this when it becomes unnecessary
    logui(0, true);
    hireui(0, true);
    helpui(0, true);

    for(var key in activeLayers)
    {
        if(key != currentUiName && activeLayers[key].isPopup)  
        {
            if(!closeUiByName(key))
            {
                return false;
            }
        }
    }
    for(var i in windowState)
    {
        if(i != currentUiName) windowState[i] = 0;
    }

    return true;
}

function maximizeCanvas(canvas)
{
    var context = canvas.getContext('2d');
    var font = context.font;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth / uiScaleX;
    canvas.height = canvas.offsetHeight / uiScaleY;
    context.font = font;
    setDpi(canvas, GLOBAL_DPI_SCALE);
}

function minimizeCanvas(canvas)
{
    var context = canvas.getContext('2d');
    var font = context.font;
    canvas.style.width = 0;
    canvas.style.height = 0;
    canvas.width = 0;
    canvas.height = 0;
    context.font = font;
}

//#################################################
//################### UI STUBS ####################
//#################################################

function sellui(x)
{
    if(closeOtherUIs(1))
    {
        windowState[1] = x;
        if(x == 1)
        {
            animate();
            showDiv("SELLD", 3);
        }
        else
        {
            hideDiv("SELLD");
        }
    }
}

function buyui(x)
{
    if(closeOtherUIs(2))
    {
        if(x !== 5)
        {
            windowState[2] = x;
        }
        if(x == 5 && depth > 49)
        {
            windowState[2] = 5;
        }
        else if(x == 5)
        {
            windowState[2] = 0;
        }
        else if(x == 6 && depth > 224)
        {
            windowState[2] = 6;
        }
        else if(x == 6)
        {
            windowState[2] = 0;
        }

        if(x == 2 || x == 0)
        {
            drillPurchasePage = 0;
        }

        if(x == 1 || (x == 5 && depth > 49) || (x == 6 && depth > 224))
        {
            animate();
            showDiv("BUYD", 3);
        }
        else
        {
            hideDiv("BUYD");
            hideequips();
        }
    }
}

function purchaseui(x)
{
    if(closeOtherUIs(7))
    {
        windowState[7] = x;
        if(x > 0)
        {
            animate();
            if(typeof (buildTarget) != 'undefined' && buildTarget == WEB_BUILD)
            {
                if(x == 1)
                {
                    isPaypalWindowVisible = true;
                    showDiv("paypalPopup", 4);
                    showDiv("PURCHASED", 3);
                }
                else
                {
                    isPaypalWindowVisible = false;
                    hideDiv("paypalPopup");
                }
            }
            else
            {
                showDiv("PURCHASED", 3);
            }
        }
        else
        {
            if(typeof (buildTarget) != 'undefined' && buildTarget == WEB_BUILD)
            {
                isPaypalWindowVisible = false;
                hideDiv("paypalPopup");
                hideDiv("PURCHASED");
            }
            else
            {
                hideDiv("PURCHASED");
            }
        }
    }
}

function archui(x)
{
    if(closeOtherUIs(12))
    {
        windowState[12] = x;
        if(x > 0)
        {
            animate();
            showDiv("ARCHD", 3);
        }
        else
        {
            hideDiv("ARCHD");
        }
    }
}

function settingsui(x)
{
    if(closeOtherUIs(14))
    {
        windowState[14] = x;
        if(x > 0)
        {
            animate();
            showDiv("SETTINGSD", 3);
        }
        else
        {
            hideDiv("SETTINGSD");
        }
    }
}

function tradingpostui(x, forceClose)
{
    if(forceClose || closeOtherUIs(15))
    {
        windowState[15] = x;
        if(x > 0)
        {
            tradeConfig.tradingPosts[x - 1].playerHasSeenNewTrade = true;
            animate();
            showDiv("TRADINGPOSTD", 3);
        }
        else
        {
            hideDiv("TRADINGPOSTD");
        }
    }
}

function battleui()
{
    if(!isBossBattleActive && !battleActive)
    {
        preparebattle();
        openUi(BattleWindow, null, battleWaiting[2]);
        battleActive = true;
    }
    else
    {
        closeUiByName("Battle");
        battleActive = false;
    }
}

function logui(x, forceClose)
{
    if(forceClose || closeOtherUIs(11))
    {
        windowState[11] = x;
        if(x == 1)
        {
            animate();
            showDiv("LOGGERD", 3);
        }
        else
        {
            hideDiv("LOGGERD");
        }
    }
}

function hireui(x, forceClose)
{
    if(forceClose || closeOtherUIs(3))
    {
        windowState[3] = x;
        if(x == 1)
        {
            animate();
            showDiv("HIRED", 3);
        }
        else
        {
            hideDiv("HIRED");
        }
    }
}

function helpui(x, forceClose)
{
    if(forceClose || closeOtherUIs(5))
    {
        windowState[5] = x;
        if(x == 1)
        {
            animate();
            showDiv("HELPD", 3);
        }
        else
        {
            hideDiv("HELPD");
        }
    }
}

function showequips()
{
    showDiv("EQUIPS", 3);
    showDiv("ENGINEM", 4);
    showDiv("DRILLM", 4);
    showDiv("RADIATORM", 4);
    showDiv("CARGOBAYM", 4);
    showDiv("DELETEE", 4);

    for(var i = 1; i < 11; i++)
    {
        showDiv("ENGINE" + i, 4);
        showDiv("DRILL" + i, 4);
        showDiv("RADIATOR" + i, 4);
        showDiv("CARGOBAY" + i, 4);
    }
}

function hideequips()
{
    hideDiv("EQUIPS");
    hideDiv("ENGINEM");
    hideDiv("DRILLM");
    hideDiv("RADIATORM");
    hideDiv("CARGOBAYM");
    hideDiv("DELETEE");

    for(var i = 1; i < 11; i++)
    {
        hideDiv("ENGINE" + i);
        hideDiv("DRILL" + i);
        hideDiv("RADIATOR" + i);
        hideDiv("CARGOBAY" + i);
    }
}


var lightlogic = [0, -5, -4, -4, -3, -3, -3, -2, -2, -2, -2, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 5, 0];
var lights = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
var isAllowingAds = 0;

function hideDiv(divId)
{
    var div = document.getElementById(divId);
    if(div)
    {
        div.style.visibility = "hidden";
        div.style.zIndex = -1;
        return true;
    }
    return false;
}

function showDiv(divId, zIndex)
{
    var div = document.getElementById(divId);
    if(div)
    {
        div.style.visibility = "visible";
        div.style.zIndex = zIndex;
        return true;
    }
    return false;
}

function isDivVisible(divId)
{
    var div = document.getElementById(divId);
    return div && div.style && div.style.visibility != "hidden";
}

function setDivToVisibileLocation(divId, topPercent)
{
    document.getElementById(divId).style.visibility = "visible";
    document.getElementById(divId).style.zIndex = 2;
    document.getElementById(divId).style.top = topPercent + "%";
}

function showPurchaseLoadingOverlay()
{
    var overlay = document.getElementById("purchaseLoadingOverlay");
    if(overlay)
    {
        overlay.classList.remove("purchaseLoadingOverlay--hidden");
    }
}

function hidePurchaseLoadingOverlay()
{
    var overlay = document.getElementById("purchaseLoadingOverlay");
    if(overlay)
    {
        overlay.classList.add("purchaseLoadingOverlay--hidden");
    }
}

function isPurchaseLoadingOverlayVisible()
{
    var overlay = document.getElementById("purchaseLoadingOverlay");
    if(overlay)
    {
        return !overlay.classList.contains("purchaseLoadingOverlay--hidden");
    }
    return false;
}

//############################################################
//################# HANDLE HITBOX MOVEMENTS ##################
//############################################################

function movedivs()
{
    if(isMobile()) return;
    if(currentlyViewedDepth < 4)
    {
        var topp = (46.2 - (currentlyViewedDepth * 17.8));
        topp = Math.ceil(topp);

        setDivToVisibileLocation("PLACE1", topp);
        setDivToVisibileLocation("PLACE3", topp);
        setDivToVisibileLocation("PLACE2", topp + 5);
        setDivToVisibileLocation("METALDETECTORPLACE", topp + 19);
        setDivToVisibileLocation("GARAGE", topp + 8.8);

        if(currentlyViewedDepth < 2)
        {
            setDivToVisibileLocation("PLACE4", topp - 20);
            setDivToVisibileLocation("ARCHPLACE", topp - 18);
        }
        else
        {
            hideDiv("PLACE4");
            hideDiv("ARCHPLACE");
        }
    }
    else
    {
        hideDiv("PLACE1");
        hideDiv("PLACE3");
        hideDiv("PLACE2");
        hideDiv("PLACE4");
        hideDiv("METALDETECTORPLACE");
        hideDiv("ARCHPLACE");
        hideDiv("GARAGE");
    }

    var topp2 = (46.2 - ((currentlyViewedDepth - 304) * 17.8));
    topp2 = Math.ceil(topp2);
    if(currentlyViewedDepth > 300 && currentlyViewedDepth < 308)
    {
        setDivToVisibileLocation("PLACE5", topp2);
        setDivToVisibileLocation("PLACE6", topp2 - 25);
        setDivToVisibileLocation("PLACE7", topp2);
    }
    else
    {
        hideDiv("PLACE5");
        hideDiv("PLACE6");
        hideDiv("PLACE7");
    }

    if(currentlyViewedDepth == depth)
    {
        showDiv("drillHitbox", 3);
    }
    else
    {
        hideDiv("drillHitbox");
    }

    if(BattleManager.bosses.length > bossesDefeated)
    {
        for(var i = 0; i < 5; i++)
        {
            if(BattleManager.isActiveBossLevel(currentlyViewedDepth - i) && BattleManager.bosses[bossesDefeated].minDepth == currentlyViewedDepth - i)
            {
                showDiv("bossLevel", 3);
                document.getElementById("bossLevel").style.top = (82.2 - (17.8 * i)) + "%";
                break;
            }
            else if(i == 4)
            {
                hideDiv("bossLevel");
            }
        }
    }
    else
    {
        hideDiv("bossLevel");
    }
}

function changeViewedDepth(viewedDepthDelta, goMaxDistance = false)
{
    if(viewedDepthDelta == 0 || typeof (activeLayers.WorldLayer) == "undefined") return;
    var changedDepth = false;
    var minDepth = activeLayers.WorldLayer.minVisibleDepth;
    var maxDepth;
    if(isMobile())
    {
        if(depth >= 1000 && depth < 1032) 
        {
            maxDepth = depth + 2 + subTickDistancePercent() + worldConfig.maxDepthOffset;
        }
        else
        {
            maxDepth = depth + 1 + worldConfig.maxDepthOffset;
        }
    }
    else
    {
        maxDepth = depth;
    }
    if(viewedDepthDelta > 0 && !hasBranchTriggered(0)) setBranchToTriggered(0);
    if(!goMaxDistance &&
        ((viewedDepthDelta > 0 && currentlyViewedDepth + partialDepthOffset < maxDepth) ||
            (viewedDepthDelta < 0 && currentlyViewedDepth + partialDepthOffset > minDepth)))
    {
        if(viewedDepthDelta > 0 && currentlyViewedDepth + partialDepthOffset + viewedDepthDelta > maxDepth)
        {
            viewedDepthDelta = maxDepth - currentlyViewedDepth - partialDepthOffset;
        }
        else if(viewedDepthDelta < 0 && currentlyViewedDepth + partialDepthOffset + viewedDepthDelta < minDepth)
        {
            viewedDepthDelta = minDepth - currentlyViewedDepth - partialDepthOffset;
        }
        var roundedDepthDelta = Math.floor(viewedDepthDelta);
        currentlyViewedDepth += roundedDepthDelta;
        if(typeof (partialDepthOffset) !== 'undefined')
        {
            partialDepthOffset += viewedDepthDelta - roundedDepthDelta;
            if(partialDepthOffset >= 1)
            {
                var roundedPartialDepthOffset = Math.floor(partialDepthOffset);
                currentlyViewedDepth += roundedPartialDepthOffset;
                partialDepthOffset = partialDepthOffset - roundedPartialDepthOffset;
            }
        }
        changedDepth = true;
    }
    else if(goMaxDistance)
    {
        if(viewedDepthDelta < 0)
        {
            //up arrow
            if(chestService.totalBlackChestsOpened == 0 && currentlyViewedDepth > SUPER_MINER_DEPTH + 2)
            {
                currentlyViewedDepth = SUPER_MINER_DEPTH + 2;
            }
            else if(playerNeedsHelpCraftingTradingPost() && currentlyViewedDepth > tradeConfig.tradingPosts[0].depth + 2)
            {
                currentlyViewedDepth = tradeConfig.tradingPosts[0].depth + 2;
            }
            else if(playerNeedsHelpFindingGolem() && currentlyViewedDepth > 52)
            {
                currentlyViewedDepth = 52;
            }
            else if(playerNeedsHelpFindingChestCollector() && currentlyViewedDepth > 102)
            {
                currentlyViewedDepth = 102;
            }
            else if(playerNeedsHelpFindingBrokenRobot() && currentlyViewedDepth > 227)
            {
                currentlyViewedDepth = 227;
            }
            else if(currentlyViewedDepth <= 1032)
            {
                currentlyViewedDepth = minDepth;
            }
            else if(currentlyViewedDepth <= 1814)
            {
                currentlyViewedDepth = 1032;
            }
            else
            {
                currentlyViewedDepth = 1814;
            }
            changedDepth = true;
        }
        else if(viewedDepthDelta > 0)
        {
            //down arrow
            if(chestService.totalBlackChestsOpened == 0 && currentlyViewedDepth < SUPER_MINER_DEPTH + 2)
            {
                currentlyViewedDepth = SUPER_MINER_DEPTH + 2;
            }
            else if(playerNeedsHelpCraftingTradingPost() && currentlyViewedDepth < tradeConfig.tradingPosts[0].depth + 2)
            {
                currentlyViewedDepth = tradeConfig.tradingPosts[0].depth + 2;
            }
            else if(playerNeedsHelpFindingGolem() && currentlyViewedDepth < 48)
            {
                currentlyViewedDepth = 52;
            }
            else if(playerNeedsHelpFindingChestCollector() && currentlyViewedDepth < 98)
            {
                currentlyViewedDepth = 102;
            }
            else if(playerNeedsHelpFindingBrokenRobot() && currentlyViewedDepth < 223)
            {
                currentlyViewedDepth = 227;
            }
            else if(currentlyViewedDepth >= 1814)
            {
                currentlyViewedDepth = depth;
            }
            else if(currentlyViewedDepth >= 1032)
            {
                currentlyViewedDepth = 1814;
            }
            else if(currentlyViewedDepth < 1032)
            {
                currentlyViewedDepth = 1032
            }
            changedDepth = true;
        }
        if(typeof (partialDepthOffset) !== 'undefined')
        {
            partialDepthOffset = worldConfig.maxDepthOffset;
        }
    }
    if(currentlyViewedDepth > maxDepth)
    {
        currentlyViewedDepth = Math.floor(Math.max(minDepth, maxDepth));
        if(typeof (partialDepthOffset) !== 'undefined')
        {
            partialDepthOffset = worldConfig.maxDepthOffset;
        }
    }
    else if(currentlyViewedDepth < minDepth)
    {
        currentlyViewedDepth = minDepth;
        if(typeof (partialDepthOffset) !== 'undefined')
        {
            partialDepthOffset = 0;
        }
    }
    if(changedDepth)
    {
        // MAIN.clearRect(0, mainh * .11, mainw, mainh * .89);
        animate();
        hasAnimatedThisFrame = 1;
        movedivs();
    }
}

function getVisibleDepthRange()
{
    var depths = {};
    depths.max = currentlyViewedDepth + partialDepthOffset;
    depths.min = depths.max - worldConfig.numberOfDepthsVisible + 1;
    return depths;
}

function isDepthVisible(targetDepth)
{
    var depthRange = getVisibleDepthRange();
    return targetDepth >= Math.floor(depthRange.min) && targetDepth <= Math.ceil(depthRange.max);
}

//Jumps to depth if that depth has been unlocked.
function panToViewDepth(targetDepth)
{
    if(targetDepth > depth || targetDepth < 0)
    {
        return;
    }

    if(targetDepth + 2 <= depth)
    {
        targetDepth += 2;
    }
    else if(targetDepth + 1 <= depth)
    {
        targetDepth += 1;
    }

    currentlyViewedDepth = targetDepth;
    movedivs();
}

function openNewGamePrompt()
{
    if(RSc < 3)
    {
        showSimpleInput(
            _("GAME NAME"),
            _("START"),
            getFirstUnusedGameName(),
            () => createNewGame(document.getElementById("simpleInputFieldText").value),
            _("CANCEL")
        )
        // document.getElementById("NEWGAME").style.visibility = "visible";
        // document.getElementById("NEWGAME").style.zIndex = 10;
        // document.getElementById("gname").value = getFirstUnusedGameName();
        // document.getElementById("gname").focus();
        //document.getElementById("gname").select();
    }
}

//#####################################################
//################### GENERIC DIVS ####################
//#####################################################

//alert override
alert = function (str)
{
    showAlertPrompt(str);
}

function showAlertPrompt(description, buttonText = "Ok")
{
    openUiWithoutClosing(ConfirmationWindow,
        null,
        description,
        buttonText,
        ""
    );
}

function showConfirmationPrompt(description, buttonText, onConfirm, cancelButtonText, onCancel = null, callOutText = null)
{
    if(!activeLayers.confirmationLayer)
    {
        openUiWithoutClosing(ConfirmationWindow,
            null,
            description,
            buttonText,
            cancelButtonText,
            onConfirm,
            onCancel,
            callOutText
        );
    }

}

function showChoicePrompt(description, callOutText, buttons)
{
    if(!activeLayers.confirmationLayer)
    {
        openUiWithoutClosing(
            ChoiceWindow,
            null,
            description,
            callOutText,
            buttons
        );
    }
}

function showAdPrompt(description, ticketCost, onComplete, placementId)
{
    hideTooltip();
    var buttons = [];
    buttons.push({
        text: _("Watch an ad"),
        icon: adButtonSmall,
        color: "blue",
        onClick: adManager.showAd.bind(adManager, onComplete, placementId)
    });
    var payText = _("Pay {0} tickets", ticketCost);
    if(ticketCost == 1)
    {
        payText = _("Pay 1 ticket");
    }
    buttons.push({
        text: payText,
        icon: smallShopTicketGold,
        color: "green",
        onClick: function ()
        {
            if(tickets >= ticketCost)
            {
                tickets -= ticketCost;
                onComplete();
            }
            else
            {
                showConfirmationPrompt(
                    _("You don't have enough tickets"),
                    _("BUY TICKETS"),
                    function ()
                    {
                        openUi(PurchaseWindow, null, 0, purchaseWindowTabOrder);
                        hideSimpleInput();
                    },
                    _("Cancel"));
            }
        }
    });
    buttons.push({
        text: _("Cancel"),
        color: "red",
        scale: .75,
        onClick: () => { }
    });

    showChoicePrompt(description, "", buttons);
}

function isConfirmationPromptOpen()
{
    for(var i in activeLayers)
    {
        if(i.includes("confirmationLayer"))
        {
            return true;
        }
    }
    return false;
}

function showSimpleInput(description, buttonText, startingInputValue, onSubmit, exitButtonText, maxChars = 0, onTextClick = null)
{
    showDiv("SIMPLEINPUTFIELD", 999);

    document.getElementById("simpleInputFieldText").style.visibility = "visible";
    document.getElementById("simpleInputFieldText").value = startingInputValue;
    document.getElementById("simpleInputFieldText").onclick = null;
    if(onTextClick != null)
    {
        document.getElementById("simpleInputFieldText").onclick = onTextClick;
    }

    if(maxChars > 0)
    {
        document.getElementById("simpleInputFieldText").maxLength = maxChars;
    }
    else
    {
        document.getElementById("simpleInputFieldText").removeAttribute("maxLength");
    }

    openUiWithoutClosing(ConfirmationWindow,
        null,
        description,
        buttonText,
        exitButtonText,
        onSubmit
    );
}

function hideSimpleInput()
{
    hideDiv("SIMPLEINPUTFIELD");
}

function hideSimpleInputAlert()
{
    hideDiv("SIMPLEINPUTFIELDALERT");
    document.getElementById("simpleInputAlertButton").onclick = null;
}

function isSimpleInputVisible()
{
    return document.getElementById("SIMPLEINPUTFIELD").style.visibility == "visible";
}

//#####################################################
//##################### TOOLTIPS ######################
//#####################################################

function showTooltipForDiv(header, body, divId, width = 120)
{
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var divBoundingBox = document.getElementById(divId).getBoundingClientRect();
    var xCoordinate, yCoordinate;
    if((divBoundingBox.right + document.getElementById("TOOLTIP").style.width) >= windowWidth)
    {
        //show on left side
        xCoordinate = divBoundingBox.left - document.getElementById("TOOLTIP").style.width;
    }
    else
    {
        //show on right side
        xCoordinate = divBoundingBox.right;
    }
    if((divBoundingBox.top + document.getElementById("TOOLTIP").style.height) >= windowHeight)
    {
        yCoordinate = windowHeight - document.getElementById("TOOLTIP").style.height;
    }
    else
    {
        yCoordinate = divBoundingBox.top;
    }
    showTooltip(header, body, xCoordinate, yCoordinate, width);
}

var updatingTooltipState =
{
    "isLive": false,
    "updateTextFunction": null,
    "x": 0,
    "y": 0,
    "width": 120
}
function showUpdatingTooltip(textUpdateFunction, x = 0, y = 0, width = 120)
{
    updatingTooltipState.isLive = true;
    updatingTooltipState.updateTextFunction = textUpdateFunction;
    updatingTooltipState.x = x;
    updatingTooltipState.y = y;
    updatingTooltipState.width = width;
    updateUpdatingTooltip();
}

function isScrolling(hitboxChild = null)
{
    if(!isMobile() || !isDragging || dragDistance() <= 1) return false;

    if(hitboxChild == null)
    {
        if(currentTargetHitbox != null && currentTargetHitbox.hitbox != null)
        {
            hitboxChild = currentTargetHitbox.hitbox;
        }
        else
        {
            return false;
        }
    }

    if(hitboxChild.constructor.name.includes("Scroll"))
    {
        return true;
    }
    else if(hitboxChild.parent != null)
    {
        return isScrolling(hitboxChild.parent);
    }
    return false;
}

function showTooltip(header, body, x = -1, y = -1, width = 120)
{
    if(isScrolling())
    {
        hideTooltip();
        return;
    }

    x = x < 0 ? mouseX : convertCssSizeToPixels(x, 'x');
    y = y < 0 ? mouseY : convertCssSizeToPixels(y, 'y');

    var htmlTagsToRemove = ["<br>", "<b>", "</b>", "<center>", "</center>"];
    var text = header + body;
    var largestWordWidth = 0;
    var largestWord = "";


    htmlTagsToRemove.forEach((tag) =>
    {
        while(text.includes(tag))
        {
            text = text.replace(tag, " ");
        }
    });

    var textArray = text.split(" ");
    textArray.forEach((word) =>
    {
        if(MAIN.measureText(word).width > largestWordWidth)
        {
            if(!word.includes("data:image") && !word.includes("file:") && !word.includes("class="))
            {
                largestWordWidth = MAIN.measureText(word).width;
                largestWord = word;
            }
        }
    });

    if(largestWordWidth > width)
    {
        width = largestWordWidth;
    }

    showDiv("TOOLTIP", 999);
    if(platform.fadeOutTooltips)
    {
        document.getElementById("TOOLTIP").classList.remove("fadeOut");
        // Required to trigger the animation again
        void document.getElementById("TOOLTIP").offsetWidth;
        document.getElementById("TOOLTIP").classList.add("fadeOut");
    }

    var margin = mainw * 0.02;
    x = Math.max(margin, Math.min(mainw - margin, x));
    y = Math.max(margin, Math.min(mainh - margin, y));
    if(typeof (width) == "number")
    {
        width = Math.max(0, Math.min(mainw - 2 * margin, width));
    }

    document.getElementById("TOOLTIP").style.left = x;
    document.getElementById("TOOLTIP").style.top = y;
    document.getElementById("TOOLTIP").style.width = width;

    if(body != "")
    {
        document.getElementById("TOOLTIP").innerHTML = "<center><b>" + header + "</b></center><br>" + body;
    }
    else
    {
        document.getElementById("TOOLTIP").innerHTML = "<center><b>" + header + "</b></center>";
    }

    //Determine Background Image To Use (Later use 9 slice)
    var tooltipDisplayRatio = document.getElementById("TOOLTIP").offsetWidth / document.getElementById("TOOLTIP").offsetHeight;
    var tooltipBackgroundUrl = "Shared/Assets/UI/tooltip.png";
    if(tooltipDisplayRatio < 0.8)
    {
        tooltipBackgroundUrl = "Shared/Assets/UI/tooltip_narrow.png";
    }
    else if(tooltipDisplayRatio > 2.25 && document.getElementById("TOOLTIP").offsetHeight < 60)
    {
        tooltipBackgroundUrl = "Shared/Assets/UI/tooltip_wide_short.png";
    }
    else if(tooltipDisplayRatio > 1.75)
    {
        tooltipBackgroundUrl = "Shared/Assets/UI/tooltip_wide.png";
    }
    else if(document.getElementById("TOOLTIP").offsetHeight < 120)
    {
        tooltipBackgroundUrl = "Shared/Assets/UI/tooltip_small.png";
    }
    document.getElementById("TOOLTIP").style.background = "url('" + tooltipBackgroundUrl + "') no-repeat 0 0";
    document.getElementById("TOOLTIP").style.backgroundSize = "100% 100%";

    //Shift up if it tooltip goes off screen
    if(document.getElementById("TOOLTIP").getBoundingClientRect().bottom > document.body.getBoundingClientRect().bottom)
    {
        var integerPixelValueCoordinate = parseFloat(document.getElementById("TOOLTIP").getBoundingClientRect().top);
        integerPixelValueCoordinate -= (document.getElementById("TOOLTIP").getBoundingClientRect().bottom - document.body.getBoundingClientRect().bottom);
        document.getElementById("TOOLTIP").style.top = integerPixelValueCoordinate;
    }
    if(document.getElementById("TOOLTIP").getBoundingClientRect().right > document.body.getBoundingClientRect().right)
    {
        var integerPixelValueCoordinate = parseFloat(document.getElementById("TOOLTIP").getBoundingClientRect().left);
        integerPixelValueCoordinate -= (document.getElementById("TOOLTIP").getBoundingClientRect().right - document.body.getBoundingClientRect().right);
        document.getElementById("TOOLTIP").style.left = integerPixelValueCoordinate;
    }
}

function convertCssSizeToPixels(size, dimension)
{
    if(typeof (size) == "string")
    {
        if(size.substring(size.length - 2) == "px")
        {
            return parseFloat(size.substring(0, size.length - 2));
        }
        if(size[size.length - 1] == "%")
        {
            var percent = parseFloat(size.substring(0, size.length - 1)) / 100;
            if(dimension == "x")
            {
                return percent * window.innerWidth;
            }
            else if(dimension == "y")
            {
                return percent * window.innerHeight;
            }
            throw "convertCssSizeToPixels(): Dimension param must be 'x' or 'y'";
        }
    }
    return parseFloat(size);
}

function updateUpdatingTooltip()
{
    if(updatingTooltipState && updatingTooltipState.isLive)
    {
        var tooltipText = updatingTooltipState.updateTextFunction();
        showTooltip(tooltipText.header, tooltipText.body, updatingTooltipState.x, updatingTooltipState.y, updatingTooltipState.width);
    }
}

function hideTooltip()
{
    hideDiv("TOOLTIP");

    updatingTooltipState.isLive = false;
    updatingTooltipState.updateTextFunction = null;
    updatingTooltipState.x = 0;
    updatingTooltipState.y = 0;
    updatingTooltipState.width = 120;
}

function showLanguageSelection()
{
    var languageDiv = document.getElementById("LANGUAGESELECTIOND");
    if(languageDiv.style.visibility == "visible")
    {
        return;
    }
    for(var i of languageDiv.childNodes)
    {
        disableOnClickHtmlEvent(i, 500);
    }
    var selectLanguageString;
    if(platform.getSystemLanguage() == language)
    {
        if(language == "english")
        {
            selectLanguageString = "SELECT LANGUAGE &#128491;";
        }
        else
        {
            selectLanguageString = translate("Select Language", platform.getSystemLanguage()).toUpperCase() + " (SELECT LANGUAGE) &#128491;"
        }
    }
    else
    {
        selectLanguageString = translate("Select Language", language).toUpperCase() + " (" + translate("Select Language", platform.getSystemLanguage()).toUpperCase() + ") &#128491;"
    }
    document.getElementById("selectLanguageTitle").innerHTML = selectLanguageString;
    var languageEntries = document.getElementsByClassName("languageSelection");
    var systemLanguageEntry = document.querySelector("[data-language='" + platform.getSystemLanguage() + "']");
    var currentLanguageEntry = document.querySelector("[data-language='" + language + "']");
    if(systemLanguageEntry != null)
    {
        systemLanguageEntry.parentNode.insertBefore(systemLanguageEntry, languageEntries[0]);
    }
    if(currentLanguageEntry != null)
    {
        currentLanguageEntry.parentNode.insertBefore(currentLanguageEntry, systemLanguageEntry);
    }
    languageDiv.style.zIndex = 20;
    languageDiv.style.visibility = "visible";
    if(isMobile() && typeof (cordova) !== "undefined" && navigator.splashscreen)
    {
        navigator.splashscreen.hide();
    }
}

function hideLanguageSelection()
{
    document.getElementById("LANGUAGESELECTIOND").style.zIndex = -1;
    document.getElementById("LANGUAGESELECTIOND").style.visibility = "hidden";
}

function setDpi(canvas, dpiScale)
{
    if(!isMobile())
    {
        return;
    }
    // Set up CSS size.
    var width, height;
    var font = canvas.getContext('2d').font;
    if(canvas.style.width)
    {
        if(canvas.style.width[canvas.style.width.length - 1] != "%")
        {
            width = parseFloat(canvas.style.width);
        }
        else
        {
            width = parseFloat(canvas.style.width) * canvas.parentElement.clientWidth / 100;
        }
    }
    else
    {
        width = canvas.width;
    }
    if(canvas.style.height)
    {
        if(canvas.style.height[canvas.style.height.length - 1] != "%")
        {
            height = parseFloat(canvas.style.height);
        }
        else
        {
            height = parseFloat(canvas.style.height) * canvas.parentElement.clientHeight / 100;
        }
    }
    else
    {
        height = canvas.height;
    }
    if(width == 0 || height == 0)
    {
        return;
    }

    width /= uiScaleX;
    height /= uiScaleY;

    // Resize the canvas.
    var context = canvas.getContext('2d');
    canvas.width = Math.ceil(width * dpiScale);
    canvas.height = Math.ceil(height * dpiScale);
    context.setTransform(dpiScale, 0, 0, dpiScale, 0, 0);
    context.font = font;
}

function setGlobalDpiScale(dpiScale)
{
    var canvases = document.getElementsByTagName("canvas");
    for(var i in Object.values(canvases))
    {
        setDpi(canvases[i], dpiScale);
    }
}