const reward ='Level Complete'
const bottombanner ='home'
const fullscreen ='Default'

let chartboost = {
    callback: function(str) {
        mylog('chartboost callback not implement')
    },

    init: function(callback) {
        mylog('chartboost init')

        let self = this
        sdkbox.PluginChartboost.setListener({
            onChartboostCached : function (name) { 
                mylog("AD chartboost onChartboostCached " + name)
                self.callback('onChartboostCached', name == reward)
            },

            onChartboostShouldDisplay : function (name) { 
                mylog("AD chartboost onChartboostShouldDisplay " + name) 
                self.callback('onChartboostShouldDisplay', name == reward)
            },

            onChartboostDisplay : function (name) { 
                mylog("AD chartboost onChartboostDisplay " + name) 
                self.callback('onChartboostDisplay', name == reward)
            },

            onChartboostDismiss : function (name) { 
                mylog("AD chartboost onChartboostDismiss " + name) 
                self.callback('adViewDidDismissScreen', name == reward)
            },

            onChartboostClose : function (name) { 
                //this.cacheADByName(name)
                console.log("AD chartboost onChartboostClose " + name)
                self.callback('onChartboostClose', name == reward)
            },

            onChartboostClick : function (name) { 
                mylog("AD chartboost onChartboostClick " + name)
                self.callback('onChartboostClick', name == reward)
            },

            onChartboostReward : function (name, reward) { 
                mylog("AD chartboost onChartboostReward " + name + " reward " + reward)
                if (reward == 1) {
                    self.callback('suceess_watch_reward')
                }
            },

            onChartboostFailedToLoad : function (name, e) { 
                mylog("AD chartboost onChartboostFailedToLoad " + name + " load error " + e)
                self.callback('onChartboostFailedToLoad', name == reward)
            },

            onChartboostFailToRecordClick : function (name, e) { 
                mylog("AD chartboost onChartboostFailToRecordClick " + name + " load error " + e)
                self.callback('onChartboostFailToRecordClick', name == reward)
            },
            
            onChartboostConfirmation : function () { 
                self.callback('onChartboostConfirmation', false)
            },
            
            onChartboostCompleteStore : function () {
                self.callback('onChartboostCompleteStore', false)
            },
        })

        sdkbox.PluginChartboost.init();
        this.cacheFullScreenAD()
        this.cacheRewardVideoAD()
    },

    setCallback: function(callback) {
        //callback('chart boost init ok')
        this.callback = callback
    },

    cacheADByName: function(name) {
        sdkbox.PluginChartboost.cache(name)
    },

    cacheFullScreenAD: function() {
        mylog('cache chartboost fullscreen')
        this.cacheADByName('Default')
    },

    cacheRewardVideoAD: function() {
        mylog('cache chartboost reward video')
        this.cacheADByName(reward)
    },

    showFullScreenAD: function() {
        mylog('show chartboost fullscreen')
        sdkbox.PluginChartboost.show(fullscreen)
    },

    showRewardVideoAD: function() {
        mylog('show chartboost reward video')
        sdkbox.PluginChartboost.show(reward)
    },

    isAvailableByName(name) {
        let available = sdkbox.PluginChartboost.isAvailable(name)
        mylog('AD chartboost is ' + name + ' available: ' + available)

        return available
    },

    isFullScreenAvailable: function() {
        return this.isAvailableByName(fullscreen)
    },

    isRewardVideoAvailable: function() {
        return this.isAvailableByName(reward)
    },

    isBannerAvailable: function() {
        let available = sdkbox.PluginChartboost.isAvailable('banner')
        mylog('AD chartboost is banner available: ' + available)

        return available
    },

    check: function() {
        if (!this.isFullScreenAvailable()) {
            this.cacheFullScreenAD()
        }

        if (!this.isRewardVideoAvailable()) {
            this.cacheRewardVideoAD()
        }
    },
}

module.exports = chartboost