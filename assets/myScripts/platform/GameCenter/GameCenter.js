window.mylog = console.log


let gameCenter = {
    ads: {},

    showFullScreenAD() {
        if (!cc.sys.isMobile)
            return false

    },

    fiveStar (){
        if (cc.sys.os != cc.sys.OS_IOS) return

        jsb.reflection.callStaticMethod("gameCenter","FiveStar");
    },

    loadGameCenter () {
        if (cc.sys.os != cc.sys.OS_IOS) return

        jsb.reflection.callStaticMethod("gameCenter","LoadingGameCenter")
    },
// total_time   10000
    // gameCenter(10000, 'total_time')

    gameCenter(name, score){
        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("gameCenter","GameCenter:forCategory:",score,name);
        }
    },

    openGameCenter() {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("gameCenter","OpenGameCenter");
        }
    },

    gameAchievement(name,value){
        if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod("gameCenter","Achievement:percentComplete:",name,value);
        }
    },


    init: function() {
        if (!cc.sys.isMobile)
            return false

        this.loadGameCenter()
    },
}


module.exports = gameCenter