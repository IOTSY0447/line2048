(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/myScripts/platform/sys/Util.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2308fwSAiJGKbTeQH85TLNW', 'Util', __filename);
// myScripts/platform/sys/Util.js

"use strict";

window.supportUS = function () {

    var req = "https://itunes.apple.com/app/id" + ID_COLLECTION.APPIP + "?mt=8&action=write-review";
    // let req = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=' + ID_COLLECTION.APPIP
    cc.sys.openURL(req);
};

window.appleShare = function (score) {
    if (cc.sys.os != cc.sys.OS_IOS) return;

    var gameName = 'Plant';

    var desc = "I've just reach " + score + " level in " + gameName + " Try to beat me->\nhttps://itunes.apple.com/app/id" + ID_COLLECTION.APPIP;

    jsb.reflection.callStaticMethod("Hn_Util", "shareToSocialNetwork:", desc);
};

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Util.js.map
        