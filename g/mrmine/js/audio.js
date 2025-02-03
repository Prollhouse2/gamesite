var mute = 0;
var mutebuttons = 0;
var muteisotopes = 0;
var mutecapacity = 0;
var mainMusic = "Shared/Audio/newmusic.mp3";

var clickAudio;
var clickMineral;
var closeAudio;
var buyAudio;
var isotopeFoundAudio;
var failureAudio;
var music;
var capacityFullAudio;
var armoryUpgradeAudio;
var craftDrillAudio;
var craftStructureAudio;
var defeatBossAudio;
var discoverMineralAudio;
var droneReturnAudio;
var hireAudio;
var questCollectAudio;
var questCompleteAudio;
var sacrificeMineralAudio;
var sacrificeWarped;
var sacrificeDivine;
var scientistCollectAudio;
var takeoffCountdownAudio;
var tradeAudio;
var caveAppearsAudio;
var caveCollapseAudio;
var chestGoldOpenAudio;
var chestOpenAudio;

function patchAudioForDesktop()
{
	if (!window.Media)
	{
		window.Media = Audio;
		window.Media.prototype.setVolume = function(volume)
		{
			this.volume = volume;
		}
	}
}

if (!isMobile() || !platform.isIOs())
{
	patchAudioForDesktop();
	initSoundEffects();
}

function initSoundEffects()
{
	clickAudio = [new Media("Shared/Audio/click1.wav"), new Media("Shared/Audio/click2.wav"), new Media("Shared/Audio/click3.wav"), new Media("Shared/Audio/click4.wav"), new Media("Shared/Audio/click5.wav")];
    clickMineral = [new Media("Shared/Audio/clickmineral1new.mp3"), new Media("Shared/Audio/clickmineral2new.mp3"), new Media("Shared/Audio/clickmineral3new.mp3"), new Media("Shared/Audio/clickmineral4new.mp3")];
    closeAudio = [new Media("Shared/Audio/cliclack2.wav"), new Media("Shared/Audio/cliclack3.wav")]
    buyAudio = new Media("Shared/Audio/buy.wav");
    isotopeFoundAudio = new Media("Shared/Audio/special.wav");
    failureAudio = new Media("Shared/Audio/nope.wav");
    music = platform.initMusic();
    capacityFullAudio = new Media("Shared/Audio/CapacityFull.mp3");
    armoryUpgradeAudio = new Media("Shared/Audio/armoryupgrade.mp3");
    craftDrillAudio = new Media("Shared/Audio/craftdrill.mp3");
    craftStructureAudio = new Media("Shared/Audio/craftstructure.mp3");
    defeatBossAudio = new Media("Shared/Audio/defeatboss.mp3");
    discoverMineralAudio = new Media("Shared/Audio/discovermineral.mp3");
    droneReturnAudio = new Media("Shared/Audio/dronereturn.mp3");
    hireAudio = new Media("Shared/Audio/hire.mp3");
    questCollectAudio = new Media("Shared/Audio/questcollect.mp3");
    questCompleteAudio = new Media("Shared/Audio/questcomplete.mp3");
    sacrificeMineralAudio = new Media("Shared/Audio/sacrificemineral.mp3");
    sacrificeWarped = new Media("Shared/Audio/sacrificeWarped.mp3");
    sacrificeDivine = new Media("Shared/Audio/sacrificeDivine.mp3");
    scientistCollectAudio = new Media("Shared/Audio/scientistscollect.mp3");
    takeoffCountdownAudio = new Media("Shared/Audio/takeoffcountdown.mp3");
    tradeAudio = new Media("Shared/Audio/trade.mp3");
    caveAppearsAudio = new Media("Shared/Audio/caveappears.mp3");
    caveCollapseAudio = new Media("Shared/Audio/cavecollapse.mp3");
    chestGoldOpenAudio = new Media("Shared/Audio/chestgoldopen.mp3");
    chestOpenAudio = new Media("Shared/Audio/chestopen.mp3");
	capacityFullAudio.setVolume(0.05);
}

function setVolume()
{
	if(localStorage.getItem("mute") === null)
	{
		mute = 0;
		mutebuttons = 0;
		mutecapacity = 1;
		muteisotopes = 0;
		localStorage["mute"] = 0;
		localStorage["mutebuttons"] = 0;
		localStorage["mutecapacity"] = 1;
		localStorage["muteisotopes"] = 0;

	}
	else
	{
		mute = parseInt(localStorage["mute"]);
		mutebuttons = parseInt(localStorage["mutebuttons"]);
		mutecapacity = parseInt(localStorage["mutecapacity"]);
		muteisotopes = parseInt(localStorage["muteisotopes"]);
	}
	// platform.toggleMusic();
}