var $formLogin        = $('#login-form');
var $divForms         = $('#div-forms');
var $modalAnimateTime = 300;
var $msgAnimateTime   = 150;
var $msgShowTime      = 2000;

function onPageDetailsReceived(pageDetails) {
    console.log(pageDetails)
    if(typeof pageDetails.title == "undefined"){
        $("#content-title").text("頁面不支援活動行事曆");
        $("#content-detail").text("頁面不支援活動行事曆");
        $("#content-dateTime").text("頁面不支援活動行事曆");
        $("#content-location").text("頁面不支援活動行事曆");
    }else if(pageDetails.errorCode==400 || pageDetails.title==""){
        $("#content-title").text("正在獲取頁面訊息");
        $("#content-detail").text("正在獲取頁面訊息");
        $("#content-dateTime").text("正在獲取頁面訊息");
        $("#content-location").text("正在獲取頁面訊息");
        //再重新獲取頁面訊息
        chrome.runtime.getBackgroundPage(function(eventPage) {
            eventPage.getPageDetails(onPageDetailsReceived);
        });
    }else{
        $("#content-title").text(pageDetails.title);
        $("#content-detail").text(pageDetails.url);
        var getScheduleDate = moment(pageDetails.dateTime).format('YYYY-MM-DD hh:mm:ss A');
        $("#content-dateTime").text(getScheduleDate);
        $("#content-location").text(pageDetails.location);

        //轉換地址到經緯度
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            'address': pageDetails.location
        }, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                $('#Hidden1').val(results[0].geometry.location.lat()); //緯度
                $('#Hidden2').val(results[0].geometry.location.lng()); //經度
                $('#Hidden3').val(results[0].formatted_address); //地址
                $('#Hidden4').val(results[0].place_id); //placeId
            }
        });
    }
}

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.getPageDetails(onPageDetailsReceived);
    });
    // Get the event page
    $(document).ready(function() {
    
    });
});

//抓取background send message
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
 
});

//禁用右鍵
//document.addEventListener('contextmenu', event => event.preventDefault());
