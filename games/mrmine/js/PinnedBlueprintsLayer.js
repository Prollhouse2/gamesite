class PinnedBlueprintsLayer extends UiLayer
{
    layerName = "PinnedBlueprintsLayer";
    context = MAIN;
    zIndex = 3;

    constructor(boundingBox, domElement)
    {
        super(boundingBox, domElement);
        if(this.context)
        {
            this.context.canvas.style.x = boundingBox.x;
            this.context.canvas.style.y = boundingBox.y;
            this.context.canvas.style.width = boundingBox.width;
            this.context.canvas.style.height = boundingBox.height;
        }

        this.setBoundingBox();
    }

    setBoundingBox()
    {
        this.boundingBox = this.context.canvas.getBoundingClientRect();
        this.boundingBox.x /= uiScaleX;
        this.boundingBox.y /= uiScaleY;
        this.boundingBox.width /= uiScaleX;
        this.boundingBox.height /= uiScaleY;
        this.initializeBlueprints();
    }

    initializeBlueprints()
    {
        this.clearHitboxes();
        this.pinnedBlueprintContainer = new Hitbox(
            {
                x: Math.ceil((this.boundingBox.width) * .81),
                y: Math.ceil((this.boundingBox.height) * .12),
                width: Math.ceil((this.boundingBox.width) * .12),
                height: 0,
            },
            {
            },
            "",
            "pinnedBlueprintContainer"
        );
        this.pinnedBlueprintContainer.render = function ()
        {
            if(Math.min(4, pinnedBlueprintsManager.pinnedBlueprints.length) > 0)
            {
                this.parent.context.save();
                renderRoundedRectangle(
                    this.parent.context,
                    this.boundingBox.x * uiScaleX,
                    this.boundingBox.y * uiScaleY,
                    this.boundingBox.width * uiScaleX,
                    this.boundingBox.height * uiScaleY,
                    0,
                    "#bebebe",
                    "#000000",
                )
                this.parent.context.font = this.parent.boundingBox.height * .1 + "px Verdana";
                this.parent.context.fillStyle = "#FFFFFF";
                fillTextShrinkToFit(
                    this.parent.context,
                    _("Pinned Blueprints"),
                    (this.boundingBox.x + (this.boundingBox.width * .05)) * uiScaleX,
                    (this.boundingBox.y + (this.parent.boundingBox.height * 0.024)) * uiScaleY,
                    (this.boundingBox.width * .9) * uiScaleX,
                    "center"
                );

                this.parent.context.fillRect(
                    (this.boundingBox.x + (this.boundingBox.width * 0.05)) * uiScaleX,
                    (this.boundingBox.y + (this.parent.boundingBox.height * 0.03)) * uiScaleY,
                    (this.boundingBox.width * .9) * uiScaleX,
                    (this.boundingBox.height * 0.005) * uiScaleY
                )
                this.parent.context.restore();

                this.renderChildren();
            }
        }.bind(this.pinnedBlueprintContainer, this);
        this.addHitbox(this.pinnedBlueprintContainer);

        this.pinnedBlueprintContainer.clearHitboxes();
        let bpSlotHeight = this.boundingBox.width * .035;
        let paddingX = this.pinnedBlueprintContainer.boundingBox.width * 0.02;
        let maxHeight = Math.min(4, pinnedBlueprintsManager.pinnedBlueprints.length);
        this.pinnedBlueprintContainer.boundingBox.height = Math.ceil(this.boundingBox.height * .055) + ((bpSlotHeight * 1.05) * maxHeight);

        for(var i = 0; i < maxHeight; i++)
        {
            var pinnedBlueprint = new Hitbox(
                {
                    x: this.pinnedBlueprintContainer.boundingBox.width * 0.02,
                    y: ((bpSlotHeight * 1.05) * i) + bpSlotHeight * .75,
                    width: this.pinnedBlueprintContainer.boundingBox.width - (paddingX * 2),
                    height: bpSlotHeight,
                },
                {
                    onmousedown: function (index)
                    {
                        console.log(pinnedBlueprintsManager.pinnedBlueprints[index]);
                        if(pinnedBlueprintsManager.pinnedBlueprints[index][0] !== 9 && pinnedBlueprintsManager.pinnedBlueprints[index][0] !== 10)
                        {
                            let tab = pinnedBlueprintsManager.pinnedBlueprints[index][0] == 1 ? 0 : 1;
                            let bp = getBlueprintById(pinnedBlueprintsManager.pinnedBlueprints[index][0], pinnedBlueprintsManager.pinnedBlueprints[index][1]);
                            var craftingWindow = openUi(CraftingWindow, null, worldBeingViewed().index, tab);
                            if(craftingWindow)
                            {
                                craftingWindow.openTab(tab);
                                craftingWindow.selectedBlueprint = bp;

                                if(bp.hasOwnProperty("levels"))
                                {
                                    var currentLevel = bp.craftedItem.item.getCurrentLevel();
                                    if(!bp.craftedItem.item.isAtMaxLevel())
                                    {
                                        craftingWindow.discountedIngredients = getIngredientListWithDiscounts(bp.levels[currentLevel].ingredients);
                                    }
                                    else
                                    {
                                        craftingWindow.discountedIngredients = null;
                                    }
                                }
                                else
                                {
                                    craftingWindow.discountedIngredients = getIngredientListWithDiscounts(bp.ingredients);
                                }
                                craftingWindow.initializeCraftingPane();
                            }
                        }
                        else
                        {
                            openUi(HireWindow, null, pinnedBlueprintsManager.pinnedBlueprints[index][1]);
                        }
                    }.bind(this, i)
                },
                "pointer"
            );
            pinnedBlueprint.render = function (parent, bp, index)
            {

                parent.context.save();
                var coords = this.getRelativeCoordinates(0, 0, parent);
                let slotBgHeight = this.boundingBox.height * .9;

                parent.context.fillStyle = "#bebebe80";
                parent.context.fillRect(coords.x * uiScaleX, coords.y * uiScaleY, this.boundingBox.width * uiScaleX, slotBgHeight * uiScaleY);


                drawImageFitInBox(parent.context,
                    bp.craftedItem.item.getIcon(bp.craftedItem.item.getCurrentLevel() + 1),
                    (coords.x + (this.boundingBox.width * .025)) * uiScaleX,
                    (coords.y + (slotBgHeight * .05)) * uiScaleY,
                    (slotBgHeight * .9) * uiScaleY,
                    (this.boundingBox.width) * uiScaleX,
                    "center",
                    "left"
                );

                var craftingItems;
                if(bp.hasOwnProperty("levels"))
                {
                    var currentLevel = bp.craftedItem.item.getCurrentLevel();
                    if(!bp.craftedItem.item.isAtMaxLevel())
                    {
                        craftingItems = getIngredientListWithDiscounts(bp.levels[currentLevel].ingredients);
                    }
                    else
                    {
                        craftingItems = 0;
                    }
                }
                else
                {
                    craftingItems = getIngredientListWithDiscounts(bp.ingredients);
                }


                if(canCraftBlueprint(bp.category, bp.id, 0, craftingItems))
                {
                    parent.context.globalAlpha = 0.6 - (0.4 * oscillate(currentTime(), 350));
                    parent.context.fillStyle = "#bebebe";
                    parent.context.fillRect(coords.x * uiScaleX, coords.y * uiScaleY, this.boundingBox.width * uiScaleX, this.boundingBox.height * uiScaleY);
                    parent.context.globalAlpha = 1;
                }

                let percentages = [];
                for(var i = 0; i < craftingItems.length; i++)
                {
                    var item = craftingItems[i].item;
                    percentages[i] = craftingItems[i].item.percentageOfQuantity(craftingItems[i].quantity);
                    var xOffset = this.boundingBox.width * .24 + (i * this.boundingBox.width * .15);

                    drawImageFitInBox(
                        parent.context,
                        item.getIcon(),
                        (coords.x + xOffset) * uiScaleX,
                        (coords.y + (slotBgHeight * .175)) * uiScaleY,
                        (slotBgHeight * .6) * uiScaleY,
                        (this.boundingBox.width) * uiScaleX,
                        "center",
                        "left"
                    );

                    if(craftingItems[i].item.hasQuantity(craftingItems[i].quantity))
                    {
                        renderCheckmark(
                            parent.context,
                            (coords.x + (this.boundingBox.width * .085) + xOffset) * uiScaleX,
                            (coords.y + (slotBgHeight * .55)) * uiScaleY,
                            (this.boundingBox.width * .05) * uiScaleY,
                            (this.boundingBox.width * .05) * uiScaleX
                        );
                    }
                    else
                    {
                        renderXMark(
                            parent.context,
                            (coords.x + (this.boundingBox.width * .085) + xOffset) * uiScaleX,
                            (coords.y + (slotBgHeight * .55)) * uiScaleY,
                            (this.boundingBox.width * .05) * uiScaleY,
                            (this.boundingBox.width * .05) * uiScaleX
                        );
                    }
                }
                let percentCompleted = calculateAverageOfArray(percentages);

                parent.context.fillStyle = "#cccccc";
                parent.context.fillRect(
                    (coords.x + (this.boundingBox.width * .01)) * uiScaleX,
                    (coords.y + (this.boundingBox.height * .925)) * uiScaleY,
                    ((this.boundingBox.width * .98) * percentCompleted) * uiScaleX,
                    (this.boundingBox.height * .05) * uiScaleY);


                parent.context.restore();

            }.bind(pinnedBlueprint, this, getBlueprintById(pinnedBlueprintsManager.pinnedBlueprints[i][0], pinnedBlueprintsManager.pinnedBlueprints[i][1]), i)
            this.pinnedBlueprintContainer.addHitbox(pinnedBlueprint);
        }

    }

}