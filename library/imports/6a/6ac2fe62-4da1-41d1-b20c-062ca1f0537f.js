"use strict";
cc._RF.push(module, '6ac2f5iTaFB0bIMBiyh8FN/', 'adconfig');
// myScripts/platform/AD/adconfig.js

'use strict';

// 广告
window.AD_CONFIG = {};
AD_CONFIG.BANNER = 100; // banner 广告出现的概率
// 死亡界面 全屏广告
AD_CONFIG.DIED_TIMES = 1; // 死亡2次数后弹出广告
AD_CONFIG.DIED_PRO = 100; // 出现概率80%
// 登录界面 全屏广告
AD_CONFIG.LOGIN_TIMES = 2; // 第二次及以后登录游戏
AD_CONFIG.LOGIN_PRO = 100; // 出现概率40%
// 升级成功 关闭对话框
AD_CONFIG.DIALOG_PRO = 100; // 出现概率25%
// 点击暂停按钮
AD_CONFIG.PAUSE_PRO = 50; // 出现概率100%
// 切换app时
AD_CONFIG.CHANGEAPP_PRO = 25; // 出现概率25%
// 激励广告
//AD_CONFIG.RELIVE_TIMES = 1 // 复活机会1次
// 道具广告
//AD_CONFIG.PROP_TIMES = 1 // 道具使用次数
//AD_CONFIG.CD_TIME = 30 * (AD_CONFIG.PROP_TIMES-1) // 第n次冷却时间

// 五星好评
window.FIVE_STAR = {};
FIVE_STAR.DIED_TIMES = 5; // 死亡3次弹出五星好评 评价过则不弹

// 排行榜
window.RANK = {};
RANK.GAME_TIME = 'Gametime_2For2048'; // Game time
RANK.SCORE = 'Score_2For2048'; // Best Score
//RANK.MAX_K = 'Score_Maximum'    //连出的最大k

window.ID_COLLECTION = {};
ID_COLLECTION.APPIP = 1438717777;

ID_COLLECTION.REMOVEAD = '2For2048.Noads';
// 2、套装 ID  Hnkj.Hare.2for1024

cc._RF.pop();