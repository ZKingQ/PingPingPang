/*
* 借鉴了Foundation HTML5 Animation with JavaScript  by Billy Lamberta and Keith Peters
* 书中的代码，在其基础上改写并增加更多的功能
*/
let canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d'),
    balls = [],
    ui = new UI(),
    animation,
    now,
    gender,
    beauty, // 人工智能API返回值
    snows = [], //数组存放每一片雪花
    lastTime = new Date(),
    lastTime1 = new Date(),
    back_image = new Image(),
    snow_image = new Image();
back_image.src = './images/img.jpg';
snow_image.src = './images/snow.jpg';

back_image.onload = function (e) {
    context.save();
    context.globalAlpha = 0.7;
    context.drawImage(back_image, 0, 0, canvas.width, canvas.height);
    context.restore();
    context.save();
    context.fillStyle = 'black';
    context.font = "33px Georgia";
    context.textAlign = 'center';
    let x = canvas.width / 2, y = 0.3 * canvas.height;
    context.fillText("游戏中会有许多漂浮的小球，通过点击可以打破它们。", x, y);
    context.fillText("通过下面的链接选择一张图片地址，随着游戏的进行，球的移动速度会越来越快", x, y + 50);
    context.fillText("快去拯救地球吧！Hero！（请点击开始游戏", x, y + 100);
    context.restore();
};

function randomBall() {
    let radius = Math.random() * 60 + 30 - ui.difficulty * 3;
    let newBall = new Ball(radius);
    let flag = true, i = 0;
    while (flag) {
        if (++i > 100) return;
        newBall.x = Math.random() * canvas.width;
        newBall.y = Math.random() * canvas.height;
        flag = false;
        balls.forEach((ball) => {
            let dist = Math.sqrt((newBall.x - ball.x) * (newBall.x - ball.x) + (newBall.y - ball.y) * (newBall.y - ball.y));
            if (dist <= ball.radius + newBall.radius + 20)
                flag = true;
        });
    }
    newBall.vx = Math.random() * 5 + ui.difficulty / 2;
    newBall.vy = Math.random() * 5 + ui.difficulty / 2;
    balls.push(newBall);
}

// 墙面碰撞检测
function checkWalls(ball) {
    let bounce = -0.95; // 碰撞墙面衰减系数
    if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width - ball.radius;
        ball.vx *= bounce;
    } else if (ball.x - ball.radius < 0) {
        ball.x = ball.radius;
        ball.vx *= bounce;
    }
    if (ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        ball.vy *= bounce;
    } else if (ball.y - ball.radius < 0) {
        ball.y = ball.radius;
        ball.vy *= bounce;
    }
}

// 矢量偏移计算
function rotate(x, y, sin, cos, reverse) {
    return {
        x: (reverse) ? (x * cos + y * sin) : (x * cos - y * sin),
        y: (reverse) ? (y * cos - x * sin) : (y * cos + x * sin)
    };
}

// 物体碰撞检测
function checkCollision(ball0, ball1) {

    let dx = ball1.x - ball0.x,
        dy = ball1.y - ball0.y,
        dist = Math.sqrt(dx * dx + dy * dy);
    //collision handling code here
    if (dist < ball0.radius + ball1.radius) {
        //calculate angle, sine, and cosine
        let angle = Math.atan2(dy, dx),
            sin = Math.sin(angle),
            cos = Math.cos(angle),
            //rotate ball0's position
            pos0 = {x: 0, y: 0}, //point
            //rotate ball1's position
            pos1 = rotate(dx, dy, sin, cos, true),
            //rotate ball0's velocity
            vel0 = rotate(ball0.vx, ball0.vy, sin, cos, true),
            //rotate ball1's velocity
            vel1 = rotate(ball1.vx, ball1.vy, sin, cos, true);
        //collision reaction, swap the two velocities
        [vel0, vel1] = [vel1, vel0]; // ES6
        //update position - to avoid objects becoming stuck together
        let absV = Math.abs(vel0.x) + Math.abs(vel1.x),
            overlap = (ball0.radius + ball1.radius) - Math.abs(pos0.x - pos1.x);
        pos0.x += vel0.x / absV * overlap;
        pos1.x += vel1.x / absV * overlap;
        //rotate positions back
        let pos0F = rotate(pos0.x, pos0.y, sin, cos, false),
            pos1F = rotate(pos1.x, pos1.y, sin, cos, false);
        //adjust positions to actual screen positions
        ball1.x = ball0.x + pos1F.x;
        ball1.y = ball0.y + pos1F.y;
        ball0.x = ball0.x + pos0F.x;
        ball0.y = ball0.y + pos0F.y;
        //rotate velocities back
        let vel0F = rotate(vel0.x, vel0.y, sin, cos, false),
            vel1F = rotate(vel1.x, vel1.y, sin, cos, false);
        ball0.vx = vel0F.x;
        ball0.vy = vel0F.y;
        ball1.vx = vel1F.x;
        ball1.vy = vel1F.y;
        ball0.vx *= 0.99;
        ball0.vy *= 0.99;
        ball1.vx *= 0.99;
        ball1.vy *= 0.99;
    }
}

