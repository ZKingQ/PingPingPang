/**
 * 用于小球和雪花生成的类
 * @class Ball
 */
class Ball {
    constructor(radius = 40, x = 0, y = 0, vx = 0, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.createTime = new Date();
        this.color = utils.parseColor(Math.random() * 0xffffff); // 调用编写的函数将传入的16进制数转化为RGB值
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    draw(context) {
        context.save();
        context.translate(this.x, this.y);
        context.lineWidth = this.lineWidth;
        context.fillStyle = this.color;
        context.beginPath();
        //x, y, radius, start_angle, end_angle, anti-clockwise
        context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
        context.closePath();
        context.fill();
        context.restore();
    }
}