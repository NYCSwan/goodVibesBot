// Accept a written command in an input field, submitting that command when you hit the Enter key.
// OR, using the HTML5 Speech Recognition API (this only works on Google Chrome 25 and above), if the user clicks “Speak”, they can speak their commands and have them written into the input field automatically.
// Once the command has been received, you can use jQuery to submit an AJAX POST request to Api.ai. Api.ai will return its knowledge as a JSON object, as you saw above in the test console.
// You’ll read in that JSON file using JavaScript and display the results on your web app.
// If available, your web app will also use the Web Speech API (available in Google Chrome 33 and above) to respond back to you verbally.

const accessToken = '09f082fa3d154dd081fdd27dd2360576',
  baseUrl = 'https://api.api.ai/v1',
  $speechInput,
  $recBtn,
  recognition,
  messageRecording = "Recording...",
  messageCouldntHear = 'I couldn\'t hear that. Try again.',
  messageInternalError = 'Oops. Something is wrong internally. Getting an error',
  messageSorry = 'I\'m sorry. I can\'t answer that for you.'
