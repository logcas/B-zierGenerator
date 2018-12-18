(function () {

    const WIDTH = 600,
        HEIGHT = 500;

    let canvas = document.querySelector('#app'),
        ctx = canvas.getContext('2d'),
        drawBtn = document.querySelector('#draw'),
        clearBtn = document.querySelector('#clear');

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    const Points = [], // 固定点
        MovePoints = [], // 动点
        TargetPoints = [], // 目标点集
        t = 200; // 绘制次数

    let scale = 0; // 阶数

    // 固定点样式
    const config = {
        pointColor: '#000',
        lineColor: '#DCDCDC',
        lineWidth: 10,
        radius: 5
    }

    // 动直线颜色
    const moveLineColor = [];

    // 绘制固定点并连接
    const drawPoint = function drawStaticPointsAndLink() {

        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        ctx.beginPath();

        ctx.moveTo(Points[0].x, Points[0].y);
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = config.lineWidth;

        for (let i = 1, len = Points.length; i < len; ++i) {
            ctx.lineTo(Points[i].x, Points[i].y);
            ctx.stroke();
        }

        Points.forEach(p => {
            ctx.beginPath();
            let x = p.x,
                y = p.y;
            ctx.moveTo(x, y);
            ctx.arc(x, y, config.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = config.pointColor;
            ctx.fill();
        });

    }

    // 获取动点新的坐标
    // @params {percentage} 绘制百分比
    const getMovePoint = function (percentage) {
        const temp = [];
        for (let i = 0, len = Points.length; i < len - 1; ++i) {
            let deltaX = Points[i + 1].x - Points[i].x,
                deltaY = Points[i + 1].y - Points[i].y;

            temp.push({
                x: deltaX * percentage + Points[i].x,
                y: deltaY * percentage + Points[i].y
            });
        }

        while (temp.length !== 1) {

            let count = temp.length;

            for (let i = 0, len = temp.length; i < len - 1; i++) {
                let deltaX = temp[i + 1].x - temp[i].x,
                    deltaY = temp[i + 1].y - temp[i].y;

                temp.push({
                    x: deltaX * percentage + temp[i].x,
                    y: deltaY * percentage + temp[i].y
                });
            }

            MovePoints.push([...temp.splice(0, count)]);
        }

        if (temp.length === 1) {
            TargetPoints.push(temp[0]);
        }

    }

    const randomColor = function () {
        let r = Math.floor(Math.random() * 256),
            g = Math.floor(Math.random() * 256),
            b = Math.floor(Math.random() * 256);

        return `rgba(${r},${g},${b},0.5)`;
    }

    // 绘制直线
    const drawLine = function () {

        // 绘制动点的直线
        MovePoints.forEach((points, idx) => {
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.strokeStyle = moveLineColor[idx]
            ctx.lineWidth = 3;
            points.forEach(p => {
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            });
        });

        // 绘制贝塞尔曲线
        ctx.beginPath();
        ctx.moveTo(TargetPoints[0].x,TargetPoints[0].y);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 4;
        TargetPoints.forEach(p => {
            ctx.lineTo(p.x,p.y);
            ctx.stroke();
        });

    }

    const animate = function () {

        let current = 0;

        function animation() {
            ++current;
            if (current >= t) {
                MovePoints.splice(0,MovePoints.length);
                ctx.clearRect(0,0,WIDTH,HEIGHT);
                drawPoint();
                drawLine();
                TargetPoints.splice(0,TargetPoints.length);
                return;
            }
            drawPoint();
            getMovePoint(current / t);
            drawLine();
            MovePoints.splice(0,MovePoints.length);
            window.requestAnimationFrame(animation);
        }

        animation();

    }

    canvas.onclick = function (e) {
        let x = e.layerX,
            y = e.layerY;

        Points.push({
            x,
            y
        });

        scale = Points.length - 1;

        for (let i = 0; i < scale; ++i) {
            moveLineColor.push(randomColor());
        }

        drawPoint();
    }

    drawBtn.onclick = function (e) {
        if(Points.length < 2) return;
        animate();
    }

    clearBtn.onclick = function (e) {
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        Points.splice(0,Points.length);
    }

})()