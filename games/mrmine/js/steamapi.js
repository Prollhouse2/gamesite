class SteamApi
{
    module = require("steamworks.js");
    api = null;

    init(appId)
    {
        this.api = this.module.init(appId);
        return this.api;
    }

    isSteamRunning()
    {
        return true;
    }

    isCloudEnabled()
    {
        return this.api.cloud.isEnabledForApp();
    }

    isCloudEnabledForUser()
    {
        return this.api.cloud.isEnabledForAccount();
    }

    getSteamId()
    {
        return this.api.localplayer.getSteamId();
    }

    getAppBuildId()
    {
        return this.api.apps.appBuildId();
    }

    getIPCountry()
    {
        return this.api.localplayer.getIpCountry();
    }

    getCurrentGameLanguage()
    {
        return this.api.apps.currentGameLanguage();
    }

    getAchievementName()
    {
        return [];
    }

    activateAchievement(achievementId)
    {
        this.api.achievement.activate(achievementId);
    }

    activateGameOverlay(targetDialogue)
    {
        this.api.overlay.activateDialog(this.api.overlay.Dialog[targetDialogue]);
    }

    readTextFromFile(saveBackupFileName, onSuccess, onError)
    {
        var response = "";
        try
        {
            response = this.api.cloud.readFile(saveBackupFileName);
            onSuccess(response);
        }
        catch(e)
        {
            onError(e);
        }
    }

    saveTextToFile(filename, content, onSuccess, onError)
    {
        var response = "";
        try
        {
            response = this.api.cloud.writeFile(filename, content)
            onSuccess(response);
        }
        catch(e)
        {
            onError(e);
        }
    }

    registerPurchaseCallback(purchaseCallback)
    {
        this.api.callback.register(this.api.callback.SteamCallback.MicroTxnAuthorizationResponse, purchaseCallback);
    }
}