// 物体移动函数
function move(ball) {
    ball.x += ball.vx;
    ball.y += ball.vy;
    checkWalls(ball);
}

// 气泡绘制
function drawBalls(ball, index) {
    if (ball.radius > 20) {
        ball.radius -= 0.02;
    }
    else if (now - ball.createTime > 20000)
        balls.splice(index, 1);
    // if (ball.radius <= 0) {
    //     balls.splice(index, 1);
    //     --ui.score;
    // }
    ball.draw(context);
}

// 根据时间创造新的雪花与气泡
function createThings() {
    if (now - lastTime > snows.length - now.getMinutes() && snows.length < 1000) {
        let snow = new Ball(0, '#ffffff');
        snow.x = Math.random() * canvas.width + 1;
        snow.radius = Math.random() * 5 + 2;
        snows.push(snow);
        lastTime = now;
    }
    if (now - lastTime1 > balls.length * 50 + 300 && balls.length < 100) {
        randomBall();
        lastTime1 = now;
    }
}

// 绘制雪花
function drawSnow(snow, index) {
    snow.y += snow.radius / 3;
    if (snow.y > canvas.height)
        snows.splice(index, 1);
    else
        snow.draw(context);
}

// 动画绘制
function drawFrame() {
    let animation = requestAnimationFrame(drawFrame);
    now = new Date();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(snow_image, 0, 0, canvas.width, canvas.height);
    createThings();
    snows.forEach(drawSnow);
    balls.forEach(move);
    for (let i = 0, len = balls.length - 1; i < len; i++) {
        let ballA = balls[i];
        // n^2暴力枚举每个气泡之间是否发生碰撞
        for (let j = i + 1; j < balls.length; j++) {
            let ballB = balls[j];
            checkCollision(ballA, ballB);
        }
    }
    balls.forEach(drawBalls);
    ui.draw(context);
}

// 坐标转换函数
function windowToCanvas(x, y) {
    let myStyle = window.getComputedStyle(canvas);
    let bbox = canvas.getBoundingClientRect();
    x -= bbox.left + parseFloat(myStyle.borderLeftWidth) + parseFloat(myStyle.paddingLeft);
    y -= bbox.top + parseFloat(myStyle.borderTopWidth) + parseFloat(myStyle.paddingTop);
    x *= canvas.width / (parseFloat(myStyle.width));
    y *= canvas.height / (parseFloat(myStyle.height));
    return {x: x, y: y};
}

// 点击气泡的效果
function clickBall(ev) {
    let loc = windowToCanvas(ev.x, ev.y);
    let flag = false;
    balls.forEach((ball, index) => {
        if (flag) return;
        let dist = Math.sqrt((loc.x - ball.x) * (loc.x - ball.x) + (loc.y - ball.y) * (loc.y - ball.y));
        if (dist <= ball.radius) {
            let point = Math.round(Math.log(Math.max(ball.radius, (Math.abs(ball.vx) * Math.abs(ball.vy)))));
            ui.addShow(point, loc);
            balls.splice(index, 1);
            flag = true;
        }
    });
    if (!flag) ui.addShow(0, loc);
}

// 游戏开始
function init() {
    let ballsNum = Math.round(10 - beauty / 10);
    if(gender === 'man') {
        bgm.play();
    }
    canvas.addEventListener('mousedown', clickBall);
    for (let i = 0; i < ballsNum; i++) {
        randomBall();
    }
    drawFrame();
}