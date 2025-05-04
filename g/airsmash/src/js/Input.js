import Vector from './Vector';
import nipplejs from 'nipplejs';

var lastTransmittedKeyState = {},
    t = {},
    isPressedByKeyCode = {},
    maybeRotationTimerId = null,
    i = 0,
    TWO_PI = 2 * Math.PI,
    joystick = null,
    isGamepadConnected = false,
    gamepadState = {},
    isKeybindsUiVisible = false,
    c = null,
    h = 0,
    keyBindDescription = {
        LEFT: ["LEFT", "A"],
        RIGHT: ["RIGHT", "D"],
        UP: ["UP", "W"],
        DOWN: ["DOWN", "S"],
        STRAFELEFT: ["Q"],
        STRAFERIGHT: ["E"],
        FIRE: ["SPACE"],
        SPECIAL: ["CTRL", "SHIFT"],
        SHOWSCORE: ["TAB"],
        DROPUPGRADE: ["X"],
        DROPFLAG: ["Y"],
        MAINMENU: ["F1"],
        SHOWGAMES: ["F2"],
        FULLSCREEN: ["F"],
        MINIMIZECHAT: ["PGDOWN"],
        MAXIMIZECHAT: ["PGUP"],
        SAY: ["GRAVE"],
        TEAM: ["T"],
        REPLY: ["R"],
        SPECTATE: ["V"],
        UPGRADE1: ["1"],
        UPGRADE2: ["2"],
        UPGRADE3: ["3"],
        UPGRADE4: ["4"],
        SOUND: ["G"],
        HELP: ["H"],
        INVITE: ["I"],
        MOUSEMODE: ["M"],
        ALTZOOM: ["BACKSPACE"],
        ZOOMOUT: ["-"],
        ZOOMIN: ["="],
        DEFAULTZOOM: ["0"]
    },
    p = {},
    movementKeySet = {
        LEFT: true,
        RIGHT: true,
        UP: true,
        DOWN: true,
        FIRE: true,
        SPECIAL: true,
        STRAFELEFT: true,
        STRAFERIGHT: true
    },
    g = {},
    controlKeySet = {
        MAINMENU: true,
        FULLSCREEN: true,
        INVITE: true,
        SOUND: true,
        SHOWSCORE: true,
        SHOWGAMES: true,
        HELP: true
    },
    defaultKeybinds = [
        ["Forward", "UP"],
        ["Backward", "DOWN"],
        ["Turn Left", "LEFT"],
        ["Turn Right", "RIGHT"],
        ["Fire", "FIRE"],
        ["Special", "SPECIAL"],
        ["Strafe Left", "STRAFELEFT"],
        ["Strafe Right", "STRAFERIGHT"],
        ["Drop Flag", "DROPFLAG"],
        ["Spectate", "SPECTATE"],
        ["Upgrade Speed", "UPGRADE1"],
        ["Upgrade Defense", "UPGRADE2"],
        ["Upgrade Energy", "UPGRADE3"],
        ["Upgrade Missiles", "UPGRADE4"],
        ["Zoom Out", "ZOOMOUT"],
        ["Default Zoom", "DEFAULTZOOM"],
        ["Scoreboard", "SHOWSCORE"],
        ["Main Menu", "MAINMENU"],
        ["Show Games", "SHOWGAMES"],
        ["Fullscreen", "FULLSCREEN"],
        ["Maximize Chat", "MAXIMIZECHAT"],
        ["Minimize Chat", "MINIMIZECHAT"],
        ["Drop Upgrade", "DROPUPGRADE"],
        ["In-game Say", "SAY"],
        ["Team Chat", "TEAM"],
        ["Reply", "REPLY"],
        ["Toggle Sound", "SOUND"],
        ["Help", "HELP"],
        ["Invite Friends", "INVITE"],
        ["Mouse Mode", "MOUSEMODE"],
        ["Zoom In", "ZOOMIN"],
        ["Alternate Zoom", "ALTZOOM"]
    ],
    keyNameByCode = {},
    keyCodeByName = {
        BACKSPACE: 8,
        TAB: 9,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        PAUSE: 19,
        CAPS: 20,
        SPACE: 32,
        PGUP: 33,
        PGDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        INSERT: 45,
        DELETE: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        WINDOWL: 91,
        WINDOWR: 92,
        SELECT: 93,
        NUMPAD0: 96,
        NUMPAD1: 97,
        NUMPAD2: 98,
        NUMPAD3: 99,
        NUMPAD4: 100,
        NUMPAD5: 101,
        NUMPAD6: 102,
        NUMPAD7: 103,
        NUMPAD8: 104,
        NUMPAD9: 105,
        "*": 106,
        "+": 107,
        "-": 109,
        DECIMAL: 110,
        "/": 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        NUMLOCK: 144,
        SCROLL: 145,
        ":": 186,
        "=": 187,
        ",": 188,
        "-": 189,
        ".": 190,
        "/": 191,
        GRAVE: 192,
        "[": 219,
        "\\": 220,
        "]": 221,
        QUOTE: 222
    },
    networkKeyNames = ["UP", "DOWN", "LEFT", "RIGHT", "FIRE", "SPECIAL"],
    x = ["UP", "DOWN", "LEFT", "RIGHT", "FIRE", "SPECIAL"];

