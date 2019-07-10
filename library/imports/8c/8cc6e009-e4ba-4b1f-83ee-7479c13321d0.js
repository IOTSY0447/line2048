"use strict";
cc._RF.push(module, '8cc6eAJ5LpLH4PudHnBMyHQ', 'linklineassist');
// myScripts/linklineassist.js

"use strict";

var dataMgr = require("linklinedataMgr");
cc.Class({
    extends: cc.Component,

    properties: {
        guidance: sp.Skeleton,
        gameMenu: cc.Node,
        gameNode: cc.Node,
        page1: cc.Node,
        page2: cc.Node,
        page3: cc.Node,
        page4: cc.Node,
        word: cc.Sprite,
        word1: cc.SpriteFrame,
        word2: cc.SpriteFrame,
        word3: cc.SpriteFrame,
        word4: cc.SpriteFrame
    },

    onLoad: function onLoad() {
        this.audioMgr = cc.find("Canvas").getComponent("linklineaudioMgr");
    },
    linklineloadPage: function linklineloadPage() {
        this.pages = 1;
        this.page1.children[0].active = true;
        this.page2.children[0].active = false;
        this.page3.children[0].active = false;
        this.page4.children[0].active = false;
        this.guidance.setAnimation(1, 'guidance1', true);
    },
    linklinelastPage: function linklinelastPage() {
        this.audioMgr.linklineplayUi_btn();
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            if (this.pages == 1) {
                this.node.runAction(cc.moveBy(0.3, cc.v2(852, 0)));
                this.gameMenu.runAction(cc.moveBy(0.3, cc.v2(852, 0)));
            } else if (this.pages == 2) {
                this.pages = 1;
                this.page1.children[0].active = true;
                this.page2.children[0].active = false;
                this.guidance.setAnimation(1, 'guidance1', true);
                this.word.spriteFrame = this.word1;
            } else if (this.pages == 3) {
                this.pages = 2;
                this.page2.children[0].active = true;
                this.page3.children[0].active = false;
                this.guidance.setAnimation(1, 'guidance2', true);
                this.word.spriteFrame = this.word2;
            } else if (this.pages == 4) {
                this.pages = 3;
                this.page3.children[0].active = true;
                this.page4.children[0].active = false;
                this.guidance.setAnimation(1, 'guidance3', true);
                this.word.spriteFrame = this.word3;
            }
        }, 0.2);
    },
    linklinenextPage: function linklinenextPage() {
        this.audioMgr.linklineplayUi_btn();
        cc.find('Canvas/block').active = true;
        this.scheduleOnce(function () {
            cc.find('Canvas/block').active = false;
            if (this.pages == 1) {
                this.pages = 2;
                this.page1.children[0].active = false;
                this.page2.children[0].active = true;
                this.guidance.setAnimation(1, 'guidance2', true);
                this.word.spriteFrame = this.word2;
            } else if (this.pages == 2) {
                this.pages = 3;
                this.page2.children[0].active = false;
                this.page3.children[0].active = true;
                this.guidance.setAnimation(1, 'guidance3', true);
                this.word.spriteFrame = this.word3;
            } else if (this.pages == 3) {
                this.pages = 4;
                this.page3.children[0].active = false;
                this.page4.children[0].active = true;
                this.guidance.setAnimation(1, 'guidance4', true);
                this.word.spriteFrame = this.word4;
            } else if (this.pages == 4) {
                this.node.runAction(cc.moveBy(0.3, cc.v2(-852, 0)));
                this.gameNode.runAction(cc.moveBy(0.3, cc.v2(-852, 0)));
                this.scheduleOnce(function () {
                    var js = this.gameNode.getComponent("linklinegame");
                    js.linklinechunkAct();
                }, 0.3);
            }
        }, 0.2);
    }
}
// update (dt) {},
);

cc._RF.pop();