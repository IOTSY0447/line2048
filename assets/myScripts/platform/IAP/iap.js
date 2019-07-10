window.mylog = console.log
let iap_mob = {
    callback: function (str) {
        mylog('iap call back not implement')
    },
    init: function() {
        if (!cc.sys.isMobile)
            return false
        mylog('iap init')
        sdkbox.IAP.init();
        this.refreshIAP()
    },
    setCallback: function(callback) {
        if (!cc.sys.isMobile)
            return false
            let self = this
            sdkbox.IAP.setListener({
            //检索成功
            onProductRequestSuccess: function(products) {
                mylog('iap  refresh  Success 检索成功');
                self.callback('onProductRequestSuccess',products)
            },
            //检索失败
            onProductRequestFailure: function(msg) {
                mylog('iap refresh fail 检索失败');
                self.callback('onProductRequestFailure', msg)
            },
            //购买成功
            onSuccess: function(p) {
                mylog('iap  bug onsuccess name= 购买成功');
                mylog("购买成功 返回对象" + p)
                self.callback('onBuy',p)
            },
            //购买失败
            onFailure: function(p,msg) {
                mylog('iap 购买失败');
                //this.cacheADByName(name)
                self.callback('onFailure',p,msg)
            },
            //如果用户取消则触发
            onCanceled: function(p) {
                mylog('iap onCanceled 如果用户取消则触发' );
                self.callback('onCanceled',p)
            },
            //恢复购买成功则触发  可以多次触发
            onRestored: function(p) {
                mylog('iap onRestored 恢复购买成功则触发  可以多次触发' );
		console.log(p)
		for (let key in p )
		{
			console.log(key, p[key])
		}
                self.callback('onRestored', p.id == ID_COLLECTION.REMOVEAD)
            },
            //恢复购买回调
            onRestoreComplete:function(ok , msg ){
                mylog('iap onRestored 恢复购买回调' );
                self.callback('onRestoreComplete',ok,msg)
            },

            onShouldAddStorePayment:function(productName ){
                mylog('' );
                self.callback('onShouldAddStorePayment',productName)
            },

            onFetchStorePromotionOrder(productNames , error ) {
                self.callback('onFetchStorePromotionOrder',productNames,error)
            },

            onFetchStorePromotionVisibility(productName  , visibility  , error) {
                self.callback('onFetchStorePromotionVisibility',productName,visibility,error)
            },

            onUpdateStorePromotionOrder(error) {
                self.callback('onUpdateStorePromotionOrder',error)
            },

            onUpdateStorePromotionVisibility(error ) {
                self.callback('onUpdateStorePromotionVisibility',error)
            },
        });
        this.callback = callback
    },

    //检索当前iap
    refreshIAP: function() {
        if (!cc.sys.isMobile)
            return false
        sdkbox.IAP.refresh();
    },

    //进行购买
    remove_ads: function() {
        if (!cc.sys.isMobile)
            return false
        sdkbox.IAP.purchase("remove_ads") //去广告
    },

    remove_ads2: function() {
        if (!cc.sys.isMobile)
            return false
        sdkbox.IAP.purchase("remove_ads2") //去广告
    },

    hint: function() {
        if (!cc.sys.isMobile)
            return false
        sdkbox.IAP.purchase("hint")
    },

    unlock: function() {
        if (!cc.sys.isMobile)
            return false
        sdkbox.IAP.purchase("unlock")
    },

    //恢复购买
    restore: function() {
        if (!cc.sys.isMobile)
            return false
        mylog('iap restore')
        sdkbox.IAP.restore();
    },
}
module.exports = iap_mob