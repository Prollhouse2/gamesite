// ############################################################
// ###################### CODE REDEMPTION #####################
// ############################################################
var redeemedCodes = [];

function showRedeemPrompt()
{
	showSimpleInput(_("Enter the code to redeem."), _("Redeem Code"), "", redeemCode, "Cancel");
}

function redeemCode()
{
	var redeemCode = getSafeCode();
	if(redeemedCodes.indexOf(redeemCode) == -1)
	{
		redeemCouponThroughSdk(redeemCode);
	}
	else
	{
		alert(_("Code already redeemed"));
	}
}

function getSafeCode()
{
	var rawCode = document.getElementById("simpleInputFieldText").value;
	var redeemCode = replaceAll(rawCode, " ", "");
	return redeemCode;
}

//code ticket redemption
function redeemTicketOnServer(ticketId)
{
	var xmlhttp;
	if(window.XMLHttpRequest)
	{
		xmlhttp = new XMLHttpRequest();
	}
	else
	{
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function ()
	{
		console.log(xmlhttp.responseText);
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			var result = JSON.parse(xmlhttp.responseText);
			console.log(result);
			var isSuccess = result.success.toString();
			if(isSuccess == "success")
			{
				var redeemCode = getSafeCode();
				var endQuantityIndex = redeemCode.length - 1;
				var rewardQuantity = parseInt(redeemCode.slice(11, endQuantityIndex));
				var rewardQuantityBigNumber = new BigNumber(redeemCode.slice(11, endQuantityIndex));
				var rewardType = redeemCode.slice(endQuantityIndex);

				if(rewardType == "T" && rewardQuantity > 0)
				{
					//tickets
					addTickets(rewardQuantity, "coupon_redemption");
					newNews(_("You gained {0} tickets", rewardQuantity), true);
				}
				else if(rewardType == "M" && rewardQuantity > 0)
				{
					//money
					addMoney(rewardQuantityBigNumber);
					newNews(_("You gained money ${0}", rewardQuantity), true);
				}
				else if(rewardType == "C")
				{
					//normal chest
					openBasicChest();
				}
				else if(rewardType == "G")
				{
					//golden chest
					openGoldChest();
				}
				else if(rewardType == "E")
				{
					//Ethereal chest
					openEtherealChest();
				}
				else if(rewardType == "L" && rewardQuantity > 0)
				{
					//timelapse minutes
					timelapse(rewardQuantity);
					newNews(_("You gained timelapse {0}mins", parseFloat((rewardQuantity * STAT.timelapseDurationMultiplier()).toFixed(2))), true);
				}
				else if(rewardType == "D" && rewardQuantity > 0)
				{
					addDepth(rewardQuantity);
					newNews(_("You gained {0}km depth", rewardQuantity), true);
				}
				else if(rewardType == "S" && rewardQuantity > 0)
				{
					worldResources[BUILDING_MATERIALS_INDEX] += rewardQuantity;
					newNews(_("You gained {0} x Building Materials", rewardQuantity), true);
				}
				else if(rewardType == "A" && rewardQuantity > 0)
				{
					worldResources[BUILDING_MATERIALS_INDEX] += rewardQuantity;
					newNews(_("You gained {0} x Building Materials", rewardQuantity), true);
				}
				else if(rewardType == "O" && rewardQuantity > 0)
				{
					//oil
					worldResources[OIL_INDEX].numOwned += rewardQuantity;
					newNews(_("You gained {0} oil", rewardQuantity), true);
				}
				else if(rewardType == "B" && rewardQuantity > 0)
				{
					//standard buff
					if(rewardQuantity != 6)	
					{
						buffs.startBuff(rewardQuantity, 600, "code");
					}
					else
					{
						buffs.startBuff(rewardQuantity, 30, "code");
					}
					newNews(_("You gained a buff!"), true);
				}
				else if(rewardType == "X")
				{
					CHEATS_ENABLED = !CHEATS_ENABLED;
					newNews("Cheats enabled: " + CHEATS_ENABLED);
					hideSimpleInput();
					return;
				}
				if(redeemedCodes.length == 0)
				{
					logInfluencer(redeemCode);
				}
				redeemedCodes.push(redeemCode);
				document.getElementById("simpleInputFieldText").value = "";
				trackEvent_redeemCode();
				hideSimpleInput();
			}
			else
			{
				alert(_("Error code doesn't exist or is invalid"));
			}
		}
	}

	xmlhttp.open("POST", CODE_REDEMPTION_ENDPOINT, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("r=" + ticketId);
}

function redeemCouponThroughSdk(code)
{
	Playsaurus.coupons.redeem(code)
		.then(coupon => onCouponSuccess(coupon))
		.catch(error => onCouponError(error));
}

function onCouponSuccess(coupon)
{
	trackEvent_redeemCode(coupon.code);
	var rewardMessage = "";
	var rewardValue;
	var rewardType = coupon.rewardType;
	if(coupon.rewardType.slice(0, 5) == "buff_")
	{
		rewardType = "buff";
	}
	switch(rewardType)
	{
		case "tickets":
			rewardValue = parseInt(coupon.value);
			tickets += rewardValue;
			rewardMessage = _("You gained {0} tickets", rewardValue);
			break;
		case "money":
			rewardValue = new BigNumber(coupon.value)
			addMoney(rewardValue);
			rewardMessage = _("You gained money ${0}", rewardValue);
			break;
		case "normal_chest":
			rewardValue = parseInt(coupon.value);
			rewardedChestStorage.storeChests(0, rewardValue);
			rewardMessage = _("You gained {0} x Basic Chest", rewardValue);
			break;
		case "golden_chest":
			rewardValue = parseInt(coupon.value);
			rewardedChestStorage.storeChests(1, rewardValue);
			rewardMessage = _("You gained {0} x Gold Chest", rewardValue);
			break;
		case "ethereal_chest":
			rewardValue = parseInt(coupon.value);
			rewardedChestStorage.storeChests(2, rewardValue);
			rewardMessage = _("You gained {0} x Ethereal Chest", rewardValue);
			break;
		case "timelapse_mins":
			rewardValue = parseInt(coupon.value);
			timelapse(rewardValue);
			rewardMessage = _("You gained timelapse {0}mins", parseFloat((rewardValue * STAT.timelapseDurationMultiplier()).toFixed(2)));
			break;
		case "depth_kms":
			rewardValue = parseInt(coupon.value);
			addDepth(rewardValue);
			rewardMessage = _("You gained {0}km depth", rewardValue);
			break;
		case "building_materials":
			rewardValue = parseInt(coupon.value);
			worldResources[BUILDING_MATERIALS_INDEX].numOwned += rewardValue;
			rewardMessage = _("You gained {0} x Building Materials", rewardValue);
			break;
		case "oil":
			rewardValue = parseFloat(coupon.value);
			worldResources[OIL_INDEX].numOwned += rewardValue;
			rewardMessage = _("You gained {0} oil", rewardValue);
			break;
		case "buff":
			var buffIdMap = {
				"buff_miner_speed_potion": 0,
				"buff_key_of_luck": 1,
				"buff_midas_touch": 2,
				"buff_elemental_pike": 3,
				"buff_nugget_of_attraction": 4,
				"buff_drill_speed_potion": 5,
				"buff_raining_chests": 6,
				"buff_cargo_expansion": 7,
				"buff_endless_gem_speed_potion": 8,
				"buff_relic_effectiveness": 9
			}
			var buffId = buffIdMap[coupon.rewardType];
			if(buffId != 6)	
			{
				buffs.startBuff(buffId, 600, "code");
			}
			else
			{
				buffs.startBuff(buffId, 30, "code");
			}
			rewardMessage = _("You gained a buff!");
			break;
		case "cheats":
			break;
		default:
			console.error('Unknown reward type:', coupon.rewardType);
			rewardMessage = _("The coupon code is for a new game feature. Please update the game or contact support.");
	}
	if(rewardMessage.length > 0)
	{
		showCouponMessage(coupon.message, rewardMessage);
	}
}

function showCouponMessage(couponMessage, rewardMessage)
{
	const message = couponMessage
		? `${couponMessage}\n\n${rewardMessage}`
		: rewardMessage;

	window.alert(message);
}

function onCouponError(error)
{
	if(error instanceof Playsaurus.CouponRedeemError)
	{ // Redemption logic error
		window.alert(error.message);
	} else if(error instanceof Playsaurus.PlaysaurusNetworkError)
	{ // Network error
		console.error('Network error redeeming coupon:', error);

		window.alert({
			503: 'Sorry, our servers are currently down for maintenance. Please try again in a few seconds.',
			429: 'You are trying to redeem coupons too fast. Please wait a minute and try again.',
			500: 'Oops! Something went wrong on our side. Please try again later. If the problem persists, please contact support.'
		}[error.status] || 'An error occurred while redeeming the coupon. Please try again later.');

	} else
	{ // Other unknown JavaScript error
		console.error('Error redeeming coupon:', error);
		window.alert('An error occurred while redeeming the coupon. Please try again later.');
	}
}