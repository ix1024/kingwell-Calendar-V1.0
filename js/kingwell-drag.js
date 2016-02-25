/*
Drag功能;
说明：
-----接受三个参数，第鼠标点击拖动目标，第二个参数为拖动目标，第三个为Object对象，为设置参数。
使用方法：
-----new Drag(obj1,obj2,{dragOut : true ,opacity : 30}).start();
 */
(function (w) {
	if (!w.KW) {
		var tip = 'Cannot find the Kingwell Library!\nPlease go to the \'http://kingwell-leng.iteye.com/\' download the file.';
		throw(tip);
	}
	function Drag(oTarget, parent, arg) {
		var target = KW.isString(oTarget) ? KW.Dom.getId(oTarget) : oTarget;
		if (!KW.isElement(target)) {
			return;
		}
		var obj = arg || {}; 
		this.target = target;
		this.parent = KW.isString(parent) ? KW.Dom.getId(parent) : parent;
		this.target.style.cursor = 'move';
		this.config = {
			dragOut : obj.dragOut === false ? obj.dragOut : true,
			dragX : obj.dragX === false ? false : true,
			dragY : obj.dragY === false ? false : true,
			fixed : obj.fixed === true ? true : false,
			maxWidth : KW.isNumber(obj.maxWidth) ? obj.maxWidth :  false,
			minWidth : KW.isNumber(obj.minWidth) ? obj.minWidth :  false,
			maxHeight : KW.isNumber(obj.maxHeight) ? obj.maxHeight :  false,
			minHeight : KW.isNumber(obj.minHeight) ? obj.minHeight :  false,
			optacity : KW.isNumber(obj.opacity) ? obj.opacity : 50,
			callback : KW.isFunction(obj.callback) ? obj.callback : Function,
			move : KW.isFunction(obj.move) ? obj.move : Function
		};
		this.start();
	}
	Drag.prototype.start = function () {
		var self = this;
		KW.Event.add(this.target, 'mousedown', function (e) {
			var _this = KW.isElement(self.parent) ? self.parent : this,
			sTop = document.documentElement.scrollTop,
			sLeft = document.documentElement.scrollLeft,
			x = KW.getPage(e).x - parseInt(_this.offsetLeft),
			y = KW.getPage(e).y - parseInt(_this.offsetTop),
			maxWidth = (KW.isNumber(self.config.maxWidth) ? self.config.maxWidth : document.documentElement.clientWidth) + sLeft- parseInt(_this.offsetWidth),
			maxHeight = (KW.isNumber(self.config.maxHeight) ? self.config.maxHeight : document.documentElement.clientHeight) + sTop - parseInt(_this.offsetHeight),
			maxLeft = KW.isNumber(self.config.minWidth) ? self.config.minWidth : sLeft,
			maxTop = KW.isNumber(self.config.minHeight) ? self.config.minHeight : sTop;
			_this.style.zIndex = KW.Css.getMaxZindex() + 1;
			function mousemove(e) {
				KW.Css.setOpacity(_this, self.config.optacity);
				_this.style.margin = '0';
				if (KW.getBrowser.type.ie) {
					_this.setCapture();
				} else {
					w.captureEvents(e.mousemove);
				}
				if (self.config.dragOut === true) {
					if (self.config.dragX === true) {
						_this.style.left = KW.getPage(e).x - x + "px";
					}
					if (self.config.dragY === true) {
						_this.style.top = KW.getPage(e).y - y + "px";
					}
				} else {
					if (self.config.dragX === true) {
						_this.style.left = Math.max(Math.min(KW.getPage(e).x - x, maxWidth), maxLeft) + "px";
					}
					if (self.config.dragY === true) {
						_this.style.top = Math.max(Math.min(KW.getPage(e).y - y, maxHeight), maxTop) + "px";
					}
				}
				self.config.move(Math.max(Math.min(KW.getPage(e).x - x, maxWidth), maxLeft));
				KW.Event.stopDefault(e);
				return false;
			}
			function mouseup(e) {
				KW.Css.setOpacity(_this, 100);
				if (KW.getBrowser.type.ie) {
					_this.releaseCapture();
				} else {
					w.releaseEvents(e.mousemove);
				}
				KW.Event.remove(document, "mousemove", mousemove);
				if (KW.isFunction(self.config.callback)) {
					self.config.callback.call(_this);
				}
			}
			_this.style.position = self.config.fixed ? 'fixed' : 'absolute';
			KW.Event.add(document, 'mousemove', mousemove);
			KW.Event.add(document, 'mouseup', mouseup);
			KW.Event.stopDefault(e);
			return false;
		});
	};
	w.Drag = Drag;
})(window);
