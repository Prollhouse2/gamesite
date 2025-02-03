// #################################################
// ##################### SENDY #####################
// #################################################
const MRMINE_GENERAL_LIST = "uL0rOPK763IJT0Igv9w8A5cg";

function subscribeToGeneralList()
{
	var emailValue = document.getElementById("simpleInputFieldText").value;

	if(!isEmailValid(emailValue))
	{
		alert(_("The email address provided is not valid."));
		return;
	}
	else if(!emailContainsTypo(emailValue).isValid)
	{
		alert(emailContainsTypo(emailValue).response);
		return;
	}
	else
	{
		sendSubscriptionRequest(emailValue, MRMINE_GENERAL_LIST);
	}
}

function sendSubscriptionRequest(email, listId)
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
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200)
		{
			if(!isEmailCollected() && email != "")
			{
				newNews(_("Thank you for subscribing!"));
				fbq('track', 'subscribed');
				addTickets(5, "email_subscription");
				localStorage["userEmail"] = email;
				hideSimpleInput();
			}
		}
	}

	var params = "";
	params += "name=&";
	params += "email=" + email + "&";
	params += "list=" + listId;

	xmlhttp.open("POST", SUBSCRIPTION_ENDPOINT, true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send(params);
}

// #################################################
// ################### INTERFACE ###################
// #################################################

function showMobileEmailPrompt()
{
	if(!isEmailCollected())
	{
		showSimpleInput(
			_("Subscribe with your email for updates and get <b><u>5 tickets</u></b>!"),
			_("Subscribe"),
			"",
			subscribeToGeneralList,
			_("Cancel")
		);
	}
}

// #################################################
// #################### HELPERS ####################
// #################################################

function isEmailCollected()
{
	return localStorage.getItem("userEmail") != null && localStorage["userEmail"] != "";
}

function isEmailValid(email)
{
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	var isValid = re.test(email);
	return isValid;
}

function emailContainsTypo(email)
{
	var emailTyposList = [
		["@gmail.fr^", "Invalid email, did you mean gmail.com"],
		["@gmal.com^", "Invalid email, did you mean gmail.com"],
		["@gmil.com^", "Invalid email, did you mean gmail.com"],
		["@gmail.com.br^", "Invalid email, did you mean gmail.com"],
		["@gemail.com^", "Invalid email, did you mean gmail.com"],
		["@gmail.co^", "Invalid email, did you mean gmail.com"],
		["@gmail.pl^", "Invalid email, did you mean gmail.com"],
		["@gmail.org^", "Invalid email, did you mean gmail.com"],
		["@gmail.de^", "Invalid email, did you mean gmail.com"],
		["@gmail.ru^", "Invalid email, did you mean gmail.com"],
		["@gmail.con^", "Invalid email, did you mean gmail.com"],
		["@gmaill.com^", "Invalid email, did you mean gmail.com"],
		["@hotmail.co^", "Invalid email, did you mean hotmail.com"],
		["@gmail.co.uk^", "Invalid email, did you mean gmail.com"],
		["@gmail.om^", "Invalid email, did you mean gmail.com"],
		["@g-mail.com^", "Invalid email, did you mean gmail.com"],
		["@gmail.com.au^", "Invalid email, did you mean gmail.com"],
		["@gmailc.om^", "Invalid email, did you mean gmail.com"],
		["@homail.com^", "Invalid email, did you mean hotmail.com"],
		["@gmail.ca^", "Invalid email, did you mean gmail.com"],
		["@gmail.cm^", "Invalid email, did you mean gmail.com"],
		["@hotmail.cm^", "Invalid email, did you mean hotmail.com"],
		["@g.mail.com^", "Invalid email, did you mean gmail.com"],
		["@yahoo.cm^", "Invalid email, did you mean yahoo.com"],
		["@outlook.cm^", "Invalid email, did you mean outlook.com"]
	];

	for(var i = 0; i < emailTyposList.length; i++)
	{
		if((email + "^").split(emailTyposList[i][0]).length > 1)
		{
			return {"isValid": false, "response": emailTyposList[i][1]};
		}
	}
	return {"isValid": true, "response": ""};
}