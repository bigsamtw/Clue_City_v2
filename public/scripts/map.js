var current = { lat: 22.996950, lng: 120.222417 }
var flag = 0;
var time = 1800;
var markersList = [];

function addMarker() {
  console.log("mark")
  var marker = new google.maps.Marker({
    position: current,
    map: map,
    icon: './images/Map/marker.png'
  });
  markersList.push(marker);


}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 17,
    center: current,
    mapTypeId: 'terrain'
  });
  addMarker()

  var script = document.createElement('script');

  script.src = './data.js';
  document.getElementsByTagName('head')[0].appendChild(script);

  map.data.setStyle(function (feature) {
    var magnitude = feature.getProperty('mag');
    return {
      icon: getCircle(magnitude)
    };
  });
}

function getCircle(magnitude) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .2,
    scale: Math.pow(2, magnitude) / 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
}

function eqfeed_callback(results) {
  map.data.addGeoJson(results);
}

gps = function () {
  navigator.geolocation.getCurrentPosition(successCallback,
    errorCallback,
    { maximumAge: 1000, timeout: 0 });
  setTimeout(gps, 2000)
}
gps()

function successCallback(position) {
  var crd = position.coords;
  current.lat = crd.latitude;
  current.lng = crd.longitude;
  console.log('Latitude : ' + current.lat + 'Longitude: ' + current.lng);

  if (flag == 0) {
    console.log("init")
    initMap()
    flag = 1
  }
  function clearMarkers(addMarker) {
    console.log("delete")
    for (var i = 0; i < markersList.length; i++) {
      markersList[i].setMap(null);
    }
    addMarker()
  }
  clearMarkers(addMarker)
}

function errorCallback(error) {
  switch (error.code) {
    case error.TIMEOUT:
      doFallback();
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      break;
  };
}

function doFallback() {
}

function Time() {
  time -= 1;
  if (Math.floor(time % 60) < 10)
    document.getElementById('time').innerHTML = Math.floor(time / 60) + ":0" + Math.floor(time % 60);
  else
    document.getElementById('time').innerHTML = Math.floor(time / 60) + ":" + Math.floor(time % 60);
  if (time != 0) {
    setTimeout("Time()", 1000);
  }
}
Time();

function btn_hide_onclick() {
  console.log("click")
  document.getElementById('btn_clue').style.visibility = 'hidden'
  document.getElementById('big_clues_picture').style.visibility = 'hidden'
  document.getElementById('big_clue_background').style.visibility = 'hidden'
  document.getElementById('btn_hide').style.visibility = 'hidden'
  document.getElementById('small_clue_background').style.visibility = 'visible'
  document.getElementById('small_clue_picture').style.visibility = 'visible'
  document.getElementById('submit_image').style.visibility = 'hidden'
  document.getElementById('submit_image').style.visibility = 'hidden'
  document.getElementById('submit_button').style.visibility = 'hidden'
  document.getElementById('submit_button').style.visibility = 'hidden'
  document.getElementById('success').style.visibility = 'hidden'
}

function btn_camera_onclick() {
  document.getElementById('btn_clue').style.visibility = 'visible'
  document.getElementById('big_clues_picture').style.visibility = 'visible'
  document.getElementById('big_clue_background').style.visibility = 'visible'
  document.getElementById('btn_hide').style.visibility = 'visible'
  document.getElementById('small_clue_background').style.visibility = 'hidden'
  document.getElementById('small_clue_picture').style.visibility = 'hidden'
  document.getElementById('submit_image').style.visibility = 'visible'
  document.getElementById('submit_button').style.visibility = 'visible'
}

function small_clue_onclick() {
  document.getElementById('btn_clue').style.visibility = 'visible'
  document.getElementById('big_clues_picture').style.visibility = 'visible'
  document.getElementById('big_clue_background').style.visibility = 'visible'
  document.getElementById('btn_hide').style.visibility = 'visible'
  document.getElementById('small_clue_background').style.visibility = 'hidden'
  document.getElementById('small_clue_picture').style.visibility = 'hidden'
  document.getElementById('submit_image').style.visibility = 'visible'
  document.getElementById('submit_button').style.visibility = 'visible'
}

//----------Han-----------------//

function onSubmitButtonClicked() {

  var file = document.getElementById("submit_image")
  //因為準備用post提交，又因為圖片的內容比較大，所以我們選擇使用formdata來承載數據
  //創建formdata對象
  var formData = new FormData();
  //給formdata對象中放入數據(鍵值對的方式)
  formData.append('file', file.files[0]);
  console.log('開始圖片上傳');
  $.ajax({
    url: './map/upload',
    type: 'post',
    data: formData,
    dataType: 'text',
    success: function (data) {
      //$('#upload_response').text(data);
      console.log(data)
      if (data.valueOf() == "1") {
        console.log("similar")
      }
      else {
        console.log("not similar")
      }
    },
    error: function () {
      console.log("error!!!!!!!!!")
      onSubmitButtonClicked();
    },
    cache: false,
    contentType: false,
    processData: false,
  })
}


$(document).ready(function () {
  $('submit_button').on('click', function (e) {
    e.preventDefault();
    //do some other stuff here
  });
  $('upload_form').on('submit', function (e) {
    e.preventDefault();
  });
  $('upload_form').on('get', function (e) {
    e.preventDefault();
    return false;
  });
  $('upload_form').on('post', function (e) {
    e.preventDefault();
    //do some other stuff here
  });
})