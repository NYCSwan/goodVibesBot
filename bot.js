
// OR, using the HTML5 Speech Recognition API (this only works on Google Chrome 25 and above), if the user clicks “Speak”, they can speak their commands and have them written into the input field automatically.
// Once the command has been received, you can use jQuery to submit an AJAX POST request to Api.ai. Api.ai will return its knowledge as a JSON object, as you saw above in the test console.
// You’ll read in that JSON file using JavaScript and display the results on your web app.
// If available, your web app will also use the Web Speech API (available in Google Chrome 33 and above) to respond back to you verbally.
  const accessToken = '09f082fa3d154dd081fdd27dd2360576'; //client
  const subscriptionKey = '47a5893f66844728aec2fcfd7c9a6d39'; //dev key
  const baseUrl = 'https://api.api.ai/v1/';
  const messageRecording = "Recording...";
  const messageCouldntHear = 'I couldn\'t hear that. Try again.';
  const messageInternalError = 'Oops. Something is wrong internally. Getting an error';
  const messageSorry = 'I\'m sorry. I can\'t answer that for you.';
  const speechInput = document.getElementById('speech');
  const spokenResponse = document.getElementById('spokenResponse');
  const recordBtn = document.getElementById('record');
  let spokenInput;
  let recognition;

  // Accept a written command in an input field, submitting that command when you hit the Enter key.
    speechInput.addEventListener("keypress", function() {
      if(event.which == 13) { //enter
        event.preventDefault();
        send()
      }
    });


//
// Toggle recognition and button text
//

  recordBtn.onclick = function() {switchRecognition()};

    function switchRecognition() {
      if(recognition) {
        console.log(recognition);
        stopRecognition();
      } else {
        startRecognition();
      }
    }

    function stopRecognition() {
      if (recognition) {
				recognition.stop();
				recognition = null;
			}
			updateRecord();
      console.log('stopRecognition');
    }

    function startRecognition() {
      recognition = new webkitSpeechRecognition();
      recognition.onstart = function(event) {
        console.log(`onstart: ${event}`);
        respond(messageRecording);
        updateRecord();
      }
      recognition.onresult = function(event) {
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
      };
      recognition.onend = function() {
        stopRecognition();
      };
      recognition.lang = "en-US";
      recognition.start();
      console.log('startRecognition');

    }


    function switchRecognition() {
      if (recognition) {
        stopRecognition();
      } else {
        startRecognition();
      }
    }

    function updateRecord() {
      recognition ? recordBtn.innerText='STOP' : recordBtn.innerText='SPEAK';
    }

    function setInput(text) {
      console.log(`text: ${text}`);
      speechInput.value = text;
      console.log(speechInput.value);
      // ('input').val(text);
      send();
    }

  // send to api.ai
    function send() {
      // post req
      const url = `${baseUrl}query`;
      const request = new XMLHttpRequest();
      let text = speechInput.value;
      let data = JSON.stringify({query: text, lang: "en", sessionId: "1234567890"});

      request.open("POST", url, true);
      request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
      request.setRequestHeader("ocp-apim-subscription-key", `${subscriptionKey}`);
      request.setRequestHeader('Content-Type', "application/json");
      request.onload = function() {
        if(request.status >= 200 && request.status < 400) {
          console.log('request loaded');
          var data = JSON.parse(request.responseText);
          setResponse(data); 
        } else if (request.status !== 200){
          console.log(`request status ${request.status}`);
          setResponse("Internal Server Error");
        }
      }
      console.log(`sent this data: ${data}`);
      request.send(data)
    }

    function setResponse(val) {
      //should be from api.ai
      let spokenResponse = val.result.speech;
      console.log(`spokenResponse: ${spokenResponse}`);

      document.getElementById("spokenResponse").innerText = spokenResponse;
    }

    function respond(val) {
      if (val === '') {
        val = messageSorry;
      }
      if (val != messageRecording) {
        let msg = new SpeechSynthesisUtterance();
        msg.voiceURI = "native";
        msg.txt = val;
        msg.lang = 'en-US';
        window.speechSynthesis.speak(msg);
      }

      // spokenResponse.classList.toggle("is-active");
    }
