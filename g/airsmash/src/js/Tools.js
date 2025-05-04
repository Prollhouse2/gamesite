import Vector from './Vector';

// if the player is logged in, all settings except for these are synchronised with the settings service (https://data.airmash.online/settings)
const localOnlySettings = [ 'id', 'hidpi' ];

var bucketState = {},
    clientErrorCount = 0,
    reelState = {
        started: false,
        startX: 200,
        startY: -2450,
        pan: 0,
        dist: 100,
        explosion: 4e3,
        direction: 1
    },
    lastRemoteSettingsJson = "";

Tools.updateReel = function() {
    if (!reelState.started) {
        reelState.pos = Vector.zero();
        for (var e, t = [3, 1, 2, 4, 5], r = [-270, -150, 0, 150, 270], i = 0; i < t.length; i++)
            Players.add({
                id: i + 1,
                team: 1,
                status: 0,
                reel: true,
                name: "",
                type: t[i],
                posX: 0,
                posY: 0,
                rot: 0,
                flag: 1
            }),
            (e = Players.get(i + 1)).keystate.UP = true,
            e._offset = r[i]
    }
    reelState.started = true,
    reelState.dist > 2e3 ? reelState.direction = -1 : reelState.dist < 100 && (reelState.direction = 1),
    reelState.dist += .5 * reelState.direction * game.timeFactor,
    reelState.pan += 1 / reelState.dist * game.timeFactor,
    reelState.pos.x = reelState.startX + Math.sin(reelState.pan) * reelState.dist,
    reelState.pos.y = reelState.startY - Math.cos(reelState.pan) * reelState.dist,
    Graphics.setCamera(reelState.pos.x, reelState.pos.y),
    Players.update(),
    Particles.update();
    for (var o, s = 1; s <= 5; s++)
        (o = Players.get(s)).pos.x = reelState.pos.x + o._offset,
        o.pos.y = reelState.pos.y + game.screenY / game.scale * .24,
        null != o._prevPos ? o.rot = new Vector(o.pos.x - o._prevPos.x,o.pos.y - o._prevPos.y).angle() + Math.PI : o._prevPos = o.pos.clone(),
        o._prevPos = new Vector((19 * o._prevPos.x + o.pos.x) / 20,(19 * o._prevPos.y + o.pos.y) / 20);
    if (game.time > reelState.explosion) {
        var a = new Vector(Tools.rand(reelState.pos.x - game.halfScreenX / game.scale, reelState.pos.x + game.halfScreenX / game.scale),Tools.rand(reelState.pos.y - game.halfScreenY / game.scale, reelState.pos.y + game.halfScreenY / game.scale));
        Particles.explosion(a, Tools.rand(2, 2.5), Tools.randInt(4, 7)),
        Particles.explosion(new Vector(a.x + Tools.rand(-100, 100),a.y + Tools.rand(-100, 100)), Tools.rand(1, 1.2)),
        reelState.explosion = game.time + Tools.rand(1e3, 3e3)
    }
};

Tools.wipeReel = function() {
    Particles.wipe(),
    Players.wipe()
};

Tools.startupMsg = function() {
    console.log("%cΛIRMΛSH Engine " + game.version + " starting up!", "font-size: 20px;"),
    console.log(""),
    console.log("%c*** Important message ***", "font-size: 16px; color: red;"),
    console.log("%cDo not paste any commands given by players in this console window", "font-size: 14px; color: red;"),
    console.log("")
};

Tools.detectCapabilities = function() {
    initMobileConstants(),
    config.mobile && !config.settings.mobileshown && (UI.popBigMsg(1),
    config.settings.mobileshown = true,
    Tools.setSettings({
        mobileshown: true
    })),
    config.mobile && Input.setupLogin()
};

var initMobileConstants = function() {
    config.mobile = "ontouchstart"in document.documentElement && void 0 !== window.orientation || -1 !== navigator.userAgent.indexOf("IEMobile"),
    config.ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
    "#forcemobile" == window.location.hash && (config.mobile = true),
    "#nomobile" == window.location.hash && (config.mobile = false)
};

Tools.syncRemoteSettings = function() {
    if (config.auth.tokens && config.auth.tokens.settings) {
        var remoteSettings = {};
        Object.keys(config.settings).forEach(key => {
            if (!localOnlySettings.includes(key)) {
                remoteSettings[key] = config.settings[key]
            }
        });
        var remoteSettingsJson = JSON.stringify(remoteSettings);
        if (remoteSettingsJson !== lastRemoteSettingsJson) {
            lastRemoteSettingsJson = remoteSettingsJson;
            Tools.ajaxPost(
                "https://" + game.backendHost + '/settings',
                remoteSettingsJson,
                config.auth.tokens.settings,
                function(data) {
                    if (!(data && data.result == 1)) {
                        lastRemoteSettingsJson = "";
                    }
                });
        }
    }
}

