import Vector from './Vector';

var particleTypeIdByName = {
    MISSILE: 0,
    MISSILE_FAT: 1,
    MISSILE_SMALL: 2,
    SHOCKWAVE_SMOKE: 3,
    SHOCKWAVE_INNER: 4,
    SHOCKWAVE_OUTER: 5,
    EXPLOSION_FLASH: 6,
    EXPLOSION_FLASH_BIG: 7,
    EXPLOSION_SMOKE: 8,
    EXPLOSION_HOT_SMOKE: 9,
    EXPLOSION_SPARK: 10,
    FRAGMENT_SMOKE: 11,
    PLANE_DAMAGE: 12,
    EMITTER_EXPLOSION_FRAGMENT: 100
};

var particleTypeByMobType = [
    null,                                   // 0 Unused
    particleTypeIdByName.MISSILE,           // 1 PredatorMissile
    particleTypeIdByName.MISSILE_FAT,       // 2 GoliathMissile
    particleTypeIdByName.MISSILE_SMALL,     // 3 MohawkMissile
    null,                                   // 4 Upgrade
    particleTypeIdByName.MISSILE,           // 5 TornadoSingleMissile
    particleTypeIdByName.MISSILE,           // 6 TornodaTripleMissile
    particleTypeIdByName.MISSILE,           // 7 ProwlerMissile
    null,                                   // 8 Shield
    null,                                   // 9 Inferno
    null,                                   // 10 Unused
    null,                                   // 11 Unused
    particleTypeIdByName.PLANE_DAMAGE       // 12 CarrotMissile
];

class ParticleContainer {
    constructor(pixiContainer, maxParticles, blendMode, shadow) {
        this.maxParticles = maxParticles,
        this.container = new PIXI.Container,
        null != blendMode && (this.container.blendMode = blendMode),
        this.particles = [],
        this.first = -1,
        this.last = -1,
        this.emitters = {},
        this.emitterId = 0,
        this.shadow = shadow,
        pixiContainer.addChild(this.container)
    }

    addParticle(type, spriteName, speed, pos, scale, alpha, rotationSpeed, rotation, tint, anchorPos, blendMode, life, data, emitter) {
        if (!(game.timeFactorUncapped > 20 || this.particles.length >= this.maxParticles)) {
          var sprite = Textures.sprite(spriteName);
          var particle = {
            type: type,
            sprite: sprite,
            speed: speed,
            pos: pos,
            scale: scale,
            alpha: alpha,
            rotationSpeed: rotationSpeed,
            rotation: rotation,
            lastRotation: 0,
            time: game.time,
            tint: tint,
            life: 0,
            data: null != data ? data : 0,
            emitter: null != emitter ? emitter : null,
            _prev: -1,
            _next: -1
          };
          if (null != tint) {
            sprite.tint = tint;
          }
          if (null != blendMode) {
            sprite.blendMode = blendMode;
          }
          if (null != life) {
            particle.life = life;
          }
          if (null != anchorPos) {
            sprite.anchor.set(anchorPos.x, anchorPos.y);
          } else {
            sprite.anchor.set(.5, .5);
          }
          this.container.addChild(sprite);
          var particleId = this.particles.length;
          if (particleId > 0) {
            this.particles[this.last]._next = particleId;
            particle._prev = this.last;
            this.last = particleId;
          } else {
            this.first = particleId;
            this.last = particleId;
          }
          this.particles.push(particle);
        }
      }

    wipe() {
        this.emitters = {},
        this.emitterId = 0;
        for (var e = 0; e < this.particles.length; e++)
            this.container.removeChild(this.particles[e].sprite),
            this.particles[e].sprite.destroy();
        this.particles = [],
        this.first = -1,
        this.last = -1
    }

    addEmitter(type, speed, pos, life, shadowLayer) {
        game.timeFactorUncapped > 20 || (this.emitters[this.emitterId] = {
            type: type,
            pos: pos,
            speed: speed,
            life: null != life ? life : 0,
            shadowLayer: shadowLayer
        },
        this.emitterId++)
    }

