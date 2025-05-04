import Vector from './Vector';


class Player {
    constructor(playerNewMsg, isFromLoginPacket) {
        this.id = playerNewMsg.id;
        this.status = playerNewMsg.status;
        this.spectate = false;
        this.level = null == playerNewMsg.level || 0 == playerNewMsg.level ? null : playerNewMsg.level;
        this.reel = 1 == playerNewMsg.reel;
        this.name = playerNewMsg.name;
        this.type = playerNewMsg.type;
        this.team = playerNewMsg.team;
        this.pos = new Vector(playerNewMsg.posX, playerNewMsg.posY);
        this.lowResPos = new Vector(playerNewMsg.posX, playerNewMsg.posY);
        this.speed = Vector.zero();
        this.speedupgrade = 0;
        this.rot = playerNewMsg.rot;
        this.flag = playerNewMsg.flag;
        this.speedLength = 0;
        this.sprites = {};
        this.randomness = Tools.rand(0, 1e5);
        this.keystate = {};
        this.lastKilled = 0;
        this.health = 1;
        this.energy = 1;
        this.healthRegen = 1;
        this.energyRegen = 1;
        this.boost = false;
        this.strafe = false;
        this.flagspeed = false;
        this.stealthed = false;
        this.alpha = 1;
        this.scale = 1;
        this.powerups = {
          shield : false,
          rampage : false
        };
        this.powerupsShown = {
          shield : false,
          rampage : false
        };
        this.powerupActive = false;
        this.render = true;
        this.hidden = false;
        this.culled = false;
        this.timedout = false;
        this.reducedFactor = false;
        this.lastPacket = game.timeNetwork;
        this.state = {
          thrustLevel : 0,
          thrustDir : 0,
          bubble : false,
          bubbleProgress : 0,
          bubbleFade : 0,
          bubbleTime : 0,
          bubbleTextWidth : 0,
          hasBadge : false,
          badge : 0,
          stealthLevel : 0,
          scaleLevel : 1,
          powerupAngle : 0,
          powerupFade : 0,
          powerupFadeState : 0,
          lastBounceSound : 0
        };
        this.bot = playerNewMsg.isBot;
        if (this.bot) {
            this.name = Tools.stripBotsNamePrefix(this.name);
        }
        this.name = Tools.mungeNonAscii(this.name, this.id);
        this.setupGraphics();
        if (0 == this.status) {
          Tools.decodeUpgrades(this, playerNewMsg.upgrades);
          this.updatePowerups();
        } else {
          this.hidden = true;
          if (this.me()) {
            UI.visibilityHUD(false);
          }
        }
        if (this.reel) {
          this._prevPos = null;
          this._offset = null;
        } else {
          this.visibilityUpdate();
        }
        if (!isFromLoginPacket && this.render || this.me()) {
          this.scale = 0;
          this.state.scaleLevel = 0;
        }
        if (this.me()) {
          game.myType = playerNewMsg.type;
          UI.aircraftSelected(playerNewMsg.type);
        }
      }

