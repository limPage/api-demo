

window.addEventListener("load",()=>{

    window.document.getElementById('myLocation').innerText = "현재 내 위치 위도 : "+ lat +"°, 경도 : "+ lng +"°";

});

const btn = document.querySelector('#share');
const resultPara = document.querySelector('.result');
let locationHref ;



btn.addEventListener('click', async () => {


    let shareData = {

        title: '위치를 공유합니다.',
        text: (window.document.querySelector('.number-address')?window.document.querySelector('.number-address').innerText:'')
            +'\n'+(window.document.querySelector('.street-address')?window.document.querySelector('.street-address').innerText:''
                )
        ,
        url: '\thttps://map.kakao.com/link/map/공유 위치,'+locationHref
    }

    try {
        await navigator.share(shareData)
        resultPara.textContent = 'shared successfully'
    } catch (err) {
        resultPara.textContent = `Error: ${err}`
    }
});


let lat;
let lng;
let mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

let map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성

// geolocation으로 사용할 수 있는지 확인
if (navigator.geolocation) {
    // GeoLocation위치
    navigator.geolocation.getCurrentPosition(function(position) {
        locationHref=position.coords.latitude+','+position.coords.longitude;


        lat = position.coords.latitude; // 위도
            lng = position.coords.longitude; // 경도

        let locPosition = new kakao.maps.LatLng(lat, lng),
            message = '현재위치 입니다.';
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);

    });

} else {
    let locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
        message = '위치 탐색 실패'

    displayMarker(locPosition, message);
}

// 지도에 마커와 인포윈도우를 표시
function displayMarker(locPosition, message) {

      marker = new kakao.maps.Marker({
        map: map,
        position: locPosition
    });
    let iwContent = message,
        iwRemoveable = true;

    // 인포윈도우
    let infowindow = new kakao.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    marker.setDraggable(true);
    infowindow.open(map, marker);
    // 지도 중심좌표를 접속위치로 변경
    map.setCenter(locPosition);
}



// 주소-좌표 변환 객체를 생성합니다
let geocoder = new kakao.maps.services.Geocoder();

let marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커입
    infowindow = new kakao.maps.InfoWindow({zindex:10}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우

searchAddrFromCoords(map.getCenter(), displayCenterInfo);

// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트 등록
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
    searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
        // console.log(mouseEvent.latLng)
        if (status === kakao.maps.services.Status.OK) {
            var detailAddr = !!result[0].road_address ? '<div class="street-address">도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
            detailAddr += '<div class="number-address">지번 주소 : ' + result[0].address.address_name + '</div>';

            var content = '<div class="bAddr">' +
                '<span class="title">법정동 주소정보</span>' +
                detailAddr +
                '</div>';

            // 마커를 클릭한 위치에 표시합
            marker.setPosition(mouseEvent.latLng);
            marker.setMap(map);

            // 인포윈도우에 클릭한 위치에 대한 상세 주소정보 표시
            infowindow.setContent(content);
            infowindow.open(map, marker);

            locationHref=mouseEvent.latLng.getLat()+','+mouseEvent.latLng.getLng();
            window.document.getElementById('myLocation').innerText = "현재 내 위치 위도 : "+ mouseEvent.latLng.getLat() +"°, 경도 : "+ mouseEvent.latLng.getLng() +"°";
        }
    });
});

// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트 등록
kakao.maps.event.addListener(map, 'idle', function() {
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보
function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        let infoDiv = document.getElementById('centerAddr');

        for(let i = 0; i < result.length; i++) {
            //  region_type 값은 'H' 이므로
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].address_name;
                break;
            }
        }
    }
}
let shareData = {

    title: '위치를 공유합니다.',
    text: (window.document.querySelector('.number-address')?window.document.querySelector('.number-address').innerText:'')
        +'\n'+(window.document.querySelector('.street-address')?window.document.querySelector('.street-address').innerText:''
        )
    ,
    url: 'https://www.google.co.kr/maps/place/'+locationHref
}