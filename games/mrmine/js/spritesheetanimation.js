class SpritesheetAnimation
{
    /*
    Notes

    - Add methods:
        - loopFrames(startFrame, endFrame)
        - setFPS()
        - playBackwards()
        - playOscillate()
        - setRotation()
        - setScaleX()
        - setScaleY()
        - Move getAnimationFrameIndex() here
        - numPixelsDrawnLastFrame()
        - numAssetsDrawnLastFrame()
        - setSize(width, height, maintainAspectRatio) -> sets scaleX, scaleY, renderWidth, renderHeight
    - Add data:
        - renderWidth -> sets scaleX
        - renderheight -> sets scaleY
        - firstFrameIndex
        - lastFrameIndex
        - rotation
        - scaleX
        - scaleY
        - isOscillating
        - isPlayingBackwards
        - timeUntilNextFrame
        - numFramesInSequence
    */

    spritesheet;
    frameCount;
    fps;
    phaseShift;
    frameSpacing;
    frameSequence = [];
    frameWidth = 0;

    currentFrame = 0;

    isPaused = false;
    _pauseOnFinish = false;
    unpauseAfterFrames = -1;
    _pauseTimer = -1;

    targetScreenWidth = 1280;
    targetScreenHeight = 720;

    horizontalAlign = "center";
    verticalAlign = "center";

    constructor(spritesheet, frameCount, fps, frameSpacing = 0, phaseShift = 0, frameSequence = [])
    {
        this.spritesheet = spritesheet;
        this.frameCount = frameCount;
        this.fps = fps;
        this.frameSpacing = frameSpacing;
        this.frameSequence = frameSequence;
        this.phaseShift = phaseShift;
        if(this.spritesheet.complete && this.spritesheet.naturalHeight !== 0)
        {
            this.updateFrameWidth();
        }
        else
        {
            this.spritesheet.addEventListener("load", this.updateFrameWidth.bind(this));
        }
    }

    updateFrameWidth()
    {
        this.frameWidth = this.spritesheet.width / this.frameCount - this.frameSpacing * (this.frameCount - 1);
    }

    drawAnimation(context, x, y, width, height, maintainAspectRatio = true, frameIndicesToPlay = [])
    {
        var frameToRender;
        if (this._pauseTimer < 0)
        {
            this._pauseTimer = this.unpauseAfterFrames;
        }
        if(!this.isPaused)
        {
            let frameCount = frameIndicesToPlay.length > 0 ? frameIndicesToPlay.length : this.frameCount;
            frameToRender = getAnimationFrameIndex(frameCount, this.fps, this.phaseShift);
        }
        else
        {
            if (this.unpauseAfterFrames >= 0)
            {
                if (this._pauseTimer > 0)
                {
                    this._pauseTimer--;
                }
                else
                {
                    this._pauseTimer = this.unpauseAfterFrames;
                    this.gotoAndPlay(0);
                    this.currentFrame = 0;
                }
            }
            frameToRender = this.currentFrame;
        }

        var box = this.drawFrame(
            context,
            x,
            y,
            width,
            height,
            frameToRender,
            maintainAspectRatio
        );
        if(frameToRender == this.frameCount - 1 && this._pauseOnFinish)
        {
            this._pauseOnFinish = false;
            this.pause();
        }
        this.currentFrame = frameToRender;
        return box;
    }


    loopFrames(context, x, y, width, height, maintainAspectRatio = true, minFrame, maxFrame)
    {
        var frameSequence = [];
        for(var i = minFrame; i < maxFrame; i++)
        {
            frameSequence.push(i);
        }

        return this.drawAnimation(context, x, y, width, height, maintainAspectRatio, frameSequence);
    }

    drawFrame(context, x, y, width, height, frameToRender, maintainAspectRatio = true)
    {
        if(maintainAspectRatio)
        {
            var dimensions = fitBoxInBox(
                this.frameWidth,
                this.spritesheet.height,
                x,
                y,
                width,
                height,
                this.horizontalAlign,
                this.verticalAlign
            );
            x = dimensions.x;
            y = dimensions.y;
            width = dimensions.width;
            height = dimensions.height;
        }

        context.drawImage(
            this.spritesheet,
            frameToRender * (this.frameWidth + this.frameSpacing),
            0,
            this.frameWidth,
            this.spritesheet.height,
            x,
            y,
            width,
            height
        );
        return {x: x, y: y, width: width, height: height};
    }

    pause()
    {
        this.isPaused = true;
    }

    play()
    {
        this.isPaused = false;
    }

    playUntilFinished()
    {
        this._pauseOnFinish = true;
    }

    // Updates the phase shift so that the animation will skip to frameNumber
    goToFrame(frameNumber)
    {
        this.phaseShift = Math.ceil((frameNumber * (IDLE_FRAMERATE / this.fps)) - numFramesRendered);
    }

    gotoAndPlay(frameNumber)
    {
        this.goToFrame(frameNumber);
        this.play();
    }

    gotoAndStop(frameNumber)
    {
        this.goToFrame(frameNumber);
        this.pause();
    }

    getScaleFromScreenWidth()
    {
        return this.targetScreenWidth / window.innerWidth;
    }

    getScaleFromScreenHeight()
    {
        return this.targetScreenHeight / window.innerHeight;
    }

    clone()
    {
        var clone = new this.constructor(this.spritesheet, this.frameCount, this.fps, this.frameSpacing, this.phaseShift, this.frameSequence);
        Object.assign(clone, this);
        return clone;
    }
}