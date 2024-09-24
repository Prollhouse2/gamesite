class EventPurchaseWindow extends TabbedPopupWindow
{
    layerName = "EventPurchase"; // Used as key in activeLayers
    domElementId = "PURCHASED"; // ID of dom element that gets shown or hidden
    context = PU;         // Canvas rendering context for popup

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.popupFrameImage = xmasFrame;
        this.backgroundImage = snowBG;

        this.initializeTabs([]);

        this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * .06,
                y: this.boundingBox.height * .56,
                width: this.boundingBox.width * .26,
                height: this.boundingBox.height * .08
            },
            {
                onmousedown: function ()
                {
                    if(worldResources[HOLIDAY_RESOURCE_INDEX].numOwned > 0)
                    {
                        chestService.spawnChest(0, Chest.purchased, ChestType.basic);
                        chestService.presentChest(0);
                        worldResources[HOLIDAY_RESOURCE_INDEX].numOwned--;
                    } else
                    {
                        newNews(_("Not enough candy canes. You need 1 candy cane."));
                    }
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            },
            "pointer"
        ));

        this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * .37,
                y: this.boundingBox.height * .56,
                width: this.boundingBox.width * .26,
                height: this.boundingBox.height * .08
            },
            {
                onmousedown: function ()
                {
                    if(worldResources[HOLIDAY_RESOURCE_INDEX].numOwned > 9)
                    {
                        chestService.spawnChest(0, Chest.purchased, ChestType.gold);
                        chestService.presentChest(0);
                        worldResources[HOLIDAY_RESOURCE_INDEX].numOwned -= 10;
                    }
                    else
                    {
                        newNews(_("Not enough candy canes. You need 10 candy canes. You have {0} candy canes.", worldResources[HOLIDAY_RESOURCE_INDEX].numOwned));
                    }
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            },
            "pointer"
        ));

        this.addHitbox(new Hitbox(
            {
                x: this.boundingBox.width * .67,
                y: this.boundingBox.height * .56,
                width: this.boundingBox.width * .26,
                height: this.boundingBox.height * .08
            },
            {
                onmousedown: function ()
                {
                    if(worldResources[HOLIDAY_RESOURCE_INDEX].numOwned >= 30)
                    {
                        chestService.spawnChest(0, Chest.purchased, ChestType.black);
                        chestService.presentChest(0);
                        worldResources[HOLIDAY_RESOURCE_INDEX].numOwned -= 30;
                    }
                    else
                    {
                        newNews(_("Not enough candy canes. You need 30 candy canes. You have {0} candy canes.", worldResources[HOLIDAY_RESOURCE_INDEX].numOwned));
                    }
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            },
            "pointer"
        ));
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);

        super.render();
        PU.fillStyle = "#FFFFFF";

        this.context.lineWidth = 1;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        PU.drawImage(xmasPurchase1, 0, 0, xmasPurchase1.width, xmasPurchase1.height, this.boundingBox.width * .04, this.boundingBox.height * .2, this.boundingBox.width * .3, this.boundingBox.height * .48);
        drawImageFitInBox(
            this.context,
            basicChestIconClosed,
            this.boundingBox.height * .01,
            this.boundingBox.height * .2,
            this.boundingBox.width * .35,
            this.boundingBox.height * .48,
            "center",
            "left"
        );

        PU.drawImage(xmasPurchase3, 0, 0, xmasPurchase3.width, xmasPurchase3.height, this.boundingBox.width * .345, this.boundingBox.height * .2, this.boundingBox.width * .3, this.boundingBox.height * .48);
        drawImageFitInBox(
            this.context,
            goldChestIconClosed,
            this.boundingBox.width * .315,
            this.boundingBox.height * .2,
            this.boundingBox.width * .35,
            this.boundingBox.height * .48,
            "center",
            "left"
        );

        PU.drawImage(xmasPurchase2, 0, 0, xmasPurchase2.width, xmasPurchase2.height, this.boundingBox.width * .65, this.boundingBox.height * .2, this.boundingBox.width * .3, this.boundingBox.height * .48);
        drawImageFitInBox(
            this.context,
            blackChestIconClosed,
            this.boundingBox.width * .62,
            this.boundingBox.height * .2,
            this.boundingBox.width * .35,
            this.boundingBox.height * .48,
            "center",
            "left"
        );

        PU.font = "24px KanitM";
        PU.fillStyle = "#FFFFFF";
        PU.fillText(_("BUY"), this.boundingBox.width * .05 + (this.boundingBox.width * .3 / 2) - (PU.measureText(_("BUY")).width / 2), this.boundingBox.height * .2 + this.boundingBox.height * .42);
        PU.fillText(_("BUY"), this.boundingBox.width * .345 + (this.boundingBox.width * .3 / 2) - (PU.measureText(_("BUY")).width / 2), this.boundingBox.height * .2 + this.boundingBox.height * .42);
        PU.fillText(_("BUY"), this.boundingBox.width * .65 + (this.boundingBox.width * .3 / 2) - (PU.measureText(_("BUY")).width / 2), this.boundingBox.height * .2 + this.boundingBox.height * .42);
        drawImageFitInBox(
            this.context,
            holidayCurrencyIconHD,
            this.boundingBox.width * .45,
            this.boundingBox.height * .85,
            this.boundingBox.width * .09,
            this.boundingBox.height * .05,
            "center",
            "left"
        );

        PU.fillStyle = "#000000";
        PU.fillText("x" + worldResources[HOLIDAY_RESOURCE_INDEX].numOwned, this.boundingBox.width * .52, this.boundingBox.height * .89);
        this.context.restore();
    }
}