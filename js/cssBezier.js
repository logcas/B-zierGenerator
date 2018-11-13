function Point(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
}

Point.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.color;
    ctx.fill();
}

let canvas = document.querySelector('#canvas'),
    formula = document.querySelector('#formula'),
    transition = '';

canvas.height = 600;
canvas.width = 320;

let ctx = canvas.getContext('2d'),
    origin = {
        x: 10,
        y: 450
    },
    axisLength = 300,
    idx = -1;

let closePoint = [
        new Point(10, 450, 10, '#e6d'),
        new Point(310, 150, 10, '#e6d')
    ],
    movePoint = [
        new Point(100, 200, 10, 'red'),
        new Point(250, 350, 10, 'blue')
    ],
    logicPoint = [
        new Point(0, 0, 10, '#fff'),
        new Point(0, 0, 10, '#fff'),
    ];

let lib = new BezierLibrary(document.querySelector('.lib'),
    [
        new BezierCube({
            x: 0.25,
            y: 0.1
        }, {
            x: 0.25,
            y: 1
        }, 'ease', '#6190E8'),
        new BezierCube({
            x: 0,
            y: 0
        }, {
            x: 1,
            y: 1
        }, 'linear', '#6190E8'),
        new BezierCube({
            x: 0.42,
            y: 0
        }, {
            x: 1,
            y: 1
        }, 'ease-in', '#6190E8'),
        new BezierCube({
            x: 0,
            y: 0
        }, {
            x: 0.58,
            y: 1
        }, 'ease-out', '#6190E8'),
        new BezierCube({
            x: 0.42,
            y: 0
        }, {
            x: 0.58,
            y: 1
        }, 'ease-in-out', '#6190E8'),
    ]
);

lib.delegate('click', function (e) {

    if (e.target.tagName.toLowerCase() === 'canvas') {
        let curve = e.target.getAttribute('data-curve');
        let points = curve.slice(curve.indexOf('(') + 1, curve.indexOf(')')).split(',');
        points = points.map(num => Number(num));

        compare.setBezierCurve({
            x: points[0],
            y: points[1]
        }, {
            x: points[2],
            y: points[3]
        });
    }

});

let play = document.querySelector('#play'),
    duration = document.querySelector('input[type="range"]'),
    dur = document.querySelector('#duration'),
    demo = document.querySelector('.demo'),
    t = duration.value;

let preview = new BezierCube({
        x: 0.34,
        y: 0.79
    }, {
        x: 0.66,
        y: 0.2
    }),
    compare = new BezierCube({
        x: 0,
        y: 0,
    }, {
        x: 1,
        y: 1
    }, 'linear', '#6190E8');

preview.appendTo(demo);
preview.addClass('block');

compare.appendTo(demo);
compare.addClass('block');
compare.addClass('compare');

dur.textContent = t + ' s';

duration.addEventListener('input', function (e) {
    t = duration.value;
    dur.textContent = t + ' s';
});

play.addEventListener('click', function (e) {

    preview.setStyleSheet('transition', t + 's ' + 'all ' + transition);
    compare.setStyleSheet('transition', t + 's ' + 'all ' + compare.getBezierCurve());

    preview.toggleClass('move');
    compare.toggleClass('move');

}, false);

draw();

preview.setBezierCurve(logicPoint[0], logicPoint[1]);


canvas.onmousedown = function (e) {
    const x = e.layerX,
        y = e.layerY;

    console.log(x, y);

    movePoint.forEach((p, index) => {
        if (x > p.x - 10 && x < p.x + 10 && y > p.y - 10 && y < p.y + 10) {
            idx = index;
        }
    });

    if (idx !== -1) {
        canvas.onmousemove = dragPointMove;
    }
}
canvas.onmouseup = function (e) {
    canvas.onmousemove = null;
    idx = -1;
}

function switchToLogic() {
    logicPoint[0] = calculate(movePoint[0]);
    logicPoint[1] = calculate(movePoint[1]);
}

function calculate(p) {
    return new Point(((p.x - 10) / 300).toFixed(2), ((450 - p.y) / 300).toFixed(2));
}

function draw() {

    ctx.clearRect(0, 0, 320, 600);

    drawAxis(ctx, origin, axisLength);

    drawLine(ctx, closePoint[0], movePoint[0]);
    drawLine(ctx, closePoint[1], movePoint[1]);
    drawLine(ctx, closePoint[0], closePoint[1], '#e5e5e5', 5);

    drawCurve(ctx, closePoint[0], closePoint[1], movePoint[0], movePoint[1]);


    closePoint.forEach(el => el.draw(ctx));

    movePoint.forEach(el => el.draw(ctx));

    switchToLogic();

    transition =
        `cubic-bezier(${logicPoint[0].x},${logicPoint[0].y},${logicPoint[1].x},${logicPoint[1].y})`;

    formula.textContent = transition;
}

function dragPointMove(e) {

    let newX = e.layerX,
        newY = e.layerY;


    newX = newX > origin.x + axisLength ? origin.x + axisLength : newX;
    newX = newX < origin.x ? origin.x : newX;

    movePoint[idx].x = newX;
    movePoint[idx].y = newY;

    // 重绘
    draw();

    preview.setBezierCurve(logicPoint[0], logicPoint[1]);

}

// 画坐标轴
function drawAxis(ctx, origin, length) {
    ctx.beginPath();
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x + length, origin.y);
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x, origin.y - length);
    ctx.strokeStyle = '#000';
    ctx.lineCap = 'round';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('Time', origin.x + axisLength, origin.y + 20);

    ctx.textAlign = 'left';
    ctx.fillText('Progression', origin.x, origin.y - axisLength - 10);
}

// 画连线
function drawLine(ctx, p0, p1, color, width) {

    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineWidth = width || 2;
    ctx.strokeStyle = color || 'gray';
    ctx.stroke();

}

// 画三次贝塞尔曲线
function drawCurve(ctx, p0, p1, m0, m1) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000';
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(m0.x, m0.y, m1.x, m1.y, p1.x, p1.y);
    ctx.stroke();
}