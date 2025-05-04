import Vector from './Vector';

class Mob {
    constructor(msg, ownerId) {
        if(msg.type == MobType.PredatorMissile && window.forceCarrot) {
            msg.type = MobType.CarrotMissile;
        }
        this.id = msg.id;
        this.type = msg.type;
        this.pos = new Vector(msg.posX, msg.posY);
        this.spriteRot = 0;
        this.missile = MissileMobTypeSet[this.type];
        if (this.missile && msg.c !== Network.SERVERPACKET.MOB_UPDATE_STATIONARY) {
            this.speed = new Vector(msg.speedX, msg.speedY);
            this.accel = new Vector(msg.accelX, msg.accelY);
            this.maxSpeed = msg.maxSpeed;
            this.exhaust = config.mobs[this.type].exhaust;
            this.lastAccelX = 0;
            this.lastAccelY = 0;
            this.stationary = false;
            this.spriteRot = this.speed.angle() + Math.PI;
        } else {
            this.stationary = true;
        }
        this.sprites = {};
        this.state = {
            inactive : false,
            despawnTicker : 0,
            despawnType : 0,
            baseScale : 1,
            baseScaleShadow : 1,
            luminosity : 1
        };
        this.randomness = Tools.rand(0, 1e5);
        this.culled = false;
        this.visibility = true;
        this.reducedFactor = false;
        this.forDeletion = false;
        this.spawnTime = game.time;
        this.lastPacket = game.timeNetwork;
        this.ownerId = ownerId;
        this.setupSprite();
    }

    setupSprite() {
        if(MissileMobTypeSet[this.type]) {
            this.sprites.thrusterGlow = Textures.init("thrusterGlowSmall", {
                layer: "projectiles"
            });
            this.sprites.smokeGlow = Textures.init("smokeGlow", {
                layer: "projectiles"
            });
            this.sprites.thruster = Textures.init("missileThruster");
        }

        switch (this.type) {
        case MobType.PredatorMissile:
        case MobType.TornadoSingleMissile:
        case MobType.TornadoTripleMissile:
        case MobType.ProwlerMissile:
            this.sprites.sprite = Textures.init("missile"),
            this.sprites.shadow = Textures.init("missileShadow", {
                scale: [.25, .2]
            }),
            this.sprites.thrusterGlow.scale.set(3, 2),
            this.sprites.thrusterGlow.alpha = .2,
            this.sprites.smokeGlow.scale.set(1.5, 3),
            this.sprites.smokeGlow.alpha = .75;
            break;
        case MobType.GoliathMissile:
        case MobType.CarrotMissile:
            if(this.type == MobType.GoliathMissile) {
                this.sprites.sprite = Textures.init("missileFat");
            } else {
                this.sprites.sprite = Textures.init("missileCarrot");
            }

            this.sprites.shadow = Textures.init("missileShadow", {
                scale: [.5, .25]
            });
            this.sprites.thrusterGlow.scale.set(4, 3);
            this.sprites.thrusterGlow.alpha = .25;
            this.sprites.smokeGlow.scale.set(2.5, 3);
            this.sprites.smokeGlow.alpha = .75;
            break;
        case MobType.MohawkMissile:
            this.sprites.sprite = Textures.init("missileSmall", {
                scale: [.28, .2]
            }),
            this.sprites.shadow = Textures.init("missileShadow", {
                scale: [.18, .14]
            }),
            this.sprites.thrusterGlow.scale.set(3, 2),
            this.sprites.thrusterGlow.alpha = .2,
            this.sprites.smokeGlow.scale.set(1, 2),
            this.sprites.smokeGlow.alpha = .75;
            break;
        case MobType.Upgrade:
        case MobType.Shield:
        case MobType.Inferno:
        case MobType.MagicCrate:
            var textureName = CrateTextureNameByMobType[this.type];
            this.state.baseScale = .33;
            this.state.baseScaleShadow = 2.4 / config.shadowScaling * .33;
            this.sprites.sprite = Textures.init(textureName, {
                scale: this.state.baseScale
            });
            this.sprites.shadow = Textures.init("crateShadow", {
                scale: this.state.baseScaleShadow
            });
        }

        this.setTeamColourOnMissiles();
    }

    setTeamColourOnMissiles() {
        if (game.gameType == GameType.CTF) {
            switch (this.type) {
                case MobType.PredatorMissile:
                case MobType.TornadoSingleMissile:
                case MobType.TornadoTripleMissile:
                case MobType.ProwlerMissile:
                case MobType.GoliathMissile:
                case MobType.MohawkMissile:
                    let team = Players.getMe().team == 1 ? 2 : 1;

                    if (this.ownerId) {
                        let owner = Players.get(this.ownerId);
                        if (owner) {
                            team = owner.team;
                        }
                    }

                    this.sprites.smokeGlow.tint = 
                    this.sprites.sprite.tint = 
                    this.sprites.thruster.tint = (team == 1 ? 0x3232FA : 0xEA4242);

                    break;
            }
        }
    }

