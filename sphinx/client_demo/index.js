// Global UI elements:
//  - log: event log
//  - trans: transcription window

// Global objects:
//  - isConnected: true iff we are connected to a worker
//  - tt: simple structure for managing the list of hypotheses
//  - dictate: dictate object with control methods 'init', 'startListening', ...
//       and event callbacks onResults, onError, ...
var isConnected = false;

var tt = new Transcription();

var startPosition = 0;
var endPosition = 0;
var doUpper = false;
var doPrependSpace = true;

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettyfyHyp(text, doCapFirst, doPrependSpace) {
	if (doCapFirst) {
		text = capitaliseFirstLetter(text);
	}
	tokens = text.split(" ");
	text = "";
	if (doPrependSpace) {
		text = " ";
	}
	doCapitalizeNext = false;
	tokens.map(function(token) {
		if (text.trim().length > 0) {
			text = text + " ";
		}
		if (doCapitalizeNext) {
			text = text + capitaliseFirstLetter(token);
		} else {
			text = text + token;
		}
		if (token == "." ||  /\n$/.test(token)) {							
			doCapitalizeNext = true;
		} else {
			doCapitalizeNext = false;
		}						
	});
	
	text = text.replace(/ ([,.!?:;])/g,  "\$1");
	text = text.replace(/ ?\n ?/g,  "\n");
	return text;
}	


