//Bad IVR Example
var recognition;

function clearscreen()
{
 document.getElementById('trans').value = "";
}



//Entry point to the IVR
function callBadIVR() {
	responsiveVoice.speak("Welcome to Epic's IVR!");
	//grammar = '#JSGF V1.0; grammar numbers; public <number> = one | two | three | four | five | six | seven | eight | nine | zero ;'
	recognition = new webkitSpeechRecognition();
	//recognition.continuous = true;
	console.log("here");
	//speechRecognitionList = new webkitSpeechGrammarList();
	//speechRecognitionList.addFromString(grammar, 1);
	//recognition.grammars = speechRecognitionList;

		document.getElementById("buttonCallNormal").style.display = 'none';
	     setTimeout(function() {
		BadIVR_911();
	}, 3000);
}

function BadIVR_911() {
	console.log("911...");
	responsiveVoice.speak("If this is an emergency, please hang up and dial 911");
    setTimeout(function() {
		BadIVR_Identify();
	}, 4500);
 }



function BadIVR_Identify()
{
	console.log("Ask Reason...");
	epicIVR_WaitForAThing("To get started, tell me what are you calling about?", 20000, BadIVR_Reason);
}

function BadIVR_Reason(reason)
{
	console.log("Listen for reason..." + reason);
	responsiveVoice.speak("Excellent, I'll put you in touch with someone shortly");
	responsiveVoice.speak("First, I'll need to confirm your identity"); 
	epicIVR_WaitForAThing("Please state your name, date of birth and the last four digits of your social security number", 25000, ReceivePatientInfo);
}


function ReceivePatientInfo(Info)
{
	console.log("PatientInfo..." + Info);
	responsiveVoice.speak("Thank you Jon Snow");
	epicIVR_WaitForAThing("Before I connect you to a scheduler, have you or your loved ones travelled outside the united states in the last 30 days?", 15000, PitchCampaign);
}

function PitchCampaign()
{
	console.log("PitchCampaign");
	responsiveVoice.speak("Great, I'll pass that along.");
    responsiveVoice.speak("While you wait, your chart indicates that you have been smoking regularly.");
    epicIVR_WaitForAThing("Would you be interested in participating in our 'get help quitting' campaign?",15000, AskOther)
}
function AskOther()
{
	console.log("AskOther");
	//responsiveVoice.speak("We have another few opportunities that we'd like to share with you, would you like to hear about them?");
	epicIVR_WaitForAThing("We have another few opportunities that we'd like to share with you, would you like to hear about them?",15000,playElevatormusic)

}
//# No just put me in touch with someone please

function playElevatormusic()
{
	responsiveVoice.speak("Okay, it will just be a minute");
	audio.src = '7cdaf42a9e606f0c9bd782d56fc6-orig.wav'
	audio.play();
}







///Bad code
var needsThing = false;

function epicIVR_WaitForAThing(_prompt, promptLen, recievedCallback) {
	cancelWaitingForSomething(); // force cancel service
	console.log("WaitForAThing service: Initializing... for: " + recievedCallback.name);
	needsThing = recievedCallback.name;
	epicIVR_WaitForAThing_iter(0, _prompt, promptLen, recievedCallback);
}

function epicIVR_WaitForAThing_iter(iteration, _prompt, promptLen, recievedCallback) {
	console.log("WaitForAThing service: current needsThing? " + needsThing);
	if (needsThing != recievedCallback.name) {
		console.log("WaitForAThing service: don't need " + recievedCallback.name + "! Not repeating prompt.");
		return;
	}
	console.log("WaitForAthing service: current iteration for " + recievedCallback.name + " is: " + iteration);
	if (iteration > 2) {
		console.log("WaitForAThing service: did not recieve the thing. Sending to representative.");
		epicIVR_error_speakToRep("");
		return
	}
	
	console.log("WaitForAThing service: speaking prompt for: " + recievedCallback.name);
	responsiveVoice.speak(_prompt);
	if (!waitingForSomething) {
		console.log("WaitForAThing service: trigger waiting for thing. for: " + recievedCallback.name)
		waitForSomething(recievedCallback);
	}
	
}

function epicIVR_recievedThatThing() {
	needsThing = undefined;
}

var waitingForSomething;
var waitingCallback;

function waitForSomething(callback) {
	console.log("WaitForAThing service: setting up waitForSomething service. for: " + callback.name);
	if (waitingForSomething == true) {
		console.log("Error! Already waiting on input.");
		return;
	}
	waitingForSomething = true;
	waitingCallback = callback;
	
	console.log("WaitForAThing service: starting speech recognition for: " + callback.name);


 	recognition.start();
		
}

function recievedSomething(digits) {
	console.log("WaitForAThing service: recieved something! [" + digits + "]");
	//console.log("WaitForAThing service: force stopping speech recognition service. Currently waiting for: " + waitingCallback.name);
	recognition.stop(); // force stop
	console.log("stopping recognition");
	if (waitingForSomething == false) {
		console.log("Error! Woah there, we didn't think we were waiting for anything.");
		//return;
	}
	
	epicIVR_recievedThatThing();
	setTimeout(function() {
		waitingCallback(digits);
	}, 100);
	
	waitingForSomething = false;
	//waitingCallback = null;
}

function cancelWaitingForSomething() {
	console.log("WaitForAThing service: canceling waitForSomething service.");
	waitingForSomething = false;
	waitingCallback = undefined;
}