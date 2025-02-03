class ConfirmationWindow extends PopupWindow
{
    layerName = "confirmationLayer"; // Used as key in activeLayers
    domElementId = "CONFIRMATIOND";
    context = null;  // Canvas rendering context for popup
    zIndex = 998;

    openTimestamp = "";

    // Relative to screen size
    bodyWidth = 0.5;
    bodyHeight = 0.5;

    // Relative to body size
    bodyPadding = 0.005;
    textAreaHeight = 0.7;
    buttonWidth = 0.35;
    buttonHeight = 0.2;
    bodyFontSize = 0.1;

    frameWidth = 24;

    text;
    yesButtonText;
    noButtonText;
    yesFunction;
    noFunction;

    actionTaken = false;

    constructor(boundingBox, text, yesButtonText = _("YES"), noButtonText = _("NO"), yesFunction = null, noFunction = null, callOutText)
    {
        super(boundingBox);
        this.initHtml();
        this.setBoundingBox();

        this.text = text;
        this.yesButtonText = yesButtonText;
        this.noButtonText = noButtonText;
        if(yesFunction == null)
        {
            yesFunction = () => { };
        }
        if(noFunction == null)
        {
            noFunction = () => { };
        }
        this.yesFunction = yesFunction;
        this.noFunction = noFunction;
        this.callOutText = callOutText;
        this.disabledHitboxes = [];

        this.initHitboxes();
    }

    initHtml()
    {
        this.openTimestamp = Math.floor(performance.now());
        this.layerName += "_" + this.openTimestamp;
        this.domElementId += "_" + this.openTimestamp;

        this.div = document.createElement("div");
        this.div.classList.add("CONFIRMATIOND");
        this.div.onselectstart = () => false;
        this.div.ondragstart = () => false;
        this.div.style.zIndex = this.zIndex;
        this.div.style.visibility = "hidden";
        this.div.id = this.domElementId;

        var canvas = document.createElement("canvas");
        canvas.width = 0;
        canvas.height = 0;
        canvas.style.width = 0;
        canvas.style.height = 0;
        canvas.style.position = "absolute";
        canvas.style.zIndex = this.zIndex;
        canvas.id = "CONFIRMATION_" + this.openTimestamp;
        this.context = canvas.getContext("2d");

        this.div.appendChild(canvas);
        document.body.appendChild(this.div);
    }

    initHitboxes()
    {
        this.clearHitboxes();
        this.createBody();
        this.createButtons();
    }

    createBody()
    {
        this.body = this.addHitbox(new Hitbox(
            {
                x: (this.boundingBox.width * (1 - this.bodyWidth)) / 2,
                y: (this.boundingBox.height * (1 - this.bodyHeight)) / 2,
                width: this.boundingBox.width * this.bodyWidth,
                height: this.boundingBox.height * this.bodyHeight
            },
            {},
            ""
        ));

        this.body.render = function ()
        {
            var popupFrameWidth = 24;
            var renderedFrameWidth = this.parent.frameWidth;
            var shadowWidth = 7;
            var shadowHeight = 11;

            var coords = this.getRelativeCoordinates(0, 0, this.parent);
            var context = this.parent.context;
            context.drawImage(
                lilpopupBackground,
                coords.x + renderedFrameWidth,
                coords.y + renderedFrameWidth,
                this.boundingBox.width - 2 * renderedFrameWidth,
                this.boundingBox.height - 2 * renderedFrameWidth
            );
            drawFrame(
                context,
                lilpopupFrame,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height,
                renderedFrameWidth,
                popupFrameWidth,
                shadowHeight,
                shadowWidth
            )
            this.renderChildren();
        }

        var padding = this.boundingBox.width * this.bodyPadding + this.frameWidth;
        this.body.bodyContainer = this.body.addHitbox(new Hitbox(
            {
                x: padding,
                y: padding,
                width: this.body.boundingBox.width - 2 * padding,
                height: this.body.boundingBox.height - 2 * padding
            },
            {},
            ""
        ));

        this.body.bodyContainer.render = function ()
        {
            var root = this.parent.parent;
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;
            var textAreaHeight = root.textAreaHeight - (isSimpleInputVisible() ? 0.17 : 0);
            context.save();
            context.fillStyle = "#FFFFFF";
            context.strokeStyle = "#000000";
            context.font = (this.boundingBox.height * root.bodyFontSize) + "px KanitM";
            context.lineWidth = 6;
            context.textBaseline = 'top';
            let textStats = strokeTextWrapWithHeightLimit(
                context,
                root.text,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height * textAreaHeight,
                "center",
                0.25,
                "center"
            );
            fillTextWrapWithHeightLimit(
                context,
                root.text,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height * textAreaHeight,
                "center",
                0.25,
                "center"
            );

            if(root.callOutText)
            {
                context.fillStyle = "#FF0000";
                context.strokeStyle = "#000000";
                context.font = (this.boundingBox.height * (root.bodyFontSize * .5)) + "px KanitM";

                strokeTextWrapWithHeightLimit(
                    context,
                    root.callOutText,
                    coords.x,
                    textStats.y2,
                    this.boundingBox.width,
                    (this.boundingBox.height * textAreaHeight) - (textStats.height + 50),
                    "center",
                    0.25,
                    "center"
                );
                fillTextWrapWithHeightLimit(
                    context,
                    root.callOutText,
                    coords.x,
                    textStats.y2,
                    this.boundingBox.width,
                    (this.boundingBox.height * textAreaHeight) - (textStats.height + 50),
                    "center",
                    0.25,
                    "center"
                );
            }
            context.restore();
            this.renderChildren();
        }
    }

    createButtons()
    {
        var container = this.body.bodyContainer.boundingBox;

        var yesButtonX, noButtonX;
        var yesButtonY, noButtonY;
        var buttonRegionCenterY = container.height * (0.5 + this.textAreaHeight / 2) - (container.height * this.buttonHeight) / 2

        if(this.noButtonText == "")
        {
            // Center yes button
            yesButtonX = container.width * (1 - this.buttonWidth) / 2;
            yesButtonY = buttonRegionCenterY;
        }
        else if(this.buttonWidth >= 0.5)
        {
            // Vertically stack the buttons
            yesButtonX = container.width * (1 - this.buttonWidth) / 2;
            yesButtonY = buttonRegionCenterY - (container.height * this.buttonHeight * 0.6);

            noButtonX = container.width * (1 - this.buttonWidth) / 2;
            noButtonY = buttonRegionCenterY + (container.height * this.buttonHeight * 0.6);
        }
        else
        {
            yesButtonX = (container.width / 2 - container.width * this.buttonWidth) / 2;
            yesButtonY = buttonRegionCenterY;

            noButtonX = (3 * container.width / 2 - container.width * this.buttonWidth) / 2;
            noButtonY = buttonRegionCenterY;
        }
        this.createButton(
            startb,
            this.yesButtonText,
            {
                x: yesButtonX,
                y: yesButtonY,
                width: container.width * this.buttonWidth,
                height: container.height * this.buttonHeight
            },
            this.yesFunction
        );
        this.createButton(
            stopb,
            this.noButtonText,
            {
                x: noButtonX,
                y: noButtonY,
                width: container.width * this.buttonWidth,
                height: container.height * this.buttonHeight
            },
            this.noFunction
        );
    }

    createButton(image, text, boundingBox, clickFunction)
    {
        var button = this.body.bodyContainer.addHitbox(new Hitbox(
            boundingBox,
            {
                onmousedown: function (clickFunction)
                {
                    if(clickFunction)
                    {
                        clickFunction();
                    }
                    this.actionTaken = true;
                    this.close();
                }.bind(this, clickFunction)
            }
        ));
        button.root = this;
        button.image = image;
        button.text = text;
        button.render = function ()
        {
            var coords = this.getRelativeCoordinates(0, 0, this.root);
            var context = this.root.context;
            context.drawImage(this.image, coords.x, coords.y, this.boundingBox.width, this.boundingBox.height);

            context.font = (this.boundingBox.height * 0.8) + "px KanitM";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "middle";
            context.lineWidth = this.boundingBox.height * 0.08;
            drawNineSlice(
                context,
                this.image,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height,
                31,
                24
            );
            strokeTextShrinkToFit(
                context,
                this.text,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );
            fillTextShrinkToFit(
                context,
                this.text,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );

        }
    }

    render()
    {
        if(!isDivVisible(this.domElementId))
        {
            showDiv(this.domElementId, this.zIndex);
        }
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        drawColoredRect(this.context, 0, 0, this.boundingBox.width, this.boundingBox.height, "#000000", 0.5);

        this.renderChildren();
    }

    close()
    {
        // Call noFunction if the window is closed by some external means before an action is taken
        if(!this.actionTaken && this.noFunction)
        {
            this.noFunction();
        }

        hideSimpleInput();
        try
        {
            document.body.removeChild(this.div);
        }
        catch(e)
        {
            console.warn(e);
            if(this.context && this.context.canvas)
            {
                minimizeCanvas(this.context.canvas);
            }
        }
        var result = super.close();
        if(result)
        {
            delete activeLayers[this.layerName];
        }
        return result;
    }
}