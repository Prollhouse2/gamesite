import Vector from './Vector';
import 'js-cookie'; // $.getJSON

var renderer, cameraState = {
    position: Vector.zero(),
    center: Vector.zero(),
    lastOverdraw: Vector.zero(),
    lastOverdrawTime: 0,
    shake: 0
    }, 
    pixiTextureByName = {}, 
    pixiSpriteByName = {}, 
    pixiContainerByName = {};

Graphics.setup = function() {
    initGameObjScreenVars(window.innerWidth, window.innerHeight),
    setupPixiRenderer(),
    Textures.load(),
    setupPixiContainers(),
    initContainerScales(),
    initPixiTextures(),
    initMapTextures(),
    Mobs.setupDoodads(),
    UI.setupMinimap(),
    UI.setupHUD()
};

var setupPixiRenderer = function() {
    PIXI.utils.skipHello(),
    PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH;
    var pixiSettings = {
        autoResize: true,
        clearBeforeRender: false,
        preserveDrawingBuffer: true
    };
    config.settings.hidpi && (pixiSettings.resolution = 2);
    try {
        renderer = new PIXI.WebGLRenderer(game.screenX,game.screenY,pixiSettings);
    } catch (e) {
        try {
            // workaround for WebGL failure on Linux + Mesa drivers + Firefox, see issue #18
            PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(PIXI.settings.SPRITE_MAX_TEXTURES, 16);
            renderer = new PIXI.WebGLRenderer(game.screenX,game.screenY,pixiSettings);
        } catch (e) {
            UI.popBigMsg(2);
            return;
        }
    }
    document.body.appendChild(renderer.view)
}

var setupPixiContainers = function() {
    for (var containerName of ["game", "ui0", "ui1", "ui2", "ui3", "ui4", "hudHealth", "hudEnergy", "flags", "doodads", "map", "sea", "objects", "groundobjects", "fields", "shadows", "powerups", "crates", "aircraft", "aircraftme", "glows", "playernames", "bubbles", "thrusters", "projectiles", "smoke", "explosions"])
        pixiContainerByName[containerName] = new PIXI.Container;
    for (var childContainerName of ["smoke", "crates", "thrusters", "projectiles", "aircraft", "aircraftme", "glows", "explosions", "powerups", "playernames", "flags", "bubbles"])
        pixiContainerByName.objects.addChild(pixiContainerByName[childContainerName]);
    for (var childContainerName of ["fields"])
        pixiContainerByName.groundobjects.addChild(pixiContainerByName[childContainerName]);
    if (game.graphics.layers = pixiContainerByName,
    game.graphics.gui = pixiSpriteByName,
    config.debug.collisions) {
        for (var gfx = new PIXI.Graphics, i = 0; i < config.walls.length; i++)
            gfx.beginFill(16777215, .2),
            gfx.drawCircle(config.walls[i][0], config.walls[i][1], config.walls[i][2]),
            gfx.endFill();
        pixiContainerByName.objects.addChild(gfx)
    }
}