    updateEmitters(time) {
        for (var emitterId in this.emitters) {
          var emitter = this.emitters[emitterId];
          switch(emitter.type) {
            case particleTypeIdByName.EMITTER_EXPLOSION_FRAGMENT:
              emitter.life += .02 * time;
              emitter.speed.multiply(1 - .02 * time);
          }
          if (emitter.life > 1) {
            delete this.emitters[emitterId];
          } else {
            emitter.pos.x += emitter.speed.x * time;
            emitter.pos.y += emitter.speed.y * time; 
            switch(emitter.type) {
              case particleTypeIdByName.EMITTER_EXPLOSION_FRAGMENT:
                var sequence = Tools.randInt(1, 16);
                var o = 0.5 * (1 - emitter.life);
                var lifeRemaining = 1 - emitter.life;
                var a = Tools.rand(-0.1, 0.1);
                var l = Tools.randCircle();
                this.addParticle(
                    particleTypeIdByName.FRAGMENT_SMOKE,
                    "smoke_" + sequence,
                    Vector.zero(),
                    emitter.pos.clone(),
                    Vector.diag(o),
                    1,
                    a,
                    l,
                    null,
                    null,
                    null,
                    null,
                    lifeRemaining + .2
                );
                if (emitter.shadowLayer) {
                  emitter.shadowLayer.addParticle(particleTypeIdByName.FRAGMENT_SMOKE, "smokeshadow_" + sequence, Vector.zero(), emitter.pos.clone(), Vector.diag(o), 1, a, l, null, null, null, null, lifeRemaining + .2);
                }
            }
          }
        }
      }

    destroy(particleId) {
        var maxParticles = this.particles.length;
        if (0 != maxParticles && !(particleId >= maxParticles)) {
            this.container.removeChild(this.particles[particleId].sprite),
            this.particles[particleId].sprite.destroy();
            var n = this.particles[particleId]._prev,
                r = this.particles[particleId]._next;
            return maxParticles--,
            -1 != n ? this.particles[n]._next = r : this.first = r,
            -1 != r ? this.particles[r]._prev = n : this.last = n,
            particleId != maxParticles && (this.particles[particleId] = this.particles[maxParticles],
            -1 != this.particles[particleId]._prev ? this.particles[this.particles[particleId]._prev]._next = particleId : this.first = particleId,
            -1 != this.particles[particleId]._next ? this.particles[this.particles[particleId]._next]._prev = particleId : this.last = particleId),
            this.particles.splice(maxParticles, 1),
            r == maxParticles ? particleId : r
        }
    }

    _updateMissile(time, particle) {
        particle.type == particleTypeIdByName.MISSILE ? (particle.scale.add(.2 * time),
        particle.scale.ceil(2 * particle.data),
        particle.life += .05 * time) : particle.type == particleTypeIdByName.MISSILE_FAT ? (particle.scale.add(.3 * time),
        particle.scale.ceil(3 * particle.data),
        particle.life += .05 * time) : (particle.scale.add(.14 * time),
        particle.scale.ceil(1.4 * particle.data),
        particle.life += .08 * time),
        particle.speed.multiply(1 - .05 * time),
        particle.alpha = .7 * (1 - particle.life),
        particle.sprite.tint = Tools.colorLerp(particle.tint, 16777215, 2 * (1 - particle.life));
    }

    _updateShockwaveSmoke(time, particle) {
        particle.life += .05 * time,
        particle.alpha = .7 * Tools.easing.custom(particle.life, "shockwave");
    }

    _updateShockwave(time, particle) {
        particle.life += .05 * time;
        var i = Tools.easing.custom(particle.life, "shockwave");
        particle.alpha = .4 * i,
        particle.type == particleTypeIdByName.SHOCKWAVE_OUTER ? particle.scale.both(4 * particle.life) : particle.scale.both(3 * particle.life);
    }

    _updateExplosionFlash(time, particle) {
        particle.life += .1 * time,
        particle.alpha = 1 - particle.life;
    }

    _updateExplosionFlashBig(time, particle) {
        particle.life += .04 * time,
        particle.alpha = 1 - particle.life;
    }

