//Bad IVR Example
function callBadIVR() {
		responsiveVoice.speak("Welcome to Bad IVR");
		document.getElementById("buttonCallNormal").style.display = 'none';
	     setTimeout(function() {
		BadIVR_Identify();
	}, 2250);
}

function BadIVR_Identify(iteration) {
	console.log("Needs identification...");
	epicIVR_WaitForAThing("To get started, please type in your plan number", 15000, BadIVR_PunchInPlan);
}

function BadIVR_PunchInPlan()
{
	
}