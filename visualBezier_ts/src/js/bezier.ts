
export interface Point {
    x: number,
    y: number
}

export interface Style {
    pointColor: string,
    lineColor: string,
    lineWidth: number,
    lineCap: string,
    radius: number
}

export interface Config {
    width: number;
    height: number;
    style: Style;
}

export class Bezier {

    private curveCanvas: HTMLCanvasElement | null;
    private curveCtx: CanvasRenderingContext2D | null;

    private canvas: HTMLCanvasElement | null;
    private ctx: CanvasRenderingContext2D | null;
    private config: Config;

    private points: Point[] = [];
    private movePoints: Point[][] = [];
    private startPoint: Point = { x: 0, y: 0 };
    private curveNextPoint: Point = { x: 0, y: 0 };
    private moveLineColor: string[] = [];

    private drawTimes: number = 200;
    private scale: number = 0;
    private isDrawing: boolean = false;

    constructor(canvas: HTMLCanvasElement, curveCanvas: HTMLCanvasElement, config?: Config) {

        if (canvas !== null && curveCanvas !== null) {
            this.canvas = canvas;
            this.curveCanvas = curveCanvas;
        } else {
            throw new Error("canvas is null");
        }

        this.ctx = this.canvas.getContext('2d');
        this.curveCtx = this.curveCanvas.getContext('2d');

        if (config) {
            this.config = config
        } else {
            this.config = {
                width: 600,
                height: 500,
                style: {
                    pointColor: '#000',
                    lineColor: '#DCDCDC',
                    lineWidth: 5,
                    lineCap: 'round',
                    radius: 5
                },
            };
        }

        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.curveCanvas.width = this.config.width;
        this.curveCanvas.height = this.config.height;

    }

    // 逐个点添加
    public add(point: Point): void {
        if (this.isDrawing) return;
        this.points.push(point);
        this.drawStaticPoint();
    }

    // 清除画布和点
    public clear(): void {
        if (this.isDrawing) return;

        let ctx = this.ctx as CanvasRenderingContext2D,
            curveCtx = this.curveCtx as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, this.config.width, this.config.height);
        curveCtx.clearRect(0, 0, this.config.width, this.config.height);

