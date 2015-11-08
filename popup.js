var found=-1;

function execute_inline_code(code_to_execute, notification_text) {
    notification_text = notification_text || '';
    var s='';
    var done = false;
    chrome.tabs.getAllInWindow(null, function(tabs){
        for (var i = 0; i < tabs.length; i++) {
            s=tabs[i].url;
            s=s.slice(0, 29);
            if(done==false && s.localeCompare("https://www.youtube.com/watch")==0){
                done = true;
                found = tabs[i].id;
                chrome.tabs.executeScript( found, {
                    code: code_to_execute
                });
                if(notification_text.localeCompare('')!=0) {
                    send_notification(notification_text);
                }
            }
        }
    });
}

function send_notification(notification_text) {
    // TODO: Generate notification with notification_text
}

function play_next() {
    execute_inline_code('var x = (document.getElementsByClassName("ytp-next-button")[0].href); document.location = x;');
}

function play_previous() {
    execute_inline_code('window.history.back();');
}

function play_pause_video() {
    execute_inline_code('var vid=document.getElementsByClassName("video-stream")[0]; if(vid.paused) { vid.play(); } else { vid.pause(); } ');
}

function skip_ads() {
    execute_inline_code("var skipButton = document.getElementsByClassName('videoAdUiSkipButton')[0]; skipButton.click();");
}

chrome.commands.onCommand.addListener(function(command) {
    if(command == "prev-track") {
        play_previous();
    } else if(command == "play-pause-track") {
        play_pause_video();
    } else if (command == "next-track") {
        play_next();
    } else if (command == "skip-ads") {
        skip_ads();
    }
});
