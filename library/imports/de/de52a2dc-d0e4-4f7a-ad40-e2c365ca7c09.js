"use strict";
cc._RF.push(module, 'de52aLc0ORPeq1A4sNlynwJ', 'linklinegameMgr');
// myScripts/linklinegameMgr.js

"use strict";

var dataMgr = require("linklinedataMgr");

window.myADMgr = require("sdkmanager");

window.myGameCenterMgr = require("GameCenter");

window.myIAPMgr = require("iap");

//cc.director.setDisplayStats(true)

cc.Class({
    extends: cc.Component,

    properties: {

        gameMenu: cc.Node, // 游戏菜单界面

        gameAssist: cc.Node, // 游戏帮助

        gameNode: cc.Node, // 游戏主界面

        // 音效、背景音乐 图集
        bgMusicSprite1: cc.SpriteFrame,
        bgMusicSprite2: cc.SpriteFrame,

        soundSprite1: cc.SpriteFrame,
        soundSprite2: cc.SpriteFrame,

        logo: sp.Skeleton,
        btn: [cc.Node],
        fiveStarNode: cc.Node,
        removeAd_btn: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (noAD) {
            this.gameMenu.getChildByName("gameMenuBottom").getChildByName("removeAd").active = false;
            this.gameNode.getChildByName("gameover").getChildByName('gameoverBtns').getChildByName('scoreRemoveAdsFloor').active = false;
            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("removeAdBtn").getComponent(cc.Button).interactable = false;
            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("restoreBtn").getComponent(cc.Button).interactable = false;
        }
        this.audioMgr = cc.find("Canvas").getComponent("linklineaudioMgr");
        this.isToRelive = false;

        this.linklinefullScreen();
        this.linklineinitData();
        this.linklineinitAD_gameCenter_iap();
        this.scheduleOnce(function () {
            // banner
            if (!noAD) {
                console.log("banner!!!");
                if (myADMgr.isBannerAvailable() && Math.random() < AD_CONFIG.BANNER / 100) {
                    console.log("show banner !!!");
                    myADMgr.showBanner();
                }
            }
            // 二次登陆 全屏广告
            if (!noAD && this.loginTimes >= AD_CONFIG.LOGIN_TIMES) {
                console.log("full screen !!!");
                if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.LOGIN_PRO / 100) {
                    console.log("full screen !!!");
                    myADMgr.showFullScreenAD();
                }
            }
            // 切换app 全屏广告
            // if(!noAD){
            //     if(Math.random() < AD_CONFIG.CHANGEAPP_PRO/100 && myADMgr.isFullScreenAvailable()){
            //         cc.game.on(cc.game.EVENT_SHOW, function () {
            //             console.log("cc.game show!!!");
            //             myADMgr.showFullScreenAD();
            //         });
            //     }
            // }
        }, 3.0);

        // 内购、去广告回调

        myIAPMgr.setCallback(function (name, p) {
            console.log("iap回调: " + name + "," + p);
            switch (name) {
                // 恢复购买成功
                case 'onRestored':
                    console.log("p:  " + p);
                    if (p) {
                        console.log("恢复购买成功");
                        noAD = true;
                        cc.sys.localStorage.setItem("noAD", "true");
                        if (noAD) {
                            this.gameMenu.getChildByName("gameMenuBottom").getChildByName("removeAd").active = false;
                            this.gameNode.getChildByName("gameover").getChildByName('gameoverBtns').getChildByName('scoreRemoveAdsFloor').active = false;
                            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("removeAdBtn").getComponent(cc.Button).interactable = false;
                            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("restoreBtn").getComponent(cc.Button).interactable = false;
                            myADMgr.hideBanner();
                        }
                    }
                    console.log('name: ' + p);
                    break;
                case "onRestoreComplete":
                    break;

                // 购买成功
                case "onBuy":
                    console.log("p:  " + p);
                    if (p.id == ID_COLLECTION.REMOVEAD) {
                        console.log("恢复购买成功222");
                        noAD = true;
                        cc.sys.localStorage.setItem("noAD", "true");
                        if (noAD) {
                            this.gameMenu.getChildByName("gameMenuBottom").getChildByName("removeAd").active = false;
                            this.gameNode.getChildByName("gameover").getChildByName('gameoverBtns').getChildByName('scoreRemoveAdsFloor').active = false;
                            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("removeAdBtn").getComponent(cc.Button).interactable = false;
                            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("restoreBtn").getComponent(cc.Button).interactable = false;
                            myADMgr.hideBanner();
                        }
                    }
                    break;

                default:
                    break;
            }
        }.bind(this));

        // 广告回调
        //myADMgr.setCallback(this.adCallback.bind(this));

        console.log("noAD: " + noAD);
    },

    // 适配
    linklinefullScreen: function linklinefullScreen() {

        //cc.director.setDisplayStats(true);

        window.widthOS = cc.view.getFrameSize().width;
        window.heightOS = cc.view.getFrameSize().height;
        if (widthOS / heightOS == 0.75) {
            console.log("ipad");
            cc.find('Canvas').getComponent(cc.Canvas).fitHeight = true;
        } else if (heightOS == 2436) {
            console.log("X");
            cc.find('Canvas').getComponent(cc.Canvas).fitWidth = true;
            this.removeAd_btn.setPositionY(715.5);
        }
    },

    linklineinitData: function linklineinitData() {
        // 初始位置
        this.gameAssistPos = this.gameAssist.getPosition();
        this.gameMenuPos = this.gameMenu.getPosition();
        this.gameNodePos = this.gameNode.getPosition();

        this.isFirst = parseInt(dataMgr.myLocalMgr.isFirstTimeLoad); // 是否第一次登录游戏

        // 游戏菜单界面
        this.noInterMes = cc.find('Canvas/noInternetMes');
        // 
        this.totalTime = parseInt(dataMgr.myLocalMgr.totalTime);

        // 统计登录次数
        this.loginTimes = parseInt(dataMgr.myLocalMgr.loginTimes);
        this.loginTimes++;
        cc.sys.localStorage.setItem("loginTimes", this.loginTimes);
        //console.log(cc.sys.localStorage.getItem("loginTimes"));

        this.toRelive = false;

        this.slideNodeX = this.node.getPositionX();
        this.slideNodeY = this.node.getPositionY();
        //console.log("slide : " + this.slideNodeX,this.slideNodeY);

        this.isCount = false;
        //cc.sys.localStorage.clear();
        //恢复设置
        if (cc.sys.localStorage.getItem('volumeUp') == null) {
            console.log('开启音效');
            cc.sys.localStorage.setItem('volumeUp', 1);
            cc.sys.localStorage.setItem('playBgMusic', 1);
        }
        if (!Number(cc.sys.localStorage.getItem('volumeUp'))) {
            cc.find('Canvas/gameMenu/settings/settingBtns/soundBtnBg/soundBtn').getComponent(cc.Sprite).spriteFrame = this.soundSprite2;
            cc.find('Canvas/gameMenu/settings/settingBtns/soundBtnBg').setPositionX(55.5);
        }
        if (!Number(cc.sys.localStorage.getItem('playBgMusic'))) {
            cc.find('Canvas/gameMenu/settings/settingBtns/musicBtnBg/musicBtn').getComponent(cc.Sprite).spriteFrame = this.bgMusicSprite2;
            cc.find('Canvas/gameMenu/settings/settingBtns/musicBtnBg').setPositionX(55.5);
        }
        //恢复皮肤
        if (!cc.sys.localStorage.getItem('nightMode')) {
            cc.sys.localStorage.setItem('nightMode', 1);
        }
        if (!Number(cc.sys.localStorage.getItem('nightMode'))) {
            cc.find('Canvas/gameMenu/gameMenuBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineMenuSources/linklineback001.png'));
            cc.find('Canvas/game/gameBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame001.png'));
            cc.find('Canvas/game/boardMask/board').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame002.png'));
            cc.find('Canvas/gameMenu/gameSkin/themes/nightBtn/themesTickBtn').active = false;
            cc.find('Canvas/gameMenu/gameSkin/themes/dayBtn/themesTickBtn').active = true;
        } else {
            cc.find('Canvas/gameMenu/gameMenuBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineMenuSources/linklineback002.png'));
            cc.find('Canvas/game/gameBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame003.png'));
            cc.find('Canvas/game/boardMask/board').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame004.png'));
            cc.find('Canvas/gameMenu/gameSkin/themes/nightBtn/themesTickBtn').active = true;
            cc.find('Canvas/gameMenu/gameSkin/themes/dayBtn/themesTickBtn').active = false;
        }
    },

    // 广告 游戏中心 iap 初始化
    linklineinitAD_gameCenter_iap: function linklineinitAD_gameCenter_iap() {
        myADMgr.init();
        myGameCenterMgr.init();
        myIAPMgr.init();
    },

    start: function start() {
        this.linklinemyFadeIn(this.gameMenu);
        for (var i = 0; i < this.btn.length; i++) {
            this.linklinemoveBtn(this.btn[i]);
        }
        this.logo.setAnimation(1, 'start', false);
        this.logo.addAnimation(1, 'wait', true);

        this.removeAd_btn.getChildByName('off001').runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.15, -30), cc.rotateTo(0.15, 30), cc.rotateTo(0.075, 0), cc.delayTime(1))));
    },

    // 计时
    update: function update(dt) {
        this.totalTime += dt;
        dataMgr.myLocalMgr.totalTime = this.totalTime;
    },

    // 界面淡入
    linklinemyFadeIn: function linklinemyFadeIn(node) {
        node.opacity = 0;
        node.setPosition(0, 0);
        node.runAction(cc.fadeIn(0.3));
    },
    // 界面淡出
    linklinemyFadeOut: function linklinemyFadeOut(node, pos) {
        var myCallFunc = cc.callFunc(function () {
            // callFunc 要写前面
            node.setPosition(pos);
        });
        node.runAction(cc.sequence(cc.fadeOut(0.3), myCallFunc));
    },

    linklinemyMoveLeft: function linklinemyMoveLeft(node) {
        node.runAction(cc.moveBy(0.3, cc.v2(-852, 0)));
    },
    linklinemyMoveRight: function linklinemyMoveRight(node) {
        //node.setPosition(cc.v2(852,0));
        node.runAction(cc.moveBy(0.3, cc.v2(852, 0)));
    },


    // 弹窗出现
    linklinemySlideIn: function linklinemySlideIn(node) {
        node.parent.getChildByName('block').runAction(cc.fadeIn(0.3));
        node.setPosition(0, 1000);
        node.runAction(cc.moveTo(0.3, cc.v2(0, 0)).easing(cc.easeBackOut()));
    },
    // 弹窗消失
    linklinemySlideOut: function linklinemySlideOut(node) {
        node.parent.getChildByName('block').runAction(cc.fadeOut(0.3));
        node.runAction(cc.sequence(cc.moveTo(0.3, cc.v2(0, -1000)).easing(cc.easeBackIn()), cc.callFunc(function () {
            node.setPosition(0, 0);
            node.parent.active = false;
        })));
    },

    // 游戏菜单界面button
    linklinestartGameBtn: function linklinestartGameBtn() {
        this.audioMgr.linklineplayUi_btn();
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            this.audioMgr.linklineplaySwitch();

            this.linklinemyMoveLeft(this.gameMenu);
            if (this.isFirst) {
                this.isFirst = 0;
                cc.sys.localStorage.setItem("isFirstLoad", 0);
                console.log(cc.sys.localStorage.getItem("isFirstLoad"));
                this.gameAssist.setPosition(cc.v2(852, 0));
                this.linklinemyMoveLeft(this.gameAssist);
                this.gameAssist.getComponent('linklineassist').linklineloadPage();
            } else {
                // 游戏菜单界面
                this.linklinemyMoveLeft(this.gameNode);
                this.scheduleOnce(function () {
                    var js = this.gameNode.getComponent("linklinegame");
                    js.linklinechunkAct();
                }, 0.3);
            }
        }, 0.2);
    },
    // 新手教程
    linklinehowToPlayBtn: function linklinehowToPlayBtn() {
        this.audioMgr.linklineplayUi_btn();
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            this.audioMgr.linklineplaySwitch();
            this.linklinemyMoveLeft(this.gameMenu);
            this.gameAssist.setPosition(cc.v2(852, 0));
            this.linklinemyMoveLeft(this.gameAssist);
            this.gameAssist.getComponent('linklineassist').linklineloadPage();
        }, 0.2);
    },
    // 设置
    linklinesettingsBtn: function linklinesettingsBtn() {
        this.audioMgr.linklineplayUi_btn();
        this.gameMenu.getChildByName("settings").active = true;
        this.linklinemySlideIn(this.gameMenu.getChildByName("settings").getChildByName("settingBtns"));
    },
    // 关闭设置
    linklinecloseBtn: function linklinecloseBtn() {
        this.audioMgr.linklineplayUi_btn();
        //this.gameMenu.getChildByName("settings").active = false;
        this.linklinemySlideOut(this.gameMenu.getChildByName("settings").getChildByName("settingBtns"));
    },
    // 音效按钮
    linklinesoundBtn: function linklinesoundBtn() {
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
        }, 0.2);
        if (this.audioMgr.volumeUp) {
            console.log("音效关");
            this.audioMgr.volumeUp = 0;
            cc.sys.localStorage.setItem("volumeUp", 0);
            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("soundBtnBg").getChildByName("soundBtn").getComponent(cc.Sprite).spriteFrame = this.soundSprite2;
            cc.find('Canvas/gameMenu/settings/settingBtns/soundBtnBg').runAction(cc.moveTo(0.2, cc.v2(55.5, 114.6)));
        } else {
            console.log("音效开");
            this.audioMgr.volumeUp = 1;
            cc.sys.localStorage.setItem("volumeUp", 1);
            this.audioMgr.linklineplayUi_btn();
            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName("soundBtnBg").getChildByName("soundBtn").getComponent(cc.Sprite).spriteFrame = this.soundSprite1;
            cc.find('Canvas/gameMenu/settings/settingBtns/soundBtnBg').runAction(cc.moveTo(0.2, cc.v2(115.5, 114.6)));
        }
    },
    // 背景音乐按钮
    linklinemusicBtn: function linklinemusicBtn() {
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
        }, 0.2);
        if (this.audioMgr.playBgMusic) {
            console.log("音乐关");
            this.audioMgr.playBgMusic = 0;
            cc.audioEngine.stopAll();
            this.audioMgr.linklineplayUi_btn();
            //cc.audioEngine.pause(this.audioMgr.bgMusic);
            cc.sys.localStorage.setItem("playBgMusic", 0);
            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName('musicBtnBg').getChildByName("musicBtn").getComponent(cc.Sprite).spriteFrame = this.bgMusicSprite2;
            cc.find('Canvas/gameMenu/settings/settingBtns/musicBtnBg').runAction(cc.moveTo(0.2, cc.v2(55.5, 214.6)));
        } else {
            console.log("音乐开");
            this.audioMgr.linklineplayUi_btn();
            this.audioMgr.playBgMusic = 1;
            //cc.audioEngine.resume(this.audioMgr.bgMusic);
            this.audioMgr.linklineplayMusic_bg();
            cc.sys.localStorage.setItem("playBgMusic", 1);
            this.gameMenu.getChildByName("settings").getChildByName("settingBtns").getChildByName('musicBtnBg').getChildByName("musicBtn").getComponent(cc.Sprite).spriteFrame = this.bgMusicSprite1;
            cc.find('Canvas/gameMenu/settings/settingBtns/musicBtnBg').runAction(cc.moveTo(0.2, cc.v2(115.5, 214.6)));
        }
    },
    // 排行榜按钮
    linklinerankListBtn: function linklinerankListBtn() {
        this.audioMgr.linklineplayUi_btn();
        myGameCenterMgr.openGameCenter();
    },
    // 去广告
    linklineremoveAdBtn: function linklineremoveAdBtn() {
        this.audioMgr.linklineplayUi_btn();
        if (!this.linklineisNetWork()) {
            this.noInterMes.active = true;
            this.linklinemySlideIn(this.noInterMes.getChildByName("noInt"));
            //this.gameMenu.getChildByName("settings").active = false;
            //this.linklinemySlideOut(this.gameMenu.getChildByName("settings").getChildByName("settingBtns"));
        } else {
            myIAPMgr.remove_ads();
        }
    },
    // 恢复购买
    linklinerestoreBtn: function linklinerestoreBtn() {
        this.audioMgr.linklineplayUi_btn();
        // 没网络
        if (!this.linklineisNetWork()) {
            this.noInterMes.active = true;
            this.linklinemySlideIn(this.noInterMes.getChildByName("noInt"));
            //this.gameMenu.getChildByName("settings").active = false;
            //this.linklinemySlideOut(this.gameMenu.getChildByName("settings").getChildByName("settingBtns"));
        } else {
            myIAPMgr.restore();
        }
    },
    // 确定按钮
    linklinesureBtn: function linklinesureBtn() {
        this.audioMgr.linklineplayUi_btn();
        //this.noInterMes.active = false;
        this.linklinemySlideOut(this.noInterMes.getChildByName("noInt"));
    },

    // 游戏界面button
    // 暂停按钮
    linklinepauseBtn: function linklinepauseBtn() {
        this.audioMgr.linklineplayUi_btn();
        this.gameNode.getChildByName("pauseNode").active = true;
        this.linklinemySlideIn(this.gameNode.getChildByName("pauseNode").getChildByName("pauseNodeBtns"));
        if (!noAD) {
            console.log("pause button!!!");
            if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.PAUSE_PRO / 100) {
                console.log("pauseBtn full screen!!!");
                myADMgr.showFullScreenAD();
            }
        }
    },
    // 返回游戏
    linklinereturnGame: function linklinereturnGame() {
        this.audioMgr.linklineplayUi_btn();

        this.linklinemySlideOut(this.gameNode.getChildByName("pauseNode").getChildByName("pauseNodeBtns"));
    },
    // 返回游戏菜单
    linklinereturnMenu: function linklinereturnMenu() {
        this.audioMgr.linklineplayUi_btn();
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            this.audioMgr.linklineplaySwitch();
            this.gameNode.getComponent('linklinegame').linklinechunkActStart();
            this.gameNode.getComponent('linklinegame').unschedule(this.gameNode.getComponent("linklinegame").linklinetimeCountFun, 1);
            this.linklinemySlideOut(this.gameNode.getChildByName("pauseNode").getChildByName("pauseNodeBtns"));
            this.linklinemyMoveRight(this.gameNode);
            this.gameMenu.setPosition(cc.v2(-852, 0));
            this.linklinemyMoveRight(this.gameMenu);
        }, 0.2);
    },

    // 死亡界面按钮
    // 返回游戏菜单
    linklinereturnMenu_gameover: function linklinereturnMenu_gameover() {
        this.audioMgr.linklineplayUi_btn();
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            this.audioMgr.linklineplaySwitch();
            this.gameNode.getComponent('linklinegame').unschedule(this.gameNode.getComponent("linklinegame").linklinetimeCountFun, 1);
            this.linklinemySlideOut(this.gameNode.getChildByName("gameover").getChildByName("gameoverBtns"));
            this.linklinemyMoveRight(this.gameNode);
            this.linklinemyMoveRight(this.gameMenu);
        }, 0.2);

        // 重置棋盘
        this.gameNode.getComponent("linklinegame").linklineresetBtn(1);
    },
    // 重新开始
    linklineagain_gameover: function linklineagain_gameover() {
        this.audioMgr.linklineplayUi_btn();
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            this.linklinemySlideOut(this.gameNode.getChildByName("gameover").getChildByName("gameoverBtns"));
            cc.find("Canvas/game").getComponent("linklinegame").linklineresetBtn();
        }, 0.2);
    },

    // 复活界面按钮
    // 看广告复活
    linklinewhatchAdBtn: function linklinewhatchAdBtn() {
        this.audioMgr.linklineplayUi_btn();
        this.isToRelive = true;
        this.gameNode.getComponent("linklinegame").toRelive = true;
        this.gameNode.getComponent("linklinegame").toUseHammer = false;
        this.gameNode.getComponent("linklinegame").doubleBtn = false;
        this.gameNode.getComponent("linklinegame").unschedule(this.gameNode.getComponent("linklinegame").linklinecountTime);
        this.gameNode.getComponent("linklinegame").unschedule(this.gameNode.getComponent("linklinegame").linklinecountTime2);
        this.gameNode.getChildByName("relive").getChildByName("reliveBtns").getChildByName("circleYellow").getComponent(cc.ProgressBar).progress = 0;
        if (!cc.sys.isMobile) {
            console.log('toRelive!!!');
            this.gameNode.getComponent("linklinegame").linklinesortChunk();
            //this.gameNode.getChildByName("relive").active = false;
            this.linklinemySlideOut(this.gameNode.getChildByName("relive").getChildByName("reliveBtns"));
        } else if (!this.linklineisNetWork() && cc.sys.isMobile) {
            console.log("没网络!!!");
            //this.gameNode.getChildByName("relive").active = false;
            // this.linklinemySlideOut(this.gameNode.getChildByName("relive").getChildByName("reliveBtns"));
            // //this.gameNode.getChildByName("gameover").active = true;
            // this.linklinemySlideIn(this.gameNode.getChildByName("gameover").getChildByName("gameoverBtns"));
            // this.gameNode.getComponent("linklinegame").level.getComponent(cc.Label).string = (this.gameNode.getComponent("linklinegame").circleNumLeft).toString();
            // this.gameNode.getComponent("linklinegame").score.getComponent(cc.Label).string = (this.gameNode.getComponent("linklinegame").presentScore).toString();
            this.linklinemySlideOut(this.gameNode.getChildByName("relive").getChildByName("reliveBtns"));
            this.gameNode.getComponent('linklinegame').linklinegameEvaluate();
            this.scheduleOnce(function () {
                this.gameNode.getChildByName("gameover").active = true;
                this.linklinemySlideIn(this.gameNode.getChildByName("gameover").getChildByName("gameoverBtns"));
            }, 0.6);
        } else {
            if (myADMgr.isRewardVideoAvailable()) {
                console.log("激励广告!!!");
                myADMgr.showRewardVideoAD();
                this.gameNode.getChildByName("relive").active = false;
            } else {
                console.log("激励广告 没 获取到!!!");
                //this.gameNode.getChildByName("relive").active = false;
                this.linklinemySlideOut(this.gameNode.getChildByName("relive").getChildByName("reliveBtns"));
                //this.gameNode.getChildByName("gameover").active = true;
                this.linklinemySlideIn(this.gameNode.getChildByName("gameover").getChildByName("gameoverBtns"));
                this.gameNode.getComponent("linklinegame").level.getComponent(cc.Label).string = this.gameNode.getComponent("linklinegame").circleNumLeft.toString();
                this.gameNode.getComponent("linklinegame").score.getComponent(cc.Label).string = this.gameNode.getComponent("linklinegame").presentScore.toString();
            }
        }
    },

    linklineisNetWork: function linklineisNetWork() {
        if (cc.sys.os != cc.sys.OS_IOS) return;
        var typeNetWork = jsb.reflection.callStaticMethod("Reachability", "getNetworkTyp");
        if (Number(typeNetWork) == -1) {
            // 没有网络
            console.log("没有网络");
            return false;
        } else {
            console.log("有网络");
            return true;
        }
    },
    linklinemoveBtn: function linklinemoveBtn(btn) {
        btn.on(cc.Node.EventType.TOUCH_START, function () {
            if (buttonDown) return;
            buttonDown = true;
            btn.runAction(cc.moveBy(0.2, cc.v2(0, -15)));
        });
        btn.on(cc.Node.EventType.TOUCH_END, function () {
            buttonDown = false;
            btn.runAction(cc.moveBy(0.2, cc.v2(0, 15)));
        });
        btn.on(cc.Node.EventType.TOUCH_CANCEL, function () {
            buttonDown = false;
            btn.runAction(cc.moveBy(0.2, cc.v2(0, 15)));
        });
    },
    linklineskinStore: function linklineskinStore() {
        this.audioMgr.linklineplayUi_btn();
        var node = cc.find('Canvas/gameMenu/gameSkin');
        node.active = true;
        this.linklinemySlideIn(node.getChildByName('themes'));
    },
    linklinecloseSkin: function linklinecloseSkin() {
        this.audioMgr.linklineplayUi_btn();
        var node = cc.find('Canvas/gameMenu/gameSkin');
        this.linklinemySlideOut(node.getChildByName('themes'));
    },
    linklineoffNightMode: function linklineoffNightMode() {
        this.audioMgr.linklineplayUi_btn();
        nightMode = 0;
        cc.sys.localStorage.setItem('nightMode', 0);
        cc.find('Canvas/gameMenu/gameMenuBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineMenuSources/linklineback001.png'));
        cc.find('Canvas/game/gameBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame001.png'));
        cc.find('Canvas/game/boardMask/board').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame002.png'));
        cc.find('Canvas/gameMenu/gameSkin/themes/nightBtn/themesTickBtn').active = false;
        cc.find('Canvas/gameMenu/gameSkin/themes/dayBtn/themesTickBtn').active = true;
    },
    linklineonNightMode: function linklineonNightMode() {
        this.audioMgr.linklineplayUi_btn();
        nightMode = 1;
        cc.sys.localStorage.setItem('nightMode', 1);
        cc.find('Canvas/gameMenu/gameMenuBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineMenuSources/linklineback002.png'));
        cc.find('Canvas/game/gameBg').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame003.png'));
        cc.find('Canvas/game/boardMask/board').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklinegame004.png'));
        cc.find('Canvas/gameMenu/gameSkin/themes/nightBtn/themesTickBtn').active = true;
        cc.find('Canvas/gameMenu/gameSkin/themes/dayBtn/themesTickBtn').active = false;
    },
    linklinetoStatistic: function linklinetoStatistic() {
        this.audioMgr.linklineplayUi_btn();
        var node = cc.find('Canvas/gameMenu/statistics');
        node.active = true;
        this.linklinemySlideIn(node.getChildByName('statistics'));
        node.getChildByName('statistics').getChildByName('time').getComponent(cc.Label).string = Number(cc.sys.localStorage.getItem('restartTimes'));
        node.getChildByName('statistics').getChildByName('num_1k').getComponent(cc.Label).string = Number(cc.sys.localStorage.getItem('num_1k'));
        node.getChildByName('statistics').getChildByName('bestScore').getComponent(cc.Label).string = Number(cc.sys.localStorage.getItem('bestScore'));
        var num = Number(cc.sys.localStorage.getItem('hightestScore'));
        console.log('====================' + num);
        if (num <= 512) {
            node.getChildByName('statistics').getChildByName('bestNum').getChildByName('num').getComponent(cc.Label).string = num;
        } else if (num > 512 && num <= 32768) {
            node.getChildByName('statistics').getChildByName('bestNum').getChildByName('num').getComponent(cc.Label).string = Math.floor(num / 1000) + "."; // K
        } else if (num == 65536) {
            node.getChildByName('statistics').getChildByName('bestNum').getChildByName('num').getComponent(cc.Label).string = 64 + ".";
        } else if (num == 131072) {
            node.getChildByName('statistics').getChildByName('bestNum').getChildByName('num').getComponent(cc.Label).string = 128 + ".";
        } else if (num == 262144) {
            node.getChildByName('statistics').getChildByName('bestNum').getChildByName('num').getComponent(cc.Label).string = 256 + ".";
        } else if (num == 524288) {
            node.getChildByName('statistics').getChildByName('bestNum').getChildByName('num').getComponent(cc.Label).string = 512 + ".";
        } else if (num >= 1048576) {
            node.getChildByName('statistics').getChildByName('bestNum').getChildByName('num').getComponent(cc.Label).string = Math.floor(num / 1000000) + "/"; // M
        }
        node.getChildByName('statistics').getChildByName('bestNum').color = dataMgr.colorMgr.linklinegetColorById(num);
    },
    linklineexitStatistic: function linklineexitStatistic() {
        this.audioMgr.linklineplayUi_btn();
        var node = cc.find('Canvas/gameMenu/statistics');
        this.linklinemySlideOut(node.getChildByName('statistics'));
    },
    linklinefiveStar: function linklinefiveStar() {
        this.audioMgr.linklineplayUi_btn();
        if (isFiveStar) {
            if (this.linklineisNetWork()) myGameCenterMgr.fiveStar();
            return;
        }
        this.fiveStarNode.active = true;
        this.linklinemySlideIn(this.fiveStarNode.getChildByName("fiveStar"));
        console.log('五星好评');
    },

    linklinesupportUs: function linklinesupportUs() {
        this.audioMgr.linklineplayUi_btn();
        this.linklinemySlideOut(this.fiveStarNode.getChildByName("fiveStar"));
        if (this.linklineisNetWork()) {
            myGameCenterMgr.fiveStar();
            isFiveStar = true;
            cc.sys.localStorage.setItem("isFiveStar", "true");
        }
    },

    linklinecloseFiveStarNode: function linklinecloseFiveStarNode() {
        //this.fiveStarNode.active = false;
        this.audioMgr.linklineplayUi_btn();
        this.linklinemySlideOut(this.fiveStarNode.getChildByName("fiveStar"));
    },
    linklinetoAppleStore: function linklinetoAppleStore() {
        this.audioMgr.linklineplayUi_btn();
        supportUS();
    }
});

cc._RF.pop();