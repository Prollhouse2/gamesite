var platform;

class Platform
{
    language;
    questData;
    allowTracking = true;
    treatClicksAsTouches = false;

    getUserId() { }
    isUserCloudEnabled() { }
    grantAchievement() { }
    initMusic() { }
    toggleMusic() { }
    playMusic() { }
    onGameLoaded() { }
    isFullscreenable() {return false;}
    getSystemLanguage() { }
    openSurvey() { }
}