var initPixiTextures = function() {
    pixiTextureByName.render = PIXI.RenderTexture.create(game.screenX + config.overdraw, game.screenY + config.overdraw, void 0, config.settings.hidpi ? 2 : void 0),
    pixiTextureByName.renderSprite = new PIXI.Sprite(pixiTextureByName.render),
    pixiTextureByName.shadows = PIXI.RenderTexture.create(game.shadowX, game.shadowY, void 0, config.settings.hidpi ? 2 : void 0),
    pixiTextureByName.shadowsSprite = new PIXI.Sprite(pixiTextureByName.shadows),
    pixiTextureByName.shadowsSprite.scale.set(game.screenX / game.shadowX, game.screenY / game.shadowY),
    pixiTextureByName.shadowsSprite.blendMode = PIXI.BLEND_MODES.MULTIPLY,
    pixiTextureByName.shadowsSprite.alpha = .4,
    pixiContainerByName.game.addChild(pixiTextureByName.renderSprite),
    pixiContainerByName.game.addChild(pixiContainerByName.groundobjects),
    pixiContainerByName.game.addChild(pixiTextureByName.shadowsSprite),
    pixiTextureByName.shade = Textures.sprite("screenshade"),
    pixiTextureByName.shade.scale.set(game.shadowX / 126 / game.scale, game.shadowY / 126 / game.scale),
    pixiTextureByName.shade.alpha = .825,
    pixiTextureByName.shade.anchor.set(.5, .5),
    pixiContainerByName.shadows.addChild(pixiTextureByName.shade),
    pixiContainerByName.game.addChild(pixiContainerByName.objects),
    pixiContainerByName.game.addChild(pixiContainerByName.ui0),
    pixiContainerByName.game.addChild(pixiContainerByName.ui1),
    pixiContainerByName.game.addChild(pixiContainerByName.ui2),
    pixiContainerByName.game.addChild(pixiContainerByName.ui3),
    pixiContainerByName.game.addChild(pixiContainerByName.ui4),
    pixiSpriteByName.hudTextureEnergy = PIXI.RenderTexture.create(80, 348, void 0, config.settings.hidpi ? 2 : void 0),
    pixiSpriteByName.hudSpriteEnergy = new PIXI.Sprite(pixiSpriteByName.hudTextureEnergy),
    pixiSpriteByName.hudSpriteEnergy.pivot.set(-250, 174),
    pixiSpriteByName.hudTextureHealth = PIXI.RenderTexture.create(80, 348, void 0, config.settings.hidpi ? 2 : void 0),
    pixiSpriteByName.hudSpriteHealth = new PIXI.Sprite(pixiSpriteByName.hudTextureHealth),
    pixiSpriteByName.hudSpriteHealth.pivot.set(330, 174),
    pixiContainerByName.game.addChild(pixiSpriteByName.hudSpriteEnergy),
    pixiContainerByName.game.addChild(pixiSpriteByName.hudSpriteHealth)
};

Graphics.resizeRenderer = function(width, height) {
    var overdrawWidth = width + config.overdraw,
        overdrawHeight = height + config.overdraw;
    initGameObjScreenVars(width, height),
    initContainerScales(),
    renderer.resize(width, height),
    pixiTextureByName.render.resize(overdrawWidth, overdrawHeight),
    pixiTextureByName.shadows.resize(width, height),
    pixiTextureByName.shadowsSprite.scale.set(game.screenX / game.shadowX, game.screenY / game.shadowY),
    pixiTextureByName.shade.scale.set(game.shadowX / 126 / game.scale, game.shadowY / 126 / game.scale);
    for (var textureName of ["sea", "forest", "sand", "rock"])
        pixiTextureByName[textureName].width = overdrawWidth,
        pixiTextureByName[textureName].height = overdrawHeight;
    UI.resizeMinimap(),
    UI.resizeHUD(),
    initTextureScalesAndMasks(),
    initPolygonsScale(),
    Graphics.setCamera(cameraState.center.x, cameraState.center.y),
    game.state == Network.STATE.PLAYING && Network.resizeHorizon()
};

Graphics.toggleHiDPI = function() {
    Tools.setSettings({ hidpi: !config.settings.hidpi }),
    UI.updateMainMenuSettings(),
    1 == config.oldhidpi == config.settings.hidpi ? UI.showMessage("alert", "", 1e3) : UI.showMessage("alert", 'Reload game to apply HiDPI settings<br><span class="button" onclick="Games.redirRoot()">RELOAD</span>', 1e4)
};

var initGameObjScreenVars = function(screenInnerWidth, screenInnerHeight) {
    game.screenX = screenInnerWidth,
    game.screenY = screenInnerHeight,
    game.halfScreenX = screenInnerWidth / 2,
    game.halfScreenY = screenInnerHeight / 2,
    game.shadowX = Math.floor(game.screenX / config.shadowScaling),
    game.shadowY = Math.floor(game.screenY / config.shadowScaling)
};

