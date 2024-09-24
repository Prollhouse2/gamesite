class TranslationHelpWindow extends TabbedPopupWindow
{
    layerName = "TranslationHelp"; // Used as key in activeLayers
    domElementId = "SETTINGSD"; // ID of dom element that gets shown or hidden
    context = SETTINGS;         // Canvas rendering context for popup

    statsPanelBox;

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        this.initializeTabs({});

        this.statsPanelBox = new Scrollbox(
            this.bodyContainer.boundingBox.width - 15,
            this.bodyContainer.boundingBox.height,
            this.context,
            this.bodyContainer.boundingBox.x,
            this.bodyContainer.boundingBox.y,
            this.bodyContainer.boundingBox.width,
            this.bodyContainer.boundingBox.height - 5,
            15
        );
        this.addHitbox(this.statsPanelBox);
        this.statsPanelBox.setVisible(true)
        this.statsPanelBox.setEnabled(true)
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render(); // Render any child layers
        //Settings
        this.statsPanelBox.context.fillStyle = "#FFFFFF";
        this.statsPanelBox.context.strokeStyle = "#000000";
        this.statsPanelBox.context.lineWidth = 3;
        this.statsPanelBox.context.font = "11px Arial";
        this.statsPanelBox.context.textBaseline = "top";

        this.renderStatsPanel();
    }

    renderStatsPanel()
    {
        this.statsPanelBox.initializeScrollbar();
        var context = this.statsPanelBox.context;
        context.save();
        context.imageSmoothingEnabled = false;
        this.statsPanelBox.clearCanvas();
        this.statsPanelBox.contentHeight = this.statsPanelBox.boundingBox.height * .05 * Object.keys(translations["german"]).length + 1;

        var setupHitboxes = this.statsPanelBox.hitboxes.length <= 1;
        var currentY = 5;
        for(var entry in translations['german'])
        {
            var boundingBox1 = fillTextWrap(context, '"' + entry + '": ', this.statsPanelBox.boundingBox.width * .05, currentY, this.statsPanelBox.boundingBox.width * .45, "left", 0.1);
            var boundingBox2 = fillTextWrap(context, '"' + translations['german'][entry] + '"', this.statsPanelBox.boundingBox.width * .525, currentY, this.statsPanelBox.boundingBox.width * .45, "left", 0.1);
            context.drawImage(darkdot, this.statsPanelBox.boundingBox.width * .02, currentY, 12, 12);
            if(setupHitboxes)
            {
                var newHitbox = new Hitbox(
                    {
                        x: this.statsPanelBox.boundingBox.width * .02,
                        y: currentY,
                        width: 13,
                        height: 13
                    },
                    {
                        onmousedown: function ()
                        {
                            showSimpleInput(
                                _("English:<xmp>" + this.entry + "</xmp>Current Translation:<xmp>" + translations['german'][this.entry] + "</xmp>"),
                                _("Submit Translation Recommendation"),
                                "",
                                function ()
                                {
                                    var recommendation = document.getElementById("simpleInputFieldText").value;
                                    /*ajax(
                                        "https://mrmine.com/game/backend/minernames.php",
                                        {"uid": platform.getUserId(), "name": name},
                                        "POST",
                                        function (response)
                                        {
                                            if(response)
                                            {
                                                response = JSON.parse(response);
                                                if(response.success)
                                                {
                                                    hideSimpleInput();
                                                    var startDepthForMinerNames = 100;
                                                    customMinerDatabaseIndex = response.currentNameCount;
                                                    var minerDepth = startDepthForMinerNames + Math.floor(response.currentNameCount / 10);
                                                    var minerNumber = response.currentNameCount % 10;
                                                    alert(_(
                                                        "Thank you! Your name will be added in the next update. It will be assigned to a miner between 100 and 300km. Soon you will be able to customize your miner too!",
                                                    ));
                                                }
                                                else
                                                {
                                                    alert(_("Sorry, something went wrong. Please try again."));
                                                }
                                            }
                                        }
                                    );*/
                                },
                                "Cancel",
                                12
                            );
                            //make sure to show both the source and existing text and make them type in the new version use <xmp>
                        },
                        onmouseenter: function ()
                        {
                            showTooltip("", "Click to enter a suggestion");
                        },
                        onmouseexit: function ()
                        {
                            hideTooltip();
                        }
                    },
                    'pointer',
                    "entry_" + Math.floor(currentY)
                );
                newHitbox.entry = entry;

                this.statsPanelBox.addHitbox(newHitbox);
            }

            currentY = Math.max(boundingBox1.y1 + boundingBox1.height, boundingBox2.y1 + boundingBox2.height) + 8;
            context.fillRect(this.statsPanelBox.boundingBox.width * .02, currentY - 5, this.statsPanelBox.boundingBox.width * .98, 1);
        }
        this.statsPanelBox.contentHeight = currentY + 10;

        restoreCanvasState(context);
        context.fillStyle = "#000000";
    }
}