    _updateExplosionHotSmoke(time, particle) {
        particle.life += .035 * time,
        particle.alpha = 1 - particle.life,
        particle.scale.add(.05 * time),
        particle.speed.multiply(1 - .1 * time),
        particle.rotationSpeed *= 1 - .05 * time;
    }

    _updateExplosionSmoke(time, particle) {
        particle.life += .01 * time,
        particle.alpha = Tools.easing.custom(particle.life, "explosionSmoke"),
        particle.scale.add(.05 * time),
        particle.speed.multiply(1 - .05 * time),
        particle.rotationSpeed *= 1 - .05 * time;
    }

    _updateExplosionSpark(time, particle) {
        particle.life += .02 * time,
        particle.alpha = 2 * (1 - particle.life),
        particle.speed.multiply(1 - .05 * time),
        particle.rotationSpeed *= 1 - .05 * time;
    }

    _updateFragmentSmoke(time, particle) {
        particle.life += .02 * time,
        particle.scale.add(.075 * time * particle.data),
        particle.scale.ceil(2 * particle.data),
        particle.rotationSpeed *= 1 - .05 * time,
        particle.alpha = .3 * (1 - particle.life);
    }

    _updatePlaneDamage(time, particle) {
        particle.life += .02 * time,
        particle.alpha = 2 * (1 - particle.life),
        particle.speed.multiply(1 - .1 * time)
    }

    update(time) {
        this.updateEmitters(time);
        for (var r = this.first; -1 != r; ) {
            var particle = this.particles[r];
            var update = this.updateFuncMap[particle.type];
            if(update) {
                update(time, particle);
            }
            if (particle.life > 1)
                r = this.destroy(r);
            else {
                if (particle.pos.x += particle.speed.x * time,
                particle.pos.y += particle.speed.y * time,
                particle.rotation += particle.rotationSpeed * time,
                this.shadow) {
                    var o = Graphics.shadowCoords(particle.pos);
                    particle.sprite.position.x = o.x,
                    particle.sprite.position.y = o.y,
                    particle.sprite.scale.x = particle.scale.x / config.shadowScaling,
                    particle.sprite.scale.y = particle.scale.y / config.shadowScaling,
                    particle.sprite.alpha = Tools.clamp(2 * particle.alpha, 0, 1)
                } else
                    particle.sprite.position.x = particle.pos.x,
                    particle.sprite.position.y = particle.pos.y,
                    particle.sprite.scale.x = particle.scale.x,
                    particle.sprite.scale.y = particle.scale.y,
                    particle.sprite.alpha = Tools.clamp(particle.alpha, 0, 1);
                Math.abs(particle.rotation - particle.lastRotation) > .03 && (particle.sprite.rotation = particle.rotation,
                particle.lastRotation = particle.rotation),
                r = this.particles[r]._next
            }
        }
    }
}

ParticleContainer.prototype.updateFuncMap = {
    [particleTypeIdByName.MISSILE]: ParticleContainer.prototype._updateMissile,
    [particleTypeIdByName.MISSILE_FAT]: ParticleContainer.prototype._updateMissile,
    [particleTypeIdByName.MISSILE_SMALL]: ParticleContainer.prototype._updateMissile,
    [particleTypeIdByName.SHOCKWAVE_SMOKE]: ParticleContainer.prototype._updateShockwaveSmoke,
    [particleTypeIdByName.SHOCKWAVE_INNER]: ParticleContainer.prototype._updateShockwave,
    [particleTypeIdByName.SHOCKWAVE_OUTER]: ParticleContainer.prototype._updateShockwave,
    [particleTypeIdByName.EXPLOSION_FLASH]: ParticleContainer.prototype._updateExplosionFlash,
    [particleTypeIdByName.EXPLOSION_FLASH_BIG]: ParticleContainer.prototype._updateExplosionFlashBig,
    [particleTypeIdByName.EXPLOSION_HOT_SMOKE]: ParticleContainer.prototype._updateExplosionHotSmoke,
    [particleTypeIdByName.EXPLOSION_SMOKE]: ParticleContainer.prototype._updateExplosionSmoke,
    [particleTypeIdByName.EXPLOSION_SPARK]: ParticleContainer.prototype._updateExplosionSpark,
    [particleTypeIdByName.FRAGMENT_SMOKE]: ParticleContainer.prototype._updateFragmentSmoke,
    [particleTypeIdByName.PLANE_DAMAGE]: ParticleContainer.prototype._updatePlaneDamage
};