Input.setup = function() {
    for (var name in keyCodeByName)
        keyNameByCode[keyCodeByName[name]] = name;
    p = JSON.parse(JSON.stringify(keyBindDescription)),
    initKeyBindsFromSettings(),
    updateKeybindsList(true),
    $(window).on("keydown", onWindowKeyDown),
    $(window).on("keyup", onWindowKeyUp),
    $(window).on("gamepadconnected", function(e) {
        UI.showMessage("alert", '<span class="info">GAMEPAD CONNECTED</span>' + UI.escapeHTML(e.originalEvent.gamepad.id), 3e3),
        isGamepadConnected = true,
        resetNetworkKeyState()
    }),
    $(window).on("gamepaddisconnected", function(e) {
        UI.showMessage("alert", '<span class="info">GAMEPAD DISCONNECTED</span>' + UI.escapeHTML(e.originalEvent.gamepad.id), 3e3),
        isGamepadConnected = false,
        resetNetworkKeyState()
    })
};

var onWindowKeyDown = function(event) {
    if (game.state == Network.STATE.PLAYING || game.state == Network.STATE.CONNECTING) {
        var keyCode = event.which;
        if (72 != keyCode && UI.hideHelp(),
        null != c && P(keyCode))
            event.preventDefault();
        else {
            var bind = Input.getBind(keyCode);
            if (!shouldInterpretAsControlKey(keyCode))
                return null == movementKeySet[bind] ? (isPressedByKeyCode[keyCode] || (isPressedByKeyCode[keyCode] = true,
                UI.controlKey(keyCode, bind, true)),
                event.preventDefault(),
                false) : (lastTransmittedKeyState[bind] || (lastTransmittedKeyState[bind] = true,
                C(bind)),
                t[keyCode] || (t[keyCode] = true),
                event.preventDefault(),
                false)
        }
    }
};

var onWindowKeyUp = function(event) {
    if (game.state == Network.STATE.PLAYING || game.state == Network.STATE.CONNECTING) {
        var keyCode = event.which,
            bind = Input.getBind(keyCode);
        if (null == movementKeySet[bind] && isPressedByKeyCode[keyCode] && (isPressedByKeyCode[keyCode] = false),
        !shouldInterpretAsControlKey(keyCode))
            return lastTransmittedKeyState[bind] && (lastTransmittedKeyState[bind] = false,
            R(bind)),
            t[keyCode] && (t[keyCode] = false),
            event.preventDefault(),
            false
    }
};

var shouldInterpretAsControlKey = function(keyCode, t) {
    return !!UI.chatBoxOpen() && (
        9 != keyCode && // Tab
        27 != keyCode && // Escape
        13 != keyCode && // Enter
        38 != keyCode && // Up
        40 != keyCode && // Down
        37 != keyCode && // Left
        39 != keyCode && // Right
        112 != keyCode && // F1
        113 != keyCode && // F2
        114 != keyCode && // F3
        115 != keyCode && // F4
        116 != keyCode && // F5
        117 != keyCode && // F6
        118 != keyCode && // F7
        119 != keyCode && // F8
        120 != keyCode && // F9
        121 != keyCode && // F10
        122 != keyCode && // F11
        123 != keyCode // F12
    )
};

var resetNetworkKeyState = function() {
    gamepadState = {
        forward: true,
        left: false,
        right: false,
        up: false,
        down: false,
        fire: false,
        special: false,
        angle: 0,
        force: 0
    }
};

Input.toggleKeybinds = function() {
    isKeybindsUiVisible ? Input.closeKeybinds() : Input.openKeybinds()
};

Input.getBind = function(e) {
    var t = g[e];
    return null == t ? null : t
};

