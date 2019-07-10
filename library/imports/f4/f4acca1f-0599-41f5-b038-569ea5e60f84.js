"use strict";
cc._RF.push(module, 'f4accofBZlB9bA4Vp6l5g+E', 'chartboost');
// myScripts/platform/AD/chartboost.js

'use strict';

var reward = 'Level Complete';
var bottombanner = 'home';
var fullscreen = 'Default';

var chartboost = {
    callback: function callback(str) {
        mylog('chartboost callback not implement');
    },

    init: function init(callback) {
        mylog('chartboost init');

        var self = this;
        sdkbox.PluginChartboost.setListener({
            onChartboostCached: function onChartboostCached(name) {
                mylog("AD chartboost onChartboostCached " + name);
                self.callback('onChartboostCached', name == reward);
            },

            onChartboostShouldDisplay: function onChartboostShouldDisplay(name) {
                mylog("AD chartboost onChartboostShouldDisplay " + name);
                self.callback('onChartboostShouldDisplay', name == reward);
            },

            onChartboostDisplay: function onChartboostDisplay(name) {
                mylog("AD chartboost onChartboostDisplay " + name);
                self.callback('onChartboostDisplay', name == reward);
            },

            onChartboostDismiss: function onChartboostDismiss(name) {
                mylog("AD chartboost onChartboostDismiss " + name);
                self.callback('adViewDidDismissScreen', name == reward);
            },

            onChartboostClose: function onChartboostClose(name) {
                //this.cacheADByName(name)
                console.log("AD chartboost onChartboostClose " + name);
                self.callback('onChartboostClose', name == reward);
            },

            onChartboostClick: function onChartboostClick(name) {
                mylog("AD chartboost onChartboostClick " + name);
                self.callback('onChartboostClick', name == reward);
            },

            onChartboostReward: function onChartboostReward(name, reward) {
                mylog("AD chartboost onChartboostReward " + name + " reward " + reward);
                if (reward == 1) {
                    self.callback('suceess_watch_reward');
                }
            },

            onChartboostFailedToLoad: function onChartboostFailedToLoad(name, e) {
                mylog("AD chartboost onChartboostFailedToLoad " + name + " load error " + e);
                self.callback('onChartboostFailedToLoad', name == reward);
            },

            onChartboostFailToRecordClick: function onChartboostFailToRecordClick(name, e) {
                mylog("AD chartboost onChartboostFailToRecordClick " + name + " load error " + e);
                self.callback('onChartboostFailToRecordClick', name == reward);
            },

            onChartboostConfirmation: function onChartboostConfirmation() {
                self.callback('onChartboostConfirmation', false);
            },

            onChartboostCompleteStore: function onChartboostCompleteStore() {
                self.callback('onChartboostCompleteStore', false);
            }
        });

        sdkbox.PluginChartboost.init();
        this.cacheFullScreenAD();
        this.cacheRewardVideoAD();
    },

    setCallback: function setCallback(callback) {
        //callback('chart boost init ok')
        this.callback = callback;
    },

    cacheADByName: function cacheADByName(name) {
        sdkbox.PluginChartboost.cache(name);
    },

    cacheFullScreenAD: function cacheFullScreenAD() {
        mylog('cache chartboost fullscreen');
        this.cacheADByName('Default');
    },

    cacheRewardVideoAD: function cacheRewardVideoAD() {
        mylog('cache chartboost reward video');
        this.cacheADByName(reward);
    },

    showFullScreenAD: function showFullScreenAD() {
        mylog('show chartboost fullscreen');
        sdkbox.PluginChartboost.show(fullscreen);
    },

    showRewardVideoAD: function showRewardVideoAD() {
        mylog('show chartboost reward video');
        sdkbox.PluginChartboost.show(reward);
    },

    isAvailableByName: function isAvailableByName(name) {
        var available = sdkbox.PluginChartboost.isAvailable(name);
        mylog('AD chartboost is ' + name + ' available: ' + available);

        return available;
    },


    isFullScreenAvailable: function isFullScreenAvailable() {
        return this.isAvailableByName(fullscreen);
    },

    isRewardVideoAvailable: function isRewardVideoAvailable() {
        return this.isAvailableByName(reward);
    },

    isBannerAvailable: function isBannerAvailable() {
        var available = sdkbox.PluginChartboost.isAvailable('banner');
        mylog('AD chartboost is banner available: ' + available);

        return available;
    },

    check: function check() {
        if (!this.isFullScreenAvailable()) {
            this.cacheFullScreenAD();
        }

        if (!this.isRewardVideoAvailable()) {
            this.cacheRewardVideoAD();
        }
    }
};

module.exports = chartboost;

cc._RF.pop();