    despawn(despawnType) {
        this.state.inactive = true;
        this.state.despawnTicker = 0;

        if(CrateMobTypeSet[this.type]) {
            this.state.despawnType = despawnType;
            if(despawnType == MobDespawnType.Collided &&
               this.type != MobType.Upgrade) {
                Sound.powerup(this.type, this.pos);
            }
            return;
        }

        this.sprites.thruster.renderable = false,
        this.sprites.thrusterGlow.renderable = false,
        this.sprites.smokeGlow.renderable = false,
        this.accel.x = 0,
        this.accel.y = 0,
        this.missile && Sound.updateThruster(1, this, false)
    }

    destroy(destroyMsg) {
        switch (this.type) {
        case MobType.PredatorMissile:
        case MobType.GoliathMissile:
        case MobType.CarrotMissile:
        case MobType.MohawkMissile:
        case MobType.TornadoSingleMissile:
        case MobType.TornadoTripleMissile:
        case MobType.ProwlerMissile:
            game.graphics.layers.projectiles.removeChild(this.sprites.sprite),
            game.graphics.layers.shadows.removeChild(this.sprites.shadow),
            game.graphics.layers.thrusters.removeChild(this.sprites.thruster),
            game.graphics.layers.projectiles.removeChild(this.sprites.thrusterGlow),
            game.graphics.layers.projectiles.removeChild(this.sprites.smokeGlow),
            this.sprites.sprite.destroy(),
            this.sprites.shadow.destroy(),
            this.sprites.thruster.destroy(),
            this.sprites.thrusterGlow.destroy(),
            this.sprites.smokeGlow.destroy();
            break;
        case MobType.Upgrade:
        case MobType.Shield:
        case MobType.Inferno:
        case MobType.MagicCrate:
            game.graphics.layers.crates.removeChild(this.sprites.sprite),
            game.graphics.layers.shadows.removeChild(this.sprites.shadow)
        }
        destroyMsg.c === Network.SERVERPACKET.MOB_DESPAWN_COORDS && (Mobs.explosion(this.pos, destroyMsg.type),
        this.missile && Sound.updateThruster(1, this, false))
    }

    network(msg, ownerId) {
        this.lastPacket = game.timeNetwork;
        if (msg.c === Network.SERVERPACKET.MOB_UPDATE) {
            this.reducedFactor = Tools.reducedFactor();
        }
        this.pos.x = msg.posX;
        this.pos.y = msg.posY;
        if (null != msg.speedX) {
            this.speed.x = msg.speedX;
            this.speed.y = msg.speedY;
        }
        if (null != msg.accelX) {
            this.accel.x = msg.accelX;
            this.accel.y = msg.accelY;
        }

        if (ownerId) {
            this.ownerId = ownerId;
            this.setTeamColourOnMissiles();
        }
    }

    visible(isVisible) {
        if (!(isVisible == this.visibility && isVisible != this.culled)) {
            this.sprites.sprite.visible = isVisible;
            this.sprites.shadow.visible = isVisible;
            if(MissileMobTypeSet[this.type]) {
                this.sprites.thruster.visible = isVisible;
                this.sprites.thrusterGlow.visible = isVisible;
            }
            this.visibility = isVisible;
        }
    }

    visibilityUpdate() {
        this.culled = !Graphics.inScreen(this.pos, 128),
        this.visible(!this.culled)
    }

    update(e) {
        if (this.visibilityUpdate(),
        !(false !== this.reducedFactor && (e -= this.reducedFactor,
        this.reducedFactor = false,
        e <= 0))) {
            var t, n, r, i = e > .51 ? Math.round(e) : 1, o = e / i;
            for (t = 0; t < i; t++)
                if (this.stationary)
                    this.clientCalcs(o);
                else {
                    n = this.speed.x,
                    r = this.speed.y,
                    this.speed.x += this.accel.x * o,
                    this.speed.y += this.accel.y * o;
                    var s = this.speed.length();
                    s > this.maxSpeed && this.speed.multiply(this.maxSpeed / s),
                    this.state.inactive && this.speed.multiply(1 - .03 * o),
                    this.pos.x += o * n + .5 * (this.speed.x - n) * o,
                    this.pos.y += o * r + .5 * (this.speed.y - r) * o,
                    this.pos.x < -16384 && (this.pos.x += 32768),
                    this.pos.x > 16384 && (this.pos.x -= 32768),
                    this.pos.y < -8192 && (this.pos.y += 16384),
                    this.pos.y > 8192 && (this.pos.y -= 16384),
                    this.clientCalcs(o)
                }
            this.missile && !this.state.inactive && Sound.updateThruster(1, this, this.visibility)
        }
    }

