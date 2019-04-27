
//Save user input
var data = (localStorage.getItem('text_input')) ? JSON.parse(localStorage.getItem('text_input')):{
  text_input: [],
};







///Get input from user
document.getElementById("send").addEventListener('click', function() {
  var value = document.getElementById('search-input').value;
  if (value) {
    addToChat(value);
  }
});

///Add input value to chat
function addToChat (value) {
  if (value){
  addItemToDOM(value);
  document.getElementById('search-input').value = '';

  data.text_input.push(value);
  dataObjectUpdated();
//Get robot's answer
  robotAnswer(value);
    }
}

///Robotanswer
function robotAnswer(value){

///Add loading animation
  addRobotLoading();
///Analize input
  value = robotAnalize(value);
//Wait 1.2 sek before answering
  setTimeout(function(){

    addRobotItemToDOM(value);
    ///Sound effect
    var snd = new Audio("sounds/msg.mp3");
    snd.play();

}, 1200);

}






//Update user input data
function dataObjectUpdated() {
  localStorage.setItem('text_input', JSON.stringify(data));
}









// Adds a new user text to the chatbox
function addItemToDOM(text) {
  //Where elements go
  var list = document.getElementById('conversation');

  //Usertextbox div
  var div = document.createElement('div');

  //Userinf with time and name
  var userinf = document.createElement('div');



  var p = document.createElement('p');
  var rec = document.createElement('div');

  //time now
  var timeNow = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});



  div.classList.add("usertextbox");
  div.classList.add("mt-4");
  p.classList.add("px-4");
  p.classList.add("py-2");
  p.classList.add("usertext");
  p.innerText =text;

  rec.classList.add("rectangle");

  ///Userinfo
  userinf.innerHTML = "<span class='messagetime'>"+ timeNow+"</span><span class='messagename user-name'> Mina</span>";
  userinf.classList.add("userinfo");



  div.appendChild(userinf);

  div.appendChild(rec);
  div.appendChild(p);
  list.append(div);
}

// Adds a new robot text to the chatbox
function addRobotItemToDOM(text) {
  var list = document.getElementById('conversation');

  var div = document.createElement('div');
  var p = document.createElement('p');
  var rec = document.createElement('div');
  //Robotinf with time and name
  var robotinf = document.createElement('div');
  var robotpic = document.createElement('div');
  //time now
  var timeNow = new Date().toLocaleTimeString(navigator.language, {hour: '2-digit', minute:'2-digit'});

  div.classList.add("usertextbox");
  div.classList.add("mt-4");
  p.classList.add("px-4");
  p.classList.add("py-2");
  p.classList.add("robottext");
  p.innerText =text;
  rec.classList.add("rectangle-robot");



  ///Robotinfo
  robotinf.innerHTML = "<span class='messagename robot-name'> gotoAndBot </span>"+"<span class='messagetime'>"+  timeNow+"</span>";
  robotinf.classList.add("robotinfo");
  robotpic.classList.add("chat-pic")


  div.appendChild(robotinf);
  div.appendChild(robotpic);
  div.appendChild(rec);

  div.appendChild(p);
  list.append(div);
}


///Robot "loads" the answer////

function addRobotLoading(){
  var list = document.getElementById('conversation');
  var div = document.createElement('div');
  div.classList.add("w-100");
  div.classList.add("lds-ellipsis");
  div.innerHTML = "<div></div><div></div><div></div><div></div>";

  list.append(div);

  setTimeout(function(){
    list.removeChild(div);
}, 1200);

}

//Gets a string parameter and returns an answer
function robotAnalize(value){
  value = value.toLowerCase();

  switch(true) {
    case /tere|tervist|hei|hey|tsau/.test(value):
      return "Hei!";
      break;
    case /nimi/.test(value):
      return "Minu nimi on Rob";
      break;
      case /vanus|vana/.test(value):
        return "Ma olen 42 aastat vana";
        break;
    case /^[0-9+\-*\/\(\)]*$/.test(value):
      return "Vastus: "+ eval(value);
      break;
    case /eur.*usd|usd.*eur/.test(value):
      if(/eur.*usd/){
      return convertFiat(value, true);
    }else {
      console.log("siin");
      convertFiat(value, false);
    }
      break;
      case /kell/.test(value):
        return "Kell on praegu: " + new Date().toLocaleTimeString();
        break;
      case /ilm/.test(value):
      return getIlm(value);
    default:
      return "Kuidas läheb";
  }


function convertFiat(value, convertTo){
//Converts EUR to USD and USD to EUR
//Rates from ECB https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml using https://exchangeratesapi.io/
var rate = 0;
var convert = value.match(/\d/g);
try{
convert = convert.join("");
}catch{
  return "unustasite väärtuse sisestada, proovige uuesti";
}
var result = 0;
var convertIt = jQuery.when(
     jQuery.getJSON('https://api.exchangeratesapi.io/latest')
 ).done( function(json) {

    rate = (json["rates"]["USD"]);

    if(convertTo == true){
      result = convert*rate;

    }else {
      result = convert/rate;
    }

    setTimeout(function(){
      addRobotItemToDOM("Konverteeritud valuuta väärtus: "+ result);
      ///Sound effect
      var snd = new Audio("sounds/msg.mp3");
      snd.play();
  }, 1200);


 });


return "Üks hetk";

}



function getIlm(value){
  ///http://www.ilmateenistus.ee/ilma_andmed/xml/observations.php
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // Typical action to be performed when the document is ready:
         document.getElementById("demo").innerHTML = xhttp.responseText;
      }
  };

  $.ajax({
    type: "GET",
    url: "http://www.ilmateenistus.ee/ilma_andmed/xml/observations.php",
    dataType:"text",
    success: function(xml) {
        console.log("success");
        }
    }
);
}





}
