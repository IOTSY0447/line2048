/*
 * 数据管理
*/
let DataMgr = {};
// chunk颜色、数值管理
let myRGB = 
[
    {
        id:2,
        color:new cc.color(47,174,248),
        //color:new cc.Color(255, 36, 102),
    },
    {
        id:4,
        color:new cc.color(140,54,255),
        //color:new cc.Color(34, 214, 169),
    },
    {
        id:8,
        color:new cc.color(255,31,107),
        //color:new cc.Color(185, 89, 226),
    },
    {
        id:16,
        color:new cc.color(228,190,3),
        //color:new cc.Color(242, 208, 58),
    },
    {
        id:32,
        color:new cc.color(0,165,176),
        //color:new cc.Color(89, 153, 250),
    },
    {
        id:64,
        color:new cc.color(101,142,254),
        //color:new cc.Color(255, 98, 46),
    },
    {
        id:128,
        color:new cc.color(186,109,228),
        //color:new cc.Color(46, 102, 255),
    },
    {
        id:256,
        color:new cc.color(255,59,80),
        //color:new cc.Color(207, 31, 31),
    },
    {
        id:512,
        color:new cc.color(163,184,17),
        //color:new cc.Color(25, 179, 79),
    },

    // ...

    {
        id:1024,
        color:new cc.color(102,100,254),
        //color:new cc.Color(0, 142, 189),
    },
    {
        id:2048,
        color:new cc.color(255,101,254),
        //color:new cc.Color(139, 227, 32),
    },
    {
        id:4096,
        color:new cc.color(225,50,24),
        //color:new cc.Color(106, 87, 255),
    },
    {
        id:8192,
        color:new cc.color(80,186,21),
        //color:new cc.Color(235, 33, 181),
    },
    {
        id:16384,
        color:new cc.color(67,66,248),
        //color:new cc.Color(10, 115, 113),
    },
    {
        id:32768,
        color:new cc.color(255,66,237),
        //color:new cc.Color(255, 160, 51),
    },
    {
        id:65536,
        color:new cc.color(255,96,2),
        //color:new cc.Color(27, 221, 218),
    },
    {
        id:131072,
        color:new cc.color(2,147,20),
        //color:new cc.Color(202, 150, 235),
    },
    {
        id:262144,
        color:new cc.color(98,37,255),
        //color:new cc.Color(156, 48, 75),
    },
    {
        id:524288,
        color:new cc.color(239,95,146),
        //color:new cc.Color(137, 128, 209),
    },

    // ...

    {
        id:1048576,
        color:new cc.color(249,142,3),
        //color:new cc.Color(176, 137, 137),
    },
    {
        id:2097152,
        color:new cc.color(0,164,104),
    },
];

let circleColor = [
    {
        index:1,
        color:new cc.Color(209, 97, 68),
    },
    {
        index:2,
        color:new cc.Color(219, 125, 41),
    },
    {
        index:3,
        color:new cc.Color(244, 190, 80),
    },
    {
        index:4,
        color:new cc.Color(210, 230, 22),
    },
    {
        index:5,
        color:new cc.Color(111, 215, 45),
    },
    {
        index:6,
        color:new cc.Color(42, 191, 123),
    },
    {
        index:7,
        color:new cc.Color(31, 181, 204),
    },
    {
        index:8,
        color:new cc.Color(95, 180, 239),
    },
    {
        index:9,
        color:new cc.Color(113, 144, 211),
    },
    {
        index:10,
        color:new cc.Color(136, 124, 212),
    },
    {
        index:11,
        color:new cc.Color(202, 124, 212),
    },
    {
        index:12,
        color:new cc.Color(227, 108, 137),
    },
];

DataMgr.colorMgr = {
    linklinegetColorById:function(id){
        for(var i = 0; i < myRGB.length; i++){
            if(myRGB[i].id === id)
                return myRGB[i].color;
        }
        return null;
    },
    linklinegetColorByIndex:function(index){
        if(index < 0 || index >= myRGB.length)
            return null;
        return myRGB[index].color;
    },
    linklinegetColorLength:function(){
        return myRGB.length;
    },
    

    linklinegetCircleColorByIndex:function(index){
        for(var i = 0; i < circleColor.length; i++){
            if(circleColor[i].index == index)
                return circleColor[i].color;
        }
    },
    linklinegetCircleColorLength:function(){
        return circleColor.length;
    },
};
// 本地存储管理
//cc.sys.localStorage.clear(); // 清理本地数据
if(!cc.sys.localStorage.getItem("isFirstLoad")){
    cc.sys.localStorage.setItem("isFirstLoad", 1); // 1相当于true, 自动转换成string类型
}

