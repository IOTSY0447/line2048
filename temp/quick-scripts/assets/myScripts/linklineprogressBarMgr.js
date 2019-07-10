(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/myScripts/linklineprogressBarMgr.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '6a1f4zjMjxGn65tYICWKn53', 'linklineprogressBarMgr', __filename);
// myScripts/linklineprogressBarMgr.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        progress1: cc.Node,
        progress2: cc.Node,
        numBk: 0,
        num: 0
    },
    start: function start() {
        this.js = cc.find('Canvas/game').getComponent('linklinegame');
        this.audioMgr = cc.find("Canvas").getComponent("linklineaudioMgr");
    },
    linklinesetProgressBarColor: function linklinesetProgressBarColor(color) {
        //return;
        for (var i = 0; i < 6; i++) {
            this.progress1.children[i].color = color;
            this.progress2.children[i].color = color;
        }
        cc.find('Canvas/colorMask').color = color;
    },
    linklineprogressAct1: function linklineprogressAct1() {
        if (this.num == 0 || this.num == 1) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 0) this.unschedule(this.linklineprogressAct1);
        } else if (this.num == 2) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 0.1) {
                this.unschedule(this.linklineprogressAct1);
                return;
            }
        } else if (this.num == 3) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 0.3) {
                this.unschedule(this.linklineprogressAct1);
                return;
            }
        } else if (this.num == 4) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 0.6) {
                this.unschedule(this.linklineprogressAct1);
                return;
            }
        } else if (this.num == 5) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 1) {
                this.unschedule(this.linklineprogressAct1);
                return;
            }
        } else if (this.num > 5) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 1) {
                this.unschedule(this.linklineprogressAct1);
                this.schedule(this.linklineprogressAct2, 0.01);
                return;
            }
        }
        this.progress1.children[0].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress1.children[1].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress2.children[0].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress2.children[1].getComponent(cc.ProgressBar).progress += 0.05;
    },
    linklineprogressAct1_1: function linklineprogressAct1_1() {
        if (this.num == 0 || this.num == 1) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress <= 0) this.unschedule(this.linklineprogressAct1_1);
        } else if (this.num == 2) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress <= 0.1) {
                this.unschedule(this.linklineprogressAct1_1);
                return;
            }
        } else if (this.num == 3) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress <= 0.3) {
                this.unschedule(this.linklineprogressAct1_1);
                return;
            }
        } else if (this.num == 4) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress <= 0.6) {
                this.unschedule(this.linklineprogressAct1_1);
                return;
            }
        } else if (this.num == 5) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress <= 1) {
                this.unschedule(this.linklineprogressAct1_1);
                return;
            }
        }
        this.progress1.children[0].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress1.children[1].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress2.children[0].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress2.children[1].getComponent(cc.ProgressBar).progress -= 0.05;
    },
    linklineprogressAct2: function linklineprogressAct2() {
        if (this.progress1.children[2].getComponent(cc.ProgressBar).progress < 0.25) {
            this.progress1.children[2].getComponent(cc.ProgressBar).progress = 0.25;
            this.progress2.children[2].getComponent(cc.ProgressBar).progress = 0.25;
            this.progress1.children[3].getComponent(cc.ProgressBar).progress = 0.75;
            this.progress2.children[3].getComponent(cc.ProgressBar).progress = 0.75;
        }
        if (this.num == 6) {
            if (this.progress1.children[2].getComponent(cc.ProgressBar).progress >= 0.5) this.unschedule(this.linklineprogressAct2);
        } else {
            if (this.progress1.children[2].getComponent(cc.ProgressBar).progress >= 0.45) {
                this.schedule(this.linklineprogressAct3, 0.01);
                this.unschedule(this.linklineprogressAct2);
            }
        }
        this.progress1.children[2].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress2.children[2].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress1.children[3].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress2.children[3].getComponent(cc.ProgressBar).progress += 0.05;
    },
    linklineprogressAct2_1: function linklineprogressAct2_1() {
        if (this.progress1.children[2].getComponent(cc.ProgressBar).progress > 0.5) {
            this.progress1.children[2].getComponent(cc.ProgressBar).progress = 0.5;
            this.progress2.children[2].getComponent(cc.ProgressBar).progress = 0.5;
            this.progress1.children[3].getComponent(cc.ProgressBar).progress = 1;
            this.progress2.children[3].getComponent(cc.ProgressBar).progress = 1;
        }
        if (this.num < 6) {
            if (this.progress1.children[2].getComponent(cc.ProgressBar).progress <= 0.25) {
                this.unschedule(this.linklineprogressAct2_1);
                this.schedule(this.linklineprogressAct1_1, 0.01);
            }
        } else if (this.num == 6) {
            if (this.progress1.children[2].getComponent(cc.ProgressBar).progress <= 0.5) {
                this.unschedule(this.linklineprogressAct2_1);
            }
        }
        this.progress1.children[2].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress2.children[2].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress1.children[3].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress2.children[3].getComponent(cc.ProgressBar).progress -= 0.05;
    },
    linklineprogressAct3: function linklineprogressAct3() {
        if (this.progress1.children[4].getComponent(cc.ProgressBar).progress < 0) {
            this.progress1.children[4].getComponent(cc.ProgressBar).progress = 0;
            this.progress1.children[5].getComponent(cc.ProgressBar).progress = 0;
            this.progress2.children[4].getComponent(cc.ProgressBar).progress = 0;
            this.progress2.children[5].getComponent(cc.ProgressBar).progress = 0;
        }
        if (this.num == 7) {
            if (this.progress1.children[4].getComponent(cc.ProgressBar).progress >= 6 / 13) {
                this.unschedule(this.linklineprogressAct3);
                return;
            }
        }
        if (this.num >= 8) {
            if (this.progress1.children[4].getComponent(cc.ProgressBar).progress >= 1) {
                this.unschedule(this.linklineprogressAct3);
            }
        }
        this.progress1.children[4].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress1.children[5].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress2.children[4].getComponent(cc.ProgressBar).progress += 0.05;
        this.progress2.children[5].getComponent(cc.ProgressBar).progress += 0.05;
    },
    linklineprogressAct3_1: function linklineprogressAct3_1() {
        if (this.num < 7) {
            if (this.progress1.children[4].getComponent(cc.ProgressBar).progress <= 0) {
                this.unschedule(this.linklineprogressAct3_1);
                this.schedule(this.linklineprogressAct2_1, 0.01);
            }
        } else if (this.num == 7) {
            if (this.progress1.children[4].getComponent(cc.ProgressBar).progress <= 6 / 13) {
                this.unschedule(this.linklineprogressAct3_1);
            }
        } else if (this.num >= 8) {
            this.unschedule(this.linklineprogressAct3_1);
            return;
        }
        this.progress1.children[4].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress1.children[5].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress2.children[4].getComponent(cc.ProgressBar).progress -= 0.05;
        this.progress2.children[5].getComponent(cc.ProgressBar).progress -= 0.05;
    },
    linklinesetProgressBar: function linklinesetProgressBar(num) {

        this.num = num;
        this.unscheduleAllCallbacks();

        if (num == 0 || num == 1) {
            this.schedule(this.linklineprogressAct3_1, 0.01);
        } else if (num == 2) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 0.1) {
                this.schedule(this.linklineprogressAct3_1, 0.01);
            } else {
                this.schedule(this.linklineprogressAct1, 0.01);
            }
        } else if (num == 3) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 0.3) {
                this.schedule(this.linklineprogressAct3_1, 0.01);
            } else {
                this.schedule(this.linklineprogressAct1, 0.01);
            }
        } else if (num == 4) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 0.6) {
                this.schedule(this.linklineprogressAct3_1, 0.01);
            } else {
                this.schedule(this.linklineprogressAct1, 0.01);
            }
        } else if (num == 5) {
            if (this.progress1.children[0].getComponent(cc.ProgressBar).progress >= 1) {
                this.schedule(this.linklineprogressAct3_1, 0.01);
            } else {
                this.schedule(this.linklineprogressAct1, 0.01);
            }
        } else if (num == 6) {
            if (this.progress1.children[2].getComponent(cc.ProgressBar).progress >= 0.5) {
                this.schedule(this.linklineprogressAct3_1, 0.01);
            } else {
                this.schedule(this.linklineprogressAct1, 0.01);
            }
        } else if (num == 7) {
            if (this.progress1.children[4].getComponent(cc.ProgressBar).progress >= 6 / 13) {
                this.schedule(this.linklineprogressAct3_1, 0.01);
            } else {
                this.schedule(this.linklineprogressAct1, 0.01);
            }
        } else {
            if (num == 8 && this.numBk < num) this.audioMgr.linklineplayClose2();
            this.schedule(this.linklineprogressAct1, 0.01);
        }
        if (this.js.doubleOnce && num == 30) {
            cc.find('Canvas/colorMask').runAction(cc.fadeIn(0.2));
        } else {
            cc.find('Canvas/colorMask').stopAllActions();
            cc.find('Canvas/colorMask').opacity = 0;
        }
        this.numBk = num;
    }
    // update (dt) {},

});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=linklineprogressBarMgr.js.map
        