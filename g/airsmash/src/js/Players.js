import Player from './Player';
import Vector from './Vector';

var playersById = {},
    t = [-1, -1, -1],
    n = ["badge_gold", "badge_silver", "badge_bronze"];

Players.update = function() {
    var t, n;
    for (t in playersById)
        0 == (n = playersById[t]).status && (n.update(game.timeFactor),
        n.updateGraphics(game.timeFactor));
    if (null != game.spectatingID) {
        if (null == (n = playersById[game.spectatingID]))
            return;
        if (game.timeNetwork - n.lastPacket > 3e3)
            return;
        Graphics.setCamera(n.pos.x, n.pos.y)
    } else if (null != game.myID) {
        if (null == (n = playersById[game.myID]))
            return;
        0 == n.status && UI.updateHUD(n.health, n.energy, n),
        Graphics.setCamera(n.pos.x, n.pos.y)
    }
};

Players.add = function(player, fromLogin) {
    playersById[player.id] = new Player(player, fromLogin);

    if (game.state === Network.STATE.PLAYING) {
        UI.updateGameInfo();
    }
};

Players.get = function(t) {
    return playersById[t]
};

Players.getMe = function() {
    return playersById[game.myID]
};

Players.amIAlive = function() {
    var e = Players.getMe();
    return null != e && 0 == e.status
};

Players.getIDs = function() {
    var t = {};
    for (var n in playersById)
        t[n] = true;
    return t
};

Players.getByName = function(name) {
    var id;
    for (id in playersById)
        if (playersById[id].name === name)
            return playersById[id];
    return null
};

Players.network = function(type, msg) {
    let player = playersById[msg.id];
    if (null != player)
        switch (type) {
            case Network.SERVERPACKET.PLAYER_UPDATE:
            case Network.SERVERPACKET.PLAYER_FIRE:
            case Network.SERVERPACKET.EVENT_BOOST:
            case Network.SERVERPACKET.EVENT_BOUNCE:
                player.networkKey(type, msg);
                break;
            case Network.SERVERPACKET.CHAT_SAY:
                player.sayBubble(msg);
                break;
            case Network.SERVERPACKET.PLAYER_RESPAWN:
                player.respawn(msg);
                UI.updateGameInfo();
                break;
            case Network.SERVERPACKET.PLAYER_FLAG:
                if (msg.id == game.myID) {
                    game.myFlag = game.lastFlagSet;
                    Tools.setSettings({
                        flag: game.lastFlagSet
                    });
                }
                player.changeFlag(msg);
                break;
        }
};

Players.stealth = function(t) {
    var n = playersById[t.id];
    null != n && n.stealth(t)
};

Players.leaveHorizon = function(t) {
    var n = playersById[t.id];
    null != n && n.leaveHorizon()
};

Players.updateBadges = function(r) {
    for (var i, o = Tools.clamp(r.length, 0, 3), s = [], a = 0; a < o; a++)
        null != (i = playersById[r[a].id]) && (s.push(i.id),
        i.state.badge != a && (i.state.badge = a,
        i.changeBadge(n[a])),
        i.state.hasBadge || (i.state.hasBadge = true,
        i.render && (i.sprites.badge.visible = true)));
    for (var l = 0; l < t.length; l++)
        if (-1 == s.indexOf(t[l])) {
            if (null == (i = playersById[t[l]]))
                continue;
            i.state.hasBadge && (i.state.hasBadge = false,
            i.sprites.badge.visible = false)
        }
    t = s
};

Players.chat = function(t) {
    var n = playersById[t.id];
    null != n && UI.addChatLine(n, t.text, 0)
};

Players.teamChat = function(t) {
    var n = playersById[t.id];
    null != n && UI.addChatLine(n, t.text, 3)
};

Players.votemutePass = function(t) {
    var n = playersById[t.id];
    null != n && UI.chatVotemutePass(n)
};

Players.whisper = function(t) {
    var n;
    if (t.to == game.myID) {
        if (null == (r = playersById[t.from]))
            return;
        n = 2
    } else {
        var r;
        if (null == (r = playersById[t.to]))
            return;
        n = 1
    }
    UI.addChatLine(r, t.text, n)
};

Players.impact = function(t) {
    for (var n = 0; n < t.players.length; n++) {
        var r = playersById[t.players[n].id];
        null != r && r.impact(t.type, new Vector(t.posX,t.posY), t.players[n].health, t.players[n].healthRegen)
    }
};

Players.powerup = function(e) {
    Players.getMe().powerup(e)
};

Players.updateLevel = function(packet) {
    var player = playersById[packet.id];
    if (player != null) {
        player.updateLevel(packet);
    }
};

Players.reteam = function(msg) {
    let player = playersById[msg.id];
    if (player != null) {
        player.reteam(msg.team);
    }

    UI.updateGameInfo();
};

Players.kill = function(msg) {
    let player = playersById[msg.id];
    if (!player) {
        return;
    }

    if (msg.killer != 0 || msg.posX != 0 || msg.posY != 0) {
        player.kill(msg);
        if (player.me()) {
            UI.visibilityHUD(false);
            let killer = playersById[msg.killer];
            if (killer) {
                UI.killedBy(killer);
            }
            UI.showSpectator('<div onclick="Network.spectateNext()" class="spectate">ENTER SPECTATOR MODE</div>');
        } 
        else if (msg.killer === game.myID) {
            UI.killed(player);
        }
        if (!player.me() && player.id === game.spectatingID && game.gameType !== GameType.BTR) {
            Games.spectatorSwitch(player.id);
        }
    } 
    else {
        player.kill({
            posX: 0,
            posY: 0,
            spectate: true
        });
        UI.visibilityHUD(false);
        UI.updateGameInfo();
    }
};

Players.destroy = function(id) {
    if (id == game.spectatingID) {
        $("#spectator-tag").html("Spectating");
        Games.spectatorSwitch(id);
    }

    let player = playersById[id];
    if (player != null) {
        player.destroy(true);
        delete playersById[id];

        if (game.state === Network.STATE.PLAYING) {
            UI.updateGameInfo();
        }
    }
};

Players.changeType = function(t) {
    var n = playersById[t.id];
    null != n && n.changeType(t)
};

Players.count = function() {
    var t, n = 0, r = 0;
    for (t in playersById)
        n++,
        playersById[t].culled && r++;
    return [n - r, n]
};

Players.categoryCounts = function() {
    let counts = {
        players: 0,
        bots: 0,
        blueTeam: 0,
        redTeam: 0,
        spectators: 0
    }

    for (let id in playersById) {
        let player = playersById[id];

        if (player.bot) {
            // Special case the ab-server bot name to exclude, as it doesn't play
            if (player.name !== 'Server') {
                counts.bots++
            }
        }
        else {
            counts.players++;

            // If player is spectating, exclude them from CTF team counts
            if (player.isSpectating()) {
                counts.spectators++;
            }
            else {
                if (player.team === 1) {
                    counts.blueTeam++;
                }
                else if (player.team === 2) {
                    counts.redTeam++;
                }
            }
        }
    }

    return counts;
}

Players.wipe = function() {
    for (let id in playersById) {
        playersById[id].destroy(true);
        delete playersById[id];
    }
};

Players.all = function() { // SPATIE
    return playersById;
};