!function r(s,h,a){function c(i,t){if(!h[i]){if(!s[i]){var o="function"==typeof require&&require;if(!t&&o)return o(i,!0);if(l)return l(i,!0);var e=new Error("Cannot find module '"+i+"'");throw e.code="MODULE_NOT_FOUND",e}var n=h[i]={exports:{}};s[i][0].call(n.exports,function(t){return c(s[i][1][t]||t)},n,n.exports,r,s,h,a)}return h[i].exports}for(var l="function"==typeof require&&require,t=0;t<a.length;t++)c(a[t]);return c}({1:[function(t,i,o){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var e=t("./bezier"),n=document.querySelector("#app"),r=document.querySelector("#draw"),s=document.querySelector("#clear"),h=new e.Bezier(n);n.onclick=function(t){var i=t.layerX,o=t.layerY;h.add({x:i,y:o})},r.onclick=function(){h.draw()},s.onclick=function(){h.clear()}},{"./bezier":2}],2:[function(t,i,o){"use strict";Object.defineProperty(o,"__esModule",{value:!0});var e=function(){function t(t,i){if(this.points=[],this.movePoints=[],this.targetPoints=[],this.moveLineColor=[],this.drawTimes=100,this.scale=0,this.isDrawing=!1,"object"!=typeof t)throw new Error("canvas is null");this.canvas=t,this.ctx=this.canvas.getContext("2d"),this.config=i||{width:600,height:500,style:{pointColor:"#000",lineColor:"#DCDCDC",lineWidth:5,lineCap:"round",radius:5}},this.canvas.width=this.config.width,this.canvas.height=this.config.height}return t.prototype.add=function(t){this.isDrawing||(this.points.push(t),this.drawStaticPoint())},t.prototype.clear=function(){this.isDrawing||(this.ctx.clearRect(0,0,this.config.width,this.config.height),this.points=[])},t.prototype.draw=function(t){if(t&&(this.points=t),!(this.isDrawing||this.points.length<=1)){this.targetPoints=[],this.movePoints=[],this.moveLineColor=[],this.scale=this.points.length-1;for(var i=0;i<this.scale;++i)this.moveLineColor.push(this.randomColor());this.ctx.clearRect(0,0,this.config.width,this.config.height),this.isDrawing=!0,this.animate()}},t.prototype.animate=function(){var i=0,o=this,e=this.ctx;!function t(){if(i>=o.drawTimes)return o.calculateMovePoint(1),o.movePoints.splice(0,o.movePoints.length),e.clearRect(0,0,o.config.width,o.config.height),o.drawStaticPoint(),o.drawCurve(),o.targetPoints.splice(0,o.targetPoints.length),void(o.isDrawing=!1);o.drawStaticPoint(),o.calculateMovePoint(i/o.drawTimes),o.drawCurve(),o.movePoints.splice(0,o.movePoints.length),++i,window.requestAnimationFrame(t)}()},t.prototype.drawStaticPoint=function(){if(0!==this.points.length){var t=this.config,i=this.config.style,o=this.ctx,e=this.points;o.clearRect(0,0,t.width,t.height),o.beginPath(),o.moveTo(e[0].x,e[0].y),o.strokeStyle=i.lineColor,o.lineWidth=i.lineWidth,o.lineCap=i.lineCap,e.forEach(function(t){o.lineTo(t.x,t.y),o.stroke()}),e.forEach(function(t){o.beginPath(),o.moveTo(t.x,t.y),o.arc(t.x,t.y,i.radius,0,2*Math.PI,!1),o.fillStyle=i.pointColor,o.fill()})}},t.prototype.calculateMovePoint=function(t){for(var i=[],o=this.points,e=0,n=o.length;e<n-1;++e){var r=o[e+1].x-o[e].x,s=o[e+1].y-o[e].y;i.push({x:r*t+o[e].x,y:s*t+o[e].y})}for(;1!==i.length;){var h=i.length;for(e=0,n=i.length;e<n-1;++e){r=i[e+1].x-i[e].x,s=i[e+1].y-i[e].y;i.push({x:r*t+i[e].x,y:s*t+i[e].y})}this.movePoints.push(i.splice(0,h).slice())}1===i.length&&this.targetPoints.push(i[0])},t.prototype.drawCurve=function(){var o=this,e=this.ctx;this.movePoints.forEach(function(t,i){e.beginPath(),e.moveTo(t[0].x,t[0].y),e.strokeStyle=o.moveLineColor[i],e.lineWidth=3,t.forEach(function(t){e.lineTo(t.x,t.y),e.stroke()}),t.forEach(function(t){e.beginPath(),e.fillStyle=o.moveLineColor[i],e.arc(t.x,t.y,o.config.style.radius,0,2*Math.PI,!1),e.fill()})}),e.beginPath(),e.moveTo(this.targetPoints[0].x,this.targetPoints[0].y),e.strokeStyle="red",e.lineWidth=2,this.targetPoints.forEach(function(t){e.lineTo(t.x,t.y),e.stroke()})},t.prototype.randomColor=function(){return"rgba("+Math.floor(256*Math.random())+","+Math.floor(256*Math.random())+","+Math.floor(256*Math.random())+",0.5)"},t}();o.Bezier=e},{}]},{},[1]);
//# sourceMappingURL=bundle.js.map