var initContainerScales = function() {
    game.scale = (game.screenX + game.screenY) / UI.getScalingFactor(),
    pixiContainerByName.groundobjects.scale.set(game.scale),
    pixiContainerByName.objects.scale.set(game.scale),
    pixiContainerByName.shadows.scale.set(game.scale),
    pixiContainerByName.doodads.scale.set(game.scale),
    pixiContainerByName.bubbles.scale.set(1 / game.scale),
    modifyConfigIfMobile()
};

var modifyConfigIfMobile = function() {
    if (config.mobile) {
        var e = game.screenX > game.screenY ? "landscape" : "portrait";
        config.phone = game.screenX <= 599 && "portrait" == e || game.screenY <= 599 && "landscape" == e,
        config.tablet = game.screenX >= 600 && game.screenX <= 1024 && "portrait" == e || game.screenY >= 600 && game.screenY <= 1024 && game.screenX <= 1024 && "landscape" == e,
        config.maxScoreboard = 8,
        config.phone && (config.minimapSize = 160,
        config.maxScoreboard = 5),
        config.tablet && (config.maxScoreboard = 7),
        config.minimapPaddingX = game.screenX / 2 - config.minimapSize / 2
    }
};

var initMapTextures = function() {
    var overdrawWidth = renderer.width + config.overdraw,
        overdrawHeight = renderer.height + config.overdraw;
    pixiTextureByName.sea = Textures.tile("map_sea", overdrawWidth, overdrawHeight),
    pixiTextureByName.sea_mask = Textures.sprite("map_sea_mask"),
    pixiTextureByName.sea_mask.scale.set(8, 8),
    pixiTextureByName.sea_mask.blendMode = PIXI.BLEND_MODES.MULTIPLY,
    pixiTextureByName.sea_mask.alpha = .5,
    pixiTextureByName.forest = Textures.tile("map_forest", overdrawWidth, overdrawHeight),
    pixiTextureByName.sand = Textures.tile("map_sand", overdrawWidth, overdrawHeight),
    pixiTextureByName.sand_mask = Textures.sprite("map_sand_mask"),
    pixiTextureByName.sand_mask.scale.set(8, 8),
    pixiTextureByName.sand.mask = pixiTextureByName.sand_mask,
    pixiTextureByName.rock = Textures.tile("map_rock", overdrawWidth, overdrawHeight),
    pixiTextureByName.rock_mask = Textures.sprite("map_rock_mask"),
    pixiTextureByName.rock_mask.scale.set(8, 8),
    pixiTextureByName.rock.mask = pixiTextureByName.rock_mask,
    pixiContainerByName.sea.addChild(pixiTextureByName.sea),
    pixiContainerByName.sea.addChild(pixiTextureByName.sea_mask);
    for (var textureName of ["forest", "sand", "sand_mask", "rock", "rock_mask"])
        pixiContainerByName.map.addChild(pixiTextureByName[textureName]);
    pixiContainerByName.map.addChild(pixiContainerByName.doodads),
    createMapFromJson(),
    initTextureScalesAndMasks()
};

var initTextureScalesAndMasks = function() {
    var textureName;
    for (textureName of ["sea", "forest", "sand", "rock"])
        pixiTextureByName[textureName].tileScale.set(game.scale, game.scale);
    for (textureName of ["sea", "sand", "rock"])
        pixiTextureByName[textureName + "_mask"].scale.set(8 * game.scale, 8 * game.scale)
};

var initPolygonsScale = function() {
    pixiTextureByName.polygons.scale.x = game.scale,
    pixiTextureByName.polygons.scale.y = game.scale
};

var createMapFromJson = function() {
    $.getJSON("assets/map.json", function(mapResponse) {
        pixiTextureByName.polygons = new PIXI.Graphics,
        pixiTextureByName.polygons.beginFill();
        var t, r, o, points, a, l, u, c = 0, h = 0, d = 0;
        for (l = 0; l < mapResponse.length; l++)
            for (o = 0,
            u = 0; u < mapResponse[l].length; u++) {
                for (points = [],
                a = 0; a < mapResponse[l][u].length; a += 2)
                    t = mapResponse[l][u][a] + h,
                    r = mapResponse[l][u][a + 1] + d,
                    points.push(parseFloat(t), -parseFloat(r)),
                    h = t,
                    d = r,
                    c++;
                pixiTextureByName.polygons.drawPolygon(points),
                0 != o && pixiTextureByName.polygons.addHole(),
                o++
            }
        pixiTextureByName.polygons.endFill(),
        initPolygonsScale(),
        pixiContainerByName.map.addChild(pixiTextureByName.polygons),
        pixiContainerByName.map.mask = pixiTextureByName.polygons
    })
};

