//Bad IVR Example
var recognition;
 
$(document).ready(function() {
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
});
 
 
function clearscreen()
{
document.getElementById('trans').value = "";
}
 
//Entry point to the IVR
function callBadIVR() {
              responsiveVoice.speak("Welcome to Epic's IVR!");
              //grammar = '#JSGF V1.0; grammar numbers; public <number> = one | two | three | four | five | six | seven | eight | nine | zero ;'
              //recognition.continuous = true;
              //speechRecognitionList = new webkitSpeechGrammarList();
              //speechRecognitionList.addFromString(grammar, 1);
              //recognition.grammars = speechRecognitionList;
 
                             document.getElementById("buttonCallNormal").style.display = 'none';
                setTimeout(function() {
      BadIVR_911_warning();
                }, 3000);
}
 
function BadIVR_911_warning() {
              responsiveVoice.speak("If this is an emergency, please hang up and dial 911");
    setTimeout(function() {
                             BadIVR_Reason_for_Call();
              }, 4500);
}
 
 
 
function BadIVR_Reason_for_Call()
{
              console.log("Asking Reason...");
              responsiveVoice.speak("To get started, tell me what are you calling about?");
              setTimeout(function() {
                             waitForSomething(SmartChoice);
              }, 3500);;
              //epicIVR_WaitForAThing("To get started, tell me what are you calling about?", 200000, BadIVR_Reason_for_Call_recieved);
}
 
function BadIVR_Reason_for_Call_recieved(reason)
{
              console.log("Listen for reason..." + reason);
              responsiveVoice.speak("Excellent, I'll put you in touch with someone shortly");
              responsiveVoice.speak("First, I'll need to confirm your identity");
              responsiveVoice.speak("Please state your name, date of birth and the last four digits of your social security number");
               setTimeout(function() {
                             waitForSomething(ReceivePatientInfo);
              }, 12000);
}
 
 
function ReceivePatientInfo(Info)
{
              console.log("PatientInfo..." + Info);
              responsiveVoice.speak("Thank you Jon Snow");
              responsiveVoice.speak("Before I connect you to a scheduler, have you travelled outside the united states in the last 30 days?");
              setTimeout(function() {
                             waitForSomething(PitchCampaign);
              }, 7500);
}
 
function PitchCampaign(Info)
{
              console.log("PitchCampaign" + Info);
              responsiveVoice.speak("Great, I'll pass that along.");
              responsiveVoice.speak("All our Nurses are busy at the moment, while you wait, your chart indicates that you have been smoking regularly. Would you be interested in participating in our 'get help quitting' campaign?");
              setTimeout(function() {
                             waitForSomething(AskOther);
              }, 12000);
}
function AskOther()
{
              console.log("AskOther");
              //responsiveVoice.speak("We have another few opportunities that we'd like to share with you, would you like to hear about them?");
              responsiveVoice.speak("We have another few opportunities that we'd like to share with you, would you like to hear about them?");
              setTimeout(function() {
                             waitForSomething(SmartChoice);
              }, 5000);
 
}

function SmartChoice()
{
              console.log("No");
              responsiveVoice.speak("It was probably not the smartest of choices, you can listen to this while you wait");
              setTimeout( function(){
                playElevatormusic();
              },4000);

}
//# No just put me in touch with someone please
 
function epicIVR_error_speakToRep(msg) {
              responsiveVoice.speak(msg + "Connecting you to a representative.")
 
              // prompt to answer questionaires?
}
var audio = new Audio();
function playElevatormusic()
{
             
              audio.src = '7cdaf42a9e606f0c9bd782d56fc6-orig.wav';
              audio.play();
              setTimeout( function(){
                automatedCall();
              },8000);
}

function automatedCall()
{
  audio.pause();
  document.getElementById("buttonCallEpicCustomer").style.display = 'block';
}

function outgoingIAC()
{
  console.log("HardCode the hell out");
} 
 
 
 
 
 
 
///Good code
var needsThing = false;
var waitingForSomething;
var waitingCallback;
 
 
function epicIVR_recievedThatThing() {
              needsThing = undefined;
}
 
function waitForSomething(callback) {
              console.log("WaitForAThing service: setting up waitForSomething service. for: " + callback.name);
              if (waitingForSomething == true) {
                             console.log("Error! Already waiting on input.");
                             return;
              }
              waitingForSomething = true;
              waitingCallback = callback;
 
              console.log("WaitForAThing service: starting speech recognition for: " + callback.name);
  console.log("WaitForAThing service: recognition.onresult type: " + recognition.onresult.toString());
             recognition.start();
 
}
 
function recievedSomething(digits) {
              console.log("WaitForAThing service: recieved something! [" + digits + "]");
              console.log("WaitForAThing service: force stopping speech recognition service. Currently waiting for: " + waitingCallback.name);
              recognition.stop(); // force stop
              console.log("stopping recognition");
              if (waitingForSomething == false) {
                             console.log("Error! Woah there, we didn't think we were waiting for anything.");
                             //return;
              }
 
              epicIVR_recievedThatThing();

              waitingCallback(digits);

 
              waitingForSomething = false;
              //waitingCallback = null;
}
 
function cancelWaitingForSomething() {
              console.log("WaitForAThing service: canceling waitForSomething service.");
              waitingForSomething = false;
              waitingCallback = undefined;
}