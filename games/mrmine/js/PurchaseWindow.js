class PurchaseWindow extends TabbedPopupWindow
{
    layerName = "Purchase"; // Used as key in activeLayers
    domElementId = "PURCHASED"; // ID of dom element that gets shown or hidden
    context = PU;         // Canvas rendering context for popup

    buyTabIndex = 0;
    useTabIndex = 1;

    buyButtons = [];
    useButtons = [];

    viewedPurchaseTab = false;

    constructor(boundingBox, worldIndex = 0, tabIndex = 0)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.setFrameImagesByWorldIndex(worldIndex)

        this.currentTabIndex = tabIndex;

        var fontToUse = "14px Verdana"
        if(language == "french") {fontToUse = "12px Verdana";}


        if(purchaseWindowTabOrder == 1)
        {
            this.initializeTabs([_("Use Tickets"), _("Get Tickets")]);
            this.useTabIndex = 0;
            this.buyTabIndex = 1;
        }
        else
        {
            this.initializeTabs([_("Get Tickets"), _("Use Tickets")]);
        }

        this.shopBG = new Hitbox(
            {
                x: this.bodyContainer.boundingBox.width * .07,
                y: this.bodyContainer.boundingBox.height * .1,
                width: this.bodyContainer.boundingBox.width * .25,
                height: this.bodyContainer.boundingBox.height * .35
            },
            {}
        );
        this.shopBG.render = function (parentWindow)
        {
            renderRoundedRectangle(
                parentWindow.context,
                this.parent.bodyContainer.boundingBox.x + (this.parent.bodyContainer.boundingBox.width * .025),
                this.parent.bodyContainer.boundingBox.y + (this.parent.bodyContainer.boundingBox.height * .05),
                this.parent.bodyContainer.boundingBox.width * .95,
                this.parent.bodyContainer.boundingBox.height * .82,
                10,
                "rgba(0, 0, 0, 0.5)",
                "rgba(0, 0, 0, 0.5)",
                0
            )
        }.bind(this.shopBG, this);
        this.addHitbox(this.shopBG);

        this.shopScollBox = new Scrollbox(
            this.bodyContainer.boundingBox.width - 15,
            this.bodyContainer.boundingBox.height * .9 + (purchasedh * .15 * Math.max(0, shopManager.getAvailableShopItems().length - 3)),
            this.context,
            this.bodyContainer.boundingBox.x + (this.bodyContainer.boundingBox.width * .05),
            this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .05),
            this.bodyContainer.boundingBox.width * .9,
            this.bodyContainer.boundingBox.height * .82,
            15
        );
        this.shopScollBox.shopItems = [];
        this.addHitbox(this.shopScollBox);
        this.shopScollBox.setVisible(true);
        this.shopScollBox.setEnabled(true);

        if(shopVariantId == 0)
        {
            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 1.6,
                    y: ticketImage1.height * 1.6,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(1);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton1"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 0.5,
                    y: ticketImage1.height * 1.6,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(2);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton2"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 + ticketImage1.width * 0.6,
                    y: ticketImage1.height * 1.6,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(3);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton3"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 1.6,
                    y: ticketImage1.height * 3.1,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(4);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                'pointer',
                "buyButton4"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 - ticketImage1.width * 0.5,
                    y: ticketImage1.height * 3.1,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(5);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        showTooltip(_("Buying this ticket pack also grants you the ability to name one of the miners in the game for all Mr.Mine players to see!<br><br>(Added to next update)"), "", mouseX, mouseY);
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                'pointer',
                "buyButton5"
            )));

            this.buyButtons.push(this.addHitbox(new Button(
                upgradeb, _("BUY"), fontToUse, "#000000",
                {
                    x: this.boundingBox.width * 0.5 + ticketImage1.width * 0.6,
                    y: ticketImage1.height * 3.1,
                    width: ticketImage1.width,
                    height: 18
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(6);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        showTooltip(_("Buying this ticket pack also grants you the ability to name one of the miners in the game for all Mr.Mine players to see!<br><br>(Added to next update)"), "", mouseX, mouseY);
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                'pointer',
                "buyButton6"
            )));
        }
        else
        {
            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .07,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(1);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton1"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .39,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(2);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton2"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .71,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(3);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton3"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .07,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(4);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    }
                },
                "pointer",
                "newBuyButton4"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .36,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(5);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        showTooltip(_("Buying this ticket pack also grants you the ability to name one of the miners in the game for all Mr.Mine players to see!<br><br>(Added to next update)"), "", this.parent.boundingBox.x + (this.parent.boundingBox.width * .62), this.parent.boundingBox.y + (this.parent.boundingBox.height * .48));
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer",
                "newBuyButton5"
            )));

            this.buyButtons.push(this.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .65,
                    y: this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                    width: this.bodyContainer.boundingBox.width * .3,
                    height: this.bodyContainer.boundingBox.height * .41
                },
                {
                    onmousedown: function ()
                    {
                        platform.buyPack(6);
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        showTooltip(_("Buying this ticket pack also grants you the ability to name one of the miners in the game for all Mr.Mine players to see!<br><br>(Added to next update)"), "", this.parent.boundingBox.x + (this.parent.boundingBox.width * .91), this.parent.boundingBox.y + (this.parent.boundingBox.height * .48));
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer",
                "newBuyButton6"
            )));
        }

        this.useButtons.push(this.addHitbox(new Button(
            craftb, _("REDEEM"), fontToUse, "#000000",
            {
                x: purchasedw * .75,
                y: purchasedh * .85,
                width: purchasedw * .20,
                height: purchasedh * .04
            },
            {
                onmousedown: function ()
                {
                    showRedeemPrompt();
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            },
            "pointer"
        )));
        this.useButtons[0].isVisible = () => this.currentTabIndex == this.useTabIndex;
        this.useButtons[0].isEnabled = () => this.currentTabIndex == this.useTabIndex;
        this.shopBG.isVisible = () => this.currentTabIndex == this.useTabIndex;
        this.shopScollBox.isVisible = () => this.currentTabIndex == this.useTabIndex;
        this.shopScollBox.isEnabled = () => this.currentTabIndex == this.useTabIndex;

        for(var i in this.buyButtons)
        {
            this.buyButtons[i].isVisible = () => this.currentTabIndex == this.buyTabIndex;
            this.buyButtons[i].isEnabled = () => this.currentTabIndex == this.buyTabIndex;
        }
        this.onTabChange();

        this.initializeShopMenu();

        trackEvent_logPurchaseWindowOpen();
    }

    initializeShopMenu()
    {
        this.shopScollBox.clearHitboxes();

        this.availableShopItems = shopManager.getAvailableShopItems();
        this.availableShopItems.forEach((item, i) => 
        {
            let column = i % 3;
            let row = Math.floor(i / 3);

            this.shopScollBox.shopItems.push(this.shopScollBox.addHitbox(new Hitbox(
                {
                    x: this.bodyContainer.boundingBox.width * .02 + (this.bodyContainer.boundingBox.width * .31 * column),
                    y: this.bodyContainer.boundingBox.height * .01 + (this.bodyContainer.boundingBox.height * .52 * row),
                    width: this.bodyContainer.boundingBox.width * .31,
                    height: this.bodyContainer.boundingBox.height * .5
                },
                {
                    onmousedown: function ()
                    {
                        hideTooltip();
                        if(item.isPurchaseable())
                        {
                            showConfirmationPrompt(
                                _("Spend {0} tickets to purchase {1}?", item.getCost(), item.name),
                                _("Yes"),
                                () =>
                                {
                                    item.onPurchase();
                                },
                                _("Cancel")
                            );
                        }
                        else if(tickets < item.getCost())
                        {
                            showConfirmationPrompt(
                                _("Not enough tickets. You need {0} tickets.", item.getCost()),
                                _("BUY TICKETS"),
                                () =>
                                {
                                    openUi(PurchaseWindow, null, 0, purchaseWindowTabOrder);
                                },
                                _("Cancel")
                            );
                        }
                    },
                    onmouseenter: () =>
                    {
                        item.tooltip(mouseX, mouseY)
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "pointer"
            )));
        })
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        super.render();
        PU.fillStyle = "#FFFFFF";
        var fontToUse = "14px Verdana"
        if(language == "french") {fontToUse = "12px Verdana";}
        if(this.currentTabIndex == this.buyTabIndex)
        {
            if(!this.viewedPurchaseTab)
            {
                this.viewedPurchaseTab = true;
                trackEvent_ViewedPurchaseWindow();
            }
            if(true || getBuildTarget() == STEAM_BUILD || platform.domain == "armorgames")
            {
                this.context.drawImage(v5Tix10, this.bodyContainer.boundingBox.width * .07, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix55, this.bodyContainer.boundingBox.width * .39, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix120, this.bodyContainer.boundingBox.width * .71, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .02), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix250, this.bodyContainer.boundingBox.width * .07, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix650, this.bodyContainer.boundingBox.width * .39, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);
                this.context.drawImage(v5Tix1400, this.bodyContainer.boundingBox.width * .71, this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46), this.bodyContainer.boundingBox.width * .3, this.bodyContainer.boundingBox.height * .41);

                this.context.fillStyle = "#FFF";
                this.context.strokeStyle = "#000";
                this.context.font = "22px Matiz";
                this.context.lineWidth = 4;

                this.context.fillStyle = "#FFF";
                this.context.shadowColor = "black";
                this.context.shadowOffsetX = 1;
                this.context.shadowOffsetY = 4;
                strokeTextShrinkToFit(this.context, "$1.00", this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, "$1.00", this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, "$5.00", this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, "$5.00", this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, "$10.00", this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, "$10.00", this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .38, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, "$20.00", this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, "$20.00", this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, "$50.00", this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, "$50.00", this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, "$100.00", this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, "$100.00", this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .82, this.bodyContainer.boundingBox.width * .24, "center", 0);

                this.context.lineWidth = 3;
                this.context.shadowOffsetX = 0;
                this.context.shadowOffsetY = 1;
                this.context.font = "14px Verdana";
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 10), this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 10), this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 55), this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 55), this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 120), this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 120), this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .07, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 250), this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 250), this.bodyContainer.boundingBox.width * .10, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 650), this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 650), this.bodyContainer.boundingBox.width * .42, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                strokeTextShrinkToFit(this.context, _("Pack of {0} tickets", 1400), this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);
                fillTextShrinkToFit(this.context, _("Pack of {0} tickets", 1400), this.bodyContainer.boundingBox.width * .74, this.bodyContainer.boundingBox.y + this.bodyContainer.boundingBox.height * .51, this.bodyContainer.boundingBox.width * .24, "center", 0);

                if(showShopBadges)
                {
                    this.context.font = "18px Matiz";
                    drawImageFitInBox(this.context,
                        salesStar,
                        this.bodyContainer.boundingBox.width * .62,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .09),
                        this.bodyContainer.boundingBox.width * .1,
                        this.bodyContainer.boundingBox.height * .1
                    )

                    strokeTextShrinkToFit(this.context,
                        "+10%",
                        this.bodyContainer.boundingBox.width * .64,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .14),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );
                    fillTextShrinkToFit(this.context,
                        "+10%",
                        this.bodyContainer.boundingBox.width * .64,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .14),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );


                    drawImageFitInBox(this.context,
                        salesStar,
                        this.bodyContainer.boundingBox.width * .94,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .09),
                        this.bodyContainer.boundingBox.width * .1,
                        this.bodyContainer.boundingBox.height * .1
                    )

                    strokeTextShrinkToFit(this.context,
                        "+20%",
                        this.bodyContainer.boundingBox.width * .96,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .14),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );
                    fillTextShrinkToFit(this.context,
                        "+20%",
                        this.bodyContainer.boundingBox.width * .96,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .14),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );

                    drawImageFitInBox(this.context,
                        salesStar,
                        this.bodyContainer.boundingBox.width * .3,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .53),
                        this.bodyContainer.boundingBox.width * .1,
                        this.bodyContainer.boundingBox.height * .1
                    )

                    strokeTextShrinkToFit(this.context,
                        "+25%",
                        this.bodyContainer.boundingBox.width * .32,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .58),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );
                    fillTextShrinkToFit(this.context,
                        "+25%",
                        this.bodyContainer.boundingBox.width * .32,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .58),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );

                    drawImageFitInBox(this.context,
                        salesStar,
                        this.bodyContainer.boundingBox.width * .62,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .53),
                        this.bodyContainer.boundingBox.width * .1,
                        this.bodyContainer.boundingBox.height * .1
                    )

                    strokeTextShrinkToFit(this.context,
                        "+30%",
                        this.bodyContainer.boundingBox.width * .64,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .58),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );
                    fillTextShrinkToFit(this.context,
                        "+30%",
                        this.bodyContainer.boundingBox.width * .64,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .58),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );

                    drawImageFitInBox(this.context,
                        salesStar,
                        this.bodyContainer.boundingBox.width * .94,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .53),
                        this.bodyContainer.boundingBox.width * .1,
                        this.bodyContainer.boundingBox.height * .1
                    )

                    strokeTextShrinkToFit(this.context,
                        "+40%",
                        this.bodyContainer.boundingBox.width * .96,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .58),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );
                    fillTextShrinkToFit(this.context,
                        "+40%",
                        this.bodyContainer.boundingBox.width * .96,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .58),
                        this.bodyContainer.boundingBox.width * .06,
                        "center",
                        0
                    );
                }

                if(showShopPurchaseHeaders)
                {
                    drawImageFitInBox(this.context,
                        salesBanner,
                        this.bodyContainer.boundingBox.width * .095,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .4),
                        this.bodyContainer.boundingBox.width * .25,
                        this.bodyContainer.boundingBox.height * .1
                    )

                    drawImageFitInBox(this.context,
                        salesBanner,
                        this.bodyContainer.boundingBox.width * .735,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .4),
                        this.bodyContainer.boundingBox.width * .25,
                        this.bodyContainer.boundingBox.height * .1
                    )

                    strokeTextShrinkToFit(this.context,
                        _("Most Popular"),
                        this.bodyContainer.boundingBox.width * .115,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                        this.bodyContainer.boundingBox.width * .2,
                        "center",
                        0
                    );
                    fillTextShrinkToFit(this.context,
                        _("Most Popular"),
                        this.bodyContainer.boundingBox.width * .115,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                        this.bodyContainer.boundingBox.width * .2,
                        "center",
                        0
                    );

                    strokeTextShrinkToFit(this.context,
                        _("Best Value"),
                        this.bodyContainer.boundingBox.width * .755,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                        this.bodyContainer.boundingBox.width * .2,
                        "center",
                        0
                    );
                    fillTextShrinkToFit(this.context,
                        _("Best Value"),
                        this.bodyContainer.boundingBox.width * .755,
                        this.bodyContainer.boundingBox.y + (this.bodyContainer.boundingBox.height * .46),
                        this.bodyContainer.boundingBox.width * .2,
                        "center",
                        0
                    );
                }

            }
            this.context.lineWidth = 1;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;


        }
        if(this.currentTabIndex == this.useTabIndex)
        {
            this.shopScollBox.context.clearRect(0, 0, this.shopScollBox.contentWidth, this.shopScollBox.contentHeight);
            this.availableShopItems.forEach((shopItem, i) => 
            {
                let hitbox = this.shopScollBox.shopItems[i];
                let xScale = this.bodyContainer.boundingBox.width / this.shopScollBox.boundingBox.width;
                let scale = (2 - this.shopScollBox.scale);

                this.shopScollBox.context.drawImage(
                    shopItemFrame,
                    hitbox.boundingBox.x * xScale,
                    hitbox.boundingBox.y * scale,
                    hitbox.boundingBox.width * scale,
                    hitbox.boundingBox.height * scale
                );

                renderRoundedRectangle(
                    this.shopScollBox.context,
                    (hitbox.boundingBox.x + (hitbox.boundingBox.width * .1)) * xScale,
                    (hitbox.boundingBox.y + (hitbox.boundingBox.height * .15)) * scale,
                    hitbox.boundingBox.width * scale * .8,
                    hitbox.boundingBox.height * scale * .44,
                    10,
                    "rgba(0, 0, 0, 0.5)",
                    "rgba(0, 0, 0, 0.5)",
                    0
                )

                drawImageFitInBox(
                    this.shopScollBox.context,
                    shopItem.image,
                    hitbox.boundingBox.x * xScale,
                    (hitbox.boundingBox.y + (hitbox.boundingBox.height * .15)) * scale,
                    hitbox.boundingBox.width * scale,
                    hitbox.boundingBox.height * scale * .43,
                )

                if(shopItem.maxQuantity)
                {
                    for(var i = 0; i < shopItem.maxQuantity; i++)
                    {

                        let fillColor = i < shopItem.getCurrentQuantity() || shopItem.isMaxedOut() ? "#F7BD00" : "#dedede";

                        drawCircle(
                            this.shopScollBox.context,
                            (hitbox.boundingBox.x + (hitbox.boundingBox.width * .15) + (hitbox.boundingBox.width * .07 * i)) * xScale,
                            (hitbox.boundingBox.y + (hitbox.boundingBox.height * .2)) * scale,
                            hitbox.boundingBox.height * .02 * scale,
                            fillColor,
                            "#000000",
                            2
                        );
                    }
                }

                this.shopScollBox.context.save();
                this.shopScollBox.context.font = (hitbox.boundingBox.height * .1) + "px Verdana";
                this.shopScollBox.context.fillStyle = "#FFFFFF";

                fillTextShrinkToFit(
                    this.shopScollBox.context,
                    shopItem.name,
                    (hitbox.boundingBox.x + (hitbox.boundingBox.height * .05)) * xScale,
                    (hitbox.boundingBox.y + (hitbox.boundingBox.height * .115)) * scale,
                    hitbox.boundingBox.width * .9 * scale,
                    "center"
                )

                if(!shopItem.isMaxedOut())
                {

                    drawImageFitInBox(
                        this.shopScollBox.context,
                        smallShopTicketGold,
                        (hitbox.boundingBox.x + (hitbox.boundingBox.width * .22)) * xScale,
                        (hitbox.boundingBox.y + (hitbox.boundingBox.height * .62)) * scale,
                        hitbox.boundingBox.width * .75 * scale,
                        hitbox.boundingBox.height * .1 * scale,
                        "left"
                    )

                    this.shopScollBox.context.fillStyle = "#F8E460";
                    fillTextShrinkToFit(
                        this.shopScollBox.context,
                        "x" + shopItem.getCost(),
                        (hitbox.boundingBox.x + (hitbox.boundingBox.width * .52)) * xScale,
                        (hitbox.boundingBox.y + (hitbox.boundingBox.height * .7)) * scale,
                        hitbox.boundingBox.width * .7 * scale,
                    )
                }

                this.shopScollBox.context.font = (hitbox.boundingBox.height * .17) + "px KanitM";
                this.shopScollBox.context.fillStyle = "#1798c7";
                let buttonText = shopItem.isMaxedOut() ? _("MAX LEVEL") : _("BUY");
                fillTextShrinkToFit(
                    this.shopScollBox.context,
                    buttonText,
                    (hitbox.boundingBox.x + (hitbox.boundingBox.width * .125)) * xScale,
                    (hitbox.boundingBox.y + (hitbox.boundingBox.height * .905)) * scale,
                    hitbox.boundingBox.width * .75 * scale,
                    "center"
                )

                this.shopScollBox.context.restore();
            })

        }
        this.context.restore();


        PU.fillStyle = "#FFF";
        PU.font = "24px KanitM";
        PU.drawImage(smallShopTicket, 0, 0, smallShopTicket.width, smallShopTicket.height, purchasedw * .4, purchasedh * .85, purchasedw * .09, purchasedh * .05);
        PU.fillText("x" + tickets, purchasedw * .5, purchasedh * .89);
    }
}