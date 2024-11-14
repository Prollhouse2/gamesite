class OfferChestWindow extends TabbedPopupWindow
{
    layerName = "OfferChestWindow"; // Used as key in activeLayers
    domElementId = "HIRED"; // ID of dom element that gets shown or hidden
    context = HR;         // Canvas rendering context for popup

    zIndex = 2;

    constructor(boundingBox)
    {
        super(boundingBox);
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.initializeTabs();

        this.compressorPane = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.x,
                y: this.bodyContainer.boundingBox.y,
                width: this.bodyContainer.boundingBox.width,
                height: this.bodyContainer.boundingBox.height
            },
            {},
            "",
            "compressorPane"
        );
        this.compressorPane.allowBubbling = true;
        this.addHitbox(this.compressorPane);
        this.initializeBaseTab();
        this.onTabChange();
    }

    initializeBaseTab()
    {
        this.compressorPane.clearHitboxes();
        //basic chest
        this.compressorPane.basicChestDisplay = new Hitbox(
            {
                x: 0,
                y: this.bodyContainer.boundingBox.height * -0.05,
                width: this.bodyContainer.boundingBox.width * 0.30,
                height: this.bodyContainer.boundingBox.height * 0.7
            }, {}, ""
        );
        this.compressorPane.basicChestDisplay.render = function (parentWindow)
        {
            var coords = this.getRelativeCoordinates(0, 0, parentWindow);
            var imageBoundingBox = drawImageFitInBox(
                parentWindow.context,
                basicChestIconClosed,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.width
            );
            parentWindow.context.save();
            parentWindow.context.font = "24px Verdana";
            parentWindow.context.fillStyle = "#FFFFFF";
            parentWindow.context.textBaseline = "top";
            fillTextWrap(
                parentWindow.context,
                "x " + rewardedChestStorage.getStoredChestsOfType(ChestType.basic),
                coords.x,
                imageBoundingBox.y + imageBoundingBox.height,
                this.boundingBox.width,
                "center"
            );
            parentWindow.context.restore();
            this.renderChildren();
        }.bind(this.compressorPane.basicChestDisplay, this);
        this.compressorPane.addHitbox(this.compressorPane.basicChestDisplay);

        this.compressorPane.basicChestButton = this.compressorPane.addHitbox(new Button(
            upgradebg_blank, _("Open Basic Chest"), "18px KanitM", "#000000",
            {
                x: this.compressorPane.basicChestDisplay.boundingBox.x,
                y: this.compressorPane.basicChestDisplay.boundingBox.height * 0.72,
                width: this.compressorPane.basicChestDisplay.boundingBox.width,
                height: this.compressorPane.basicChestDisplay.boundingBox.height * 0.15
            },
            {
                onmousedown: function ()
                {
                    rewardedChestStorage.grantStoredChest(ChestType.basic);
                }
            }
        ));
        this.compressorPane.basicChestButton.isEnabled = () => rewardedChestStorage.getStoredChestsOfType(ChestType.basic) > 0;

        //gold chest
        this.compressorPane.goldChestDisplay = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.width * 0.35,
                y: this.bodyContainer.boundingBox.height * -0.05,
                width: this.bodyContainer.boundingBox.width * 0.30,
                height: this.bodyContainer.boundingBox.height * 0.7
            }, {}, ""
        );
        this.compressorPane.goldChestDisplay.render = function (parentWindow)
        {
            var coords = this.getRelativeCoordinates(0, 0, parentWindow);
            var imageBoundingBox = drawImageFitInBox(
                parentWindow.context,
                goldChestIconClosed,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.width
            );
            parentWindow.context.save();
            parentWindow.context.font = "24px Verdana";
            parentWindow.context.fillStyle = "#FFFFFF";
            parentWindow.context.textBaseline = "top";
            fillTextWrap(
                parentWindow.context,
                "x " + rewardedChestStorage.getStoredChestsOfType(ChestType.gold),
                coords.x,
                imageBoundingBox.y + imageBoundingBox.height,
                this.boundingBox.width,
                "center"
            );
            parentWindow.context.restore();
            this.renderChildren();
        }.bind(this.compressorPane.goldChestDisplay, this);
        this.compressorPane.addHitbox(this.compressorPane.goldChestDisplay);

        this.compressorPane.goldChestButton = this.compressorPane.addHitbox(new Button(
            upgradebg_blank, _("Open Gold Chest"), "18px KanitM", "#000000",
            {
                x: this.compressorPane.goldChestDisplay.boundingBox.x,
                y: this.compressorPane.goldChestDisplay.boundingBox.height * 0.72,
                width: this.compressorPane.goldChestDisplay.boundingBox.width,
                height: this.compressorPane.goldChestDisplay.boundingBox.height * 0.15
            },
            {
                onmousedown: function ()
                {
                    rewardedChestStorage.grantStoredChest(ChestType.gold);
                }
            }
        ));
        this.compressorPane.goldChestButton.isEnabled = () => rewardedChestStorage.getStoredChestsOfType(ChestType.gold) > 0;

        //ethereal chest
        this.compressorPane.blackChestDisplay = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.width * 0.70,
                y: this.bodyContainer.boundingBox.height * -0.05,
                width: this.bodyContainer.boundingBox.width * 0.30,
                height: this.bodyContainer.boundingBox.height * 0.7
            }, {}, ""
        );
        this.compressorPane.blackChestDisplay.render = function (parentWindow)
        {
            var coords = this.getRelativeCoordinates(0, 0, parentWindow);
            var imageBoundingBox = drawImageFitInBox(
                parentWindow.context,
                blackChestIconClosed,
                coords.x,
                coords.y,
                this.boundingBox.width,
                this.boundingBox.width
            );
            parentWindow.context.save();
            parentWindow.context.font = "24px Verdana";
            parentWindow.context.fillStyle = "#FFFFFF";
            parentWindow.context.textBaseline = "top";
            fillTextWrap(
                parentWindow.context,
                "x " + rewardedChestStorage.getStoredChestsOfType(ChestType.black),
                coords.x,
                imageBoundingBox.y + imageBoundingBox.height,
                this.boundingBox.width,
                "center"
            );
            parentWindow.context.restore();
            this.renderChildren();
        }.bind(this.compressorPane.blackChestDisplay, this);
        this.compressorPane.addHitbox(this.compressorPane.blackChestDisplay);

        this.compressorPane.blackChestButton = this.compressorPane.addHitbox(new Button(
            upgradebg_blank, _("Open Ethereal Chest"), "18px KanitM", "#000000",
            {
                x: this.compressorPane.blackChestDisplay.boundingBox.x,
                y: this.compressorPane.blackChestDisplay.boundingBox.height * 0.72,
                width: this.compressorPane.blackChestDisplay.boundingBox.width,
                height: this.compressorPane.blackChestDisplay.boundingBox.height * 0.15
            },
            {
                onmousedown: function ()
                {
                    rewardedChestStorage.grantStoredChest(ChestType.black);
                }
            }
        ));

    }

    render()
    {
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        super.render();
        this.context.save();

        if(this.currentTabIndex == 0)
        {
            // this.compressorPane.renderChildren();
            this.compressorPane.basicChestButton.image = rewardedChestStorage.getStoredChestsOfType(ChestType.basic) > 0 ? upgradeb : upgradebg_blank;
            this.compressorPane.goldChestButton.image = rewardedChestStorage.getStoredChestsOfType(ChestType.gold) > 0 ? upgradeb : upgradebg_blank;
            this.compressorPane.blackChestButton.image = rewardedChestStorage.getStoredChestsOfType(ChestType.black) > 0 ? upgradeb : upgradebg_blank;
        }

        this.context.restore();
    }
}