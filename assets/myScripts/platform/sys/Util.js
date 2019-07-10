window.supportUS = function () {

    let req = "https://itunes.apple.com/app/id" + ID_COLLECTION.APPIP + "?mt=8&action=write-review"
   // let req = 'itms-apps://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?type=Purple+Software&id=' + ID_COLLECTION.APPIP
    cc.sys.openURL(req)
}

window.appleShare = function (score) {
    if (cc.sys.os != cc.sys.OS_IOS) return

    let gameName = 'Plant'

    let desc  = "I've just reach " + score + " level in " + gameName +" Try to beat me->\nhttps://itunes.apple.com/app/id" + ID_COLLECTION.APPIP

    jsb.reflection.callStaticMethod("Hn_Util","shareToSocialNetwork:", desc)
}