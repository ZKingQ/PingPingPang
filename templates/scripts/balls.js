function Ball(radius, color) {
    if (!radius) radius = 40;
    if (!color) color = Math.random() * 0xffffff;
    this.x = this.y = this.vx = this.vy = 0;
    this.radius = radius;
    this.createTime = new Date();
    this.color = utils.parseColor(color); // 调用编写的函数将传入的16进制树转化为RGB值
    // this.rotation = 0;
    // this.scaleX = 1;
    // this.scaleY = 1;
    // this.lineWidth = 1;
    // this.visible = true;
}

Ball.prototype = {
    constructor: Ball,
    draw: function () {
        context.save();
        context.translate(this.x, this.y);
        // context.rotate(this.rotation);
        // context.scale(this.scaleX, this.scaleY);
        context.lineWidth = this.lineWidth;
        context.fillStyle = this.color;
        context.beginPath();
        //x, y, radius, start_angle, end_angle, anti-clockwise
        context.arc(0, 0, this.radius, 0, (Math.PI * 2), true);
        context.closePath();
        context.fill();
        // if (this.lineWidth > 0) {
        //     context.stroke();
        // }
        context.restore();
    },
    getBounds: function () {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
};