Graphics.initSprite = function(name, container, properties) {
    var sprite = Textures.sprite(name);
    return properties.position && sprite.position.set(properties.position[0], properties.position[1]),
    properties.anchor && sprite.anchor.set(properties.anchor[0], properties.anchor[1]),
    properties.pivot && sprite.pivot.set(properties.pivot[0], properties.pivot[1]),
    properties.scale && (Array.isArray(properties.scale) ? sprite.scale.set(properties.scale[0], properties.scale[1]) : sprite.scale.set(properties.scale)),
    properties.rotation && (sprite.rotation = properties.rotation),
    properties.alpha && (sprite.alpha = properties.alpha),
    properties.blend && (sprite.blendMode = PIXI.BLEND_MODES[properties.blend]),
    properties.tint && (sprite.tint = properties.tint),
    properties.mask && (sprite.mask = properties.mask),
    properties.visible && (sprite.visible = properties.visible),
    container.addChild(sprite),
    sprite
};

Graphics.transform = function(container, xPos, yPos, rot, xScale, yScale, alpha) {
    container.position.set(xPos, yPos),
    null != yScale ? container.scale.set(xScale, yScale) : null != xScale && container.scale.set(xScale),
    null != rot && (container.rotation = rot),
    null != alpha && (container.alpha = alpha)
};

Graphics.update = function() {
    pixiTextureByName.shade.position.set(cameraState.center.x / config.shadowScaling, cameraState.center.y / config.shadowScaling),
    pixiTextureByName.renderSprite.position.set(game.scale * (-cameraState.position.x + cameraState.lastOverdraw.x) - config.overdraw / 2, game.scale * (-cameraState.position.y + cameraState.lastOverdraw.y) - config.overdraw / 2),
    pixiContainerByName.objects.position.set(-cameraState.position.x * game.scale, -cameraState.position.y * game.scale),
    pixiContainerByName.groundobjects.position.set(-cameraState.position.x * game.scale, -cameraState.position.y * game.scale),
    pixiContainerByName.doodads.position.set(-cameraState.position.x * game.scale + config.overdraw / 2, -cameraState.position.y * game.scale + config.overdraw / 2),
    pixiContainerByName.shadows.position.set(-cameraState.position.x * (game.scale / config.shadowScaling), -cameraState.position.y * (game.scale / config.shadowScaling)),
    pixiSpriteByName.minimap_box.position.set(game.screenX - config.minimapPaddingX - config.minimapSize * ((16384 - cameraState.center.x) / 32768), game.screenY - config.minimapPaddingY - config.minimapSize / 2 * ((8192 - cameraState.center.y) / 16384)),
    config.overdrawOptimize ? (Math.abs(cameraState.position.x - cameraState.lastOverdraw.x) > config.overdraw / 2 / game.scale || Math.abs(cameraState.position.y - cameraState.lastOverdraw.y) > config.overdraw / 2 / game.scale || game.time - cameraState.lastOverdrawTime > 2e3) && redrawBackground() : redrawBackground()
};

Graphics.setCamera = function(e, n) {
    var r = 0,
        i = 0;
    cameraState.shake > .5 && (r = Tools.rand(-cameraState.shake, cameraState.shake),
    i = Tools.rand(-cameraState.shake, cameraState.shake),
    cameraState.shake *= 1 - .06 * game.timeFactor);
    var o = game.halfScreenX / game.scale,
        s = game.halfScreenY / game.scale;
    e = Tools.clamp(e, -16384 + o, 16384 - o),
    n = Tools.clamp(n, -8192 + s, 8192 - s),
    cameraState.position.x = r + e - game.screenX / 2 / game.scale,
    cameraState.position.y = i + n - game.screenY / 2 / game.scale,
    cameraState.center.x = r + e,
    cameraState.center.y = i + n
};

