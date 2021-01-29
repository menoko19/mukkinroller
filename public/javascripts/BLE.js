const SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

const start = document.getElementById('start');
const finish = document.getElementById('finish');
const tr = document.getElementById('tr');

var send_value = [];
var previous_count = 0;
var score_string;
var count_time = 0;
var previous_distance = 0;
var startTime = 0;
var endTime = 0;
var time_flag = 1;
var kcal = 0;
var score_int = 0;
var betweenTime = 0;
// Web Bluetoothはユーザーアクションをトリガーに処理を始める必要がある
start.addEventListener('click', (event) => {
  connect();
})

finish.addEventListener('click', (event) => {
  create_form();
});

function connect() {
  // Scan
  navigator.bluetooth.requestDevice({
    // 'Nefry'というデバイス名でフィルタリング
    acceptAllDevices: false,
    filters: [{
      name: ['mukkinroller'],
    }],
    optionalServices: [
      // 使用したいServiceを登録しておく
      SERVICE_UUID
    ]
  })
    // 接続
    .then(device => device.gatt.connect())
    // Service取得
    .then(server => server.getPrimaryService(SERVICE_UUID))
    // Characteristic取得
    .then(service => service.getCharacteristic(CHARACTERISTIC_UUID))
    // Notificationsを開始
    .then(characteristic => setNotifications(characteristic))
    // Errorはこちら
    .catch(error => console.log(error))
}

// Notification設定
const setNotifications = (characteristic) => {

  // Add Event
  characteristic.addEventListener('characteristicvaluechanged', (event) => {
    const value = event.target.value;
    // データをパース
    const decoder = new TextDecoder('utf-8');
    const str = decoder.decode(value);
    values = str.split(",");
    send_value = [];
    for(let v of values) {
      send_value.push(v);
    }
    // Nefry BTからのデータを表示
    var distance_int = Number(values[0]);
    var count_int = Number(values[1]);

    if(time_flag == 1){
      if(distance_int > previous_distance ){
        startTime = Date.now();
        time_flag = 0;
      }
    }

    if(count_int != 0){
      if(count_int > previous_count){
        endTime = Date.now();
        console.log(endTime);
        time_flag = 1;
        betweenTime += endTime - startTime;
        console.log(betweenTime);
        score_int += Math.round((distance_int+(betweenTime/100))/count_int);
        score_string = String(score_int)
        previous_count = count_int;
      }
    }else{
      score_string = "0";
    }

    previous_distance = distance_int;

    var td1 = document.createElement('td');
    td1.textContent = values[0];
    var td2 = document.createElement('td');
    td2.textContent = values[1];
    var td3 = document.createElement('td');
    td3.textContent = score_string;
    kcal = String(roundFloat(send_value[1]*0.3, 1));
    var td4 = document.createElement('td');
    td4.textContent = kcal;
    while(tr.lastChild){
      tr.removeChild(tr.lastChild);
    }
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  })

  // Notifications開始
  characteristic.startNotifications();
}

function create_form(){
  $('#form').remove();
  
  var form = document.createElement('form');
  form.setAttribute('id', 'form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', '/ble');
  document.body.appendChild(form);

  var distance = document.createElement('input');
  distance.setAttribute('type', 'hidden' );
  distance.setAttribute('name', 'distance' );
  distance.setAttribute('value' , send_value[0]);
  form.appendChild(distance);

  var count = document.createElement('input');
  count.setAttribute('type', 'hidden' );
  count.setAttribute('name', 'count' );
  count.setAttribute('value' , send_value[1]);
  form.appendChild(count);

  var score = document.createElement('input');
  score.setAttribute('type', 'hidden' );
  score.setAttribute('name', 'score' );
  score.setAttribute('value' , score_string);
  form.appendChild(score);

  var score = document.createElement('input');
  score.setAttribute('type', 'hidden' );
  score.setAttribute('name', 'kcal' );
  score.setAttribute('value' , kcal);
  form.appendChild(score);

  form.submit();

}

function roundFloat( number, n ) {
  var _pow = Math.pow( 10 , n );
  return Math.round( number * _pow ) / _pow;
}