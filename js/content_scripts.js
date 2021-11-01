switch (config.param1) {
    case "accupass": //accupass活動

        var dateTime = "";
        try{
            var dateTime = getUrlVars(document.getElementsByClassName("style-cc266487-calendar-link")[0].getAttribute("href"))['dates'];
            dateTime     = decodeURIComponent(dateTime).split("/")[0];
        }catch (error){
        }
        var tagHref = document.getElementsByClassName("style-e6c7200c-event-detail-link");
        var locationText = "";
        for (var i = 0; i < tagHref.length; i++) {
            try {
                locationText =tagHref.item(i).getElementsByTagName('div')[0].innerText;
            } catch (error) {
            }
        }
        chrome.runtime.sendMessage({
            'title': document.getElementsByClassName("style-41874173-event-title")[0].innerText,
            'location': locationText,
            'dateTime':dateTime,
            'url': window.location.href
        });
        break;
    case "ticket": //年代售票系統
        var getDate     = getUrlVars(document.getElementsByTagName("area")[0].getAttribute("href"))["PE"];//日期
        var getTime     = getUrlVars(document.getElementsByTagName("area")[0].getAttribute("href"))["PF"];//時間
        var getTitle    = getUrlVars(document.getElementsByTagName("area")[0].getAttribute("href"))["PK"];//標題
        var getLocation = getUrlVars(document.getElementsByTagName("area")[0].getAttribute("href"))["PL"];//地點
        var PA = getParameterByName('PA',document.getElementsByTagName("area")[0].getAttribute("href"));

        chrome.runtime.sendMessage({
            'title': getTitle,
            'location': getLocation,
            'dateTime':getDate +" "+ getTime,
            'url':'http://www.ticket.com.tw/dm.asp?P1='+PA
        });
        break;
    case "eztravel": //易遊網
        var getTitle    = $(".headerText").text();//標題
        var getLocation = $(".transInfo-outTravel tbody > tr:eq(1)").children('td:eq(2)').text();
        var getDate     = $(".orderDetails tbody > tr:eq(1)").children('td:eq(0)').text();
        chrome.runtime.sendMessage({
            'title': getTitle,
            'location': getLocation,
            'dateTime':getDate +" "+ "08:00",
            'url':'http://www.eztravel.com.tw'
        });
        break;
    case "colatour": //可樂旅遊
        var getTitle    = $("#Panel_Detail table").find("#Table6").find('td:eq(0)').text();//標題
        var getLocation = "";
        var getDate     = $("#Panel_Detail table").find("#Table6").find('td:eq(1)').text().trim().split('：');
        chrome.runtime.sendMessage({
            'title': getTitle,
            'location': "石碇千島湖夢幻景緻1日遊",
            'dateTime':getDate[1] +" "+ "08:00",
            'url':'www.colatour.com.tw'
        });
        break;
    default:
       chrome.runtime.sendMessage({
            'errorCode':400,
            'title': "請確認頁面資訊是否載入完成",
            'location': "請確認頁面資訊是否載入完成",
            'dateTime': "請確認頁面資訊是否載入完成",
            'url': "獲取訊息失敗,請確認頁面資訊是否載入完成"
        });
}
function getUrlVars(url){
    var vars = [], hash;
    var hashes = url.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}