var found=-1;

function execute_inline_code(code_to_execute, notification_text) {
    notification_text = notification_text || '';
    var s='';
    var done = false;
    var paused = false;
    chrome.tabs.getAllInWindow(null, function(tabs){
        for (var i = 0; i < tabs.length; i++) {
            s=tabs[i].url;
            s=s.slice(0, 29);
            if(done==false && s.localeCompare("https://www.youtube.com/watch")==0){
                found = tabs[i].id;
                
                

                chrome.tabs.executeScript( found, {
                    code: code_to_execute
                }, function callBack(results) {
                    paused = results;
                });
                if(notification_text.localeCompare('')!=0) {

                    chrome.tabs.get(found,function(tab) {
                        send_notification(notification_text + "\n" + tab.title);
                    });

                    
                }
                else
                {
                    var delay=3000; //3 second

                    setTimeout(function() {
                          chrome.tabs.get(found,function(tab) {
                            send_notification( tab.title );
                        });
                    }, delay);
                    
                }
                done = true;
            }
        }
    });
    return paused;
}

function send_notification(notification_text) {
    n = new Notification( notification_text, {
		body: "",
		icon : "icon48.png"
	});
    setTimeout(n.close.bind(n), 2000);
}

function play_next() {
    execute_inline_code('var x = (document.getElementsByClassName("ytp-next-button")[0].href); document.location = x;');
    
}

function play_previous() {
    execute_inline_code('window.history.back();');
}

function play_pause_video() {
    execute_inline_code('var vid=document.getElementsByClassName("video-stream")[0]; if(vid.paused) { vid.play(); } else { vid.pause(); } vid.paused ',"Video Played/Paused")
}

function skip_ads() {
    execute_inline_code("var skipButton = document.getElementsByClassName('ytp-ad-skip-button ytp-button')[0]; skipButton.click();");
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