var containersByName = {};

Particles.setup = function() {
    containersByName.smoke = new ParticleContainer(game.graphics.layers.smoke,2e3),
    containersByName.shadows = new ParticleContainer(game.graphics.layers.shadows,2e3,null,true),
    containersByName.explosions = new ParticleContainer(game.graphics.layers.explosions,2e3)
};

Particles.update = function() {
    for (var e = game.timeFactor > .51 ? Math.round(game.timeFactor) : 1, n = game.timeFactor / e, r = 0; r < e; r++)
        containersByName.smoke.update(n),
        containersByName.explosions.update(n),
        containersByName.shadows.update(n)
};

Particles.wipe = function() {
    containersByName.smoke.wipe(),
    containersByName.explosions.wipe(),
    containersByName.shadows.wipe()
};

Particles.planeDamage = function(player) {
    var r = 2 == player.type ? 2 : 1,
        sparkIdx = Tools.randInt(1, 4),
        angle = Tools.randCircle(),
        s = Tools.rand(0.5, 2),
        a = Tools.rand(0.2, 0.8),
        l = Tools.rand(0, 0.3),
        pos = Vector.createOff(player.pos, angle, Tools.rand(0, 5 * r)),
        c = Vector.create(angle, s);
    containersByName.explosions.addParticle(particleTypeIdByName.PLANE_DAMAGE, "spark_" + sparkIdx, new Vector(c.x + player.speed.x,c.y + player.speed.y), pos, Vector.diag(a), 0, 0, Tools.randCircle(), 16739073, null, PIXI.BLEND_MODES.ADD, l)
};

Particles.explosion = function(e, r, i) {
    for (var o = r > 1 ? 1 + (r - 1) / 1.5 : r, s = 0; s < 2; s++)
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_FLASH, "flash_" + Tools.randInt(1, 4), Vector.zero(), e.clone(), Vector.diag(1.5 * r), 0, 0, Tools.randCircle(), 15987628, null, PIXI.BLEND_MODES.ADD);
    var a, l, u, c, h, d, p, f, g;
    a = Math.round(Tools.rand(20, 30) * r);
    for (s = 0; s < a; s++)
        l = Tools.randInt(1, 4),
        u = Tools.randCircle(),
        h = Tools.rand(3, 10) * o,
        d = Tools.rand(-.2, .2),
        p = Tools.rand(.4, 1.5) * o,
        g = Tools.rand(0, .3),
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_SPARK, "spark_" + l, Vector.create(u, h), e.clone(), Vector.diag(p), 0, d, Tools.randCircle(), 16739073, null, PIXI.BLEND_MODES.ADD, g);
    for (s = 0; s < i; s++)
        u = Tools.randCircle(),
        h = Tools.rand(3, 7) * o,
        c = Tools.rand(15, 30) * r,
        containersByName.explosions.addEmitter(particleTypeIdByName.EMITTER_EXPLOSION_FRAGMENT, Vector.create(u, h), Vector.createOff(e, u, c), Tools.rand(0, .5), containersByName.shadows);
    a = Math.round(Tools.rand(20, 30) * r);
    for (s = 0; s < a; s++)
        l = Tools.randInt(1, 16),
        u = Tools.randCircle(),
        c = Tools.rand(0, 10) * r,
        h = Tools.rand(0, 3) * r,
        d = Tools.rand(-.1, .1),
        p = Tools.rand(.5, .8) * r,
        f = Tools.randCircle(),
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_SMOKE, "smoke_" + l, Vector.create(u, h), Vector.createOff(e, u, c), Vector.diag(p), 0, d, f),
        containersByName.shadows.addParticle(particleTypeIdByName.EXPLOSION_SMOKE, "smokeshadow_" + l, Vector.create(u, h), Vector.createOff(e, u, c), Vector.diag(p), 0, d, f);
    containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_FLASH_BIG, "glowsmall", Vector.zero(), e.clone(), Vector.diag(6 * r), 0, 0, 0, null, null, PIXI.BLEND_MODES.ADD),
    a = Math.round(Tools.rand(5, 10) * r);
    for (s = 0; s < a; s++)
        l = Tools.randInt(1, 4),
        u = Tools.randCircle(),
        h = Tools.rand(1, 3) * r,
        d = Tools.rand(-.1, .1),
        p = Tools.rand(.1, .3) * r,
        containersByName.explosions.addParticle(particleTypeIdByName.EXPLOSION_HOT_SMOKE, "hotsmoke_" + l, Vector.create(u, h), e.clone(), Vector.diag(p), 0, d, Tools.randCircle(), 16739073, null, PIXI.BLEND_MODES.ADD)
};