var dictate = new Dictate({
		server : $("#servers").val().split('|')[0],
		serverStatus : $("#servers").val().split('|')[1],
		recorderWorkerPath : '../lib/recorderWorker.js',
		onReadyForSpeech : function() {
			isConnected = true;
			__message("READY FOR SPEECH");
			$("#buttonToggleListening").html('Stop');
			$("#buttonToggleListening").addClass('highlight');
			$("#buttonToggleListening").prop("disabled", false);
			$("#buttonCancel").prop("disabled", false);
			startPosition = $("#trans").prop("selectionStart");
			endPosition = startPosition;
			var textBeforeCaret = $("#trans").val().slice(0, startPosition);
			if ((textBeforeCaret.length == 0) || /\. *$/.test(textBeforeCaret) ||  /\n *$/.test(textBeforeCaret)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (textBeforeCaret.length > 0) && !(/\n *$/.test(textBeforeCaret));
		},
		onEndOfSpeech : function() {
			__message("END OF SPEECH");
			$("#buttonToggleListening").html('Stopping...');
			$("#buttonToggleListening").prop("disabled", true);
		},
		onEndOfSession : function() {
			isConnected = false;
			__message("END OF SESSION");
			$("#buttonToggleListening").html('Start');
			$("#buttonToggleListening").removeClass('highlight');
			$("#buttonToggleListening").prop("disabled", false);
			$("#buttonCancel").prop("disabled", true);
		},
		onServerStatus : function(json) {
			__serverStatus(json.num_workers_available);
			$("#serverStatusBar").toggleClass("highlight", json.num_workers_available == 0);
			// If there are no workers and we are currently not connected
			// then disable the Start/Stop button.
			if (json.num_workers_available == 0 && ! isConnected) {
				$("#buttonToggleListening").prop("disabled", true);
			} else {
				$("#buttonToggleListening").prop("disabled", false);
			}
		},
		onPartialResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			val = $("#trans").val();
			$("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));        
			endPosition = startPosition + hypText.length;
			$("#trans").prop("selectionStart", endPosition);
		},
		onResults : function(hypos) {
			hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
			val = $("#trans").val();
			$("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));        
			startPosition = startPosition + hypText.length;			
			endPosition = startPosition;
			$("#trans").prop("selectionStart", endPosition);
			if (/\. *$/.test(hypText) ||  /\n *$/.test(hypText)) {
				doUpper = true;
			} else {
				doUpper = false;
			}
			doPrependSpace = (hypText.length > 0) && !(/\n *$/.test(hypText));
		},
		onError : function(code, data) {
			dictate.cancel();
			__error(code, data);
			// TODO: show error in the GUI
		},
		onEvent : function(code, data) {
			__message(code, data);
		}
	});

// Private methods (called from the callbacks)
function __message(code, data) {
	log.innerHTML = "msg: " + code + ": " + (data || '') + "\n" + log.innerHTML;
}

function __error(code, data) {
	log.innerHTML = "ERR: " + code + ": " + (data || '') + "\n" + log.innerHTML;
}

function __serverStatus(msg) {
	serverStatusBar.innerHTML = msg;
}

function __updateTranscript(text) {
	$("#trans").val(text);
}

// Public methods (called from the GUI)
function toggleListening() {
	if (isConnected) {
		dictate.stopListening();
	} else {
		dictate.startListening();
	}
}

function cancel() {
	dictate.cancel();
}

function clearTranscription() {	
	$("#trans").val("");
	// needed, otherwise selectionStart will retain its old value
	$("#trans").prop("selectionStart", 0);	
	$("#trans").prop("selectionEnd", 0);	
}

/*
function callEpic() {
	responsiveVoice.speak("Hello, welcome to Fieldcare, your neighborhood healthcare pitstop. Please state your name.");
setTimeout(function() {
responsiveVoice.speak("Thank you. Please state your date of birth as in: January twenty third nineteen eighty eight.");
}, 8000);
setTimeout(function() {
responsiveVoice.speak("Thank you. Please state the last four digits of your s s n.");
}, 16000);
setTimeout(function() {
responsiveVoice.speak("Thank you.");
}, 24000);
setTimeout(function() {
responsiveVoice.speak("Confirming your identity.");
}, 25000);
setTimeout(function() {
responsiveVoice.speak("Welcome Timothy! You've been checked into your appointment. Please have a seet in the waiting room and a nurse will call your name shortly. Hope you feel better soon!");
}, 30000);
}
*/

function sendToHS(message) {
	//alert(message);
	//return
	
	if (message == "") {
		message = "hello world"
	}
	
	/*
	var socket = io('http://10.17.37.134:8090');
	socket.on('connect', function(){
	  console.log(socket.id); // 'G5p5...'
	});
	socket.send(JSON.stringify({
		id: "hello world"
	}))
	
	return
	*/
	
	/*
	var ws = new WebSocket("http://10.17.37.134:8090");
	ws.onopen = function(evt) {  };
    ws.onclose = function(evt) {  };
    ws.onmessage = function(evt) { websocket.close(); };
    ws.onerror = function(evt) {  };
	
	ws.send(message);
	*/
	
	$.post("10.17.37.134:8090/Default.aspx", "hello world", function(data, status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}


function input(e) {
    var tbInput = document.getElementById("tbInput");
    tbInput.value = tbInput.value + e.value;
}
 
function del() {
    var tbInput = document.getElementById("tbInput");
    tbInput.value = tbInput.value.substr(0, tbInput.value.length - 1);
}

function sendDigits() {
	//sendToHS($("#tbInput").val());
	
	recievedSomething($("#tbInput").val());
	$("#tbInput").val("");
}

function callEpic() {
	console.log("calling Epic");
	needsIdentifying = true;
	needsAuthentication = true;
	epicIVR_Welcome();
}

function jumpMenus(eventName, delay, data) {
	if (delay <= 0) { 
		delay=500; 
	}
	
	console.log("switch from " + currentMenu + " to " + eventName);
	console.log("delay:" + delay);
	console.log(data);
	
	setTimeout(function() {
		$(document).trigger(eventName,data);
	}, delay);
	
	currentMenu=eventName;
}

var currentMenu = "None";

function epicIVR_Welcome() {
	console.log("Greeting...");
	document.getElementById("buttonCallEpicCustomer").style.display = 'none';

	responsiveVoice.speak("Welcome to Epic's IVR");
	setTimeout(function() {
		epicIVR_Identify();
	}, 2250);
}

var needsIdentifying = true;
var needsAuthentication = true;

function epicIVR_Identify(iteration) {
	console.log("Needs identification...");
	epicIVR_WaitForAThing("To get started, please type or say your plan number.", 15000, planNumberRecieved);
}



var planInfo;

function getPlanInfo(planId) {
	// get info from Epic.
	
	planInfo={};
	console.log("planId: " + planId + " is a " + typeof(planId));
	if (planId == "226884" || planId == "two two six eight eight four") {
		planInfo.planId = planId;
		planInfo.isValid = true;
		planInfo.preferredName = "Jon Snow";
		console.log("WaitForAThing service: Plan Info looks good.");
	} else {
		planInfo.isValid = false;
		console.log("WaitForAThing service: Don't recognize that plan.");
	}
}

function planNumberRecieved(digits) {
	needsIdentifying = false;
	getPlanInfo(digits);
	if (planInfo.isValid) {
		setTimeout(function() {
			epicIVR_Authenticate_start();
		}, 500);
	} else {
		setTimeout(function() {
			epicIVR_error_speakToRep("Sorry, I didn't recognize that plan number.");
		}, 500);
	}
}

function epicIVR_Authenticate_start(preferredName) {
	responsiveVoice.speak("Thank you, " + planInfo.preferredName + " please answer the following questions to verify your identity.");
	
	// randomly? select the series of verification methods.
	
	setTimeout(function() {
		epicIVR_Authenticate_DoB();
	}, 5000);
}

function epicIVR_Authenticate_DoB() {
	epicIVR_WaitForAThing("First, please enter or say your date of birth.", 15000, DoB_recieved);
	// wait for result
	
	setTimeout(function() {
		epicIVR_Authenticate_SSN();
	}, 15000);
}

function isValidDoB() {
	console.log("WaitForAThing service: Evaluating DoB.");
	return true;
}

function DoB_recieved(digits) {
	console.log("WaitForAThing service: recieved Date of Birth.")
	if (isValidDoB(digits)) {
		setTimeout(function() {
			epicIVR_Authenticate_SSN();
		}, 500);
	} else {
		console.log("WaitForAThing service: invalid DoB.");
		setTimeout(function() {
			epicIVR_error_speakToRep("Hmm, that doesn't match our records.");
		}, 500);
	}
}

function epicIVR_Authenticate_SSN() {
	epicIVR_WaitForAThing("Thank you. Now please enter or say the last four digits of your social security number followed by pound.", 10000, SSN_recieved);
}

function isValidSSN() {
	console.log("WaitForAThing service: Evaluating SSN");
	return true;
}

function SSN_recieved(digits) {
	console.log("WaitForAThing service: Recieved SSN");
	if (isValidSSN(digits)) {
		setTimeout(function() {
			epicIVR_Greet_Authenticated_Patient();
		}, 500);
	} else {
		console.log("WaitForAThing service: Invalid SSN.");
		setTimeout(function() {
			epicIVR_error_speakToRep("Hmm, that doesn't match what we have in our records.");
		}, 500);
	}
}

var keyword = ["burn", "schedule", "Monday", "pain"];

function recognizeKeywords(sentence) {
	var i = 0;
	for (i = 0; i < keywords.length; i++) {
		if (sentence.includes(keyword[i])) {
			document.getElementById('trans').value += "***!!" + keyword[i] + "!!***\n";
		}
	}
}

function epicIVR_error_speakToRep(msg) {
	responsiveVoice.speak(msg + "Connecting you to a representative.")
	
	// prompt to answer questionaires?
}

function setupIVRMenuEvents() {
	$(document).on("epicIVR_epicIVR_identify", epicIVR_Identify);
	$(document).on("epicIVR_authentication_start", epicIVR_Authenticate_start);
	$(document).on("epicIVR_authentication_dob", epicIVR_Authenticate_DoB);
	$(document).on("epicIVR_authentication_ssn", epicIVR_Authenticate_SSN);
}


//var grammar = '#JSGF V1.0; grammar numbers; public <number> = one | two | three | four | five | six | seven | eight | nine | zero ;'
//var recognition = new webkitSpeechRecognition();
//alert("here");
//var speechRecognitionList = new webkitSpeechGrammarList();
//speechRecognitionList.addFromString(grammar, 1);
//recognition.grammars = speechRecognitionList;
//recognition.onresult = function (event) {
//	if (event.results[0].isFinal) {
  //    document.getElementById('trans').value += event.results[0][0].transcript.replace(/-|\s/g,"") + "\n";
	//  recievedSomething(event.results[0][0].transcript.replace(/-|\s/g,""));
    //}/=
//}


$(document).ready(function() {
	dictate.init();
	grammar = '#JSGF V1.0; grammar numbers; public <number> = one | two | three | four | five | six | seven | eight | nine | zero ;'
	recognition = new webkitSpeechRecognition();
	recognition.onresult = function (event) {
	console.log("Results are coming");
	if (event.results[0].isFinal) {
	 clearscreen();
     document.getElementById('trans').value += event.results[0][0].transcript + "\n";
     console.log("writing");
	 recievedSomething(event.results[0][0].transcript); //.replace(/-|\s/g,"")
    }
	}

	$("#servers").change(function() {
		dictate.cancel();
		var servers = $("#servers").val().split('|');
		dictate.setServer(servers[0]);
		dictate.setServerStatus(servers[1]);
	});

	// responsiveVoice.setDefaultVoice("US English Female");
	setupIVRMenuEvents();
	
});