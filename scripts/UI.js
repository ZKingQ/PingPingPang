/**
 * 用于显示分数和点击效果的类
 * @class UI
 */
class UI {
    constructor() {
        /**
         * 分数显示坐标
         * @property {int} x, y
         * 当前分数
         * @property {int} score
         * 分数显示颜色
         * @property {string} color
         */
        this.x = 50;
        this.y = 50;
        this.hit = 0;
        this.score = 0;
        this.display = [];
        this.difficulty = 0;
        this.color = '#d2e2f2';
        this.playTime = new Date();
        this.lastTime = new Date();
    }

    draw(context, animation) {
        context.save();
        this.display.forEach((val, key) => {
            context.font = val.font;
            context.fillStyle = val.color;
            context.fillText(val.point, val.loc.x, val.loc.y);
            if (new Date() - val.time > 1000)
                this.display.splice(key, 1);
        });
        context.font = '20px monaco';
        context.fillStyle = this.color;
        // 检查游戏进程
        if (balls.length > 50 || this.score < -5) {
            cancelAnimationFrame(animation);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'black';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = 'white';
            context.font = '100px monaco';
            context.textAlign = 'center';
            context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        } else {
            context.fillStyle = '#F56C6C';
            context.fillText('score:' + this.score, this.x, this.y);
        }
        if (now - this.playTime > 1000) {
            bgm.pause();
        }
        context.restore();
    }

    addShow(point, loc) {
        if (point === 0) {
            this.display.push({
                point: "Miss",
                loc: loc,
                color: "#E6A23C",
                font: "20px monaco",
                time: new Date()
            });
            this.score -= 1;
            this.hit = 0;
        } else {
            const strList = ['First', 'Double', 'Good', 'Perfect', 'Great', 'GREAT'];
            let str;
            if (this.score === 0) {
                str = strList[0];
            }
            if (now - this.lastTime <= 1000) {
                str = strList[Math.min(5, this.hit)];
                ++this.hit;
            } else {
                this.hit = 1;
                str = strList[0];
            }
            if (this.playTime < now) {
                bgm.play();
            }
            this.playTime = now;
            this.lastTime = now;
            this.score += point * this.hit;
            this.difficulty = 10;
            this.display.push({
                point: "+" + point * this.hit + " " + str,
                loc: loc,
                color: point < 10 ? "#67C23A" : "#F56C6C",
                font: point < 10 ? "20px monaco" : "30px monaco",
                time: new Date()
            })
        }
        if (this.display.length > 2) this.display.splice(0, 1);
    }
}
