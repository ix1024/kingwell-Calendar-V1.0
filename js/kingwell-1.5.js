/*
 *-----Name   : Kingwell Javascript Library Version 1.5;
 *-----Author : Kingwell Leng;
 *-----Date   : 2013-5-28;
 *-----E-mail : jinhua.leng@gmail.com;
说明：
Dom:
Css:
Event:
Ready:

 */
(function (w, d, undefined) {
	var location = w.location,
	de = d.documentElement,
	userAgent = navigator.userAgent.toLowerCase(),
	ie6 = /msie 6.0/.test(userAgent),
	opera = /opera/.test(userAgent),
	ie = /msie/.test(userAgent) && !opera,
	safari = /webkit/.test(userAgent),
	ff = /firefox/.test(userAgent);
	var Kingwell = function () {};
	Kingwell.prototype = {
		name : 'Kingwell Javascript Library Version 1.5',
		debug : true,
		namespaces : function (name) {
			if (!this.isString(name)) {
				return;
			}
			var parts = name.split('.'),
			current = this;
			for (var i in parts) {
				if (!current[parts[i]]) {
					current[parts[i]] = {};
				}
				current = current[parts[i]];
			}
			return this;
		},
		$ : function (o) {
			if (this.isString(o)) {
				var type = o.slice(0, 1),
				item = o.slice(1),
				result;
				switch (type) {
				case '#':
					result = d.getElementById(item);
					break;
				case '.':
					result = this.Dom.getClass(item);
					break;
				default:
					result = d.getElementsByTagName(o);
				}
				return result;
			} else {
				return o;
			}
		},
		ready : function (fn) {
			var self = this;
			if (!this.isFunction(fn)) {
				return this;
			}
			var init = function () {
				if (arguments.callee.done) {
					return;
				} else {
					arguments.callee.done = true;
				}
				fn.apply(self, arguments);
			};
			if (d.addEventListener) {
				d.addEventListener("DOMContentLoaded", init, false);
				return this;
			}
			if (safari) {
				var _timer = setInterval(function () {
						if (/loaded|complete/.test(d.readyState)) {
							clearInterval(_timer);
							init();
						}
					}, 10);
				return this;
			}
			d.write('<script id="_ie_onload" defer src="javascript:void(0)"><\/script>');
			var script = d.getElementById('_ie_onload');
			script.onreadystatechange = function () {
				if (this.readyState == 'complete') {
					init();
				}
			};
			return this;
		},
		Dom : {
			create : function (elem, obj) {
				var element = d.createElement(elem);
				for (var i in obj) {
					if (i === 'class' || i === 'className') {
						element.className = obj[i];
					} else {
						element.setAttribute(i, obj[i]);
					}
				}
				return element;
			},
			html : function (o, html) {
				var elem = this.getId(o);
				if (!KW.isElement(elem)) {
					return;
				}
				if (arguments.length > 1) {
					elem.innerHTML = html;
				} else {
					return elem.innerHTML;
				}
				return elem;
			},
			text : function (elem, text) {
				if (!KW.isElement(elem)) {
					return;
				}
				if (arguments.length > 1) {
					if (!ie) {
						elem.textContent = text;
					} else {
						elem.innerText = text;
					}
				} else {
					if (!ie) {
						return elem.textContent;
					} else {
						return elem.innerText;
					}
				}
				return elem;
			},
			val : function (elem, value) {
				if (KW.isForm(elem)) {
					if (arguments.length === 2) {
						elem.value = value;
					} else {
						return elem.value;
					}
				} else {
					return null;
				}
			},
			append : function (son, parent) {
				var sonElem = KW.isString(son) ? KW.Dom.getId(son) : son,
				par = KW.isString(parent) ? KW.Dom.getId(parent) : parent;
				if (!KW.isElement(par)) {
					par = d.body;
				}
				if (!KW.isElement(sonElem) || !KW.isElement(par)) {
					return;
				}
				par.appendChild(sonElem);
			},
			swapNode : function (a, b) {
				var n1 = KW.Dom.getId(a),
				n2 = KW.Dom.getId(b);
				if (KW.isElement(n1) && KW.isElement(n2)) {
					if (d.swapNode) {
						n1.swapNode(n2);
					} else {
						var next = n1.nextSibling;
						var parent = n1.parentNode;
						n2.parentNode.replaceChild(n1, n2);
						parent.insertBefore(n2, next);
					}
				} else {
					if (KW.debug) {
						KW.error('参数不合法');
					}
				}
			},
			insertBefore : function (n, o) {
				if (KW.isElement(n) && KW.isElement(o) && o.parentNode) {
					o.parentNode.insertBefore(n, o);
				}
			},
			insertAfter : function () {},
			nextNode : function (node) {
				node = KW.isString(node) ? KW.Dom.getId(node) : node;
				if (!KW.isElement(node)) {
					return null;
				}
				var nextNode = node.nextSibling;
				if (!nextNode) {
					return null;
				}
				while (true) {
					if (nextNode.nodeType === 1) {
						break;
					} else {
						if (nextNode.nextSibling) {
							nextNode = nextNode.nextSibling;
						} else {
							break;
						}
					}
				}
				return nextNode.nodeType === 1 ? nextNode : null;
			},
			addClass : function (o, str) {
				if (!KW.isElement(o)) {
					return;
				}
				var className = o.className,
				reg = eval("/^" + str + "$ | " + str + "$|^" + str + " | " + str + " /");
				if (reg.test(className)) {
					return;
				}
				if (className !== '') {
					o.className = className + " " + str;
				} else {
					o.className = str;
				}
			},
			removeClass : function (o, str) {
				if (!KW.isElement(o)) {
					return;
				}
				var className = o.className;
				if (KW.isEmpty(className)) {
					var reg = new RegExp(str, "g"),
					n = className.replace(reg, "");
					o.className = n;
				}
			},
			hasClass : function (o, str) {
				if (!KW.isElement(o)) {
					return;
				}
				var className = o.className,
				reg = eval("/^" + str + "$| " + str + "$|^" + str + " | " + str + " /");
				if (reg.test(className)) {
					return true;
				} else {
					return false;
				}
			},
			getId : function (id) {
				return KW.isString(id) ? d.getElementById(id) : id;
			},
			getClass : function (c, pd) {
				var all = pd ? d.getElementsByName(pd).getElementsByTagName("*") : d.getElementsByTagName("*"),
				n = [];
				for (var i = 0; i < all.length; i++) {
					if (this.hasClass(all[i], c)) {
						n.push(all[i]);
					}
				}
				return n;
			},
			setAttribute : function (o, obj) {
				if (KW.isElement(o) && KW.isPlainObject(obj)) {
					for (var i in obj) {
						if (i.toLowerCase() === 'class' || i.toLowerCase() === 'for') {
							o.setAttribute(i, obj[i]);
						} else {
							o[i] = obj[i];
						}
					}
				}
			},
			getAttribute : function (o, obj) {
				if (KW.isElement(o) && KW.isString(obj)) {
					if (obj.toLowerCase() === 'class' || obj.toLowerCase() === 'for') {
						return o.getAttribute(obj);
					} else {
						return o.obj;
					}
				}
			},
			remove : function (o) {
				if (o && o.parentNode) {
					o.parentNode.removeChild(o);
				}
			},
			focus : function (o) {
				if (KW.isElement(o)) {
					o.focus();
				}
			}
		},
		Css : {
			getComputedStyle : function (element, styleName) {
				var style = '';
				if (w.getComputedStyle) {
					style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue(styleName);
				} else if (element.currentStyle) {
					style = element.currentStyle[styleName];
				}
				return style;
			},
			setStyle : function (o, obj) {
				if (KW.isElement(o) && KW.isPlainObject(obj)) {
					for (var i in obj) {
						o.style[i] = obj[i];
					}
				}
			},
			setCss : function (tar, obj) {
				var o = KW.Dom.getId(tar);
				if (KW.isElement(o) && KW.isPlainObject(obj)) {
					var str = '';
					for (var i in obj) {
						str += i + ':' + obj[i] + '; ';
					}
					o.style.cssText += (' ;' + str);
				}
				return o;
			},
			setOpacity : function (obj, val) {
				if (!KW.isElement(obj)) {
					return;
				}
				var num = (val && val >= 0 && val <= 100) ? val : 100;
				if (d.addEventListener) {
					obj.style.opacity = num / 100;
				} else {
					obj.style.filter = 'alpha(opacity=' + num + ')';
				}
			},
			getMaxZindex : function (o) {
				var maxZindex = 0,
				obj = o ? o : '*',
				divs = d.getElementsByTagName(obj);
				for (var z = 0, len = divs.length; z < len; z++) {
					maxZindex = Math.max(maxZindex, divs[z].style.zIndex);
				}
				return maxZindex;
			}
		},
		Event : {
			add : function (obj, t, fn) {
				if (arguments.length < 3 && KW.debug) {
					KW.error('参数不合法：此处参数为3个，第一个为字符串或HTML，第二个为事件类型，第三个为Function');
					return;
				}
				var o = KW.Dom.getId(obj);
				if (!KW.isElement(o)) {
					return;
				}
				if (o.addEventListener) {
					o.addEventListener(t, fn, false);
				} else if (o.attachEvent) {
					o.attachEvent('on' + t, fn);
				} else {
					o['on' + t] = fn;
				}
			},
			remove : function (obj, t, fn) {
				var o = KW.Dom.getId(obj);
				if (!KW.isElement(o)) {
					return;
				}
				if (o.removeEventListener) {
					o.removeEventListener(t, fn, false);
				} else if (o.detachEvent) {
					o.detachEvent('on' + t, fn);
				} else {
					o['on' + t] = null;
				}
			},
			getEvent : function (ev) {
				return ev || w.event;
			},
			getTarget : function (ev) {
				return this.getEvent(ev).target || this.getEvent(ev).srcElement;
			},
			stopPropagation : function (e) {
				if (w.event) {
					return this.getEvent(e).cancelBubble = true;
				} else {
					return this.getEvent(e).stopPropagation();
				}
			},
			stopDefault : function (e) {
				if (w.event) {
					return this.getEvent().returnValue = false;
				} else {
					return this.getEvent(e).preventDefault();
				}
			},
			which : function (e) {
				return this.getEvent(e).keyCode;
			}
		},
		is : function (o, type) {
			var obj = Object.prototype.toString.call(o);
			if (arguments.length === 2) {
				return obj === '[object ' + type + ']';
			} else {
				return obj.slice(7, -1).toLowerCase();
			}
		},
		isArray : function (o) {
			return this.is(o, 'Array');
		},
		isObject : function (o) {
			return this.is(o, 'Object');
		},
		isFunction : function (o) {
			return this.is(o, 'Function');
		},
		isNumber : function (o) {
			return this.is(o, 'Number');
		},
		isString : function (o) {
			return this.is(o, 'String');
		},
		isElement : function (o) {
			return (o && o.nodeName) ? true : false;
		},
		isForm : function (obj) {
			var o = this.Dom.getId(obj);
			return this.isElement(o) && (o.tagName.toLowerCase() === 'input' || o.tagName.toLowerCase() === 'textarea');
		},
		getPage : function (e) {
			if (ie) {
				return {
					x : this.Event.getEvent().clientX + d.body.scrollLeft + d.documentElement.scrollLeft,
					y : this.Event.getEvent().clientY + d.body.scrollTop + d.documentElement.scrollTop
				};
			} else {
				return {
					x : this.Event.getEvent(e).pageX,
					y : this.Event.getEvent(e).pageY
				};
			}
		},
		getBrowser : {
			viewSize : {
				width : document.documentElement.clientWidth,
				height : (w.innerHeight || (de && de.clientHeight) || d.body.clientHeight)
			},
			type : {
				ie : ie,
				ie6 : ie6,
				ff : ff,
				opera : opera,
				safari : safari
			}
		},
		getBox : function (o) {
			var obj = this.$(o);
			return {
				left : parseInt(obj.offsetLeft, 10),
				top : parseInt(obj.offsetTop, 10),
				width : parseInt(obj.offsetWidth, 10),
				height : parseInt(obj.offsetHeight, 10)
			};
		},
		getPosition : function (obj) {
			var o = this.Dom.getId(obj);
			if (!KW.isElement(o)) {
				return null;
			}
			var t = parseInt(o.offsetTop, 10),
			l = parseInt(o.offsetLeft, 10),
			w = parseInt(o.offsetWidth, 10),
			h = parseInt(o.offsetHeight, 10);
			while (o = o.offsetParent) {
				t += parseInt(o.offsetTop, 10);
				l += parseInt(o.offsetLeft, 10);
			}
			return {
				left : l,
				top : t,
				width : w,
				height : h
			};
		},
		getQueryString : function (name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"),
			r = location.search.substr(1).match(reg);
			if (r !== null)
				return unescape(r[2]);
			return null;
		},
		isPlainObject : function (obj) {
			return (!obj || !this.isObject(obj) || obj.nodeType || obj.setInterval) ? false : true;
		},
		getScript : function (o, callback) {
			var head = d.getElementsByTagName('head')[0],
			self = this,
			timeout,
			load = function (src, a) {
				var script = self.Dom.create('script', {
						type : 'text/javascript',
						src : src
					});
				KW.Dom.append(script, head);
				if (script.readyState) {
					script.onreadystatechange = function () {
						if (script.readyState === 'loaded' || script.readyState === 'complete') {
							script.onreadystatechange = null;
							if (a && srcArray.length > 1) {
								srcArray.shift();
								timeout = setTimeout(function () {
										load(srcArray[0], true);
									}, 1);
							} else {
								if (KW.isFunction(callback)) {
									callback.call(KW);
								}
							}
						}
					};
				} else {
					script.onload = function () {
						if (a && srcArray.length > 1) {
							srcArray.shift();
							timeout = setTimeout(function () {
									load(srcArray[0], true);
								}, 1);
						} else {
							if (KW.isFunction(callback)) {
								callback.call(KW);
							}
						}
					};
				}
			};
			if (self.isString(o)) {
				load(o);
			} else if (self.isArray(o)) {
				var srcArray = o;
				load(srcArray[0], true);
			}
		},
		getJSON : function () {},
		ajax : function (obj) {
			var o = obj || {};
			if (!o.url) {
				return;
			}
			var method = o.type || "GET",
			async = o.async || true,
			data = (o.type && o.type.topUpperCase() === 'POST') ? o.date : null,
			XHR = w.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
			XHR.open(method, o.url, async);
			XHR.setRequestHeader('If-Modified-Since', 'Thu, 06 Apr 2006 00:00: 00 GMT');
			XHR.send(data);
			if (KW.isFunction(o.sendBefore)) {
				o.sendBefore();
			}
			XHR.onreadystatechange = function () {
				if (XHR.readyState == 4) {
					if (XHR.status >= 200 && XHR.status < 300 || XHR.status == 304) {
						if (KW.isFunction(o.success)) {
							o.success.call(XHR, {
								text : XHR.responseText,
								xml : XHR.responseXML
							});
						}
					} else {
						if (KW.isFunction(o.error)) {
							o.error.call(XHR);
						}
					}
				}
			};
		},
		Storage : {
			userDataStroage : {
				init : function () {
					var memory = d.createElement('div');
					memory.id = "_memory";
					memory.style.display = 'none';
					memory.style.behavior = 'url(#default#userData)';
					d.body.appendChild(memory);
					return memory;
				},
				setItem : function (key, value) {
					var memory = this.init();
					memory.setAttribute(key, value);
					memory.save('UserDataStorage');
				},
				getItem : function (key) {
					var memory = this.init();
					memory.load('UserDataStorage');
					return memory.getAttribute(key) || null;
				},
				removeItem : function (key) {
					var memory = this.init();
					memory.removeAttribute(key);
					memory.save('UserDataStorage');
				}
			},
			setItem : function (name, value) {
				if (w.localStorage) {
					localStorage.setItem(name, value);
				} else if (w.ActiveXObjec) {
					this.userDataStroage.setItem(name, value);
				} else {
					KW.Cookie.setCookie(name, value);
				}
			},
			getItem : function (name) {
				if (w.localStorage) {
					return localStorage.getItem(name);
				} else if (w.ActiveXObjec) {
					return this.userDataStroage.getItem(name);
				} else {
					return KW.Cookie.getCookie(name);
				}
			},
			removeItem : function (name) {
				if (w.localStorage) {
					localStorage.removeItem(name);
				} else if (w.ActiveXObjec) {
					this.userDataStroage.removeItem(name);
				} else {
					KW.cookie.removeCookie(name);
				}
			}
		},
		Cookie : {
			setCookie : function (sName, sValue, oExpires, sPath, sDomain, bSecure) {
				var sCookie = sName + '=' + encodeURIComponent(sValue);
				if (oExpires) {
					var date = new Date();
					date.setTime(date.getTime() + oExpires * 60 * 60 * 1000);
					sCookie += '; expires=' + date.toUTCString();
				}
				if (sPath) {
					sCookie += '; path=' + sPath;
				}
				if (sDomain) {
					sCookie += '; domain=' + sDomain;
				}
				if (bSecure) {
					sCookie += '; secure';
				}
				d.cookie = sCookie;
			},
			getCookie : function (sName) {
				var sRE = '(?:; )?' + sName + '=([^;]*)';
				var oRE = new RegExp(sRE);
				if (oRE.test(d.cookie)) {
					return decodeURIComponent(RegExp.$1);
				} else {
					return null;
				}
			},
			removeCookie : function (sName, sPath, sDomain) {
				this.setCookie(sName, '', new Date(0), sPath, sDomain);
			},
			clearAllCookie : function () {
				var cookies = d.cookie.split(";"),
				len = cookies.length;
				for (var i = 0; i < len; i++) {
					var cookie = cookies[i];
					var eqPos = cookie.indexOf("=");
					var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
					name = name.replace(/^\s*|\s*$/, "");
					d.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
				}
			}
		},
		trim : function (str) {
			if (this.isString(str)) {
				var re = /^\s*(.*?)\s*$/;
				return str.replace(re, '$1');
			} else {
				return str;
			}
		},
		escape : function (str) {
			var s = "";
			if (str.length === 0) {
				return "";
			}
			s = str.replace(/&/g, "&amp;");
			s = s.replace(/</g, "&lt;");
			s = s.replace(/>/g, "&gt;");
			s = s.replace(/ /g, "&nbsp;");
			s = s.replace(/\'/g, "&#39;");
			s = s.replace(/\"/g, "&quot;");
			return s;
		},
		error : function (e) {
			if (!this.debug) {
				return;
			}
			var info = 'The Error Message:\n';
			if (console) {
				console.error(e);
			} else {
				alert(info + e);
			}
		}
	};
	w.KW = new Kingwell();
})(window, document);