var loadObjectFromLocalStorage = function(key) {
    if (null == window.localStorage)
        return {};
    var e = null,
        t = {};
    try {
        e = localStorage.getItem(key)
    } catch (e) {}
    if (null != e)
        try {
            t = JSON.parse(e)
        } catch (e) {}
    return t
};

var saveObjectToLocalStorage = function(key, obj) {
    if (null != window.localStorage) {
        try {
            localStorage.setItem(key, JSON.stringify(obj))
        } catch (e) {}
    }
};

Tools.loadSettings = function() {
    var settings = loadObjectFromLocalStorage("settings");
    for (var key in settings) {
        config.settings[key] = settings[key];
    }
    DEVELOPMENT && console.log(settings);
    Tools.applySettingsToGame();
};

Tools.applySettingsToGame = function() {
    if (null == config.settings.id) {
        var e = Tools.randomID(16);
        config.settings.id = e,
        Tools.setSettings({
            id: e
        })
    }
    null != config.settings.name && $("#playername").val(config.settings.name),
    null != config.settings.region && (game.playRegion = config.settings.region),
    null != config.settings.flag && (game.myFlag = config.settings.flag),
    null == config.settings.sound && (config.settings.sound = true),
    config.settings.mousemode && Input.toggleMouse(true),
    UI.updateSound(),
    config.oldhidpi = config.settings.hidpi
};

Tools.randomID = function(e) {
    var t = new Uint8Array(e);
    return window.crypto.getRandomValues(t),
    o(t).substr(0, e)
};

var o = function(str) {
    for (var t, n = "", r = 0; r < str.length; r++)
        n += t = 1 === (t = (255 & str[r]).toString(16)).length ? "0" + t : t;
    return n
};

Tools.setSettings = function(settings) {
    for (var key in settings) {
        config.settings[key] = settings[key];
    }
    saveObjectToLocalStorage("settings", config.settings);
};

Tools.removeSetting = function(key) {
    null != config.settings[key] && delete config.settings[key];
    saveObjectToLocalStorage("settings", config.settings);
};

Tools.wipeSettings = function() {
    config.settings = {};
    saveObjectToLocalStorage("settings", config.settings);
};

var checkAuth = function() {
    if (undefined === config.auth.tokens ||
        undefined === config.auth.tokens.settings || 
        undefined === config.auth.tokens.game ||
        undefined === config.auth.identityprovider ||
        undefined === config.auth.loginname) {
        config.auth = {};
        saveObjectToLocalStorage("auth", config.auth);
    }
}

Tools.loadAuth = function() {
    config.auth = loadObjectFromLocalStorage("auth");
    checkAuth();
    return !($.isEmptyObject(config.auth));
}

Tools.setAuth = function(auth) {
    config.auth = auth;
    saveObjectToLocalStorage("auth", config.auth);
    checkAuth();
}

Tools.ajaxPost = function(url, data, token, callback) {
    $.ajax({
        url: url,
        method: "POST",
        data: data,
        dataType: "json",
        timeout: 1e4,
        headers: null == token ? {} : {"Authorization": "Bearer " + token},
        success: function(e) {
            null != callback && callback(e);
        },
        error: function() {
            null != callback && callback(null);
        }
    })
};

Tools.ajaxGet = function(url, token, callback) {
    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        timeout: 1e4,
        headers: null == token ? {} : {"Authorization": "Bearer " + token},
        success: function(e) {
            null != callback && callback(e);
        },
        error: function() {
            null != callback && callback(null);
        }
    })
};

Tools.length = function(e, t) {
    return Math.sqrt(e * e + t * t)
};

Tools.oscillator = function(e, t, n) {
    return 1 + Math.sin((game.time + (n || 0)) / t) * e
};

Tools.converge = function(e, t, n) {
    return Math.abs(e - t) < .01 ? t : e + n * (t - e)
};

Tools.rand = function(e, t) {
    return Math.random() * (t - e) + e
};

Tools.randCircle = function() {
    return Tools.rand(0, 6.28318530718)
};

Tools.randInt = function(e, t) {
    var n = Math.floor(Math.random() * (t + 1 - e) + e);
    return n >= t && (n = t),
    n
};

