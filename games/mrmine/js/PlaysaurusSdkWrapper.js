class PlaysaurusSdk
{
    lastNewsCheckTime = 0;
    timeBetweenNewsChecks = 12 * 3600000; // 12 hours

    endpoint = "https://app.playsaurus.com/api";

    userAtomicId = null;
    eventSessionIds = {};

    constructor()
    {
        window.addEventListener("load", () =>
        {
            try
            {
                this.initSdk();
                this.initEventListeners();
            }
            catch(e)
            {
                console.error(e);
            }
        });
    }

    initSdk()
    {
        var config = {
            gameSlug: "mr-mine",
            endpoint: this.endpoint,
            gameStorefront: this.getStorefrontName(),
            gameVersion: version + buildLetter + "." + revisionNumber,
            userUid: platform.getUserId() + "",
            locale: getLanguageCode(languageOverride),
            analytics: {enabled: true}
        };
        if(isMobile() && platform.isActualDevice)
        {
            config.dataCollector = new Playsaurus.CordovaDataCollector();
        }
        else
        {
            config.dataCollector = new Playsaurus.BrowserDataCollector();
        }
        config.gamePlatform = platformName();
        if(config.gamePlatform == "steam")
        {
            config.gamePlatform = "desktop";
            config.analytics.steamId = platform.getUserId();
        }
        Playsaurus.initialize(config);
    }

    initEventListeners()
    {
        if(isSteam())
        {
            const {ipcRenderer} = require('electron');
            const maxExecutionTimeBeforeClose = 3000;
            ipcRenderer.on("before-close", async (event) =>
            {
                // Force the window to close if endSession() takes too long
                var timeout = new Promise((resolve, reject) =>
                {
                    setTimeout(() =>
                    {
                        resolve();
                    }, maxExecutionTimeBeforeClose);
                });
                await Promise.race([timeout, Playsaurus.analytics.endSession()]);
                ipcRenderer.send('before-close-done');
            });
        }
        else if(isMobile())
        {
            document.addEventListener("pause", async function ()
            {
                if(typeof (adManager) == "undefined" || !adManager.isWatchingAd())
                {
                    await this.endSession();
                }
            }.bind(this));
            document.addEventListener("resume", function ()
            {
                if(Playsaurus.analytics._session == null)
                {
                    this.initSdk();
                }
                this.lastNewsCheckTime = 0;
                this.fetchAnnouncementsIfDue();
            }.bind(this));
        }
        else
        {
            window.addEventListener("beforeunload", this.endSession);
        }
    }

    async endSession()
    {
        console.log("ENDING SESSION");
        await Playsaurus.analytics.endSession();
        console.log("SESSION ENDED");
        return true;
    }

    updateLocale(newLanguageCode)
    {
        Playsaurus.locale = newLanguageCode;
    }

    getStorefrontName()
    {
        switch(platformName())
        {
            case "ios":
                return "app_store";
            case "android":
                return "google_play";
            case "steam":
                return "steam";
            case "web":
                switch(platform.domain)
                {
                    case "armorgames":
                        return "armor_games";
                    case "crazygames":
                        return "crazy_games";
                    default:
                        return "playsaurus_web";
                }
        }
        return null;
    }

    getUserAtomicId()
    {
        if(!this.userAtomicId)
        {
            Playsaurus.getAtomicId().then(
                function (id)
                {
                    this.userAtomicId = id;
                }.bind(this)
            )
        }
        return this.userAtomicId || "00000000-0000-0000-0000-000000000000";
    }

    setEventSessionId(eventSessionKey, id = null)
    {
        if(id == null)
        {
            id = crypto.randomUUID();
        }
        this.eventSessionIds[eventSessionKey] = id;
        return id;
    }

    getEventSessionId(eventSessionKey)
    {
        return this.eventSessionIds[eventSessionKey] || this.setEventSessionId("eventSessionKey");
    }

    clearEventSessionId(eventSessionKey)
    {
        this.eventSessionIds[eventSessionKey] = null;
    }

    // ANNOUNCEMENTS

    fetchAnnouncementsIfDue(openUiIfNew = true)
    {
        if(this.isDueForAnnouncements())
        {
            try
            {
                return Playsaurus.announcements.fetch().then((result) =>
                {
                    this.lastNewsCheckTime = Date.now();
                    if(openUiIfNew && result)
                    {
                        openUiWithoutClosing(AnnouncementPopup, null, result);
                    }
                });

            }
            catch(e)
            {
                console.error(e);
            }
        }
    }

    isDueForAnnouncements()
    {
        return isGameLoaded
            && Date.now() > this.lastNewsCheckTime + this.timeBetweenNewsChecks
            && numGameLaunches > 1;
    }

    // EVENT LOGGING

    logEvent(eventName, eventData)
    {
        try
        {
            eventData = this.appendCommonEventData(eventData);
            Playsaurus.analytics.sendEvent(eventName, eventData);
        }
        catch(e)
        {
            console.error(e);
        }
    }

    appendCommonEventData(eventData)
    {
        eventData.current_depth = depth;
        eventData.playtime = playtime;
        return eventData;
    }

    logPremiumCurrencySpent(ticketPrice, category, subtype)
    {
        this.logEvent(
            "premium_currency_spent",
            {
                ticket_price: ticketPrice,
                category: category,
                subtype: subtype
            }
        )
    }

    logPremiumCurrencyGained(addedTickets, source)
    {
        this.logEvent(
            "premium_currency_gained",
            {
                amount: addedTickets,
                from: source
            }
        )
    }

    logInAppPurchase(sku, priceInCents)
    {
        this.logEvent(
            "in_app_purchase_completed",
            {
                sku: sku,
                price_in_cents: priceInCents,
                purchase_session_id: this.getEventSessionId("purchase")
            }
        )
    }

    logPurchaseWindowViewed()
    {
        this.setEventSessionId("purchase");
        this.logEvent(
            "purchase_window_opened",
            {
                purchase_session_id: this.getEventSessionId("purchase")
            }
        )
    }

    logStartedPurchase(sku)
    {
        this.logEvent(
            "purchase_started",
            {
                sku: sku,
                purchase_session_id: this.getEventSessionId("purchase")
            }
        )
    }

    logCanceledPurchase(sku)
    {
        this.logEvent(
            "purchase_canceled",
            {
                sku: sku,
                purchase_session_id: this.getEventSessionId("purchase")
            }
        )
        this.clearEventSessionId("purchase");
    }

    logViewedOffer(sku)
    {
        this.setEventSessionId("purchase");
        this.logEvent(
            "offer_viewed",
            {
                sku: sku,
                purchase_session_id: this.getEventSessionId("purchase")
            }
        )
    }

    logFirstPurchase(sku, priceInCents)
    {
        this.logEvent(
            "first_purchase_completed",
            {
                sku: sku,
                price_in_cents: priceInCents,
                purchase_session_id: this.getEventSessionId("purchase")
            }
        )
    }

    logDepthReached(newDepth)
    {
        this.logEvent(
            "depth_reached",
            {
                depth: newDepth
            }
        )
    }

    logBlackChestOpened(superMinerId, superMinerRarity, superMinerSoulsAmount)
    {
        this.logEvent(
            "black_chest_opened",
            {
                super_miner_id: superMinerId,
                super_miner_rarity: superMinerRarity,
                super_miner_souls_amount: superMinerSoulsAmount,
            }
        )
    }

    logOrangeFishCollected(atDepth)
    {
        this.logEvent(
            "orange_fish_found",
            {
                depth: atDepth
            }
        )
    }

    logDrillUpgrade(upgradedPartIndex, newPartLevel, wattagePercentChange, cargoPercentChange)
    {
        this.logEvent(
            "drill_upgraded",
            {
                upgraded_part_index: upgradedPartIndex,
                new_part_level: newPartLevel,
                wattage_percent_change: wattagePercentChange,
                cargo_percent_change: cargoPercentChange
            }
        )
    }

    logMinerPurchase(world, newCount, newLevel)
    {
        this.logEvent(
            "miner_upgrade_purchased",
            {
                world: world,
                new_miner_count: newCount,
                new_miner_level: newLevel
            }
        )
    }

    logStructureUpgrade(structureId, newLevel)
    {
        this.logEvent(
            "structure_upgraded",
            {
                structure_id: structureId,
                new_level: newLevel
            }
        )
    }

    logExcavationStarted(scientistRarity, scientistLevel, deathChance, rewardId, duration)
    {
        this.logEvent(
            "excavation_started",
            {
                scientist_rarity: scientistRarity,
                scientist_level: scientistLevel,
                death_chance: deathChance,
                reward_id: rewardId,
                duration: duration
            }
        )
    }

    logCaveStarted(caveDepth)
    {
        this.logEvent(
            "cave_started",
            {
                cave_depth: caveDepth,
                total_caves_explored: numberOfCavesExplored
            }
        )
    }

    logQuestCompleted(questId)
    {
        this.logEvent(
            "quest_completed",
            {
                quest_id: questId
            }
        )
    }

    logRedeemedCode(code)
    {
        this.logEvent(
            "code_redeemed",
            {
                code: code
            }
        )
    }

    logAdLoaded(loadDuration, networkName, revenue, trackingDisabled)
    {
        this.setEventSessionId("ad");
        this.logEvent(
            "ad_loaded",
            {
                load_duration: loadDuration,
                ad_session_id: this.getEventSessionId("ad"),
                network: networkName,
                revenue: revenue,
                tracking_disabled: trackingDisabled
            }
        )
    }

    logAdStarted(networkName, revenue, trackingDisabled, placementId)
    {
        this.logEvent(
            "ad_started",
            {
                ad_session_id: this.getEventSessionId("ad"),
                network: networkName,
                revenue: revenue,
                tracking_disabled: trackingDisabled,
                placement: placementId
            }
        )
    }

    logAdCompleted(watchDuration, networkName, revenue, trackingDisabled, placementId)
    {
        this.logEvent(
            "ad_completed",
            {
                completion_duration: watchDuration,
                ad_session_id: this.getEventSessionId("ad"),
                network: networkName,
                revenue: revenue,
                tracking_disabled: trackingDisabled,
                placement: placementId
            }
        );
        this.clearEventSessionId("ad");
    }

    logAdError(errorCode, networkName, revenue, trackingDisabled, placementId = null)
    {
        this.logEvent(
            "ad_failed",
            {
                error_code: errorCode,
                ad_session_id: this.getEventSessionId("ad"),
                network: networkName,
                revenue: revenue,
                tracking_disabled: trackingDisabled,
                placement: placementId
            }
        )
        this.clearEventSessionId("ad");
    }

    logClickedCommunityButton()
    {
        this.logEvent(
            "community_button_clicked",
            {}
        )
    }

    logImportedSaveFile()
    {
        this.logEvent(
            "game_imported",
            {}
        )
    }

    logExportedSaveFile()
    {
        this.logEvent(
            "game_exported",
            {}
        )
    }
}

const playsaurusSdk = new PlaysaurusSdk();