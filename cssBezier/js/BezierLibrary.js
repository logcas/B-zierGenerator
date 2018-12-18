
(function() {

    class BezierLibrary {

        constructor(elem,cubes) {
            this.libs = cubes || [];
            this.elem = elem;
            this.init();
        }

        init() {

            this.libs.forEach(cube => {
                this.elem.appendChild(cube.elem());
            });

        }

        addCube(cube) {
            this.libs.push(cube);
            this.elem.appendChild(cube.elem());
            return this;
        }

        removeCube(index) {
            this.libs = this.libs.splice(index,1);
            this.elem.removeChild(this.elem.children[index]);
            return this;
        }

        delegate(ev, fn) {
            this.elem.addEventListener(ev,fn.bind(this),false);
            return this;
        }

    }

    window.BezierLibrary = BezierLibrary;

})(window)