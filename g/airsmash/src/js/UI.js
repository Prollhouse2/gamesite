import 'perfect-scrollbar/jquery';

var minimapMobs = {},
    ignoredPlayerIdSet = {},
    delayedGraphicsResizeTimer = null,
    isChatBoxVisible = false,
    chatLineId = 0,
    isChatHintRemoved = false,
    s = -1,
    a = 0,
    isChatMinimized = false,
    unreadMessageCount = 0,
    isScoreVisible = false,
    getScoresIntervalId = null,
    isContextMenuVisible = false,
    lastClickedPlayerId = null,
    isHelpVisible = false,
    isMainMenuVisible = false,
    isTooltipVisible = false,
    hideTooltipTimer = null,
    tooltipId = 0,
    isInviteVisible = false,
    isLoginVisible = false,
    applyPowerupTimer = null,
    isSpectating = false,
    lastPrivateMessage = null,
    chatBoxDimensions = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    },
    noticeMessageTimerByType = {
        alert: null,
        information: null,
        default: null,
        destroyed: null
    },
    noticeMessageVisibleByType = {
        alert: false,
        information: false,
        default: false,
        destroyed: false
    },
    playerStats = {
        score: -1,
        upgrades: -1,
        earnings: -1,
        kills: -1,
        deaths: -1
    },
    deathNotice = false,
    playerUpgrades = {},
    listOfPlayersKills = [],
    lastTimePlayerWasKilled = 0,
    aircraftInfoByType = {
        1: [
            "Predator",
            80,
            50,
            75,
            60,
            "BOOST",
            "Temporarily increases speed by burning energy"
        ],
        2: [
            "Goliath",
            30,
            100,
            30,
            100,
            "REPEL",
            "Repels enemy aircraft and missiles"
        ],
        3: ["Mohawk", 100, 40, 100, 40, "STRAFE", "Enables sideways flight"],
        4: [
            "Tornado",
            60,
            70,
            50,
            80,
            "MULTIFIRE",
            "Launches 3 missiles at the same time"
        ],
        5: [
            "Prowler",
            50,
            70,
            40,
            60,
            "STEALTH",
            "Becomes invisible to enemy aircraft"
        ],
        101: ["Speed"],
        102: ["Defense"],
        103: ["Energy Regen"],
        104: ["Missile Speed"]
    },
    emoteById = ["tf", "pepe", "clap", "lol", "bro", "kappa", "cry", "rage"],
    powerupNameById = ["", "Shield", "Inferno"];

UI.show = function(selector, isInlineBlock) {
    $(selector).css({
        display: isInlineBlock ? "inline-block" : "block"
    })
};

UI.hide = function(selector) {
    $(selector).css({
        display: "none"
    })
};

UI.isEmote = function(word, addColons) {
    for (var n = 0; n < emoteById.length; n++)
        if (addColons) {
            if (word === ":" + emoteById[n] + ":")
                return emoteById[n]
        } else if (word === emoteById[n])
            return emoteById[n];
    return false
};