Input.bindKey = function(e, t, n) {
    null == c && (c = t,
    h = n,
    $(e.target).html("press key"))
};

Input.closeBind = function() {
    null != c && (updateKeybindsList(),
    c = null)
};

Input.resetBinds = function() {
    keyBindDescription = JSON.parse(JSON.stringify(p)),
    Tools.removeSetting("keybinds"),
    c = null,
    updateKeybindsList()
};

var initKeyBindsFromSettings = function() {
    if (null != config.settings.keybinds)
        for (var e in config.settings.keybinds)
            keyBindDescription[e] = JSON.parse(JSON.stringify(config.settings.keybinds[e]))
};

var P = function(keyCode) {
    var keyName = keyNameByCode[keyCode];
    if (27 == keyCode && (keyName = ""),
    null != keyName) {
        for (var n in keyBindDescription)
            keyBindDescription[n][0] == keyName && (keyBindDescription[n][0] = ""),
            keyBindDescription[n].length > 1 && keyBindDescription[n][1] == keyName && (keyBindDescription[n][1] = "");
        keyBindDescription[c][h] = keyName;
        for (n in keyBindDescription)
            keyBindDescription[n].length > 1 && "" == keyBindDescription[n][0] && "" != keyBindDescription[n][1] && (keyBindDescription[n] = [keyBindDescription[n][1]]),
            2 == keyBindDescription[n].length && "" === keyBindDescription[n][1] && keyBindDescription[n].splice(-1, 1);
        return updateKeybindsList(),
        function() {
            var e = {},
                t = "";
            for (var n in keyBindDescription)
                null != p[n] && (t = JSON.stringify(keyBindDescription[n])) !== JSON.stringify(p[n]) && (e[n] = JSON.parse(t));
            Object.keys(e).length > 0 ? Tools.setSettings({
                keybinds: e
            }) : Tools.removeSetting("keybinds")
        }(),
        c = null,
        true
    }
    return false
};

var updateKeybindsList = function(e) {
    var n = "";
    var r = "";
    var i = null;

    var bindHtml = '<div class="left-binds">';
    for(var o = 0; o < defaultKeybinds.length; o++) {
        if(null != defaultKeybinds[o][0]) {
            if("" != defaultKeybinds[o][0]) {
                if(null == (i = keyBindDescription[defaultKeybinds[o][1]])) {
                    n = "&nbsp;";
                    r = "&nbsp;";
                } else {
                    if("" == (n = i[0])) {
                        n = "&nbsp;";
                    }
                    if("" == (r = 1 == i.length ? "" : i[1])) {
                        r = "&nbsp;";
                    }
                }

                bindHtml += (
                    '<div class="item">' +
                        '<div class="name">' +
                            defaultKeybinds[o][0] +
                        '</div>' +
                        '<div class="bind' + ("&nbsp;" == n ? " blank" : "") + '" onclick="Input.bindKey(event,\'' + defaultKeybinds[o][1] + "',0)\">" +
                            n +
                        '</div>' +
                        '<div class="bind' + ("&nbsp;" == r ? " blank" : "") + '" onclick="Input.bindKey(event,\'' + defaultKeybinds[o][1] + "',1)\">" +
                            r +
                        '</div>' +
                    '</div>'
                );

                if(15 == o) {
                    bindHtml += '</div><div class="right-binds">'
                }
            } else {
                bindHtml += '<div class="item empty"></div>';
            }
        }
    }

    bindHtml += "</div>";
    if(null == e) {
        $("#keybinds-list").html(bindHtml);
    }

    g = {};
    o = 0;
    var s = 0;
    for (var a in keyBindDescription) {
        for (o = 0; o < keyBindDescription[a].length; o++)
            null != (s = keyCodeByName[keyBindDescription[a][o]]) && (g[s] = a);
        null != controlKeySet[a] && $("#keybind-" + a.toLowerCase()).html("" == keyBindDescription[a] ? "&nbsp;" : "(" + keyBindDescription[a] + ")")
    }
};

Input.openKeybinds = function() {
    config.mobile || isKeybindsUiVisible || (UI.closeAllPanels("keybinds"),
    updateKeybindsList(),
    UI.showPanel("#keybinds"),
    isKeybindsUiVisible = true)
};

Input.closeKeybinds = function() {
    isKeybindsUiVisible && (UI.hidePanel("#keybinds", isKeybindsUiVisible),
    isKeybindsUiVisible = false,
    c = null)
};