        this.points = [];
    }

    // 绘制的公共方法
    public draw(points?: Point[]): void {
        if (points) {
            this.points = points;
        }

        if (this.isDrawing || this.points.length <= 1) return;

        console.log('draw start:');
        this.startPoint = this.points[0];
        console.log(this.startPoint);
        this.movePoints = [];
        this.moveLineColor = [];

        this.scale = this.points.length - 1;

        for (let i = 0; i < this.scale; ++i) {
            this.moveLineColor.push(this.randomColor());
        }

        let ctx = this.ctx as CanvasRenderingContext2D,
            curveCtx = this.curveCtx as CanvasRenderingContext2D;

        ctx.clearRect(0, 0, this.config.width, this.config.height);
        curveCtx.clearRect(0, 0, this.config.width, this.config.height);

        this.isDrawing = true;

        this.animate();

    }

    // 绘制动画
    private animate(): void {

        let currentTimes: number = 0,
            self: Bezier = this,
            ctx = this.ctx as CanvasRenderingContext2D;

        function animation(): void {
            if (currentTimes >= self.drawTimes) {
                self.calculateMovePoint(1);
                self.movePoints.splice(0, self.movePoints.length);
                ctx.clearRect(0, 0, self.config.width, self.config.height);
                self.drawStaticPoint();
                self.drawCurve();
                self.startPoint = { x: 0, y: 0 };
                self.curveNextPoint = { x: 0, y: 0 };
                self.isDrawing = false;
                return;
            }
            self.drawStaticPoint();
            let startTime = new Date().getTime();
            self.calculateMovePoint(currentTimes / self.drawTimes);
            let delta = new Date().getTime() - startTime;
            console.log(`calculate: ${delta} ms`);
            startTime = new Date().getTime();
            self.drawCurve();
            delta = new Date().getTime() - startTime;
            console.log(`render: ${delta} ms`);
            self.movePoints.splice(0, self.movePoints.length);
            ++currentTimes;
            window.requestAnimationFrame(animation);
        }

        animation();

    }

    // 绘制固定点和连线
    private drawStaticPoint(): void {

        if (this.points.length === 0) return;

        let config: Config = this.config,
            style: Style = this.config.style,
            ctx: any = this.ctx,
            points: Point[] = this.points;

        ctx.clearRect(0, 0, config.width, config.height);

        ctx.beginPath();

        ctx.moveTo(points[0].x, points[0].y);
        ctx.strokeStyle = style.lineColor;
        ctx.lineWidth = style.lineWidth;
        ctx.lineCap = style.lineCap;

        // 绘制线
        points.forEach((p: Point) => {

            ctx.lineTo(p.x, p.y);
            ctx.stroke();

        });

        // 绘制点
        points.forEach((p: Point) => {

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.arc(p.x, p.y, style.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = style.pointColor;
            ctx.fill();

        });

    }

    // 计算动点新坐标
    private calculateMovePoint(percentage: number): void {

        let temp: Point[] = [],
            points: Point[] = this.points;

        for (let i = 0, len = points.length; i < len - 1; ++i) {
            let deltaX: number = points[i + 1].x - points[i].x,
                deltaY: number = points[i + 1].y - points[i].y;

            temp.push({
                x: deltaX * percentage + points[i].x,
                y: deltaY * percentage + points[i].y,
            });
        }

        while (temp.length !== 1) {

            let count = temp.length;

            for (let i = 0, len = temp.length; i < len - 1; ++i) {
                let deltaX: number = temp[i + 1].x - temp[i].x,
                    deltaY: number = temp[i + 1].y - temp[i].y;

                temp.push({
                    x: deltaX * percentage + temp[i].x,
                    y: deltaY * percentage + temp[i].y,
                });
            }

            this.movePoints.push([...temp.splice(0, count)]);

        }

        if (temp.length === 1) {
            console.log('your startpoint:');
            console.log(this.startPoint);
            if (this.curveNextPoint.x !== 0 && this.curveNextPoint.y !== 0) {
                this.startPoint = this.curveNextPoint;
            }
            this.curveNextPoint = temp[0];
        }
    }

    // 绘制
    private drawCurve(): void {

        let ctx = this.ctx as CanvasRenderingContext2D,
            curveCtx = this.curveCtx as CanvasRenderingContext2D;

        ctx.lineWidth = 3;

        // 绘制动点的直线
        this.movePoints.forEach((points: Point[], idx: number) => {

            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            ctx.strokeStyle = this.moveLineColor[idx];

            // 绘制连线
            points.forEach(p => {
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            });

            // 绘制端点
            
            points.forEach(p => {
                ctx.beginPath();
                ctx.fillStyle = this.moveLineColor[idx];
                ctx.arc(p.x, p.y, this.config.style.radius, 0, 2 * Math.PI, false);
                ctx.fill();
            });
            

        });

        // 绘制贝塞尔曲线
        curveCtx.beginPath();
        console.log('draw agian:');
        console.log(this.startPoint);
        curveCtx.moveTo(this.startPoint.x, this.startPoint.y);
        curveCtx.strokeStyle = 'red'; // !TODO 优化
        curveCtx.lineWidth = 2;
        curveCtx.lineTo(this.curveNextPoint.x, this.curveNextPoint.y);
        curveCtx.stroke();
    }

    // 随机生成颜色
    private randomColor(): string {
        let r: number = Math.floor(Math.random() * 256),
            g: number = Math.floor(Math.random() * 256),
            b: number = Math.floor(Math.random() * 256);

        return `rgba(${r},${g},${b},0.5)`;
    }

}
