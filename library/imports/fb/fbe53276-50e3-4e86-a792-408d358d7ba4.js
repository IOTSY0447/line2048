"use strict";
cc._RF.push(module, 'fbe53J2UONOhqeSQI01jXuk', 'linklinegame');
// myScripts/linklinegame.js

"use strict";

var dataMgr = require("linklinedataMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        chunkList: [], // 2048 块
        chunkTempList: [], // 存放移动过程中碰到的 块

        topNode: cc.Node,
        boardNode: cc.Node,
        bottomNode: cc.Node,

        chunkPre: cc.Prefab,
        chunkAni: cc.Prefab, // 涟漪动画

        // 连线组件
        graphics: cc.Graphics,
        // 暂停和分数  节点
        pause_scores: cc.Node,
        // 升级节点
        levelUp: cc.Node,

        // 当前操作得分 显示 节点
        operateScore: cc.Node,

        // 五星好评
        fiveStarNode: cc.Node,

        // 防穿透节点
        blockInputNode1: cc.Node,
        blockInputNode2: cc.Node,
        boardNode2: cc.Node,

        // 死亡界面 等级、 分数
        //level:cc.Node,
        score: cc.Node,

        // 复活机会是否使用
        canRelive: true,
        // 复活界面 倒计时
        circleYellow: cc.Node,

        // 破纪录 和 没破纪录 bg 
        scoreBgSprFrame1: cc.SpriteFrame,
        scoreBgSprFrame2: cc.SpriteFrame,

        //scoreBg:cc.Node,

        // 锤子 图集
        hammerSprFrame1: cc.SpriteFrame,
        hammerSprFrame2: cc.SpriteFrame,
        hammerSprFrame3: cc.SpriteFrame,
        hammerSprFrame4: cc.SpriteFrame,
        // 锤子是否可用
        isHammer: false,
        //isReviveHammer:false,

        //double 图集
        doubleSprFrame1: cc.SpriteFrame,
        doubleSprFrame2: cc.SpriteFrame,
        doubleSprFrame3: cc.SpriteFrame,

        doubleNum: 0,

        isUsingHammer: false,
        isUsingDouble: false,

        // 每一列的掉落数据 存到 数组中
        chunkDropList: [],

        // 星星粒子效果
        star: cc.Node,

        // 使用锤子道具提示
        hammerTips: cc.Node,

        // 死亡 锤子 可用提示
        useHammerRemind: cc.Node,

        //连线起点
        startChunkID: 0,
        //双倍分数
        doubleOnce: false,
        //双倍模式
        doubleMode: false,
        //合成块ID
        dropChunkID: 0,

        progressMgr: cc.Node,
        progress1: cc.Node,
        progress2: cc.Node,

        progress_num: 0,
        progress_times: 0,

        breakRecord: false,

        kuang1: cc.SpriteFrame,
        kuang2: cc.SpriteFrame,

        cancel_times: 0,

        hammer_btn: cc.Node,
        double_btn: cc.Node,
        // closePl1:cc.ParticleSystem,
        // closePl2:cc.ParticleSystem,
        // closePl3:cc.ParticleSystem,
        // closePl4:cc.ParticleSystem,
        closePl_num: 0,

        closePlPre: cc.Prefab,

        loadingBar: cc.Node,
        loadingBarNum: 1,
        levelAni: cc.Node,
        scoreSprite: [cc.SpriteFrame],
        scoreNode: cc.Node,

        evaluate: cc.Node,
        evaluateSprite: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.linklineinitData();

        this.linklineinitChunks();

        this.touchPos = 0;
        // 广告回调
        myADMgr.setCallback(this.adCallback.bind(this));

        console.log("noAD: " + noAD);
    },

    start: function start() {
        this.linklineaddTouchEvent();
        this.progressMgrJs = this.progressMgr.getComponent('linklineprogressBarMgr');
        var act = cc.repeatForever(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.8), cc.fadeOut(0.5)), cc.callFunc(function () {
            this.levelAni.setScale(1);
            this.levelAni.opacity = 255;
        }, this)));
        this.levelAni.runAction(act);
        this.levelAni.active = false;
        this.score2_times = Number(cc.sys.localStorage.getItem('score2_times'));
        this.score4_times = Number(cc.sys.localStorage.getItem('score4_times'));
    },
    linklinestartTimeCount: function linklinestartTimeCount() {
        this.schedule(this.linklinetimeCountFun, 1);
    },
    linklinetimeCountFun: function linklinetimeCountFun() {
        if (this.node.getPositionX() != 0) this.timeCount = 0;
        this.timeCount++;
        if (this.timeCount >= this.tipsTime) {
            this.linklinetips();
            this.timeCount = 0;
        }
    },


    // 初始化数据
    linklineinitData: function linklineinitData() {
        this.audioMgr = cc.find("Canvas").getComponent("linklineaudioMgr");
        this.ROW = 6;
        this.COL = 5;
        this.chunkRadius = 34; // chunk半径
        this.chunkGapX = 33; //34; // chunk横向间隙
        this.chunkGapY = 28.5; //29; // chunk纵向间隙
        this.tipsTime = 5; // 不动棋盘多少秒提示
        this.timeCount = 0; // 计时
        this.gameoverTimes = parseInt(dataMgr.myLocalMgr.gameoverTimes); // 死亡次数
        this.restartTimes = parseInt(dataMgr.myLocalMgr.restartTimes); // 重新开始次数
        this.hightestScore = parseInt(dataMgr.myLocalMgr.hightestScore); // 单次连接最高分
        this.doubleModeTimes = Number(cc.sys.localStorage.getItem('doubleModeTimes'));

        this.limitDis = Math.pow(2, 0.5) * (2 * this.chunkRadius + this.chunkGapX) - this.chunkRadius + 15; // 极限距离
        this.graphics = this.boardNode.getChildByName("line").getComponent(cc.Graphics);
        this.isFirst = parseInt(dataMgr.myLocalMgr.isFirstTimeLoad); // 是否第一次登录游戏
        // 点击锤子时棋盘抖动 效果
        this.blockBlackX = this.boardNode2.getPositionX();
        this.blockBlackY = this.boardNode2.getPositionY();

        if (!cc.sys.localStorage.getItem('doubleNum')) {
            this.doubleNum = 1;
            cc.sys.localStorage.setItem('doubleNum', 1);
        } else {
            this.doubleNum = Number(cc.sys.localStorage.getItem('doubleNum'));
        }
        if (this.doubleNum == 0) {
            cc.find('Canvas/game/bottom/double003').getComponent(cc.Sprite).spriteFrame = this.doubleSprFrame2;
        } else {
            cc.find('Canvas/game/bottom/double003').getComponent(cc.Sprite).spriteFrame = this.doubleSprFrame1;
        }
        // 恢复分数
        this.presentScore = parseInt(dataMgr.myLocalMgr.presentScore);
        this.bestScore = parseInt(dataMgr.myLocalMgr.bestScore);
        this.pause_scores.getChildByName("presentScore").getChildByName("score").getComponent(cc.Label).string = this.presentScore.toString();
        this.pause_scores.getChildByName("bestScore").getChildByName("score").getComponent(cc.Label).string = this.bestScore.toString();
        // 恢复升级进度条
        this.circleNumLeft = parseInt(dataMgr.myLocalMgr.circleNum1);
        this.circleNumRight = parseInt(dataMgr.myLocalMgr.circleNum2);
        this.circleColorLeft = dataMgr.colorMgr.linklinegetCircleColorByIndex(this.circleNumLeft % dataMgr.colorMgr.linklinegetCircleColorLength() + 1);
        this.circleColorRight = dataMgr.colorMgr.linklinegetCircleColorByIndex(this.circleNumRight % dataMgr.colorMgr.linklinegetCircleColorLength() + 1);
        this.levelUp.getChildByName("circleLeft").color = this.circleColorLeft;

        this.levelUp.getChildByName("circleLeft").getChildByName("curLevel").getComponent(cc.Label).string = this.circleNumLeft.toString();
        this.levelUp.getChildByName("circleRight").color = this.circleColorRight;

        this.levelUp.getChildByName("circleRight").getChildByName("nextLevel").getComponent(cc.Label).string = this.circleNumRight.toString();

        this.levelUp.getChildByName("progressBar").getChildByName("bar").color = this.circleColorLeft;
        // 连线多少次升级
        if (this.circleNumLeft < 6) {
            this.levelUpTotal = 30;
            if (this.circleNumLeft == 1) this.levelUpTotal = 30;
            if (this.circleNumLeft == 2) this.levelUpTotal = 40;
            if (this.circleNumLeft == 3) this.levelUpTotal = 50;
            if (this.circleNumLeft == 4) this.levelUpTotal = 60;
            if (this.circleNumLeft == 5) this.levelUpTotal = 70;
        } else {
            this.levelUpTotal = 75 + 5 * (this.circleNumLeft - 6);
        }

        this.percentBar = parseFloat(dataMgr.myLocalMgr.percentBar);
        this.levelUp.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = this.percentBar;
        if (cc.sys.localStorage.getItem('loadingBar_index')) {
            this.loadingBarNum = Number(cc.sys.localStorage.getItem('loadingBar_index'));
        }

        if (cc.sys.localStorage.getItem('canRelive') == null) {
            this.canRelive = true;
            cc.sys.localStorage.setItem('canRelive', 1);
            console.log('可以复活');
        } else {
            this.canRelive = Number(cc.sys.localStorage.getItem('canRelive'));
        }
        // 锤子状态恢复
        if (cc.sys.localStorage.getItem('isHammer') == null) {
            this.isHammer = true;
            cc.sys.localStorage.setItem('isHammer', 1);
        } else {
            this.isHammer = Number(cc.sys.localStorage.getItem('isHammer'));
        }
        if (this.isHammer) {
            var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
            tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame1;
        } else {
            var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
            tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame2;
        }

        this.toUseHammer = false;
        this.doubleBtn = false;
        this.toRelive = false;

        this.breakRecord = Number(cc.sys.localStorage.getItem('breakRecord'));
        //console.log('是否打破记录' + this.breakRecord)
    },

    // 初始化块
    linklineinitChunks: function linklineinitChunks() {
        if (!cc.sys.localStorage.getItem('isGameOver')) this.isGameOver = false;else {
            this.isGameOver = Number(cc.sys.localStorage.getItem('isGameOver'));
        }
        //console.log(this.isGameOver);
        var self = this;
        // 第一次进入游戏 直接初始化棋盘
        if (this.isFirst || this.isGameOver) {
            cc.find('Canvas/game/bottom/double003').getComponent(cc.Sprite).spriteFrame = this.doubleSprFrame1;
            cc.sys.localStorage.setItem('doubleNum', 1);
            this.doubleNum = 1;

            this.breakRecord = false;
            cc.sys.localStorage.setItem('breakRecord', 1);

            this.isHammer = true;
            cc.sys.localStorage.setItem('isHammer', 1);
            var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
            tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame1;
            //this.useHammerRemind.getChildByName("remind").getChildByName("useHammerBtn").getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame3;
            //this.isReviveHammer = false;
            cc.sys.localStorage.setItem('isReviewHammer', 0);

            this.canRelive = true;
            cc.sys.localStorage.setItem('canRelive', 1);

            this.isGameOver = false;
            cc.sys.localStorage.setItem('isGameOver', 0);
            for (var i = 0; i < self.ROW; i++) {
                self.chunkList[i] = new Array(); // ...
                if (i == self.ROW) {
                    for (var j = 0; j < self.COL; j++) {
                        self.chunkList[i][j] = self.linklinerandomChunk();

                        //self.chunkList[i][j].getComponent("chunk").row = i;
                        //self.chunkList[i][j].getComponent("chunk").col = j;

                        var x = (2 * self.chunkRadius + self.chunkGapX) * j + self.chunkGapX + self.chunkRadius;
                        var y = (2 * self.chunkRadius + self.chunkGapY) * i + self.chunkGapY + self.chunkRadius;
                        self.boardNode.addChild(self.chunkList[i][j]);
                        self.chunkList[i][j].setPosition(x, y);
                        self.chunkList[i][j].opacity = 0;
                        //console.log("[" + i + "," + j + "] : " + "(" + self.chunkList[i][j].getPosition().x + "," + self.chunkList[i][j].getPosition().y + ")");
                    }
                } else {
                    for (var j = 0; j < self.COL; j++) {
                        self.chunkList[i][j] = self.linklinerandomChunk();

                        //self.chunkList[i][j].getComponent("chunk").row = i;
                        //self.chunkList[i][j].getComponent("chunk").col = j;

                        var x = (2 * self.chunkRadius + self.chunkGapX) * j + self.chunkGapX + self.chunkRadius;
                        var y = (2 * self.chunkRadius + self.chunkGapY) * i + self.chunkGapY + self.chunkRadius;
                        self.boardNode.addChild(self.chunkList[i][j]);
                        self.chunkList[i][j].setPosition(x, y);

                        self.chunkList[i][j].setScale(0);
                        // self.chunkList[i][j].runAction(cc.sequence(cc.delayTime(2),cc.scaleTo(0.5,1).easing(cc.easeBackOut())));
                        //console.log("[" + i + "," + j + "] : " + "(" + self.chunkList[i][j].getPosition().x + "," + self.chunkList[i][j].getPosition().y + ")");
                    }
                }
            }
            self.linklinesaveBoardData();
        }
        // 从本地读取 棋盘数据 恢复棋盘
        else {
                var LocalData = self.linklineloadBoardData();
                for (var i = 0; i < self.ROW; i++) {
                    self.chunkList[i] = new Array(); // ...
                    for (var j = 0; j < self.COL; j++) {
                        self.chunkList[i][j] = self.linklinerandomChunk();

                        //self.chunkList[i][j].getComponent("chunk").row = i;
                        //self.chunkList[i][j].getComponent("chunk").col = j;

                        var x = (2 * self.chunkRadius + self.chunkGapX) * j + self.chunkGapX + self.chunkRadius;
                        var y = (2 * self.chunkRadius + self.chunkGapY) * i + self.chunkGapY + self.chunkRadius;
                        self.boardNode.addChild(self.chunkList[i][j]);
                        self.chunkList[i][j].setPosition(x, y);
                        var row_col = "RC" + i + j;
                        var data = LocalData[row_col];
                        self.chunkList[i][j].getComponent("linklinechunk").linklinesetColor_Digit(dataMgr.colorMgr.linklinegetColorById(data.chunkDigit), data.chunkDigit);
                        //console.log(self.chunkList[i][j].getComponent("chunk").linklinegetChunkDigit())
                        if (self.chunkList[i][j].getComponent('linklinechunk').linklinegetChunkDigit() >= 1024 && self.chunkList[i][j].getComponent('linklinechunk').linklinegetChunkDigit() < 1000000) {
                            self.chunkList[i][j].getChildByName('kuang').active = true;
                            self.chunkList[i][j].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                            self.chunkList[i][j].getChildByName('kuang').color = self.chunkList[i][j].children[0].color;
                        } else if (self.chunkList[i][j].getComponent('linklinechunk').linklinegetChunkDigit() >= 1000000) {
                            self.chunkList[i][j].getChildByName('kuang').active = true;
                            self.chunkList[i][j].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                            self.chunkList[i][j].getChildByName('kuang').color = self.chunkList[i][j].children[0].color;
                        } else {
                            self.chunkList[i][j].getChildByName('kuang').active = false;
                        }
                        self.chunkList[i][j].setScale(0);
                        // self.chunkList[i][j].runAction(cc.sequence(cc.delayTime(2),cc.scaleTo(0.5,1).easing(cc.easeBackOut())));
                        //console.log("[" + i + "," + j + "] : " + "(" + self.chunkList[i][j].getPosition().x + "," + self.chunkList[i][j].getPosition().y + ")");
                    }
                }
            }
    },
    // 随机生成 2，4，8的块
    linklinerandomChunk: function linklinerandomChunk() {
        var self = this;
        var chunk = cc.instantiate(self.chunkPre);
        var chunkJS = chunk.getComponent("linklinechunk");
        var index = 0;
        var colorInd = new cc.Color(255, 255, 255);
        switch (parseInt(Math.random() * 3)) {
            case 0:
                index = 2;
                colorInd = dataMgr.colorMgr.linklinegetColorById(index);
                break;
            case 1:
                index = 4;
                colorInd = dataMgr.colorMgr.linklinegetColorById(index);
                break;
            default:
                index = 8;
                colorInd = dataMgr.colorMgr.linklinegetColorById(index);
                break;
        }
        chunkJS.linklinesetColor_Digit(colorInd, index);

        return chunk;
    },

    // 添加事件
    linklineaddTouchEvent: function linklineaddTouchEvent() {
        var self = this;
        var board = self.boardNode;
        board.on(cc.Node.EventType.TOUCH_START, function (event) {
            var touchStartPos = board.convertToNodeSpaceAR(event.getLocation()); // 世界坐标转换成相对boardNode的坐标
            self.touchPos = touchStartPos;
            for (var i = 0; i < self.ROW; i++) {
                for (var j = 0; j < self.COL; j++) {
                    self.linklinegraphicsLine(self.chunkList[i][j], touchStartPos);
                }
            }
        }, board);
        board.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var touchMovePos = board.convertToNodeSpaceAR(event.getLocation());
            self.timeCount = 0;
            self.touchPos = touchMovePos;

            for (var i = 0; i < self.ROW; i++) {
                for (var j = 0; j < self.COL; j++) {
                    if (self.linklinechunk_fingerCollier(self.chunkList[i][j], touchMovePos)) {
                        self.linklinegraphicsLine(self.chunkList[i][j], touchMovePos);
                        break;
                    }
                }
            }
        }, board);
        board.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (self.chunkTempList.length >= 2) {
                self.linklinetogetherChunk(self.chunkTempList);
                self.linklinedropChunkAct();
            }
            self.progressMgrJs.linklinesetProgressBar(0);
            self.levelAni.active = false;
            console.log("TOUCH_END");
            var n = self.chunkTempList.length;
            self.chunkTempList.length = 0; // 清空数组
            self.graphics.clear(); // 擦除连线
            self.operateScore.stopAllActions();
            self.operateScore.runAction(cc.sequence(cc.scaleTo(0.2, 0).easing(cc.easeBackIn()), cc.callFunc(function () {
                self.operateScore.active = false;
            }))); // 隐藏当前操作得分
            if (n >= 2) {
                var node = new cc.Node();
                cc.find('Canvas/game/top').addChild(node);
                node.setPosition(cc.v2(0, -154));
                var label = node.addComponent(cc.Label);
                if (self.doubleOnce) {
                    label.string = ',' + 4 * Number(self.operateScore.getChildByName('score').getComponent(cc.Label).string);
                    self.doubleOnce = false;
                    self.scoreNode.stopAllActions();
                    var num = parseInt(Math.random() * 4 + 1);
                    if (self.score4_times < 5) {
                        num = 4;
                        self.score4_times += 1;
                        cc.sys.localStorage.setItem('score4_times', self.score4_times);
                    }
                    self.scoreNode.getComponent(cc.Sprite).spriteFrame = self.scoreSprite[num];
                    self.scoreNode.opacity = 255;
                    self.scoreNode.color = self.operateScore.color;
                    self.scoreNode.setScale(0);
                    self.scoreNode.active = true;
                    self.scoreNode.runAction(cc.sequence(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeOut(1), cc.callFunc(function () {
                        self.scoreNode.active = false;
                    }, self)));
                } else if (n >= 8) {
                    label.string = ',' + 2 * Number(self.operateScore.getChildByName('score').getComponent(cc.Label).string);
                    self.scoreNode.stopAllActions();
                    var _num = parseInt(Math.random() * 4);
                    if (self.score2_times < 5) {
                        _num = 0;
                        self.score2_times += 1;
                        cc.sys.localStorage.setItem('score2_times', self.score2_times);
                    }
                    self.scoreNode.getComponent(cc.Sprite).spriteFrame = self.scoreSprite[_num];
                    self.scoreNode.opacity = 255;
                    self.scoreNode.color = self.operateScore.color;
                    self.scoreNode.setScale(0);
                    self.scoreNode.active = true;
                    self.scoreNode.runAction(cc.sequence(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeOut(1), cc.callFunc(function () {
                        self.scoreNode.active = false;
                    }, self)));
                } else {
                    label.string = ',' + Number(self.operateScore.getChildByName('score').getComponent(cc.Label).string);
                }
                label.font = self.operateScore.getChildByName('score').getComponent(cc.Label).font;
                node.color = self.operateScore.color;
                node.setScale(0);
                node.runAction(cc.sequence(cc.delayTime(0.2), cc.scaleTo(0.4, 1).easing(cc.easeBackOut()), cc.spawn(cc.moveBy(0.5, cc.v2(0, 100)), cc.fadeOut(0.5)), cc.callFunc(function () {
                    node.destroy();
                })));
            }
        }, board);

        board.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            if (self.chunkTempList.length >= 2) {
                self.linklinetogetherChunk(self.chunkTempList);
                self.linklinedropChunkAct();
            }
            var n = self.chunkTempList.length;
            self.progressMgrJs.linklinesetProgressBar(0);
            self.levelAni.active = false;
            self.chunkTempList.length = 0; // 清空数组
            self.graphics.clear(); // 擦除连线
            self.operateScore.stopAllActions();
            self.operateScore.runAction(cc.sequence(cc.scaleTo(0.2, 0).easing(cc.easeBackIn()), cc.callFunc(function () {
                self.operateScore.active = false;
            }))); // 隐藏当前操作得分
            if (n >= 2) {
                var node = new cc.Node();
                cc.find('Canvas/game/top').addChild(node);
                node.setPosition(cc.v2(0, -154));
                var label = node.addComponent(cc.Label);
                if (self.doubleOnce) {
                    label.string = ',' + 4 * Number(self.operateScore.getChildByName('score').getComponent(cc.Label).string);
                    self.doubleOnce = false;
                    self.scoreNode.stopAllActions();
                    var num = parseInt(Math.random() * 4 + 1);
                    if (self.score4_times < 5) {
                        num = 4;
                        self.score4_times += 1;
                        cc.sys.localStorage.setItem('score4_times', self.score4_times);
                    }
                    self.scoreNode.getComponent(cc.Sprite).spriteFrame = self.scoreSprite[num];
                    self.scoreNode.opacity = 255;
                    self.scoreNode.color = self.operateScore.color;
                    self.scoreNode.setScale(0);
                    self.scoreNode.active = true;
                    self.scoreNode.runAction(cc.sequence(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeOut(1), cc.callFunc(function () {
                        self.scoreNode.active = false;
                    }, self)));
                } else if (n >= 8) {
                    label.string = ',' + 2 * Number(self.operateScore.getChildByName('score').getComponent(cc.Label).string);
                    self.scoreNode.stopAllActions();
                    var _num2 = parseInt(Math.random() * 4);
                    if (self.score2_times < 5) {
                        _num2 = 0;
                        self.score2_times += 1;
                        cc.sys.localStorage.setItem('score2_times', self.score2_times);
                    }
                    self.scoreNode.getComponent(cc.Sprite).spriteFrame = self.scoreSprite[_num2];
                    self.scoreNode.opacity = 255;
                    self.scoreNode.color = self.operateScore.color;
                    self.scoreNode.setScale(0);
                    self.scoreNode.active = true;
                    self.scoreNode.runAction(cc.sequence(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()), cc.fadeOut(1), cc.callFunc(function () {
                        self.scoreNode.active = false;
                    }, self)));
                } else {
                    label.string = ',' + Number(self.operateScore.getChildByName('score').getComponent(cc.Label).string);
                }
                label.font = self.operateScore.getChildByName('score').getComponent(cc.Label).font;
                node.color = self.operateScore.color;
                node.setScale(0);
                node.runAction(cc.sequence(cc.delayTime(0.2), cc.scaleTo(0.4, 1).easing(cc.easeBackOut()), cc.spawn(cc.moveBy(0.5, cc.v2(0, 100)), cc.fadeOut(0.5)), cc.callFunc(function () {
                    node.destroy();
                })));
            }
        }, board);
    },

    // 块与鼠标点是否碰撞 39为chunnk的半径
    linklinechunk_fingerCollier: function linklinechunk_fingerCollier(chunk, point) {
        if (cc.pDistance(chunk.getPosition(), point) < this.chunkRadius + 18) {
            return true;
        }
        return false;
    },
    // 块与块能否相连，根据距离和数值进行判断
    linklinechunk_chunkCollier: function linklinechunk_chunkCollier(chunk1, chunk2) {
        var chunk1JS = chunk1.getComponent("linklinechunk");
        var chunk2JS = chunk2.getComponent("linklinechunk");
        if (cc.pDistance(chunk1.getPosition(), chunk2.getPosition()) < this.limitDis && chunk1JS.linklinegetChunkDigit() == chunk2JS.linklinegetChunkDigit()) return true;
        return false;
    },
    // 连线、连线条件判断

    linklinegraphicsLine: function linklinegraphicsLine(chunk, point2) {
        var sum = 0;
        if (this.linklinechunk_fingerCollier(chunk, point2)) {
            // 判断是否有起点
            if (this.chunkTempList.length == 0) {
                this.chunkTempList.push(chunk);
                this.startChunkID = chunk.uuid;
                this.progressMgrJs.linklinesetProgressBarColor(chunk.children[0].color);
                this.audioMgr.linklineplayAdvanced(this.chunkTempList.length);

                var chunAni = cc.instantiate(this.chunkAni);
                chunAni.getChildByName("color").color = chunk.getComponent("linklinechunk").linklinegetChunkColor();
                chunAni.setPosition(chunk.getPosition());
                chunAni.zIndex = -1;
                this.boardNode.addChild(chunAni);

                chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.8), cc.fadeOut(0.5)), cc.callFunc(function () {
                    chunAni.destroy();
                })));
                var num = chunk.getComponent('linklinechunk').linklinegetChunkDigit();
                for (var _i = 1; _i < 22; _i++) {
                    if (Math.pow(2, _i) == num) {
                        this.closePl_num = _i;
                        break;
                    }
                }
            } else {
                //console.log("弹出1:" + this.chunkTempList.length);
                // 判断 压入 数组 还是弹出数组
                var isInArray = false;
                for (var k = 0; k < this.chunkTempList.length; k++) {
                    if (chunk.getPositionX() == this.chunkTempList[k].getPositionX() && chunk.getPositionY() == this.chunkTempList[k].getPositionY()) {
                        // 弹出
                        if (this.startChunkID == chunk.uuid && !this.doubleOnce && this.chunkTempList.length > 3 && this.linklinechunk_chunkCollier(this.chunkTempList[this.chunkTempList.length - 1], this.chunkTempList[0])) {
                            this.chunkTempList.push(chunk);
                            this.audioMgr.linklineplayConnect_close();

                            vibrate1();

                            var chunAni = cc.instantiate(this.chunkAni);
                            chunAni.getChildByName("color").color = chunk.getComponent("linklinechunk").linklinegetChunkColor();
                            chunAni.setPosition(chunk.getPosition());
                            chunAni.zIndex = -1;
                            this.boardNode.addChild(chunAni);
                            chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.8), cc.fadeOut(0.5)), cc.callFunc(function () {
                                chunAni.destroy();
                            })));
                            this.cancel_times = 0;
                            this.doubleOnce = true;
                            this.progressMgrJs.linklinesetProgressBar(30);
                            if (1 / this.levelUpTotal * this.chunkTempList.length * 2 + this.percentBar >= 1) {
                                this.levelAni.color = this.levelUp.getChildByName("circleRight").color;
                                this.levelAni.active = true;
                            }
                            isInArray = true;
                            break;
                        } else {
                            if (this.doubleOnce && chunk.uuid == this.startChunkID) break;
                            if (chunk.uuid == this.chunkTempList[this.chunkTempList.length - 1].uuid) {
                                isInArray = true;
                                break;
                            }
                            this.cancel_times++;
                            this.chunkTempList.splice(k + 1, this.chunkTempList.length - k - 1);
                            this.audioMgr.linklineplayAdvanced(this.chunkTempList.length);
                            this.progressMgrJs.linklinesetProgressBar(this.chunkTempList.length);
                            var _num3 = this.chunkTempList.length;
                            if (_num3 >= 8) {
                                if (1 / this.levelUpTotal * _num3 * 2 + this.percentBar >= 1) {
                                    this.levelAni.color = this.levelUp.getChildByName("circleRight").color;
                                    this.levelAni.active = true;
                                } else this.levelAni.active = false;
                            } else {
                                if (1 / this.levelUpTotal * _num3 + this.percentBar >= 1 && _num3 != 1) {
                                    this.levelAni.color = this.levelUp.getChildByName("circleRight").color;
                                    this.levelAni.active = true;
                                } else this.levelAni.active = false;
                            }
                            this.doubleOnce = false;
                            isInArray = true;
                            break;
                        }
                    }
                }
                if (!isInArray && this.linklinechunk_chunkCollier(chunk, this.chunkTempList[this.chunkTempList.length - 1]) && !this.doubleOnce) {
                    this.chunkTempList.push(chunk);
                    this.audioMgr.linklineplayAdvanced(this.chunkTempList.length);
                    var chunAni = cc.instantiate(this.chunkAni);
                    chunAni.getChildByName("color").color = chunk.getComponent("linklinechunk").linklinegetChunkColor();
                    chunAni.setPosition(chunk.getPosition());
                    chunAni.zIndex = -1;
                    this.boardNode.addChild(chunAni);
                    chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.8), cc.fadeOut(0.5)), cc.callFunc(function () {
                        chunAni.destroy();
                    })));
                    this.cancel_times = 0;
                    this.progressMgrJs.linklinesetProgressBar(this.chunkTempList.length);
                    var _num4 = this.chunkTempList.length;
                    if (_num4 >= 8) {
                        if (1 / this.levelUpTotal * _num4 * 2 + this.percentBar >= 1) {
                            this.levelAni.color = this.levelUp.getChildByName("circleRight").color;
                            this.levelAni.active = true;
                        }
                    } else {
                        if (1 / this.levelUpTotal * _num4 + this.percentBar >= 1) {
                            this.levelAni.color = this.levelUp.getChildByName("circleRight").color;
                            this.levelAni.active = true;
                        }
                    }
                }
            }
        }
        //else{
        // if(this.chunkTempList.length >= 1){
        //     this.graphics.clear();
        //     this.graphics.moveTo(this.chunkTempList[0].getPositionX(), this.chunkTempList[0].getPositionY());
        //     sum += this.chunkTempList[0].getComponent("linklinechunk").linklinegetChunkDigit();
        //     for(var i = 1; i < this.chunkTempList.length; i++){
        //         this.graphics.lineTo(this.chunkTempList[i].getPositionX(), this.chunkTempList[i].getPositionY());
        //         sum += this.chunkTempList[i].getComponent("linklinechunk").linklinegetChunkDigit();
        //     }
        //     // 最后那个点
        //     this.graphics.lineTo(point2.x, point2.y);
        //     var chunkTempJS = this.chunkTempList[this.chunkTempList.length - 1].getComponent("linklinechunk");
        //     this.graphics.strokeColor = chunkTempJS.linklinegetChunkColor();
        //     this.graphics.stroke();
        // }
        //}
        for (var i = 0; i < this.chunkTempList.length; i++) {
            //this.graphics.lineTo(this.chunkTempList[i].getPositionX(), this.chunkTempList[i].getPositionY());
            sum += this.chunkTempList[i].getComponent("linklinechunk").linklinegetChunkDigit();
        }
        if (sum >= 2) {
            if (this.operateScore.active == false) {
                this.operateScore.setScale(0);
                this.operateScore.active = true;
                this.operateScore.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1).easing(cc.easeBackOut())));
            }
            this.operateScore.color = dataMgr.colorMgr.linklinegetColorById(this.linklinelineChunkSum(sum));

            if (this.linklinelineChunkSum(sum) <= 512) {
                this.operateScore.getChildByName("score").getComponent(cc.Label).string = this.linklinelineChunkSum(sum).toString();
            } else if (this.linklinelineChunkSum(sum) > 512 && this.linklinelineChunkSum(sum) <= 32768) {
                this.operateScore.getChildByName("score").getComponent(cc.Label).string = Math.floor(this.linklinelineChunkSum(sum) / 1000) + "."; // K
            } else if (this.linklinelineChunkSum(sum) == 65536) {
                this.operateScore.getChildByName("score").getComponent(cc.Label).string = 64 + ".";
            } else if (this.linklinelineChunkSum(sum) == 131072) {
                this.operateScore.getChildByName("score").getComponent(cc.Label).string = 128 + ".";
            } else if (this.linklinelineChunkSum(sum) == 262144) {
                this.operateScore.getChildByName("score").getComponent(cc.Label).string = 256 + ".";
            } else if (this.linklinelineChunkSum(sum) == 524288) {
                this.operateScore.getChildByName("score").getComponent(cc.Label).string = 512 + ".";
            } else if (this.linklinelineChunkSum(sum) >= 1048576) {
                this.operateScore.getChildByName("score").getComponent(cc.Label).string = Math.floor(this.linklinelineChunkSum(sum) / 1000000) + "/"; // M
            }

            //this.operateScore.getChildByName("score").getComponent(cc.Label).string = (this.linklinelineChunkSum(sum)).toString();
        }
    },
    update: function update(dt) {
        if (this.chunkTempList.length >= 1) {
            this.graphics.clear();
            this.graphics.moveTo(this.chunkTempList[0].getPositionX(), this.chunkTempList[0].getPositionY());
            //sum += this.chunkTempList[0].getComponent("linklinechunk").linklinegetChunkDigit();
            for (var i = 1; i < this.chunkTempList.length; i++) {
                this.graphics.lineTo(this.chunkTempList[i].getPositionX(), this.chunkTempList[i].getPositionY());
                //sum += this.chunkTempList[i].getComponent("linklinechunk").linklinegetChunkDigit();
            }
            // 最后那个点
            this.graphics.lineTo(this.touchPos.x, this.touchPos.y);
            var chunkTempJS = this.chunkTempList[this.chunkTempList.length - 1].getComponent("linklinechunk");
            this.graphics.strokeColor = chunkTempJS.linklinegetChunkColor();
            this.graphics.stroke();
        }
    },


    linklineuploadTime_score: function linklineuploadTime_score() {
        if (this.presentScore >= this.bestScore) {
            myGameCenterMgr.gameCenter(RANK.SCORE, this.presentScore);
            console.log("分数: " + this.presentScore);
        }
        cc.sys.localStorage.setItem("totalTime", dataMgr.myLocalMgr.totalTime);
        myGameCenterMgr.gameCenter(RANK.GAME_TIME, parseInt(dataMgr.myLocalMgr.totalTime));
        console.log("时间: " + parseInt(dataMgr.myLocalMgr.totalTime));
        var str = '';
        var num = Number(cc.sys.localStorage.getItem('hightestScore'));

        //myGameCenterMgr.gameCenter(RANK.MAX_K, num);
    },

    // 将chunkTempList中的chunk进行处理
    linklinetogetherChunk: function linklinetogetherChunk(lineChunkList) {
        this.progress_num = this.chunkTempList.length;
        if (this.progress_num >= 8 || this.doubleOnce) {
            this.progress_num *= 2;
        }
        this.audioMgr.linklineplayConnect_up();
        var chunkDigitSum = 0;
        if (!this.doubleOnce) {
            var lastChunk = lineChunkList[lineChunkList.length - 1];
            var lastChunkJS = lastChunk.getComponent("linklinechunk");
            for (var i = 0; i < lineChunkList.length; i++) {
                var chunkJS = lineChunkList[i].getComponent("linklinechunk");
                // 将最后一个之前的chunk 克隆 并 设置隐藏
                if (i < lineChunkList.length - 1) {
                    // 克隆
                    var cloneChunk = cc.instantiate(this.chunkPre);
                    var cloneChunkJS = cloneChunk.getComponent("linklinechunk");
                    cloneChunkJS.linklinesetColor_Digit(chunkJS.linklinegetChunkColor(), chunkJS.linklinegetChunkDigit());
                    if (cloneChunkJS.linklinegetChunkDigit() >= 1024 && cloneChunkJS.linklinegetChunkDigit() < 1000000) {
                        cloneChunk.getChildByName('kuang').active = true;
                        cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                        cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                    } else if (cloneChunkJS.linklinegetChunkDigit() >= 1000000) {
                        cloneChunk.getChildByName('kuang').active = true;
                        cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                        cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                    } else {
                        cloneChunk.getChildByName('kuang').active = false;
                    }
                    cloneChunk.setPosition(lineChunkList[i].getPosition());
                    this.boardNode.addChild(cloneChunk);
                    cloneChunk.zIndex = -1;
                    // 隐藏

                    lineChunkList[i].active = false;

                    var moveTime = cc.pDistance(cloneChunk.getPosition(), lastChunk.getPosition()) / 800;
                    // 移动完成后删除那个clone节点
                    cloneChunk.runAction(cc.sequence(cc.delayTime(0.02 * i), cc.spawn(cc.moveTo(moveTime, lastChunk.getPosition()), cc.scaleTo(moveTime, 0.3), cc.fadeOut(moveTime)), cc.callFunc(function () {
                        cloneChunk.destroy();
                    })));

                    //lineChunkList[i].active = false;
                }
                // 计算和           
                chunkDigitSum += chunkJS.linklinegetChunkDigit();
            }

            lastChunkJS.linklinesetColor_Digit(dataMgr.colorMgr.linklinegetColorById(this.linklinelineChunkSum(chunkDigitSum)), this.linklinelineChunkSum(chunkDigitSum));

            if (lastChunkJS.linklinegetChunkDigit() >= 1024 && lastChunkJS.linklinegetChunkDigit() < 1000000) {
                lastChunk.getChildByName('kuang').active = true;
                lastChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                lastChunk.getChildByName('kuang').color = lastChunk.children[0].color;
            } else if (lastChunkJS.linklinegetChunkDigit() >= 1000000) {
                lastChunk.getChildByName('kuang').active = true;
                lastChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                lastChunk.getChildByName('kuang').color = lastChunk.children[0].color;
            } else {
                lastChunk.getChildByName('kuang').active = false;
            }

            if (this.linklinelineChunkSum(chunkDigitSum) > 1000) {
                lastChunk.children[2].active = true;
                lastChunk.children[2].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklineballK'));
            } else if (this.linklinelineChunkSum(chunkDigitSum) > 1000000) {
                lastChunk.children[2].active = true;
                lastChunk.children[2].getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameSources/linklineballM'));
            } else {
                lastChunk.children[2].active = false;
            }
            this.linklinediscount(lastChunk);
            var num = 0;
            for (var _i2 = this.iBk - 1; _i2 >= 0; _i2--) {
                if (!this.chunkList[_i2][this.jBk].active) num++;
            }
            if (num == 0) lastChunk.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1.0)));else {
                this.dropChunkID = lastChunk.uuid;
            }

            var chunAni = cc.instantiate(this.chunkAni);
            chunAni.getChildByName("color").color = lastChunkJS.linklinegetChunkColor();
            chunAni.setPosition(lastChunk.getPosition());
            chunAni.zIndex = -1;
            this.boardNode.addChild(chunAni);
            chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.8), cc.fadeOut(0.5), cc.moveBy(0.1, cc.v2(0, -num * (2 * this.chunkRadius + this.chunkGapY)))), cc.callFunc(function () {
                chunAni.destroy();
            })));

            if (this.progress_num >= 8) this.linklineplAct();
        } else {
            var curChunk = lineChunkList[0];
            chunkDigitSum = 2;
            var curChunkJS = curChunk.getComponent("linklinechunk");
            var pos = this.node.convertToNodeSpaceAR(curChunk.getPosition());
            pos.x += 51.5;
            pos.y += 133;
            //console.log('当前坐标' + pos);
            this.linklineplAct();
            for (var i = 1; i < lineChunkList.length - 1; i++) {
                var chunkJS = lineChunkList[i].getComponent("linklinechunk");
                // 将最后一个之前的chunk 克隆 并 设置隐藏
                if (i < lineChunkList.length - 1) {
                    //克隆
                    var cloneChunk = cc.instantiate(this.chunkPre);
                    var cloneChunkJS = cloneChunk.getComponent("linklinechunk");
                    cloneChunkJS.linklinesetColor_Digit(chunkJS.linklinegetChunkColor(), chunkJS.linklinegetChunkDigit());

                    if (cloneChunkJS.linklinegetChunkDigit() >= 1024 && cloneChunkJS.linklinegetChunkDigit() < 1000000) {
                        cloneChunk.getChildByName('kuang').active = true;
                        cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                        cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                    } else if (cloneChunkJS.linklinegetChunkDigit() >= 1000000) {
                        cloneChunk.getChildByName('kuang').active = true;
                        cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                        cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                    } else {
                        cloneChunk.getChildByName('kuang').active = false;
                    }

                    cloneChunk.setPosition(lineChunkList[i].getPosition());
                    this.boardNode.addChild(cloneChunk);
                    cloneChunk.zIndex = -1;
                    // 隐藏
                    lineChunkList[i].active = false;

                    var moveTime = cc.pDistance(cloneChunk.getPosition(), curChunk.getPosition()) / 800;
                    //移动完成后删除那个clone节点
                    cloneChunk.runAction(cc.sequence(cc.delayTime(0.02 * i), cc.spawn(cc.moveTo(moveTime, curChunk.getPosition()), cc.scaleTo(moveTime, 0.3), cc.fadeOut(moveTime)), cc.callFunc(function () {
                        cloneChunk.destroy();
                    })));

                    //lineChunkList[i].active = false;
                }
                // 计算和           
                chunkDigitSum += chunkJS.linklinegetChunkDigit();
            }
            chunkDigitSum += 2 * chunkJS.linklinegetChunkDigit();
            curChunkJS.linklinesetColor_Digit(dataMgr.colorMgr.linklinegetColorById(this.linklinelineChunkSum(chunkDigitSum)), this.linklinelineChunkSum(chunkDigitSum));

            if (curChunkJS.linklinegetChunkDigit() >= 1024 && curChunkJS.linklinegetChunkDigit() < 1000000) {
                curChunk.getChildByName('kuang').active = true;
                curChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                curChunk.getChildByName('kuang').color = curChunk.children[0].color;
            } else if (curChunkJS.linklinegetChunkDigit() >= 1000000) {
                curChunk.getChildByName('kuang').active = true;
                curChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                curChunk.getChildByName('kuang').color = curChunk.children[0].color;
            } else {
                curChunk.getChildByName('kuang').active = false;
            }

            this.linklinediscount(curChunk);
            var _num5 = 0;
            for (var _i3 = this.iBk - 1; _i3 >= 0; _i3--) {
                if (!this.chunkList[_i3][this.jBk].active) _num5++;
            }
            if (_num5 == 0) {
                curChunk.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1.0)));
            } else {
                this.dropChunkID == curChunk.uuid;
            }

            var chunAni = cc.instantiate(this.chunkAni);
            chunAni.getChildByName("color").color = curChunkJS.linklinegetChunkColor();
            chunAni.setPosition(curChunk.getPosition());
            chunAni.zIndex = -1;
            this.boardNode.addChild(chunAni);
            chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.8), cc.fadeOut(0.5), cc.moveBy(0.1, cc.v2(0, -_num5 * (2 * this.chunkRadius + this.chunkGapY)))), cc.callFunc(function () {
                chunAni.destroy();
            })));
        }
        var correctSum = this.linklinelineChunkSum(chunkDigitSum);

        cc.log('得分' + correctSum);
        if (correctSum == 1024) {
            num_1k += 1;
            cc.sys.localStorage.setItem('num_1k', num_1k);
        }
        if (correctSum > this.hightestScore) {
            this.audioMgr.linklineplayHigh_single_score();
            cc.sys.localStorage.setItem("hightestScore", correctSum);
            this.hightestScore = correctSum;
            //console.log('新nk')
            if (correctSum == 512) {
                if (!isFiveStar) {
                    this.fiveStarNode.active = true;
                    this.linklinemySlideIn(this.fiveStarNode.getChildByName("fiveStar"));
                } else {
                    myGameCenterMgr.fiveStar();
                }
            }
            if (correctSum >= 1024) {
                //console.log('nk对话框')
                this.audioMgr.linklineplayDialog();
                var node = this.node.getChildByName('dialouge');
                node.getChildByName('block').active = true;
                node.getChildByName('block').runAction(cc.fadeIn(0.3));
                if (correctSum >= 1024 && correctSum <= 32768) {
                    node.getChildByName('dialouge1').getChildByName('label').getComponent(cc.Label).string = Math.floor(correctSum / 1000) + "."; // K
                } else if (correctSum == 65536) {
                    node.getChildByName('dialouge1').getChildByName('label').getComponent(cc.Label).string = 64 + ".";
                } else if (correctSum == 131072) {
                    node.getChildByName('dialouge1').getChildByName('label').getComponent(cc.Label).string = 128 + ".";
                } else if (correctSum == 262144) {
                    node.getChildByName('dialouge1').getChildByName('label').getComponent(cc.Label).string = 256 + ".";
                } else if (correctSum == 524288) {
                    node.getChildByName('dialouge1').getChildByName('label').getComponent(cc.Label).string = 512 + ".";
                } else if (correctSum >= 1048576) {
                    node.getChildByName('dialouge1').getChildByName('label').getComponent(cc.Label).string = Math.floor(correctSum / 1000000) + "/"; // M
                }
                this.dialouge_Time = Number(new Date());
                node.getChildByName('dialouge1').setScale(0);
                node.getChildByName('dialouge1').active = true;
                node.getChildByName('dialouge1').runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
            }
        }
        cc.find('Canvas/game/top/levelUp/circleLeft').runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1)));
        this.levelUp.getChildByName("progressBar").runAction(cc.sequence(cc.scaleTo(0.2, 1, 0.6), cc.scaleTo(0.2, 1, 1)));
        if (this.doubleOnce) {
            var _num6 = this.progress_num;
            if (_num6 * (1 / this.levelUpTotal) + this.levelUp.getChildByName("progressBar").getComponent(cc.ProgressBar).progress >= 1) {
                _num6 = (1 - this.levelUp.getChildByName("progressBar").getComponent(cc.ProgressBar).progress) * this.levelUpTotal;
            }
            this.scheduleOnce(function () {
                this.linklinebarAct(_num6);
            }, 0.4);
        }
        // 得分 
        this.linklineaddScores(correctSum);

        this.scheduleOnce(function () {
            // 每次连完检测是否游戏结束
            if (this.linklineisGameover()) {
                // 锤子是否可用
                if (this.isHammer || this.doubleNum) {
                    this.audioMgr.linklineplayDialog();
                    this.useHammerRemind.active = true;
                    this.linklinemySlideIn(this.useHammerRemind.getChildByName("remind"));

                    if (this.isHammer && this.doubleNum) {
                        this.hammer_btn.active = true;
                        this.hammer_btn.setPositionX(100);
                        this.double_btn.active = true;
                        this.double_btn.setPositionX(-100);
                    } else if (this.isHammer) {
                        this.hammer_btn.active = true;
                        this.hammer_btn.setPositionX(0);
                        this.double_btn.active = false;
                    } else {
                        this.double_btn.active = true;
                        this.double_btn.setPositionX(0);
                        this.hammer_btn.active = false;
                    }
                    // this.useHammerRemind.getChildByName("remind").getChildByName("useHammerBtn").runAction(
                    //     cc.repeatForever(cc.sequence(cc.scaleTo(0.4, 1.2), cc.scaleTo(0.4, 1.0)))
                    // );
                } else {
                    //  每次死亡上传 游戏时间 和 最高分
                    console.log("gameover!!!");
                    this.gameoverTimes++;
                    cc.sys.localStorage.setItem("gameoverTimes", this.gameoverTimes);
                    this.blockInputNode2.active = true;
                    this.linklinegameoverAni();
                    this.scheduleOnce(function () {
                        this.blockInputNode2.active = false;
                    }, 2.0);
                    this.scheduleOnce(function () {

                        // 满足条件 则 弹出复活界面
                        if (this.canRelive) {
                            this.audioMgr.linklineplayRevive();
                            this.node.getChildByName("relive").active = true;
                            this.linklinemySlideIn(this.node.getChildByName("relive").getChildByName("reliveBtns"));
                            // 倒计时5s
                            this.circleYellow.getComponent(cc.ProgressBar).progress = 1;
                            this.schedule(this.linklinecountTime, 0.01);
                            this.schedule(this.linklinecountTime2, 1);
                            this.canRelive = false;
                        } else {
                            // 死亡
                            if (!noAD && this.gameoverTimes % AD_CONFIG.DIED_TIMES == 0) {
                                console.log("死亡广告!!!");
                                if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIED_PRO / 100) {
                                    console.log("full screen AD!!!");
                                    myADMgr.showFullScreenAD();
                                }
                            }
                            this.linklinegameEvaluate();
                            this.node.getChildByName("gameover").active = true;
                            this.linklinemySlideIn(this.node.getChildByName("gameover").getChildByName("gameoverBtns"));
                        }
                    }, 2.0);
                }
            } else {
                // 等级进度条 加
                // 保存棋盘数据
                console.log("continue!");
                this.scheduleOnce(this.linklinesaveBoardData, 0.4);
            }
        }, 0.3);
        this.scheduleOnce(function () {
            this.schedule(this.linklineaddProgerssBar, 0.025);
        }, 0.4);
        // 计时归0
        this.timeCount = 0;
    },

    linklineuseHammer_giveUp: function linklineuseHammer_giveUp() {
        this.audioMgr.linklineplayUi_btn();
        this.linklinemySlideOut(this.useHammerRemind.getChildByName("remind"));
        //  每次死亡上传 游戏时间 和 最高分
        console.log("gameover!!!");
        this.gameoverTimes++;
        cc.sys.localStorage.setItem("gameoverTimes", this.gameoverTimes);
        this.blockInputNode2.active = true;
        this.linklinegameoverAni();
        this.scheduleOnce(function () {
            this.blockInputNode2.active = false;
        }, 2.0);
        this.scheduleOnce(function () {

            // 满足条件 则 弹出复活界面
            if (this.canRelive) {
                this.audioMgr.linklineplayRevive();
                this.node.getChildByName("relive").active = true;
                this.linklinemySlideIn(this.node.getChildByName("relive").getChildByName("reliveBtns"));
                // 倒计时5s
                this.circleYellow.getComponent(cc.ProgressBar).progress = 1;
                this.schedule(this.linklinecountTime, 0.01);
                this.schedule(this.linklinecountTime2, 1);
                this.canRelive = false;
                cc.sys.localStorage.setItem('canRelive', 0);
            } else {
                // 死亡
                if (!noAD && this.gameoverTimes % AD_CONFIG.DIED_TIMES == 0) {
                    console.log("死亡广告!!!");
                    if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIED_PRO / 100) {
                        console.log("full screen AD!!!");
                        myADMgr.showFullScreenAD();
                    }
                }
                this.linklinegameEvaluate();
                this.node.getChildByName("gameover").active = true;
                this.linklinemySlideIn(this.node.getChildByName("gameover").getChildByName("gameoverBtns"));
            }
        }, 2.0);
    },

    linklinesupportUs: function linklinesupportUs() {
        this.linklinemySlideOut(this.fiveStarNode.getChildByName("fiveStar"));
        if (this.linklineisNetWork()) {
            myGameCenterMgr.fiveStar();
            isFiveStar = true;
            cc.sys.localStorage.setItem("isFiveStar", "true");
        }
    },

    linklinecloseFiveStarNode: function linklinecloseFiveStarNode() {
        //this.fiveStarNode.active = false;
        this.linklinemySlideOut(this.fiveStarNode.getChildByName("fiveStar"));
    },

    // 死亡动效
    linklinegameoverAni: function linklinegameoverAni() {
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                this.chunkList[i][j].runAction(cc.sequence(cc.delayTime(0.15 * i + 0.15 * j), cc.scaleTo(0.2, 1.3), cc.scaleTo(0.2, 1.0)));
            }
        }
    },

    // 倒计时
    linklinecountTime: function linklinecountTime() {
        this.circleYellow.getComponent(cc.ProgressBar).progress -= 1 / 500;
        if (this.circleYellow.getComponent(cc.ProgressBar).progress <= 0) {
            this.unschedule(this.linklinecountTime);
            this.linklinemySlideOut(this.node.getChildByName("relive").getChildByName("reliveBtns"));

            this.linklinegameEvaluate();
            this.scheduleOnce(function () {
                this.node.getChildByName("gameover").active = true;
                this.linklinemySlideIn(this.node.getChildByName("gameover").getChildByName("gameoverBtns"));
            }, 0.6);
        }
    },
    linklinecountTime2: function linklinecountTime2() {
        var label = cc.find('Canvas/game/relive/reliveBtns/label').getComponent(cc.Label);
        label.string = Number(label.string) - 1;
        label.node.runAction(cc.sequence(cc.scaleTo(0.2, 1.1), cc.scaleTo(0.2, 1)));
        if (Number(label.string) == 0) {
            this.unschedule(this.linklinecountTime2, 1);
        }
    },

    // 将连成线的chunk 进行运算 得到数值
    linklinelineChunkSum: function linklinelineChunkSum(sum) {
        var count = 0;
        while (sum >= 2) {
            sum /= 2;
            count++;
        }
        return Math.pow(2, count);
    },
    // 设置当前分数 和 历史最高分
    linklineaddScores: function linklineaddScores(score) {
        if (this.doubleOnce) score *= 4;else if (this.chunkTempList.length >= 8) {
            score *= 2;
        }
        this.presentScore += score;
        cc.sys.localStorage.setItem("presentScore", this.presentScore);
        if (this.bestScore <= this.presentScore) {
            if (!this.breakRecord && this.restartTimes != 0) {
                this.audioMgr.linklineplayBest_score();
                cc.find('Canvas/game/top/pause_scores/presentScore').runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 0.8), cc.scaleTo(0.2, 1.2), cc.scaleTo(0.1, 1)));
                //this.audioMgr.playDialog();
                var node = this.node.getChildByName('dialouge');
                node.getChildByName('block').active = true;
                node.getChildByName('block').runAction(cc.fadeIn(0.3));
                this.dialouge_Time = Number(new Date());
                node.getChildByName('dialouge2').setScale(0);
                node.getChildByName('dialouge2').active = true;
                node.getChildByName('dialouge2').runAction(cc.scaleTo(0.3, 1).easing(cc.easeBackOut()));
            }
            this.bestScore = this.presentScore;
            // 存到本地磁盘
            cc.sys.localStorage.setItem("bestScore", this.bestScore);
            this.breakRecord = true;
            cc.sys.localStorage.setItem('breakRecord', 1);
        }
        //console.log("presentScore: " + this.presentScore);
        //console.log("bestScore: " + this.bestScore);

        this.pause_scores.getChildByName("presentScore").getChildByName("score").getComponent(cc.Label).string = this.presentScore.toString();
        this.pause_scores.getChildByName("bestScore").getChildByName("score").getComponent(cc.Label).string = this.bestScore.toString();
    },
    // 设置进度条颜色、进度 及 旁边两圆圈的颜色
    linklineaddProgerssBar: function linklineaddProgerssBar() {
        this.percentBar += 1 / this.levelUpTotal;
        this.progress_times += 1;
        if (this.progress_num == this.progress_times) {
            this.unschedule(this.linklineaddProgerssBar);
            this.progress_times = 0;
        }
        cc.sys.localStorage.setItem("percentBar", this.percentBar);
        if (this.percentBar >= 1.0) {
            this.unschedule(this.linklineaddProgerssBar);
            this.progress_times = 0;
            this.levelUp_time = Number(new Date());
            this.linklinelevelUpFun();
        }
        this.levelUp.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = this.percentBar;
        //console.log("this.percentBar : " + this.percentBar);
    },
    linklinelevelUpFun: function linklinelevelUpFun() {
        this.audioMgr.linklineplayLevel_up();
        this.percentBar = 0;
        cc.sys.localStorage.setItem("percentBar", this.percentBar);
        this.circleNumLeft += 1;
        if (this.circleNumLeft < 6) {
            this.levelUpTotal = 30;
            if (this.circleNumLeft == 1) this.levelUpTotal = 30;
            if (this.circleNumLeft == 2) this.levelUpTotal = 40;
            if (this.circleNumLeft == 3) this.levelUpTotal = 50;
            if (this.circleNumLeft == 4) this.levelUpTotal = 60;
            if (this.circleNumLeft == 5) this.levelUpTotal = 70;
        } else {
            this.levelUpTotal = 75 + 5 * (this.circleNumLeft - 6);
        }

        this.levelUp.getChildByName("circleLeft").getChildByName("curLevel").getComponent(cc.Label).string = this.circleNumLeft.toString();
        this.levelUp.getChildByName("circleLeft").color = dataMgr.colorMgr.linklinegetCircleColorByIndex(this.circleNumLeft % dataMgr.colorMgr.linklinegetCircleColorLength() + 1);
        cc.sys.localStorage.setItem("circleNum1", this.circleNumLeft);
        this.circleNumRight += 1;

        this.levelUp.getChildByName("circleRight").getChildByName("nextLevel").getComponent(cc.Label).string = this.circleNumRight.toString();
        this.levelUp.getChildByName("circleRight").color = dataMgr.colorMgr.linklinegetCircleColorByIndex(this.circleNumRight % dataMgr.colorMgr.linklinegetCircleColorLength() + 1);
        cc.sys.localStorage.setItem("circleNum2", this.circleNumRight);

        this.levelUp.getChildByName("progressBar").getChildByName("bar").color = dataMgr.colorMgr.linklinegetCircleColorByIndex(this.circleNumLeft % dataMgr.colorMgr.linklinegetCircleColorLength() + 1);

        // 弹出升级提示框
        this.node.getChildByName("levelUpMes").getChildByName('block').runAction(cc.fadeIn(0.3));
        this.node.getChildByName("levelUpMes").active = true;
        this.node.getChildByName("levelUpMes").getChildByName('Ribbon').getComponent(cc.ParticleSystem).resetSystem();
        this.node.getChildByName("levelUpMes").getChildByName('levelUp').getComponent(sp.Skeleton).setAnimation(1, 'start1', false);
        this.node.getChildByName("levelUpMes").getChildByName('levelUp').getComponent(sp.Skeleton).addAnimation(1, 'wait2', true);
        this.audioMgr.linklineplayDialog();
        this.node.getChildByName("levelUpMes").getChildByName('TapToContinue').stopAllActions();
        this.scheduleOnce(function () {
            this.node.getChildByName("levelUpMes").getChildByName('TapToContinue').active = true;
            this.node.getChildByName("levelUpMes").getChildByName('TapToContinue').runAction(cc.repeatForever(cc.sequence(cc.fadeOut(0.7), cc.fadeIn(0.7))));
        }, 2);
        this.linklineuploadTime_score();
    },


    // 读取棋盘数据
    linklineloadBoardData: function linklineloadBoardData() {
        return JSON.parse(cc.sys.localStorage.getItem("LocalBoardData"));
    },

    // 保存棋盘数据到本地磁盘
    linklinesaveBoardData: function linklinesaveBoardData() {
        var obj = {};
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                // 对象名  key
                var row_col = "RC" + i + j;
                // 
                var boardData = {
                    chunkDigit: this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkDigit()
                };
                obj[row_col] = boardData;
            }
        }
        cc.sys.localStorage.setItem("LocalBoardData", JSON.stringify(obj));
        //console.log(cc.sys.localStorage.getItem("LocalBoardData"));
    },

    // 判断是否 gameover
    linklineisGameover: function linklineisGameover() {
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                var currentChunkJS = this.chunkList[i][j].getComponent("linklinechunk");
                // 上边
                if (i < this.ROW - 1) {
                    var upChunkJS = this.chunkList[i + 1][j].getComponent("linklinechunk");
                    if (currentChunkJS.linklinegetChunkDigit() == upChunkJS.linklinegetChunkDigit()) {
                        return false;
                    }
                }
                // 右边
                if (j < this.COL - 1) {
                    var rightChunkJS = this.chunkList[i][j + 1].getComponent("linklinechunk");
                    if (currentChunkJS.linklinegetChunkDigit() == rightChunkJS.linklinegetChunkDigit()) {
                        return false;
                    }
                }
            }
        }
        this.isGameOver = true;
        cc.sys.localStorage.setItem('isGameOver', 1);
        return true;
    },

    linklinegameEvaluate: function linklinegameEvaluate() {
        var node = cc.find('Canvas/game/gameover/gameoverBtns');
        node.getChildByName('score').getComponent(cc.Label).string = this.presentScore;
        var label_rank = node.getChildByName('rank').getComponent(cc.Label);
        if (this.presentScore >= 100000000) {
            label_rank.string = 100 + '-';
        } else if (this.presentScore >= 10000000) {
            var i = parseInt(this.presentScore / 10000000);
            i = i + 90;
            label_rank.string = i + '-';
        } else if (this.presentScore >= 1000000) {
            var _i4 = parseInt(this.presentScore / 1000000);
            _i4 = _i4 + 80;
            label_rank.string = _i4 + '-';
        } else if (this.presentScore >= 100000) {
            var _i5 = parseInt(this.presentScore / 100000);
            _i5 = _i5 + 70;
            label_rank.string = _i5 + '-';
        } else if (this.presentScore >= 10000) {
            var _i6 = parseInt(this.presentScore / 10000);
            _i6 = _i6 + 60;
            label_rank.string = _i6 + '-';
        } else if (this.presentScore >= 1000) {
            var _i7 = parseInt((this.presentScore - 1000) / 300);
            _i7 = _i7 + 30;
            label_rank.string = _i7 + '-';
        } else {
            var _i8 = parseInt((this.presentScore - 100) / 50);
            _i8 += 1;
            if (_i8 < 0) _i8 = 0;
            label_rank.string = _i8 + '-';
        }
        if (this.breakRecord && this.restartTimes != 0) {
            node.getChildByName('medal').active = true;
            node.getChildByName('isNewBest').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameOverSources/linklinenew_best.png'));
            node.getChildByName('score').setPositionX(35);
            var num = parseInt(Math.random() * 3);
            this.evaluate.getComponent(cc.Sprite).spriteFrame = this.evaluateSprite[num];
        } else {

            node.getChildByName('medal').active = false;
            node.getChildByName('isNewBest').getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/linklineGameOverSources/linklinescore001.png'));
            node.getChildByName('score').setPositionX(0);
            var _num7 = parseInt(Math.random() * 3) + 3;
            this.evaluate.getComponent(cc.Sprite).spriteFrame = this.evaluateSprite[_num7];
        }
        var sum = Number(cc.sys.localStorage.getItem('hightestScore'));
        //node.getChildByName('bestNum').color = dataMgr.colorMgr.linklinegetColorById(this.linklinelineChunkSum(sum));
        var label = node.getChildByName('num').getComponent(cc.Label);
        if (this.linklinelineChunkSum(sum) <= 512) {
            label.string = this.linklinelineChunkSum(sum).toString();
        } else if (this.linklinelineChunkSum(sum) > 512 && this.linklinelineChunkSum(sum) <= 32768) {
            label.string = Math.floor(this.linklinelineChunkSum(sum) / 1000) + "."; // K
        } else if (this.linklinelineChunkSum(sum) == 65536) {
            label.string = 64 + ".";
        } else if (this.linklinelineChunkSum(sum) == 131072) {
            label.string = 128 + ".";
        } else if (this.linklinelineChunkSum(sum) == 262144) {
            label.string = 256 + ".";
        } else if (this.linklinelineChunkSum(sum) == 524288) {
            label.string = 512 + ".";
        } else if (this.linklinelineChunkSum(sum) >= 1048576) {
            label.string = Math.floor(this.linklinelineChunkSum(sum) / 1000000) + "/"; // M
        }
    },


    // 提示 的 动效
    linklinetipsChunkAction: function linklinetipsChunkAction(chunk1, chunk2) {
        var callFunction = cc.callFunc(function () {
            chunk2.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1.0).easing(cc.easeBackOut())));
        });
        chunk1.runAction(cc.sequence(cc.scaleTo(0.2, 1.2), cc.scaleTo(0.2, 1.0).easing(cc.easeBackOut()), callFunction));
    },
    // 提示
    linklinetips: function linklinetips() {
        var countNumber = 0;
        while (countNumber <= 10000) {
            // 随机一个位置
            countNumber++;
            var row = Math.floor(Math.random() * this.ROW);
            var col = Math.floor(Math.random() * this.COL);
            var currentChunk = this.chunkList[row][col];
            var currentChunkJS = currentChunk.getComponent("linklinechunk");
            // 上边
            if (row < this.ROW - 1) {
                var upChunk = this.chunkList[row + 1][col];
                var upChunkJS = upChunk.getComponent("linklinechunk");
                if (currentChunkJS.linklinegetChunkDigit() == upChunkJS.linklinegetChunkDigit()) {
                    this.linklinetipsChunkAction(currentChunk, upChunk);
                    break;
                }
            }
            // 下边
            if (row > 0) {
                var downChunk = this.chunkList[row - 1][col];
                var downChunkJS = downChunk.getComponent("linklinechunk");
                if (currentChunkJS.linklinegetChunkDigit() == downChunkJS.linklinegetChunkDigit()) {
                    this.linklinetipsChunkAction(currentChunk, downChunk);
                    break;
                }
            }
            // 左边
            if (col > 0) {
                var leftChunk = this.chunkList[row][col - 1];
                var leftChunkJS = leftChunk.getComponent("linklinechunk");
                if (currentChunkJS.linklinegetChunkDigit() == leftChunkJS.linklinegetChunkDigit()) {
                    this.linklinetipsChunkAction(currentChunk, leftChunk);
                    break;
                }
            }
            // 右边
            if (col < this.COL - 1) {
                var rightChunk = this.chunkList[row][col + 1];
                var rightChunkJS = rightChunk.getComponent("linklinechunk");
                if (currentChunkJS.linklinegetChunkDigit() == rightChunkJS.linklinegetChunkDigit()) {
                    this.linklinetipsChunkAction(currentChunk, rightChunk);
                    break;
                }
            }
        }
    },

    // 防止使用锤子时能连线
    linklinechunkShake: function linklinechunkShake() {
        var self = this;
        self.boardNode2.active = true;
        self.node.getChildByName("bottom").active = false;
        if (this.isUsingHammer) {
            this.hammerTips.getChildByName("hammer").active = true;
            this.hammerTips.getChildByName("hammer").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1), cc.scaleTo(0.5, 1.1))));
        }
        if (this.isUsingDouble) {
            this.hammerTips.getChildByName("double").active = true;
            this.hammerTips.getChildByName("double").runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.5, 1), cc.scaleTo(0.5, 1.1))));
        }

        this.board2_list = [];
        for (var i = 0; i < self.ROW; i++) {
            this.board2_list[i] = [];
            for (var j = 0; j < self.COL; j++) {
                //console.log("linklinechunkShake!!!");
                var cloneChunk = cc.instantiate(self.chunkPre);
                var cloneChunkJS = cloneChunk.getComponent("linklinechunk");
                var curChunk = self.chunkList[i][j];
                var curChunkJS = curChunk.getComponent("linklinechunk");
                curChunk.active = false;
                cloneChunkJS.linklinesetColor_Digit(curChunkJS.linklinegetChunkColor(), curChunkJS.linklinegetChunkDigit());

                if (cloneChunkJS.linklinegetChunkDigit() >= 1024 && cloneChunkJS.linklinegetChunkDigit() < 1000000) {
                    cloneChunk.getChildByName('kuang').active = true;
                    cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                    cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                } else if (cloneChunkJS.linklinegetChunkDigit() >= 1000000) {
                    cloneChunk.getChildByName('kuang').active = true;
                    cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                    cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                } else {
                    cloneChunk.getChildByName('kuang').active = false;
                }

                cloneChunk.setPosition(curChunk.getPosition());
                self.boardNode2.addChild(cloneChunk);
                self.board2_list[i].push(cloneChunk);
            }
        }

        self.boardNode2.on(cc.Node.EventType.TOUCH_START, function (event) {
            var touchStartPos = self.boardNode2.convertToNodeSpaceAR(event.getLocation());
            if (self.isUsingHammer) {
                self.linklinehammer(touchStartPos);
            } else if (self.isUsingDouble) {
                self.linklinedouble(touchStartPos);
            }
            if (!self.isUsingDouble && !self.isUsingHammer) self.scheduleOnce(self.linklinedropChunkAct, 0.1);
            self.scheduleOnce(self.linklinesaveBoardData, 0.4);
            //console.log(this.boardNode2.childrenCount);
        }, self.boardNode2);

        if (this.isUsingHammer) {
            self.schedule(this.linklineboard2Shake, 0.1);
        } else if (this.isUsingDouble) {
            this.linklineboard2Ani();
            this.schedule(this.linklineboard2Ani, 1);
        }
    },
    // 晃动 效果
    linklineboard2Shake: function linklineboard2Shake() {
        var x = this.blockBlackX;
        var y = this.blockBlackY;
        this.boardNode2.runAction(cc.sequence(cc.moveTo(0.05, cc.v2(x + 2, y + 2)), cc.moveTo(0.05, cc.v2(x - 2, y - 2))));
    },
    //涟漪效果
    linklineboard2Ani: function linklineboard2Ani() {
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                var chunk = this.board2_list[i][j];
                if (chunk.getComponent('linklinechunk').linklinegetChunkDigit() <= 8) {
                    var chunAni = cc.instantiate(this.chunkAni);
                    chunAni.getChildByName("color").color = chunk.getComponent("linklinechunk").linklinegetChunkColor();
                    chunAni.setPosition(chunk.getPosition());
                    chunAni.zIndex = -1;
                    this.boardNode2.addChild(chunAni);

                    chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.5, 1.8), cc.fadeOut(0.5)), cc.callFunc(function () {
                        chunAni.destroy();
                    })));
                }
            }
        }
    },
    // 锤子 
    linklinehammer: function linklinehammer(point) {
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                // 点中的chunk
                if (this.linklinechunk_fingerCollier(this.chunkList[i][j], point)) {
                    console.log("hammer!!!");
                    this.audioMgr.linklineplayUseHammer();

                    var chunAni = cc.instantiate(this.chunkAni);
                    chunAni.getChildByName("color").color = this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkColor();
                    chunAni.setPosition(this.chunkList[i][j].getPosition());
                    chunAni.zIndex = -1;
                    this.boardNode.addChild(chunAni);
                    chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 1.8), cc.fadeOut(0.3)), cc.callFunc(function () {
                        chunAni.destroy();
                    })));
                    this.isUsingHammer = false;
                    this.blockInputNode1.active = false;
                    this.boardNode2.active = false;
                    this.unschedule(this.linklineboard2Shake);
                    this.boardNode2.setPosition(this.blockBlackX, this.blockBlackY);
                    for (var m = 0; m < this.ROW; m++) {
                        for (var n = 0; n < this.COL; n++) {
                            this.board2_list[m][n].destroy();
                            this.chunkList[m][n].active = true;
                        }
                    }
                    this.chunkList[i][j].active = false;
                    this.board2_list.length = 0;

                    this.isHammer = false;
                    cc.sys.localStorage.setItem('isHammer', 0);
                    var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
                    tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame2;
                    //this.useHammerRemind.getChildByName("remind").getChildByName("useHammerBtn").getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame4;
                    this.node.getChildByName("bottom").active = true;
                    this.hammerTips.getChildByName("hammer").active = false;
                    this.hammerTips.getChildByName("hammer").stopAllActions();
                    this.scheduleOnce(function () {
                        // 每次连完检测是否游戏结束
                        if (this.linklineisGameover()) {
                            // 锤子是否可用
                            if (this.isHammer || this.doubleNum) {
                                this.audioMgr.linklineplayDialog();
                                this.useHammerRemind.active = true;
                                this.linklinemySlideIn(this.useHammerRemind.getChildByName("remind"));

                                if (this.isHammer && this.doubleNum) {
                                    this.hammer_btn.active = true;
                                    this.hammer_btn.setPositionX(100);
                                    this.double_btn.active = true;
                                    this.double_btn.setPositionX(-100);
                                } else if (this.isHammer) {
                                    this.hammer_btn.active = true;
                                    this.hammer_btn.setPositionX(0);
                                    this.double_btn.active = false;
                                } else {
                                    this.double_btn.active = true;
                                    this.double_btn.setPositionX(0);
                                    this.hammer_btn.active = false;
                                }
                            } else {
                                //  每次死亡上传 游戏时间 和 最高分
                                console.log("gameover!!!");
                                this.gameoverTimes++;
                                cc.sys.localStorage.setItem("gameoverTimes", this.gameoverTimes);
                                this.blockInputNode2.active = true;
                                this.linklinegameoverAni();
                                this.scheduleOnce(function () {
                                    this.blockInputNode2.active = false;
                                }, 2.0);
                                this.scheduleOnce(function () {

                                    // 满足条件 则 弹出复活界面
                                    if (this.canRelive) {
                                        console.log('复活');
                                        this.audioMgr.linklineplayRevive();
                                        this.node.getChildByName("relive").active = true;
                                        this.linklinemySlideIn(this.node.getChildByName("relive").getChildByName("reliveBtns"));
                                        // 倒计时5s
                                        this.circleYellow.getComponent(cc.ProgressBar).progress = 1;
                                        this.schedule(this.linklinecountTime, 0.01);
                                        this.canRelive = false;
                                    } else {
                                        // 死亡
                                        if (!noAD && this.gameoverTimes % AD_CONFIG.DIED_TIMES == 0) {
                                            console.log("死亡广告!!!");
                                            if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIED_PRO / 100) {
                                                console.log("full screen AD!!!");
                                                myADMgr.showFullScreenAD();
                                            }
                                        }
                                        this.linklinegameEvaluate();
                                        this.node.getChildByName("gameover").active = true;
                                        this.linklinemySlideIn(this.node.getChildByName("gameover").getChildByName("gameoverBtns"));
                                    }
                                }, 2.0);
                            }
                        } else {
                            // 保存棋盘数据
                            console.log("continue!");
                            this.scheduleOnce(this.linklinesaveBoardData, 0.4);
                            //console.log(this.boardNode.childrenCount);
                            //console.log(this.boardNode2.childrenCount);
                        }
                    }, 0.4);
                    break;
                    //return;
                    // ... 动效
                }
            }
        }
    },

    // 按顺序重新排列
    linklinesortChunk: function linklinesortChunk() {
        var tempArray = new Array();
        // 取出数值放入tempArray中
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                tempArray.push(this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkDigit());
            }
        }
        // 排序
        for (var i = 0; i < tempArray.length - 1; i++) {
            for (var j = i + 1; j < tempArray.length; j++) {
                if (tempArray[i] > tempArray[j]) {
                    var tempNum = tempArray[i];
                    tempArray[i] = tempArray[j];
                    tempArray[j] = tempNum;
                }
            }
        }
        // 设置chunk位置、颜色
        var index = this.ROW * this.COL;
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                if (i % 2 == 0) {
                    this.chunkList[i][j].getComponent("linklinechunk").linklinesetColor_Digit(dataMgr.colorMgr.linklinegetColorById(tempArray[index - 1]), tempArray[index - 1]);

                    if (this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkDigit() >= 1024 && this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkDigit() < 1000000) {
                        this.chunkList[i][j].getChildByName('kuang').active = true;
                        this.chunkList[i][j].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                        this.chunkList[i][j].getChildByName('kuang').color = this.chunkList[i][j].children[0].color;
                    } else if (this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkDigit() >= 1000000) {
                        this.chunkList[i][j].getChildByName('kuang').active = true;
                        this.chunkList[i][j].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                        this.chunkList[i][j].getChildByName('kuang').color = this.chunkList[i][j].children[0].color;
                    } else {
                        this.chunkList[i][j].getChildByName('kuang').active = false;
                    }
                } else {
                    this.chunkList[i][4 - j].getComponent("linklinechunk").linklinesetColor_Digit(dataMgr.colorMgr.linklinegetColorById(tempArray[index - 1]), tempArray[index - 1]);

                    if (this.chunkList[i][4 - j].getComponent("linklinechunk").linklinegetChunkDigit() >= 1024 && this.chunkList[i][4 - j].getComponent("linklinechunk").linklinegetChunkDigit() < 1000000) {
                        this.chunkList[i][4 - j].getChildByName('kuang').active = true;
                        this.chunkList[i][4 - j].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                        this.chunkList[i][4 - j].getChildByName('kuang').color = this.chunkList[i][4 - j].children[0].color;
                    } else if (this.chunkList[i][4 - j].getComponent("linklinechunk").linklinegetChunkDigit() >= 1000000) {
                        this.chunkList[i][4 - j].getChildByName('kuang').active = true;
                        this.chunkList[i][4 - j].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                        this.chunkList[i][4 - j].getChildByName('kuang').color = this.chunkList[i][4 - j].children[0].color;
                    } else {
                        this.chunkList[i][4 - j].getChildByName('kuang').active = false;
                    }
                }
                index--;
            }
        }
        this.linklinesaveBoardData();
    },

    // 重置按钮
    linklineresetBtn: function linklineresetBtn(isCount) {
        this.audioMgr.linklineplayUi_btn();
        this.doubleModeTimes = 0;
        cc.sys.localStorage.setItem('doubleModeTimes', 0);

        cc.find('Canvas/game/bottom/double003').getComponent(cc.Sprite).spriteFrame = this.doubleSprFrame1;
        cc.sys.localStorage.setItem('doubleNum', 1);
        this.doubleNum = 1;

        this.linklinemySlideOut(cc.find("Canvas/game/pauseNode/pauseNodeBtns"));
        this.restartTimes++;
        cc.sys.localStorage.setItem("restartTimes", this.restartTimes);

        this.breakRecord = false;
        cc.sys.localStorage.setItem('breakRecord', 0);
        //复活次数重置
        this.canRelive = true;
        cc.sys.localStorage.setItem('canRelive', 1);
        var label = cc.find('Canvas/game/relive/reliveBtns/label').getComponent(cc.Label);
        label.string = 5;

        this.isGameOver = false;
        cc.sys.localStorage.setItem('isGameOver', 0);
        // 分数重置
        this.presentScore = 0;
        this.pause_scores.getChildByName("presentScore").getChildByName("score").getComponent(cc.Label).string = this.presentScore.toString();
        dataMgr.myLocalMgr.presentScore = 0;
        cc.sys.localStorage.setItem("presentScore", 0);

        this.circleColorLeft = dataMgr.colorMgr.linklinegetCircleColorByIndex(this.circleNumLeft % dataMgr.colorMgr.linklinegetCircleColorLength() + 1);
        this.circleColorRight = dataMgr.colorMgr.linklinegetCircleColorByIndex(this.circleNumRight % dataMgr.colorMgr.linklinegetCircleColorLength() + 1);
        this.levelUp.getChildByName("circleLeft").color = this.circleColorLeft;

        this.levelUp.getChildByName("circleLeft").getChildByName("curLevel").getComponent(cc.Label).string = this.circleNumLeft.toString();
        this.levelUp.getChildByName("circleRight").color = this.circleColorRight;

        this.levelUp.getChildByName("circleRight").getChildByName("nextLevel").getComponent(cc.Label).string = this.circleNumRight.toString();

        this.levelUp.getChildByName("progressBar").getChildByName("bar").color = this.circleColorLeft;
        //this.levelUp.getChildByName("progressBar").color = this.circleColorRight;
        //this.levelUpTotal = 10;
        this.percentBar = 0;
        dataMgr.myLocalMgr.percentBar = 0;
        cc.sys.localStorage.setItem("percentBar", 0);
        this.levelUp.getChildByName("progressBar").getComponent(cc.ProgressBar).progress = this.percentBar;

        // 锤子重置
        this.isHammer = true;
        cc.sys.localStorage.setItem('isHammer', 1);
        var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
        tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame1;
        //this.useHammerRemind.getChildByName("remind").getChildByName("useHammerBtn").getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame3;
        //this.isReviveHammer = false;
        cc.sys.localStorage.setItem('isReviewHammer', 0);

        // 掉落完成才可执行其他操作
        this.blockInputNode2.active = true;
        // 停止掉落 执行 动效
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                this.chunkList[i][j].active = false;
                var moveTime = cc.pDistance(this.chunkList[i][j], this.chunkList[3][2]) / 800;
                var cloneChunk = cc.instantiate(this.chunkPre);
                cloneChunk.setPosition(this.chunkList[i][j].getPosition());
                this.boardNode.addChild(cloneChunk);
                cloneChunk.getComponent("linklinechunk").linklinesetColor_Digit(this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkColor(), this.chunkList[i][j].getComponent("linklinechunk").linklinegetChunkDigit());
                var cloneChunkJS = cloneChunk.getComponent("linklinechunk");
                if (cloneChunkJS.linklinegetChunkDigit() >= 1024 && cloneChunkJS.linklinegetChunkDigit() < 1000000) {
                    cloneChunk.getChildByName('kuang').active = true;
                    cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                    cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                } else if (cloneChunkJS.linklinegetChunkDigit() >= 1000000) {
                    cloneChunk.getChildByName('kuang').active = true;
                    cloneChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                    cloneChunk.getChildByName('kuang').color = cloneChunk.children[0].color;
                } else {
                    cloneChunk.getChildByName('kuang').active = false;
                }

                //console.log(moveTime);
                cloneChunk.runAction(cc.sequence(cc.spawn(cc.moveTo(moveTime, this.chunkList[3][2]), cc.scaleTo(moveTime, 0)), cc.callFunc(function () {
                    cloneChunk.destroy();
                })));
            }
        }
        // 掉落效果
        this.scheduleOnce(function () {
            var _this = this;

            console.log("生成棋盘");
            var dropTime1 = cc.pDistance(this.chunkList[1][1], this.chunkList[0][1]) / 1200;
            for (var _i9 = 0; _i9 < this.ROW; _i9++) {
                var dropTime = (_i9 + 1) * dropTime1;

                var _loop = function _loop(_j) {
                    var curChunk = _this.chunkList[_i9][_j];
                    var curChunkJS = curChunk.getComponent("linklinechunk");
                    var dropChunk = _this.linklinerandomChunk();
                    dropChunk.setScale(0);
                    var dropChunkJS = dropChunk.getComponent("linklinechunk");
                    dropChunk.setPosition(_this.chunkList[_i9][_j].getPosition());
                    _this.boardNode.addChild(dropChunk);
                    dropChunk.runAction(cc.sequence(cc.scaleTo(0.4, 1).easing(cc.easeBackOut()),
                    //cc.scaleTo(0.1,1).easing(cc.easeBackOut()),
                    //cc.delayTime(0.1*i),
                    //cc.moveTo(dropTime, curChunk.getPosition()).easing(cc.easeOut(3.0)),
                    cc.callFunc(function () {
                        dropChunk.destroy();
                    }), cc.callFunc(function () {
                        curChunk.active = true;
                        curChunkJS.linklinesetColor_Digit(dropChunkJS.linklinegetChunkColor(), dropChunkJS.linklinegetChunkDigit());
                        if (curChunkJS.linklinegetChunkDigit() >= 1024 && curChunkJS.linklinegetChunkDigit() < 1000000) {
                            curChunk.getChildByName('kuang').active = true;
                            curChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                            curChunk.getChildByName('kuang').color = curChunk.children[0].color;
                        } else if (curChunkJS.linklinegetChunkDigit() >= 1000000) {
                            curChunk.getChildByName('kuang').active = true;
                            curChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                            curChunk.getChildByName('kuang').color = curChunk.children[0].color;
                        } else {
                            curChunk.getChildByName('kuang').active = false;
                        }
                    })));
                };

                for (var _j = 0; _j < this.COL; _j++) {
                    _loop(_j);
                }
            }
        }, 0.6);
        this.scheduleOnce(function () {
            // 屏蔽 操作 关闭
            this.blockInputNode2.active = false;
            this.linklinesaveBoardData();
            //console.log(this.boardNode2.childrenCount);
        }, 1.2);
        console.log("block input event!!!");
    },

    // 锤子按钮
    linklinehammerBtn: function linklinehammerBtn() {
        this.audioMgr.linklineplayUi_btn();
        if (this.useHammerRemind.active) this.linklinemySlideOut(this.useHammerRemind.getChildByName("remind"));

        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            if (this.isHammer) {
                console.log("hammerBtn!!!");
                this.blockInputNode1.active = true;
                this.isUsingHammer = true;
                this.linklinechunkShake();
            } else {
                this.toUseHammer = true;
                this.toRelive = false;
                this.doubleBtn = false;
                console.log("prop award AD!!!");
                if (!cc.sys.isMobile) {
                    this.isHammer = true;
                    var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
                    tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame1;
                    //this.useHammerRemind.getChildByName("remind").getChildByName("useHammerBtn").getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame3;
                } else if (this.linklineisNetWork() && myADMgr.isRewardVideoAvailable()) {
                    myADMgr.showRewardVideoAD();
                } else {
                    // ...
                    console.log("unbelievable!!!");
                }
            }
        }, 0.2);
    },

    // 放弃复活机会
    linklinegiveUpBtn: function linklinegiveUpBtn() {
        this.audioMgr.linklineplayUi_btn();
        this.linklinemySlideOut(this.node.getChildByName("relive").getChildByName("reliveBtns"));
        this.unschedule(this.linklinecountTime);
        this.unschedule(this.linklinecountTime2, 1);
        this.linklinegameEvaluate();
        this.scheduleOnce(function () {
            this.node.getChildByName("gameover").active = true;
            this.linklinemySlideIn(this.node.getChildByName("gameover").getChildByName("gameoverBtns"));
        }, 0.6);
        if (!noAD && this.gameoverTimes % AD_CONFIG.DIED_TIMES == 0) {
            console.log("死亡广告!!!");
            if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIED_PRO / 100) {
                console.log("full screen AD!!!");
                myADMgr.showFullScreenAD();
            }
        }
    },

    // 关闭升级提示框
    linklinelevelUpSureBtn: function linklinelevelUpSureBtn() {
        if (this.node.getChildByName("levelUpMes").getChildByName('TapToContinue').active == false) return;
        //if(Number(new Date()) - this.levelUp_time < 2000)   return;
        this.audioMgr.linklineplayUi_btn();
        this.node.getChildByName("levelUpMes").runAction(cc.fadeOut(0.3));
        this.node.getChildByName("levelUpMes").getChildByName('TapToContinue').active = false;
        this.scheduleOnce(function () {
            this.node.getChildByName("levelUpMes").active = false;
            this.node.getChildByName("levelUpMes").opacity = 255;
            this.node.getChildByName("levelUpMes").getChildByName('block').opacity = 100;
            var index = this.circleNumLeft % dataMgr.colorMgr.linklinegetCircleColorLength() + 1;
            var str = "star" + index;
            cc.sys.localStorage.setItem('loadingBar_index', index);
            this.loadingBarNum = index;

            this.star.getChildByName(str).getComponent(cc.ParticleSystem).resetSystem();

            if (!noAD) {
                if (this.circleNumLeft == 5) {
                    if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIALOG_PRO / 100) {
                        myADMgr.showFullScreenAD();
                    }
                } else if (this.circleNumLeft > 5 && this.circleNumLeft <= 20) {
                    if ((this.circleNumLeft - 5) % 3 == 0) {
                        if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIALOG_PRO / 100) {
                            myADMgr.showFullScreenAD();
                        }
                    }
                } else if (this.circleNumLeft > 20 && this.circleNumLeft <= 50) {
                    if (this.circleNumLeft % 2 == 0) {
                        if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIALOG_PRO / 100) {
                            myADMgr.showFullScreenAD();
                        }
                    }
                } else if (this.circleNumLeft > 50) {
                    if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIALOG_PRO / 100) {
                        myADMgr.showFullScreenAD();
                    }
                }
            }
        }, 0.3);
    },

    adCallback: function adCallback(type, name) {
        console.log(type, name);
        console.log("game toRelive ad!!!");
        switch (type) {
            case 'success_cache':
                this.onCacheAd(name);
                break;

            case 'suceess_watch_reward':

                if (this.toUseHammer) {
                    console.log('toUseHammer!!!');
                    this.isHammer = true;
                    this.toUseHammer = false;
                    var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
                    tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame1;
                    //this.useHammerRemind.getChildByName("remind").getChildByName("useHammerBtn").getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame3;
                    console.log('获取锤子广告1');
                }

                if (this.toRelive) {
                    console.log('toRelive!!!');
                    this.toRelive = false;
                    this.node.getComponent("linklinegame").linklinesortChunk();
                    this.node.getChildByName("relive").active = false;
                }

                // if(this.useHammerRemind_toUseHammer){
                //     console.log('useHammerRemind_toUseHammer!!!');
                //     this.isHammer = true;
                //     var tempHammer = this.node.getChildByName("bottom").getChildByName("hammer");
                //     tempHammer.getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame1;
                //     this.useHammerRemind.getChildByName("remind").getChildByName("useHammerBtn").getComponent(cc.Sprite).spriteFrame = this.hammerSprFrame3;
                //     console.log('获取锤子广告2')
                // }

                if (this.doubleBtn) {
                    this.doubleNum = 1;
                    cc.sys.localStorage.setItem('doubleNum', 1);
                    cc.find('Canvas/game/bottom/double003').getComponent(cc.Sprite).spriteFrame = this.doubleSprFrame1;
                    this.doubleBtn = false;
                }

                break;
            case 'adViewDidDismissScreen':
                if (this.toRelive == true) {
                    //this.node.getChildByName("relive").active = false;
                    //this.linklinemySlideOut(this.node.getChildByName("relive").getChildByName("reliveBtns"));
                    // this.unschedule(this.linklinecountTime);
                    // this.unschedule(this.linklinecountTime2,1);
                    this.linklinegameEvaluate();
                    this.scheduleOnce(function () {
                        this.node.getChildByName("gameover").active = true;
                        this.linklinemySlideIn(this.node.getChildByName("gameover").getChildByName("gameoverBtns"));
                    }, 0.6);
                    this.toRelive = false;
                }
        }
    },
    onCacheAd: function onCacheAd(name) {
        console.log('on cache');
        console.log(name);
        switch (name) {
            case 'reward':
                console.log("onCached reward!!!");
                break;
            case 'bottombanner':
                console.log("onCached bottombanner!!!");
                break;
            case 'fullscreen':
                console.log("onCached fullscreen!!!");
                break;
            default:
                break;
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


    // 弹窗出现
    linklinemySlideIn: function linklinemySlideIn(node) {
        node.stopAllActions();
        node.parent.getChildByName('block').runAction(cc.fadeIn(0.3));
        node.setPosition(0, 1000);
        node.runAction(cc.moveTo(0.4, cc.v2(0, 0)).easing(cc.easeBackOut(0.8)));
    },
    // 弹窗消失
    linklinemySlideOut: function linklinemySlideOut(node) {
        node.parent.getChildByName('block').runAction(cc.fadeOut(0.3));
        node.runAction(cc.sequence(cc.moveTo(0.4, cc.v2(0, -1000)).easing(cc.easeBackIn(0.2)), cc.callFunc(function () {
            node.setPosition(0, 0);
            node.parent.active = false;
        })));
    },

    //棋子缩放
    linklinechunkActStart: function linklinechunkActStart() {
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                var _curChunk = this.chunkList[i][j];
                _curChunk.setScale(0);
            }
        }
    },
    linklinechunkAct: function linklinechunkAct() {
        console.log('执行动画');
        this.linklinestartTimeCount();
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                var _curChunk2 = this.chunkList[i][j];
                _curChunk2.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBackOut()));
            }
        }
    },
    linklinedropChunkAct: function linklinedropChunkAct() {
        var _this2 = this;

        var chunkNum = 0;
        for (var j = 0; j < this.COL; j++) {
            var _loop2 = function _loop2(i) {
                var curChunk = _this2.chunkList[i][j];
                var curChunkJS = curChunk.getComponent("linklinechunk");
                var showChunk = _this2.chunkList[i - chunkNum][j];
                if (curChunk.active == false) {
                    chunkNum += 1;
                } else if (chunkNum > 0) {
                    var n = 1;
                    if (curChunk.uuid == _this2.dropChunkID) {
                        n = 1.2;
                        _this2.dropChunkID = 0;
                    }
                    curChunk.active = false;
                    var showChunkJs = showChunk.getComponent("linklinechunk");
                    var _dropChunk = _this2.linklinerandomChunk();
                    var _dropChunkJS = _dropChunk.getComponent("linklinechunk");
                    _dropChunkJS.linklinesetColor_Digit(curChunkJS.linklinegetChunkColor(), curChunkJS.linklinegetChunkDigit());
                    if (curChunkJS.linklinegetChunkDigit() >= 1024 && curChunkJS.linklinegetChunkDigit() < 1000000) {
                        _dropChunk.getChildByName('kuang').active = true;
                        _dropChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = _this2.kuang1;
                        _dropChunk.getChildByName('kuang').color = _dropChunk.children[0].color;
                    } else if (curChunkJS.linklinegetChunkDigit() >= 1000000) {
                        _dropChunk.getChildByName('kuang').active = true;
                        _dropChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = _this2.kuang2;
                        _dropChunk.getChildByName('kuang').color = _dropChunk.children[0].color;
                    } else {
                        _dropChunk.getChildByName('kuang').active = false;
                    }
                    _dropChunk.setPosition(curChunk.getPosition());
                    _this2.boardNode.addChild(_dropChunk);
                    _dropChunk.runAction(cc.sequence(cc.spawn(cc.moveBy(0.2, cc.v2(0, -chunkNum * (2 * _this2.chunkRadius + _this2.chunkGapY))).easing(cc.easeBackOut()), cc.scaleTo(0.2, n)), cc.callFunc(function () {
                        _dropChunk.destroy();
                    }), cc.callFunc(function () {
                        showChunk.active = true;
                        showChunkJs.linklinesetColor_Digit(curChunkJS.linklinegetChunkColor(), curChunkJS.linklinegetChunkDigit());
                        if (showChunkJs.linklinegetChunkDigit() >= 1024 && showChunkJs.linklinegetChunkDigit() < 1000000) {
                            showChunk.getChildByName('kuang').active = true;
                            showChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                            showChunk.getChildByName('kuang').color = showChunk.children[0].color;
                        } else if (showChunkJs.linklinegetChunkDigit() >= 1000000) {
                            showChunk.getChildByName('kuang').active = true;
                            showChunk.getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                            showChunk.getChildByName('kuang').color = showChunk.children[0].color;
                        } else {
                            showChunk.getChildByName('kuang').active = false;
                        }
                    }, _this2), cc.scaleTo(0.2, 1.0)));
                }
                if (i == 5 && chunkNum != 0) {
                    var _loop3 = function _loop3(_n) {
                        var showChunk = _this2.chunkList[6 - chunkNum + _n][j];
                        var showChunkJs = showChunk.getComponent("linklinechunk");
                        var dropChunk = _this2.linklinerandomChunk();
                        _this2.boardNode.addChild(dropChunk);
                        var dropChunkJS = dropChunk.getComponent("linklinechunk");
                        var x = _this2.chunkList[i][j].getPositionX();
                        var y = _this2.chunkList[5][j].getPositionY() + (_this2.chunkGapY + 2 * _this2.chunkRadius) * (_n + 1);
                        dropChunk.setPosition(cc.v2(x, y));
                        console.log(dropChunk.getPosition() + _this2.chunkList[5][j].getPosition());
                        dropChunk.runAction(cc.sequence(cc.moveBy(0.2, cc.v2(0, -chunkNum * (2 * _this2.chunkRadius + _this2.chunkGapY))).easing(cc.easeBackOut()), cc.callFunc(function () {
                            dropChunk.destroy();
                        }), cc.callFunc(function () {
                            showChunk.active = true;
                            showChunkJs.linklinesetColor_Digit(dropChunkJS.linklinegetChunkColor(), dropChunkJS.linklinegetChunkDigit());
                        })));
                    };

                    for (var _n = 0; _n < chunkNum; _n++) {
                        _loop3(_n);
                    }
                    chunkNum = 0;
                }
            };

            for (var i = 0; i < this.ROW; i++) {
                _loop2(i);
            }
        }
    },
    linklinediscount: function linklinediscount(chunk) {
        for (var i = 0; i < this.ROW; i++) {
            for (var j = 0; j < this.COL; j++) {
                if (chunk.uuid == this.chunkList[i][j].uuid) {
                    this.iBk = i;
                    this.jBk = j;
                    cc.log(this.jBk);
                    break;
                }
            }
        }
    },
    linklinecloseDialouge: function linklinecloseDialouge() {
        if (Number(new Date()) - this.dialouge_Time < 2000) return;
        this.audioMgr.linklineplayUi_btn();
        var node = this.node.getChildByName('dialouge');
        node.getChildByName('block').runAction(cc.sequence(cc.fadeOut(0.3), cc.callFunc(function () {
            node.getChildByName('block').active = false;
        })));
        if (node.getChildByName('dialouge1').active) {
            node.getChildByName('dialouge1').runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeBackIn()), cc.callFunc(function () {
                node.getChildByName('dialouge1').active = false;
            })));
            if (!isFiveStar && this.hightestScore != 1024) {
                this.scheduleOnce(function () {
                    this.fiveStarNode.active = true;
                    this.linklinemySlideIn(this.fiveStarNode.getChildByName("fiveStar"));
                }, 0.3);
            } else {
                myGameCenterMgr.fiveStar();
            }
        }
        if (node.getChildByName('dialouge2').active) {
            node.getChildByName('dialouge2').runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeBackIn()), cc.callFunc(function () {
                node.getChildByName('dialouge2').active = false;
            })));
        }
    },
    linklinedoubleButton: function linklinedoubleButton() {
        this.audioMgr.linklineplayUi_btn();
        if (this.useHammerRemind.active) this.linklinemySlideOut(this.useHammerRemind.getChildByName("remind"));

        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            if (this.doubleNum) {
                this.doubleNum = 0;
                cc.sys.localStorage.setItem('doubleNum', 0);
                this.blockInputNode1.active = true;
                this.isUsingDouble = true;
                this.linklinechunkShake();
            } else {
                this.doubleBtn = true;
                this.toUseHammer = false;
                this.toRelive = false;
                console.log("prop award AD!!!");
                if (!cc.sys.isMobile) {
                    this.doubleNum = 1;
                    cc.sys.localStorage.setItem('doubleNum', 1);
                    cc.find('Canvas/game/bottom/double003').getComponent(cc.Sprite).spriteFrame = this.doubleSprFrame1;
                } else if (this.linklineisNetWork() && myADMgr.isRewardVideoAvailable()) {
                    myADMgr.showRewardVideoAD();
                }
            }
        }, 0.2);
    },
    linklinedouble: function linklinedouble(point) {
        for (var _i10 = 0; _i10 < this.ROW; _i10++) {
            for (var _j2 = 0; _j2 < this.COL; _j2++) {
                if (this.linklinechunk_fingerCollier(this.chunkList[_i10][_j2], point)) {
                    var num = this.chunkList[_i10][_j2].getComponent('linklinechunk').linklinegetChunkDigit();
                    if (num > 8) return;
                    console.log("double!!!");
                    this.audioMgr.linklineplayDouble();
                    num = 2 * num;
                    this.chunkList[_i10][_j2].getComponent('linklinechunk').linklinesetColor_Digit(dataMgr.colorMgr.linklinegetColorById(num), num);
                    if (this.chunkList[_i10][_j2].getComponent('linklinechunk').linklinegetChunkDigit() >= 1024 && this.chunkList[_i10][_j2].getComponent('linklinechunk').linklinegetChunkDigit() < 1000000) {
                        this.chunkList[_i10][_j2].getChildByName('kuang').active = true;
                        this.chunkList[_i10][_j2].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang1;
                        this.chunkList[_i10][_j2].getChildByName('kuang').color = this.chunkList[_i10][_j2].children[0].color;
                    } else if (this.chunkList[_i10][_j2].getComponent('linklinechunk').linklinegetChunkDigit() >= 1000000) {
                        this.chunkList[_i10][_j2].getChildByName('kuang').active = true;
                        this.chunkList[_i10][_j2].getChildByName('kuang').getComponent(cc.Sprite).spriteFrame = this.kuang2;
                        this.chunkList[_i10][_j2].getChildByName('kuang').color = this.chunkList[_i10][_j2].children[0].color;
                    } else {
                        this.chunkList[_i10][_j2].getChildByName('kuang').active = false;
                    }

                    var chunAni = cc.instantiate(this.chunkAni);
                    chunAni.getChildByName("color").color = this.chunkList[_i10][_j2].getComponent("linklinechunk").linklinegetChunkColor();
                    chunAni.setPosition(this.chunkList[_i10][_j2].getPosition());
                    chunAni.zIndex = -1;
                    this.boardNode.addChild(chunAni);
                    chunAni.runAction(cc.sequence(cc.spawn(cc.scaleTo(0.3, 1.8), cc.fadeOut(0.3)), cc.callFunc(function () {
                        chunAni.destroy();
                    })));
                    this.isUsingDouble = false;
                    this.blockInputNode1.active = false;
                    this.boardNode2.active = false;
                    this.unschedule(this.linklineboard2Ani);
                    this.boardNode2.setPosition(this.blockBlackX, this.blockBlackY);
                    this.boardNode2.removeAllChildren();
                    for (var _i10 = 0; _i10 < this.ROW; _i10++) {
                        for (var _j2 = 0; _j2 < this.COL; _j2++) {
                            //this.board2_list[i][j].destroy();
                            this.chunkList[_i10][_j2].active = true;
                        }
                    }
                    this.board2_list.length = 0;
                    this.hammerTips.getChildByName("double").active = false;
                    this.hammerTips.getChildByName("double").stopAllActions();
                    this.node.getChildByName("bottom").active = true;
                    cc.find('Canvas/game/bottom/double003').getComponent(cc.Sprite).spriteFrame = this.doubleSprFrame2;

                    this.scheduleOnce(function () {
                        // 每次连完检测是否游戏结束
                        if (this.linklineisGameover()) {
                            // 锤子是否可用
                            if (this.isHammer || this.doubleNum) {
                                this.audioMgr.linklineplayDialog();
                                this.useHammerRemind.active = true;
                                this.linklinemySlideIn(this.useHammerRemind.getChildByName("remind"));

                                if (this.isHammer && this.doubleNum) {
                                    this.hammer_btn.active = true;
                                    this.hammer_btn.setPositionX(100);
                                    this.double_btn.active = true;
                                    this.double_btn.setPositionX(-100);
                                } else if (this.isHammer) {
                                    this.hammer_btn.active = true;
                                    this.hammer_btn.setPositionX(0);
                                    this.double_btn.active = false;
                                } else {
                                    this.double_btn.active = true;
                                    this.double_btn.setPositionX(0);
                                    this.hammer_btn.active = false;
                                }
                            } else {
                                //  每次死亡上传 游戏时间 和 最高分
                                console.log("gameover!!!");
                                this.gameoverTimes++;
                                cc.sys.localStorage.setItem("gameoverTimes", this.gameoverTimes);
                                this.blockInputNode2.active = true;
                                this.linklinegameoverAni();
                                this.scheduleOnce(function () {
                                    this.blockInputNode2.active = false;
                                }, 2.0);
                                this.scheduleOnce(function () {

                                    // 满足条件 则 弹出复活界面
                                    if (this.canRelive) {
                                        console.log('复活');
                                        this.audioMgr.linklineplayRevive();
                                        this.node.getChildByName("relive").active = true;
                                        this.linklinemySlideIn(this.node.getChildByName("relive").getChildByName("reliveBtns"));
                                        // 倒计时5s
                                        this.circleYellow.getComponent(cc.ProgressBar).progress = 1;
                                        this.schedule(this.linklinecountTime, 0.01);
                                        this.canRelive = false;
                                    } else {
                                        // 死亡
                                        if (!noAD && this.gameoverTimes % AD_CONFIG.DIED_TIMES == 0) {
                                            console.log("死亡广告!!!");
                                            if (myADMgr.isFullScreenAvailable() && Math.random() < AD_CONFIG.DIED_PRO / 100) {
                                                console.log("full screen AD!!!");
                                                myADMgr.showFullScreenAD();
                                            }
                                        }
                                        this.linklinegameEvaluate();
                                        this.node.getChildByName("gameover").active = true;
                                        this.linklinemySlideIn(this.node.getChildByName("gameover").getChildByName("gameoverBtns"));
                                    }
                                }, 2.0);
                            }
                        } else {
                            // 保存棋盘数据
                            console.log("continue!");
                            this.scheduleOnce(this.linklinesaveBoardData, 0.4);
                            //console.log(this.boardNode.childrenCount);
                            //console.log(this.boardNode2.childrenCount);
                        }
                    }, 0.3);

                    break;
                }
            }
        }
    },
    linklineplAct: function linklineplAct() {
        var node1 = cc.instantiate(this.closePlPre);
        var node2 = cc.instantiate(this.closePlPre);
        var node3 = cc.instantiate(this.closePlPre);
        var node4 = cc.instantiate(this.closePlPre);

        this.node.addChild(node1);
        this.node.addChild(node2);
        this.node.addChild(node3);
        this.node.addChild(node4);

        node1.getComponent(cc.ParticleSystem).file = cc.url.raw('resources/linklineplist/linklineprogress/linklinecloseParticle' + this.closePl_num + '.plist');
        node2.getComponent(cc.ParticleSystem).file = cc.url.raw('resources/linklineplist/linklineprogress/linklinecloseParticle' + this.closePl_num + '.plist');
        node3.getComponent(cc.ParticleSystem).file = cc.url.raw('resources/linklineplist/linklineprogress/linklinecloseParticle' + this.closePl_num + '.plist');
        node4.getComponent(cc.ParticleSystem).file = cc.url.raw('resources/linklineplist/linklineprogress/linklinecloseParticle' + this.closePl_num + '.plist');
        console.log('播放粒子特效');
        node1.setPosition(cc.v2(-281, -145));
        node1.active = true;
        node1.getComponent(cc.ParticleSystem).resetSystem();
        var bizier1 = [cc.v2(-281, 93), cc.v2(-274.5, 160.5), cc.v2(-208, 168)];
        node1.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(-281, 93)), cc.bezierTo(0.2, bizier1), cc.moveTo(0.2, cc.v2(0, 168)), cc.callFunc(function () {
            node1.getComponent(cc.ParticleSystem).stopSystem();
        }), cc.delayTime(1.5), cc.callFunc(function () {
            node1.destroy();
        })));

        node2.setPosition(cc.v2(281, -145));
        node2.active = true;
        node2.getComponent(cc.ParticleSystem).resetSystem();
        var bizier2 = [cc.v2(281, 93), cc.v2(274.5, 160.5), cc.v2(208, 168)];
        node2.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(281, 93)), cc.bezierTo(0.2, bizier2), cc.moveTo(0.2, cc.v2(0, 168)), cc.callFunc(function () {
            node2.getComponent(cc.ParticleSystem).stopSystem();
        }), cc.delayTime(1.5), cc.callFunc(function () {
            node2.destroy();
        })));

        node3.setPosition(cc.v2(-281, -145));
        node3.active = true;
        node3.getComponent(cc.ParticleSystem).resetSystem();
        var bizier3 = [cc.v2(-281, -383), cc.v2(-274.5, -475.5), cc.v2(-208, -458)];
        node3.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(-281, -383)), cc.bezierTo(0.2, bizier3), cc.moveTo(0.2, cc.v2(0, -458)), cc.callFunc(function () {
            node3.getComponent(cc.ParticleSystem).stopSystem();
        }), cc.delayTime(1.5), cc.callFunc(function () {
            node3.destroy();
        })));

        node4.setPosition(cc.v2(281, -145));
        node4.active = true;
        node4.getComponent(cc.ParticleSystem).resetSystem();
        var bizier4 = [cc.v2(281, -383), cc.v2(274.5, -475.5), cc.v2(208, -458)];
        node4.runAction(cc.sequence(cc.moveTo(0.2, cc.v2(281, -383)), cc.bezierTo(0.2, bizier4), cc.moveTo(0.2, cc.v2(0, -458)), cc.callFunc(function () {
            node4.getComponent(cc.ParticleSystem).stopSystem();
        }), cc.delayTime(1.5), cc.callFunc(function () {
            node4.destroy();
        })));
    },
    linklinebarAct: function linklinebarAct(num) {
        this.loadingBar.setPositionX(-169.5 + this.percentBar * 339);
        this.loadingBar.children[this.loadingBarNum - 1].getComponent(cc.ParticleSystem).resetSystem();
        this.loadingBar.runAction(cc.sequence(cc.moveBy(num * 0.025, cc.v2(num * (1 / this.levelUpTotal) * 339 + 40, 0)), cc.callFunc(function () {
            this.loadingBar.children[this.loadingBarNum - 1].getComponent(cc.ParticleSystem).stopSystem();
        }, this)));
    }
});

cc._RF.pop();