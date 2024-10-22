class ScientistsWindow extends TabbedPopupWindow
{
    layerName = "Arch"; // Used as key in activeLayers
    domElementId = "ARCHD"; // ID of dom element that gets shown or hidden
    context = ARCH;         // Canvas rendering context for popup

    scientistsPane;
    relicsPane;

    buttonHitboxes;

    constructor(boundingBox)
    {
        super(boundingBox); // Need to call base class constructor
        if(!boundingBox)
        {
            this.setBoundingBox();
        }

        var tabCategories = {
            0: _("Scientist 1"),
            1: _("Scientist 2"),
            2: _("Scientist 3"),
            3: _("Relics")
        }

        this.initializeTabs(Object.values(tabCategories));
        this.backgroundImage = scientistbg;

        this.scientistsPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "scientistPane"
        );
        this.scientistsPane.allowBubbling = true;
        this.addHitbox(this.scientistsPane);

        this.relicsPane = new Hitbox(
            {
                x: 0,
                y: 0,
                width: this.boundingBox.width,
                height: this.boundingBox.height
            },
            {},
            "",
            "relicsPane"
        );
        this.relicsPane.allowBubbling = true;
        this.addHitbox(this.relicsPane);

        this.onTabChange();
    }

    onTabChange()
    {
        if(this.currentTabIndex < 3)
        {
            this.relicsPane.setVisible(false)
            this.relicsPane.setEnabled(false)
            this.scientistsPane.setVisible(true)
            this.scientistsPane.setEnabled(true)

            this.initializeScientistHitboxes();
        }
        else
        {
            this.relicsPane.setVisible(true)
            this.relicsPane.setEnabled(true)
            this.scientistsPane.setVisible(false)
            this.scientistsPane.setEnabled(false)

            this.relicsPane.clearHitboxes();
            this.initializeRelicsHitboxes();
        }
    }

    initializeScientistHitboxes()
    {
        var scientistIndex = this.currentTabIndex;
        var activeScientist = activeScientists[scientistIndex];
        this.scientistsPane.clearHitboxes();

        if(activeScientist.length == 0)
        {
            //No hitboxes
            return;
        }
        else
        {
            var buryAndCollectButton = new Hitbox(
                {
                    x: this.boundingBox.width * .4,
                    y: this.boundingBox.height * .79,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isScientistDead(scientistIndex))
                            {
                                onClickBuryScientist(scientistIndex);
                            }
                            else if(isExcavationDone(scientistIndex))
                            {
                                onClickClaimExcavationReward(scientistIndex);
                            }
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isScientistDead(scientistIndex) || isExcavationDone(scientistIndex))
                            {
                                this.cursor = 'pointer';
                            }
                        }
                    }
                },
                "default",
                "buryAndCollectButton"
            );
            this.scientistsPane.addHitbox(buryAndCollectButton);

            var forfeitButton = new Hitbox(
                {
                    x: this.boundingBox.width * .4,
                    y: this.boundingBox.height * .86,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isExcavationDone(scientistIndex) && !isScientistDead(scientistIndex))
                            {
                                confirmForfeitExcavation(scientistIndex);
                            }
                            else if(isScientistDead(scientistIndex))
                            {
                                onClickResurrect(scientistIndex);
                            }
                        }
                        else
                        {
                            confirmRerollExcavations(scientistIndex);
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(isOnActiveExcavation(scientistIndex))
                        {
                            if(isExcavationDone(scientistIndex) && !isScientistDead(scientistIndex))
                            {
                                showTooltip(_("Forfeit Reward"), _("Forfeit your reward if you cannot claim it or do not want to claim it."));
                                this.cursor = 'pointer';
                            }
                            else if(isScientistDead(scientistIndex))
                            {
                                showTooltip(_("Resurrect Scientist"), _("Resurrect {0} for {1} tickets", scientists[activeScientists[scientistIndex][0]].name, getCostToResurrect(scientistIndex)));
                                this.cursor = 'pointer';
                            }
                        }
                        else
                        {
                            showTooltip(_("Refresh Excavations"), _("Pay 1 ticket to get two new excavation options"));
                            this.cursor = 'pointer';
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "forfeitButton"
            );
            this.scientistsPane.addHitbox(forfeitButton);

            var leftStartButton = new Hitbox(
                {
                    x: this.boundingBox.width * .15,
                    y: this.boundingBox.height * .78,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex) && !isScientistDead(scientistIndex))
                        {
                            startExcavation(scientistIndex, 0);
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex) && !isScientistDead(scientistIndex))
                        {
                            this.cursor = 'pointer';
                        }
                    }
                },
                "default",
                "leftStartButton"
            );
            this.scientistsPane.addHitbox(leftStartButton);

            var rightStartButton = new Hitbox(
                {
                    x: this.boundingBox.width * .65,
                    y: this.boundingBox.height * .78,
                    width: this.boundingBox.width * .20,
                    height: this.boundingBox.height * .05
                },
                {
                    onmousedown: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            startExcavation(scientistIndex, 1);
                        }
                        if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                    },
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(!isOnActiveExcavation(scientistIndex))
                        {
                            this.cursor = 'pointer';
                        }
                    }
                },
                "default",
                "rightStartButton"
            );
            this.scientistsPane.addHitbox(rightStartButton);

            var rewardOption1Icon = new Hitbox(
                {
                    x: this.boundingBox.width * .2125,
                    y: this.boundingBox.height * .6,
                    width: this.boundingBox.width * .075,
                    height: this.boundingBox.height * .1125
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && !isOnActiveExcavation(scientistIndex))
                        {
                            if(!isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getExcavationChoiceRewardValues(scientistIndex, 0);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardOption1Icon"
            );
            this.scientistsPane.addHitbox(rewardOption1Icon);

            var rewardOption2Icon = new Hitbox(
                {
                    x: this.boundingBox.width * .7125,
                    y: this.boundingBox.height * .6,
                    width: this.boundingBox.width * .075,
                    height: this.boundingBox.height * .1125
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && !isOnActiveExcavation(scientistIndex))
                        {
                            if(!isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getExcavationChoiceRewardValues(scientistIndex, 1);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardOption2Icon"
            );
            this.scientistsPane.addHitbox(rewardOption2Icon);
            this.scientistsPane.addHitbox(rewardOption1Icon);

            var rewardActive = new Hitbox(
                {
                    x: this.boundingBox.width * .45,
                    y: this.boundingBox.height * .46,
                    width: this.boundingBox.width * .1,
                    height: this.boundingBox.height * .15
                },
                {
                    onmouseenter: function ()
                    {
                        var scientistIndex = this.parent.parent.currentTabIndex;
                        if(firstOpenScientistSlot() > scientistIndex && isOnActiveExcavation(scientistIndex))
                        {
                            if(isOnActiveExcavation(scientistIndex))
                            {
                                var rewardInfo = getActiveExcavationRewardValues(scientistIndex);
                                showTooltip(rewardInfo.name, rewardInfo.description);
                                this.cursor = 'pointer';
                            }
                        }
                    },
                    onmouseexit: function ()
                    {
                        hideTooltip();
                    }
                },
                "default",
                "rewardActive"
            );
            this.scientistsPane.addHitbox(rewardActive);

            var scientistStats = new Hitbox(
                {
                    x: this.boundingBox.width * .4,
                    y: this.boundingBox.height * .25,
                    width: this.boundingBox.width * .28,
                    height: this.boundingBox.height * .1
                },
                {
                    onmouseenter: function ()
                    {
                        showTooltip(_("Scientist info"), _("Level and Rarity affects the amount of rewards excavations give. Rarity also reduces your death chance and increases the amount of experience your scientist gains."))
                    },
                    onmouseexit: hideTooltip
                },
                "default",
                "scientistStats"
            );
            this.scientistsPane.addHitbox(scientistStats);

        }
    }

    initializeRelicsHitboxes()
    {
        this.scientistsPane.clearHitboxes();

        var cellWidth = .12;
        var cellHeight = .18;
        var cellsPerRow = 5;
        var xOffset = .15 * this.boundingBox.width;
        var yOffset = .16 * this.boundingBox.height;
        for(var i = 0; i < Math.min(absoluteMaxRelicSlots, maxRelicSlots + 1); i++)
        {
            var row = (i % cellsPerRow);
            var column = Math.floor(i / cellsPerRow);

            var x = (cellWidth * this.boundingBox.width * row) + xOffset;
            var y = (cellHeight * this.boundingBox.height * column) + yOffset;

            this.context.strokeRect(x, y, this.boundingBox.width * cellWidth, this.boundingBox.height * cellHeight);

            var relicGridCell = new RelicGridCell(
                {
                    x: x,
                    y: y,
                    width: this.boundingBox.width * cellWidth,
                    height: this.boundingBox.height * cellHeight
                },
                row,
                column,
                i
            )

            if(equippedRelics[i] != -1)
            {
                var relicComponent = new RelicComponentUI(
                    {
                        x: 0,
                        y: 0,
                        width: this.boundingBox.width * cellWidth,
                        height: this.boundingBox.height * cellHeight
                    },
                    i
                )
                relicComponent.isOnGrid = true;
                relicGridCell.addHitbox(relicComponent);
            }

            // var relicHitbox = new Hitbox(
            //     {
            //         x: x,
            //         y: y,
            //         width: this.boundingBox.width * cellWidth,
            //         height: this.boundingBox.height * cellHeight
            //     },
            //     {
            //         onmouseenter: function ()
            //         {
            //             var relicIndex = parseInt(this.id.split("_")[1]);
            //             if(equippedRelics[relicIndex] > -1)
            //             {
            //                 this.cursor = 'pointer';
            //                 showTooltipForRelic(relicIndex);
            //             }
            //         },
            //         onmouseexit: function ()
            //         {
            //             hideTooltip();
            //         },
            //         onmousedown: function ()
            //         {
            //             var relicIndex = parseInt(this.id.split("_")[1]);
            //             if(equippedRelics[relicIndex] > -1)
            //             {
            //                 if(relicEditMode == 1)
            //                 {
            //                     showConfirmationPrompt(
            //                         _("Are you sure you want to delete this relic?"),
            //                         _("Yes"),
            //                         function ()
            //                         {
            //                             deleteEquippedRelic(relicIndex);
            //                             hideSimpleInput();
            //                         },
            //                         _("No")
            //                     );
            //                     relicEditMode = 0;
            //                 }
            //             }
            //         }
            //     },
            //     "default",
            //     "relicHitbox_" + i
            // );
            this.relicsPane.addHitbox(relicGridCell);
        }

        var relicTrashHitbox = new Hitbox(
            {
                x: this.boundingBox.width * .8,
                y: this.boundingBox.height * .45,
                width: this.boundingBox.width * .1,
                height: this.boundingBox.height * .12
            },
            {
                onmouseenter: function ()
                {
                    this.cursor = 'pointer';
                    if(relicEditMode == 0)
                    {
                        showTooltip(_("Trash"), _("Currently not set to delete, click this to toggle relic deletion mode."));
                    }
                    else
                    {
                        showTooltip(_("Trash"), _("Currently set to delete, click this to turn off relic deletion mode."));
                    }
                },
                onmouseexit: function ()
                {
                    hideTooltip();
                },
                onmousedown: function ()
                {
                    if(relicEditMode == 1)
                    {
                        relicEditMode = 0;
                    }
                    else
                    {
                        relicEditMode = 1;
                    }
                    if(!mutebuttons) clickAudio[rand(0, clickAudio.length - 1)].play();
                }
            },
            "default",
            "relicTrashHitbox"
        );
        this.relicsPane.addHitbox(relicTrashHitbox);
    }

    getRarityColor(rarity)
    {
        if(rarity == _("Common")) return "#38b53a";
        else if(rarity == _("Uncommon")) return "#008dd9";
        else if(rarity == _("Rare")) return "#9c2828";
        else if(rarity == _("Legendary")) return "#ebab34";
        else if(rarity == _("Warped")) return (quality == 1) ? "#000000" : "#ffffff";
        else if(rarity == _("Warped+")) return (quality == 1) ? "#000000" : "#ffffff";
        else if(rarity == _("Warped++")) return (quality == 1) ? "#000000" : "#ffffff";
    }

    getDifficultyColor(difficulty)
    {
        if(difficulty == _("Easy")) return "#46eb49";
        else if(difficulty == _("Medium")) return "#ecf759";
        else if(difficulty == _("Hard")) return "#fc8608";
        else if(difficulty == _("Nightmare")) return "#d1000a";
    }

    render()
    {
        this.context.save();
        this.context.clearRect(0, 0, this.boundingBox.width, this.boundingBox.height);
        this.context.restore();
        super.render(); // Render any child layers

        //Scientists tab
        if(this.currentTabIndex < 3)
        {
            this.context.drawImage(darkdot, 0, 0, darkdot.width, darkdot.height, this.bodyContainer.boundingBox.x, this.bodyContainer.boundingBox.y, this.bodyContainer.boundingBox.width, this.bodyContainer.boundingBox.height);

            var scientistIndex = this.currentTabIndex;
            var activeScientist = activeScientists[scientistIndex];
            if(activeScientist.length == 0)
            {
                this.context.fillStyle = "#FFFFFF"
                var titleText = _("You do not have {0} scientists, you need to unlock more.", (scientistIndex + 1));
                this.context.fillText(titleText, this.boundingBox.width * .5 - this.context.measureText(titleText).width / 2, this.boundingBox.height * .25);
                if(language == "english")
                {
                    var howToGetText = _("Find more scientists from chests.");
                    this.context.fillText(howToGetText, this.boundingBox.width * .5 - this.context.measureText(howToGetText).width / 2, this.boundingBox.height * .30);
                }
            }
            else
            {
                var staticScientist = scientists[activeScientist[0]];
                var imageId = getScientistImage(activeScientist[0]);

                this.context.drawImage(characterInfoFrame, 0, 0, characterInfoFrame.width, characterInfoFrame.height, this.boundingBox.width * .25, this.boundingBox.height * .135, this.boundingBox.width * .50, this.boundingBox.height * .26);

                this.context.fillStyle = "#211A14"
                this.context.fillRect(this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                if(!staticScientist.isNormal && quality == 1)
                {
                    var noiseImages = [noise1, noise2, noise3, noise4, noise5, noise6];
                    var selectedNoise = noiseImages[rand(0, noiseImages.length - 1)];
                    this.context.globalAlpha = 0.2 + (0.15 * Math.random());
                    this.context.drawImage(selectedNoise, 0, 0, selectedNoise.width, selectedNoise.height, this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                    this.context.globalAlpha = 1;
                }

                if(isScientistDead(scientistIndex))
                {
                    if(scientistIndex == 1 || scientistIndex == 3)
                    {
                        this.context.drawImage(death1, 0, 0, death1.width, death1.height, this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                    }
                    else
                    {
                        this.context.drawImage(death2, 0, 0, death2.width, death2.height, this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                    }
                }
                else
                {
                    this.context.drawImage(imageId, 0, 0, imageId.width, imageId.height, this.boundingBox.width * .30, this.boundingBox.height * .16, this.boundingBox.width * .12, this.boundingBox.height * .20);
                }

                var nameText = staticScientist.name;
                this.context.fillStyle = "#FFFFFF"
                this.context.font = "20px Verdana";

                this.context.fillText(nameText, this.boundingBox.width * .45, this.boundingBox.height * .215);
                this.context.fillRect(this.boundingBox.width * .45, (this.boundingBox.height * .215) + 3, this.context.measureText(nameText).width, 1);
                this.context.font = "16px Verdana";
                var titleText1 = _("Lvl") + " " + getScientistLevel(scientistIndex) + " (" + Math.floor(getScientistPercentToNextLevel(scientistIndex) * 100) + "%)";
                this.context.fillText(titleText1, this.boundingBox.width * .46, this.boundingBox.height * .28);

                this.context.fillStyle = this.getRarityColor(staticScientist.rarity);
                this.context.save();
                if(staticScientist.rarity == _("Legendary") && quality == 1)
                {
                    var shadowAlpha = 0.5 + oscillate(currentTime(), 500) * 0.5;
                    this.context.shadowColor = 'rgba(255, 255, 0, ' + shadowAlpha + ')';
                    this.context.shadowOffsetX = 0;
                    this.context.shadowOffsetY = 0;
                    this.context.shadowBlur = 1 + oscillate(currentTime(), 500) * 2;
                }
                else if(staticScientist.rarity.includes(_("Warped")) && quality == 1)
                {
                    var shadowAlpha = 0.6 + (0.4 + oscillate(currentTime(), 79));
                    this.context.shadowColor = 'rgba(255, 255, 255, ' + shadowAlpha + ')';
                    this.context.shadowOffsetX = oscillate(currentTime(), 499) * 2;
                    this.context.shadowOffsetY = oscillate(currentTime(), 331) * 2;
                    this.context.shadowBlur = 1.5 + oscillate(currentTime(), oscillate(currentTime(), 211)) * 1.5;
                }
                var titleText2 = _("Rarity: {0}", staticScientist.rarity);
                this.context.fillText(titleText2, this.boundingBox.width * .46, this.boundingBox.height * .33);
                this.context.restore();
                this.context.fillStyle = "#FFFFFF";
                this.context.font = "14px Verdana";

                if(isOnActiveExcavation(scientistIndex))
                {
                    var activeExcavation = activeExcavations[scientistIndex];
                    var staticExcavation = excavations[activeExcavation[5]];
                    var difficultyText = staticExcavation.difficulty;
                    this.context.fillStyle = this.getDifficultyColor(difficultyText);
                    this.context.font = "bold 14px Verdana";
                    var excavationText = getActiveExcavationText(scientistIndex);
                    this.context.fillText(excavationText, this.boundingBox.width * .5 - this.context.measureText(excavationText).width / 2, this.boundingBox.height * .435);
                    this.context.fillStyle = "#FFFFFF";
                    this.context.font = "14px Verdana";

                    var excavationRewardValues = getActiveExcavationRewardValues(scientistIndex);

                    this.context.save();
                    this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                    this.context.fillRect(this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    this.context.restore();

                    if(excavationRewardValues.id > -1)
                    {
                        excavationRewards[excavationRewardValues.id].renderFunction(this.context, excavationRewardValues.id, this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    }
                    else
                    {
                        this.context.drawImage(darkdot, 0, 0, darkdot.width, darkdot.height, this.boundingBox.width * .45, this.boundingBox.height * .46, this.boundingBox.width * .1, this.boundingBox.height * .15);
                    }

                    var rewardText = excavationRewardValues.name;
                    this.context.fillText(rewardText, this.boundingBox.width * .5 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .66);

                    var percentComplete = excavationPercentComplete(scientistIndex);
                    var remainingTime = excavationTimeRemainingSeconds(scientistIndex);

                    if(isScientistDead(scientistIndex))
                    {
                        var deathReason = getDeathReason(scientistIndex);
                        renderProgressBar(this.context, deathReason, darkdot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .70, this.boundingBox.width * .6, this.boundingBox.height * .08, "#CC3333", percentComplete);
                        renderButton(this.context, craftb, _("BURY"), this.boundingBox.width * .4, this.boundingBox.height * .79, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("RESURRECT"), this.boundingBox.width * .4, this.boundingBox.height * .86, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                    else if(isExcavationDone(scientistIndex))
                    {
                        renderProgressBar(this.context, _("Excavation Complete"), darkdot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .69, this.boundingBox.width * .6, this.boundingBox.height * .08, "#22CC22", 1);
                        renderButton(this.context, craftb, _("COLLECT"), this.boundingBox.width * .4, this.boundingBox.height * .79, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("FORFEIT"), this.boundingBox.width * .4, this.boundingBox.height * .86, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                    else
                    {
                        renderProgressBar(this.context, _("Time Remaining: {0}", formattedCountDown(remainingTime)), greydot, darkdot, this.boundingBox.width * .2, this.boundingBox.height * .70, this.boundingBox.width * .6, this.boundingBox.height * .08, "#FFFFFF", percentComplete);
                    }
                }
                else
                {
                    for(var i = 0; i < 2; i++)
                    {
                        var excavationChoice = excavationChoices[scientistIndex][i];
                        var excavationStaticData = excavations[excavationChoice[0]];
                        var excavationName = excavationStaticData.names[excavationChoice[5]];
                        var deathChance = Math.max(0, Math.round(excavationChoice[2] * staticScientist.deathChanceMultiple * STAT.increasedExcavationSuccessRatePercent()));
                        var difficultyText = excavationStaticData.difficulty;
                        var isRewardShown = excavationChoice[3];
                        var rewardId = excavationChoice[4];
                        var excavationDurationMinutes = excavationChoice[1];
                        var rewardStaticData = excavationRewards[rewardId];
                        var rewardImagecurrentlyViewedDepth = rewardStaticData.image;
                        var rewardImageRenderFunction = rewardStaticData.renderFunction;
                        var rewardName = rewardStaticData.name;
                        var rewardDescription = rewardStaticData.description;
                        var offset = i * this.boundingBox.width * .50;

                        //render the choice
                        this.context.font = "bold 14px Verdana";
                        this.context.fillStyle = this.getDifficultyColor(difficultyText);
                        this.context.fillText(excavationName, offset + this.boundingBox.width * .25 - this.context.measureText(excavationName).width / 2, this.boundingBox.height * .47);
                        this.context.font = "14px Verdana";
                        this.context.fillStyle = "#FFFFFF";
                        this.context.fillText(_("Death Chance: {0}", deathChance + "%"), offset + this.boundingBox.width * .25 - this.context.measureText(_("Death Chance: {0}", deathChance + "%")).width / 2, this.boundingBox.height * .52);
                        var durationText = _("Duration") + ": " + formattedCountDown(excavationDurationMinutes * 60);
                        this.context.fillText(durationText, offset + this.boundingBox.width * .25 - this.context.measureText(durationText).width / 2, this.boundingBox.height * .57);
                        if(isRewardShown || displayHiddenExcavations)
                        {
                            this.context.save();
                            this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                            this.context.fillRect(offset + this.boundingBox.width * .2125, this.boundingBox.height * .6, this.boundingBox.width * .075, this.boundingBox.height * .1125);
                            this.context.restore();

                            rewardImageRenderFunction(this.context, rewardId, offset + this.boundingBox.width * .2125, this.boundingBox.height * .6, this.boundingBox.width * .075, this.boundingBox.height * .1125);

                            var tempFont = this.context.font;
                            this.context.font = "14px Verdana";
                            if(language == "german") this.context.font = "11px Verdana";
                            var rewardText = _("Reward") + ": " + rewardName;
                            if(language == "german") rewardText = rewardName;
                            this.context.fillText(rewardText, offset + this.boundingBox.width * .25 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .76);
                            this.context.font = tempFont;
                        }
                        else
                        {
                            this.context.save();
                            this.context.fillStyle = "rgba(255, 255, 255, 0.1)";
                            this.context.fillRect(offset + this.boundingBox.width * .2125, this.boundingBox.height * .6, this.boundingBox.width * .075, this.boundingBox.height * .1125);
                            this.context.restore();

                            this.context.fillText("???", offset + this.boundingBox.width * .2125 + (this.boundingBox.width * .075 / 2) - this.context.measureText("???").width / 2, this.boundingBox.height * .6 + this.boundingBox.height * .1125 / 2);
                            var tempFont = this.context.font;
                            this.context.font = "14px Verdana";
                            var rewardText = _("Reward") + ": ???";
                            this.context.fillText(rewardText, offset + this.boundingBox.width * .25 - this.context.measureText(rewardText).width / 2, this.boundingBox.height * .76);
                            this.context.font = tempFont;
                        }

                        renderButton(this.context, craftb, _("START"), offset + this.boundingBox.width * .15, this.boundingBox.height * .78, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                        renderButton(this.context, craftb, _("REFRESH"), this.boundingBox.width * .4, this.boundingBox.height * .86, this.boundingBox.width * .20, this.boundingBox.height * .05, "14px Verdana", "#000000");
                    }
                }
            }
        }
        else
        {
            if(relicEditMode == 0)
            {
                this.context.drawImage(trashb, 0, 0, 20, 20, this.boundingBox.width * .8, this.boundingBox.height * .45, this.boundingBox.width * .1, this.boundingBox.height * .12);
            }
            else
            {
                this.context.drawImage(trashb2, 0, 0, 20, 20, this.boundingBox.width * .8, this.boundingBox.height * .45, this.boundingBox.width * .1, this.boundingBox.height * .12);
            }
        }
    }
}


class RelicGridCell extends DragDropUIComponent
{
    row;
    column;

    constructor(boundingBox, row, column, index)
    {
        super(boundingBox); // Need to call base class constructor

        this.displayType = 4;
        this.isDropRegion = true;
        this.dropTypesAccepted = [1];
        this.row = row;
        this.column = column;
        this.index = index;
        this.id = "RelicGridSlot_" + row + "_" + column;
    }

    render()
    {
        var rootContext = this.getRootLayer().context;

        rootContext.fillStyle = "rgba(255, 255, 255, 0.3)";
        rootContext.strokeStyle = 'rgb(0, 0, 0)';

        var localCoordinates = this.parent.getRelativeCoordinates(this.boundingBox.x, this.boundingBox.y, this.getRootLayer());
        rootContext.strokeRect(localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);
        rootContext.fillRect(localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);


        if(this.index + 1 > maxRelicSlots)
        {
            rootContext.fillStyle = "#2b2b2b";
            rootContext.fillRect(localCoordinates.x + (this.boundingBox.width / 2) - (this.boundingBox.width * .05), localCoordinates.y + (this.boundingBox.height * .15), this.boundingBox.width * 0.1, this.boundingBox.height * .7);
            rootContext.fillRect(localCoordinates.x + (this.boundingBox.width * .15), localCoordinates.y + (this.boundingBox.height / 2) - (this.boundingBox.height * .05), this.boundingBox.width * 0.7, this.boundingBox.height * .1);
        }

        rootContext.globalAlpha = 1;
        super.render();

        if(this.isDropCandidate)
        {
            rootContext.restore();
        }
    }

    onAcceptDrop()
    {

        if(this.index + 1 > maxRelicSlots)
        {
            activeDraggingInstance.onDropFailed();
            return;
        }

        super.onAcceptDrop();
        let draggedHitbox = activeDraggingInstance;
        let draggedRelic = equippedRelics[draggedHitbox.index];
        let currentHitbox = this.hitboxes[0];
        let currentRelic = equippedRelics[this.index];

        activeDraggingInstance.parentBeforeDrag.clearHitboxes();

        if(currentHitbox)
        {
            activeDraggingInstance.parentBeforeDrag.addHitbox(currentHitbox);
        }

        this.clearHitboxes();
        this.addHitbox(draggedHitbox);

        equippedRelics[this.index] = draggedRelic;
        equippedRelics[draggedHitbox.index] = currentRelic;

        //should rewrite this so the cells don't flicker on rerender
        activeLayers.Arch.relicsPane.clearHitboxes();
        activeLayers.Arch.initializeRelicsHitboxes();

        activeDraggingInstance.boundingBox.x = 1;
        activeDraggingInstance.boundingBox.y = 1;
    }

    onmousedown()
    {
        if(this.index + 1 > maxRelicSlots)
        {
            if(tickets >= getRelicSlotCost())
            {
                showConfirmationPrompt(
                    _("Do you want to purchase another relic slot for {0} tickets?", getRelicSlotCost()),
                    _("Yes"),
                    () =>
                    {
                        tickets -= getRelicSlotCost();
                        expandRelicInventory();
                        activeLayers.Arch.relicsPane.clearHitboxes();
                        activeLayers.Arch.initializeRelicsHitboxes();
                    },
                    _("No"));
            }
            else
            {
                showConfirmationPrompt(
                    _("Next relic slot cost {0} tickets. You don't have enough tickets.", getRelicSlotCost()),
                    _("BUY TICKETS"),
                    function ()
                    {
                        openUi(PurchaseWindow, null, 0, purchaseWindowTabOrder);
                        hideSimpleInput();
                    },
                    _("Cancel"));
            }

        }
    }

    onChildRemoved()
    {
        super.onChildRemoved();

        //should rewrite this so the cells don't flicker on rerender
        activeLayers.Arch.relicsPane.clearHitboxes();
        activeLayers.Arch.initializeRelicsHitboxes();
    }
}

class RelicComponentUI extends DragDropUIComponent
{
    index;
    isMouseOver = false;
    isOnGrid;

    constructor(boundingBox, index)
    {
        super(boundingBox); // Need to call base class constructor

        this.displayType = 1;
        this.isDraggable = true;
        this.index = index;
    }

    render()
    {
        var rootContext = this.getRootLayer().context;

        if(this.isDropCandidate)
        {
            rootContext.save();
            rootContext.shadowBlur = 11;
        }

        this.renderComponent();
        super.render();

        if(this.isDropCandidate)
        {
            rootContext.restore();
        }
    }

    onmouseenter(e)
    {
        super.onmouseenter(e);
        this.cursor = 'pointer';
        showTooltipForRelic(this.index);
        this.isMouseOver = true;
    }

    onmouseexit(e)
    {
        super.onmouseexit(e);
        hideTooltip();
        this.isMouseOver = false;
    }

    onmousedown(e)
    {
        if(relicEditMode != 1)
        {
            super.onmousedown(e);
        }
        else
        {
            showConfirmationPrompt(
                _("Are you sure you want to delete this relic?"),
                _("Yes"),
                () =>
                {
                    deleteEquippedRelic(this.index);
                    hideSimpleInput();
                    activeLayers.Arch.relicsPane.clearHitboxes();
                    activeLayers.Arch.initializeRelicsHitboxes();

                },
                _("No")
            );
            relicEditMode = 0;
        }
    }

    renderComponent()
    {
        var rootContext = this.getRootLayer().context;
        var localCoordinates = this.parent.getRelativeCoordinates(this.boundingBox.x, this.boundingBox.y, this.getRootLayer());
        excavationRewards[equippedRelics[this.index]].renderFunction(rootContext, equippedRelics[this.index], localCoordinates.x, localCoordinates.y, this.boundingBox.width, this.boundingBox.height);
    }
}