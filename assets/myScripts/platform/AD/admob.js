window.mylog = console.log
const reward ='rewarded'
const bottombanner ='home'
const fullscreen ='next_level'
let ad_mob = {

    callback: function (str) {
        mylog('ad mob call back not implement')
    },

    init: function() {

        sdkbox.PluginAdMob.init();
        this.cacheFullScreenAD()
        this.cacheRewardVideoAD()
        this.cacheBannerAD()
    },

    setCallback: function(callback) {
            let self = this
            sdkbox.PluginAdMob.setListener({
            adViewDidReceiveAd: function(name) {
                mylog("call back admob adViewDidReceiveAd " + name)
                let name2 = ''
                switch (name) {
                    case reward:
                        name2 = 'reward'
                        break
                    case bottombanner:
                        name2 = 'bottombanner'
                        break
                    case fullscreen:
                        name2 = 'fullscreen'
                        break
                    default: {
                            return
                    }
                }
                self.callback('success_cache', name2)
            },
            
            adViewDidFailToReceiveAdWithError: function(name, msg) {
                mylog("call back admob adViewDidFailToReceiveAdWithError " + name)
                self.callback('adViewDidFailToReceiveAdWithError', name == reward)
            },

            adViewWillPresentScreen: function(name) {
                mylog("call back admob adViewWillPresentScreen " + name)
                self.callback('adViewWillPresentScreen', name == reward)
            },

            adViewDidDismissScreen: function(name) {
                mylog("call back admob adViewDidDismissScreen " + name)


                let name2 = ''
                switch (name) {
                    case reward:
                        name2 = 'rewarded'
                        //self.callback('suceess_watch_reward')
                        break
                    case bottombanner:
                        name2 = 'bottombanner'
                        break
                    case fullscreen:
                        name2 = 'fullscreen'
                        break
                    default: {
                        return
                    }
                }

                self.callback('adViewDidDismissScreen', name == reward)
            },

            adViewWillDismissScreen: function(name) {
                let name2 = ''
                switch (name) {
                    case reward:
                        name2 = 'rewarded'
                        //self.callback('suceess_watch_reward')
                        break
                    case bottombanner:
                        name2 = 'bottombanner'
                        break
                    case fullscreen:
                        name2 = 'fullscreen'
                        break
                    default: {
                        return
                    }
                }
               // mylog("call back admob adViewWillDismissScreen " + name)
                //self.callback('adViewWillDismissScreen', name == reward)
            },

            adViewWillLeaveApplication: function(name) {
                mylog("call back admob adViewWillLeaveApplication " + name)
                self.callback('adViewWillLeaveApplication', name == reward)
            },

            reward (name) {
                console.log('call back admob reward: '+ name)
                let name2 = ''
                switch (name) {
                    case reward:
                        name2 = 'rewarded'
                        self.callback('suceess_watch_reward', reward)
                        break
                    case bottombanner:
                        name2 = 'bottombanner'
                        break
                    case fullscreen:
                        name2 = 'fullscreen'
                        break
                    default: {
                        return
                    }
                }

            }
        });
        this.callback = callback
    },

    cacheADByName: function(name) {
        sdkbox.PluginAdMob.cache(name)
    },

    cacheFullScreenAD: function() {
        mylog("cache full screen")
        this.cacheADByName(fullscreen)
    },

    cacheRewardVideoAD: function() {
        mylog("cache reward")
        this.cacheADByName(reward)
    },

    cacheBannerAD: function() {
        mylog("cache banner")
        this.cacheADByName(bottombanner)
    },

    showFullScreenAD: function() {
        sdkbox.PluginAdMob.show(fullscreen)
    },

    showRewardVideoAD: function() {
        sdkbox.PluginAdMob.show(reward)
    },


    showBanner: function() {
        sdkbox.PluginAdMob.show(bottombanner)
    },

    hideBanner: function(){
        sdkbox.PluginAdMob.hide(bottombanner)
    },

    isAvailableByName(name) {
        let available = sdkbox.PluginAdMob.isAvailable(name)

        return available
    },

    isFullScreenAvailable: function() {
        return this.isAvailableByName(fullscreen)
    },

    isRewardVideoAvailable: function() {
        return this.isAvailableByName(reward)
    },

    isBannerAvailable: function() {
        let available = sdkbox.PluginAdMob.isAvailable(bottombanner)

        return available
    },

    check: function() {
        if (!this.isFullScreenAvailable()) {
            this.cacheFullScreenAD()
        }

        if (!this.isRewardVideoAvailable()) {
            this.cacheRewardVideoAD()
        }

        if (!this.isBannerAvailable()) {
            this.cache
        }
    },
}

module.exports = ad_mob