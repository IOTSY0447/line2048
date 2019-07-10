cc.Class({
    extends: cc.Component,

    properties: {
        
        chunkColor:cc.Color(255, 255, 255), // 块的颜色

        chunkDigit:2, // 块的数字

        isAni:false, // 是否执行过触碰动效

        colorNode:cc.Node,
        digitNode:cc.Node,
    },
    
    linklinesetChunkColor:function(color){
        this.chunkColor = color;
    },

    linklinegetChunkColor:function(){
        return this.chunkColor;
    },

    linklinesetChunkDigit:function(digit){
        this.chunkDigit = digit;
    },

    linklinegetChunkDigit:function(){
        return this.chunkDigit;
    },

    // 设置颜色和数值
    linklinesetColor_Digit:function(color, digit){
        this.chunkColor = color;
        this.chunkDigit = digit;

        this.colorNode.color = color; // new cc.Color 对象赋值

        if(digit <= 512){
            this.digitNode.getComponent(cc.Label).string = digit.toString();
        }
        else if(digit > 512 && digit <= 32768){
            this.digitNode.getComponent(cc.Label).string = Math.floor(digit/1000) + "."; // K
            //console.log(this.node.getChildByName("digit").getComponent(cc.Label).string);
        }
        else if(digit == 65536){
            this.digitNode.getComponent(cc.Label).string = 64 + ".";
        }
        else if(digit == 131072){
            this.digitNode.getComponent(cc.Label).string = 128 + ".";
        }
        else if(digit == 262144){
            this.digitNode.getComponent(cc.Label).string = 256 + ".";
        }
        else if(digit == 524288){
            this.digitNode.getComponent(cc.Label).string = 512 + ".";
        }
        else if(digit >= 1048576){
            this.digitNode.getComponent(cc.Label).string = Math.floor(digit/1000000) + "/"; // M
        }
    },
    
    onLoad:function(){

    },

    
});
