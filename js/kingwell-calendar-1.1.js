/*
 * Name : Kingwell Calendar Ver 1.0
 * Date : 2013-06-04
 * Email: jinhua.leng#gamil.com
 */
(function (w) {
	if (!w.KW) {
		var tip = 'Cannot find the Kingwell Library!\nPlease go to the \'http://kingwell-leng.iteye.com/\' download the file.';
		throw(tip);
	}
	KW.namespaces('Date');
	KW.Date.padZero = function (n) {
		return n < 10 ? '0' + n : n;
	};
	KW.Date.isLeapYear = function (year) {
		return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
	};
	KW.Date.getMonthDay = function (month, year) {
		var m = month + 1;
		if (m === 4 || m === 6 || m === 9 || m === 11) {
			return 30;
		} else if (m === 2) {
			return this.isLeapYear(year) ? 29 : 28;
		} else {
			return 31;
		}
	};
	function Calendar(id, obj) {
		var that = this,
		o = obj || {};
		this.num = 0;
		this.tar = KW.Dom.getId(id);
		this.state = true;
		this.create = KW.Dom.create;
		this.append = KW.Dom.append;
		this.add = KW.Event.add;
		this.rem = KW.Event.remove;
		this.name = 'Calendar';
		this.language = o.language || 'en';
		this.DATE = new Date();
		this.year = this.DATE.getFullYear();
		this.month = this.DATE.getMonth();
		this.date = this.DATE.getDate();
		this.y = this.lang().title[0];
		this.m = this.lang().title[1];
		this.d = this.lang().title[2];
		this.box = this.create('div', {
				'class' : this.name + '-box ' + this.name + '-default'
			});
		if (KW.isString(obj.addClass)) {
			KW.Dom.addClass(this.box, obj.addClass);
		}
		this.title = this.create('div', {
				'class' : this.name + '-title'
			});
		this.now = this.create('div', {
				'class' : this.name + '-now'
			});
		this.toolbar = this.create('div', {
				'class' : this.name + '-toolbar'
			});
		this.clear = this.create('span', {
				'class' : this.name + '-clear'
			});
		this.today = this.create('span', {
				'class' : this.name + '-goToday'
			});
		this.close = this.create('span', {
				'class' : this.name + '-close'
			});
		this.leftBox = this.create('div', {
				'class' : this.name + '-leftBox'
			});
		this.rightBox = this.create('div', {
				'class' : this.name + '-rightBox'
			});
		this.prevYear = this.create('span', {
				'class' : this.name + '-prevYear'
			});
		this.prevMonth = this.create('span', {
				'class' : this.name + '-prevMonth'
			});
		this.nextYear = this.create('span', {
				'class' : this.name + '-nextYear'
			});
		this.nextMonth = this.create('span', {
				'class' : this.name + '-nextMonth'
			});
		this.clear.innerHTML = this.lang().toolbar[0];
		this.today.innerHTML = this.lang().toolbar[1];
		this.close.innerHTML = this.lang().toolbar[2];
		this.prevYear.innerHTML = '≤';
		this.prevMonth.innerHTML = '<&nbsp;';
		this.nextYear.innerHTML = '≥';
		this.nextMonth.innerHTML = '>';
		this.table = this.create('table', {
				'class' : this.name + '-table'
			});
		this.thead = this.create('thead', {
				'class' : this.name + '-thead'
			});
		this.thead.insertRow(0);
		this.tr = this.create('tr');
		for (var w = 0; w < this.lang().week.length; w++) {
			var th = this.create('th');
			th.innerHTML = this.lang().week[w];
			this.append(th, this.tr);
		}
		this.append(this.tr, this.thead);
		this.tbody = this.create('tbody', {
				'class' : this.name + '-tbody'
			});
		KW.Dom.val(that.tar, '');
		this.add(this.tar, 'click', function (e) {
			that.init();
			KW.Event.stopPropagation(e);
		});
	}
	Calendar.prototype = {
		init : function () {
			var self = this,
			d = new Date();
			this.creates();
			this.event();
			this.update({
				year : d.getFullYear(),
				month : d.getMonth()
			});
			this.state = false;
			function remove() {
				self.remove();
				self.rem(document, 'click', remove);
			}
			self.add(document, 'click', remove);
		},
		creates : function () {
			this.append(this.prevYear, this.leftBox);
			this.append(this.prevMonth, this.leftBox);
			this.append(this.leftBox, this.title);
			this.append(this.nextMonth, this.rightBox);
			this.append(this.nextYear, this.rightBox);
			this.append(this.rightBox, this.title);
			this.append(this.now, this.title);
			this.append(this.title, this.box);
			this.append(this.thead, this.table);
			this.append(this.tbody, this.table);
			this.append(this.table, this.box);
			this.append(this.clear, this.toolbar);
			this.append(this.today, this.toolbar);
			this.append(this.close, this.toolbar);
			this.append(this.toolbar, this.box);
			this.append(this.box);
			var pos = KW.getPosition(this.tar);
			KW.Css.setCss(this.box, {
				top : pos.top + pos.height + 2 + 'px',
				left : pos.left + 'px'
			});
		},
		update : function (options) {
			var self = this,
			ops = options || {};
			this.DATE.setYear(KW.isNumber(ops.year) ? ops.year : this.year);
			this.DATE.setMonth(KW.isNumber(ops.month) ? ops.month : this.month);
			this.DATE.setDate(KW.isNumber(ops.date) ? ops.date : this.date);
			var _y = this.DATE.getFullYear(),
			_m = this.DATE.getMonth(),
			_d = this.DATE.getDate(),
			days = KW.Date.getMonthDay(_m, _y),
			firstDay = new Date(_y, _m, 1).getDay();
			self.year = _y;
			self.month = _m;
			for (var t = this.tbody.childNodes.length; t > 0; t--) {
				this.tbody.removeChild(this.tbody.lastChild);
			}
			this.now.innerHTML = _y + self.y + KW.Date.padZero(_m + 1) + self.y + KW.Date.padZero(_d) + self.d;
			var f = 1,
			num,
			now,
			od,
			fd,
			nd,
			result,
			reY,
			reM,
			reD;
			function loop() {
				if (arguments[0] === 0) {
					if (_m === 0) {
						reY = _y - 1;
						reM = 12;
						reD = oldDay;
					} else {
						reY = _y;
						reM = _m;
						reD = oldDay;
					}
				} else if (arguments[0] === 1) {
					if (_m === 11) {
						reY = _y + 1;
						reM = 1;
						reD = f;
					} else {
						reY = _y;
						reM = _m + 2;
						reD = f;
					}
				} else {
					reY = _y;
					reM = _m + 1;
					reD = now;
				}
				result = reY + '-' + KW.Date.padZero(reM) + '-' + KW.Date.padZero(reD);
				self.tbody.rows[i].cells[j].title = result;
				(function (n) {
					self.add(self.tbody.rows[i].cells[j], 'click', function () {
						self.tar.value = n;
						self.remove();
					});
				})(result);
			}
			for (var i = 0; i < 6; i++) {
				this.tbody.insertRow(i);
				for (var j = 0; j < 7; j++) {
					num = i * 7 + j;
					now = num - firstDay + 1;
					this.tbody.rows[i].insertCell(j);
					var oldDay = Math.abs(firstDay - j - KW.Date.getMonthDay(_m - 1, _y) - 1);
					if (j === 0 || j === 6) {
						KW.Dom.addClass(this.tbody.rows[i].cells[j], this.name + '-holiday');
					}
					if (now === _d) {
						KW.Dom.addClass(this.tbody.rows[i].cells[j], this.name + '-today');
					}
					if (num < firstDay) {
						od = '<div class="' + this.name + '-notThisMonth ' + this.name + '-cell">' + oldDay + '</div>';
						this.tbody.rows[i].cells[j].innerHTML = od;
						loop(0);
					} else if (num >= days + firstDay) {
						fd = '<div class="' + this.name + '-notThisMonth ' + this.name + '-cell">' + f + '</div>';
						this.tbody.rows[i].cells[j].innerHTML = fd;
						loop(1);
						f++;
					} else {
						nd = '<div class="' + this.name + '-thisMonth ' + this.name + '-cell">' + now + '</div>';
						this.tbody.rows[i].cells[j].innerHTML = nd;
						loop();
					}
				}
			}
		},
		event : function () {
			if (!this.state) {
				return;
			}
			var self = this;
			self.add(self.box, 'click', function (e) {
				KW.Event.stopPropagation(e);
			});
			self.add(self.tar, 'click', function (e) {
				KW.Event.stopPropagation(e);
			});
			self.add(self.prevYear, 'click', function () {
				self.year--;
				self.update({
					year : self.year,
					date : 1
				});
			});
			self.add(self.prevMonth, 'click', function () {
				self.month--;
				self.update({
					month : self.month,
					date : 1
				});
			});
			self.add(self.nextYear, 'click', function () {
				self.year++;
				self.update({
					year : self.year,
					date : 1
				});
			});
			self.add(self.nextMonth, 'click', function () {
				self.month++;
				self.update({
					month : self.month,
					date : 1
				});
			});
			self.add(self.clear, 'click', function () {
				self.tar.value = '';
			});
			self.add(self.today, 'click', function () {
				var t = new Date();
				self.update({
					year : t.getFullYear(),
					month : t.getMonth(),
					date : t.getDate()
				});
			});
			self.add(self.close, 'click', function () {
				self.remove();
			});
		},
		remove : function () {
			KW.Dom.remove(this.box);
		},
		lang : function () {
			this.num++;
			if (this.language === 'en') {
				return {
					week : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
					title : ['-', '-', ''],
					toolbar : ['Clear', 'Today', 'Close']
				};
			} else {
				return {
					week : ['日', '一', '二', '三', '四', '五', '六'],
					title : ['年', '月', '日'],
					toolbar : ['清空', '回到今天', '关闭']
				};
			}
		}
	};
	function Time(id, obj) {
		var that = this,
		ops = obj || {};
		this.config = {
			left : (KW.isNumber(ops.left) ? ops.left : 0),
			top : (KW.isNumber(ops.top) ? ops.top : 0)
		};
		this.state = true;
		this.tar = KW.Dom.getId(id);
		this.language = KW.isString(obj.language) ? obj.language : this.language;
		this.date = new Date();
		this.hour = this.date.getHours();
		this.minute = this.date.getMinutes();
		this.box = this.create('div', {
				'class' : this.name + '-timeBox'
			});
		this.title = this.create('div', {
				'class' : this.name + '-timeTitle',
				title : this.version
			});
		this.titleInfo = this.create('span', {
				'class' : this.name + '-timeTitleInfo'
			});
		this.titleInfo.innerHTML = this.lan().current;
		this.hours = this.create('span');
		this.line = this.create('span');
		this.line.innerHTML = this.separate;
		this.hours.innerHTML = KW.Date.padZero(this.hour);
		this.minutes = this.create('span');
		this.minutes.innerHTML = KW.Date.padZero(this.minute);
		this.hourBox = this.create('div', {
				'class' : this.name + '-hourBox'
			});
		this.hourText = this.create('div', {
				'class' : this.name + '-hourText'
			});
		this.hourText.innerHTML = this.lan().hour;
		this.hourLine = this.create('div', {
				'class' : this.name + '-hourLine'
			});
		this.hourIco = this.create('div', {
				'class' : this.name + '-hourIco'
			});
		this.minuteBox = this.create('div', {
				'class' : this.name + '-minuteBox'
			});
		this.minuteText = this.create('div', {
				'class' : this.name + '-minuteText'
			});
		this.minuteText.innerHTML = this.lan().minute;
		this.minuteLine = this.create('div', {
				'class' : this.name + '-minuteLine'
			});
		this.minuteIco = this.create('div', {
				'class' : this.name + '-minuteIco'
			});
		this.toolbar = this.create('div', {
				'class' : this.name + '-toolbar'
			});
		this.ok = this.create('span', {
				'class' : this.name + '-ok'
			});
		this.ok.innerHTML = this.lan().ok;
		this.current = this.create('span', {
				'class' : this.name + '-current'
			});
		this.current.innerHTML = this.lan().currentTime;
		KW.Dom.val(this.tar, '');
		this.add(this.tar, 'click', function (e) {
			that.init();
			KW.Event.stopPropagation(e);
		});
	}
	Time.prototype = {
		version : 'Kingwell Time version 1.1',
		name : 'kwTime',
		separate : ':',
		language : 'en',
		append : KW.Dom.append,
		create : KW.Dom.create,
		add : KW.Event.add,
		rem : KW.Event.remove,
		creates : function () {
			this.append(this.titleInfo, this.title);
			this.append(this.hours, this.title);
			this.append(this.line, this.title);
			this.append(this.minutes, this.title);
			this.append(this.hourLine, this.hourBox);
			this.append(this.hourIco, this.hourBox);
			this.append(this.minuteLine, this.minuteBox);
			this.append(this.minuteIco, this.minuteBox);
			this.append(this.title, this.box);
			this.append(this.hourText, this.box);
			this.append(this.hourBox, this.box);
			this.append(this.minuteText, this.box);
			this.append(this.minuteBox, this.box);
			this.append(this.current, this.toolbar);
			this.append(this.ok, this.toolbar);
			this.append(this.toolbar, this.box);
			this.append(this.box);
		},
		event : function () {
			if (!this.state) {
				return;
			}
			var self = this;
			dragY = false,
			dragOut = false,
			hourBox = KW.getBox(this.hourBox),
			minuteBox = KW.getBox(this.minuteBox),
			hourIco = KW.getBox(this.hourIco),
			minuteIco = KW.getBox(this.minuteIco);
			new Drag(this.hourIco, this.hourIco, {
				dragOut : dragOut,
				dragY : dragY,
				maxWidth : hourBox.width,
				move : function (x) {
					self.hours.innerHTML = KW.Date.padZero(Math.ceil(((x / (hourBox.width - hourIco.width)).toFixed(2)) * 24));
				}
			});
			new Drag(this.minuteIco, this.minuteIco, {
				dragOut : dragOut,
				dragY : dragY,
				maxWidth : minuteBox.width,
				move : function (x) {
					self.minutes.innerHTML = KW.Date.padZero(Math.ceil(((x / (minuteBox.width - minuteIco.width)).toFixed(2)) * 59));
				}
			});
			this.add(this.box, 'click', function (e) {
				KW.Event.stopPropagation(e);
			});
			this.add(this.ok, 'click', function () {
				var result = KW.Dom.text(self.hours) + self.separate + KW.Dom.text(self.minutes);
				KW.Dom.val(self.tar, result);
				self.remove();
			});
			this.add(this.current, 'click', function () {
				var currentTime = new Date(),
				hour = currentTime.getHours(),
				minute = currentTime.getMinutes();
				KW.Dom.text(self.hours, KW.Date.padZero(hour));
				KW.Dom.text(self.minutes, KW.Date.padZero(minute));
				self.setPosition(hour, minute);
			});
		},
		setting : function () {
			var self = this;
			var pos = KW.getPosition(this.tar);
			KW.Css.setCss(this.box, {
				left : pos.left + self.config.left + 'px',
				top : pos.top + pos.height + self.config.top + 'px'
			});
			this.setPosition(self.hour, self.minute);
		},
		setPosition : function (h, m) {
			var hourBox = KW.getBox(this.hourBox);
			var minuteBox = KW.getBox(this.minuteBox);
			var hourIco = KW.getBox(this.hourIco);
			var minuteIco = KW.getBox(this.minuteIco);
			var hourIcoLeft = Math.floor((h * (hourBox.width - hourIco.width)) / 24);
			var minuteIcoLeft = Math.floor((m * (minuteBox.width - minuteIco.width)) / 59);
			KW.Css.setCss(this.hourIco, {
				left : hourIcoLeft + 'px'
			});
			KW.Css.setCss(this.minuteIco, {
				left : minuteIcoLeft + 'px'
			});
		},
		remove : function () {
			KW.Dom.remove(this.box);
			this.state = false;
		},
		lan : function () {
			if (this.language.toLowerCase() === 'en') {
				return {
					current : 'The selected time :',
					currentTime : 'The current time',
					ok : 'OK',
					hour : 'Hour',
					minute : 'Minute'
				};
			} else {
				return {
					current : '当前选中的时间为：',
					currentTime : '当前时间',
					ok : '确&nbsp;&nbsp;定',
					hour : '小时',
					minute : '分钟'
				};
			}
		},
		init : function () {
			var self = this;
			this.creates();
			this.setting();
			this.event();
			function remove() {
				self.remove();
				self.rem(document, 'click', remove);
			}
			self.add(document, 'click', remove);
		}
	};
	w.Calendar = Calendar;
	w.Time = Time;
})(window, document);
