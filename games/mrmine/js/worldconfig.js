var worldConfig = {}

function initWorldConfig()
{
    worldConfig = {
        bottomBoundFraction: 0,
        leftBound: Math.ceil(mainw * 0.082),
        rightBound: Math.floor(mainw * 0.806),
        topBound: Math.ceil(mainh * .111),
        levelHeight: Math.ceil(mainh * .18),
        levelWidth: Math.floor(mainw * .724),
        numberOfDepthsVisible: 5,
        maxDepthOffset: 0,
        superMiners: {
            height: 0.65,
            yOffset: -0.2,
            leftBound: 0.1,
            rightBound: 0.8
        }
    }
}

initWorldConfig();