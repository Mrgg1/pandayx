var loadBar_width = 200,
    loadBar_height = 20,
    initX = 100,
    initY = 300,
    panda_speed = 10,
    platform_header_tail_width = 102,
    platform_middle_width = 290,
    platform_height = 75,
    platform_margin = 50,
    platform_speed = 5,
    panda_width = 79,
    panda_height = 93,
    apple_size = 52,
    jump_key = 32;

var canvas,stage,loader,loadBar,panda,gameoverTxt;

var lastPlatformSide = 0,
    gameRunning = false,
    score = 0;

var platforms = [],
    apples = [];

function init(){
    //获取画布
    canvas = document.querySelector("#cv");
    //创建舞台
    stage = new createjs.Stage(canvas);
    //让页面循环刷新
    createjs.Ticker.setFPS(25);
    createjs.Ticker.addEventListener('tick',function(e){
        if(!e.paused){
            if(gameRunning){
                startGame();
                console.log(apples.length,platforms.length);
            }
            stage.update();
        }

    })
    //加载资源
    preload();

}

function preload(){

    //绘制进度条
    buildLoadBar();
    //加载资源
    loadRes();

}

function buildLoadBar(){
    var loadBorder,bar;
    loadBar = new createjs.Container();//容器
    loadBorder = new createjs.Shape();//进度条的外框
    loadBorder.graphics.beginStroke('#ccc')
              .setStrokeStyle(5).drawRect(0,0,loadBar_width,loadBar_height);
    loadBar.addChild(loadBorder);
    bar = new createjs.Shape();
    loadBar.addChild(bar);

    loadBar.x = (canvas.width - loadBar_width)/2;
    loadBar.y = 200;
    stage.addChild(loadBar);

}

function loadRes(){
    loader = new createjs.LoadQueue();//资源加载器
    loader.installPlugin(createjs.Sound);//安装插件以便加载声音资源
    loader.loadManifest([             //异步操作
        {src:"panda.png",id:"panda"},
        {src:"platform_l.png",id:'pl'},
        {src:"platform_r.png",id:'pr'},
        {src:"platform_m.png",id:'pm'},
        {src:"apple.png",id:'apple'},
        {src:"apple.mp3",id:"appleMp3"},
        {src:"hit.mp3",id:'hitMp3'},
        {src:"hit_platform.mp3",id:'hitPlatformMp3'},
        {src:"lose.mp3",id:'loseMp3'},
    ]);
    //监听加载进度
    loader.addEventListener('progress',function(e){
        var bar = loadBar.getChildAt(1);
        bar.graphics.beginFill("#0033ff").drawRect(0,0,loadBar_width* e.progress,loadBar_height);

    });
    //监听加载结束
    loader.addEventListener('complete',function(){
        stage.removeAllChildren();
        //注册声音资源
        createjs.Sound.registerSound('apple.mp3', 'bgMusic');
        createjs.Sound.registerSound('hit.mp3', 'hitMp3');
        createjs.Sound.registerSound('hit_platform.mp3', 'hitPlatformMp3');
        createjs.Sound.registerSound('lose.mp3', 'loseMp3');
        //新建游戏
        newGame();

    });
}

function newGame(){
    //绘制熊猫
    buildPanda();
    //绘制平台
    buildPlatform();
    //添加控制
    setControls();
    gameRunning = true;
    createjs.Sound.play('bgMusic');

}

function buildPlatform(){
    var i;
    for(i = 0;i<3;i++){
        addPlatform();//添加平台
    }
}

function addPlatform(){
    var i,j,pl,pr,pm,platform,pmNum,marginNum,appleNum,apple;
    var appleInitX,appleMargin;
    platform = new createjs.Container();
    pl = new createjs.Bitmap(loader.getResult('pl'));//获取bitmap
    pl.x = 0;
    pl.y = 0;
    platform.addChild(pl);
    pmNum = Math.round(Math.random()*3);
    for(i = 0;i<pmNum;i++){
        pm = new createjs.Bitmap(loader.getResult('pm'));
        pm.y = 0;
        pm.x = platform_header_tail_width + i*platform_middle_width;
        platform.addChild(pm);
    }
    pr = new createjs.Bitmap(loader.getResult('pr'));
    pr.y = 0;
    pr.x = platform_header_tail_width + pmNum * platform_middle_width;
    platform.addChild(pr);
    if(platforms.length == 0){
        marginNum = 0;
        platform.x = 0;
        platform.y = initY + panda_height;
        platform.height = platform_height;
        platform.width = platform_header_tail_width*2 + pmNum*platform_middle_width;
        lastPlatformSide = platform.width;
    }else{
        marginNum = Math.round(Math.random()*2+1);
        platform.x = lastPlatformSide + platform_margin*marginNum;
        platform.y = Math.round(Math.random()*200+100);
        platform.height = platform_height;
        platform.width = platform_header_tail_width*2 + pmNum*platform_middle_width;
        lastPlatformSide = platform.x + platform.width;
    }
    platforms.push(platform);
    stage.addChild(platform);

    //绘制苹果
    appleNum = Math.round(Math.random()*5);
    appleInitX = platform.x - platform_margin*marginNum;
    appleMargin = (platform.width + platform_margin*marginNum)/(appleNum+1);
    for(j = 0;j<appleNum;j++){
        apple =  new createjs.Bitmap(loader.getResult('apple'));
        apple.x = appleInitX + appleMargin+(appleMargin+apple_size)*j;
        console.log(appleInitX,appleMargin,apple_size,j,apple.x);
        apple.y = Math.round(platform.y - apple_size -Math.random()*200);
        apple.width = apple_size;
        stage.addChild(apple);
        apples.push(apple);

    }

}

