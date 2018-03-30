//点击开始游戏 -》 动态生成100个小格--》100div
//leftClick  没有雷  --》显示数字（代表以当前小格为中心周围8个格的雷数） 扩散（当前周围八个格没有雷）
//           有累 --》game Over
//rightClick 没有标记并且没有数字--》进行标记。 有标记 --》取消标记 --》标记是否正确，10个都正确标记，提示成功
//已经出现数字--》无效果


var startBtn = document.getElementById('btn');  //最大开始按钮
var box = document.getElementById('box');       //草地
var flagBox = document.getElementById('flagBox');  //当前..雷数box
var alertBox = document.getElementById('alertBox');    //结束弹出框
var alertImg = document.getElementById('alertImg');
var closeBtn = document.getElementById('close');
var score = document.getElementById('score');
var minesNum;    //总雷数
var mineOver;    //剩余雷数
var block;
var mineMap = [];
var startGameBool = true;

bindEvent();
function bindEvent() {            //绑定事件函数
    startBtn.onclick = function () {           // 1. 点击开始按钮
        if(startGameBool){
            box.style.display = 'block';
            flagBox.style.display = 'block';
            init();                                 // 初始化
            startGameBool = false;
        }   
    }

    box.oncontextmenu = function () {         // 2.取消草地区域鼠标右击默认事件
        return false;
    }
    box.onmousedown = function (e) {           // 3. 草地区域鼠标按下 (根据e.which判断是左击还是右击)
        var event = e.target;                      //             分别调用左点击函数/右击函数
        if (e.which == 1) {
            leftClick(event);       //event 指事件对象
        } else if (e.which == 3) {
            rightClick(event);
        }
    }
    closeBtn.onclick = function () {           // 4.点击关闭按钮
        alertBox.style.display = 'none';
        flagBox.style.display = 'none';
        box.style.display = 'none';
        box.innerHTML = '';                           //清空
        startGameBool = true;
    }
}

function init() {           // 初始化过程
    minesNum = 10;
    mineOver = 10;
    score.innerHTML = mineOver;
    
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var con = document.createElement('div');
            con.classList.add('block');
            con.setAttribute('id', i + '-' + j);
            box.appendChild(con);
            mineMap.push({ mine: 0 });  //每生成一个div，就插入到数组里
        }
    }
    //console.log(mineMap)
    block = document.getElementsByClassName('block');
    while (minesNum) {
        var mineIndex = Math.floor(Math.random() * 100);  //生成10个0~100的随机数
        //console.log(mineIndex)
        if (mineMap[mineIndex].mine === 0) {  // 为0时，把这10个位置赋值等于1(表示雷)，防止重复
            mineMap[mineIndex].mine = 1;
            block[mineIndex].classList.add('isLei'); // 添加类名islei
            minesNum--;
        }
    }
}

function leftClick(dom) {   //左击
    if(dom.classList.contains('flag')){  //1.if判断，如果有旗子，不予处理
        return;
    }
    var isLei = document.getElementsByClassName('isLei');
    if (dom && dom.classList.contains('isLei')) {         //对象存在，且是雷
        for (var i = 0; i < isLei.length; i++) {  //全部雷，显示
            isLei[i].classList.add('show');
        }
        setTimeout(function () {    //0.8秒后弹出，游戏结束
            alertBox.style.display = 'block';
            alertImg.style.backgroundImage = 'url("./img/over.jpg")';
        }, 800)
    } else {                              // 2.else不是雷
        var n = 0;
        var posArr = dom && dom.getAttribute('id').split('-'); //将"i-j" 差分成数组 [i,j]
        var posX = posArr && +posArr[0];
        var posY = posArr && +posArr[1];
        dom && dom.classList.add('num');  //如果不是雷就添加num类名
        for (var i = posX - 1; i <= posX + 1; i++) {
            for (var j = posY - 1; j <= posY + 1; j++) {     //循环遍历周围8块区域
                var aroundBox = document.getElementById(i + '-' + j);
                if (aroundBox && aroundBox.classList.contains('isLei')) {//判断当这8块中有包含islei，n++
                    n++;
                }
            }
        }

        dom && (dom.innerHTML = n);    //将n数字添加到方块中
        
        if (n == 0) {
            for (var i = posX - 1; i <= posX + 1; i++) {
                for (var j = posY - 1; j <= posY + 1; j++) {
                    var nearBox = document.getElementById(i + '-' + j);
               
                    if (nearBox && nearBox.length != 0) {
                            // console.log(nearBox.length);
                        if (!nearBox.classList.contains('check')) {
                            nearBox.classList.add('check');
                            leftClick(nearBox);   //递归
                        }
                    }
                }
            }
        }
    }
}

function rightClick(dom){
    if(dom.classList.contains('num')){ //有数字，直接返回空
        return;
    }else{
        dom.classList.toggle('flag'); //没数字，toggle插旗
    }
    
    if(dom.classList.contains('isLei') &&dom.classList.contains('flag')){
        mineOver --;  //是雷且插旗
    }
    if(dom.classList.contains('isLei') && !dom.classList.contains('flag')){
        mineOver ++;   //是雷且没插旗
    }

    score.innerHTML = mineOver;
    if(mineOver == 0){
        alertBox.style.display = 'block';
        alertImg.style.backgroundImage = 'url("img/success.png")';
    }
}