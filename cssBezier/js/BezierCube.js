(function () {

    class BezierCube {

        constructor(m0, m1, name, color) {

            this._points = [
                m0,
                m1,
            ];

            this.width = 80;
            this.height = 80;

            this.canvas = document.createElement('canvas');
            this.canvas.height = this.height;
            this.canvas.width = this.width;
            this.canvas.className = 'cube';
            this.canvas.setAttribute('data-curve', 'cubic-bezier(' + this._points[0].x + ',' + this._points[0].y + ',' + this._points[1].x + ',' + this._points[1].y + ')');
            this.ctx = this.canvas.getContext('2d');

            this.parent = null;

            this.name = name || '(' + this._points[0].x + ',' + this._points[0].y + ',' + this._points[1].x + ',' + this._points[1].y + ')';
            this.color = color || '#e6d';

            this.init();

        }

        init() {

            let canvas = this.canvas,
                ctx = this.ctx;

            canvas.style.borderRadius = '10px';
            canvas.style.margin = '5px';

            this.drawCurve();

        }

        getBezierCurve() {
            return this.canvas.getAttribute('data-curve');
        }

        setBezierCurve(m0, m1) {
            this._points[0].x = m0.x;
            this._points[0].y = m0.y;
            this._points[1].x = m1.x;
            this._points[1].y = m1.y;
            this.canvas.setAttribute('data-curve', 'cubic-bezier(' + this._points[0].x + ',' + this._points[0].y + ',' + this._points[1].x + ',' + this._points[1].y + ')');
            this.drawCurve();
        }

        getPoints() {
            return this._points;
        }

        static transformPoint(p) {
            return {
                x: 60 * p.x + 10,
                y: 70 - 60 * p.y,
            };
        }

        drawCurve() {

            let ctx = this.ctx,
                m0 = BezierCube.transformPoint(this._points[0]),
                m1 = BezierCube.transformPoint(this._points[1]),
                p0 = {
                    x: 10,
                    y: 70
                },
                p1 = {
                    x: 70,
                    y: 10
                };

            ctx.clearRect(0,0,this.width,this.height);

            ctx.beginPath();
            ctx.rect(0, 0, this.width, this.height);
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.moveTo(p0.x, p0.y);
            ctx.bezierCurveTo(m0.x, m0.y, m1.x, m1.y, p1.x, p1.y);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.moveTo(m0.x, m0.y);
            ctx.lineTo(p0.x, p0.y);
            ctx.lineWidth = 1;
            ctx.stroke();

            ctx.moveTo(m1.x, m1.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.lineWidth = 1;
            ctx.stroke();

        }

        appendTo(node) {
            this.parent = node;
            node.appendChild(this.canvas);
        }

        addClass(className) {
            this.canvas.className += ' ' + className;
        }

        removeClass(className) {
            let kclass = this.canvas.className.split(' ');
            if (kclass.length === 0) return;
            kclass = kclass.filter(c => {
                return c !== className;
            });
            this.canvas.className = kclass.join(' ');
        }

        toggleClass(className) {
            let exist = false,
                kclass = this.canvas.className.split(' ');

            kclass.forEach(c => {
                if (c === className) {
                    exist = true;
                }
            });

            if (!exist) {
                this.addClass(className);
            } else {
                this.removeClass(className);
            }
        }

        setStyleSheet(attr, value) {
            this.canvas.style[attr] = value;
        }

        elem() {
            return this.canvas;
        }



    }

    window.BezierCube = BezierCube;

})(window);