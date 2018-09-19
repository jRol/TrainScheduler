// Initialize Firebase
var config = {
    apiKey: "AIzaSyB5h2LiTGyxKOtFjBm59cPJjNgi7szZRxw",
    authDomain: "gwbootcamp-5ac5d.firebaseapp.com",
    databaseURL: "https://gwbootcamp-5ac5d.firebaseio.com",
    projectId: "gwbootcamp-5ac5d",
    storageBucket: "gwbootcamp-5ac5d.appspot.com",
    messagingSenderId: "35135119452"
};
firebase.initializeApp(config);

// Assign the reference to the database to a variable named 'database'
// var database = ...
var database = firebase.database();

var name = "";
var destination = "";
var time = "";
var frequency = 0;

// Whenever a user clicks the submit-bid button
$("#submit-input").on("click", function(event) {
    // Prevent form from submitting
    event.preventDefault();

    // Get the input values
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    time = $("#time-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    database.ref().set({
        name: name,
        destination: destination,
        time: time,
        frequency: frequency
    });

    // Assumptions
    var tFrequency = frequency;

    // Time is 3:30 AM
    var firstTime = time;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
    $("#min-away").text("Minutes Away: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
    $("#next").text("Next Arrival: " + moment(nextTrain).format("hh:mm"));
});

// At the initial load and subsequent value changes, get a snapshot of the stored data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value", function(snapshot) {

    // If Firebase has
    if (snapshot.child("name").exists() && snapshot.child("destination").exists() && snapshot.child("time").exists() && snapshot.child("frequency").exists()) {

        name = snapshot.val().name;
        destination = snapshot.val().destination;
        time = snapshot.val().time;
        frequency = parseInt(snapshot.val().frequency);

        // Change the HTML to reflect the stored values
        $("#name").text("Train Name: " + name);
        $("#destination").text("Destination: " + destination);
        $("#time").text("First Train Time: " + time);
        $("#frequency").text("Frequency (min): " + frequency);
    }
  
    // Else Firebase doesn't have
    else {
  
        $("#name").text("Train Name: " + name)
        $("#destination").text("Destination: " + destination);
        $("#time").text("First Train Time: " + time);
        $("#frequency").text("Frequency (min): " + frequency);
    }
  
  // If any errors are experienced, log them to console.
  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });