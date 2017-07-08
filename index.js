// Accept a written command in an input field, submitting that command when you hit the Enter key.
// OR, using the HTML5 Speech Recognition API (this only works on Google Chrome 25 and above), if the user clicks “Speak”, they can speak their commands and have them written into the input field automatically.
// Once the command has been received, you can use jQuery to submit an AJAX POST request to Api.ai. Api.ai will return its knowledge as a JSON object, as you saw above in the test console.
// You’ll read in that JSON file using JavaScript and display the results on your web app.
// If available, your web app will also use the Web Speech API (available in Google Chrome 33 and above) to respond back to you verbally.

const accessToken = '09f082fa3d154dd081fdd27dd2360576'; //client
const subscriptionKey = '47a5893f66844728aec2fcfd7c9a6d39'; //dev key
const baseUrl = 'https://api.api.ai/v1/';
let $speechInput;
let $recordBtn;
let recognition;
const messageRecording = "Recording...";
const messageCouldntHear = 'I couldn\'t hear that. Try again.';
const messageInternalError = 'Oops. Something is wrong internally. Getting an error';
const  messageSorry = 'I\'m sorry. I can\'t answer that for you.';
const speechInput = document.getElementById('speech');
const recordBtn = document.getElementById('record');

// $(document).ready(function() {
  // $speechInput = $('#speech');
  // $recordBtn = $("#record");
  // let recognition;

  speechInput.addEventListener("keypress", function() {
    if(event.which == 13) { //enter
      event.preventDefault();
      send()
    }
  });
  // speechInput.keypress(function(event) {
  //   if(event.which == 13) { //enter
  //     event.preventDefault();
  //     // send()
  //     console.log(event.target);
  //   }
  // });
  recordBtn.addEventListener('click', function(event) {
    switchRecognition();
  })
  // // turns on/off speech recog
  // $('#record').click(function(event) {
  //   switchRecognition();
  // })

  function switchRecognition() {
    if(recognition) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }

  function stopRecognition() {
    if(recognition) {
      recognition.stop();
      recognition = null;
    }
    updateRecord()
  }

  function startRecognition() {
    recognition = new webkitSpeechRecognition();

    recognition.onstart = function(event) {
      respond(messageRecording);
      updateRecord();
    }

    recognition.onresult = function(event) {
      let text = '';
      console.log(event);
      for(let i = event.resultIndex; i < event.results.length; i++) {
        console.log(`speech text message: ${event.results[i][0].transcript}`);
        text += event.results[i][0].transcript
      }
      setInput(text);
      stopRecognition();
    };

    recognition.onend = function(event) {
      respond(messageCouldntHear);
      stopRecognition();
    };
    recognition.lang = 'en-US';
    recognition.start();
  }

  function updateRecord() {
    recordBtn.text(recognition ? 'STOP' : 'SPEAK');
  }

  function setInput(text) {
    console.log(text);
    // ('input').val(text);
    send();
  }

  function send() {
    let text = speechInput.value;
    console.log(`sent this text: ${text}`);
    const url = `${baseUrl}query`;
    const request = new XMLHttpRequest();
    let data = JSON.stringify({query: text, lang: "en", sessionId: "1234567890"});
    console.log(url);
    request.open("POST", url, true);
    request.setRequestHeader("Authorization", `Bearer ${accessToken}`)
    request.send(data)
    //       "ocp-apim-subscription-key": subscriptionKey)
  //   $.ajax({
  //     type: "POST",
  //     url: baseUrl + "query",
  //     contentType: "application/json; charset=utf-8",
  //     dataType: "json",
  //     headers: {
  //       "Authorization": `Bearer ${accessToken}`,
  //       "ocp-apim-subscription-key": subscriptionKey
  //     },
  //     data: JSON.stringify({query: text, lang: "en", sessionId: "1234567890"}),
  //
  //     success: function(data) {
  //       prepareResponse(data);
  //     },
  //     error: function() {
  //       respond(messageInternalError);
  //     }
  //   });
  }

  function prepareResponse(val) {
    let spokenResponse = val.result.speech;
    console.log(`spokenResponse: ${spokenResponse}`);

    respond(spokenResponse);
  }

  function respond(val) {
    if (val === '') {
      val = messageSorry;
    }

    if (val !== messageRecording) {
      let msg = new SpeechSynthesisUtterance();
      msg.voiceURI = "native";
      msg.txt = val;
      msg.lang = 'en-US';
      window.speechSynthesis.speak(msg);
    }

    document.getElementById('spokenResponse')
      .addClass("is-active")
      .find('.spoken-response__text')
      .html(val);
  }
// });
