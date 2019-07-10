"use strict";
cc._RF.push(module, '9861esQbzhIcLEs4yTjrTpL', 'iap');
// myScripts/platform/IAP/iap.js

'use strict';

window.mylog = console.log;
var iap_mob = {
    callback: function callback(str) {
        mylog('iap call back not implement');
    },
    init: function init() {
        if (!cc.sys.isMobile) return false;
        mylog('iap init');
        sdkbox.IAP.init();
        this.refreshIAP();
    },
    setCallback: function setCallback(callback) {
        if (!cc.sys.isMobile) return false;
        var self = this;
        sdkbox.IAP.setListener({
            //检索成功
            onProductRequestSuccess: function onProductRequestSuccess(products) {
                mylog('iap  refresh  Success 检索成功');
                self.callback('onProductRequestSuccess', products);
            },
            //检索失败
            onProductRequestFailure: function onProductRequestFailure(msg) {
                mylog('iap refresh fail 检索失败');
                self.callback('onProductRequestFailure', msg);
            },
            //购买成功
            onSuccess: function onSuccess(p) {
                mylog('iap  bug onsuccess name= 购买成功');
                mylog("购买成功 返回对象" + p);
                self.callback('onBuy', p);
            },
            //购买失败
            onFailure: function onFailure(p, msg) {
                mylog('iap 购买失败');
                //this.cacheADByName(name)
                self.callback('onFailure', p, msg);
            },
            //如果用户取消则触发
            onCanceled: function onCanceled(p) {
                mylog('iap onCanceled 如果用户取消则触发');
                self.callback('onCanceled', p);
            },
            //恢复购买成功则触发  可以多次触发
            onRestored: function onRestored(p) {
                mylog('iap onRestored 恢复购买成功则触发  可以多次触发');
                console.log(p);
                for (var key in p) {
                    console.log(key, p[key]);
                }
                self.callback('onRestored', p.id == ID_COLLECTION.REMOVEAD);
            },
            //恢复购买回调
            onRestoreComplete: function onRestoreComplete(ok, msg) {
                mylog('iap onRestored 恢复购买回调');
                self.callback('onRestoreComplete', ok, msg);
            },

            onShouldAddStorePayment: function onShouldAddStorePayment(productName) {
                mylog('');
                self.callback('onShouldAddStorePayment', productName);
            },

            onFetchStorePromotionOrder: function onFetchStorePromotionOrder(productNames, error) {
                self.callback('onFetchStorePromotionOrder', productNames, error);
            },
            onFetchStorePromotionVisibility: function onFetchStorePromotionVisibility(productName, visibility, error) {
                self.callback('onFetchStorePromotionVisibility', productName, visibility, error);
            },
            onUpdateStorePromotionOrder: function onUpdateStorePromotionOrder(error) {
                self.callback('onUpdateStorePromotionOrder', error);
            },
            onUpdateStorePromotionVisibility: function onUpdateStorePromotionVisibility(error) {
                self.callback('onUpdateStorePromotionVisibility', error);
            }
        });
        this.callback = callback;
    },

    //检索当前iap
    refreshIAP: function refreshIAP() {
        if (!cc.sys.isMobile) return false;
        sdkbox.IAP.refresh();
    },

    //进行购买
    remove_ads: function remove_ads() {
        if (!cc.sys.isMobile) return false;
        sdkbox.IAP.purchase("remove_ads"); //去广告
    },

    remove_ads2: function remove_ads2() {
        if (!cc.sys.isMobile) return false;
        sdkbox.IAP.purchase("remove_ads2"); //去广告
    },

    hint: function hint() {
        if (!cc.sys.isMobile) return false;
        sdkbox.IAP.purchase("hint");
    },

    unlock: function unlock() {
        if (!cc.sys.isMobile) return false;
        sdkbox.IAP.purchase("unlock");
    },

    //恢复购买
    restore: function restore() {
        if (!cc.sys.isMobile) return false;
        mylog('iap restore');
        sdkbox.IAP.restore();
    }
};
module.exports = iap_mob;

cc._RF.pop();