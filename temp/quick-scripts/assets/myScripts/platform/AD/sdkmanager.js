(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/myScripts/platform/AD/sdkmanager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1cf3eoFpGZDSp0SVwgQpath', 'sdkmanager', __filename);
// myScripts/platform/AD/sdkmanager.js

'use strict';

window.mylog = console.log;
var sdkmanager = {
    ads: {},

    showFullScreenAD: function showFullScreenAD() {
        if (!cc.sys.isMobile || window.noAD) return false;

        if (this.ads[0].isFullScreenAvailable()) {
            this.ads[0].showFullScreenAD();
        } else if (this.ads[1].isFullScreenAvailable()) {
            this.ads[1].showFullScreenAD();
        } else {}
    },

    cacheFullScreenAD: function cacheFullScreenAD() {
        if (!cc.sys.isMobile) return false;

        if (!this.ads[0].isFullScreenAvailable()) {
            this.ads[0].cacheFullScreenAD();
        } else if (!this.ads[1].isFullScreenAvailable()) {
            this.ads[1].cacheFullScreenAD();
        } else {}
    },

    showRewardVideoAD: function showRewardVideoAD() {
        if (!cc.sys.isMobile) return false;

        if (this.ads[0].isRewardVideoAvailable()) {
            this.ads[0].showRewardVideoAD();
        } else if (this.ads[1].isRewardVideoAvailable()) {
            this.ads[1].showRewardVideoAD();
        } else {}
    },

    cacheRewardVideoAD: function cacheRewardVideoAD() {
        if (!this.ads[0].isRewardVideoAvailable()) {
            this.ads[0].cacheRewardVideoAD();
        } else if (!this.ads[1].isRewardVideoAvailable()) {
            this.ads[1].cacheRewardVideoAD();
        } else {}
    },

    checkADs: function checkADs() {
        this.ads[0].check();
        this.ads[1].check();
    },

    showBanner: function showBanner() {
        if (!cc.sys.isMobile || window.noAD) return false;

        if (this.ads[0].isBannerAvailable()) {
            this.ads[0].showBanner();
        } else if (this.ads[1].isBannerAvailable()) {
            this.ads[1].showBanner();
        } else {}
    },
    hideBanner: function hideBanner() {
        if (!cc.sys.isMobile) return false;

        if (this.ads[0].isBannerAvailable()) {
            this.ads[0].hideBanner();
        } else if (this.ads[1].isBannerAvailable()) {
            this.ads[1].hideBanner();
        } else {}
    },

    isFullScreenAvailable: function isFullScreenAvailable() {
        if (!cc.sys.isMobile) return false;

        return this.ads[0].isFullScreenAvailable() || this.ads[1].isFullScreenAvailable();
    },

    isRewardVideoAvailable: function isRewardVideoAvailable() {
        if (!cc.sys.isMobile) return false;

        return this.ads[0].isRewardVideoAvailable() || this.ads[1].isRewardVideoAvailable();
    },

    isBannerAvailable: function isBannerAvailable() {
        if (!cc.sys.isMobile) return false;

        return this.ads[0].isBannerAvailable() || this.ads[1].isBannerAvailable();
    },

    setCallback: function setCallback(callback) {
        if (!cc.sys.isMobile) return false;

        mylog('set callback');
        this.ads[0].setCallback(callback);
        this.ads[1].setCallback(callback);
    },

    init: function init() {
        if (!cc.sys.isMobile) return false;
        mylog('init sdkmanager');
        var admob = require('admob');
        var chartboost = require('chartboost');

        admob.init();
        chartboost.init();

        this.ads[0] = admob;
        this.ads[1] = chartboost;
    }
};

module.exports = sdkmanager;

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
        //# sourceMappingURL=sdkmanager.js.map
        