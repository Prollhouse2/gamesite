class PinnedBlueprintsManager
{
    isEnabled = false;
    autoPin = true;
    pinnedBlueprints = [];

    update()
    {
        if(!this.isEnabled) return;
        for(var i = 0; i < drillState.equippedDrillEquips.length; i++)
        {
            let currentEquip = getDrillEquipById(drillState.equippedDrillEquips[i]);
            let currentBlueprint = getDrillBlueprintByEquipId(drillState.equippedDrillEquips[i])
            let knownBlueprintsOfType = getBlueprintsAboveDrillEquipLevel(currentEquip.level, i)
                .filter((bp) => isBlueprintKnown(bp.category, bp.id));

            let nextBlueprintForEquip = knownBlueprintsOfType[0];

            //replace a pinned blueprint if it is higher level than a newer one that was discovered or if it is the currently equiped bp
            this.pinnedBlueprints.forEach((bp) =>
            {
                if((nextBlueprintForEquip && bp[0] == nextBlueprintForEquip.category && bp[2] == i))
                {
                    this.removePinnedBlueprint(bp[0], bp[1]);
                }
                else if((currentBlueprint && currentBlueprint.category == bp[0] && currentBlueprint.id == bp[1]))
                {
                    this.removePinnedBlueprint(bp[0], bp[1]);
                }

                if((bp[0] == 1) && !isDrillBlueprintHigherLevelThanEquippedPart(getBlueprintById(bp[0], bp[1])))
                {
                    this.removePinnedBlueprint(bp[0], bp[1]);
                }
            })

            if(nextBlueprintForEquip && this.canAddBlueprint() && this.autoPin)
            {
                this.addPinnedBlueprint(nextBlueprintForEquip.category, nextBlueprintForEquip.id, i);
            }
        }

        for(var i = 0; i <= worldAtDepth(depth).index; i++)
        {
            let miner = getBlueprintById(craftingCategories.miners, i);
            if(miner.craftedItem.item.canCraft())
            {
                if(!this.isBlueprintPinned(craftingCategories.miners, i))
                {
                    this.addPinnedBlueprint(craftingCategories.miners, i);
                }
            }
            else
            {
                this.removePinnedBlueprint(craftingCategories.miners, i);
            }

            if(miner.craftedItem.item.isAtMaxLevel())
            {
                let minerLevel = getBlueprintById(craftingCategories.minerLevels, i);
                if(minerLevel.craftedItem.item.canCraft())
                {
                    if(!this.isBlueprintPinned(craftingCategories.minerLevels, i))
                    {
                        this.addPinnedBlueprint(craftingCategories.minerLevels, i);
                    }
                }
                else
                {
                    this.removePinnedBlueprint(craftingCategories.minerLevels, i);
                }
            }
        }
    }

    canAddBlueprint()
    {
        return true;
    }

    addPinnedBlueprint(category, id, type = null)
    {
        if(this.isBlueprintPinned(category, id))
        {
            this.removePinnedBlueprint(category, id);
        }
        else if(this.canAddBlueprint())
        {
            this.pinnedBlueprints.push([category, id, type]);
            this.sort()
        }
        activeLayers.PinnedBlueprintsLayer.initializeBlueprints();
    }

    isBlueprintPinned(category, id)
    {
        return this.pinnedBlueprints.filter((bps) => bps[0] == category && bps[1] == id).length > 0;
    }

    removePinnedBlueprint(category, id)
    {
        for(let i = 0; i < this.pinnedBlueprints.length; i++)
        {
            if(this.pinnedBlueprints[i][0] == category && this.pinnedBlueprints[i][1] == id)
            {
                this.pinnedBlueprints.splice(i, 1);
                break;
            }
        }

        activeLayers.PinnedBlueprintsLayer.initializeBlueprints();
    }

    sort()
    {
        this.pinnedBlueprints.sort((a, b) =>
        {
            let bps = [
                {
                    bp: getBlueprintById(a[0], a[1]),
                    cost: new BigNumber(0),
                    canCraft: false
                },
                {
                    bp: getBlueprintById(b[0], b[1]),
                    cost: new BigNumber(0),
                    canCraft: false
                }
            ];

            bps.forEach(bp =>
            {
                if(bp.bp.hasOwnProperty("levels"))
                {
                    var currentLevel = bp.bp.craftedItem.item.getCurrentLevel();
                    if(!bp.bp.craftedItem.item.isAtMaxLevel())
                    {
                        let ingredients = bp.bp.levels[currentLevel].ingredients;
                        let isMiner = bp.bp.category == 9 || bp.bp.category == 10;

                        bp.cost = getRealBlueprintCost(getIngredientListWithDiscounts(ingredients, isMiner));
                        bp.canCraft = canCraftBlueprint(bp.bp.category, bp.bp.id, 0, ingredients);

                    }
                }
                else
                {
                    bp.canCraft = canCraftBlueprint(bp.bp.category, bp.bp.id, 0, bp.bp.ingredients);
                    bp.cost = getRealBlueprintCost(getIngredientListWithDiscounts(bp.bp.ingredients));
                }
            })

            //sort doesn't typically work with BigNumbers. We do this to return a value that does work.
            let value = 0;

            if(bps[0].cost.lessThan(bps[1].cost))
            {
                value = -1;
            }
            else if(bps[0].cost.greaterThan(bps[1].cost))
            {
                value = 1;
            }

            if((bps[0].canCraft > bps[1].canCraft))
            {
                value = -1;
            }
            else if((bps[0].canCraft < bps[1].canCraft))
            {
                value = 1;
            }

            return value;
        })
    }

}

var pinnedBlueprintsManager = new PinnedBlueprintsManager();