Tools.clamp = function(e, t, n) {
    return e <= t ? t : e >= n ? n : e
};

Tools.lerp = function(e, t, n) {
    return n * (t - e) + e
};

Tools.colorLerp = function(e, t, n) {
    n <= 0 && (n = .001),
    n >= 1 && (n = .999);
    var r = e >> 16,
        i = (e >> 8) & 255,
        o = 255 & e;
    return (1 << 24) + (r + n * ((t >> 16) - r) << 16) + (i + n * ((t >> 8 & 255) - i) << 8) + (o + n * ((255 & t) - o)) | 0
};

Tools.distance = function(e, t, n, r) {
    var i = e - n,
        o = t - r;
    return Math.sqrt(i * i + o * o)
};

Tools.distFastCheck = function(e, t, n, r) {
    return Math.abs(e.x - t.x) <= n && Math.abs(e.y - t.y) <= r
};

Tools.distFastCheckFloat = function(e, t, n, r, i) {
    return Math.abs(e - n) <= i && Math.abs(t - r) <= i
};

Tools.updateTime = function(fractionalFrames) {
    game.timeFactor = fractionalFrames < 60 ? fractionalFrames : 60,
    game.timeFactorUncapped = game.timeFactor,
    game.timeFactor > 10 && (game.timeFactor = 10),
    game.time = performance.now(),
    game.frames++
};

Tools.reducedFactor = function() {
    var e = (performance.now() - game.time) / 16.666;
    return Math.abs(game.jitter) > .1 && (e += game.jitter / 16.666),
    e
};

var easingByName = {
    shockwave: [.1, .1, .11, .12, .12, .13, .14, .14, .15, .16, .17, .18, .2, .21, .22, .24, .26, .29, .31, .35, .38, .42, .47, .52, .58, .64, .71, .78, .84, .9, .95, .98, 1, 1, 1, .98, .97, .94, .9, .85, .78, .7, .62, .52, .43, .34, .26, .18, .11, .05, 0],
    explosionSmoke: [0, 0, .02, .06, .13, .26, .45, .71, .91, .99, .99, .97, .94, .92, .89, .86, .83, .8, .77, .74, .71, .68, .65, .63, .6, .57, .54, .51, .48, .45, .42, .4, .37, .34, .31, .29, .26, .24, .21, .19, .16, .14, .12, .1, .08, .06, .04, .02, .01, 0, 0]
};

Tools.easing = {
    outElastic: function(e, t) {
        var n = 1 - (t || 0.7),
            r = 2 * e;
        if (0 === e || 1 === e)
            return e;
        var i = n / (2 * Math.PI) * Math.asin(1);
        return Math.pow(2, -10 * r) * Math.sin((r - i) * (2 * Math.PI) / n) + 1
    },
    custom: function(e, name) {
        var n = easingByName[name],
            r = n.length,
            i = Math.floor(e * (r - 1)),
            o = n[i];
        return i === r - 1 ? o : Tools.lerp(o, n[i + 1], e * (r - 1) % 1)
    }
};

Tools.setupDebug = function() {
    DEVELOPMENT && config.debug.show && (UI.show("#debug"),
    game.debug = {
        last: performance.now(),
        ticks: 0,
        frames: game.frames
    },
    setInterval(Tools.updateDebug, 2123))
};

Tools.debugLine = function(e, t) {
    return '<div class="line"><span class="attr">' + UI.escapeHTML(e) + '</span><span class="val">' + UI.escapeHTML(t) + "</span></div>"
};

Tools.updateDebug = function() {
    var e = performance.now(),
        t = (1e3 * (game.frames - game.debug.frames)) / (e - game.debug.last),
        n = Players.count(),
        r = Mobs.count(),
        i = Mobs.countDoodads(),
        o = "",
        s = Players.getMe();
    null != s && (o = Tools.debugLine("Coords", Math.round(s.pos.x) + ", " + Math.round(s.pos.y)));
    var a = Tools.debugLine("FPS", Math.round(t)) + Tools.debugLine("Ticks", (game.debug.ticks / (e - game.debug.last) * 100).toFixed(2) + "%") + Tools.debugLine("Ping", game.ping.toFixed(2) + " ms") + Tools.debugLine("Res", game.screenX + " x " + game.screenY) + '<div class="spacer"></div>' + Tools.debugLine("Players", n[0] + " / " + n[1]) + Tools.debugLine("Mobs", r[0] + " / " + r[1]) + Tools.debugLine("Particles", Particles.count()) + Tools.debugLine("Doodads", i[0] + " / " + i[1]) + '<div class="spacer"></div>' + o + Tools.debugLine("Scale", game.scale.toFixed(2)) + Tools.debugLine("Jitter", game.jitter.toFixed(3)) + '<div class="close" onclick="Tools.hideDebug()">x</div>';
    $("#debug").html(a),
    game.debug.last = e,
    game.debug.ticks = 0,
    game.debug.frames = game.frames
};