    setupGraphics(isPlaneTypeChange) {
        var propOverrides = null;
        if(this.me()) {
            propOverrides = {
                layer: "aircraftme"
            };
        }
        this.sprites.powerup = Textures.init("powerupShield", {
            visible: false,
            alpha: .75
        });
        this.sprites.powerupCircle = Textures.init("powerupCircle", {
            visible: false,
            alpha: .75
        });

        switch(this.type) {
        case PlaneType.Predator:
            this.state.baseScale = .25;
            this.state.nameplateDist = 60;
            this.sprites.sprite = Textures.init("shipRaptor", propOverrides);
            this.sprites.shadow = Textures.init("shipRaptorShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            });
            this.sprites.thruster = Textures.init("shipRaptorThruster");
            this.sprites.thrusterGlow = Textures.init("thrusterGlowSmall");
            this.sprites.thrusterShadow = Textures.init("thrusterShadow");
            break;
        case PlaneType.Goliath:
            this.state.baseScale = .35;
            this.state.nameplateDist = 60;
            this.sprites.sprite = Textures.init("shipSpirit", propOverrides);
            this.sprites.shadow = Textures.init("shipSpiritShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            });
            this.sprites.thruster1 = Textures.init("shipRaptorThruster");
            this.sprites.thruster2 = Textures.init("shipRaptorThruster");
            this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall");
            this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall");
            this.sprites.thruster1Shadow = Textures.init("thrusterShadow");
            this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
            break;
        case PlaneType.Mohawk:
            this.state.baseScale = .25;
            this.state.nameplateDist = 60;
            this.sprites.sprite = Textures.init("shipComanche", propOverrides);
            this.sprites.rotor = Textures.init("shipComancheRotor", propOverrides);
            this.sprites.shadow = Textures.init("shipComancheShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            });
            this.sprites.rotorShadow = Textures.init("shipComancheRotorShadow", {
                scale: 2 * this.state.baseScale * (2.4 / config.shadowScaling)
            });
            break;
        case PlaneType.Tornado:
            this.state.baseScale = .28;
            this.state.nameplateDist = 60;
            this.sprites.sprite = Textures.init("shipTornado", propOverrides);
            this.sprites.shadow = Textures.init("shipTornadoShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            });
            this.sprites.thruster1 = Textures.init("shipRaptorThruster");
            this.sprites.thruster2 = Textures.init("shipRaptorThruster");
            this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall");
            this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall");
            this.sprites.thruster1Shadow = Textures.init("thrusterShadow");
            this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
            break;
        case PlaneType.Prowler:
            this.state.baseScale = .28;
            this.state.nameplateDist = 60;
            this.sprites.sprite = Textures.init("shipProwler", propOverrides);
            this.sprites.shadow = Textures.init("shipProwlerShadow", {
                scale: this.state.baseScale * (2.4 / config.shadowScaling)
            });
            this.sprites.thruster1 = Textures.init("shipRaptorThruster");
            this.sprites.thruster2 = Textures.init("shipRaptorThruster");
            this.sprites.thruster1Glow = Textures.init("thrusterGlowSmall");
            this.sprites.thruster2Glow = Textures.init("thrusterGlowSmall");
            this.sprites.thruster1Shadow = Textures.init("thrusterShadow");
            this.sprites.thruster2Shadow = Textures.init("thrusterShadow");
        }
        if(! (this.reel || isPlaneTypeChange)) {
            this.setupNameplate();
            this.setupChatBubbles();
            if(this.level != null || this.bot) {
                this.setupLevelPlate();
            }
        }
        if(config.debug.collisions) {
            this.col = new PIXI.Graphics;
            for (var n of config.ships[this.type].collisions) {
                this.col.beginFill(0xffffff, .2);
                this.col.drawCircle(n[0], n[1], n[2]);
                this.col.endFill();
            }
            game.graphics.layers.explosions.addChild(this.col);
        }
    }

    reteam(e) {
        this.team = e;
        this.sprites.name.style = new PIXI.TextStyle(this.nameplateTextStyle());
        UI.changeMinimapTeam(this.id, this.team);
    }

    nameplateTextStyle() {
        if (2 == game.gameType)
            var e = 1 == this.team ? "#4076E2" : "#EA4242";
        else
            e = this.team == game.myTeam ? "#FFFFFF" : "#FFEC52";
        return {
            fontFamily: "MontserratWeb, Helvetica, sans-serif",
            fontSize: (33 * config.airmashRefugees.fontSizeMul) + "px",
            fill: e,
            dropShadow: true,
            dropShadowBlur: 10,
            dropShadowDistance: 0,
            padding: 4
        }
    }

    setupNameplate() {
        var e = "";
        2 == game.gameType && (e = "  ■"),
        this.sprites.name = new PIXI.Text(this.name + e,this.nameplateTextStyle()),
        this.sprites.name.scale.set(.5, .5),
        this.sprites.flag = Textures.sprite("flag_" + this.flag),
        this.sprites.flag.scale.set(.4, .4),
        this.sprites.flag.anchor.set(.5, .5),
        this.sprites.badge = Textures.sprite("badge_gold"),
        this.sprites.badge.scale.set(.3),
        this.sprites.badge.visible = false,
        game.graphics.layers.playernames.addChild(this.sprites.badge),
        game.graphics.layers.playernames.addChild(this.sprites.flag),
        game.graphics.layers.playernames.addChild(this.sprites.name)
    }

    setupChatBubbles() {
        this.sprites.bubble = new PIXI.Container;
        this.sprites.bubbleLeft = Graphics.initSprite("chatbubbleleft", this.sprites.bubble, {
            scale: .5
        });
        this.sprites.bubbleRight = Graphics.initSprite("chatbubbleright", this.sprites.bubble, {
            scale: .5
        });
        this.sprites.bubbleCenter = Graphics.initSprite("chatbubblecenter", this.sprites.bubble, {
            scale: .5
        });
        this.sprites.bubblePoint = Graphics.initSprite("chatbubblepoint", this.sprites.bubble, {
            scale: .5
        });
        this.sprites.emote = Graphics.initSprite("emote_tf", this.sprites.bubble, {
            scale: .6,
            anchor: [.5, .5]
        });
        this.sprites.bubbleText = new PIXI.Text("a",{
            fontFamily: "MontserratWeb, Helvetica, sans-serif",
            fontSize: (12 * config.airmashRefugees.fontSizeMul) + "px",
            fill: "white"
        });
        this.sprites.bubble.addChild(this.sprites.bubbleText);
        this.sprites.bubble.visible = false;
        this.sprites.bubble.pivot.set(.5, 34);
        game.graphics.layers.bubbles.addChild(this.sprites.bubble);
    }

    visibilityUpdate(force) {
        this.culled = !Graphics.inScreen(this.pos, 128);
        var isVisible = !(this.hidden || this.culled || this.timedout);

        if (force || this.render != isVisible) {
            this.sprites.sprite.visible = isVisible;
            this.sprites.shadow.visible = isVisible;
            this.sprites.flag.visible = isVisible;
            this.sprites.name.visible = isVisible;

            if(null != this.sprites.level) {
                this.sprites.level.visible = isVisible;
                this.sprites.levelBorder.visible = isVisible;
            }

            this.sprites.badge.visible = this.state.hasBadge && isVisible;
            this.sprites.powerup.visible = this.powerupActive && isVisible;
            this.sprites.powerupCircle.visible = this.powerupActive && isVisible;

            switch (this.type) {
            case PlaneType.Predator:
                this.sprites.thruster.visible = isVisible;
                this.sprites.thrusterGlow.visible = isVisible;
                this.sprites.thrusterShadow.visible = isVisible;
                break;
            case PlaneType.Goliath:
            case PlaneType.Tornado:
            case PlaneType.Prowler:
                this.sprites.thruster1.visible = isVisible;
                this.sprites.thruster1Glow.visible = isVisible;
                this.sprites.thruster1Shadow.visible = isVisible;
                this.sprites.thruster2.visible = isVisible;
                this.sprites.thruster2Glow.visible = isVisible;
                this.sprites.thruster2Shadow.visible = isVisible;
                break;
            case PlaneType.Mohawk:
                this.sprites.rotor.visible = isVisible;
                this.sprites.rotorShadow.visible = isVisible;
            }

            this.render = isVisible;
            if(! isVisible) {
                Sound.clearThruster(this.id);
            }
        }
    }

    stealth(eventStealthMsg) {
        this.lastPacket = game.timeNetwork;
        this.energy = eventStealthMsg.energy;
        this.energyRegen = eventStealthMsg.energyRegen;

        if(eventStealthMsg.state) {
            this.stealthed = true;
            this.state.stealthLevel = 0;
            if(this.team != game.myTeam) {
                if(this.keystate.LEFT) {
                    delete this.keystate.LEFT;
                }
                if(this.keystate.RIGHT) {
                    delete this.keystate.RIGHT;
                }
            }
        } else {
            this.unstealth();
        }
    }

    unstealth() {
        this.stealthed = false;
        this.state.stealthLevel = 0;
        this.opacity(1);
    }

    opacity(alpha) {
        this.alpha = alpha;
        this.sprites.sprite.alpha = alpha;
        this.sprites.shadow.alpha = alpha;
        this.sprites.flag.alpha = alpha;
        this.sprites.name.alpha = alpha;
        this.sprites.badge.alpha = alpha;
        this.sprites.powerup.alpha = .75 * alpha;
        this.sprites.powerupCircle.alpha = .75 * alpha;

        if(null != this.sprites.level) {
            this.sprites.level.alpha = alpha;
            this.sprites.levelBorder.alpha = .4 * alpha;
        }

        if(PlaneType.Prowler == this.type) {
            this.sprites.thruster1.alpha = alpha;
            this.sprites.thruster1Glow.alpha = alpha;
            this.sprites.thruster2.alpha = alpha;
            this.sprites.thruster2Glow.alpha = alpha;
        }
    }

    kill(ev) {
        this.status = 1;
        this.spectate = !!ev.spectate;
        this.keystate = {};
        this.pos.x = ev.posX;
        this.pos.y = ev.posY;
        this.speed = Vector.zero();
        if (this.me()) { 
            UI.resetPowerups();
        }
        this.resetPowerups();
        this.hidden = true;
        this.visibilityUpdate();
        if (this.stealthed) {
            this.unstealth();
        }

        if (!this.spectate) {
            this.lastKilled = performance.now();

            if (!this.culled) {
                switch (this.type) {
                    case PlaneType.Predator:
                        Particles.explosion(this.pos.clone(), Tools.rand(1.5, 2), Tools.randInt(2, 3));
                        break;
                    case PlaneType.Goliath:
                        Particles.explosion(this.pos.clone(), Tools.rand(2, 2.5), Tools.randInt(4, 7));
                        break;
                    case PlaneType.Mohawk:
                    case PlaneType.Tornado:
                    case PlaneType.Prowler:
                        Particles.explosion(this.pos.clone(), Tools.rand(1.5, 2), Tools.randInt(2, 3));
                        break;
                }
                Graphics.shakeCamera(this.pos, this.me() ? 20 : 10),
                Sound.clearThruster(this.id),
                Sound.playerKill(this)
            }
        }
    }

    me() {
        return game.myID == this.id
    }

    destroy(maybeFullDestroy) {
        var layer = this.me() ? game.graphics.layers.aircraftme : game.graphics.layers.aircraft;

        layer.removeChild(this.sprites.sprite);
        game.graphics.layers.shadows.removeChild(this.sprites.shadow);
        this.sprites.sprite.destroy();
        this.sprites.shadow.destroy();
        this.sprites.powerup.destroy();
        this.sprites.powerupCircle.destroy();

        switch (this.type) {
        case PlaneType.Predator:
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster),
            game.graphics.layers.thrusters.removeChild(this.sprites.thrusterGlow),
            this.sprites.thruster.destroy(),
            this.sprites.thrusterGlow.destroy(),
            this.sprites.thrusterShadow.destroy();
            break;
        case PlaneType.Goliath:
        case PlaneType.Tornado:
        case PlaneType.Prowler:
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster1, this.sprites.thruster2),
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster1Glow, this.sprites.thruster2Glow),
            this.sprites.thruster1.destroy(),
            this.sprites.thruster2.destroy(),
            this.sprites.thruster1Glow.destroy(),
            this.sprites.thruster2Glow.destroy(),
            this.sprites.thruster1Shadow.destroy(),
            this.sprites.thruster2Shadow.destroy();
            break;
        case PlaneType.Mohawk:
            layer.removeChild(this.sprites.rotor),
            this.sprites.rotor.destroy(),
            game.graphics.layers.shadows.removeChild(this.sprites.rotorShadow),
            this.sprites.rotorShadow.destroy()
        }

        if(maybeFullDestroy && !this.reel) {
            game.graphics.layers.playernames.removeChild(this.sprites.badge, this.sprites.name, this.sprites.flag);
            if(null != this.sprites.level) {
                game.graphics.layers.playernames.removeChild(this.sprites.level, this.sprites.levelBorder);
                this.sprites.level.destroy();
                this.sprites.levelBorder.destroy();
            }
            game.graphics.layers.bubbles.removeChild(this.sprites.bubble);
            this.sprites.badge.destroy();
            this.sprites.name.destroy();
            this.sprites.flag.destroy();
            this.sprites.bubble.destroy({
                children: true
            });
        }
    }

    sayBubble(e) {
        this.state.bubbleTime = game.time,
        this.state.bubbleFade = 0,
        this.state.bubble || (this.state.bubble = true,
        this.state.bubbleProgress = 0,
        this.sprites.bubble.visible = this.render,
        this.sprites.bubble.alpha = 0,
        this.sprites.bubble.scale.set(0, 0)),
        this.sprites.bubble.cacheAsBitmap = false;
        var t = UI.isEmote(e.text, true);
        if (t) {
            this.sprites.bubbleText.visible = false,
            this.sprites.emote.texture = Textures.get("emote_" + t),
            this.sprites.emote.visible = true;
            var n = 26;
            this.sprites.emote.position.set(0, 0)
        } else {
            this.sprites.bubbleText.visible = true,
            this.sprites.emote.visible = false,
            this.sprites.bubbleText.text = e.text;
            n = this.sprites.bubbleText.width;
            this.sprites.bubbleText.position.set(-n / 2, -7)
        }
        this.sprites.bubbleLeft.position.set(-n / 2 - 16, -21),
        this.sprites.bubbleRight.position.set(n / 2 + 8, -21),
        this.sprites.bubbleCenter.position.set(-n / 2 - 9, -21),
        this.sprites.bubbleCenter.scale.set(n / 82 + 18 / 82, .5),
        this.sprites.bubblePoint.position.set(-9, 18),
        this.sprites.bubble.cacheAsBitmap = true,
        this.state.bubbleTextWidth = n
    }

    networkKey(msgTypeId, updateMsg) {
        this.lastPacket = game.timeNetwork;
        if (1 == this.status) {
            this.revive();
        }
        if (null != updateMsg.posX) {
            this.reducedFactor = Tools.reducedFactor();
            this.pos.x = updateMsg.posX;
            this.pos.y = updateMsg.posY;
            this.rot = updateMsg.rot;
            this.speed.x = updateMsg.speedX;
            this.speed.y = updateMsg.speedY;
        }
        var n = this.stealthed;
        if (null != updateMsg.keystate) {
            Tools.decodeKeystate(this, updateMsg.keystate);
        }
        if (null != updateMsg.upgrades) {
            Tools.decodeUpgrades(this, updateMsg.upgrades);
            this.updatePowerups();
        }
        if (null != updateMsg.energy) {
            this.energy = updateMsg.energy;
            this.energyRegen = updateMsg.energyRegen;
        }
        if (null != updateMsg.boost) {
            this.boost = updateMsg.boost;
        }
        if (this.team != game.myTeam && (this.stealthed || n && !this.stealthed)) {
            this.unstealth();
        }
        if (!(this.me() || !n || this.stealthed)) {
            this.unstealth();
        }
        if (updateMsg.c == Network.SERVERPACKET.EVENT_BOUNCE && game.time - this.state.lastBounceSound > 300) {
            this.state.lastBounceSound = game.time;
            Sound.playerImpact(this.pos, this.type, this.speed.length() / config.ships[this.type].maxSpeed);
        }
    }

    updateLevel(packet) {
        if (this.me()) { 
            if (packet.type == 1) {
                Games.showLevelUp(packet.level);
            }
            UI.updateMyLevel(packet.level);
        }
        this.level = packet.level;
        this.setupLevelPlate();
    }

    setupLevelPlate() {
        let plateText = this.bot ? "bot" : this.level + "";
        null == this.sprites.level ? (this.sprites.level = new PIXI.Text(plateText, {
            fontFamily: "MontserratWeb, Helvetica, sans-serif",
            fontSize: (
                ((this.bot ? 24 : 28) * config.airmashRefugees.fontSizeMul) + "px"
            ),
            fill: "rgb(200, 200, 200)",
            dropShadow: true,
            dropShadowBlur: 6,
            dropShadowDistance: 0,
            padding: 4
        }),
        this.sprites.level.scale.set(.5, .5),
        this.sprites.levelBorder = Textures.sprite("levelborder"),
        this.sprites.levelBorder.alpha = .4,
        game.graphics.layers.playernames.addChild(this.sprites.levelBorder),
        game.graphics.layers.playernames.addChild(this.sprites.level)) : this.sprites.level.text = plateText,
        this.sprites.levelBorder.scale.set((this.sprites.level.width + 10) / 32, .65),
        this.sprites.level.visible = this.render,
        this.sprites.levelBorder.visible = this.render
    }

    powerup(e) {
        UI.addPowerup(e.type, e.duration)
    }

    resetPowerups() {
        this.powerupActive && (this.sprites.powerup.visible = false,
        this.sprites.powerupCircle.visible = false),
        this.powerups.shield = false,
        this.powerupsShown.shield = false,
        this.powerups.rampage = false,
        this.powerupsShown.rampage = false,
        this.powerupActive = false,
        this.state.powerupFade = 0,
        this.state.powerupFadeState = 0
    }

    updatePowerups() {
        var e = false;
        this.powerups.shield != this.powerupsShown.shield && (this.powerupsShown.shield = this.powerups.shield,
        this.powerups.shield && (this.sprites.powerup.texture = Textures.get("powerup_shield"),
        this.sprites.powerupCircle.tint = 16777215),
        e = true),
        this.powerups.rampage != this.powerupsShown.rampage && (this.powerupsShown.rampage = this.powerups.rampage,
        this.powerups.rampage && (this.sprites.powerup.texture = Textures.get("powerup_rampage"),
        this.sprites.powerupCircle.tint = 16712448),
        e = true),
        e && (this.powerupActive = this.powerups.shield || this.powerups.rampage,
        this.powerupActive ? (this.state.powerupFade = 0,
        this.state.powerupFadeState = 0,
        this.sprites.powerup.visible = true,
        this.sprites.powerupCircle.visible = true) : (this.powerupActive = true,
        this.state.powerupFade = 0,
        this.state.powerupFadeState = 1))
    }

    impact(e, t, n, r) {
        this.health = n,
        this.healthRegen = r,
        this.stealthed && this.unstealth(),
        200 != e && Mobs.explosion(t, e),
        this.me() && 0 == this.status && Graphics.shakeCamera(t, 8)
    }

    changeType(e) {
        this.type != e.type && (this.destroy(false),
        this.type = e.type,
        this.setupGraphics(true),
        this.visibilityUpdate(true))
    }

    respawn(e) {
        this.lastPacket = game.timeNetwork,
        this.status = 0,
        this.spectate = false,
        this.keystate = {},
        this.pos.x = e.posX,
        this.pos.y = e.posY,
        this.rot = e.rot,
        this.speed.x = 0,
        this.speed.y = 0,
        this.health = 1,
        this.energy = 1,
        this.healthRegen = 1,
        this.energyRegen = 1,
        this.boost = false,
        this.strafe = false,
        this.flagspeed = false,
        this.state.thrustLevel = 0,
        this.state.thrustDir = 0,
        this.hidden = false,
        this.timedout = false,
        this.visibilityUpdate();
        if (this.me()) { 
            UI.resetPowerups(); 
        }
        Tools.decodeUpgrades(this, e.upgrades);
        this.updatePowerups();
        if (this.render || this.me()) { 
            this.scale = 0;
            this.state.scaleLevel = 0;
        }
        
        if (this.stealthed)  {
            this.unstealth();
        }
        
        if (this.me()) {
            game.myType = this.type;
            game.spectatingID = null;
            UI.aircraftSelected(this.type);
            UI.visibilityHUD(true);
            UI.hideSpectator();
        }
        this.updateGraphics(1);
        Sound.playerRespawn(this);
        UI.updateGameInfo();
    }

    revive() {
        this.status = 0;
        this.spectate = false;
        this.boost = false;
        this.strafe = false;
        this.flagspeed = false;
        this.hidden = false;
        this.health = 1;
        this.energy = 1;
        this.healthRegen = 1;
        this.energyRegen = 1;
        if (this.stealthed) {
            this.unstealth();
        }
        UI.updateGameInfo();
    }

    changeFlag(e) {
        this.flag = e.flag,
        this.sprites.flag.texture = Textures.get("flag_" + e.flag)
    }

    changeBadge(e) {
        this.sprites.badge.texture = Textures.get(e)
    }

    updateNameplate() {
        if (!this.reel) {
            let nameFlagHalfWidth = (this.sprites.name.width + this.sprites.flag.width + 10) / 2;
            let nameplateX = this.pos.x - nameFlagHalfWidth + (this.state.hasBadge ? 12 : 0) - (this.sprites.level ? this.sprites.level.width / 2 + 8 : 0);
            let nameplateY = this.pos.y + this.state.nameplateDist * this.scale;
            this.sprites.flag.position.set(nameplateX + 15, nameplateY + 10);
            this.sprites.name.position.set(nameplateX + 40, nameplateY);
            if (this.sprites.level) {
                this.sprites.level.position.set(nameplateX + 2 * nameFlagHalfWidth + 13, nameplateY + (this.bot ? 3 : 2));
                this.sprites.levelBorder.position.set(nameplateX + 2 * nameFlagHalfWidth + 7.75, nameplateY - 0.5);
            }
            if (this.state.hasBadge) {
                this.sprites.badge.position.set(nameplateX - 28, nameplateY);
            }
        }
    }

    updateBubble() {
        this.sprites.bubble.visible = this.render,
        this.state.bubbleProgress += .015 * game.timeFactor,
        this.state.bubbleProgress >= 1 && (this.state.bubbleProgress = 1),
        game.time - this.state.bubbleTime > 4e3 ? (this.state.bubbleFade += .08 * game.timeFactor,
        this.state.bubbleFade >= 1 && (this.state.bubbleFade = 1),
        this.sprites.bubble.scale.set(1 + .2 * this.state.bubbleFade),
        this.sprites.bubble.alpha = 1 * (1 - this.state.bubbleFade),
        this.state.bubbleFade >= 1 && (this.state.bubble = false,
        this.sprites.bubble.visible = false)) : (this.sprites.bubble.scale.set(Tools.easing.outElastic(this.state.bubbleProgress, .5)),
        this.sprites.bubble.alpha = 1);
        var e = (this.state.bubbleTextWidth + game.screenX) % 2 == 0 ? .5 : 0,
            t = game.screenY % 2 == 0 ? 0 : .5,
            n = this.state.nameplateDist * this.scale;
        this.powerupActive && (n += 60),
        this.sprites.bubble.position.set(this.pos.x * game.scale + e, (this.pos.y - n) * game.scale + t)
    }

    detectTimeout() {
        if (!this.me()) {
            var e = this.timedout;
            this.timedout = !game.lagging && game.timeNetwork - this.lastPacket > 3e3,
            this.timedout && !e && (this.boost = false,
            this.strafe = false,
            this.flagspeed = false,
            this.speed = Vector.zero(),
            this.keystate = {},
            this.resetPowerups())
        }
    }

    leaveHorizon() {
        this.me() || this.timedout || (this.lastPacket = -1e4,
        this.timedout = true,
        this.boost = false,
        this.strafe = false,
        this.flagspeed = false,
        this.speed = Vector.zero(),
        this.keystate = {},
        this.resetPowerups())
    }

    update(timeFrac) {
        if(this.reel) {
            this.clientCalcs(timeFrac);
            return;
        }

        this.detectTimeout();
        this.visibilityUpdate();

        if(! this.render) {
            this.health += timeFrac * this.healthRegen;
            if(this.health >= 1) {
                this.health = 1;
            }
            return;
        }

        if (!(false !== this.reducedFactor && (timeFrac = timeFrac - this.reducedFactor, this.reducedFactor = false, timeFrac <= 0))) {
            var roundedFrames = timeFrac > .51 ? Math.round(timeFrac) : 1;
            var perLoopEffect = timeFrac / roundedFrames;
            var twoPi = 2 * Math.PI;
            var boostMul = this.boost ? 1.5 : 1;
            for (var i = 0; i < roundedFrames; i++) {
                this.energy += perLoopEffect * this.energyRegen;
                if (this.energy >= 1) {
                    this.energy = 1;
                }
            
                this.health += perLoopEffect * this.healthRegen;
                if (this.health >= 1) {
                    this.health = 1;
                }

                var speedDeltaAngle = -999;
                if (this.strafe) {
                    if (this.keystate.LEFT) {
                        speedDeltaAngle = this.rot - .5 * Math.PI;
                    }
                    if (this.keystate.RIGHT) {
                        speedDeltaAngle = this.rot + .5 * Math.PI;
                    }
                } else {
                    if (this.keystate.LEFT) {
                        this.rot += -perLoopEffect * config.ships[this.type].turnFactor;
                    }
                    if (this.keystate.RIGHT) {
                        this.rot += perLoopEffect * config.ships[this.type].turnFactor;
                    }
                }

                var prevSpeedX = this.speed.x;
                var prevSpeedY = this.speed.y;

                if (this.keystate.UP) {
                    if (-999 == speedDeltaAngle) {
                        speedDeltaAngle = this.rot;
                    } else {
                        speedDeltaAngle = speedDeltaAngle + Math.PI * (this.keystate.RIGHT ? -.25 : .25);
                    }
                } else {
                    if (this.keystate.DOWN) {
                        if (-999 == speedDeltaAngle) {
                            speedDeltaAngle = this.rot + Math.PI;
                        } else {
                            speedDeltaAngle = speedDeltaAngle + Math.PI * (this.keystate.RIGHT ? .25 : -.25);
                        }
                    }
                }
                if (-999 !== speedDeltaAngle) {
                    this.speed.x += Math.sin(speedDeltaAngle) * config.ships[this.type].accelFactor * perLoopEffect * boostMul;
                    this.speed.y -= Math.cos(speedDeltaAngle) * config.ships[this.type].accelFactor * perLoopEffect * boostMul;
                }
                var curSpeed = this.speed.length();
                var maxSpeed = config.ships[this.type].maxSpeed * boostMul * config.upgrades.speed.factor[this.speedupgrade];
                var minSpeed = config.ships[this.type].minSpeed;
                if (this.powerups.rampage) {
                    maxSpeed = maxSpeed * .75;
                }
                if (this.flagspeed) {
                    maxSpeed = 5;
                }
                if (curSpeed > maxSpeed) {
                    this.speed.multiply(maxSpeed / curSpeed);
                } else {
                    if (this.speed.x > minSpeed || this.speed.x < -minSpeed || this.speed.y > minSpeed || this.speed.y < -minSpeed) {
                        this.speed.x *= 1 - config.ships[this.type].brakeFactor * perLoopEffect;
                        this.speed.y *= 1 - config.ships[this.type].brakeFactor * perLoopEffect;
                    } else {
                        this.speed.x = 0;
                        this.speed.y = 0;
                    }
                }
                this.pos.x += perLoopEffect * prevSpeedX + .5 * (this.speed.x - prevSpeedX) * perLoopEffect * perLoopEffect;
                this.pos.y += perLoopEffect * prevSpeedY + .5 * (this.speed.y - prevSpeedY) * perLoopEffect * perLoopEffect;
                this.clientCalcs(perLoopEffect);
            }

            this.rot = (this.rot % twoPi + twoPi) % twoPi;
            if (-1 != game.gameType) {
                if (this.pos.x < -16352) {
                    this.pos.x = -16352;
                }
                if (this.pos.x > 16352) {
                    this.pos.x = 16352;
                }
                if (this.pos.y < -8160) {
                    this.pos.y = -8160;
                }
                if (this.pos.y > 8160) {
                    this.pos.y = 8160;
                }
            } else {
                if (this.pos.x < -16384) {
                    this.pos.x += 32768;
                }
                if (this.pos.x > 16384) {
                    this.pos.x -= 32768;
                }
                if (this.pos.y < -8192) {
                    this.pos.y += 16384;
                }
                if (this.pos.y > 8192) {
                    this.pos.y -= 16384;
                }
            }
            Sound.updateThruster(0, this);
        }
    }

    clientCalcs(timeFrac) {
        switch(this.type) {
            case PlaneType.Predator:
            case PlaneType.Goliath:
            case PlaneType.Tornado:
            case PlaneType.Prowler:
                var scrollviewTransform = false;
                var angleToDraw = false;
                var t = this.boost ? 1.5 : 1;
                if (false !== (scrollviewTransform = this.keystate.LEFT ? .3 : this.keystate.RIGHT ? -.3 : 0)) {
                    this.state.thrustDir = Tools.converge(this.state.thrustDir, scrollviewTransform, .1 * timeFrac);
                }
                if (false !== (angleToDraw = this.keystate.UP ? 1 : this.keystate.DOWN ? -1 : 0)) {
                    this.state.thrustLevel = Tools.converge(this.state.thrustLevel, angleToDraw * t, .2 * timeFrac);
                }
                break;
            case PlaneType.Mohawk:
                this.state.thrustDir += (.2 + this.speed.length() / 50) * timeFrac;
        }
        if (!this.culled) {
            if (this.render) {
                if (!this.stealthed && this.health < .4) {
                    Particles.planeDamage(this);
                }
                if (!this.stealthed && this.health < .2) {
                    Particles.planeDamage(this);
                }
                if (this.boost) {
                    Particles.planeBoost(this, angleToDraw >= 0);
                }
                if (PlaneType.Prowler == this.type && this.stealthed) {
                    this.state.stealthLevel += .03 * timeFrac;
                    this.state.stealthLevel = Tools.clamp(this.state.stealthLevel, 0, this.team == game.myTeam ? .5 : 1);
                    this.opacity(1 - this.state.stealthLevel);
                }
                this.state.scaleLevel += .005 * timeFrac;
                if (this.state.scaleLevel >= 1) {
                    this.state.scaleLevel = 1;
                    this.scale = 1;
                } else {
                    this.scale = Tools.easing.outElastic(this.state.scaleLevel, .5);
                }
                if (this.powerupActive) {
                    this.state.powerupAngle += .075 * timeFrac;
                    if (0 == this.state.powerupFadeState) {
                        this.state.powerupFade += .05 * timeFrac;
                        if (this.state.powerupFade >= 1) {
                            this.state.powerupFade = 1;
                        }
                    } else {
                        this.state.powerupFade += .05 * timeFrac;
                        if (this.state.powerupFade >= 1) {
                            this.powerupActive = false;
                            this.sprites.powerup.visible = false;
                            this.sprites.powerupCircle.visible = false;
                        }
                    }
                }
            }
        }
    }

    updateGraphics(e) {
        var t = Tools.oscillator(0.025, 1e3, this.randomness) * this.scale,
            n = 1.5 * this.state.thrustLevel,
            r = this.rot,
            i = Graphics.shadowCoords(this.pos);
        if (Graphics.transform(this.sprites.sprite, this.pos.x, this.pos.y, r, t * this.state.baseScale, t * this.state.baseScale),
        Graphics.transform(this.sprites.shadow, i.x, i.y, r, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale),
        this.powerupActive) {
            var o = .35 * (0 == this.state.powerupFadeState ? 2 * (1 - this.state.powerupFade) + 1 : 1 - this.state.powerupFade) * Tools.oscillator(.075, 100, this.randomness),
                s = .75 * (0 == this.state.powerupFadeState ? Tools.clamp(2 * this.state.powerupFade, 0, 1) : Tools.clamp(1 - 1.3 * this.state.powerupFade, 0, 1)) * this.alpha;
            Graphics.transform(this.sprites.powerup, this.pos.x, this.pos.y - 80, 0, o, o, s),
            Graphics.transform(this.sprites.powerupCircle, this.pos.x, this.pos.y - 80, this.state.powerupAngle, 1.35 * o, 1.35 * o, s)
        }
        var a = Tools.oscillator(.1, .5, this.randomness),
            l = Math.abs(this.state.thrustLevel) < .01 ? 0 : this.state.thrustLevel / 2 + (this.state.thrustLevel > 0 ? .5 : -.5),
            u = Tools.clamp(2 * Math.abs(this.state.thrustLevel) - .1, 0, 1);
        switch (this.type) {
        case PlaneType.Predator:
            Graphics.transform(this.sprites.thruster, this.pos.x + Math.sin(-r) * (20 * t), this.pos.y + Math.cos(-r) * (20 * t), r + (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .5 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thrusterShadow, i.x + Math.sin(-r) * (20 * t) / config.shadowScaling, i.y + Math.cos(-r) * (20 * t) / config.shadowScaling, r + (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale * (4 / config.shadowScaling), .5 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thrusterGlow, this.pos.x + Math.sin(-r - .5 * this.state.thrustDir) * (40 * t), this.pos.y + Math.cos(-r - .5 * this.state.thrustDir) * (40 * t), null, 1.5 * n * this.scale, 1 * n * this.scale, .3 * this.state.thrustLevel);
            break;
        case PlaneType.Goliath:
            this.state.thrustLevel < 0 && (a *= .7),
            Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-r - .5) * (32 * t), this.pos.y + Math.cos(-r - .5) * (32 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale, .6 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.5 - r) * (32 * t), this.pos.y + Math.cos(.5 - r) * (32 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale, .6 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster1Shadow, i.x + Math.sin(-r - .5) * (32 * t) / config.shadowScaling, i.y + Math.cos(-r - .5) * (32 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .5 * a * l * this.scale * (4 / config.shadowScaling), .6 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster2Shadow, i.x + Math.sin(.5 - r) * (32 * t) / config.shadowScaling, i.y + Math.cos(.5 - r) * (32 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .5 * a * l * this.scale * (4 / config.shadowScaling), .6 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-r - .3) * (50 * t), this.pos.y + Math.cos(-r - .3) * (50 * t), null, 2.5 * this.scale, 1.5 * this.scale, .3 * this.state.thrustLevel),
            Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.3 - r) * (50 * t), this.pos.y + Math.cos(.3 - r) * (50 * t), null, 2.5 * this.scale, 1.5 * this.scale, .3 * this.state.thrustLevel);
            break;
        case PlaneType.Mohawk:
            Graphics.transform(this.sprites.rotor, this.pos.x, this.pos.y, this.state.thrustDir, t * this.state.baseScale * 2, t * this.state.baseScale * 2, .8),
            Graphics.transform(this.sprites.rotorShadow, i.x, i.y, this.state.thrustDir, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale * 2, this.state.baseScale * (2.4 / config.shadowScaling) * this.scale * 2);
            break;
        case PlaneType.Tornado:
            this.state.thrustLevel < 0 && (a *= .7),
            Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-r - .15) * (28 * t), this.pos.y + Math.cos(-r - .15) * (28 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .5 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.15 - r) * (28 * t), this.pos.y + Math.cos(.15 - r) * (28 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .5 * a * l * this.scale, u),
            Graphics.transform(this.sprites.thruster1Shadow, i.x + Math.sin(-r - .15) * (28 * t) / config.shadowScaling, i.y + Math.cos(-r - .15) * (28 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale * (4 / config.shadowScaling), .5 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster2Shadow, i.x + Math.sin(.15 - r) * (28 * t) / config.shadowScaling, i.y + Math.cos(.15 - r) * (28 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale * (4 / config.shadowScaling), .5 * a * l * this.scale * (4 / config.shadowScaling), u / 2.5),
            Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-r - .2) * (45 * t), this.pos.y + Math.cos(-r - .2) * (45 * t), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel),
            Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - r) * (45 * t), this.pos.y + Math.cos(.2 - r) * (45 * t), null, 2.5 * this.scale, 1.5 * this.scale, .25 * this.state.thrustLevel);
            break;
        case PlaneType.Prowler:
            this.state.thrustLevel < 0 && (a *= .7),
            Graphics.transform(this.sprites.thruster1, this.pos.x + Math.sin(-r - .35) * (20 * t), this.pos.y + Math.cos(-r - .35) * (20 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .4 * a * l * this.scale, u * this.alpha),
            Graphics.transform(this.sprites.thruster2, this.pos.x + Math.sin(.35 - r) * (20 * t), this.pos.y + Math.cos(.35 - r) * (20 * t), r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .3 * a * l * this.scale, .4 * a * l * this.scale, u * this.alpha),
            Graphics.transform(this.sprites.thruster1Shadow, i.x + Math.sin(-r - .35) * (20 * t) / config.shadowScaling, i.y + Math.cos(-r - .35) * (20 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale * (4 / config.shadowScaling), .4 * a * l * this.scale * (4 / config.shadowScaling), u * this.alpha / 2.5),
            Graphics.transform(this.sprites.thruster2Shadow, i.x + Math.sin(.35 - r) * (20 * t) / config.shadowScaling, i.y + Math.cos(.35 - r) * (20 * t) / config.shadowScaling, r + .5 * (this.state.thrustLevel > 0 ? this.state.thrustDir : 0), .4 * a * l * this.scale * (4 / config.shadowScaling), .4 * a * l * this.scale * (4 / config.shadowScaling), u * this.alpha / 2.5),
            Graphics.transform(this.sprites.thruster1Glow, this.pos.x + Math.sin(-r - .2 - 0 * this.state.thrustDir) * (35 * t), this.pos.y + Math.cos(-r - .2 - 0 * this.state.thrustDir) * (35 * t), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha),
            Graphics.transform(this.sprites.thruster2Glow, this.pos.x + Math.sin(.2 - r - 0 * this.state.thrustDir) * (35 * t), this.pos.y + Math.cos(.2 - r - 0 * this.state.thrustDir) * (35 * t), null, 2.5 * this.scale, 1.5 * this.scale, .2 * this.state.thrustLevel * this.alpha)
        }
        this.updateNameplate(),
        this.state.bubble && this.updateBubble(),
        config.debug.collisions && this.col && (this.col.position.set(this.pos.x, this.pos.y),
        this.col.rotation = this.rot)
    }

    isSpectating() {        
        return this.spectate;
    }
}

export default Player;
