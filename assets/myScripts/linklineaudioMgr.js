////////
cc.Class({
    extends: cc.Component,

    properties: {
        openingMusic:cc.AudioClip,
        music_bg:cc.AudioClip,

        ui_btn:cc.AudioClip,

        touchSound:cc.AudioClip,
        best_score:cc.AudioClip,
        connect_up:cc.AudioClip,
        hammer:cc.AudioClip,
        useHammer:cc.AudioClip,
        high_single_score:cc.AudioClip,
        level_up:cc.AudioClip,
        startBtn:cc.AudioClip,
        connect_close:cc.AudioClip,
        revive:cc.AudioClip,
        switchScene:cc.AudioClip,
        dialog:cc.AudioClip,
        cancel:cc.AudioClip,
        double:cc.AudioClip,
        close2:cc.AudioClip,
    },
    onLoad(){
        this.isHammar = false;
    },
    start () {
        this.linklineinitData();
        this.bgMusic = this.linklineplayMusic_bg();
    },

    linklineinitData:function(){
        
        this.volumeUp = Number(cc.sys.localStorage.getItem("volumeUp"));
          
        this.playBgMusic = Number(cc.sys.localStorage.getItem("playBgMusic"));
        console.log(this.volumeUp,this.playBgMusic)
    },

    linklineplayOpeningMusic:function(){
        if(this.playBgMusic){
            cc.audioEngine.play(this.openingMusic, false, 1);
        }
    },

    linklineplayMusic_bg:function(){
        if(this.playBgMusic){
            return cc.audioEngine.play(this.music_bg, true, 1);
        }
    },

    linklineplayUi_btn:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.ui_btn, false, 1);
        }
    },

    linklineplayTouchSound:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.touchSound, false, 1);
        }
    },

    linklineplayBest_score:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.best_score, false, 1);
        }
    },

    linklineplayConnect_up:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.connect_up, false, 1);
        }
    },

    linklineplayHammer:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.hammer, false, 1);
        }
    },

    linklineplayUseHammer:function(){
        if(this.volumeUp && !this.isHammar){
            this.isHammar = true;
            this.scheduleOnce(function(){
                this.isHammar = false
            },1)
            cc.audioEngine.play(this.useHammer, false, 1);
        }
    },

    linklineplayHigh_single_score:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.high_single_score, false, 1);
        }
    },

    linklineplayLevel_up:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.level_up, false, 1);
        }
    },

    linklineplayStartBtn:function(){
        if(this.volumeUp){
            cc.audioEngine.play(this.startBtn, false, 1);
        }
    },
    // 进阶音
    linklineplayAdvanced:function(index){
        var path = cc.url.raw("resources/linklineaudios/linklineconnect/linklineconnnect0" + index + ".mp3");
        if(this.volumeUp){
            console.log("advanced!!!");
            cc.audioEngine.play(path, false, 1);
        }
    },

    linklineplaySwitch(){
        if(this.volumeUp){
            cc.audioEngine.play(this.switchScene, false, 1);
        }
    },
    linklineplayDialog(){
        if(this.volumeUp){
            cc.audioEngine.play(this.dialog, false, 1);
        }
    },

    linklineplayConnect_close(){
        if(this.volumeUp){
            cc.audioEngine.play(this.connect_close, false, 1);
        }
    },
    linklineplayRevive(){
        if(this.volumeUp){
            cc.audioEngine.play(this.revive, false, 1);
        }
    },

    linklineplayCancel(){
        if(this.volumeUp){
            cc.audioEngine.play(this.cancel, false, 1);
        }
    },
    linklineplayDouble(){
        if(this.volumeUp){
            cc.audioEngine.play(this.double, false, 1);
        }
    },
    linklineplayClose2(){
        if(this.volumeUp){
            cc.audioEngine.play(this.close2, false, 1);
        }
    }
    // update (dt) {},
});
