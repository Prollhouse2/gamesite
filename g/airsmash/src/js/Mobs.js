import './Constants';
import Vector from './Vector';
import Mob from './Mob';

var mobs = {};
var doodads = [];
var someFlag = {};

Mobs.add = function (netmob, network, ownerId) {
    mobs[netmob.id] = new Mob(netmob, ownerId);
    if (network) {
        mobs[netmob.id].network(netmob);
    }
};

Mobs.update = function () {
    var t, n;
    for (t in mobs)
        (n = mobs[t]).update(game.timeFactor),
            n.forDeletion ? Mobs.destroy(n) : n.updateGraphics(game.timeFactor)
};

Mobs.network = function (netmob, ownerId) {
    var mob = mobs[netmob.id];
    if (mob == null) {
        Mobs.add(netmob, true, ownerId)
    }
    else {
        mob.network(netmob, ownerId);
    }
};

Mobs.despawn = function (despawnMsg) {
    var mob = mobs[despawnMsg.id];
    null != mob && mob.despawn(despawnMsg.type)
};

Mobs.destroy = function (t) {
    var n = mobs[t.id];
    null != n && (n.destroy(t),
        delete mobs[t.id])
};

Mobs.explosion = function (pos, mobType) {
    switch (mobType) {
        case MobType.PredatorMissile:
        case MobType.TornadoSingleMissile:
        case MobType.TornadoTripleMissile:
        case MobType.ProwlerMissile:
            Particles.explosion(pos, Tools.rand(1, 1.2));
            break;
        case MobType.GoliathMissile:
            Particles.explosion(pos, Tools.rand(1.3, 1.6));
            break;
        case MobType.MohawkMissile:
        case MobType.CarrotMissile:
            Particles.explosion(pos, Tools.rand(.8, 1))
    }
    Sound.mobExplosion(pos, mobType)
};

Mobs.count = function () {
    let count = 0;
    let culledCount = 0;
    for (var mob in mobs) {
        count++;
        if (mobs[mob].culled) {
            culledCount++;
        }
    }
    return [count - culledCount, count]
};

Mobs.mobs = function () { // SPATIE
    return mobs;
};

Mobs.wipe = function () {
    for (var t in mobs)
        mobs[t].destroy({}),
            delete mobs[t]
};

Mobs.countDoodads = function () {
    return [doodads.length, config.doodads.length]
};

Mobs.setupDoodads = function () {
    config.doodads = config.doodads.concat(config.groundDoodads);
    for (var id = 0; id < config.doodads.length; id++)
        Mobs.addDoodad(config.doodads[id])
};

Mobs.addDoodad = function (doodad) {
    var isInteger = Number.isInteger(doodad[2]);
    var texture = Textures.init((isInteger ? "mountain" : "") + doodad[2]);
    texture.scale.set(doodad[3]);
    texture.position.set(doodad[0], doodad[1]);
    texture.visible = false;
    if(doodad[4]) {
        texture.rotation = doodad[4];
    }
    if(doodad[5]) {
        texture.alpha = doodad[5];
    }
    if(doodad[6]) {
        texture.tint = doodad[6];
    }
    doodad[7] = false;
    doodad[8] = texture;
    doodad[9] = isInteger ? 0 : 1;
};

Mobs.getClosestDoodad = function (e) {
    for (var n, r, i = 2, o = 0; o < doodads.length; o++)
        0 == (r = doodads[o])[5] && Tools.distFastCheckFloat(e.x, e.y, r[0], r[1], 256 * r[3]) && (n = Tools.distance(e.x, e.y, r[0], r[1]) / (256 * r[3])) < i && (i = n);
    return Tools.clamp(3.333 * (i - .5), .2, 1)
};

Mobs.updateDoodads = function () {
    for (var e, r = Tools.getBucketBounds(Graphics.getCamera(), 512 + game.halfScreenX / game.scale, 512 + game.halfScreenY / game.scale), i = r[0]; i <= r[1]; i++)
        for (var o = r[2]; o <= r[3]; o++)
            for (var s = 0; s < game.buckets[i][o][0].length; s++)
                a = game.buckets[i][o][0][s],
                    e = config.doodads[a],
                    game.state == Network.STATE.LOGIN && 0 != e[9] || Graphics.inScreen(new Vector(e[0], e[1]), 256 * e[3] + config.overdraw) && (e[7] || (e[8].visible = true,
                        e[7] = true,
                        someFlag[a] || (someFlag[a] = true,
                            doodads.push([e[0], e[1], e[2], e[3], a, e[9]]))));
    for (var a, l = doodads.length - 1; l >= 0; l--)
        a = doodads[l][4],
            e = config.doodads[a],
            Graphics.inScreen(new Vector(e[0], e[1]), 256 * e[3] + config.overdraw) || e[7] && (e[8].visible = false,
                e[7] = false,
                doodads.splice(l, 1),
                delete someFlag[a])
};