Input.update = function() {
    if (isGamepadConnected && null != navigator.getGamepads) {
        var gamepads = navigator.getGamepads();
        if (null != gamepads && null != gamepads.length && 0 != gamepads.length && null != gamepads[0]) {
            var gamepad = gamepads[0];
            if (!(gamepad.buttons.length < 16)) {
                var n = gamepad.buttons[12].pressed,
                    r = gamepad.buttons[13].pressed,
                    i = gamepad.buttons[15].pressed,
                    s = gamepad.buttons[14].pressed,
                    u = gamepad.buttons[0].pressed || gamepad.buttons[2].pressed,
                    c = gamepad.buttons[1].pressed || gamepad.buttons[3].pressed;
                gamepadState.up != n && (A("UP", n),
                gamepadState.up = n),
                gamepadState.down != r && (A("DOWN", r),
                gamepadState.down = r),
                gamepadState.right != i && (A("RIGHT", i),
                gamepadState.right = i),
                gamepadState.left != s && (A("LEFT", s),
                gamepadState.left = s),
                gamepadState.fire != u && (A("FIRE", u),
                gamepadState.fire = u),
                gamepadState.special != c && (A("SPECIAL", c),
                gamepadState.special = c);
                var h = new Vector(gamepad.axes[1],gamepad.axes[0]),
                    d = h.length(),
                    p = -h.angle() + Math.PI / 2,
                    f = p = (p % TWO_PI + TWO_PI) % TWO_PI;
                d > .2 ? (gamepadState.forward = true,
                handleRotation(f, d)) : (gamepadState.forward && !n && A("UP", false),
                gamepadState.forward = false)
            }
        } else
            isGamepadConnected = false
    }
};

Input.unpressKey = function(keyCode) {
    delete isPressedByKeyCode[keyCode]
};

Input.keyState = function(t) {
    return lastTransmittedKeyState[t]
};

Input.clearKeys = function(n) {
    if (game.state === Network.STATE.PLAYING) {
        for (var r of networkKeyNames)
            if (lastTransmittedKeyState[r]) {
                if (n && (t[38] || t[40] || t[37] || t[39]))
                    continue;
                lastTransmittedKeyState[r] = false,
                R(r)
            }
        for (var i in t)
            (!n || 38 != i && 40 != i && 37 != i && 39 != i) && (t[i] = false)
    }
};

Input.touchCloseAll = function() {
    game.state == Network.STATE.LOGIN ? (Games.closeDropdowns(),
    UI.closeLogin()) : game.state == Network.STATE.PLAYING && (UI.closeAllPanels(),
    UI.closeTooltip())
};

Input.addTouchRejection = function(e) {
    $(e).on("touchstart", function(e) {
        e.stopPropagation()
    }),
    $(e).on("touchmove", function(e) {
        e.preventDefault(),
        e.stopPropagation()
    })
};

Input.setupLogin = function() {
    $(window).on("touchstart", function(e) {
        Input.touchCloseAll(),
        e.preventDefault()
    }),
    Input.addTouchRejection("#logon,#big-message,#loginselector")
};

Input.setupTouch = function() {
    $(window).on("touchcancel", function(e) {
        null != joystick && joystick.processOnEnd(e)
    });
    Input.addTouchRejection("#settings,#sidebar,#roomnamecontainer,#menu,#gameselector,#mainmenu,#scoredetailed,#invitefriends,#msg-alert,#msg-information");
    $("body").append('<div id="touch-joystick"></div><div id="touch-fire"><div class="circle"></div></div><div id="touch-special"><div class="circle"></div></div>'),
    $("#touch-fire").on("touchstart", function(e) {
        A("FIRE", true),
        $("#touch-fire > .circle").css({
            "background-color": "rgba(255, 255, 255, 0.5)"
        }),
        e.preventDefault()
    }),
    $("#touch-fire").on("touchend", function(e) {
        A("FIRE", false),
        $("#touch-fire > .circle").css({
            "background-color": "rgba(255, 255, 255, 0.2)"
        }),
        e.preventDefault()
    }),
    $("#touch-special").on("touchstart", function(e) {
        A("SPECIAL", true),
        $("#touch-special > .circle").css({
            "background-color": "rgba(255, 255, 255, 0.5)"
        }),
        e.preventDefault()
    }),
    $("#touch-special").on("touchend", function(e) {
        A("SPECIAL", false),
        $("#touch-special > .circle").css({
            "background-color": "rgba(255, 255, 255, 0.2)"
        }),
        e.preventDefault()
    });
    var e = {
        zone: $("#touch-joystick")[0],
        mode: "static",
        position: {
            bottom: "50%",
            left: "50%"
        }
    };
    (joystick = nipplejs.create(e)).on("end", Input.touchEnd),
    joystick.on("move", Input.touchMove)
};

