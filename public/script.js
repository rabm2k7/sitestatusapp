var urlArray = ["http://localhost:8080/style.css", "http://localhost:8080/style2.css"];
var statusObj = {};

$(document).ready(function() {

  $.each(urlArray, function(i, value) {
    statusObj[value] = {
      "currentStatus": "offline",
      "errorCountPast2": 0,
      "firstErrorTime": null,
      "lastErrorTime": null
    };
  });

  console.log(statusObj);

  RenderLI();
  setInterval(function() {
    RenderLI();
    console.log("Rerendered List");
  }, 10000);
  $('#AddNewUrl').click(function() {

    var newurl = prompt("Please enter your url", "http://localhost:8080/");

    if (newurl == null || newurl == "") {
      alert("User cancelled the prompt.");
    } else {
      alert("New Url Added");
      urlArray.push(newurl);
      statusObj[newurl] = {
        "currentStatus": null,
        "errorCountPast2": 0,
        "firstErrorTime": 0,
        "lastErrorTime": 0
      };
    }

  });
});


function RenderLI() {
  $("#items ul").empty();



  $.each(urlArray, function(i, value) {

    $.ajax({
      url: value,
      success: function(request, status, error) {
        console.log(status);
      },
      error: function(request, status, error) {
        console.log(error);
      }
    }).always(function(data, status) {

      if (status === "success") {
        calculateDisplay(urlArray[i], 1);
      } else {
        calculateDisplay(urlArray[i], 0);
      }

      if (statusObj[urlArray[i]].currentStatus === "online") {
        appendOnline(urlArray[i]);
      } else {
        appendOffline(urlArray[i]);
      }

    });

  });

}

function appendOnline(url) {
  $("#items ul").append('<li><a href="' + url + '">' + url + '</a><div class="traffic-light"><div class="light red"></div><div class="light green bright"></div></div></li>');
}

function appendOffline(url) {
  $("#items ul").append('<li><a href="' + url + '">' + url + '</a><div class="traffic-light"><div class="light red bright animateFlash"></div><div class="light green"></div></div></li>');
}

function calculateDisplay(url, status) {

  //if status is online
  if (status === 1) {

    if ((statusObj[url].errorCountPast2 < 3) && (statusObj[url].firstErrorTime == null) && (statusObj[url].lastErrorTime == null)) {
      statusObj[url].currentStatus = "online";
    } else {
      if (statusObj[url].errorCountPast2 > 0) {

        var timeSinceFirstError = Date.now() - statusObj[url].firstErrorTime;
        var timeSinceLastError = Date.now() - statusObj[url].lastErrorTime;

        if ((timeSinceFirstError >= 120000) && (timeSinceLastError >= 120000)) {
          statusObj[url].lastErrorTime = null;
          statusObj[url].firstErrorTime = null;
          statusObj[url].errorCountPast2 = 0;
          statusObj[url].currentStatus = "online";
        }
      }

    }

  } else {

    var currentCount = statusObj[url].errorCountPast2;

    //if first error
    // set time of first error;
    if (currentCount < 1) {
      statusObj[url].firstErrorTime = Date.now();
      statusObj[url].lastErrorTime = Date.now();
      statusObj[url].errorCountPast2++;
    }
    if (currentCount >= 1) {
      statusObj[url].lastErrorTime = Date.now();
      statusObj[url].errorCountPast2++;
    }

    if (currentCount >= 3) {
      statusObj[url].currentStatus = "offline";
    }

  }


}
