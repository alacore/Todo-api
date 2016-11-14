$(document).ready(function() {
    $('.animation').css("background-color", "#FFFFFF");
    $('.canvas-stop').click(function() {
        fall();
    });

    $('.canvas-start').click(function() {
        doneTweening();
    });

});

var tweening = false;

function init() {
    var stage = new createjs.Stage("demoCanvas");
    var numBalls = 50;
    var w = stage.canvas.width,
        h = stage.canvas.height,
        rMax = 85,
        rMin = 15;

    var ySpeedMax = 13,
        ySpeedMin = 5;

    var yReflSpeed;

    var angleMin = Math.PI / 10;
    var angleMax = Math.PI * 2 / 9;

    var color = "#eb0e3d" //red;

    var balls = generateBalls(numBalls);

    for (var i = 0; i < numBalls; i++) {
        stage.addChild(balls[i]);
    }

    createjs.Ticker.setFPS(60);
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", handleTick);
    // console.log(stage);

    function handleTick(event) {


        balls.forEach(function(ball, index, arr) {
            if (!tweening) { // A tween is happening, so don't animate

                ball.y += ball.ySpeed;
                ball.x += ball.ySpeed * Math.tan(ball.dirAngle);

                // Bounces
                if (ball.x < ball.r || ball.x > w - ball.r) {

                    ball.dirAngle *= -1;
                    ball.x = Math.max(ball.r, Math.min(w - ball.r, ball.x)); // Stay in bounds
                }

                if (ball.y > h - ball.r) {

                    var signX = Math.sign(ball.xSpeed);
                    var signY = Math.sign(ball.ySpeed);

                    ball.xSpeed = 0;
                    ball.ySpeed = 0;

                    ball.y = Math.min(h - ball.r, ball.y); // Stay in bounds

                    let t1 = new TimelineMax({ yoyo: false, smoothChildTiming: true });
                    t1.to(ball, 0.05, { scaleY: 0.65, scaleX: 1.35 });
                    t1.to(ball, 0.008, { regY: -signY * ball.r * 0.65 }, "-=0.035");
                    t1.to(ball, 0.05, { scaleY: 1.03, scaleX: 0.97, regY: signY * ball.r * 0.15, onComplete: handleTick });

                    function handleTick() {

                        ball.ySpeed = -signY * yReflSpeed;
                        ball.dirAngle *= -1;
                    }

                } else if (ball.y < -h / 2) {
                    var plusYspeed = Math.random() * 0.4 + 1;
                    ball.ySpeed *= -1 * plusYspeed;
                    ball.dirAngle *= -1;
                }

            } else {
                var t2 = new TimelineMax({ repeat: -1 });
                t2.to(ball, 0.2, { scaleY: 1, scaleX: 1, y: h - ball.r, regY: 0 }, 0.2);
                t2.to(ball, 1.9, { x: w + 2 * ball.r, onComplete: stopTweening });

                function stopTweening() {

                    TweenMax.killAll();
                }
            }

            stage.update(event);
        });
    }

    function createBall(xInit, yInit, ySpeed, color, xAlpha, yReflSpeed, dirAngle) {

        var r = Math.random() * (rMax - rMin) + rMin;
        var ball = new createjs.Shape()
            .set({ r: r, x: xInit, y: yInit, ySpeed: ySpeed, alpha: xAlpha * r / rMax, dirAngle: dirAngle });
        var fill = ball.graphics.f(color).command; // store the fill to change it
        ball.graphics.s(color).dc(0, 0, r);

        return ball;
    }

    function generateBalls(numBalls) {

        var balls = [];
        for (var i = 0; i < numBalls; i++) {

            var xPos = Math.random() * (w - 4 * rMax) + 4 * rMax;
            var yPos = Math.random() * (rMax + h / 2) - h / 2;
            var ySpeed = Math.random() * (ySpeedMax - ySpeedMin) + ySpeedMin;
            var dirAngle = Math.random() * (angleMax - angleMin) + angleMin;
            yReflSpeed = ySpeed * 1.12;
            var xAlpha = Math.random() * (.7 - .55) + .55;
            var ball = createBall(xPos, yPos, ySpeed, color, xAlpha, yReflSpeed, dirAngle);
            balls.push(ball);
        }
        return balls;
    }
}

function fall() {
    startTweening();
}

function startTweening() {
    tweening = true;
}

function doneTweening() {
    init();
    tweening = false;
}