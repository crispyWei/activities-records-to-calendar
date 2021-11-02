var $formLogin        = $('#login-form');
var $divForms         = $('#div-forms');
var $modalAnimateTime = 300;
var $msgAnimateTime   = 150;
var $msgShowTime      = 2000;
var submitData        = {};

function onPageDetailsReceived(pageDetails) {
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
        var startScheduleDate = moment(pageDetails.startTime).format('YYYY-MM-DD hh:mm:ss A');
        var endScheduleDate   = moment(pageDetails.endTime).format('YYYY-MM-DD hh:mm:ss A');
        $("#content-dateTime").html(startScheduleDate +"<br/>"+endScheduleDate);
        $("#content-location").text(pageDetails.location);
        submitData = pageDetails;
    }
}
// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    chrome.runtime.getBackgroundPage(function(eventPage) {
        eventPage.getPageDetails(onPageDetailsReceived);
    });
    // Get the event page
    $(document).ready(function() {
        $("#saveScheduleToCalendar").on('click', function() {
            chrome.identity.getAuthToken({ 'interactive': true },
            function(current_token) {
                if (!chrome.runtime.lastError) {
                    chrome.identity.removeCachedAuthToken({ token: current_token },
                        function() {});
                    var event = {
                        summary: submitData["title"],
                        description: submitData["location"],
                        start: {
                            'dateTime': moment(submitData["startTime"],'YYYY-MM-DD HH:mm').toDate()
                        }
                        ,
                        end: {
                            'dateTime':  moment(submitData["endTime"],'YYYY-MM-DD HH:mm').toDate()
                        }
                    };
                    console.log(event);
                    // return false;
                    var fetch_options = {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${current_token}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(event),
                    };
                    fetch(
                        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                        fetch_options
                    )
                    .then((response) => response.json())
                    .then(function (data) {
                        console.log(data);
                        if(data["status"]=="confirmed"){
                            window.close();
                            alert("已成功匯入Google行事曆");
                        }else{
                            alert(data["error"]["message"]);
                        }
                    });
                }else{
                    alert("無法取得相關Google Calendar API");
                }
            });
        });
    });
});

//抓取background send message
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
 
});

//禁用右鍵
//document.addEventListener('contextmenu', event => event.preventDefault());
