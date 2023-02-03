
window.onload = function () {
    function updateBatteryStatus(battery) {
        document.querySelector('#charging').textContent ="배터리 상태 : "+ (battery.charging ? '충전중' : '충전중아님');
        document.querySelector('#level').textContent ="배터리 잔량 : "+ battery.level *100 +"%";
        document.querySelector('#dischargingTime').textContent = "남은 배터리 시간 : "+ battery.dischargingTime / 60;
    }

    navigator.getBattery().then(function(battery) {
        // Update the battery status initially when the promise resolves
        updateBatteryStatus(battery);

        //  and for any subsequent updates.
        battery.onchargingchange = function () {
            updateBatteryStatus(battery);
        };

        battery.onlevelchange = function () {
            updateBatteryStatus(battery);
        };

        battery.ondischargingtimechange = function () {
            updateBatteryStatus(battery);
        };
    });
};



function time() {
    let today = new Date();
    let hours = today.getHours(); // 시
    let minutes = today.getMinutes();  // 분
    let seconds = today.getSeconds();  // 초
    // let milliseconds = today.getMilliseconds(); // 밀리초


    window.document.getElementById('time').innerText = '현재시간 : '+(hours< 10 ? '0' : '')+ hours + ':' +(minutes< 10 ? '0' : '')+ minutes + ':' +(seconds< 10 ? '0' : '')+ seconds;


}
setInterval(time, 1000);


window.document.getElementById('find-me').addEventListener("click",()=>{

    location.reload();


})

