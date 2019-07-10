window.canVibrate = true
window.readyToVibrate = true;
window.last_vibrate = 0;
window.vibrate1 = function () {
    let time = Number(new Date())
    if(time - last_vibrate < 1000)   return;
    last_vibrate = time;
    if (cc.sys.os != cc.sys.OS_IOS || !window.canVibrate || !window.readyToVibrate) return
    jsb.reflection.callStaticMethod("Hn_Util","vibrate1");
}

window.vibrate2 = function () {
    let time = Number(new Date())
    console.log("手机震动准备2")

    if(time - last_vibrate < 200)   return;
    last_vibrate = time;
    if (cc.sys.os != cc.sys.OS_IOS || !window.canVibrate|| !window.readyToVibrate) return

    console.log("手机震动2")
    jsb.reflection.callStaticMethod("Hn_Util","vibrate2");
}

window.vibrate3 = function () {
    console.log("手机震动准备3")
    if (cc.sys.os != cc.sys.OS_IOS || !window.canVibrate|| !window.readyToVibrate) return
    console.log("手机震动3")
    jsb.reflection.callStaticMethod("Hn_Util","vibrate3");
}

window.vibrate4 = function () {
    console.log("手机震动准备4")
    if (cc.sys.os != cc.sys.OS_IOS || !window.canVibrate|| !window.readyToVibrate) return
    console.log("手机震动4")
    jsb.reflection.callStaticMethod("Hn_Util","vibrate4");
}