function buildPanda(){
    var data,pandasheet;
    data = {
        "images": ["panda.png"],
        "frames": [
            [2, 2, 79, 93],
            [83, 2, 79, 93],
            [164, 2, 79, 93],
            [245, 2, 79, 93],
            [326, 2, 79, 93],
            [326, 2, 79, 93],
            [407, 2, 79, 93],
            [488, 2, 79, 93],
            [569, 2, 79, 93],
            [650, 2, 79, 93],
            [731, 2, 79, 93],
            [812, 2, 79, 93],
            [893, 2, 79, 93],
            [974, 2, 79, 93],
            [1055, 2, 79, 93],
            [1136, 2, 79, 93],
            [1217, 2, 79, 93],
            [1298, 2, 79, 93],
            [1379, 2, 79, 93],
            [1460, 2, 79, 93],
            [1541, 2, 79, 93],
            [1622, 2, 79, 93],
            [1703, 2, 79, 93],
            [1784, 2, 79, 93]
        ],
        "animations": {
            "run":[15,22],
            "jump":[0,6,"roll"],
            "roll":[7,14,"run"]
        }

    }
    pandasheet = new createjs.SpriteSheet(data);
    panda = new createjs.Sprite(pandasheet);
    panda.x = initX;
    panda.y = initY;
    panda.velY = panda_speed;
    panda.gotoAndPlay('run');
    stage.addChild(panda);
}

function setControls(){
    window.onkeydown = function(e){
        if(e.keyCode == jump_key){
            panda.gotoAndPlay('jump');
            panda.y -= 100;
        }
    }
}

function startGame(){
    //更新所有演员下一刻的位置
    update();//预判
    render();//渲染实际效果
}

function update(){
    //更新熊猫的位置
    checkPanda();
    //更新平台的位置
    checkPlatform();
    //更新苹果的位置
    checkApple();
}

function checkPanda(){

    var i,nextY,platform,apple;
    nextY = panda.y+panda_speed;
    //检查panda的所在平台
    for(i = 0;i<platforms.length;i++){
        platform = platforms[i];
        if((platform.x > panda.x && platform.x <=panda.x+panda_width)||
            (panda.x >platform.x && panda.x <=platform.x+platform.width)){
            break;
        }else{
            platform = null;
        }
    }

    //检查和平台的碰撞
    if(platform!=null && panda.y<=platform.y-panda_height && nextY >platform.y-panda_height){
        nextY = platform.y-panda_height;
        if(panda.y >nextY){
            createjs.Sound.play('hitPlatformMp3');
        }
    }else if(platform!=null && panda.y>platform.y-panda_height && nextY >platform.y-panda_height){
        gameover();
    }

    panda.nextY = nextY;

    for(i=0;i<apples.length;i++){
        apple = apples[i];
        if((apple.x>panda.x && apple.x < panda.x+panda_width)||
            (panda.x > apple.x && panda.x < apple.x+apple_size)){
            if((panda.y>apple.y && panda.y < apple.y+apple_size)||
                (apple.y>panda.y && apple.y<panda.y+panda_height )){
                score++;
                createjs.Sound.play('hitMp3');
                apple.visible = false;
            }
        }
    }



}

function checkPlatform(){
    var i,platform;
    for(i = 0;i<platforms.length;i++){
        platform = platforms[i];
        platform.x -= platform_speed;
    }
    lastPlatformSide -= platform_speed;

    platform = platforms[0];
    //是否超出屏幕之外
    if(platform.x<-platform.width){
        platform.visible = false;
    }
}

function checkApple(){
    var i,apple;
    for(i = 0;i<apples.length;i++){
        apple = apples[i];
        apple.x -= platform_speed;

    }
    apple = apples[0];
    //是否超出屏幕之

    if(apple.x<-apple.width){

        apple.visible = false;
    }
}

function render(){
    panda.y = panda.nextY;
    var i, apple,platform;
    platform  = platforms[0];
    if(!platform.visible){
        stage.removeChild(platform);
        platforms.shift();
        addPlatform();
    }

    for(i=0;i<apples.length;i++){
        apple = apples[i];
        if(!apple.visible){
            stage.removeChild(apple);
            apples.splice(i,1);
        }
    }

}

function gameover(){

    createjs.Ticker.setPaused(true);
    createjs.Sound.stop('bgMusic');
    createjs.Sound.play('loseMp3');
    gameoverTxt = new createjs.Text('GAME OVER!','48px Times','#33ffcc');
    gameoverTxt.x = canvas.width/2;
    gameoverTxt.y = 300;
    gameoverTxt.textAlign = 'center';
    stage.addChild(gameoverTxt);
    stage.update();
}
