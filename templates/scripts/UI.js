let audio1 = document.getElementById("firstBlood");
let audio2 = document.getElementById("doubleKill");
let audio3 = document.getElementById("tripleKill");
let audio4 = document.getElementById("quadraKill");
let audio5 = document.getElementById("pentaKill");

function UI() {
    this.x = 50;
    this.y = 50;
    this.score = 0;
    this.difficulty = 0;
    this.color = '#d2e2f2';
    this.display = [];
    this.playTime = new Date();
    this.hit = 0;
    this.lastTime = new Date();
}

UI.prototype = {
    constructor: UI,
    draw: function () {
        context.save();
        this.display.forEach((a, index) => {
            context.font = a.font;
            context.fillStyle = a.color;
            context.fillText(a.point, a.loc.x, a.loc.y);
            if (new Date() - a.time > 1000)
                this.display.splice(index, 1);
        });
        context.font = '20px monaco';
        context.fillStyle = this.color;
        // 检查游戏进程
        if (balls.length > 100 || this.score < -5) {
            cancelAnimationFrame(animation);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.font = '100px monaco';
            context.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
        else
            context.fillText('score:' + this.score, this.x, this.y);
        if (gender === 'woman' && now - this.playTime > 1000) {
            console.log("A");
            bgmm.pause();
        }
        context.restore();
    },
    addShow: function (point, loc) {
        if (point === 0) {
            this.display.push({
                point: "Miss", loc: loc, color: "#E6A23C", font: "20px monaco", time: new Date()
            });
            this.score -= Math.max(1, Math.round(this.score * 0.05));
            this.hit = 0;
        }
        else {
            let str = '';
            if (gender === 'man') {
                if (this.score === 0) {
                    str = 'First Blood';
                    audio1.play();
                }
                if (now - this.lastTime <= 1000) {
                    ++this.hit;
                    if (this.hit === 2) {
                        str = 'Double Kill';
                        audio2.play();
                    }
                    else if (this.hit === 3) {
                        str = 'Triple Kill';
                        audio3.play();
                    }
                    else if (this.hit === 4) {
                        str = 'Quadruple Kill';
                        audio4.play();
                    }
                    else if (this.hit === 5) {
                        str = 'Penta Kill';
                        audio5.play();
                    }
                    else if (this.hit > 5) {
                        str = 'Great';
                    }
                }
                else {
                    this.hit = 1;
                }
            } else {
                if (this.score === 0) {
                    str = 'First';
                }
                if (now - this.lastTime <= 1000) {
                    ++this.hit;
                    if (this.hit === 2) {
                        str = 'Double';
                    }
                    else if (this.hit === 3) {
                        str = 'Good';
                    }
                    else if (this.hit === 4) {
                        str = 'Perfect';
                    }
                    else if (this.hit === 5) {
                        str = 'Great';
                    }
                    else if (this.hit > 5) {
                        str = 'GREAT';
                    }
                }
                else {
                    this.hit = 1;
                }
                if (this.playTime < now) {
                    bgmm.play();
                }
                this.playTime = now;
            }
            this.lastTime = now;
            this.score += point * this.hit;
            this.difficulty = Math.min(ui.score / beauty, 10);
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
};