var sanitizePossiblyEscapedHtml = function(html) {
    return UI.escapeHTML(html
        .replace(/&#x2F;/g, '/')
        .replace(/&#x27;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&gt;/g, '>')
        .replace(/&lt;/g, '<')
        .replace(/&amp;/g, '&')
        )
}

var sanitizeServerMessageHtml = function(html) {
    let ctfFlagPattern = /^(<span class="info inline"><span class="(blueflag|redflag)"><\/span><\/span>(Captured|Returned|Taken) by )(.*)$/m;
    let result = ctfFlagPattern.exec(html);
    if (result) {
        let name = Tools.stripBotsNamePrefix(result[4]);
        return result[1] + sanitizePossiblyEscapedHtml(name);
    }

    return UI.escapeHTML(html.replace(/<br>/g,'\n')).replace(/\n/g,'<br>');
}

UI.serverMessage = function(msg) {
    let type = "alert";

    if (msg.type == 2) {
        type = "information"
    }

    UI.showMessage(type, sanitizeServerMessageHtml(msg.text), msg.duration)
};

UI.showMessage = function(msgType, htmlContents, timeoutMs) {
    $("#msg-" + msgType).removeClass("hidemsg").removeClass("popmsg"),
    $("#msg-" + msgType).html(htmlContents);
    var r = $("#msg-" + msgType).height();
    "default" != msgType && "destroyed" != msgType || $("#msg-" + msgType).css({
        "margin-top": "-" + Math.round(r / 2) + "px"
    }),
    $("#msg-" + msgType).addClass("popmsg"),
    noticeMessageVisibleByType[msgType] = true,
    clearTimeout(noticeMessageTimerByType[msgType]),
    noticeMessageTimerByType[msgType] = setTimeout(UI.hideMessage, timeoutMs || 2e3, msgType)
};

UI.hideMessage = function(msgType) {
    $("#msg-" + msgType).addClass("hidemsg"),
    noticeMessageVisibleByType[msgType] = false,
    noticeMessageTimerByType[msgType] = setTimeout(function(t) {
        $("#msg-" + msgType).removeClass("popmsg").removeClass("hidemsg"),
        $("#msg-" + t).html("")
    }, 2500, msgType)
};

UI.wipeAllMessages = function() {
    for (var e in noticeMessageVisibleByType)
        noticeMessageVisibleByType[e] && UI.showMessage(e, "", 100)
};

UI.updateMyLevel = function(newLevel) {
    game.myLevel = newLevel;
    $("#score-rank").html(newLevel);
    $("#lifetime-rank").html(newLevel);
};

UI.newScore = function (scoreUpdate) {
    if (scoreUpdate.id != game.myID) {
        return false;
    }

    let scoreChange = scoreUpdate.score - game.myScore;
    let msg = "";

    if (Math.abs(scoreChange) < 1) {
        scoreChange = false;
    }

    game.myScore = scoreUpdate.score;

    if (scoreUpdate.score != playerStats.score) {
        playerStats.score = scoreUpdate.score;
    }

    $("#score-score").html(scoreUpdate.score);

    if (scoreUpdate.upgrades != playerStats.upgrades) {
        let upgradesChange = scoreUpdate.upgrades - playerStats.upgrades;
        let playerHadUpgrades = (playerStats.upgrades != -1);

        playerStats.upgrades = scoreUpdate.upgrades;
        $("#score-upgrades").html(scoreUpdate.upgrades);
        updateUpgradesLighted();

        if (playerHadUpgrades && upgradesChange > 0) {
            Sound.powerup(4, null);

            if (deathNotice) {
                deathNotice.msg += "<br>";
            }

            if (noticeMessageVisibleByType.default) {
                msg += '&nbsp;&nbsp;<span class="upgrade">+' + upgradesChange + "</span>";
                $("#alert-update").append(msg);
                return;
            }

            msg += '<span id="alert-update"><span class="upgrade">+' + upgradesChange + '<span class="bold"> upgrade</span></span></span>'
        }
    }

    if (scoreUpdate.earnings != playerStats.earnings && game.myLevel != 0) {
        playerStats.earnings = scoreUpdate.earnings;
        $("#lifetime-totalbounty").html(scoreUpdate.earnings);

        let nextbounty = Math.ceil(Tools.rankToEarnings(game.myLevel + 1) - scoreUpdate.earnings);
        $("#lifetime-nextbounty").html("+" + nextbounty)
    }

    if (scoreUpdate.totalkills != playerStats.kills || scoreUpdate.totaldeaths != playerStats.deaths) {
        let kdratio = (scoreUpdate.totalkills == 0 || scoreUpdate.totaldeaths == 0) ? "-" : (scoreUpdate.totalkills / scoreUpdate.totaldeaths).toFixed(2)
        $("#lifetime-kdratio").html(kdratio)
    }

    if (scoreUpdate.totalkills != playerStats.kills) {
        playerStats.kills = scoreUpdate.totalkills;
        $("#lifetime-kills").html(scoreUpdate.totalkills);
    }

    if (scoreUpdate.totaldeaths != playerStats.deaths) {
        playerStats.deaths = scoreUpdate.totaldeaths;
        $("#lifetime-deaths").html(scoreUpdate.totaldeaths);
    }

    if (scoreChange) {
        if (deathNotice) {
            deathNotice.msg += "<br>";
        }
        msg += UI.getScoreString(scoreChange);
    }

    if (deathNotice) {
        UI.showMessage(deathNotice.type, deathNotice.msg + msg, deathNotice.duration);
        deathNotice = false;
    } else {
        if (msg != "") {
            UI.showMessage("default", msg, 3000)
        }
    }
};

UI.getScoreString = function(e, t, n) {
    var r = "positive",
        i = "+";
    return e < 0 && (r = "negative",
    i = "-"),
    t && (r = t),
    '<span id="alert-update" class="' + r + '">' + i + Math.abs(e) + "</span>"
};

var updateMinimapMob = function(minimapMob) {
    minimapMob.sprite.position.set(game.screenX - config.minimapPaddingX - config.minimapSize * ((16384 - minimapMob.x) / 32768), game.screenY - config.minimapPaddingY - config.minimapSize / 2 * ((8192 - minimapMob.y) / 16384))
};

UI.wipeAllMinimapMobs = function() {
    for (var playerId in minimapMobs)
        game.graphics.layers.ui1.removeChild(minimapMobs[playerId].sprite),
        minimapMobs[playerId].sprite.destroy(),
        delete minimapMobs[playerId]
};

UI.showSpectator = function(e) {
    if (!isSpectating) {
        var t = config.mobile ? ' class="mobile"' : "";
        $("body").append('<div id="spectator"' + t + "></div>"),
        isSpectating = true
    }
    $("#spectator").html(e),
    Input.addTouchRejection("#spectator")
};

UI.hideSpectator = function() {
    isSpectating && ($("#spectator").remove(),
    isSpectating = false)
};

UI.addPowerup = function(e, t) {
    null != applyPowerupTimer && clearTimeout(applyPowerupTimer);
    var n = '<div class="powerup" id="powerup-' + e + '"><div class="percent ' + (1 == e ? "shield" : "rampage") + '" id="powerup-' + e + '-percent" style="transition: width ' + t + 'ms linear;"></div><div class="name">' + powerupNameById[e] + "</div></div>";
    $("#powerups").html(n),
    $("#powerup-" + e + "-percent").width(),
    $("#powerup-" + e + "-percent").css({
        width: "7%"
    }),
    applyPowerupTimer = setTimeout(function() {
        $("#powerup-" + e).remove()
    }, t)
};

UI.resetPowerups = function() {
    $("#powerups").html("")
};

UI.changeMinimapTeam = function(playerId, team) {
    if (null != minimapMobs[playerId] && null != minimapMobs[playerId].sprite) {
        var r = 1 == team ? "minimapBlue" : "minimapMob";
        minimapMobs[playerId].sprite.texture = Textures.getNamed(r)
    }
};

UI.scoreboardUpdate = function (msgData, msgRankings, maxScoreboard) {
    var player;
    var livePlayerIdSet = {};
    var somethingLikeHighestPlayerId = 0;

    for (var i = 0; i < msgRankings.length; i++) {
        if (null != (player = Players.get(msgRankings[i].id))) {
            var miniMapPos = Tools.decodeMinimapCoords(msgRankings[i].x, msgRankings[i].y);
            player.lowResPos.x = miniMapPos.x;
            player.lowResPos.y = miniMapPos.y;
            if (msgRankings[i].id != game.myID) {
                if (!(0 == msgRankings[i].x && 0 == msgRankings[i].y)) {
                    livePlayerIdSet[player.id] = true;
                    if (null == minimapMobs[msgRankings[i].id]) {
                        var mobTextureName = "minimapMob";
                        if (GameType.CTF == game.gameType && 1 == player.team) {
                            mobTextureName = "minimapBlue";
                        }
                        minimapMobs[msgRankings[i].id] = {
                            sprite: Textures.init(mobTextureName),
                            x: miniMapPos.x,
                            y: miniMapPos.y
                        };
                    } else {
                        minimapMobs[msgRankings[i].id].x = miniMapPos.x;
                        minimapMobs[msgRankings[i].id].y = miniMapPos.y;
                    }
                    updateMinimapMob(minimapMobs[msgRankings[i].id]);
                }
                else {
                    let player = Players.get(msgRankings[i].id);
                    /*
                       If a player is missing from the minimap for longer than the 3s
                       post-death duration (PLAYERS_DEATH_INACTIVITY_MS in ab-server)
                       after their kill, then we assume the player is spectating.
                       
                       We have knowledge of these last-killed times because all player 
                       kills are broadcast to all players. However, if we join a game 
                       and a player has been killed just before that, we don't know if
                       they are spectating or just awaiting revival.

                       So we assume they are spectating, by having the lastKilled 
                       property initialised to zero (rather than performance.now()) in 
                       Player constructor. If this is wrong, it will be corrected within
                       a few seconds, when they respawn/revive.
                    */
                    if (player && performance.now() - player.lastKilled > 3000) {
                        player.spectate = true;
                    }
                }
            } else {
                somethingLikeHighestPlayerId = i + 1;
            }
        }
    }

    for (var id in minimapMobs) {
        if (null == livePlayerIdSet[id]) {
            game.graphics.layers.ui1.removeChild(minimapMobs[id].sprite);
            minimapMobs[id].sprite.destroy();
            delete minimapMobs[id];
        }
    }

    if (!somethingLikeHighestPlayerId) {
        return;
    }

    if (maxScoreboard) {
        maxScoreboard = Tools.clamp(maxScoreboard, 1, msgData.length);
    } else {
        maxScoreboard = msgData.length;
    }

    var playerRank = 0;
    var isEndOfScoreboard = false;
    var html = "";

    for (var i = 0; i < maxScoreboard && !isEndOfScoreboard; i++) {
        if (!(player = Players.get(msgData[i].id))) {
            continue;
        }

        playerRank++;
        var badgeHtml;
        if (playerRank == 1) {
            badgeHtml = '<span class="badge scoreboard gold"></span>';
        } else if (playerRank == 2) {
            badgeHtml = '<span class="badge scoreboard silver"></span>';
        } else if (playerRank == 3) {
            badgeHtml = '<span class="badge scoreboard bronze"></span>';
        } else {
            badgeHtml = playerRank + ".";
        }

        var isCurPlayerClass = player.me() ? " sel" : "";
        var curPlayerScore = msgData[i].score;
        var curPlayerLevel = player.bot ? "bot" : msgData[i].level;

        if (somethingLikeHighestPlayerId > maxScoreboard && playerRank == maxScoreboard - 1) {
            html += '<div class="line dottedline">&middot; &middot; &middot;</div>';
            player = Players.get(game.myID);
            badgeHtml = somethingLikeHighestPlayerId + ".";
            curPlayerScore = game.myScore;
            curPlayerLevel = game.myLevel;
            isCurPlayerClass = " sel";
            isEndOfScoreboard = true;
        }

        let playerNameClass = '';
        let playerScoreClass = '';
        if (GameType.CTF == game.gameType) {
            playerNameClass = " team-" + player.team
        }

        let placeCssClass = '';
        if (4 == (badgeHtml + "").length) {
            placeCssClass = " bigger"
        }

        if (player.isSpectating() && !player.bot) {
            playerNameClass += ' spectating';
            placeCssClass += ' spectating';
            playerScoreClass = ' spectating';
        }

        html += (
            '<div class="line ' + isCurPlayerClass + '">' +
                '<span class="place ' + placeCssClass + '">' +
                    badgeHtml +
                '</span>' +
                '<span class="flag small flag-' + player.flag + '" ' +
                    'title="' + getFlagLabel(player.flag) + '"></span>' +
                '<span class="nick' + playerNameClass + '">' +
                    UI.escapeHTML(Tools.mungeNonAscii(player.name, player.id)) +
                '</span>'
        );
        if (curPlayerLevel) {
            html += (
                '<span class="holder">' +
                    '&nbsp;' +
                    '<span class="rank' + (player.bot ? ' bot' : '') + '">' + curPlayerLevel + '</span>' +
                '</span>'
            );
        }
        html += (
                '<span class="score' + playerScoreClass + '">' +
                    wrapCharsInSpans(curPlayerScore) +
                '</span>' +
            '</div>'
        );
    }

    if (!isEndOfScoreboard && msgData.length > maxScoreboard) {
        html += '<div class="line dottedline">&middot; &middot; &middot;</div>';
    }
    
    $("#scoreboard").html(html);
};

var wrapCharsInSpans = function (str) {
    var s = "";
    str += "";
    for (var n = 0; n < str.length; n++)
        s += "<span>" + str[n] + "</span>";
    return s
};

UI.toggleChatBox = function(e) {
    if (!config.mobile)
        if (isChatBoxVisible) {
            if (isChatBoxVisible = false,
            e) {
                var t = $("#chatinput").val();
                "" !== t && "" !== t.trim() && (UI.parseCommand(t.trim()) || Network.sendChat(t)),
                removeChatHint()
            }
            UI.hide("#chatinput"),
            $("#chatinput").val(""),
            $("#chatinput").blur()
        } else
            isChatMinimized && UI.maximizeChat(),
            Input.clearKeys(true),
            isChatBoxVisible = true,
            UI.show("#chatinput"),
            $("#chatinput").focus()
};

UI.shortcutChat = function(e) {
    isChatBoxVisible || ($("#chatinput").val(e),
    UI.toggleChatBox())
};

var removeChatHint = function() {
    isChatHintRemoved || (isChatHintRemoved = true,
    $("#chat-0").length && $("#chat-0").remove())
};

/**
 * @param {string} s
 * @return {?}
 */
UI.parseCommand = function(chatInput) {
    if("/" !== chatInput[0]) {
        return false;
    }

    var words = chatInput.split(" ");
    var command = words[0].substr(1).toLowerCase();
    if(0 == command.length) {
        return false;
    }

    var player;
    if("s" === command) {
        var eIndex = chatInput.indexOf(" ");
        var value = chatInput.substr(eIndex + 1);
        if(value.length > 0) {
            Network.sendSay(value);
        }
    } else if("t" === command) {
        eIndex = chatInput.indexOf(" ");
        var value = chatInput.substr(eIndex + 1);
        if(value.length > 0) {
            Network.sendTeam(value);
        }
    } else if("ignore" === command) {
        if(null == (player = Players.getByName(unescapePlayerName(words[1])))) {
            UI.addChatMessage("Unknown player");
        } else {
            UI.chatIgnore(player.id);
        }
    } else if("unignore" === command) {
        if(null == (player = Players.getByName(unescapePlayerName(words[1])))) {
            UI.addChatMessage("Unknown player");
        } else {
            UI.chatUnignore(player);
        }
    } else if("votemute" === command) {
        if(null == (player = Players.getByName(unescapePlayerName(words[1])))) {
            UI.addChatMessage("Unknown player");
        } else {
            UI.chatVotemute(player);
        }
    } else if("w" === command) {
        if(words.length >= 3) {
            UI.chatWhisper(words[1], chatInput.substr(4 + words[1].length));
        } else {
            UI.addChatMessage("Usage: /w player message");
        }
    } else if("spectate" === command) {
        if(null == (player = Players.getByName(unescapePlayerName(words[1])))) {
            UI.addChatMessage("Unknown player");
        } else {
            Network.sendCommand("spectate", player.id + "");
        }
    } else if("flag" === command || "flags" === command) {
        if(2 == words.length) {
            Network.sendCommand("flag", chatInput.substr(command.length + 2));
        } else {
            UI.addChatMessage("Type /flag XX where XX is the 2-letter ISO code of a country", true);
        }
    } else if("emotes" === command) {
        UI.addChatMessage("Emotes available: /tf /pepe /clap /lol /bro /kappa /cry /rage", true);
    } else if("help" === command) {
        UI.toggleHelp();
    } else if(!("debug" === command)) {
        if(UI.isEmote(command)) {
            Network.sendSay(":" + command + ":");
        } else {
            Network.sendCommand(command, chatInput.substr(command.length + 2));
        }
    }
    return true;
};


UI.onChatlineClick = function(event)
{
    if(! (navigator.clipboard && navigator.clipboard.writeText)) {
        return;
    }

    navigator.clipboard.writeText(event.target.innerText);
    UI.serverMessage({
        type: 1,
        text: "Copied to clipboard",
        duration: 1000
    });
};


UI.addChatLine = function(msg, text, msgType) {
    if (!ignoredPlayerIdSet[msg.id]) {
        chatLineId++;
        if (0 == msgType)
            var o = '<div id="chat-' + chatLineId + '" class="line"><span class="playersel" data-playerid="' + msg.id + '"><span class="flag small flag-' + msg.flag + '" title="' + getFlagLabel(msg.flag) + '"></span><span class="nick">' + UI.escapeHTML(msg.name) + '</span></span><span class="text">' + UI.escapeHTML(text, true) + "</span></div>";
        else if (1 == msgType || 2 == msgType) {
            var a = 1 == msgType ? "TO" : "FROM";
            2 == msgType && (lastPrivateMessage = escapePlayerName(Tools.mungeNonAscii(msg.name, msg.id)));
            o = '<div id="chat-' + chatLineId + '" class="line"><span class="tag whisper">' + a + '</span><span class="playersel" data-playerid="' + msg.id + '"><span class="nick green">' + UI.escapeHTML(msg.name) + '</span></span><span class="text green">' + UI.escapeHTML(text, true) + "</span></div>";
            s = -1
        } else {
            o = '<div id="chat-' + chatLineId + '" class="line"><span class="tag team">TEAM</span><span class="playersel" data-playerid="' + msg.id + '"><span class="nick blue">' + UI.escapeHTML(msg.name) + '</span></span><span class="text blue">' + UI.escapeHTML(text, true) + "</span></div>";
            s = -1
        }
        var o = $(o);
        o.click(UI.onChatlineClick);
        var c = "#chat-" + (chatLineId - config.maxChatLines);
        if ($(c).length && $(c).remove(),
        $("#chatlines").append(o),
        isChatMinimized)
            unreadMessageCount++,
            $("#chatunreadlines").html(unreadMessageCount),
            1 == unreadMessageCount && UI.show("#chatunreadlines", true);
        else {
            var h = $("#chatbox");
            1 != msgType && 2 != msgType && msg.id != game.myID && h.is(":hover") || (h.perfectScrollbar("update"),
            h.scrollTop(h[0].scrollHeight))
        }
    }
};

UI.addChatMessage = function(text, isNotWarning) {
    a = 0,
    s = -1;
    var n = '<div id="chat-' + ++chatLineId + '" class="line">' + (isNotWarning ? "" : '<span class="nick">⚠</span>') + '<span class="text">' + text + "</span></div>",
        r = "#chat-" + (chatLineId - config.maxChatLines);
    $(r).length && $(r).remove(),
    $("#chatlines").append(n);
    var o = $("#chatbox");
    o.perfectScrollbar("update"),
    o.scrollTop(o[0].scrollHeight)
};

UI.showChatLevel = function(e) {
    var t = null;
    2 == e ? t = "Type /flag XX where XX is the 2-letter ISO code of a country" : 3 == e ? t = "Emotes available: /tf /pepe /clap /lol /bro /kappa /cry /rage" : 4 == e && (t = "Flag Pack #1: communist confederate imperial rainbow jolly"),
    null != t && UI.addChatMessage(t, true)
};

/** 
 * Updates the game info display with player count, bot count, and ping time
 * 
 * For FFA, splits player count into active and spectating players
 * For CTF, also splits the player count into red and blue team active players
 */
UI.updateGameInfo = function() {
    let counts = Players.categoryCounts();
    let html = '';

    html += '<div class="item">';
    if (counts.bots > 0) {
        html += `<span class="icon-container"><div class="icon bots"></div></span><span class="greyed">${counts.bots}</span>`;
    }
    html += `<span class="icon-container padded"><div class="icon players"></div></span>${counts.players}`
    if (game.gameType === GameType.CTF) {
        html += '<span class="greyed">&nbsp;&nbsp;(';
        html += `<span style="color: #4076E2">${counts.blueTeam}</span>`;
        html += '&nbsp;/&nbsp;';
        html += `<span style="color: #EA4242">${counts.redTeam}</span>`;
        html += '&nbsp;/&nbsp;';
        html += `${counts.spectators}`;
        html += ')</span>';
    }
    else if (game.gameType === GameType.FFA) {
        html += '<span class="greyed">&nbsp;&nbsp;(';
        html += `<span style="color: #FFEC52">${counts.players - counts.spectators}</span>`;
        html += '&nbsp;/&nbsp;';
        html += `${counts.spectators}`;
        html += ')</span>';
    }
    html += `<span class="icon-container padded"><div class="icon ping"></div></span>${game.ping}<span class="millis">ms</span>`;
    html += '</div>';

    $("#gameinfo").html(html);
}

/**
 * PING_RESULT message handler
 */
UI.updateStats = function(msg) {
    game.ping = msg.ping;
    UI.updateGameInfo();
};

UI.sayLine = function(e) {
    Players.say(e)
};

UI.escapeHTML = function(s, autolink) {
    s = ("" + s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;")
        .replace(/\//g, "&#x2F;")
        .replace(/`/g, "&#x60;");

    if (autolink) {
        s = s.replace(/\b(https?:|www\.|[\w.]+\.com)[^\s]*/gi, function(s) {
            var link = s;
            if(link.toLowerCase().indexOf('http') != 0) {
                link = 'http://' + link;
            }
            return '<a target="_blank" href="' + link + '">' + s + '</a>';
        });
    }

    return s;
};

var onWindowResize = function() {
    var width = window.innerWidth,
        height = window.innerHeight;
    width == game.screenX && height == game.screenY || (UI.scheduleGraphicsResize(250));
};

UI.controlKey = function(keyCode, bindName, alwaysTrue) {
    if (game.state != Network.STATE.PLAYING)
        return true;
    if (alwaysTrue)
        if (13 != keyCode) {
            if (27 == keyCode)
                return isChatBoxVisible && UI.toggleChatBox(false),
                void UI.closeAllPanels();
            if (191 != keyCode)
                if (75 != keyCode)
                    switch (bindName) {
                    case "ALTZOOM":
                        UI.toggleScaleAltMode();
                        break;
                    case "ZOOMIN":
                        UI.scaleIncrease();
                        break;
                    case "ZOOMOUT":
                        UI.scaleDecrease();
                        break;
                    case "DEFAULTZOOM":
                        UI.scaleDefault();
                        break;
                    case "DROPUPGRADE":
                        UI.dropUpgrade();
                        break;
                    case "DROPFLAG":
                        UI.dropFlag();
                        break;
                    case "SHOWSCORE":
                        UI.toggleScore();
                        break;
                    case "MAINMENU":
                        UI.toggleMainMenu();
                        break;
                    case "SHOWGAMES":
                        Games.toggleGames();
                        break;
                    case "FULLSCREEN":
                        Graphics.toggleFullscreen(),
                        Input.clearKeys();
                        break;
                    case "MINIMIZECHAT":
                        UI.minimizeChat();
                        break;
                    case "MAXIMIZECHAT":
                        UI.maximizeChat();
                        break;
                    case "SAY":
                        UI.shortcutChat("/s ");
                        break;
                    case "TEAM":
                        UI.shortcutChat("/t ");
                        break;
                    case "REPLY":
                        null != lastPrivateMessage && UI.shortcutChat("/w " + lastPrivateMessage + " ");
                        break;
                    case "SPECTATE":
                        Network.spectateForce();
                        break;
                    case "UPGRADE1":
                        UI.selectUpgrade(1);
                        break;
                    case "UPGRADE2":
                        UI.selectUpgrade(2);
                        break;
                    case "UPGRADE3":
                        UI.selectUpgrade(3);
                        break;
                    case "UPGRADE4":
                        UI.selectUpgrade(4);
                        break;
                    case "SOUND":
                        Sound.toggle();
                        break;
                    case "HELP":
                        UI.toggleHelp();
                        break;
                    case "INVITE":
                        UI.toggleInvite();
                        break;
                    case "MOUSEMODE":
                        Input.toggleMouse()
                    }
                else
                    Input.toggleKeybinds();
            else
                UI.shortcutChat("/")
        } else
            UI.toggleChatBox(true)
};

UI.chatBoxOpen = function() {
    return isChatBoxVisible
};

UI.setupMinimap = function() {
    game.graphics.gui.minimap = Textures.init("minimap"),
    game.graphics.gui.minimap_box = Textures.init("minimapBox"),
    UI.resizeMinimap(),
    UI.visibilityMinimap(false)
};

UI.visibilityMinimap = function(isVisible) {
    game.graphics.gui.minimap.visible = isVisible,
    game.graphics.gui.minimap_box.visible = isVisible
};

UI.resizeMinimap = function() {
    game.graphics.gui.minimap.scale.set(config.minimapSize / 512),
    game.graphics.gui.minimap.position.set(game.screenX - config.minimapPaddingX, game.screenY - config.minimapPaddingY),
    game.graphics.gui.minimap_box.scale.set(.03 + 2 * config.minimapSize * (game.screenX / game.scale / 32768) / 64, .03 + config.minimapSize * (game.screenY / game.scale / 16384) / 64);
    for (var playerId in minimapMobs)
        updateMinimapMob(minimapMobs[playerId]);
    Games.update(true)
};

UI.setupHUD = function() {
    game.graphics.gui.hudHealth_shadow = Textures.init("hudHealth_shadow"),
    game.graphics.gui.hudHealth = Textures.init("hudHealth"),
    game.graphics.gui.hudHealth_mask = Textures.init("hudHealth_mask"),
    game.graphics.gui.hudHealth_mask.blendMode = PIXI.BLEND_MODES.LUMINOSITY,
    game.graphics.gui.hudHealth.rotation = -1.5,
    game.graphics.gui.hudHealth.position.set(330, 174),
    game.graphics.gui.hudHealth_mask.position.set(330, 174),
    game.graphics.gui.hudEnergy_shadow = Textures.init("hudEnergy_shadow"),
    game.graphics.gui.hudEnergy = Textures.init("hudEnergy"),
    game.graphics.gui.hudEnergy_mask = Textures.init("hudEnergy_mask"),
    game.graphics.gui.hudEnergy_mask.blendMode = PIXI.BLEND_MODES.LUMINOSITY,
    game.graphics.gui.hudEnergy.position.set(-250, 174),
    game.graphics.gui.hudEnergy_mask.position.set(-250, 174),
    UI.resizeHUD(),
    UI.visibilityHUD(false)
};

UI.visibilityHUD = function(e) {
    game.graphics.gui.hudHealth_shadow.visible = e,
    game.graphics.gui.hudHealth.visible = e,
    game.graphics.gui.hudEnergy_shadow.visible = e,
    game.graphics.gui.hudEnergy.visible = e
};

UI.resizeHUD = function() {
    var e = 0.5 * game.scale,
        t = game.halfScreenX - 30 * game.scale,
        n = game.halfScreenX + 30 * game.scale;
    game.graphics.gui.hudHealth_shadow.scale.set(e),
    game.graphics.gui.hudEnergy_shadow.scale.set(e),
    game.graphics.gui.hudHealth_shadow.position.set(t, game.halfScreenY),
    game.graphics.gui.hudEnergy_shadow.position.set(n, game.halfScreenY),
    game.graphics.gui.hudSpriteHealth.scale.set(e),
    game.graphics.gui.hudSpriteHealth.position.set(t, game.halfScreenY),
    game.graphics.gui.hudSpriteEnergy.scale.set(e),
    game.graphics.gui.hudSpriteEnergy.position.set(n, game.halfScreenY)
};

UI.selectAircraft = function(e) {
    Network.sendCommand("respawn", e + "")
};

UI.aircraftSelected = function(e) {
    e = parseInt(e);
    for (var t = 1; t <= 5; t++)
        t == e ? $("#selectaircraft-" + t).addClass("sel") : $("#selectaircraft-" + t).removeClass("sel")
};

UI.killed = function(victim) {
    let levelBotHtml = '';
    if (victim.bot) {
        levelBotHtml = '<span class="level bot">bot</span>';
    }
    else if (victim.level) {
        levelBotHtml = '<span class="level">' + victim.level + '</span>';
    }
    (game.time - lastTimePlayerWasKilled > 1500 || listOfPlayersKills.length >= 6) && (listOfPlayersKills = []),
    lastTimePlayerWasKilled = game.time,
    listOfPlayersKills.push([victim.flag, victim.name, levelBotHtml]);
    for (var n = "", r = "", i = 0; i < listOfPlayersKills.length; i++)
        r = listOfPlayersKills[i][1],
        1 != listOfPlayersKills.length && r.length > 10 && (r = r.substr(0, 10) + "..."),
        n += '<span class="player"><span class="flag big flag-' + listOfPlayersKills[i][0] + '"></span>' + UI.escapeHTML(r) + listOfPlayersKills[i][2] + "</span>";
    deathNotice = {
        type: "default",
        duration: 3e3,
        msg: "You have destroyed" + n
    }
};

UI.killedBy = function(killer) {
    let levelBotHtml = '';
    if (killer.bot) {
        levelBotHtml = '<span class="level bot">bot</span>';
    }
    else if (killer.level) {
        levelBotHtml = '<span class="level">' + killer.level + '</span>';
    }
    deathNotice = {
        type: "destroyed",
        duration: 3e3,
        msg: 'Destroyed by<span class="playerbig"><span class="flag big flag-' + killer.flag + '"></span>' + UI.escapeHTML(killer.name) + levelBotHtml + "</span>"
    }
};

UI.errorHandler = function(e) {
    switch (e.error) {
    case 1:
        UI.showMessage("alert", '<span class="info">DISCONNECTED</span>Packet flooding detected<br><span class="button" onclick="Network.reconnect()">RECONNECT</span>', 2e4),
        Network.receivedError(e.error);
        break;
    case 2:
        UI.showMessage("alert", `<span class="info">BANNED</span>You have been banned from this server (${UI.escapeHTML(game.server.id)}) for packet flooding`, 2e4),
        Network.receivedError(e.error);
        break;
    case 3:
        UI.showMessage("alert", `<span class="info">BANNED</span>You have been banned from this server (${UI.escapeHTML(game.server.id)})`, 2e4),
        Network.receivedError(e.error);
        break;
    case 4:
        Network.receivedError(e.error),
        Games.redirRoot();
        break;
    case 5:
        UI.showMessage("alert", '<span class="info">RESPAWN</span>Full health and 2 seconds of inactivity required', 3e3);
        break;
    case 6:
        let message = 'AFK time exceeded the server limit';
        if (game.server.config && game.server.config.afk) {
            message = `AFK for more than ${UI.escapeHTML(game.server.config.afk)} minute${game.server.config.afk != 1 ? 's' : ''}`
        }
        UI.showMessage("alert", `<span class="info">DISCONNECTED</span>${message}<br><span class="button" onclick="Network.reconnect()">RECONNECT</span>`, 72e5),
        Network.receivedError(e.error);
        break;
    case 7:
        UI.showMessage("alert", '<span class="info">DISCONNECTED</span>You have been kicked out', 2e4),
        Network.receivedError(e.error);
        break;
    case 8:
        UI.showMessage("alert", '<span class="info">DISCONNECTED</span>Invalid login data', 2e4),
        Network.receivedError(e.error);
        break;
    case 9:
        UI.showMessage("alert", '<span class="info">DISCONNECTED</span>Incorrect protocol level<br>Please clear your browser cache and refresh', 2e4),
        Network.receivedError(e.error);
        break;
    case 10:
        UI.showMessage("alert", '<span class="info">BANNED</span>Account banned', 2e4),
        Network.receivedError(e.error);
        break;
    case 11:
        UI.showMessage("alert", '<span class="info">DISCONNECTED</span>Account already logged in<br><span class="button" onclick="Network.reconnect()">RECONNECT</span>', 2e4),
        Network.receivedError(e.error);
        break;
    case 12:
        UI.showMessage("alert", '<span class="info">RESPAWN</span>Cannot respawn or change aircraft in a Battle Royale game', 3e3);
        break;
    case 13:
        UI.showMessage("alert", '<span class="info">SPECTATE</span>Full health and 2 seconds of inactivity required', 3e3);
        break;
    case 20:
        UI.showMessage("information", '<span class="info">UPGRADE</span>Not enough upgrade points', 3e3);
        break;
    case 30:
        UI.addChatMessage("Chat throttled to prevent spamming");
        break;
    case 31:
        UI.showMessage("alert", '<span class="info">THROTTLED</span>Flag change too fast');
        break;
    case 100:
        UI.addChatMessage("Unknown command")
    }
};

UI.showCommandReply = function(e) {
    if (0 == e.type)
        UI.addChatMessage(UI.escapeHTML(e.text, true));
    else {
        var t = JSON.stringify(JSON.parse(e.text), null, "    "),
            n = '<div class="close" onclick="$(this).parent().remove()"></div><div class="text"><pre>' +
                UI.escapeHTML(t, true) +
                "</pre></div>";
        $("body").append('<div id="debugpopup" oncontextmenu="event.stopPropagation()">' + n + "</div>")
    }
};

UI.updateHUD = function(e, t, n) {
    e = Tools.clamp(e, 0, 1),
    t = Tools.clamp(t, 0, 1),
    game.graphics.gui.hudHealth.rotation = -1.1 * (1 - e),
    game.graphics.gui.hudEnergy.rotation = Math.PI + 1.1 * (1 - t),
    game.graphics.gui.hudHealth.tint = e > .5 ? Tools.colorLerp(13487404, 2591785, 2 * (e - .5)) : Tools.colorLerp(12201261, 13487404, 2 * e);
    var r = 3374821;
    n && (r = t < config.ships[n.type].energyLight ? 2841755 : 3374821),
    game.graphics.gui.hudEnergy.tint = r
};

UI.minimizeChat = function(e) {
    isChatMinimized || (isChatBoxVisible && UI.toggleChatBox(),
    isChatMinimized = true,
    unreadMessageCount = 0,
    UI.hide("#chatbox"),
    UI.hide("#chatunreadlines"),
    UI.show("#maximizechat"),
    e && e.stopPropagation())
};

UI.maximizeChat = function() {
    if (isChatMinimized) {
        isChatMinimized = false,
        UI.hide("#maximizechat"),
        UI.hide("#chatunreadlines"),
        UI.show("#chatbox");
        var e = $("#chatbox");
        e.scrollTop(e[0].scrollHeight)
    }
};

UI.closeScore = function() {
    isScoreVisible && (UI.hidePanel("#scoredetailed"),
    isScoreVisible = false,
    clearInterval(getScoresIntervalId))
};

UI.openScore = function() {
    isScoreVisible || (UI.closeAllPanels("score"),
    UI.showPanel("#scoredetailed"),
    isScoreVisible = true,
    Network.getScores(),
    clearInterval(getScoresIntervalId),
    getScoresIntervalId = setInterval(Network.getScores, 5e3))
};

UI.toggleScore = function() {
    isScoreVisible ? UI.closeScore() : UI.openScore()
};

UI.openLogin = function() {
    isLoginVisible || (UI.showPanel("#loginselector"),
    isLoginVisible = true,
    Games.closeDropdowns())
};

UI.closeLogin = function() {
    isLoginVisible && (UI.hidePanel("#loginselector"),
    isLoginVisible = false)
};

UI.showPanel = function(id) {
    var scale0 = 0.9,
        scale1 = 1;
    if (config.phone) {
        scale0 *= 0.7;
        scale1 *= 0.7;
    }
    $(id).css({
        display: "block",
        opacity: "0",
        transform: "scale(" + scale0 + ")",
        "pointer-events": "auto"
    });
    $(id).width();
    $(id).css({
        opacity: "1",
        transform: "scale(" + scale1 + ")",
        transition: "all 0.75s cubic-bezier(0.23, 1, 0.32, 1)"
    });
    if (id != "#custom-msg") {
        Sound.UIClick()
    }
};

UI.hidePanel = function(id, visible, remove, longfadenoclick) {
    if (id != "#custom-msg" || $("#custom-msg").length) {
        var scale = 0.9;
        if (config.phone) {
            scale *= 0.7;
        }
        if (longfadenoclick) {
            $(id).css({
                transition: "all 1.5s cubic-bezier(0.23, 1, 0.32, 1)"
            });
        } else {
            $(id).css({
                transition: "all 0.75s cubic-bezier(0.23, 1, 0.32, 1)"
            });
        }
        $(id).css({
            opacity: "0",
            transform: "scale(" + scale + ")",
            "pointer-events": "none"
        });
        if (!longfadenoclick) {
            Sound.UIClick();
        }
        setTimeout(function(id) {
            let isVisible = ({
                "#mainmenu": isMainMenuVisible,
                "#scoredetailed": isScoreVisible,
                "#howtoplay": isHelpVisible,
                "#invitefriends": isInviteVisible,
                "#loginselector": isLoginVisible
            })[id];
            if (isVisible === undefined) {
                isVisible = visible;
            }
            if (!isVisible) {
                if (remove) {
                    $(id).remove();
                    return;
                }
                $(id).css({
                    display: "none",
                    transform: "none",
                    transition: "none"
                });
            }
        }, longfadenoclick ? 1600 : 800, id);
    }
};

UI.openInvite = function() {
    isInviteVisible || (UI.closeAllPanels("invite"),
    game.inviteLink = document.URL + "#" + game.server.id,
    $("#invite-link").html(game.inviteLink),
    $("#invite-link").attr("href", game.inviteLink),
    UI.showPanel("#invitefriends"),
    isInviteVisible = true)
};

UI.closeInvite = function() {
    isInviteVisible && (UI.hidePanel("#invitefriends"),
    isInviteVisible = false)
};

UI.toggleInvite = function() {
    isInviteVisible ? UI.closeInvite() : UI.openInvite()
};

UI.closeMainMenu = function() {
    isMainMenuVisible && (UI.hidePanel("#mainmenu"),
    isMainMenuVisible = false)
};

UI.updateMainMenuSettings = function() {
    config.settings.hidpi ? $("#mainmenu-hidpi-tick").addClass("ticked") : $("#mainmenu-hidpi-tick").removeClass("ticked")
};

UI.openMainMenu = function() {
    isMainMenuVisible || (UI.closeAllPanels("mainmenu"),
    UI.updateMainMenuSettings(),
    UI.showPanel("#mainmenu"),
    isMainMenuVisible = true)
};

UI.toggleMainMenu = function() {
    isMainMenuVisible ? UI.closeMainMenu() : UI.openMainMenu()
};

UI.closeAllPanels = function(e) {
    "mainmenu" !== e && UI.closeMainMenu(),
    "score" !== e && UI.closeScore(),
    "help" !== e && UI.hideHelp(),
    "games" !== e && Games.closeGames(),
    "invite" !== e && UI.closeInvite(),
    "login" !== e && UI.closeLogin(),
    "keybinds" !== e && Input.closeKeybinds(),
    $("#custom-msg").length && UI.hidePanel("#custom-msg", false, true)
};

var formatMostAwesomeMetric = function (e) {
    return (e = Math.round(e)) < 1e3 ? e : e < 1e5 ? (e / 1e3).toFixed(1) + " K" : e < 1e6 ? Math.round(e / 1e3) + " K" : (e / 1e6).toFixed(1) + " M"
};

var normalScoreColumnMap = [
    ["name", "&nbsp;"],
    ["kills", "Kills"],
    ["deaths", "Deaths"],
    ["damage", "Damage"],
    ["bounty", "Bounty"],
    ["rank", "Level"],
    ["ping", "Ping"]
];

var btrScoreColumnMap = [
    ["name", "&nbsp;"],
    ["wins", "&nbsp;"],
    ["kills", "Kills"],
    ["deaths", "Deaths"],
    ["bounty", "Bounty"],
    ["rank", "Level"],
    ["ping", "Ping"]
];

var ctfScoreColumnMap = [
    ["name", "&nbsp;"],
    ["captures", "&nbsp;"],
    ["kills", "Kills"],
    ["deaths", "Deaths"],
    ["bounty", "Bounty"],
    ["rank", "Level"],
    ["ping", "Ping"]
];

var getFlagLabel = function(flagId) {
    var code = FlagCodeById[flagId];
    if(! code) {
        return '';
    }

    var name = CountryNames[code];
    if(name) {
        return name + ' (' + code + ')';
    }

    return code;
};


UI.updateScore = function (scoreDetailedMsg) {
    if (! isScoreVisible) {
        return;
    }

    var rankNames = ["gold", "silver", "bronze"];
    var scores = scoreDetailedMsg.scores;

    scores.sort(function (e, t) {
        return t.score - e.score;
    });

    var columnMap;
    if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_BTR) {
        columnMap = btrScoreColumnMap;
    } else if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_CTF) {
        columnMap = ctfScoreColumnMap;
    } else {
        columnMap = normalScoreColumnMap;
    }

    var tableHtml = "";
    for (var o = 0; o < columnMap.length; o++) {
        tableHtml += (
            '<div class="' + columnMap[o][0] + '">' +
                columnMap[o][1] +
            '</div>'
        );
    }

    var containerHtml = "";
    var mostAwesomeMetric = -1;
    var mostAwesomePlayer = -1;

    for (var f = 0; f < scores.length; f++) {
        var player = Players.get(scores[f].id);
        if (!player) {
            continue;
        }

        var badgeHtml = f <= 2 ? '&nbsp;<div class="badge detail ' + rankNames[f] + '"></div>' : f + 1 + ".";
        var curPlayerIsMeClass = player.me() ? " sel" : "";

        let playerNameDivClass = '';
        if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_CTF) {
            playerNameDivClass += ` team-${player.team}`
        }

        let playerStatsDivClass = '';
        if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_BTR) {
            if (!scores[f].alive) {
                playerNameDivClass += ' spectating';
                playerStatsDivClass += ' spectating';
            }
        }
        else {
            if (player.isSpectating() && !player.bot) {
                playerNameDivClass += ' spectating';
                playerStatsDivClass += ' spectating';
            }
        }

        containerHtml += (
            '<div class="item ' + curPlayerIsMeClass + '">' +
                '<div class="name">' +
                    '<div class="position">' +
                        badgeHtml +
                    '</div>' +
                    '<div class="flag small flag-' + player.flag + '" ' +
                        'title="' + getFlagLabel(player.flag) + '"></div>' +
                    '<div class="player' + playerNameDivClass + '">' +
                        UI.escapeHTML(player.name) +
                    '</div>' +
                    (player.bot ? '<div class="bot">bot</div>' : '') +
                '</div>'
        );

        if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_BTR) {
            if (0 == scores[f].wins) {
                containerHtml += '<div class="wins">&nbsp;</div>';
            } else {
                containerHtml += (
                    '<div class="wins ' + playerStatsDivClass + '">' +
                        scores[f].wins +
                        '<div class="wins-container">' +
                            '&nbsp;' +
                            '<div class="wins-icon ' + playerStatsDivClass + '"></div>' +
                        '</div>' +
                    '</div>'
                );
            }
        }

        if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_CTF) {
            if (0 == scores[f].captures) {
                containerHtml += '<div class="captures">&nbsp;</div>'
            } else {
                containerHtml += (
                    '<div class="captures ' + playerStatsDivClass + '">' +
                        scores[f].captures +
                        '<div class="captures-container">&nbsp;<div class="captures-icon ' + playerStatsDivClass + '"></div></div>' +
                    '</div>'
                );
            }
        }

        containerHtml += (
            '<div class="kills ' + playerStatsDivClass + '">' + scores[f].kills + '</div>' +
            '<div class="deaths ' + playerStatsDivClass + '">' + scores[f].deaths + '</div>'
        );

        if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED) {
            containerHtml += '<div class="damage ' + playerStatsDivClass + '">' + formatMostAwesomeMetric(scores[f].damage) + "</div>";
        }

        containerHtml += (
                '<div class="bounty ' + playerStatsDivClass + '">' + scores[f].score + '</div>' +
                '<div class="rank ' + playerStatsDivClass + '">' +
                    ((0 == scores[f].level) ? "&nbsp;" : scores[f].level) +
                '</div>' +
                '<div class="ping ' + playerStatsDivClass + '">' +
                    scores[f].ping +
                    '<span class="ms">ms</span>' +
                '</div>' +
            '</div>'
        );

        if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED) {
            if (scores[f].damage > mostAwesomeMetric) {
                mostAwesomeMetric = scores[f].damage;
                mostAwesomePlayer = player;
            }
        } else if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_CTF) {
            if (scores[f].captures > mostAwesomeMetric) {
                mostAwesomeMetric = scores[f].captures;
                mostAwesomePlayer = player;
            }
        } else {
            if (scores[f].kills > mostAwesomeMetric) {
                mostAwesomeMetric = scores[f].kills;
                mostAwesomePlayer = player;
            }
        }
    }

    var playerHtml = "";
    if (scores.length > 1) {
        playerHtml = "&bull;&nbsp;&nbsp;" + scores.length + " players";
    }

    var mvpHtml = "";
    if (mostAwesomeMetric > 0) {
        if (scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED) {
            var formattedAwesomeMetric = formatMostAwesomeMetric(mostAwesomeMetric);
            var formattedAwesomeUnit = " damage";
        } else {
            formattedAwesomeMetric = mostAwesomeMetric + "";
            formattedAwesomeUnit = scoreDetailedMsg.c == Network.SERVERPACKET.SCORE_DETAILED_CTF ? " capture" : " kill";
            if (mostAwesomeMetric > 1) {
                formattedAwesomeUnit += "s";
            }
        }
        mvpHtml = `
            <div class="mvpbadge">MVP</div>
            <div class="flag flag-${ mostAwesomePlayer.flag}"></div>
            <div class="name">${ UI.escapeHTML(mostAwesomePlayer.name)}</div>
            <div class="damage">&nbsp;&nbsp;&bull;&nbsp;&nbsp;${ formattedAwesomeMetric}${formattedAwesomeUnit}</div>
        `;
    }
    $("#scoreplayers").html(playerHtml);
    $("#scoretable").html(tableHtml);
    $("#scorecontainer").html(containerHtml);
    $("#scoremvp").html(mvpHtml);
};

UI.popMenu = function(event, closeMenu) {
    if (game.state == Network.STATE.LOGIN) {
        Games.closeDropdowns()
        UI.closeLogin();
        return;
    }

    if(game.state == Network.STATE.PLAYING && !closeMenu) {
         UI.closeAllPanels();
    }

    var playerId = $(event.target).parent().data("playerid");
    if (null == playerId) {
        playerId = $(event.target).data("playerid");
    }

    if(null != playerId && playerId != game.myID) {
        var player = Players.get(playerId);
        if (null == player) {
            return true;
        }

        var cssStyle = {
            left: "20px",
            top: $(event.target).parent()[0].getBoundingClientRect().top - 166 + "px"
        };
        isContextMenuVisible || (cssStyle.display = "block",
        isContextMenuVisible = true);
        var ignoreText = null == ignoredPlayerIdSet[player.id] ? "Ignore" : "Unignore";
        var menuContent = (
            '<div class="header">' +
                UI.escapeHTML(player.name) +
            '</div>' +
            '<div class="item" onclick="UI.contextWhisper()">Whisper</div>' +
            '<div class="item" onclick="UI.context' + ignoreText + '()">' +
                ignoreText +
            '</div>' +
            '<div class="item" onclick="UI.contextVotemute()">Vote mute</div>' +
            '<div class="arrow"></div>'
        );
        $("#contextmenu").html(menuContent);
        $("#contextmenu").css(cssStyle);
        lastClickedPlayerId = player.id;
        event.stopPropagation();
        return false;
    }

    UI.closeMenu()
};

var escapePlayerName = function(playerName) {
    return (playerName + "").replace(/&/g, "&a;").replace(/ /g, "&s;")
};

var unescapePlayerName = function(e) {
    return (e + "").replace(/&s;/g, " ").replace(/&a;/g, "&")
};

UI.chatWhisper = function(playerName, t) {
    playerName = unescapePlayerName(playerName);
    var n = Players.getByName(playerName);
    null != n ? Network.sendWhisper(n.id, t) : UI.addChatMessage("Unknown player")
};

UI.chatIgnore = function(e) {
    var n = Players.get(e);
    null != n && e != game.myID && null == ignoredPlayerIdSet[n.id] && (ignoredPlayerIdSet[n.id] = true,
    UI.addChatMessage("Ignoring player " + UI.escapeHTML(n.name) + "&nbsp;&nbsp;&bull;&nbsp;&nbsp;To unignore type /unignore " + UI.escapeHTML(escapePlayerName(n.name)), true))
};

UI.chatUnignore = function(e) {
    ignoredPlayerIdSet[e.id] && (delete ignoredPlayerIdSet[e.id],
    UI.addChatMessage("Removed player " + UI.escapeHTML(e.name) + " from ignore list", true))
};

UI.chatVotemute = function(e) {
    if (e.id != game.myID) {
        Network.voteMute(e.id);
        var t = Math.floor(Math.sqrt(Players.count()[1])) + 1;
        UI.addChatMessage("Voted to mute " + UI.escapeHTML(e.name) + "&nbsp;&nbsp;&bull;&nbsp;&nbsp;" + t + " total votes are required", true)
    }
};

UI.chatVotemutePass = function(e) {
    UI.addChatMessage("The vote to mute " + UI.escapeHTML(e.name) + " has passed", true)
};

UI.chatMuted = function() {
    UI.addChatMessage("You have been muted")
};

UI.contextWhisper = function() {
    if (null != lastClickedPlayerId) {
        var e = Players.get(lastClickedPlayerId);
        null != e && lastClickedPlayerId != game.myID && UI.shortcutChat("/w " + escapePlayerName(e.name) + " ")
    }
};

UI.contextIgnore = function() {
    null != lastClickedPlayerId && lastClickedPlayerId != game.myID && UI.chatIgnore(lastClickedPlayerId)
};

UI.contextUnignore = function() {
    if (null != lastClickedPlayerId) {
        var e = Players.get(lastClickedPlayerId);
        null != e && lastClickedPlayerId != game.myID && UI.chatUnignore(e)
    }
};

UI.contextVotemute = function() {
    if (null != lastClickedPlayerId) {
        var e = Players.get(lastClickedPlayerId);
        null != e && lastClickedPlayerId != game.myID && UI.chatVotemute(e)
    }
};

UI.closeMenu = function() {
    isContextMenuVisible && (UI.hide("#contextmenu"),
    isContextMenuVisible = false)
};

UI.nameEntered = function() {
    var playerName = $("#playername").val().trim();
    if (playerName.length > 0) {
        game.myOriginalName = playerName;
        Games.start(playerName, true);
    } else {
        Games.highlightInput("#playername");
    }
};

UI.dropUpgrade = function(e) {
    Network.sendCommand("upgrades", "drop");
};

UI.dropFlag = function(e) {
    Network.sendCommand("drop", "");
};

UI.selectUpgrade = function(e) {
    Network.sendCommand("upgrade", e + "")
};

var updateUpgradesLighted = function() {
    let upgradeNames = ["", "speed", "defense", "energy", "missile"];
    for (let t = 1; t < 5; t++) {
        if (playerUpgrades[upgradeNames[t]] < 5 && playerStats.upgrades > 0) {
            $("#selectupgrade-" + t).addClass("lighted");
        } else {
            $("#selectupgrade-" + t).removeClass("lighted");
        }
    }
};

UI.updateUpgrades = function(speedDefenseEnergyMissileArray, msgUpgrades, msgTypeId) {
    for (var r, upgradeKind = ["", "speed", "defense", "energy", "missile"], o = 1; o < 5; o++)
        r = o - 1,
        "",
        null != playerUpgrades[upgradeKind[o]] && playerUpgrades[upgradeKind[o]] == speedDefenseEnergyMissileArray[r] || (playerUpgrades[upgradeKind[o]] = speedDefenseEnergyMissileArray[r],
        $("#selectupgrade-" + o + "-level").html(speedDefenseEnergyMissileArray[r]),
        isTooltipVisible && tooltipId - 100 == o && UI.popTooltip(null, 100 + o));
    if (null != msgTypeId) {
        if (0 != msgTypeId) {
            var s = ["", "Speed", "Defense", "Energy Regen", "Missile Speed"],
                a = "+" + Math.round(100 * (config.upgrades[upgradeKind[msgTypeId]].factor[playerUpgrades[upgradeKind[msgTypeId]]] - 1)) + "% " + s[msgTypeId];
            UI.showMessage("information", '<span class="info">UPGRADE</span>' + a, 3e3),
            Sound.playerUpgrade()
        }
        playerStats.upgrades = msgUpgrades,
        $("#score-upgrades").html(msgUpgrades)
    }
    updateUpgradesLighted()
};

UI.resetUpgrades = function() {
    UI.updateUpgrades([0, 0, 0, 0])
};

UI.popBigMsg = function(e) {
    if (1 == e)
        var t = '<div id="big-message" onclick="UI.closeBigMsg()"><div class="msg">Mobile mode</div><div class="small">Mobile mode has touch controls and requires latest phone/tablet hardware.</div><div class="small nopadtop">For the full experience please play on a PC with a physical keyboard.</div><div class="greyed">Tap anywhere to close</div></div>';
    else
        t = '<div id="big-message"><div class="msg">WebGL required</div><div class="small">This game requires a WebGL enabled browser in order to run.<br>Please allow WebGL for this domain to continue.</div>';
    $("body").append(t)
};

UI.closeBigMsg = function() {
    $("#big-message").remove()
};

UI.showHelp = function(e) {
    isHelpVisible || (UI.closeAllPanels("help"),
    true === e ? $("#howtoplay").addClass("hide") : $("#howtoplay").removeClass("hide"),
    UI.showPanel("#howtoplay"),
    isHelpVisible = true)
};

UI.hideHelp = function() {
    isHelpVisible && (UI.hidePanel("#howtoplay"),
    isHelpVisible = false)
};

UI.toggleHelp = function() {
    isHelpVisible ? UI.hideHelp() : UI.showHelp()
};

UI.updateSound = function(e) {
    config.settings.sound ? ($("#settings-sound").addClass("soundon"),
    $("#settings-sound").removeClass("soundoff"),
    $("#mainmenu-sound-icon").addClass("soundon"),
    $("#mainmenu-sound-icon").removeClass("soundoff"),
    $("#mainmenu-sound-text").html("Disable Sound")) : ($("#settings-sound").addClass("soundoff"),
    $("#settings-sound").removeClass("soundon"),
    $("#mainmenu-sound-icon").addClass("soundoff"),
    $("#mainmenu-sound-icon").removeClass("soundon"),
    $("#mainmenu-sound-text").html("Enable Sound")),
    e && UI.showMessage("alert", '<span class="info">SOUND</span>' + (config.settings.sound ? "Enabled" : "Disabled"), 3e3)
};

UI.gameStart = function(playerName, isFirstTime) {
    if (isFirstTime) {
        $("#login-ui").remove();
        UI.show("#logosmall");
        UI.show("#menu", true);
        if (!config.mobile) {
                UI.show("#chatbox");
        }

        UI.show("#roomnamecontainer");
        UI.show("#scoreboard");
        UI.show("#scorebig");
        UI.show("#settings");
        UI.show("#sidebar");
        UI.showScaleSlider();
        if (config.mobile) {
            setupMobile();
        }
        if (!config.settings.helpshown) {
            UI.showHelp(true);
            config.settings.helpshown = true;
            Tools.setSettings({
                helpshown: true
            });
        }
    }
    UI.hide("#gamespecific");
    $("#gameinfo").html("&nbsp;");
    $("#gameinfo").addClass("ingame");
    playerUpgrades = {};
    UI.resetUpgrades();
    UI.hideSpectator();
    UI.resetPowerups();
    $("#open-menu").html("Connecting...");
    game.myName = playerName;
    Network.setup();
};

var setupMobile = function() {
    setupMobileUI(),
    Graphics.toggleFullscreen(),
    Input.setupTouch()
};

var setupMobileUI = function() {
    $("#howtoplay").addClass("mobile"),
    $("#howtoplay").html('<div class="header">HOW TO PLAY</div><div class="mobile-graphic"></div><div class="commands">For the best game experience play on a PC</div>')
};

UI.reconnection = function() {
    chatLineId = 0,
    s = -1,
    playerStats = {
        score: -1,
        upgrades: -1,
        earnings: -1,
        kills: -1,
        deaths: -1
    },
    deathNotice = false,
    playerUpgrades = {},
    ignoredPlayerIdSet = {},
    UI.resetUpgrades(),
    UI.resetPowerups(),
    UI.hideSpectator(),
    UI.wipeAllMinimapMobs(),
    UI.wipeAllMessages(),
    Games.wipe(),
    $("#gameinfo").html("&nbsp;"),
    $("#scoreboard").html(""),
    $("#chatlines").html(""),
    $("#score-score").html("&nbsp;"),
    $("#score-upgrades").html("&nbsp;"),
    $("#score-rank").html("-"),
    $("#roomname").html("&nbsp;"),
    $("#open-menu").html("Switching Game...")
};

UI.loggedIn = function(e) {
    $("#roomname").html(game.roomName),
    $("#scoreheader").html(game.roomName + "&nbsp;&nbsp;"),
    $("#open-menu").html('<span class="arrowdown"></span>' + game.roomNameShort + '&nbsp;&nbsp;<span class="region">&bull;&nbsp;&nbsp;' + game.regionName + "</span>"),
    UI.visibilityHUD(true),
    UI.visibilityMinimap(true),
    UI.updateHUD(1, 1)
};

UI.popTooltip = function(e, t) {
    if (null == t)
        var n = e.data.t,
            r = e.currentTarget.getBoundingClientRect();
    else
        n = t;
    var i = "";
    if (n < 100) {
        var o = aircraftInfoByType[n],
            s = ["", "Agility", "Defense", "Regen", "Damage"];
        i += '<div class="header">' + o[0] + "</div>";
        for (var a = 1; a <= 4; a++)
            i += '<div class="item"><div class="name">' + s[a] + '</div><div class="val">&nbsp;<div class="bar"><div class="progress" style="width: ' + o[a] + '%"></div></div></div></div>';
        i += '<div class="item"><div class="special">' + o[5] + '</div><div class="desc">' + o[6] + "</div></div>",
        i += '<div class="item"><div class="clickto">Click to respawn</div></div>'
    } else {
        var l = ["", "speed", "defense", "energy", "missile"],
            u = n - 100,
            c = playerUpgrades[l[u]],
            h = "+" + Math.round(100 * (config.upgrades[l[u]].factor[playerUpgrades[l[u]]] - 1)) + "%";
        if (i += '<div class="header">' + aircraftInfoByType[n][0] + "</div>",
        i += '<div class="item"><div class="level">' + c + " / " + (config.upgrades[l[u]].factor.length - 1) + "</div>",
        c > 0 && (i += '<div class="percent">' + h + "</div></div>"),
        c < config.upgrades[l[u]].factor.length - 1) {
            i += '<div class="item smaller"><div class="requires">Requires 1 upgrade point</div></div>';
            i += '<div class="item smaller"><div class="clickto">Click to upgrade to ' + (h = "+" + Math.round(100 * (config.upgrades[l[u]].factor[playerUpgrades[l[u]] + 1] - 1)) + "%") + "</div></div>"
        } else
            i += '<div class="item smaller"><div class="clickto">Max upgrade reached</div></div>'
    }
    i += '<div class="arrow"></div>',
    null == t && $("#tooltip").css({
        left: Math.round(r.left + 60) + "px",
        top: Math.round(r.top - 10) + "px"
    }),
    $("#tooltip").html(i),
    tooltipId = n,
    null != hideTooltipTimer && clearTimeout(hideTooltipTimer),
    isTooltipVisible || (isTooltipVisible = true,
    UI.show("#tooltip"))
};

UI.closeTooltip = function() {
    isTooltipVisible && (null != hideTooltipTimer && clearTimeout(hideTooltipTimer),
    hideTooltipTimer = setTimeout(function() {
        isTooltipVisible && (UI.hide("#tooltip"),
        $("#tooltip").html(""),
        isTooltipVisible = false,
        hideTooltipTimer = null)
    }, 250))
};

UI.startDragChat = function(e) {
    chatBoxDimensions.x = e.originalEvent.pageX,
    chatBoxDimensions.y = e.originalEvent.pageY,
    chatBoxDimensions.width = $("#chatbox").width() + 16,
    chatBoxDimensions.height = $("#chatbox").height() + 16,
    $("#chatbox").addClass("hovered"),
    $(window).on("mousemove", UI.dragChat),
    $(window).on("mouseup", UI.endDragChat)
};

UI.dragChat = function(e) {
    var t = e.originalEvent.pageX,
        n = e.originalEvent.pageY;
    if (0 != t && 0 != n) {
        game.screenY - n < 100 && (n = game.screenY - 100);
        var r = t - chatBoxDimensions.x,
            i = n - chatBoxDimensions.y;
        $("#chatbox").css({
            width: chatBoxDimensions.width + r + "px",
            height: chatBoxDimensions.height - i + "px"
        }),
        $("#minimizechatcontainer").css({
            width: chatBoxDimensions.width + r + "px",
            bottom: chatBoxDimensions.height - i + "px"
        }),
        $("#chatinput").css({
            width: chatBoxDimensions.width + r - 12 + "px",
            bottom: chatBoxDimensions.height - i + 20 + "px"
        })
    }
};

UI.endDragChat = function(e) {
    $("#chatbox").removeClass("hovered"),
    $(window).off("mousemove", UI.dragChat),
    $(window).off("mouseup", UI.endDragChat)
};

UI.setup = function() {
    $(window).resize(onWindowResize),
    $(window).on("orientationchange", onWindowResize),
    $(window).on("contextmenu", function(e) {
        return UI.popMenu(e, true),
        e.preventDefault(),
        false
    }),
    $(window).on("focus", Input.gameFocus),
    $(window).on("blur", Input.gameBlur),
    $(window).on("click", UI.popMenu),
    $("#minimizechat").on("click", UI.minimizeChat),
    $("#maximizechat").on("click", UI.maximizeChat),
    $("#viewscore").on("click", function(e) {
        game.state == Network.STATE.PLAYING && (UI.openScore(),
        e.stopPropagation())
    }),
    $("#selectaircraft-1").on("click", function() {
        UI.selectAircraft(1)
    }),
    $("#selectaircraft-2").on("click", function() {
        UI.selectAircraft(2)
    }),
    $("#selectaircraft-3").on("click", function() {
        UI.selectAircraft(3)
    }),
    $("#selectaircraft-4").on("click", function() {
        UI.selectAircraft(4)
    }),
    $("#selectaircraft-5").on("click", function() {
        UI.selectAircraft(5)
    }),
    $("#mainmenu-fullscreen").on("click", Graphics.toggleFullscreen),
    $("#mainmenu-invite").on("click", UI.openInvite),
    $("#mainmenu-score").on("click", UI.openScore),
    $("#mainmenu-game").on("click", Games.popGames),
    $("#mainmenu-hidpi").on("click", Graphics.toggleHiDPI),
    $("#mainmenu-sound").on("click", Sound.toggle),
    config.mobile ? ($("#mainmenu-keybinds-text").html("<br>How To Play"),
    $("#mainmenu-keybinds").on("click", UI.toggleHelp),
    $(".keybind").css({
        display: "none"
    })) : $("#mainmenu-keybinds").on("click", Input.openKeybinds),
    $("#settings-mainmenu").on("click", function(e) {
        UI.toggleMainMenu(),
        e.stopPropagation()
    }),
    $("#settings-sound").on("click", function(e) {
        Sound.toggle(),
        e.stopPropagation()
    }),
    $("#mainmenu").on("click", function(e) {
        e.stopPropagation()
    }),
    $("#scoredetailed").on("click", function(e) {
        e.stopPropagation()
    }),
    $("#invitefriends").on("click", function(e) {
        e.stopPropagation()
    }),
    $("#keybinds").on("click", function(e) {
        e.stopPropagation()
    }),
    $("#invite-link").on("contextmenu", function(e) {
        e.stopPropagation()
    }),
    $("#resetbinds").on("click", Input.resetBinds),
    config.mobile || ($("#chatbox").perfectScrollbar({
        suppressScrollX: true,
        handlers: ["click-rail", "drag-scrollbar", "wheel", "touch"]
    }),
    $("#chatinput").on("blur", function() {
        isChatBoxVisible && UI.toggleChatBox(false)
    }),
    $("#resizechat").on("mousedown", UI.startDragChat)),
    $("#scorecontainer").perfectScrollbar({
        suppressScrollX: true,
        handlers: ["click-rail", "drag-scrollbar", "wheel", "touch"]
    }),
    $("#selectupgrade-1").on("click", function() {
        UI.selectUpgrade(1)
    }),
    $("#selectupgrade-2").on("click", function() {
        UI.selectUpgrade(2)
    }),
    $("#selectupgrade-3").on("click", function() {
        UI.selectUpgrade(3)
    }),
    $("#selectupgrade-4").on("click", function() {
        UI.selectUpgrade(4)
    });
    var e;
    for (e = 1; e <= 5; e++)
        $("#selectaircraft-" + e).on("mouseenter", {
            t: e
        }, UI.popTooltip),
        $("#selectaircraft-" + e).on("mouseleave", UI.closeTooltip);
    for (e = 1; e <= 4; e++)
        $("#selectupgrade-" + e).on("mouseenter", {
            t: 100 + e
        }, UI.popTooltip),
        $("#selectupgrade-" + e).on("mouseleave", UI.closeTooltip);
    $("#playbutton").on("click", function() {
        Sound.UIClick(),
        UI.nameEntered()
    }),
    $("#playername").on("keypress", function(e) {
        13 === e.which && UI.nameEntered()
    }),
    window.onerror = function(e, t, n, r, i) {
        game.state !== Network.STATE.PLAYING && game.state !== Network.STATE.CONNECTING || Tools.handleError({
            msg: e,
            url: t,
            lineNo: n,
            columnNo: r,
            error: i
        })
    }

    UI.createScaleSlider();
    UI.hideScaleSlider();
}


// airmash-refugees Zoom slider

var scaleBox = null;
var scaleKnob = null;
var scaleAlt = null;
var scaleAltPath = null;
var scaleIsDragging = false;
var scaleDragOffset = -1;

const SCALE_MIN = 800;
const SCALE_MAX = 7000;


UI.createScaleSlider = function() {
    scaleBox = document.createElement('div');
    scaleBox.style.position = 'absolute';
    scaleBox.style.width = '250px';
    scaleBox.style.background = 'white';
    scaleBox.style.borderRadius = '5px';
    scaleBox.style.top = '21px';
    scaleBox.style.left = '320px';
    scaleBox.style.zIndex = 110;
    scaleBox.style.height = '10px';
    scaleBox.style.opacity = 0.07;

    scaleKnob = document.createElement('div');
    scaleKnob.style.position = 'absolute';
    scaleKnob.style.width = '22px';
    scaleKnob.style.background = 'white';
    scaleKnob.style.borderRadius = '5px';
    scaleKnob.style.top = '21px';
    scaleKnob.style.left = '350px';
    scaleKnob.style.zIndex = 110;
    scaleKnob.style.height = '10px';
    scaleKnob.style.opacity = 0.08;

    scaleAlt = document.createElement('div');
    scaleAlt.style.position = 'absolute';
    scaleAlt.style.width = '24px';
    scaleAlt.style.height = '24px';
    scaleAlt.style.top = '14px';
    scaleAlt.style.left = '580px';
    scaleAlt.style.zIndex = 110;
    scaleAlt.style.borderRadius = '5px';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', 24);
    svg.setAttribute('height', 24);
    svg.setAttribute('viewBox', '0 0 24 24');

    scaleAltPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    scaleAltPath.setAttribute('d', (
        'M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 '+
        '1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 '+
        '15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z'
    ));
    scaleAltPath.setAttribute('stroke', 'white');
    scaleAltPath.setAttribute('fill', 'white');

    svg.appendChild(scaleAltPath);
    scaleAlt.appendChild(svg);

    document.body.appendChild(scaleBox);
    document.body.appendChild(scaleKnob);
    document.body.appendChild(scaleAlt);

    scaleKnob.addEventListener('mousedown', UI.onScaleKnobMouseDown);
    scaleAlt.addEventListener('click', UI.onScaleAltClick);
    document.addEventListener('mousemove', UI.onScaleKnobMouseMove);
    document.addEventListener('mouseup', UI.onScaleKnobMouseUp);

    UI.updateScalingWidgetState();
};

UI.toggleScaleAltMode = function() {
    Tools.setSettings({scalingAltMode: !config.settings.scalingAltMode});
    UI.updateScalingWidgetState();
    UI.scheduleGraphicsResize(0);
};

UI.scaleIncrease = function() {
    UI.setScalingFactor(UI.getScalingFactor() + 200);
    UI.updateScalingWidgetState();
};

UI.scaleDecrease = function() {
    UI.setScalingFactor(UI.getScalingFactor() - 200);
    UI.updateScalingWidgetState();
};

UI.onScaleAltClick = function(event) {
    UI.toggleScaleAltMode();
};

UI.scaleDefault = function() {
    UI.setScalingFactor(2500);
    UI.updateScalingWidgetState();
};

UI.hideScaleSlider = function() {
    scaleBox.style.display = 'none';
    scaleKnob.style.display = 'none';
    scaleAlt.style.display = 'none';
};

UI.showScaleSlider = function() {
    scaleBox.style.display = 'block';
    scaleKnob.style.display = 'block';
    scaleAlt.style.display = 'block';
};

UI.onScaleKnobMouseDown = function(event) {
    console.log('drag start', event);
    scaleIsDragging = true;
    scaleDragOffset = event.clientX - event.target.getBoundingClientRect().left;
};

UI.getScalingFactor = function() {
    if(config.settings.scalingAltMode) {
        return UI.capScalingFactor(config.settings.altScalingFactor || config.altScalingFactor);
    } else {
        return UI.capScalingFactor(config.settings.scalingFactor || config.scalingFactor);
    }
};

UI.capScalingFactor = function(zoom) {
    return Math.min(SCALE_MAX, Math.max(SCALE_MIN, zoom));
};

UI.scheduleGraphicsResize = function(delay) {
    clearTimeout(delayedGraphicsResizeTimer);
    delayedGraphicsResizeTimer = setTimeout(function()
    {
        Graphics.resizeRenderer(window.innerWidth, window.innerHeight)
    }, delay || 0);
};

UI.setScalingFactor = function(zoom) {
    if(config.settings.scalingAltMode) {
        Tools.setSettings({altScalingFactor: zoom});
    } else {
        Tools.setSettings({scalingFactor: zoom});
    }

    UI.scheduleGraphicsResize(100);
};

UI.onScaleKnobMouseMove = function(event) {
    if(scaleIsDragging) {
        console.log('drag', event);
        var minLeft = parseInt(scaleBox.style.left, 10);
        var maxLeft = minLeft + (
            parseInt(scaleBox.style.width, 10) -
            parseInt(scaleKnob.style.width, 10)
        );

        var left = Math.max(
            minLeft,
            Math.min(
                maxLeft,
                event.clientX - scaleDragOffset
            )
        );
        scaleKnob.style.left = left + 'px';
        UI.setScalingFactor(SCALE_MIN + ((SCALE_MAX - SCALE_MIN) * ((left - minLeft) / (maxLeft - minLeft))));
    }
};

UI.updateScalingWidgetState = function() {
    if(config.settings.scalingAltMode) {
        scaleAlt.style.opacity = 0.15;
    } else {
        scaleAlt.style.opacity = 0.08;
    }

    var minLeft = parseInt(scaleBox.style.left, 10);
    var maxLeft = minLeft + (
        parseInt(scaleBox.style.width, 10) -
        parseInt(scaleKnob.style.width, 10)
    );

    var zoom = UI.getScalingFactor();
    var left = minLeft + ((zoom - SCALE_MIN) * ((maxLeft - minLeft) / (SCALE_MAX - SCALE_MIN)));
    scaleKnob.style.left = left + 'px';
};

UI.onScaleKnobMouseUp = function(event) {
    if(scaleIsDragging) {
        console.log('drag end', event);
        scaleIsDragging = false;
    }
};
