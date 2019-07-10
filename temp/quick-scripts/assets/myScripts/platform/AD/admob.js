(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/myScripts/platform/AD/admob.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1b821FcNftG4pHVlqDyK6By', 'admob', __filename);
// myScripts/platform/AD/admob.js

'use strict';

window.mylog = console.log;
var _reward = 'rewarded';
var bottombanner = 'home';
var fullscreen = 'next_level';
var ad_mob = {

    callback: function callback(str) {
        mylog('ad mob call back not implement');
    },

    init: function init() {

        sdkbox.PluginAdMob.init();
        this.cacheFullScreenAD();
        this.cacheRewardVideoAD();
        this.cacheBannerAD();
    },

    setCallback: function setCallback(callback) {
        var self = this;
        sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function adViewDidReceiveAd(name) {
                mylog("call back admob adViewDidReceiveAd " + name);
                var name2 = '';
                switch (name) {
                    case _reward:
                        name2 = 'reward';
                        break;
                    case bottombanner:
                        name2 = 'bottombanner';
                        break;
                    case fullscreen:
                        name2 = 'fullscreen';
                        break;
                    default:
                        {
                            return;
                        }
                }
                self.callback('success_cache', name2);
            },

            adViewDidFailToReceiveAdWithError: function adViewDidFailToReceiveAdWithError(name, msg) {
                mylog("call back admob adViewDidFailToReceiveAdWithError " + name);
                self.callback('adViewDidFailToReceiveAdWithError', name == _reward);
            },

            adViewWillPresentScreen: function adViewWillPresentScreen(name) {
                mylog("call back admob adViewWillPresentScreen " + name);
                self.callback('adViewWillPresentScreen', name == _reward);
            },

            adViewDidDismissScreen: function adViewDidDismissScreen(name) {
                mylog("call back admob adViewDidDismissScreen " + name);

                var name2 = '';
                switch (name) {
                    case _reward:
                        name2 = 'rewarded';
                        //self.callback('suceess_watch_reward')
                        break;
                    case bottombanner:
                        name2 = 'bottombanner';
                        break;
                    case fullscreen:
                        name2 = 'fullscreen';
                        break;
                    default:
                        {
                            return;
                        }
                }

                self.callback('adViewDidDismissScreen', name == _reward);
            },

            adViewWillDismissScreen: function adViewWillDismissScreen(name) {
                var name2 = '';
                switch (name) {
                    case _reward:
                        name2 = 'rewarded';
                        //self.callback('suceess_watch_reward')
                        break;
                    case bottombanner:
                        name2 = 'bottombanner';
                        break;
                    case fullscreen:
                        name2 = 'fullscreen';
                        break;
                    default:
                        {
                            return;
                        }
                }
                // mylog("call back admob adViewWillDismissScreen " + name)
                //self.callback('adViewWillDismissScreen', name == reward)
            },

            adViewWillLeaveApplication: function adViewWillLeaveApplication(name) {
                mylog("call back admob adViewWillLeaveApplication " + name);
                self.callback('adViewWillLeaveApplication', name == _reward);
            },

            reward: function reward(name) {
                console.log('call back admob reward: ' + name);
                var name2 = '';
                switch (name) {
                    case _reward:
                        name2 = 'rewarded';
                        self.callback('suceess_watch_reward', _reward);
                        break;
                    case bottombanner:
                        name2 = 'bottombanner';
                        break;
                    case fullscreen:
                        name2 = 'fullscreen';
                        break;
                    default:
                        {
                            return;
                        }
                }
            }
        });
        this.callback = callback;
    },

    cacheADByName: function cacheADByName(name) {
        sdkbox.PluginAdMob.cache(name);
    },

    cacheFullScreenAD: function cacheFullScreenAD() {
        mylog("cache full screen");
        this.cacheADByName(fullscreen);
    },

    cacheRewardVideoAD: function cacheRewardVideoAD() {
        mylog("cache reward");
        this.cacheADByName(_reward);
    },

    cacheBannerAD: function cacheBannerAD() {
        mylog("cache banner");
        this.cacheADByName(bottombanner);
    },

    showFullScreenAD: function showFullScreenAD() {
        sdkbox.PluginAdMob.show(fullscreen);
    },

    showRewardVideoAD: function showRewardVideoAD() {
        sdkbox.PluginAdMob.show(_reward);
    },

    showBanner: function showBanner() {
        sdkbox.PluginAdMob.show(bottombanner);
    },

    hideBanner: function hideBanner() {
        sdkbox.PluginAdMob.hide(bottombanner);
    },

    isAvailableByName: function isAvailableByName(name) {
        var available = sdkbox.PluginAdMob.isAvailable(name);

        return available;
    },


    isFullScreenAvailable: function isFullScreenAvailable() {
        return this.isAvailableByName(fullscreen);
    },

    isRewardVideoAvailable: function isRewardVideoAvailable() {
        return this.isAvailableByName(_reward);
    },

    isBannerAvailable: function isBannerAvailable() {
        var available = sdkbox.PluginAdMob.isAvailable(bottombanner);

        return available;
    },

    check: function check() {
        if (!this.isFullScreenAvailable()) {
            this.cacheFullScreenAD();
        }

        if (!this.isRewardVideoAvailable()) {
            this.cacheRewardVideoAD();
        }

        if (!this.isBannerAvailable()) {
            this.cache;
        }
    }
};

module.exports = ad_mob;

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
        //# sourceMappingURL=admob.js.map
        