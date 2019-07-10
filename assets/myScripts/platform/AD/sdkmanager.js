window.mylog = console.log
let sdkmanager = {
    ads: {},

    showFullScreenAD: function() {
        if (!cc.sys.isMobile || window.noAD)
            return false

        if (this.ads[0].isFullScreenAvailable()) {
            this.ads[0].showFullScreenAD()

        } 
        else if (this.ads[1].isFullScreenAvailable()) {
            this.ads[1].showFullScreenAD()
            
        } else {
        }

    },

    cacheFullScreenAD: function() {
        if (!cc.sys.isMobile)
            return false

        if (!this.ads[0].isFullScreenAvailable()) {
            this.ads[0].cacheFullScreenAD()

        } else if (!this.ads[1].isFullScreenAvailable()) {
            this.ads[1].cacheFullScreenAD()
            
        } else {

        }

    },

    showRewardVideoAD: function() {
        if (!cc.sys.isMobile)
            return false

        if (this.ads[0].isRewardVideoAvailable()) {
            this.ads[0].showRewardVideoAD()

        } else if (this.ads[1].isRewardVideoAvailable()) {
            this.ads[1].showRewardVideoAD()
            
        } else {
        }

    },

    cacheRewardVideoAD: function() {
        if (!this.ads[0].isRewardVideoAvailable()) {
            this.ads[0].cacheRewardVideoAD()

        } else if (!this.ads[1].isRewardVideoAvailable()) {
            this.ads[1].cacheRewardVideoAD()
            
        } else {

        }
        
    },

    checkADs: function() {
        this.ads[0].check()
        this.ads[1].check()
    },

    showBanner: function() {
        if (!cc.sys.isMobile || window.noAD)
            return false

        if (this.ads[0].isBannerAvailable()) {
            this.ads[0].showBanner()
        } else if (this.ads[1].isBannerAvailable()) {
            this.ads[1].showBanner()
        } else {
            
        }
    },
    hideBanner: function() {
        if (!cc.sys.isMobile)
            return false

        if (this.ads[0].isBannerAvailable()) {
            this.ads[0].hideBanner()
        } else if (this.ads[1].isBannerAvailable()) {
            this.ads[1].hideBanner()
        } else {
            
        }
    },


    isFullScreenAvailable: function() {
        if (!cc.sys.isMobile)
            return false

        return this.ads[0].isFullScreenAvailable() 
                || this.ads[1].isFullScreenAvailable()
    },

    isRewardVideoAvailable: function() {
        if (!cc.sys.isMobile)
            return false

        return this.ads[0].isRewardVideoAvailable() 
                || this.ads[1].isRewardVideoAvailable()
    },

    isBannerAvailable: function() {
        if (!cc.sys.isMobile)
            return false

        return this.ads[0].isBannerAvailable() 
                || this.ads[1].isBannerAvailable()
    },

    setCallback: function(callback) {
        if (!cc.sys.isMobile)
            return false

        mylog('set callback')
        this.ads[0].setCallback(callback)
        this.ads[1].setCallback(callback)
    },

    init: function() {
        if (!cc.sys.isMobile)
            return false
        mylog('init sdkmanager')
        let admob = require('admob')
        let chartboost = require('chartboost')

        admob.init()
        chartboost.init()

        this.ads[0] = admob
        this.ads[1] = chartboost

    },
}

module.exports = sdkmanager