Graphics.getCamera = function() {
    return cameraState.center
};

Graphics.shakeCamera = function(e, n) {
    var length = Tools.length(e.x - cameraState.center.x, e.y - cameraState.center.y),
        i = (game.halfScreenX / game.scale + game.halfScreenY / game.scale) / 2,
        o = Tools.clamp(1.3 * (1 - length / i), 0, 1);
    o < .1 || (cameraState.shake = o * n)
};

Graphics.shadowCoords = function(e) {
    var t = Mobs.getClosestDoodad(e);
    return new Vector((e.x + config.shadowOffsetX * t) / config.shadowScaling,(e.y + config.shadowOffsetY * t) / config.shadowScaling)
};

Graphics.minimapMob = function(container, x, y) {
    null != container && container.position.set(game.screenX - config.minimapPaddingX - config.minimapSize * ((16384 - x) / 32768), game.screenY - config.minimapPaddingY - config.minimapSize / 2 * ((8192 - y) / 16384))
};

Graphics.toggleFullscreen = function() {
    !function() {
        var e = document;
        return e.fullscreenElement ? null !== e.fullscreenElement : e.mozFullScreenElement ? null !== e.mozFullScreenElement : e.webkitFullscreenElement ? null !== e.webkitFullscreenElement : e.msFullscreenElement ? null !== e.msFullscreenElement : void 0
    }() ? function() {
        var e = document.documentElement;
        if (e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen && e.msRequestFullscreen(),
        config.mobile && null != window.screen && null != window.screen.orientation)
            try {
                screen.orientation.lock("landscape")
            } catch (e) {}
    }() : function() {
        var e = document;
        e.exitFullscreen ? e.exitFullscreen() : e.mozCancelFullScreen ? e.mozCancelFullScreen() : e.webkitExitFullscreen ? e.webkitExitFullscreen() : e.msExitFullscreen && e.msExitFullscreen()
    }()
};

Graphics.inScreen = function(e, n) {
    return e.x >= cameraState.center.x - game.halfScreenX / game.scale - n && e.x <= cameraState.center.x + game.halfScreenX / game.scale + n && e.y >= cameraState.center.y - game.halfScreenY / game.scale - n && e.y <= cameraState.center.y + game.halfScreenY / game.scale + n
};

var redrawBackground = function() {
    Mobs.updateDoodads(),
    cameraState.lastOverdraw.x = cameraState.position.x,
    cameraState.lastOverdraw.y = cameraState.position.y,
    pixiTextureByName.renderSprite.position.set(-config.overdraw / 2, -config.overdraw / 2);
    var textureName, o = cameraState.position.x - config.overdraw / game.scale / 2, s = cameraState.position.y - config.overdraw / game.scale / 2, a = -o * game.scale, l = -s * game.scale, u = (-o - 16384) * game.scale, c = (-s - 8192) * game.scale;
    for (textureName of ["sea", "forest", "sand", "rock"])
        pixiTextureByName[textureName].tilePosition.set(a, l);
    for (textureName of ["sea", "sand", "rock"])
        pixiTextureByName[textureName + "_mask"].position.set(u, c);
    null != pixiTextureByName.polygons && null != pixiTextureByName.polygons.position && pixiTextureByName.polygons.position.set(-o * game.scale, -s * game.scale),
    cameraState.lastOverdrawTime = game.time,
    renderer.render(pixiContainerByName.sea, pixiTextureByName.render),
    renderer.render(pixiContainerByName.map, pixiTextureByName.render)
};

Graphics.render = function() {
    renderer.render(pixiContainerByName.shadows, pixiTextureByName.shadows, true),
    renderer.render(pixiContainerByName.hudEnergy, pixiSpriteByName.hudTextureEnergy, true),
    renderer.render(pixiContainerByName.hudHealth, pixiSpriteByName.hudTextureHealth, true),
    renderer.render(pixiContainerByName.game)
};