Input.toggleMouse = function(e) {
    if (!config.mobile)
        if ($(window).off("mousedown"),
        $(window).off("mouseup"),
        config.mouse = !config.mouse,
        config.mouse) {
            if ($(window).on("mousedown", Input.mouseDown),
            $(window).on("mouseup", Input.mouseUp),
            e)
                return;
            UI.showMessage("alert", '<span class="info">MOUSE MODE</span>Enabled<div class="mousemode"><span class="info">LEFT CLICK</span>Fire&nbsp;&nbsp;&nbsp;<span class="info">RIGHT CLICK</span>Special&nbsp;&nbsp;&nbsp;<span class="info">WASD</span>Move</div>', 7e3),
            Tools.setSettings({
                mousemode: true
            })
        } else
            UI.showMessage("alert", '<span class="info">MOUSE MODE</span>Disabled', 3e3),
            Tools.removeSetting("mousemode")
};

Input.mouseDown = function(e) {
    var t = e.originalEvent;
    if ((0 == t.button || 2 == t.button) && null != t.target.tagName && "canvas" == t.target.tagName.toLowerCase()) {
        var n = 0 == t.button ? "FIRE" : "SPECIAL";
        A(n, true),
        e.preventDefault()
    }
};

Input.mouseUp = function(e) {
    var t = e.originalEvent;
    if (0 == t.button || 2 == t.button)
        if (null != t.target.tagName && "canvas" == t.target.tagName.toLowerCase()) {
            var n = 0 == t.button ? "FIRE" : "SPECIAL";
            A(n, false),
            e.preventDefault()
        } else
            A("FIRE", false),
            A("SPECIAL", false)
};

var A = function(t, n) {
    (lastTransmittedKeyState[t] == !n || n && null == lastTransmittedKeyState[t]) && (Network.sendKey(t, n),
    lastTransmittedKeyState[t] = n)
};

var handleRotation = function(rotation, touchForce) {
    var player = Players.getMe();
    if (null != player) {
        var o = rotation - player.rot;
        o > Math.PI && (o -= 2 * Math.PI),
        o < -Math.PI && (o += 2 * Math.PI);
        var s = Math.round(Math.abs(o) / (60 * config.ships[player.type].turnFactor) * 1e3);
        if (!((s -= Math.round(game.ping)) < 10 || game.time - i < 100)) {
            null != maybeRotationTimerId && clearTimeout(maybeRotationTimerId),
            i = game.time;
            var a = o > 0 ? "RIGHT" : "LEFT",
                l = o <= 0 ? "RIGHT" : "LEFT";
            A("UP", !(null != touchForce && touchForce < .5)),
            A(a, true),
            A(l, false),
            maybeRotationTimerId = setTimeout(function() {
                A(a, false)
            }, s)
        }
    }
};

Input.touchMove = function(event, touchPoint) {
    var n = -touchPoint.angle.radian + Math.PI / 2,
        r = n = (n % TWO_PI + TWO_PI) % TWO_PI;
    handleRotation(r, touchPoint.force)
};

Input.touchEnd = function(e, t) {
    A("UP", false),
    A("LEFT", false),
    A("RIGHT", false)
};

Input.gameFocus = function() {
    game.focus = true
};

Input.gameBlur = function() {
    game.focus = false,
    Input.clearKeys()
};

var C = function(e) {
    if (3 == game.myType && ("STRAFELEFT" === e || "STRAFERIGHT" === e))
        return C("SPECIAL"),
        void C("STRAFELEFT" === e ? "LEFT" : "RIGHT");
    -1 !== x.indexOf(e) && Network.sendKey(e, true)
};

var R = function(bind) {
    if (3 != game.myType || "STRAFELEFT" !== bind && "STRAFERIGHT" !== bind)
        -1 !== networkKeyNames.indexOf(bind) && Network.sendKey(bind, false);
    else {
        R("STRAFELEFT" === bind ? "LEFT" : "RIGHT");
        lastTransmittedKeyState["STRAFERIGHT" === bind ? "STRAFELEFT" : "STRAFERIGHT"] || R("SPECIAL")
    }
};
