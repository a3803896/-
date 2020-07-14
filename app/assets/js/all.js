let countries = document.querySelector('#countries');
let cyties = document.querySelector('#cyties');

var map = L.map("map", {
    center: [24.994579, 121.311088],
    zoom: 15
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

axios.get("https://3000.gov.tw/hpgapi-openmap/api/getPostData")
    .then((res) => {
        // 處理地圖
        let data = res.data;
        var markers = new L.MarkerClusterGroup().addTo(map);
        data.forEach((item) => {

            //判斷標點顏色
            const iconColor = (() => {
                if (item.total !== 0) {
                    return new L.Icon({
                        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                } else {
                    return new L.Icon({
                        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    });
                }
            })();


            //群組標點.增加圖層(leaflet的標點([座標])).增加popup
            markers.addLayer(
                L.marker([item.latitude, item.longitude], {
                    icon: iconColor
                }).bindPopup(`<div>
                <h4 class="m-0 mb-2 bold">${item.storeNm}</h4>
                <p class="m-0 mb-2 h5 text-danger"><span class="bold">三倍券庫存量：</span>${item.total}</p>
                <p class="m-0 mb-2 h6"><span class="bold">地址：</span>${item.addr}</p>
                <p class="m-0 mb-2 h6"><span class="bold">電話：</span>${item.tel}</p>
                <p class="m-0 mb-2 h6"><span class="bold">營業時間：</span>${item.busiTime}</p>
                <p class="m-0 mb-2 h6"><span class="bold">數據更新時間：</span>${item.updateTime}</p>
                </div>`)
            );
        });
        map.addLayer(markers);

        //自動定位
        function getUserPosition() {
            if (navigator.geolocation) {
                // 成功
                function showPosition(position) {
                    map.setView([position.coords.latitude, position.coords.longitude], 16);
                }
                // 失敗
                function showError() {
                    alert('抱歉，現在無法取的您的地理位置。')
                }
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                alert('抱歉，您的裝置不支援定位功能。');
            }
        }
        getUserPosition();
    })
    .catch(function (error) {
        alert(error);
    })

//製作縣市下拉選單
axios.get('https://raw.githubusercontent.com/Feitoengineer19/mask-map/master/CityCountyData.json')
    .then((res) => {
        let geoData = res.data;
        let countriesOptions = '';
        let cytiesOptions = '';
        countriesOptions = `<option value="" selected disabled>請選擇縣市</option>`;
        geoData.forEach((item, index) => {
            countriesOptions += `<option value="${item.CityName}">${item.CityName}</option>`;
            // console.log(item.AreaList.forEach(item => {
            //     console.log(item.AreaName);
            // }));
        })
        countries.innerHTML = `<select name="" id="countries">${countriesOptions}</select>`;

        countries.addEventListener('change', function () {
            cytiesOptions = '';
            geoData[countries.selectedIndex - 1].AreaList.forEach(item => {
                // console.log(item.AreaName);
                cytiesOptions += `<option value="${item.AreaName}">${item.AreaName}</option>`;
            })
            cyties.innerHTML = `<select name="" id="countries">${cytiesOptions}</select>`;
        })
    })