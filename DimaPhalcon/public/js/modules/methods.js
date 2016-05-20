define(['jq'], function ($jq) {
	var methods = {
        startWaitAnimation: function () { $jq.body.addClass('loading'); },
        stopWaitAnimation: function () { $jq.body.removeClass('loading'); },
        showBody: function() {
            //PREFERENCES.applyCss();
            if ($jq.body.is(":visible")) {return false;}
            $jq.body.fadeIn(350);
            return true;
        }
    };
	
	return methods;
});