window.num_1k = Number(cc.sys.localStorage.getItem('num_1k'));
window.best_kNum = Number(cc.sys.localStorage.getItem('best_kNum'));
window.doubleReward = Number(cc.sys.localStorage.getItem("doubleReward"));
window.doubleTime = Number(cc.sys.localStorage.getItem("doubleTime"));
window.nightMode = Number(cc.sys.localStorage.getItem('nightMode'));
window.buttonDown = false;

// 当前分数 和 历史最高分
if(!cc.sys.localStorage.getItem("presentScore")){
    cc.sys.localStorage.setItem("presentScore", 0);
}
if(!cc.sys.localStorage.getItem("bestScore")){
    cc.sys.localStorage.setItem("bestScore", 0);
}
// 升级进度条
if(!cc.sys.localStorage.getItem("circleNum1")){
    cc.sys.localStorage.setItem("circleNum1", 1);
}
if(!cc.sys.localStorage.getItem("circleNum2")){
    cc.sys.localStorage.setItem("circleNum2", 2);
}
// 进度条进度
if(!cc.sys.localStorage.getItem("percentBar")){
    cc.sys.localStorage.setItem("percentBar", 0);
}

// 在线时长
if(!cc.sys.localStorage.getItem("totalTime")){
    cc.sys.localStorage.setItem("totalTime", 0);
}

// 是否进行过内购
if(!cc.sys.localStorage.getItem("noAD")){
    cc.sys.localStorage.setItem("noAD", "false");
    window.noAD = false;
}
else if(cc.sys.localStorage.getItem("noAD") == "true"){
    window.noAD = true;
}
else if(cc.sys.localStorage.getItem("noAD") == "false"){
    window.noAD = false;
}
// 死亡次数
if(!cc.sys.localStorage.getItem("gameoverTimes")){
    cc.sys.localStorage.setItem("gameoverTimes", 0);
}

// 登录游戏的次数
if(!cc.sys.localStorage.getItem("loginTimes")){
    cc.sys.localStorage.setItem("loginTimes", 0);
}
// 锤子冷却计时
if(!cc.sys.localStorage.getItem("hammerTime")){
    cc.sys.localStorage.setItem("hammerTime", 0);
}
// 锤子使用次数
if(!cc.sys.localStorage.getItem("useHammerTime")){
    cc.sys.localStorage.setItem("useHammerTime", 0);
}
// 单次连接最高分
if(!cc.sys.localStorage.getItem("hightestScore")){
    cc.sys.localStorage.setItem("hightestScore", 8);
}

// 是否五星好评
if(!cc.sys.localStorage.getItem("isFiveStar")){
    cc.sys.localStorage.setItem("isFiveStar", "false");
    window.isFiveStar = false;
}
else if(cc.sys.localStorage.getItem("isFiveStar") == "true"){
    window.isFiveStar = true;
}
else if(cc.sys.localStorage.getItem("isFiveStar") == "false"){
    window.isFiveStar = false;
}

// 每重新开始3次则五星好评界面
if(!cc.sys.localStorage.getItem("restartTimes")){
    cc.sys.localStorage.setItem("restartTimes", 0);
}

// 棋盘数据
/*
if(!cc.sys.localStorage.getItem("board")){
    cc.sys.localStorage.setItem("board", );
}
*/
DataMgr.myLocalMgr = {
    isFirstTimeLoad: cc.sys.localStorage.getItem("isFirstLoad"),

    presentScore: cc.sys.localStorage.getItem("presentScore"),
    bestScore: cc.sys.localStorage.getItem("bestScore"),
    circleNum1: cc.sys.localStorage.getItem("circleNum1"),
    circleNum2: cc.sys.localStorage.getItem("circleNum2"),
    percentBar: cc.sys.localStorage.getItem("percentBar"),

    totalTime: cc.sys.localStorage.getItem("totalTime"),
    loginTimes: cc.sys.localStorage.getItem("loginTimes"),
    gameoverTimes: cc.sys.localStorage.getItem("gameoverTimes"),
    hammerTime: cc.sys.localStorage.getItem("hammerTime"),
    useHammerTime: cc.sys.localStorage.getItem("useHammerTime"),

    hightestScore: cc.sys.localStorage.getItem("hightestScore"),

    restartTimes: cc.sys.localStorage.getItem("restartTimes"),
};

module.exports = DataMgr;