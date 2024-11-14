class AnnouncementPopup extends PopupWindow
{
    layerName = "announcementpopup"; // Used as key in activeLayers
    domElementId = "NEWSD"; // ID of dom element that gets shown or hidden
    context = NEWS;         // Canvas rendering context for popup
    zIndex = 999;

    announcement;
    announcementImage;
    clickedButton = false;

    // Relative to screen size
    popupWidth = 0.45;
    popupHeight = 0.7;

    // Relative to popup size
    bodyPadding = 0.02;
    headerHeight = 0.13;
    imageHeight = 0.55;
    footerHeight = 0.10;
    frameWidth = 0.04;

    bodyPadding = 0.03;
    bodyFontSize = 1;



    constructor(boundingBox, announcement)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.announcement = announcement;
        this.announcementImage = new Image();
        if(announcement.image)
        {
            this.announcementImage.src = announcement.image.url;
        }

        this.createPopup();
        this.createHeader();
        this.createImageContainer();
        this.createBody();
        this.createFooter();
    }

    createPopup()
    {
        this.popup = this.addHitbox(new Hitbox(
            {
                x: (this.boundingBox.width * (1 - this.popupWidth)) / 2,
                y: (this.boundingBox.height * (1 - this.popupHeight)) / 2,
                width: this.boundingBox.width * this.popupWidth,
                height: this.boundingBox.height * this.popupHeight
            },
            {},
            ""
        ));

        this.popup.render = function ()
        {
            this.parent.clearCanvas();
            var popupFrameWidth = 24;
            var renderedFrameWidth = this.parent.frameWidth * this.parent.popupWidth * this.parent.boundingBox.width;
            var shadowWidth = 8;
            var shadowHeight = 11;

            var coords = this.getRelativeCoordinates(0, 0, this.parent);
            var context = this.parent.context;
            context.drawImage(
                popupBackgroundLight,
                coords.x + renderedFrameWidth * 0.34,
                coords.y + renderedFrameWidth * 0.34,
                this.boundingBox.width - 2 * renderedFrameWidth * 0.34,
                this.boundingBox.height - 2 * renderedFrameWidth * 0.34
            );
            drawFrame(
                context,
                popupFrame,
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

        var padding = this.popup.boundingBox.width * (this.frameWidth + this.bodyPadding);
        this.bodyContainer = this.popup.addHitbox(new Hitbox(
            {
                x: padding,
                y: padding,
                width: this.popup.boundingBox.width - 2 * padding,
                height: this.popup.boundingBox.height - 2 * padding
            },
            {},
            ""
        ));

        this.closeButton = this.addHitbox(new Button(
            closei, "", "", "",
            {
                x: this.popup.boundingBox.x + this.popup.boundingBox.width * .96,
                y: this.popup.boundingBox.y,
                width: this.boundingBox.width * .02,
                height: this.boundingBox.width * .02
            },
            {
                onmousedown: function ()
                {
                    closeUi(this.parent);
                    if(!mutebuttons) closeAudio[rand(0, closeAudio.length - 1)].play();
                }
            },
            'pointer',
            "closeButton"
        ));
    }

    createHeader()
    {
        this.header = this.bodyContainer.addHitbox(new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height * this.headerHeight
            },
            {},
            "header"
        ));

        this.header.render = function ()
        {
            var root = this.getRootLayer();
            if(!root.announcement.title)
            {
                return;
            }
            var titleText = root.announcement.title;
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;
            var titleTextSize = Math.floor(this.boundingBox.height);
            context.save();
            context.font = titleTextSize + "px KanitB";
            context.fillStyle = "#FFFFFF";
            context.strokeStyle = "#000000";
            context.lineWidth = 4;
            context.textBaseline = "top";
            strokeTextWrapWithHeightLimit(
                context,
                titleText,
                coords.x,
                coords.y,
                this.boundingBox.width,
                titleTextSize,
                "center",
                0.07
            );
            fillTextWrapWithHeightLimit(
                context,
                titleText,
                coords.x,
                coords.y,
                this.boundingBox.width,
                titleTextSize,
                "center",
                0.07
            );

            context.restore();
        }
    }

    createImageContainer()
    {
        this.imageContainer = this.bodyContainer.addHitbox(new Hitbox(
            {
                x: 0,
                y: this.headerHeight * this.bodyContainer.boundingBox.height,
                width: this.bodyContainer.boundingBox.width,
                height: this.imageHeight * this.bodyContainer.boundingBox.height
            },
            {}
        ));

        this.imageContainer.render = function ()
        {
            var root = this.getRootLayer();
            if(root.announcementImage)
            {
                var coords = this.getRelativeCoordinates(0, 0, root);
                var context = root.context;
                context.save();
                var imageBox = drawImageFitInBox(
                    context,
                    root.announcementImage,
                    coords.x,
                    coords.y,
                    this.boundingBox.width,
                    this.boundingBox.height
                );
                root.drawBox(
                    imageBox.x,
                    imageBox.y,
                    imageBox.width,
                    imageBox.height,
                    5,
                    0
                );
                context.restore();
            }

            this.renderChildren();
        }
    }

    createBody()
    {
        var bodyHeight = 1 - (this.headerHeight + this.imageHeight + this.footerHeight);
        this.body = this.bodyContainer.addHitbox(new Hitbox(
            {
                x: 0,
                y: this.imageContainer.boundingBox.y + this.imageContainer.boundingBox.height,
                width: this.bodyContainer.boundingBox.width,
                height: bodyHeight * this.bodyContainer.boundingBox.height
            },
            {}
        ));

        this.body.render = function ()
        {
            var root = this.getRootLayer();
            if(root.announcement.body)
            {
                var image = new Image();
                image.src = root.announcement.image.url;
                var coords = this.getRelativeCoordinates(0, 0, root);
                var context = root.context;
                var hPadding = root.bodyContainer.boundingBox.width * root.bodyPadding;
                var vPadding = root.bodyContainer.boundingBox.height * root.bodyPadding;
                context.save();
                context.imageSmoothingEnabled = false;
                context.textBaseline = "top";
                context.font = ((root.bodyFontSize - vPadding * 2) * this.boundingBox.height) + "px KanitM";
                context.fillStyle = "#FFFFFF";
                fillTextWrapWithHeightLimit(
                    context,
                    root.announcement.body,
                    coords.x + hPadding,
                    coords.y + vPadding,
                    this.boundingBox.width - 2 * hPadding,
                    this.boundingBox.height - 2 * vPadding,
                    "center",
                    0.25
                )
                context.restore();
            }

            this.renderChildren();
        }
    }

    createFooter()
    {
        var buttonHeight = this.bodyContainer.boundingBox.height * this.footerHeight;
        var buttonWidth = Math.min(this.bodyContainer.boundingBox.width * 0.9, mainw * 0.25);
        var fontSize = Math.min(32, buttonHeight * 0.8);
        this.button = this.bodyContainer.addHitbox(
            new Button(
                startb, "", fontSize + "px KanitB", "#000000",
                {
                    x: this.bodyContainer.boundingBox.width * 0.5 - buttonWidth * 0.5,
                    y: this.body.boundingBox.y + this.body.boundingBox.height,
                    width: buttonWidth,
                    height: this.bodyContainer.boundingBox.height * this.footerHeight
                },
                {
                    onmousedown: function ()
                    {
                        if(this.announcement.link)
                        {
                            openExternalLinkInDefaultBrowser(this.announcement.link)
                        }
                        this.clickedButton = true;
                        closeUi(this);
                    }.bind(this)
                }
            )
        )
        this.button.render = function ()
        {
            var root = this.getRootLayer();
            if(!root.announcement.button)
            {
                return;
            }
            var coords = this.getRelativeCoordinates(0, 0, root);
            var context = root.context;

            context.font = (this.boundingBox.height * 0.8) + "px KanitM";
            context.fillStyle = "#FFFFFF";
            context.textBaseline = "middle";
            context.lineWidth = this.boundingBox.height * 0.08;
            drawNineSlice(
                context,
                startb,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.height,
                31,
                24
            );
            strokeTextShrinkToFit(
                context,
                root.announcement.button,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );
            fillTextShrinkToFit(
                context,
                root.announcement.button,
                coords.x + (this.boundingBox.width * 0.075),
                coords.y + (this.boundingBox.height * 0.51),
                this.boundingBox.width * .85,
                "center"
            );
        }
    }

    drawBox(x, y, width, height, frameWidth, backgroundOpacity, backgroundColor = "#000000")
    {
        this.context.save();
        this.context.fillStyle = backgroundColor;
        this.context.globalAlpha = backgroundOpacity;
        this.context.fillRect(x, y, width, height);
        this.context.globalAlpha = 1;
        drawFrame(
            this.context,
            itemFrame,
            x,
            y,
            width,
            height,
            frameWidth,
            4,
            0,
            0
        );
        this.context.restore();
    }

    open()
    {
        if(this.announcement.start)
        {
            this.announcement.start();
        }
        return super.open();
    }

    close()
    {
        if(this.announcement && this.announcement.markAsClicked)
        {
            if(this.clickedButton)
            {
                this.announcement.markAsClicked();
            }
            else
            {
                this.announcement.markAsDismissed();
            }
            Playsaurus.announcements.sendInteraction(this.announcement);
        }
        return super.close()
    }
}