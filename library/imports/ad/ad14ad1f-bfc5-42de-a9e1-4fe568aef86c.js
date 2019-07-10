"use strict";
cc._RF.push(module, 'ad14a0fv8VC3qnhT+Vorvhs', 'GameCenter');
// myScripts/platform/GameCenter/GameCenter.js

"use strict";

window.mylog = console.log;

var gameCenter = {
    ads: {},

    showFullScreenAD: function showFullScreenAD() {
        if (!cc.sys.isMobile) return false;
    },
    fiveStar: function fiveStar() {
        if (cc.sys.os != cc.sys.OS_IOS) return;

        jsb.reflection.callStaticMethod("gameCenter", "FiveStar");
    },
    loadGameCenter: function loadGameCenter() {
        if (cc.sys.os != cc.sys.OS_IOS) return;

        jsb.reflection.callStaticMethod("gameCenter", "LoadingGameCenter");
    },

    // total_time   10000
    // gameCenter(10000, 'total_time')

    gameCenter: function gameCenter(name, score) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("gameCenter", "GameCenter:forCategory:", score, name);
        }
    },
    openGameCenter: function openGameCenter() {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("gameCenter", "OpenGameCenter");
        }
    },
    gameAchievement: function gameAchievement(name, value) {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("gameCenter", "Achievement:percentComplete:", name, value);
        }
    },


    init: function init() {
        if (!cc.sys.isMobile) return false;

        this.loadGameCenter();
    }
};

module.exports = gameCenter;

cc._RF.pop();