Tools.hideDebug = function() {
    UI.hide("#debug")
};

Tools.debugStartFrame = function() {
    DEVELOPMENT && config.debug.show && (game.debug.startedFrame = performance.now())
};

Tools.debugEndFrame = function() {
    DEVELOPMENT && config.debug.show && null != game.debug.startedFrame && (game.debug.ticks += performance.now() - game.debug.startedFrame)
};

Tools.earningsToRank = function(e) {
    return Math.floor(.0111 * Math.pow(e, .5)) + 1
};

Tools.rankToEarnings = function(e) {
    return Math.pow((e - 1) / .0111, 2)
};

Tools.decodeKeystate = function(e, t) {
    e.keystate.UP = 0 != (1 & t),
    e.keystate.DOWN = 0 != (2 & t),
    e.keystate.LEFT = 0 != (4 & t),
    e.keystate.RIGHT = 0 != (8 & t),
    e.boost = 0 != (16 & t),
    e.strafe = 0 != (32 & t),
    e.stealthed = 0 != (64 & t),
    e.flagspeed = 0 != (128 & t)
};

Tools.decodeUpgrades = function(e, t) {
    e.speedupgrade = (0 != (1 & t) ? 1 : 0) + (0 != (2 & t) ? 2 : 0) + (0 != (4 & t) ? 4 : 0),
    e.powerups.shield = 0 != (8 & t),
    e.powerups.rampage = 0 != (16 & t)
};

Tools.decodeMinimapCoords = function(e, t) {
    return new Vector(128 * e - 16384 + 64,Tools.clamp(128 * t - 16384, -8192, 8192) + 64)
};

Tools.decodeSpeed = function(e) {
    return (e - 32768) / 1638.4
};

Tools.decodeCoordX = function(e) {
    return (e - 32768) / 2
};

Tools.decodeCoordY = function(e) {
    return (e - 32768) / 4
};

Tools.decodeCoord24 = function(e) {
    return (e - 8388608) / 512
};

Tools.decodeAccel = function(e) {
    return (e - 32768) / 32768
};

Tools.decodeRotation = function(e) {
    return e / 6553.6
};

Tools.decodeHealthnergy = function(e) {
    return e / 255
};

Tools.decodeRegen = function(e) {
    return (e - 32768) / 1e6
};

var xCoordToBucket = function(x) {
    return Tools.clamp(Math.floor(x / bucketState.size) + bucketState.bucketsHalfX, 0, bucketState.bucketsMaxX)
};

var yCoordToBucket = function(y) {
    return Tools.clamp(Math.floor(y / bucketState.size) + bucketState.bucketsHalfY, 0, bucketState.bucketsMaxY)
};

Tools.initBuckets = function() {
    bucketState = {
        size: config.bucketSize,
        halfSize: parseInt(config.bucketSize / 2),
        bucketsMaxX: parseInt(config.mapWidth / config.bucketSize) - 1,
        bucketsMaxY: parseInt(config.mapHeight / config.bucketSize) - 1,
        bucketsHalfX: parseInt(config.mapWidth / config.bucketSize / 2),
        bucketsHalfY: parseInt(config.mapHeight / config.bucketSize / 2)
    };
    for (var xBucket = 0; xBucket <= bucketState.bucketsMaxX; xBucket++) {
        game.buckets.push([]);
        for (var yBucket = 0; yBucket <= bucketState.bucketsMaxY; yBucket++)
            game.buckets[xBucket].push([[]])
    }
    for (var doodadId = 0; doodadId < config.doodads.length; doodadId++)
        xBucket = xCoordToBucket(config.doodads[doodadId][0]),
        yBucket = yCoordToBucket(config.doodads[doodadId][1]),
        game.buckets[xBucket][yBucket][0].push(doodadId)
};