Particles.missileSmoke = function(mob, exhaust, data, tint) {
    var particleType = particleTypeByMobType[mob.type];
    var rotation = mob.spriteRot + Math.PI,
        pos = Vector.createOff(mob.pos, rotation, exhaust),
        scale = 0.2 * (data = data || 1),
        u = Tools.rand(-0.1, 0.1),
        speed = Vector.create(rotation + u, 5 * data),
        index = Tools.randInt(1, 16),
        rotSpeed = Tools.rand(-0.1, 0.1);
    Tools.randCircle();
    containersByName.smoke.addParticle(
        particleType,                           // type
        "smoke_" + index,                       // spriteName
        speed.clone(),                          // speed
        pos.clone(),                            // pos
        new Vector(1.25 * scale,4 * scale),     // scale
        1,                                      // alpha
        rotSpeed,                               // rotationSpeed
        rotation,                               // rotation
        tint || 0xfff9a6,                       // tint
        null,                                   // anchorPos
        null,                                   // blendMode
        null,                                   // life
        data                                    // data
    );
    containersByName.shadows.addParticle(
        particleType,
        "smokeshadow_" + index,
        speed.clone(),
        pos.clone(),
        new Vector(1.25 * scale,4 * scale),
        1,
        rotSpeed,
        rotation,
        null,
        null,
        null,
        null,
        data
    );
};

Particles.planeBoost = function(e, r) {
    var i = e.rot + e.state.thrustDir / 2 + Math.PI,
        o = Vector.createOff(e.pos, i, r ? 40 : -20),
        s = Tools.rand(-0.1, 0.1),
        a = r ? 0 : Math.PI,
        l = Vector.create(i + s + a, 6),
        u = Tools.randInt(1, 16),
        c = Tools.rand(-0.1, 0.1);
    Tools.randCircle();
    containersByName.smoke.addParticle(particleTypeIdByName.MISSILE, "smoke_" + u, l.clone(), o.clone(), new Vector(.3,1.2), 1, c, i, 16775590, null, null, null, 1.2),
    containersByName.shadows.addParticle(particleTypeIdByName.MISSILE, "smokeshadow_" + u, l.clone(), o.clone(), new Vector(.3,1.2), 1, c, i, null, null, null, null, 1.2)
};

Particles.spiritShockwave = function(e) {
    for (var r, i, o = 0; o < 40; o++)
        i = o / 40 * 2 * Math.PI,
        r = Tools.randInt(1, 16),
        containersByName.smoke.addParticle(particleTypeIdByName.SHOCKWAVE_SMOKE, "smoke_" + r, Vector.create(i, 8), e.clone(), Vector.diag(2), 0, .4, Tools.randCircle());
    containersByName.smoke.addParticle(particleTypeIdByName.SHOCKWAVE_INNER, "shockwave", Vector.zero(), e.clone(), Vector.zero(), 0, 0, -.35 + Math.PI),
    containersByName.smoke.addParticle(particleTypeIdByName.SHOCKWAVE_OUTER, "shockwave", Vector.zero(), e.clone(), Vector.zero(), 0, 0, -.35)
};

Particles.count = function() {
    var e = 0;
    for (var n in containersByName)
        e += containersByName[n].particles.length;
    return e
};


Particles.PTYPE = particleTypeIdByName
