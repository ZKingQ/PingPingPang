let canvas = document.getElementById('myCanvas'),
    context = canvas.getContext('2d');
const bgm = document.getElementById('bgm');

let balls = [],
    snows = [], //数组存放每一片雪花
    ui = new UI(),
    now,
    lastTime = new Date(),
    lastTime1 = new Date(),
    background_image = new Image();

background_image.src = './images/img.jpg';


/**
 * 随机生成小球并放入
 * @returns {boolean} 是否成功放入小球
 */
function randomBall() {
    const radius = Math.max(Math.random() * 50 + 50 - ui.difficulty * 4, 20);
    let x, y;
    let flag = true, i = 0;
    // 尝试寻找空余地方放入
    while (flag) {
        if (++i > 1000) return false;
        x = Math.random() * canvas.width;
        y = Math.random() * canvas.height;
        flag = false;
        balls.forEach((ball) => {
            let dist = Math.sqrt((x - ball.x) ** 2 + (y - ball.y) ** 2);
            if (dist <= ball.radius + radius + 20)
                flag = true;
        });
    }
    const vx = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2 + ui.difficulty / 2,
        vy = (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2 + ui.difficulty / 2;
    balls.push(new Ball(radius, x, y, vx, vy));
    return true;
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
    ball.move();
    checkWalls(ball);
}

// 小球绘制与消除超时
function drawBalls(ball, index) {
    if (ball.radius > 20) {
        ball.radius -= 0.01;
        ball.createTime = now;
    }
    else if (now - ball.createTime > 20000) {
        balls.splice(index, 1);
        --ui.score;
    }
    ball.draw(context);
}

// 根据时间创造新的雪花与小球
function createThings() {
    if (now - lastTime > snows.length - now.getMinutes() && snows.length < 1000) {
        const radius = Math.random() * 5 + 2;
        const x = Math.random() * canvas.width + 1;
        let snow = new Ball(radius, x);
        snow.vy = snow.radius / 3;
        snow.color = '#ffffff';
        snows.push(snow);
        lastTime = now;
    }
    if (now - lastTime1 > balls.length * 30 + 300 && balls.length < 100) {
        if (randomBall())
            lastTime1 = now;
    }
}

/**
 * 绘制雪花，模拟雪花移动
 * @param snow
 * @param index
 */
function drawSnow(snow, index) {
    snow.move();
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
    context.drawImage(background_image, 0, 0, canvas.width, canvas.height);
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
    ui.draw(context, animation);
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

// 检测是否点中小球并计分
function clickBall(ev) {
    let loc = windowToCanvas(ev.x, ev.y);
    let flag = false;
    balls.forEach((ball, index) => {
        if (flag) return;
        let dist = Math.sqrt((loc.x - ball.x) * (loc.x - ball.x) + (loc.y - ball.y) * (loc.y - ball.y));
        if (dist <= ball.radius) {
            let point = Math.round(Math.log(ball.radius + 10 * Math.abs(ball.vx) * Math.abs(ball.vy)));
            ui.addShow(point, loc);
            balls.splice(index, 1);
            flag = true;
        }
    });
    if (!flag) ui.addShow(0, loc);
}

// 游戏开始
(function init() {
    let ballsNum = 20;
    canvas.addEventListener('mousedown', clickBall);
    for (let i = 0; i < ballsNum; i++) {
        randomBall();
    }
    drawFrame();
}());

// 根据窗口大小动态缩放canvas尺寸
function resize() {
    const height = window.innerHeight;
    const ratio = canvas.width/canvas.height;
    const width = height * ratio;
    canvas.style.width = width+'px';
    canvas.style.height = height+'px';
}

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
