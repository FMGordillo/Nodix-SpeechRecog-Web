var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var phrases = [
  "La masa blanda estaba blanda",
  "La paloma se poso en el palo"
  // "Te quiero mucho",
  // "pasame esa lapicera.",
  // "ayudame a comprarme un jean.",
  // "salen unas birras.",
  // "atr",
  // "lo que vi en las clases es una porquería."
];

var phrasePara = document.querySelector(".phrase");
var resultPara = document.querySelector(".result");
var diagnosticPara = document.querySelector(".output");

var testBtn = document.querySelector(".start-button");
var stopBtn = document.querySelector(".stop-button");

function randomPhrase() {
  var number = Math.floor(Math.random() * phrases.length);
  return number;
}

function testSpeech() {
  testBtn.disabled = true;
  testBtn.textContent = "Prueba en progreso";

  var phrase = phrases[randomPhrase()];
  // To ensure case consistency while checking with the returned output text
  phrase = phrase.toLowerCase();
  phrasePara.textContent = phrase;
  resultPara.textContent = "Bien o mal?";
  resultPara.style.background = "rgba(0,0,0,0.2)";
  diagnosticPara.textContent = "...diagnosticando mensaje";

  var grammar = "#JSGF V1.0; grammar phrase; public <phrase> = " + phrase + ";";
  var recognition = new SpeechRecognition();
  var speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = "es-ES";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = function(event) {
    // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
    // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
    // It has a getter so it can be accessed like an array
    // The first [0] returns the SpeechRecognitionResult at position 0.
    // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
    // These also have getters so they can be accessed like arrays.
    // The second [0] returns the SpeechRecognitionAlternative at position 0.
    // We then return the transcript property of the SpeechRecognitionAlternative object
    var speechResult = event.results[0][0].transcript.toLowerCase();
    diagnosticPara.textContent = "Speech received: " + speechResult + ".";
    console.log(`Speech: ${speechResult}, y el text = ${phrase}`);
    console.log(removeAccents(speechResult));
    console.log(phrase.toLowerCase());
    if (removeAccents(speechResult) === phrase.toLowerCase()) {
      resultPara.textContent = "Todo estuvo OK!!";
      resultPara.style.background = "lime";
    } else {
      resultPara.textContent = "Mmmm... Uff... Mal.";
      resultPara.style.background = "red";
    }

    console.log("Confidence: " + event.results[0][0].confidence);
  };

  recognition.onspeechend = function() {
    // recognition.stop();
    testBtn.disabled = false;
    testBtn.textContent = "Empezar nuevo test";
  };

  recognition.onerror = function(event) {
    testBtn.disabled = false;
    testBtn.textContent = "Empezar el test";
    diagnosticPara.textContent =
      "Error occurred in recognition: " + event.error;
  };

  recognition.onaudiostart = function(event) {
    //Fired when the user agent has started to capture audio.
    console.log("SpeechRecognition.onaudiostart", event);
  };

  recognition.onaudioend = function(event) {
    //Fired when the user agent has finished capturing audio.
    console.log("SpeechRecognition.onaudioend", event);
  };

  recognition.onend = function(event) {
    //Fired when the speech recognition service has disconnected.
    console.log("SpeechRecognition.onend", event);
  };

  recognition.onnomatch = function(event) {
    //Fired when the speech recognition service returns a final result with no significant recognition. This may involve some degree of recognition, which doesn't meet or exceed the confidence threshold.
    console.log("SpeechRecognition.onnomatch", event);
  };

  recognition.onsoundstart = function(event) {
    //Fired when any sound — recognisable speech or not — has been detected.
    console.log("SpeechRecognition.onsoundstart", event);
  };

  recognition.onsoundend = function(event) {
    //Fired when any sound — recognisable speech or not — has stopped being detected.
    console.log("SpeechRecognition.onsoundend", event);
  };

  recognition.onspeechstart = function(event) {
    //Fired when sound that is recognised by the speech recognition service as speech has been detected.
    console.log("SpeechRecognition.onspeechstart", event);
  };
  recognition.onstart = function(event) {
    //Fired when the speech recognition service has begun listening to incoming audio with intent to recognize grammars associated with the current SpeechRecognition.
    console.log("SpeechRecognition.onstart", event);
  };
  stopBtn.addEventListener("click", () => {
    recognition.stop();
  });
}

testBtn.addEventListener("click", testSpeech);