Tools.getBucketBounds = function(centre, width, height) {
    return [
        Tools.clamp(Math.floor((centre.x - width) / bucketState.size) + bucketState.bucketsHalfX, 0, bucketState.bucketsMaxX),
        Tools.clamp(Math.floor((centre.x + width) / bucketState.size) + bucketState.bucketsHalfX, 0, bucketState.bucketsMaxX),
        Tools.clamp(Math.floor((centre.y - height) / bucketState.size) + bucketState.bucketsHalfY, 0, bucketState.bucketsMaxY),
        Tools.clamp(Math.floor((centre.y + height) / bucketState.size) + bucketState.bucketsHalfY, 0, bucketState.bucketsMaxY)
    ];
};

Tools.deferUpdate = function(func) {
    setTimeout(func, 1)
};

var jsonErrorReplacer = function(key, obj) {
    if (obj instanceof Error) {
        var n = {};
        return Object.getOwnPropertyNames(obj).forEach(function(e) {
            n[e] = obj[e]
        }),
        n
    }
    return obj
};

Tools.handleError = function(e) {
    clientErrorCount += 1;
    if (clientErrorCount <= 5) {
        if (e.error != null) {
            e.error = JSON.stringify(e.error, jsonErrorReplacer);
        }

        let server;
        if (game.server && game.server.id) {
            server = game.server.id;
        }

        Tools.ajaxPost("https://" + game.backendHost + "/clienterror", {
            type: "runtime",
            error: JSON.stringify(e),
            version: game.version,
            state: game.state,
            server,
        });
    }
};

Tools.encodeUTF8 = function(e) {
    for (var t = 0, n = new Uint8Array(4 * e.length), r = 0; r != e.length; r++) {
        var i = e.charCodeAt(r);
        if (i < 128)
            n[t++] = i;
        else {
            if (i < 2048)
                n[t++] = i >> 6 | 192;
            else {
                if (i > 55295 && i < 56320) {
                    if (++r == e.length)
                        throw "UTF-8 encode: incomplete surrogate pair";
                    var o = e.charCodeAt(r);
                    if (o < 56320 || o > 57343)
                        throw "UTF-8 encode: second char code 0x" + o.toString(16) + " at index " + r + " in surrogate pair out of range";
                    i = 65536 + ((1023 & i) << 10) + (1023 & o),
                    n[t++] = i >> 18 | 240,
                    n[t++] = i >> 12 & 63 | 128
                } else
                    n[t++] = i >> 12 | 224;
                n[t++] = i >> 6 & 63 | 128
            }
            n[t++] = 63 & i | 128
        }
    }
    return n.subarray(0, t)
};

Tools.decodeUTF8 = function(e) {
    for (var t = "", n = 0; n < e.length; ) {
        var r = e[n++];
        if (r > 127) {
            if (r > 191 && r < 224) {
                if (n >= e.length)
                    throw "UTF-8 decode: incomplete 2-byte sequence";
                r = (31 & r) << 6 | 63 & e[n]
            } else if (r > 223 && r < 240) {
                if (n + 1 >= e.length)
                    throw "UTF-8 decode: incomplete 3-byte sequence";
                r = (15 & r) << 12 | (63 & e[n]) << 6 | 63 & e[++n]
            } else {
                if (!(r > 239 && r < 248))
                    throw "UTF-8 decode: unknown multibyte start 0x" + r.toString(16) + " at index " + (n - 1);
                if (n + 2 >= e.length)
                    throw "UTF-8 decode: incomplete 4-byte sequence";
                r = (7 & r) << 18 | (63 & e[n]) << 12 | (63 & e[++n]) << 6 | 63 & e[++n]
            }
            ++n
        }
        if (r <= 65535)
            t += String.fromCharCode(r);
        else {
            if (!(r <= 1114111))
                throw "UTF-8 decode: code point 0x" + r.toString(16) + " exceeds UTF-16 reach";
            r -= 65536,
            t += String.fromCharCode(r >> 10 | 55296),
            t += String.fromCharCode(1023 & r | 56320)
        }
    }
    return t
};

Tools.stripBotsNamePrefix = function(name) {
    if (game.server.config && game.server.config.botsNamePrefix) {
        if (name.startsWith(game.server.config.botsNamePrefix)) {
            name = name.substring(game.server.config.botsNamePrefix.length);
        }
    }
    return name;
};

Tools.mungeNonAscii = function(s, id)
{
    if(! config.airmashRefugees.unicodeWorkaround) {
        return s;
    }

    var re = /^[a-z0-9!"#$%&'()*+,.\/:;<=>?@\[\] ^_`{|}~-]*$/i;
    if(re.test(s)) {
        return s;
    }

    return 'player#' + id;
};
