(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/myScripts/linklinechunk.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2633at5t4ZGlZRte04cWWj/', 'linklinechunk', __filename);
// myScripts/linklinechunk.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {

        chunkColor: cc.Color(255, 255, 255), // 块的颜色

        chunkDigit: 2, // 块的数字

        isAni: false, // 是否执行过触碰动效

        colorNode: cc.Node,
        digitNode: cc.Node
    },

    linklinesetChunkColor: function linklinesetChunkColor(color) {
        this.chunkColor = color;
    },

    linklinegetChunkColor: function linklinegetChunkColor() {
        return this.chunkColor;
    },

    linklinesetChunkDigit: function linklinesetChunkDigit(digit) {
        this.chunkDigit = digit;
    },

    linklinegetChunkDigit: function linklinegetChunkDigit() {
        return this.chunkDigit;
    },

    // 设置颜色和数值
    linklinesetColor_Digit: function linklinesetColor_Digit(color, digit) {
        this.chunkColor = color;
        this.chunkDigit = digit;

        this.colorNode.color = color; // new cc.Color 对象赋值

        if (digit <= 512) {
            this.digitNode.getComponent(cc.Label).string = digit.toString();
        } else if (digit > 512 && digit <= 32768) {
            this.digitNode.getComponent(cc.Label).string = Math.floor(digit / 1000) + "."; // K
            //console.log(this.node.getChildByName("digit").getComponent(cc.Label).string);
        } else if (digit == 65536) {
            this.digitNode.getComponent(cc.Label).string = 64 + ".";
        } else if (digit == 131072) {
            this.digitNode.getComponent(cc.Label).string = 128 + ".";
        } else if (digit == 262144) {
            this.digitNode.getComponent(cc.Label).string = 256 + ".";
        } else if (digit == 524288) {
            this.digitNode.getComponent(cc.Label).string = 512 + ".";
        } else if (digit >= 1048576) {
            this.digitNode.getComponent(cc.Label).string = Math.floor(digit / 1000000) + "/"; // M
        }
    },

    onLoad: function onLoad() {}

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
        //# sourceMappingURL=linklinechunk.js.map
        