    clientCalcs(e) {
        if (!this.forDeletion)
            switch (this.state.luminosity -= .075 * e,
            this.state.luminosity < 0 && (this.state.luminosity = 0),
            this.type) {
            case MobType.PredatorMissile:
            case MobType.GoliathMissile:
            case MobType.CarrotMissile:
            case MobType.MohawkMissile:
            case MobType.TornadoSingleMissile:
            case MobType.TornadoTripleMissile:
            case MobType.ProwlerMissile:
                var t = 1;
                if (this.state.inactive) {
                    if (this.state.despawnTicker += .01 * e,
                    this.state.despawnTicker > .75) {
                        var n = 1 - 4 * (this.state.despawnTicker - .75);
                        this.sprites.sprite.alpha = n,
                        this.sprites.shadow.alpha = n
                    }
                    if (this.state.despawnTicker > 1)
                        return void (this.forDeletion = true);
                    t = Tools.clamp(1 - this.state.despawnTicker, .3, 1)
                }
                if (!this.culled && t > .3) {
                    var tint;
                    if(this.type == MobType.CarrotMissile) {
                        // Green missile smoke for carrot.
                        tint = 0x009f00;
                    }
                    var r = this.speed.angle() + Math.PI;
                    r - this.spriteRot >= Math.PI ? this.spriteRot += 2 * Math.PI : this.spriteRot - r > Math.PI && (this.spriteRot -= 2 * Math.PI),
                    this.spriteRot = Tools.converge(this.spriteRot, r, .1 * e),
                    Particles.missileSmoke(this, this.exhaust, t, tint)
                }
                break;
            case MobType.Upgrade:
            case MobType.Shield:
            case MobType.Inferno:
            case MobType.MagicCrate:
                if (this.state.inactive && (this.state.despawnTicker += .05 * e,
                this.state.despawnTicker > 1))
                    return void (this.forDeletion = true)
            }
    }

    updateGraphics(e) {
        var mobConfig = config.mobs[this.type];

        switch (this.type) {
        case MobType.PredatorMissile:
        case MobType.GoliathMissile:
        case MobType.CarrotMissile:
        case MobType.MohawkMissile:
        case MobType.TornadoSingleMissile:
        case MobType.TornadoTripleMissile:
        case MobType.ProwlerMissile:
            var t = Graphics.shadowCoords(this.pos),
                n = Tools.oscillator(.1, .5, this.randomness),
                r = Tools.oscillator(.15, 10, this.randomness);
            Graphics.transform(
                this.sprites.sprite,
                this.pos.x,
                this.pos.y,
                this.spriteRot
            );
            Graphics.transform(
                this.sprites.shadow,
                t.x,
                t.y,
                this.spriteRot
            );
            Graphics.transform(
                this.sprites.thrusterGlow,
                this.pos.x + Math.sin(-this.spriteRot) * (this.exhaust + 20),
                this.pos.y + Math.cos(-this.spriteRot) * (this.exhaust + 20),
                null,
                null,
                null,
                (((mobConfig.thrusterGlowAlpha || 1.0) * .5)
                    * this.state.luminosity + .2) * r
            );
            Graphics.transform(
                this.sprites.smokeGlow,
                this.pos.x + Math.sin(-this.spriteRot) * (this.exhaust + 20),
                this.pos.y + Math.cos(-this.spriteRot) * (this.exhaust + 20),
                this.spriteRot,
                undefined,
                undefined,
                mobConfig.smokeGlowAlpha
            );
            Graphics.transform(
                this.sprites.thruster,
                this.pos.x + Math.sin(-this.spriteRot) * this.exhaust,
                this.pos.y + Math.cos(-this.spriteRot) * this.exhaust,
                this.spriteRot,
                mobConfig.thruster[0] * n,
                mobConfig.thruster[1] * n,
                mobConfig.thrusterAlpha
            );
            break;
        case MobType.Upgrade:
        case MobType.Shield:
        case MobType.Inferno:
        case MobType.MagicCrate:
            var i;
            t = Graphics.shadowCoords(this.pos);
            i = 0 == this.state.despawnType ? 1 - this.state.despawnTicker : 1 + 2 * this.state.despawnTicker,
            i *= Tools.oscillator(.08, 500, this.randomness),
            Graphics.transform(this.sprites.sprite, this.pos.x, this.pos.y + 20 * (Tools.oscillator(.08, 330, this.randomness) - 1.04), null, this.state.baseScale * i, this.state.baseScale * i, 1 - this.state.despawnTicker),
            Graphics.transform(this.sprites.shadow, t.x, t.y, null, this.state.baseScaleShadow * i, this.state.baseScaleShadow * i, 1 - this.state.despawnTicker)
        }
    }
}

export default Mob;
