/* eslint-disable */
/* https://hcaptcha.com/license */
var hcaptcha = (function () {
	'use strict';
	function e(e) {
		var t = this.constructor;
		return this.then(
			function (n) {
				return t.resolve(e()).then(function () {
					return n;
				});
			},
			function (n) {
				return t.resolve(e()).then(function () {
					return t.reject(n);
				});
			}
		);
	}
	function t(e) {
		return new this(function (t, n) {
			if (!e || 'undefined' == typeof e.length)
				return n(
					new TypeError(
						typeof e +
							' ' +
							e +
							' is not iterable(cannot read property Symbol(Symbol.iterator))'
					)
				);
			var i = Array.prototype.slice.call(e);
			if (0 === i.length) return t([]);
			var r = i.length;
			function o(e, n) {
				if (n && ('object' == typeof n || 'function' == typeof n)) {
					var a = n.then;
					if ('function' == typeof a)
						return void a.call(
							n,
							function (t) {
								o(e, t);
							},
							function (n) {
								(i[e] = { status: 'rejected', reason: n }),
									0 == --r && t(i);
							}
						);
				}
				(i[e] = { status: 'fulfilled', value: n }), 0 == --r && t(i);
			}
			for (var a = 0; a < i.length; a++) o(a, i[a]);
		});
	}
	var n = setTimeout,
		i = 'undefined' != typeof setImmediate ? setImmediate : null;
	function r(e) {
		return Boolean(e && 'undefined' != typeof e.length);
	}
	function o() {}
	function a(e) {
		if (!(this instanceof a))
			throw new TypeError('Promises must be constructed via new');
		if ('function' != typeof e) throw new TypeError('not a function');
		(this._state = 0),
			(this._handled = !1),
			(this._value = undefined),
			(this._deferreds = []),
			u(e, this);
	}
	function s(e, t) {
		for (; 3 === e._state; ) e = e._value;
		0 !== e._state
			? ((e._handled = !0),
			  a._immediateFn(function () {
					var n = 1 === e._state ? t.onFulfilled : t.onRejected;
					if (null !== n) {
						var i;
						try {
							i = n(e._value);
						} catch (r) {
							return void c(t.promise, r);
						}
						h(t.promise, i);
					} else (1 === e._state ? h : c)(t.promise, e._value);
			  }))
			: e._deferreds.push(t);
	}
	function h(e, t) {
		try {
			if (t === e)
				throw new TypeError(
					'A promise cannot be resolved with itself.'
				);
			if (t && ('object' == typeof t || 'function' == typeof t)) {
				var n = t.then;
				if (t instanceof a)
					return (e._state = 3), (e._value = t), void l(e);
				if ('function' == typeof n)
					return void u(
						((i = n),
						(r = t),
						function () {
							i.apply(r, arguments);
						}),
						e
					);
			}
			(e._state = 1), (e._value = t), l(e);
		} catch (o) {
			c(e, o);
		}
		var i, r;
	}
	function c(e, t) {
		(e._state = 2), (e._value = t), l(e);
	}
	function l(e) {
		2 === e._state &&
			0 === e._deferreds.length &&
			a._immediateFn(function () {
				e._handled || a._unhandledRejectionFn(e._value);
			});
		for (var t = 0, n = e._deferreds.length; t < n; t++)
			s(e, e._deferreds[t]);
		e._deferreds = null;
	}
	function d(e, t, n) {
		(this.onFulfilled = 'function' == typeof e ? e : null),
			(this.onRejected = 'function' == typeof t ? t : null),
			(this.promise = n);
	}
	function u(e, t) {
		var n = !1;
		try {
			e(
				function (e) {
					n || ((n = !0), h(t, e));
				},
				function (e) {
					n || ((n = !0), c(t, e));
				}
			);
		} catch (i) {
			if (n) return;
			(n = !0), c(t, i);
		}
	}
	(a.prototype['catch'] = function (e) {
		return this.then(null, e);
	}),
		(a.prototype.then = function (e, t) {
			var n = new this.constructor(o);
			return s(this, new d(e, t, n)), n;
		}),
		(a.prototype['finally'] = e),
		(a.all = function (e) {
			return new a(function (t, n) {
				if (!r(e))
					return n(new TypeError('Promise.all accepts an array'));
				var i = Array.prototype.slice.call(e);
				if (0 === i.length) return t([]);
				var o = i.length;
				function a(e, r) {
					try {
						if (
							r &&
							('object' == typeof r || 'function' == typeof r)
						) {
							var s = r.then;
							if ('function' == typeof s)
								return void s.call(
									r,
									function (t) {
										a(e, t);
									},
									n
								);
						}
						(i[e] = r), 0 == --o && t(i);
					} catch (h) {
						n(h);
					}
				}
				for (var s = 0; s < i.length; s++) a(s, i[s]);
			});
		}),
		(a.allSettled = t),
		(a.resolve = function (e) {
			return e && 'object' == typeof e && e.constructor === a
				? e
				: new a(function (t) {
						t(e);
				  });
		}),
		(a.reject = function (e) {
			return new a(function (t, n) {
				n(e);
			});
		}),
		(a.race = function (e) {
			return new a(function (t, n) {
				if (!r(e))
					return n(new TypeError('Promise.race accepts an array'));
				for (var i = 0, o = e.length; i < o; i++)
					a.resolve(e[i]).then(t, n);
			});
		}),
		(a._immediateFn =
			('function' == typeof i &&
				function (e) {
					i(e);
				}) ||
			function (e) {
				n(e, 0);
			}),
		(a._unhandledRejectionFn = function (e) {
			'undefined' != typeof console &&
				console &&
				console.warn('Possible Unhandled Promise Rejection:', e);
		});
	var p,
		f = (function () {
			if ('undefined' != typeof self) return self;
			if ('undefined' != typeof window) return window;
			if ('undefined' != typeof global) return global;
			throw new Error('unable to locate global object');
		})();
	'function' != typeof f.Promise
		? (f.Promise = a)
		: (f.Promise.prototype['finally'] ||
				(f.Promise.prototype['finally'] = e),
		  f.Promise.allSettled || (f.Promise.allSettled = t)),
		Array.prototype.indexOf ||
			(Array.prototype.indexOf = (function (e) {
				return function (t, n) {
					if (null === this || this === undefined)
						throw TypeError(
							'Array.prototype.indexOf called on null or undefined'
						);
					var i = e(this),
						r = i.length >>> 0,
						o = Math.min(0 | n, r);
					if (o < 0) o = Math.max(0, r + o);
					else if (o >= r) return -1;
					if (void 0 === t) {
						for (; o !== r; ++o)
							if (void 0 === i[o] && o in i) return o;
					} else if (t != t) {
						for (; o !== r; ++o) if (i[o] != i[o]) return o;
					} else for (; o !== r; ++o) if (i[o] === t) return o;
					return -1;
				};
			})(Object)),
		Array.isArray ||
			(Array.isArray = function (e) {
				return '[object Array]' === Object.prototype.toString.call(e);
			}),
		document.getElementsByClassName ||
			(window.Element.prototype.getElementsByClassName =
				document.constructor.prototype.getElementsByClassName =
					function (e) {
						if (document.querySelectorAll)
							return document.querySelectorAll('.' + e);
						for (
							var t = document.getElementsByTagName('*'),
								n = new RegExp('(^|\\s)' + e + '(\\s|$)'),
								i = [],
								r = 0;
							r < t.length;
							r++
						)
							n.test(t[r].className) && i.push(t[r]);
						return i;
					}),
		String.prototype.startsWith ||
			(String.prototype.startsWith = function (e, t) {
				return this.substr(!t || t < 0 ? 0 : +t, e.length) === e;
			}),
		String.prototype.endsWith ||
			(String.prototype.endsWith = function (e, t) {
				return (
					(t === undefined || t > this.length) && (t = this.length),
					this.substring(t - e.length, t) === e
				);
			});
	try {
		if (
			Object.defineProperty &&
			Object.getOwnPropertyDescriptor &&
			Object.getOwnPropertyDescriptor(Element.prototype, 'textContent') &&
			!Object.getOwnPropertyDescriptor(Element.prototype, 'textContent')
				.get
		) {
			var m = Object.getOwnPropertyDescriptor(
				Element.prototype,
				'innerText'
			);
			Object.defineProperty(Element.prototype, 'textContent', {
				get: function () {
					return m.get.call(this);
				},
				set: function (e) {
					m.set.call(this, e);
				}
			});
		}
	} catch (ln) {}
	Function.prototype.bind ||
		(Function.prototype.bind = function (e) {
			if ('function' != typeof this)
				throw new TypeError(
					'Function.prototype.bind: Item Can Not Be Bound.'
				);
			var t = Array.prototype.slice.call(arguments, 1),
				n = this,
				i = function () {},
				r = function () {
					return n.apply(
						this instanceof i ? this : e,
						t.concat(Array.prototype.slice.call(arguments))
					);
				};
			return (
				this.prototype && (i.prototype = this.prototype),
				(r.prototype = new i()),
				r
			);
		}),
		'function' != typeof Object.create &&
			(Object.create = function (e, t) {
				function n() {}
				if (((n.prototype = e), 'object' == typeof t))
					for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i]);
				return new n();
			}),
		Date.now ||
			(Date.now = function () {
				return new Date().getTime();
			}),
		window.console || (window.console = {});
	for (
		var g,
			y,
			v,
			w,
			b,
			_,
			x = ['error', 'info', 'log', 'show', 'table', 'trace', 'warn'],
			C = function (e) {},
			k = x.length;
		--k > -1;

	)
		(p = x[k]), window.console[p] || (window.console[p] = C);
	if (window.atob)
		try {
			window.atob(' ');
		} catch (dn) {
			window.atob =
				((g = window.atob),
				((y = function (e) {
					return g(String(e).replace(/[\t\n\f\r ]+/g, ''));
				}).original = g),
				y);
		}
	else {
		var E =
				'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
			O =
				/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
		window.atob = function (e) {
			if (((e = String(e).replace(/[\t\n\f\r ]+/g, '')), !O.test(e)))
				throw new TypeError(
					"Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
				);
			var t, n, i;
			e += '=='.slice(2 - (3 & e.length));
			for (var r = '', o = 0; o < e.length; )
				(t =
					(E.indexOf(e.charAt(o++)) << 18) |
					(E.indexOf(e.charAt(o++)) << 12) |
					((n = E.indexOf(e.charAt(o++))) << 6) |
					(i = E.indexOf(e.charAt(o++)))),
					(r +=
						64 === n
							? String.fromCharCode((t >> 16) & 255)
							: 64 === i
							? String.fromCharCode(
									(t >> 16) & 255,
									(t >> 8) & 255
							  )
							: String.fromCharCode(
									(t >> 16) & 255,
									(t >> 8) & 255,
									255 & t
							  ));
			return r;
		};
	}
	if (
		(Event.prototype.preventDefault ||
			(Event.prototype.preventDefault = function () {
				this.returnValue = !1;
			}),
		Event.prototype.stopPropagation ||
			(Event.prototype.stopPropagation = function () {
				this.cancelBubble = !0;
			}),
		window.Prototype && Array.prototype.toJSON)
	) {
		console.error(
			'[hCaptcha] Custom JSON polyfill detected, please remove to ensure hCaptcha works properly'
		);
		var S = Array.prototype.toJSON,
			I = JSON.stringify;
		JSON.stringify = function (e) {
			try {
				return delete Array.prototype.toJSON, I(e);
			} finally {
				Array.prototype.toJSON = S;
			}
		};
	}
	Object.keys ||
		(Object.keys =
			((v = Object.prototype.hasOwnProperty),
			(w = !Object.prototype.propertyIsEnumerable.call(
				{ toString: null },
				'toString'
			)),
			(_ = (b = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			]).length),
			function (e) {
				if (
					'function' != typeof e &&
					('object' != typeof e || null === e)
				)
					throw new TypeError('Object.keys called on non-object');
				var t,
					n,
					i = [];
				for (t in e) v.call(e, t) && i.push(t);
				if (w) for (n = 0; n < _; n++) v.call(e, b[n]) && i.push(b[n]);
				return i;
			}));
	var P = 'challenge-passed',
		B = 'challenge-escaped',
		T = 'challenge-closed',
		M = 'challenge-expired',
		A = 'invalid-data',
		j = 'bundle-error',
		$ = 'network-error',
		L = 'rate-limited',
		R = 'challenge-error',
		D = 'incomplete-answer',
		N = 'missing-captcha',
		z = 'missing-sitekey',
		W = 'invalid-captcha-id';
	function F(e, t) {
		(this.cause = e), (this.message = t);
	}
	function U(e) {
		F.call(this, W, 'Invalid hCaptcha id: ' + e);
	}
	function J() {
		F.call(this, N, 'No hCaptcha exists.');
	}
	function H() {
		F.call(
			this,
			z,
			'Missing sitekey - https://hcaptcha.com/docs/configuration#jsapi'
		);
	}
	F.prototype = Error.prototype;
	var q = [],
		X = [],
		Y = {
			add: function (e) {
				q.push(e);
			},
			remove: function (e) {
				for (var t = !1, n = q.length; --n > -1 && !1 === t; )
					q[n].id === e.id && ((t = q[n]), q.splice(n, 1));
				return t;
			},
			each: function (e) {
				for (var t = -1; ++t < q.length; ) e(q[t]);
			},
			isValidId: function (e) {
				for (var t = !1, n = -1; ++n < q.length && !1 === t; )
					q[n].id === e && (t = !0);
				return t;
			},
			getByIndex: function (e) {
				for (var t = !1, n = -1; ++n < q.length && !1 === t; )
					n === e && (t = q[n]);
				return t;
			},
			getById: function (e) {
				for (var t = !1, n = -1; ++n < q.length && !1 === t; )
					q[n].id === e && (t = q[n]);
				return t;
			},
			getCaptchaIdList: function () {
				var e = [];
				return (
					Y.each(function (t) {
						e.push(t.id);
					}),
					e
				);
			},
			pushSession: function (e, t) {
				X.push([e, t]), X.length > 10 && X.splice(0, X.length - 10);
			},
			getSession: function () {
				return X;
			}
		};
	var G = {
			getCookie: function (e) {
				var t = document.cookie.replace(/ /g, '').split(';');
				try {
					for (var n = '', i = t.length; i-- && !n; )
						t[i].indexOf(e) >= 0 && (n = t[i]);
					return n;
				} catch (dn) {
					return '';
				}
			},
			hasCookie: function (e) {
				return !!G.getCookie(e);
			},
			supportsAPI: function () {
				try {
					return (
						'hasStorageAccess' in document &&
						'requestStorageAccess' in document
					);
				} catch (dn) {
					return !1;
				}
			},
			hasAccess: function () {
				return new Promise(function (e) {
					document
						.hasStorageAccess()
						.then(function () {
							e(!0);
						})
						['catch'](function () {
							e(!1);
						});
				});
			},
			requestAccess: function () {
				try {
					return document.requestStorageAccess();
				} catch (dn) {
					return Promise.resolve();
				}
			}
		},
		V = function (e) {
			var t = [];
			for (var n in e) {
				var i = e[n];
				(i = 'object' == typeof i ? JSON.stringify(i) : i),
					t.push(
						[encodeURIComponent(n), encodeURIComponent(i)].join('=')
					);
			}
			return t.join('&');
		},
		Q = [
			{
				family: 'UC Browser',
				patterns: [
					'(UC? ?Browser|UCWEB|U3)[ /]?(\\d+)\\.(\\d+)\\.(\\d+)'
				]
			},
			{
				family: 'Opera',
				name_replace: 'Opera Mobile',
				patterns: [
					'(Opera)/.+Opera Mobi.+Version/(\\d+)\\.(\\d+)',
					'(Opera)/(\\d+)\\.(\\d+).+Opera Mobi',
					'Opera Mobi.+(Opera)(?:/|\\s+)(\\d+)\\.(\\d+)',
					'Opera Mobi',
					'(?:Mobile Safari).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)'
				]
			},
			{
				family: 'Opera',
				name_replace: 'Opera Mini',
				patterns: [
					'(Opera Mini)(?:/att|)/?(\\d+|)(?:\\.(\\d+)|)(?:\\.(\\d+)|)',
					'(OPiOS)/(\\d+).(\\d+).(\\d+)'
				]
			},
			{
				family: 'Opera',
				name_replace: 'Opera Neon',
				patterns: ['Chrome/.+( MMS)/(\\d+).(\\d+).(\\d+)']
			},
			{
				name_replace: 'Opera',
				patterns: [
					'(Opera)/9.80.*Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
					'(?:Chrome).*(OPR)/(\\d+)\\.(\\d+)\\.(\\d+)'
				]
			},
			{
				family: 'Firefox',
				name_replace: 'Firefox Mobile',
				patterns: [
					'(Fennec)/(\\d+)\\.(\\d+)\\.?([ab]?\\d+[a-z]*)',
					'(Fennec)/(\\d+)\\.(\\d+)(pre)',
					'(Fennec)/(\\d+)\\.(\\d+)',
					'(?:Mobile|Tablet);.*(Firefox)/(\\d+)\\.(\\d+)',
					'(FxiOS)/(\\d+)\\.(\\d+)(\\.(\\d+)|)(\\.(\\d+)|)'
				]
			},
			{
				name_replace: 'Coc Coc',
				patterns: ['(coc_coc_browser)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)']
			},
			{
				family: 'QQ',
				name_replace: 'QQ Mini',
				patterns: [
					'(MQQBrowser/Mini)(?:(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)'
				]
			},
			{
				family: 'QQ',
				name_replace: 'QQ Mobile',
				patterns: [
					'(MQQBrowser)(?:/(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)|)'
				]
			},
			{
				name_replace: 'QQ',
				patterns: [
					'(QQBrowser)(?:/(\\d+)(?:\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)|)'
				]
			},
			{
				family: 'Edge',
				name: 'Edge Mobile',
				patterns: [
					'Windows Phone .*(Edge)/(\\d+)\\.(\\d+)',
					'(EdgiOS|EdgA)/(\\d+)\\.(\\d+).(\\d+).(\\d+)'
				]
			},
			{
				name_replace: 'Edge',
				patterns: ['(Edge|Edg)/(\\d+)(?:\\.(\\d+)|)']
			},
			{ patterns: ['(Puffin)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)'] },
			{
				family: 'Chrome',
				name_replace: 'Chrome Mobile',
				patterns: [
					'Version/.+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
					'; wv\\).+(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
					'(CriOS)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
					'(CrMo)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)',
					'(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+) Mobile(?:[ /]|$)',
					' Mobile .*(Chrome)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+)'
				]
			},
			{
				family: 'Yandex',
				name_replace: 'Yandex Mobile',
				patterns: [
					'(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)\\.(\\d+).*Mobile'
				]
			},
			{
				name_replace: 'Yandex',
				patterns: ['(YaBrowser)/(\\d+)\\.(\\d+)\\.(\\d+)']
			},
			{
				patterns: [
					'(Vivaldi)/(\\d+)\\.(\\d+)',
					'(Vivaldi)/(\\d+)\\.(\\d+)\\.(\\d+)'
				]
			},
			{
				name_replace: 'Brave',
				patterns: ['(brave)/(\\d+)\\.(\\d+)\\.(\\d+) Chrome']
			},
			{
				family: 'Chrome',
				patterns: [
					'(Chromium|Chrome)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)'
				]
			},
			{
				name_replace: 'Internet Explorer Mobile',
				patterns: ['(IEMobile)[ /](\\d+)\\.(\\d+)']
			},
			{
				family: 'Safari',
				name_replace: 'Safari Mobile',
				patterns: [
					'(iPod|iPhone|iPad).+Version/(d+).(d+)(?:.(d+)|).*[ +]Safari',
					'(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).* AppleNews\\/\\d+\\.\\d+\\.\\d+?',
					'(iPod|iPhone|iPad).+Version/(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
					'(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile.*[ +]Safari',
					'(iPod|iPod touch|iPhone|iPad);.*CPU.*OS[ +](\\d+)_(\\d+)(?:_(\\d+)|).*Mobile',
					'(iPod|iPod touch|iPhone|iPad).* Safari',
					'(iPod|iPod touch|iPhone|iPad)'
				]
			},
			{
				name_replace: 'Safari',
				patterns: ['(Version)/(\\d+)\\.(\\d+)(?:\\.(\\d+)|).*Safari/']
			},
			{
				name_replace: 'Internet Explorer',
				patterns: ['(Trident)/(7|8).(0)'],
				major_replace: '11'
			},
			{
				name_replace: 'Internet Explorer',
				patterns: ['(Trident)/(6)\\.(0)'],
				major_replace: '10'
			},
			{
				name_replace: 'Internet Explorer',
				patterns: ['(Trident)/(5)\\.(0)'],
				major_replace: '9'
			},
			{
				name_replace: 'Internet Explorer',
				patterns: ['(Trident)/(4)\\.(0)'],
				major_replace: '8'
			},
			{
				family: 'Firefox',
				patterns: [
					'(Firefox)/(\\d+)\\.(\\d+)\\.(\\d+)',
					'(Firefox)/(\\d+)\\.(\\d+)(pre|[ab]\\d+[a-z]*|)'
				]
			}
		],
		K = [
			{
				family: 'Windows',
				name_replace: 'Windows Phone',
				patterns: [
					'(Windows Phone) (?:OS[ /])?(\\d+)\\.(\\d+)',
					'^UCWEB.*; (wds) (\\d+)\\.(d+)(?:\\.(\\d+)|);',
					'^UCWEB.*; (wds) (\\d+)\\.(\\d+)(?:\\.(\\d+)|);'
				]
			},
			{
				family: 'Windows',
				name_replace: 'Windows Mobile',
				patterns: ['(Windows ?Mobile)']
			},
			{
				name_replace: 'Android',
				patterns: [
					'(Android)[ \\-/](\\d+)(?:\\.(\\d+)|)(?:[.\\-]([a-z0-9]+)|)',
					'(Android) (d+);',
					'^UCWEB.*; (Adr) (\\d+)\\.(\\d+)(?:[.\\-]([a-z0-9]+)|);',
					'^(JUC).*; ?U; ?(?:Android|)(\\d+)\\.(\\d+)(?:[\\.\\-]([a-z0-9]+)|)',
					'(android)\\s(?:mobile\\/)(\\d+)(?:\\.(\\d+)(?:\\.(\\d+)|)|)',
					'(Silk-Accelerated=[a-z]{4,5})',
					'Puffin/[\\d\\.]+AT',
					'Puffin/[\\d\\.]+AP'
				]
			},
			{
				name_replace: 'Chrome OS',
				patterns: [
					'(x86_64|aarch64)\\ (\\d+)\\.(\\d+)\\.(\\d+).*Chrome.*(?:CitrixChromeApp)$',
					'(CrOS) [a-z0-9_]+ (\\d+)\\.(\\d+)(?:\\.(\\d+)|)'
				]
			},
			{
				name_replace: 'Windows',
				patterns: [
					'(Windows 10)',
					'(Windows NT 6\\.4)',
					'(Windows NT 10\\.0)'
				],
				major_replace: '10'
			},
			{
				name_replace: 'Windows',
				patterns: ['(Windows NT 6\\.3; ARM;)', '(Windows NT 6.3)'],
				major_replace: '8',
				minor_replace: '1'
			},
			{
				name_replace: 'Windows',
				patterns: ['(Windows NT 6\\.2)'],
				major_replace: '8'
			},
			{
				name_replace: 'Windows',
				patterns: ['(Windows NT 6\\.1)'],
				major_replace: '7'
			},
			{
				name_replace: 'Windows',
				patterns: ['(Windows NT 6\\.0)'],
				major_replace: 'Vista'
			},
			{
				name_replace: 'Windows',
				patterns: ['(Windows (?:NT 5\\.2|NT 5\\.1))'],
				major_replace: 'XP'
			},
			{
				name_replace: 'Mac OS X',
				patterns: [
					'((?:Mac[ +]?|; )OS[ +]X)[\\s+/](?:(\\d+)[_.](\\d+)(?:[_.](\\d+)|)|Mach-O)',
					'\\w+\\s+Mac OS X\\s+\\w+\\s+(\\d+).(\\d+).(\\d+).*',
					'(?:PPC|Intel) (Mac OS X)'
				]
			},
			{
				name_replace: 'Mac OS X',
				patterns: [' (Dar)(win)/(10).(d+).*((?:i386|x86_64))'],
				major_replace: '10',
				minor_replace: '6'
			},
			{
				name_replace: 'Mac OS X',
				patterns: [' (Dar)(win)/(11).(\\d+).*\\((?:i386|x86_64)\\)'],
				major_replace: '10',
				minor_replace: '7'
			},
			{
				name_replace: 'Mac OS X',
				patterns: [' (Dar)(win)/(12).(\\d+).*\\((?:i386|x86_64)\\)'],
				major_replace: '10',
				minor_replace: '8'
			},
			{
				name_replace: 'Mac OS X',
				patterns: [' (Dar)(win)/(13).(\\d+).*\\((?:i386|x86_64)\\)'],
				major_replace: '10',
				minor_replace: '9'
			},
			{
				name_replace: 'iOS',
				patterns: [
					'^UCWEB.*; (iPad|iPh|iPd) OS (\\d+)_(\\d+)(?:_(\\d+)|);',
					'(CPU[ +]OS|iPhone[ +]OS|CPU[ +]iPhone|CPU IPhone OS)[ +]+(\\d+)[_\\.](\\d+)(?:[_\\.](\\d+)|)',
					'(iPhone|iPad|iPod); Opera',
					'(iPhone|iPad|iPod).*Mac OS X.*Version/(\\d+)\\.(\\d+)',
					'\\b(iOS[ /]|iOS; |iPhone(?:/| v|[ _]OS[/,]|; | OS : |\\d,\\d/|\\d,\\d; )|iPad/)(\\d{1,2})[_\\.](\\d{1,2})(?:[_\\.](\\d+)|)',
					'\\((iOS);',
					'(iPod|iPhone|iPad)',
					'Puffin/[\\d\\.]+IT',
					'Puffin/[\\d\\.]+IP'
				]
			},
			{
				family: 'Chrome',
				name_replace: 'Chromecast',
				patterns: [
					'(CrKey -)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)',
					'(CrKey[ +]armv7l)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)',
					'(CrKey)(?:[/](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)'
				]
			},
			{ name_replace: 'Debian', patterns: ['([Dd]ebian)'] },
			{
				family: 'Linux',
				name_replace: 'Linux',
				patterns: ['(Linux Mint)(?:/(\\d+)|)']
			},
			{
				family: 'Linux',
				patterns: [
					'(Ubuntu|Kubuntu|Arch Linux|CentOS|Slackware|Gentoo|openSUSE|SUSE|Red Hat|Fedora|PCLinuxOS|Mageia|(?:Free|Open|Net|\\b)BSD)',
					'(Mandriva)(?: Linux|)/(?:[\\d.-]+m[a-z]{2}(\\d+).(\\d)|)',
					'(Linux)(?:[ /](\\d+)\\.(\\d+)(?:\\.(\\d+)|)|)',
					'\\(linux-gnu\\)'
				]
			},
			{
				family: 'BlackBerry',
				name_replace: 'BlackBerry OS',
				patterns: [
					'(BB10);.+Version/(\\d+)\\.(\\d+)\\.(\\d+)',
					'(Black[Bb]erry)[0-9a-z]+/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
					'(Black[Bb]erry).+Version/(\\d+)\\.(\\d+)\\.(\\d+)(?:\\.(\\d+)|)',
					'(Black[Bb]erry)'
				]
			},
			{
				patterns: [
					'(Fedora|Red Hat|PCLinuxOS|Puppy|Ubuntu|Kindle|Bada|Sailfish|Lubuntu|BackTrack|Slackware|(?:Free|Open|Net|\\b)BSD)[/ ](\\d+)\\.(\\d+)(?:\\.(\\d+)|)(?:\\.(\\d+)|)'
				]
			}
		],
		Z = navigator.userAgent,
		ee = function () {
			return Z;
		},
		te = function (e) {
			return re(e || Z, Q);
		},
		ne = function (e) {
			return re(e || Z, K);
		};
	function ie(e, t) {
		try {
			var n = new RegExp(t).exec(e);
			return n
				? {
						name: n[1] || 'Other',
						major: n[2] || '0',
						minor: n[3] || '0',
						patch: n[4] || '0'
				  }
				: null;
		} catch (dn) {
			return null;
		}
	}
	function re(e, t) {
		for (var n = null, i = null, r = -1, o = !1; ++r < t.length && !o; ) {
			n = t[r];
			for (var a = -1; ++a < n.patterns.length && !o; )
				o = null !== (i = ie(e, n.patterns[a]));
		}
		return o
			? ((i.family = n.family || n.name_replace || i.name),
			  n.name_replace && (i.name = n.name_replace),
			  n.major_replace && (i.major = n.major_replace),
			  n.minor_replace && (i.minor = n.minor_replace),
			  n.patch_replace && (i.minor = n.patch_replace),
			  i)
			: {
					family: 'Other',
					name: 'Other',
					major: '0',
					minor: '0',
					patch: '0'
			  };
	}
	function oe() {
		var e = this,
			t = te(),
			n = ee();
		(this.agent = n.toLowerCase()),
			(this.language =
				window.navigator.userLanguage || window.navigator.language),
			(this.isCSS1 = 'CSS1Compat' === (document.compatMode || '')),
			(this.width = function () {
				return window.innerWidth &&
					window.document.documentElement.clientWidth
					? Math.min(
							window.innerWidth,
							document.documentElement.clientWidth
					  )
					: window.innerWidth ||
							window.document.documentElement.clientWidth ||
							document.body.clientWidth;
			}),
			(this.height = function () {
				return (
					window.innerHeight ||
					window.document.documentElement.clientHeight ||
					document.body.clientHeight
				);
			}),
			(this.scrollX = function () {
				return window.pageXOffset !== undefined
					? window.pageXOffset
					: e.isCSS1
					? document.documentElement.scrollLeft
					: document.body.scrollLeft;
			}),
			(this.scrollY = function () {
				return window.pageYOffset !== undefined
					? window.pageYOffset
					: e.isCSS1
					? document.documentElement.scrollTop
					: document.body.scrollTop;
			}),
			(this.type =
				'Edge' === t.family
					? 'edge'
					: 'Internet Explorer' === t.family
					? 'ie'
					: 'Chrome' === t.family
					? 'chrome'
					: 'Safari' === t.family
					? 'safari'
					: 'Firefox' === t.family
					? 'firefox'
					: t.family.toLowerCase()),
			(this.version = 1 * (t.major + '.' + t.minor) || 0),
			(this.hasPostMessage = !!window.postMessage);
	}
	(oe.prototype.hasEvent = function (e, t) {
		return 'on' + e in (t || document.createElement('div'));
	}),
		(oe.prototype.getScreenDimensions = function () {
			var e = {};
			for (var t in window.screen) e[t] = window.screen[t];
			return delete e.orientation, e;
		}),
		(oe.prototype.interrogateNavigator = function () {
			var e = {};
			for (var t in window.navigator)
				try {
					e[t] = window.navigator[t];
				} catch (ln) {}
			if (
				(delete e.plugins,
				delete e.mimeTypes,
				(e.plugins = []),
				window.navigator.plugins)
			)
				for (var n = 0; n < window.navigator.plugins.length; n++)
					e.plugins[n] = window.navigator.plugins[n].filename;
			return e;
		}),
		(oe.prototype.supportsCanvas = function () {
			var e = document.createElement('canvas');
			return !(!e.getContext || !e.getContext('2d'));
		}),
		(oe.prototype.supportsWebAssembly = function () {
			try {
				if (
					'object' == typeof WebAssembly &&
					'function' == typeof WebAssembly.instantiate
				) {
					var e = new WebAssembly.Module(
						Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0)
					);
					if (e instanceof WebAssembly.Module)
						return (
							new WebAssembly.Instance(e) instanceof
							WebAssembly.Instance
						);
				}
			} catch (dn) {
				return !1;
			}
		});
	var ae = {
			Browser: new oe(),
			System: new (function () {
				var e,
					t,
					n = ne(),
					i = ee();
				(this.mobile =
					((e = !!(
						'ontouchstart' in window ||
						navigator.maxTouchPoints > 0 ||
						navigator.msMaxTouchPoints > 0
					)),
					(t = !1),
					n &&
						(t =
							[
								'iOS',
								'Windows Phone',
								'Windows Mobile',
								'Android',
								'BlackBerry OS'
							].indexOf(n.name) >= 0),
					e && t)),
					(this.dpr = function () {
						return window.devicePixelRatio || 1;
					}),
					this.mobile &&
						n &&
						'Windows' === n.family &&
						i.indexOf('touch') < 0 &&
						(this.mobile = !1),
					(this.os =
						'iOS' === n.family
							? 'ios'
							: 'Android' === n.family
							? 'android'
							: 'Mac OS X' === n.family
							? 'mac'
							: 'Windows' === n.family
							? 'windows'
							: 'Linux' === n.family
							? 'linux'
							: n.family.toLowerCase()),
					(this.version = (function () {
						if (!n) return 'unknown';
						var e = n.major;
						return (
							n.minor && (e += '.' + n.minor),
							n.patch && (e += '.' + n.patch),
							e
						);
					})());
			})()
		},
		se = {
			host: null,
			file: null,
			sitekey: null,
			a11y_tfe: null,
			pingdom:
				'safari' === ae.Browser.type &&
				'windows' !== ae.System.os &&
				'mac' !== ae.System.os &&
				'ios' !== ae.System.os &&
				'android' !== ae.System.os,
			assetDomain: 'https://newassets.hcaptcha.com',
			assetUrl:
				'https://newassets.hcaptcha.com/captcha/v1/de47910/static',
			width: null,
			height: null,
			mobile: null
		},
		he = {
			se: null,
			custom: !1,
			tplinks: 'on',
			language: null,
			reportapi: 'https://accounts.hcaptcha.com',
			endpoint: 'https://hcaptcha.com',
			endpointOverride: null,
			size: 'normal',
			theme: 'light',
			assethost: null,
			imghost: null,
			recaptchacompat: 'true'
		};
	function ce(e, t) {
		(e.style.width = '304px'),
			(e.style.height = '78px'),
			(e.style.backgroundColor = '#f9e5e5'),
			(e.style.position = 'relative'),
			(e.innerHTML = '');
		var n = document.createElement('div');
		(n.style.width = '284px'),
			(n.style.position = 'absolute'),
			(n.style.top = '12px'),
			(n.style.left = '10px'),
			(n.style.color = '#7c0a06'),
			(n.style.fontSize = '14px'),
			(n.style.fontWeight = 'normal'),
			(n.style.lineHeight = '18px'),
			(n.innerHTML =
				t ||
				"Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> to complete this captcha."),
			e.appendChild(n);
	}
	var le = !0;
	function de(e) {
		var t = { message: e.name + ': ' + e.message };
		e.stack && (t.stack_trace = { trace: e.stack }),
			pe('report error', 'internal', 'debug', t),
			ue('internal error', 'error', se.file);
	}
	function ue(e, t, n, i) {
		if (((t = t || 'error'), le)) {
			var r = 'warn' === t ? 'warning' : t;
			window.Raven &&
				Raven.captureMessage(e, { level: r, logger: n, extra: i });
		}
	}
	function pe(e, t, n, i) {
		le &&
			window.Raven &&
			Raven.captureBreadcrumb({
				message: e,
				category: t,
				level: n,
				data: i
			});
	}
	function fe(e) {
		var t = [].slice.call(arguments, 1);
		'string' == typeof e
			? window[e]
				? 'function' == typeof window[e]
					? window[e].apply(null, t)
					: console.log(
							"[hCaptcha] Callback '" + e + "' is not a function."
					  )
				: console.log("[hCaptcha] Callback '" + e + "' is not defined.")
			: 'function' == typeof e
			? e.apply(null, t)
			: console.log("[hcaptcha] Invalid callback '" + e + "'.");
	}
	function me() {
		try {
			fe.apply(null, arguments);
		} catch (ln) {
			console.error('[hCaptcha] There was an error in your callback.'),
				console.error(ln);
		}
	}
	var ge = {
		UUID: function (e) {
			return (
				/^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i.test(
					e
				) || !1
			);
		},
		UUIDv4: function (e) {
			return (
				/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
					e
				) || !1
			);
		},
		URL: function (e) {
			var t = new RegExp('^(http|https)://'),
				n = new RegExp('^((?!(data|javascript):).)*$');
			return t.test(e) && n.test(e);
		}
	};
	function ye(e, t) {
		var n,
			i = 'attempts' in (t = t || {}) ? t.attempts : 1,
			r = t.delay || 0,
			o = t.onFail;
		return (
			(n = function (t, n, a) {
				e().then(t, function (e) {
					var t = i-- > 0;
					o && (t = !1 !== o(e) && t), t ? setTimeout(a, r) : n(e);
				});
			}),
			new Promise(function (e, t) {
				n(e, t, function i() {
					n(e, t, i);
				});
			})
		);
	}
	function ve() {
		var e = this;
		(this._bottom = 0),
			(this._top = 0),
			(this.storage = {}),
			(this.add = function (t) {
				return (e.storage[e._top] = t), e._top++, t;
			}),
			(this.remove = function () {
				if (!e.empty()) {
					var t = e._bottom,
						n = e.storage[t];
					return (e.storage[t] = null), e._bottom++, n;
				}
			}),
			(this.empty = function () {
				return e._top === e._bottom;
			}),
			(this.size = function () {
				return e._top - e._bottom;
			});
	}
	var we = {
		queue: ve,
		depth: function un(e, t, n) {
			if ('object' == typeof e && e[t] && e[t].length > 0)
				for (var i = e[t].length; --i > -1; ) un(e[t][i], t, n);
			e !== undefined && n(e);
		},
		breathe: function (e, t, n) {
			var i = new ve(),
				r = null;
			for (i.add(e), r = i.remove(); r; ) {
				for (var o = 0; o < r[t].length; o++) i.add(r[t][o]);
				n(r), (r = i.remove());
			}
		}
	};
	function be(e) {
		(this.r = 255),
			(this.g = 255),
			(this.b = 255),
			(this.a = 1),
			(this.h = 1),
			(this.s = 1),
			(this.l = 1),
			this.parseString(e);
	}
	function _e(e, t, n) {
		return (
			n < 0 && (n += 1),
			n > 1 && (n -= 1),
			n < 1 / 6
				? e + 6 * (t - e) * n
				: n < 0.5
				? t
				: n < 2 / 3
				? e + (t - e) * (2 / 3 - n) * 6
				: e
		);
	}
	(be.hasAlpha = function (e) {
		return (
			'string' == typeof e &&
			(-1 !== e.indexOf('rgba') || (9 === e.length && '#' === e[0]))
		);
	}),
		(be.prototype.parseString = function (e) {
			e &&
				(0 === e.indexOf('#')
					? this.fromHex(e)
					: 0 === e.indexOf('rgb') && this.fromRGBA(e));
		}),
		(be.prototype.fromHex = function (e) {
			var t = 1;
			9 === e.length && (t = parseInt(e.substr(7, 2), 16) / 255);
			var n = (e = e.substr(1, 6)).replace(
					/^([a-f\d])([a-f\d])([a-f\d])?$/i,
					function (e, t, n, i) {
						return t + t + n + n + i + i;
					}
				),
				i = parseInt(n, 16),
				r = i >> 16,
				o = (i >> 8) & 255,
				a = 255 & i;
			this.setRGBA(r, o, a, t);
		}),
		(be.prototype.fromRGBA = function (e) {
			var t = e.indexOf('rgba'),
				n = e
					.substr(t)
					.replace(/rgba?\(/, '')
					.replace(/\)/, '')
					.replace(/[\s+]/g, '')
					.split(','),
				i = Math.floor(parseInt(n[0])),
				r = Math.floor(parseInt(n[1])),
				o = Math.floor(parseInt(n[2])),
				a = parseFloat(n[3]);
			this.setRGBA(i, r, o, a);
		}),
		(be.prototype.setRGB = function (e, t, n) {
			this.setRGBA(e, t, n, 1);
		}),
		(be.prototype.setRGBA = function (e, t, n, i) {
			(this.r = e),
				(this.g = t),
				(this.b = n),
				(this.a = isNaN(i) ? this.a : i),
				this.updateHSL();
		}),
		(be.prototype.hsl2rgb = function (e, t, n) {
			if (0 === t) {
				var i = Math.round(255 * n);
				return this.setRGB(i, i, i), this;
			}
			var r = n <= 0.5 ? n * (1 + t) : n + t - n * t,
				o = 2 * n - r;
			return (
				(this.r = Math.round(255 * _e(o, r, e + 1 / 3))),
				(this.g = Math.round(255 * _e(o, r, e))),
				(this.b = Math.round(255 * _e(o, r, e - 1 / 3))),
				(this.h = e),
				(this.s = t),
				(this.l = n),
				this
			);
		}),
		(be.prototype.updateHSL = function () {
			var e,
				t = this.r / 255,
				n = this.g / 255,
				i = this.b / 255,
				r = Math.max(t, n, i),
				o = Math.min(t, n, i),
				a = null,
				s = (r + o) / 2;
			if (r === o) a = e = 0;
			else {
				var h = r - o;
				switch (((e = s > 0.5 ? h / (2 - r - o) : h / (r + o)), r)) {
					case t:
						a = (n - i) / h + (n < i ? 6 : 0);
						break;
					case n:
						a = (i - t) / h + 2;
						break;
					case i:
						a = (t - n) / h + 4;
				}
				a /= 6;
			}
			return (this.h = a), (this.s = e), (this.l = s), this;
		}),
		(be.prototype.getHex = function () {
			return (
				'#' +
				((1 << 24) + (this.r << 16) + (this.g << 8) + this.b)
					.toString(16)
					.slice(1)
			);
		}),
		(be.prototype.getRGBA = function () {
			return (
				'rgba(' +
				this.r +
				',' +
				this.g +
				',' +
				this.b +
				',' +
				this.a +
				')'
			);
		}),
		(be.prototype.clone = function () {
			var e = new be();
			return e.setRGBA(this.r, this.g, this.b, this.a), e;
		}),
		(be.prototype.mix = function (e, t) {
			e instanceof be || (e = new be(e));
			var n = new be(),
				i = Math.round(this.r + t * (e.r - this.r)),
				r = Math.round(this.g + t * (e.g - this.g)),
				o = Math.round(this.b + t * (e.b - this.b));
			return n.setRGB(i, r, o), n;
		}),
		(be.prototype.blend = function (e, t) {
			var n;
			e instanceof be || (e = new be(e));
			for (var i = [], r = 0; r < t; r++)
				(n = this.mix.call(this, e, r / t)), i.push(n);
			return i;
		}),
		(be.prototype.lightness = function (e) {
			return e > 1 && (e /= 100), this.hsl2rgb(this.h, this.s, e), this;
		}),
		(be.prototype.saturation = function (e) {
			return e > 1 && (e /= 100), this.hsl2rgb(this.h, e, this.l), this;
		}),
		(be.prototype.hue = function (e) {
			return this.hsl2rgb(e / 360, this.s, this.l), this;
		});
	var xe = {
			eventName: function (e) {
				var t = e;
				return (
					'down' === e ||
					'up' === e ||
					'move' === e ||
					'over' === e ||
					'out' === e
						? (t =
								!ae.System.mobile ||
								('down' !== e && 'up' !== e && 'move' !== e)
									? 'mouse' + e
									: 'down' === e
									? 'touchstart'
									: 'up' === e
									? 'touchend'
									: 'touchmove')
						: 'enter' === e && (t = 'keydown'),
					t
				);
			},
			actionName: function (e) {
				var t = e;
				return (
					'touchstart' === t || 'mousedown' === t
						? (t = 'down')
						: 'touchmove' === t || 'mousemove' === t
						? (t = 'move')
						: 'touchend' === t || 'mouseup' === t
						? (t = 'up')
						: 'mouseover' === t
						? (t = 'over')
						: 'mouseout' === t && (t = 'out'),
					t
				);
			},
			eventCallback: function (e, t, n) {
				var i = xe.actionName(e);
				return function (r) {
					if (
						((r = r || window.event),
						'down' === i ||
							'move' === i ||
							'up' === i ||
							'over' === i ||
							'out' === i ||
							'click' === i)
					) {
						var o = xe.eventCoords(r);
						if (!o) return;
						var a = n.getBoundingClientRect();
						(r.windowX = o.x),
							(r.windowY = o.y),
							(r.elementX = r.windowX - (a.x || a.left)),
							(r.elementY = r.windowY - (a.y || a.top));
					}
					(r.keyNum = r.which || r.keyCode || 0),
						('enter' === e && 13 !== r.keyNum && 32 !== r.keyNum) ||
							((r.action = i), (r.targetElement = n), t(r));
				};
			},
			eventCoords: function (e) {
				if (!e) return null;
				var t = e;
				if (e.touches || e.changedTouches) {
					var n =
						e.touches && e.touches.length >= 1
							? e.touches
							: e.changedTouches;
					n && n[0] && (t = n[0]);
				}
				return 'number' == typeof t.pageX && 'number' == typeof t.pageY
					? { x: t.pageX, y: t.pageY }
					: 'number' == typeof t.clientX &&
					  'number' == typeof t.clientY
					? { x: t.clientX, y: t.clientY }
					: null;
			}
		},
		Ce = ['Webkit', 'Moz', 'ms'],
		ke = document.createElement('div').style,
		Ee = {};
	function Oe(e) {
		var t = Ee[e];
		return (
			t ||
			(e in ke
				? e
				: (Ee[e] =
						(function (e) {
							for (
								var t = e[0].toUpperCase() + e.slice(1),
									n = Ce.length;
								n--;

							)
								if ((e = Ce[n] + t) in ke) return e;
						})(e) || e))
		);
	}
	function Se(e, t, n) {
		if (
			((this.dom = null),
			(this._clss = []),
			(this._nodes = []),
			(this._listeners = []),
			(this._frag = null),
			e && 'object' == typeof e)
		) {
			this.dom = e;
			var i = [],
				r = [];
			'string' == typeof e.className && (r = e.className.split(' '));
			for (var o = 0; o < r.length; o++)
				'' !== r[o] && ' ' !== r[o] && i.push(r[o]);
			this._clss = i;
		} else
			(n !== undefined && null !== n) || (n = !0),
				(!e ||
					('string' == typeof e &&
						(e.indexOf('#') >= 0 || e.indexOf('.') >= 0))) &&
					(e && (t = e), (e = 'div')),
				(this.dom = document.createElement(e)),
				t &&
					(t.indexOf('#') >= 0
						? (this.dom.id = t.split('#')[1])
						: (t.indexOf('.') >= 0 && (t = t.split('.')[1]),
						  this.addClass.call(this, t)));
		!0 === n &&
			((this._frag = document.createDocumentFragment()),
			this._frag.appendChild(this.dom));
	}
	(Se.prototype.createElement = function (e, t) {
		var n = new Se(e, t, !1);
		return this.appendElement.call(this, n), this._nodes.push(n), n;
	}),
		(Se.prototype.appendElement = function (e) {
			if (e === undefined)
				return de({
					name: 'DomElement Add Child',
					message: 'Child Element is undefined'
				});
			var t;
			t =
				e._frag !== undefined && null !== e._frag
					? e._frag
					: e.dom !== undefined
					? e.dom
					: e;
			try {
				e instanceof Se && (e._parent = this), this.dom.appendChild(t);
			} catch (dn) {
				de({
					name: 'DomElement Add Child',
					message: 'Failed to append child.'
				});
			}
			return this;
		}),
		(Se.prototype.removeElement = function (e) {
			try {
				var t;
				if (e._nodes)
					for (t = e._nodes.length; t--; )
						e.removeElement(e._nodes[t]);
				for (t = this._nodes.length; --t > -1; )
					this._nodes[t] === e && this._nodes.splice(t, 1);
				this.dom.removeChild(e.dom || e), e.__destroy && e.__destroy();
			} catch (dn) {
				de({
					name: 'DomElement Remove Child',
					message: 'Failed to remove child.'
				});
			}
		}),
		(Se.prototype.addClass = function (e) {
			return (
				!1 === this.hasClass.call(this, e) &&
					(this._clss.push(e),
					(this.dom.className = this._clss.join(' '))),
				this
			);
		}),
		(Se.prototype.hasClass = function (e) {
			for (
				var t = -1 !== this.dom.className.split(' ').indexOf(e),
					n = this._clss.length;
				n-- && !t;

			)
				t = this._clss[n] === e;
			return t;
		}),
		(Se.prototype.removeClass = function (e) {
			for (var t = this._clss.length; --t > -1; )
				this._clss[t] === e && this._clss.splice(t, 1);
			return (this.dom.className = this._clss.join(' ')), this;
		}),
		(Se.prototype.text = function (e) {
			if (this && this.dom) {
				if (!e) return this.dom.textContent;
				for (
					var t, n, i, r, o = /&(.*?);/g, a = /<[a-z][\s\S]*>/i;
					null !== (t = o.exec(e));

				) {
					!1 === a.test(t[0])
						? ((i = t[0]),
						  (r = void 0),
						  ((r = document.createElement('div')).innerHTML = i),
						  (n = r.textContent),
						  (e = e.replace(new RegExp(t[0], 'g'), n)))
						: (e = e.replace(t[0], ''));
				}
				return (this.dom.textContent = e), this;
			}
		}),
		(Se.prototype.content = Se.prototype.text),
		(Se.prototype.css = function (e) {
			var t,
				n = 'ie' === ae.Browser.type && 8 === ae.Browser.version;
			for (var i in e) {
				t = e[i];
				try {
					'opacity' !== i &&
						'zIndex' !== i &&
						'fontWeight' !== i &&
						isFinite(t) &&
						parseFloat(t) === t &&
						(t += 'px');
					var r = Oe(i);
					n && 'opacity' === i
						? (this.dom.style.filter =
								'alpha(opacity=' + 100 * t + ')')
						: n && be.hasAlpha(t)
						? (this.dom.style[r] = new be(t).getHex())
						: (this.dom.style[r] = t);
				} catch (ln) {}
			}
			return this;
		}),
		(Se.prototype.backgroundImage = function (e, t, n, i) {
			var r = t !== undefined && n !== undefined,
				o = { '-ms-high-contrast-adjust': 'none' };
			if (
				('object' == typeof t && (i = t),
				i === undefined && (i = {}),
				r)
			) {
				var a = e.width / e.height,
					s = t,
					h = s / a;
				i.cover && h < n && (s = (h = n) * a),
					i.contain && h > n && (s = (h = n) * a),
					(o.width = s),
					(o.height = h),
					i.center &&
						((o.marginLeft = -s / 2),
						(o.marginTop = -h / 2),
						(o.position = 'absolute'),
						(o.left = '50%'),
						(o.top = '50%')),
					(i.left || i.right) &&
						((o.left = i.left || 0), (o.top = i.top || 0));
			}
			'ie' === ae.Browser.type && 8 === ae.Browser.version
				? (o.filter =
						"progid:DXImageTransform.Microsoft.AlphaImageLoader(src='" +
						e.src +
						"',sizingMethod='scale')")
				: ((o.background = 'url(' + e.src + ')'),
				  (o.backgroundPosition = '50% 50%'),
				  (o.backgroundRepeat = 'no-repeat'),
				  (o.backgroundSize = r
						? s + 'px ' + h + 'px'
						: i.cover
						? 'cover'
						: i.contain
						? 'contain'
						: '100%')),
				this.css.call(this, o);
		}),
		(Se.prototype.setAttribute = function (e, t) {
			var n;
			if ('object' == typeof e)
				for (var i in e) (n = e[i]), this.dom.setAttribute(i, n);
			else this.dom.setAttribute(e, t);
		}),
		(Se.prototype.removeAttribute = function (e, t) {
			var n;
			if ('object' == typeof e)
				for (var i in e) (n = e[i]), this.dom.removeAttribute(i, n);
			else this.dom.removeAttribute(e, t);
		}),
		(Se.prototype.addEventListener = function (e, t, n) {
			var i = {
				event: xe.eventName(e),
				handler: xe.eventCallback(e, t, this.dom),
				callback: t
			};
			this._listeners.push(i),
				this.dom.addEventListener
					? this.dom.addEventListener(i.event, i.handler, n)
					: this.dom.attachEvent('on' + i.event, i.handler);
		}),
		(Se.prototype.removeEventListener = function (e, t, n) {
			for (var i, r = this._listeners.length; --r > -1; )
				(i = this._listeners[r]).event === e &&
					i.callback === t &&
					(this._listeners.splice(r, 1),
					this.dom.removeEventListener
						? this.dom.removeEventListener(i.event, i.handler, n)
						: this.dom.detachEvent('on' + i.event, i.handler));
		}),
		(Se.prototype.focus = function () {
			this.dom.focus();
		}),
		(Se.prototype.blur = function () {
			this.dom.blur();
		}),
		(Se.prototype.html = function (e) {
			return e && (this.dom.innerHTML = e), this.dom.innerHTML;
		}),
		(Se.prototype.__destroy = function () {
			for (var e, t = this._listeners.length; --t > -1; )
				(e = this._listeners[t]),
					this._listeners.splice(t, 1),
					this.dom.removeEventListener
						? this.dom.removeEventListener(e.event, e.handler)
						: this.dom.detachEvent('on' + e.event, e.handler);
			return (
				(this.dom = null),
				(this._clss = []),
				(this._nodes = []),
				(this._listeners = []),
				(this._frag = null),
				(e = null),
				null
			);
		});
	var Ie = function (e, t) {
			var n = {},
				i = Array.prototype.slice.call(arguments, 2);
			for (var r in (t.apply(e, i), e)) n[r] = e[r];
		},
		Pe = function (e, t) {
			(e.prototype = Object.create(t.prototype)),
				(e.prototype.constructor = e);
		};
	function Be(e, t) {
		Ie(this, Se, t || 'div', e), (this.children = []), (this._events = []);
	}
	Pe(Be, Se),
		(Be.prototype.initComponent = function (e, t, n) {
			var i = new e(t);
			return (
				(i._parent = this),
				this.children.push(i),
				i.dom &&
					(n !== undefined
						? n.appendElement && n.appendElement(i)
						: this.appendElement(i)),
				i
			);
		}),
		(Be.prototype.destroy = function () {
			var e = this;
			try {
				we.depth(this, 'children', function (t) {
					if (e !== t)
						for (var n = e.children.length; --n > -1; )
							e.children[n] === t && e.children.splice(n, 1);
					t._destroy && t._destroy(), (t = null);
				});
			} catch (dn) {
				throw new Error('Trouble destroying nodes: ' + dn);
			}
			return null;
		}),
		(Be.prototype._destroy = function () {
			try {
				this.onDestroy && this.onDestroy(),
					this._parent.removeElement &&
						this._parent.removeElement(this);
				for (var e = this._events.length; --e > -1; )
					this._events.splice(e, 1);
				(this.children = null),
					(this._destroy = null),
					(this._events = null),
					(this.destroy = null),
					(this.emit = null),
					(this.on = null),
					(this.off = null),
					(this.initComponent = null);
			} catch (dn) {
				de({ name: 'DomComponent', message: 'Failed to destroy.' });
			}
		}),
		(Be.prototype.on = function (e, t) {
			for (var n = this._events.length, i = !1; --n > -1 && !1 === i; )
				this._events[n].event === e && (i = this._events[n]);
			!1 === i &&
				((i = { event: e, listeners: [] }), this._events.push(i)),
				i.listeners.push(t);
		}),
		(Be.prototype.off = function (e, t) {
			for (var n = this._events.length; --n > -1; )
				if (this._events[n].event === e) {
					for (var i = this._events[n].listeners.length; --i > -1; )
						this._events[n].listeners[i] === t &&
							this._events[n].listeners.splice(i, 1);
					0 === this._events[n].listeners.length &&
						this._events.splice(n, 1);
				}
		}),
		(Be.prototype.emit = function (e) {
			for (
				var t = Array.prototype.slice.call(arguments, 1),
					n = this._events.length;
				--n > -1 && this._events;

			)
				if (this._events[n].event === e)
					for (var i = this._events[n].listeners.length; --i > -1; )
						this._events[n].listeners[i].apply(this, t);
		});
	var Te = [],
		Me = !1,
		Ae = !1;
	function je() {
		document.addEventListener
			? (document.addEventListener('DOMContentLoaded', Le),
			  window.addEventListener('load', Le))
			: (document.attachEvent('onreadystatechange', $e),
			  window.attachEvent('onload', Le)),
			(Me = !0);
	}
	function $e() {
		('interactive' !== document.readyState &&
			'loaded' !== document.readyState &&
			'complete' !== document.readyState) ||
			Le();
	}
	function Le() {
		if (!1 === Ae) {
			for (var e = 0; e < Te.length; e++)
				Te[e].fn.apply(null, Te[e].args);
			Te = [];
		}
		(Ae = !0),
			document.removeEventListener
				? (document.removeEventListener('DOMContentLoaded', Le),
				  window.removeEventListener('load', Le))
				: (document.detachEvent('onreadystatechange', $e),
				  window.detachEvent('onload', Le));
	}
	new Se(document);
	var Re = new Se(window);
	function De(e, t) {
		(this._period = e),
			(this._interval = t),
			(this._date = []),
			(this._data = []),
			(this._prevTimestamp = 0),
			(this._meanPeriod = 0),
			(this._meanCounter = 0);
	}
	(De.prototype.getMeanPeriod = function () {
		return this._meanPeriod;
	}),
		(De.prototype.getData = function () {
			return this._cleanStaleData(), this._data;
		}),
		(De.prototype.getSize = function () {
			return this._cleanStaleData(), this._data.length;
		}),
		(De.prototype.getCapacity = function () {
			return 0 === this._period
				? this._interval
				: Math.ceil(this._interval / this._period);
		}),
		(De.prototype.push = function (e, t) {
			this._cleanStaleData();
			var n = 0 === this._date.length;
			if (
				(e - (this._date[this._date.length - 1] || 0) >= this._period &&
					(this._date.push(e), this._data.push(t)),
				!n)
			) {
				var i = e - this._prevTimestamp;
				(this._meanPeriod =
					(this._meanPeriod * this._meanCounter + i) /
					(this._meanCounter + 1)),
					this._meanCounter++;
			}
			this._prevTimestamp = e;
		}),
		(De.prototype._cleanStaleData = function () {
			for (var e = Date.now(), t = this._date.length - 1; t >= 0; t--) {
				if (e - this._date[t] >= this._interval) {
					this._date.splice(0, t + 1), this._data.splice(0, t + 1);
					break;
				}
			}
		});
	var Ne = {
			touchstart: 'ts',
			touchend: 'te',
			touchmove: 'tm',
			touchcancel: 'tc'
		},
		ze = { mousedown: 'md', mouseup: 'mu', mousemove: 'mm' },
		We = { keydown: 'kd', keyup: 'ku' },
		Fe = { devicemotion: 'dm' },
		Ue = function (e, t) {
			var n = ze[e],
				i = null;
			return function (e) {
				(i = (function (e) {
					return [e.windowX, e.windowY, Date.now()];
				})(e)),
					t(n, i);
			};
		},
		Je = function (e, t) {
			var n = Ne[e],
				i = null;
			return function (e) {
				(i = (function (e) {
					var t = [];
					try {
						var n, i;
						if (
							(e.touches && e.touches.length >= 1
								? (n = e.touches)
								: e.changedTouches &&
								  e.changedTouches.length >= 1 &&
								  (n = e.changedTouches),
							n)
						) {
							for (var r = 0; r < n.length; r++)
								(i = xe.eventCoords(n[r])) &&
									t.push([n[r].identifier, i.x, i.y]);
							t.push(Date.now());
						}
						return t;
					} catch (dn) {
						return t;
					}
				})(e)),
					t(n, i);
			};
		},
		He = function (e, t) {
			var n = We[e],
				i = null;
			return function (e) {
				(i = (function (e) {
					return [e.keyNum, Date.now()];
				})(e)),
					t(n, i);
			};
		},
		qe = function (e, t) {
			var n = Fe[e],
				i = null,
				r = [];
			return function (e) {
				(i = (function (e, t) {
					(e.acceleration === undefined ||
						(e.acceleration && e.acceleration.x === undefined)) &&
						(e.acceleration = { x: 0, y: 0, z: 0 });
					(e.rotationRate === undefined ||
						(e.rotationRate &&
							e.rotationRate.alpha === undefined)) &&
						(e.rotationRate = { alpha: 0, beta: 0, gamma: 0 });
					var n = [
							e.acceleration.x,
							e.acceleration.y,
							e.acceleration.z,
							e.rotationRate.alpha,
							e.rotationRate.beta,
							e.rotationRate.gamma,
							Date.now()
						],
						i = [];
					if (0 === t.length) (t = n), (i = n);
					else {
						for (var r, o = 0, a = 0; a < 6; a++)
							(r = t[a] - n[a]), i.push(n[a]), (o += Math.abs(r));
						if ((i.push(Date.now()), (t = n), o <= 0)) return null;
					}
					return { motion: i, prevmotion: t };
				})(e, r)),
					null !== i && ((r = i.prevmotion), (i = i.motion), t(n, i));
			};
		};
	function Xe() {
		(this._manifest = {}),
			(this.state = {
				timeBuffers: {},
				loadTime: Date.now(),
				recording: !1,
				initRecord: !1,
				record: { mouse: !0, touch: !0, keys: !1, motion: !0 }
			}),
			(this._recordEvent = this._recordEvent.bind(this));
	}
	(Xe.prototype.record = function (e, t, n, i) {
		if (
			((this._manifest.st = Date.now()),
			(this.state.record.mouse =
				e === undefined ? this.state.record.mouse : e),
			(this.state.record.touch =
				n === undefined ? this.state.record.touch : n),
			(this.state.record.keys =
				t === undefined ? this.state.record.keys : t),
			(this.state.record.motion =
				i === undefined ? this.state.record.motion : i),
			!1 === this.state.initRecord)
		) {
			var r = new Se(document.body);
			this.state.record.mouse &&
				(r.addEventListener(
					'mousedown',
					Ue('mousedown', this._recordEvent),
					!0
				),
				r.addEventListener(
					'mousemove',
					Ue('mousemove', this._recordEvent),
					!0
				),
				r.addEventListener(
					'mouseup',
					Ue('mouseup', this._recordEvent),
					!0
				)),
				!0 === this.state.record.keys &&
					(r.addEventListener(
						'keyup',
						He('keyup', this._recordEvent),
						!0
					),
					r.addEventListener(
						'keydown',
						He('keydown', this._recordEvent),
						!0
					)),
				this.state.record.touch &&
					!0 === ae.Browser.hasEvent('touchstart', document.body) &&
					(r.addEventListener(
						'touchstart',
						Je('touchstart', this._recordEvent),
						!0
					),
					r.addEventListener(
						'touchmove',
						Je('touchmove', this._recordEvent),
						!0
					),
					r.addEventListener(
						'touchend',
						Je('touchend', this._recordEvent),
						!0
					)),
				this.state.record.motion &&
					!0 === ae.Browser.hasEvent('devicemotion', window) &&
					r.addEventListener(
						'devicemotion',
						qe('devicemotion', this._recordEvent),
						!0
					),
				(this.state.initRecord = !0);
		}
		this.state.recording = !0;
	}),
		(Xe.prototype.stop = function () {
			this.state.recording = !1;
		}),
		(Xe.prototype.time = function () {
			return this.state.loadTime;
		}),
		(Xe.prototype.getData = function () {
			for (var e in this.state.timeBuffers)
				(this._manifest[e] = this.state.timeBuffers[e].getData()),
					(this._manifest[e + '-mp'] =
						this.state.timeBuffers[e].getMeanPeriod());
			return this._manifest;
		}),
		(Xe.prototype.setData = function (e, t) {
			this._manifest[e] = t;
		}),
		(Xe.prototype.resetData = function () {
			(this._manifest = {}), (this.state.timeBuffers = {});
		}),
		(Xe.prototype.circBuffPush = function (e, t) {
			this._recordEvent(e, t);
		}),
		(Xe.prototype._recordEvent = function (e, t) {
			if (!1 !== this.state.recording)
				try {
					var n = t[t.length - 1];
					this.state.timeBuffers[e] ||
						(this.state.timeBuffers[e] = new De(16, 15e3)),
						this.state.timeBuffers[e].push(n, t);
				} catch (dn) {
					ue(
						'Event recording error: ' + JSON.stringify(dn),
						'error',
						'motion'
					);
				}
		});
	var Ye = new Xe();
	function Ge(e, t) {
		'object' != typeof e || t || ((t = e), (e = null));
		var n,
			i,
			r,
			o = !0 === (t = t || {}).async,
			a = new Promise(function (e, t) {
				(i = e), (r = t);
			});
		if (
			((a.resolve = i),
			(a.reject = r),
			(n = e ? Y.getById(e) : Y.getByIndex(0)))
		)
			Ye.setData('exec', !0),
				o && n.setPromise(a),
				n.onReady(n.initChallenge, t);
		else if (e) {
			if (!o) throw new U(e);
			a.reject(W);
		} else {
			if (!o) throw new J();
			a.reject(N);
		}
		if (o) return a;
	}
	function Ve(e) {
		var t = '',
			n = null;
		n = e ? Y.getById(e) : Y.getByIndex(0);
		try {
			for (var i = Y.getSession(), r = i.length, o = !1; --r > -1 && !o; )
				(o = i[r][1] === n.id) && (t = i[r][0]);
		} catch (a) {
			t = '';
		}
		return t;
	}
	var Qe = {
			'af': 'Afrikaans',
			'sq': 'Albanian',
			'am': 'Amharic',
			'ar': 'Arabic',
			'hy': 'Armenian',
			'az': 'Azerbaijani',
			'eu': 'Basque',
			'be': 'Belarusian',
			'bn': 'Bengali',
			'bg': 'Bulgarian',
			'bs': 'Bosnian',
			'my': 'Burmese',
			'ca': 'Catalan',
			'ceb': 'Cebuano',
			'zh': 'Chinese',
			'zh-CN': 'Chinese Simplified',
			'zh-TW': 'Chinese Traditional',
			'co': 'Corsican',
			'hr': 'Croatian',
			'cs': 'Czech',
			'da': 'Danish',
			'nl': 'Dutch',
			'en': 'English',
			'eo': 'Esperanto',
			'et': 'Estonian',
			'fa': 'Persian',
			'fi': 'Finnish',
			'fr': 'French',
			'fy': 'Frisian',
			'gd': 'Gaelic',
			'gl': 'Galacian',
			'ka': 'Georgian',
			'de': 'German',
			'el': 'Greek',
			'gu': 'Gujurati',
			'ht': 'Haitian',
			'ha': 'Hausa',
			'haw': 'Hawaiian',
			'he': 'Hebrew',
			'hi': 'Hindi',
			'hmn': 'Hmong',
			'hu': 'Hungarian',
			'is': 'Icelandic',
			'ig': 'Igbo',
			'id': 'Indonesian',
			'ga': 'Irish',
			'it': 'Italian',
			'ja': 'Japanese',
			'jw': 'Javanese',
			'kn': 'Kannada',
			'kk': 'Kazakh',
			'km': 'Khmer',
			'rw': 'Kinyarwanda',
			'ky': 'Kirghiz',
			'ko': 'Korean',
			'ku': 'Kurdish',
			'lo': 'Lao',
			'la': 'Latin',
			'lv': 'Latvian',
			'lt': 'Lithuanian',
			'lb': 'Luxembourgish',
			'mk': 'Macedonian',
			'mg': 'Malagasy',
			'ms': 'Malay',
			'ml': 'Malayalam',
			'mt': 'Maltese',
			'mi': 'Maori',
			'mr': 'Marathi',
			'mn': 'Mongolian',
			'ne': 'Nepali',
			'no': 'Norwegian',
			'ny': 'Nyanja',
			'or': 'Oriya',
			'pl': 'Polish',
			'pt-BR': 'Portuguese (Brazil)',
			'pt': 'Portuguese (Portugal)',
			'ps': 'Pashto',
			'pa': 'Punjabi',
			'ro': 'Romanian',
			'ru': 'Russian',
			'sm': 'Samoan',
			'sn': 'Shona',
			'sd': 'Sindhi',
			'si': 'Singhalese',
			'sr': 'Serbian',
			'sk': 'Slovak',
			'sl': 'Slovenian',
			'so': 'Somani',
			'st': 'Southern Sotho',
			'es': 'Spanish',
			'su': 'Sundanese',
			'sw': 'Swahili',
			'sv': 'Swedish',
			'tl': 'Tagalog',
			'tg': 'Tajik',
			'ta': 'Tamil',
			'tt': 'Tatar',
			'te': 'Teluga',
			'th': 'Thai',
			'tr': 'Turkish',
			'tk': 'Turkmen',
			'ug': 'Uyghur',
			'uk': 'Ukrainian',
			'ur': 'Urdu',
			'uz': 'Uzbek',
			'vi': 'Vietnamese',
			'cy': 'Welsh',
			'xh': 'Xhosa',
			'yi': 'Yiddish',
			'yo': 'Yoruba',
			'zu': 'Zulu'
		},
		Ke = {
			zh: { 'I am human': 'æˆ‘æ˜¯äºº' },
			ar: { 'I am human': 'Ø£Ù†Ø§ Ø§Ù„Ø¥Ù†Ø³Ø§Ù†' },
			af: { 'I am human': 'Ek is menslike' },
			am: { 'I am human': 'áŠ¥áŠ” áˆ°á‹ áŠáŠ' },
			hy: { 'I am human': 'ÔµÕ½ Õ´Õ¡Ö€Õ¤ Õ¥Õ´' },
			az: { 'I am human': 'MÉ™n insanam' },
			eu: { 'I am human': 'Gizakia naiz' },
			bn: { 'I am human': 'à¦†à¦®à¦¿ à¦®à¦¾à¦¨à¦¬ à¦¨à¦‡' },
			bg: { 'I am human': 'ÐÐ· ÑÑŠÐ¼ Ñ‡Ð¾Ð²ÐµÐº' },
			ca: { 'I am human': 'SÃ³c humÃ ' },
			hr: { 'I am human': 'Ja sam Äovjek' },
			cs: { 'I am human': 'Jsem ÄlovÄ›k' },
			da: { 'I am human': 'Jeg er et menneske' },
			nl: { 'I am human': 'Ik ben een mens' },
			et: { 'I am human': 'Ma olen inimeste' },
			fi: { 'I am human': 'Olen ihminen' },
			fr: { 'I am human': 'Je suis humain' },
			gl: { 'I am human': 'Eu son humano' },
			ka: { 'I am human': 'áƒ›áƒ” áƒ•áƒáƒ  áƒáƒ“áƒáƒ›áƒ˜áƒáƒœáƒ˜' },
			de: { 'I am human': 'Ich bin ein Mensch' },
			el: { 'I am human': 'Î•Î¯Î¼Î±Î¹ Î¬Î½Î¸ÏÏ‰Ï€Î¿Ï‚' },
			gu: { 'I am human': 'àª¹à«àª‚ àª®àª¾àª¨àªµ àª›à«àª‚' },
			iw: { 'I am human': '. ×× ×™ ×× ×•×©×™' },
			hi: { 'I am human': 'à¤®à¥ˆà¤‚ à¤®à¤¾à¤¨à¤µ à¤¹à¥‚à¤‚' },
			hu: { 'I am human': 'Nem vagyok robot' },
			is: { 'I am human': 'Ã‰g er manneskja' },
			id: { 'I am human': 'Aku manusia' },
			it: { 'I am human': 'Sono un essere umano' },
			ja: { 'I am human': 'ç§ã¯äººé–“ã§ã™' },
			kn: { 'I am human': 'à²¨à²¾à²¨à³ à²®à²¾à²¨à²µà²¨à³' },
			ko: { 'I am human': 'ì‚¬ëžŒìž…ë‹ˆë‹¤' },
			lo: { 'I am human': 'àº‚à»‰àº­àºà»€àº›àº±àº™àº¡àº°àº™àº¸àº”' },
			lv: { 'I am human': 'Es esmu cilvÄ“ks' },
			lt: { 'I am human': 'AÅ¡ esu Å¾mogaus' },
			ms: { 'I am human': 'Saya manusia' },
			ml: { 'I am human': 'à´žà´¾àµ» à´®à´¨àµà´·àµà´¯à´¨à´¾à´£àµ' },
			mr: { 'I am human': 'à¤®à¥€ à¤®à¤¾à¤¨à¤µà¥€ à¤†à¤¹à¥‡' },
			mn: { 'I am human': 'Ð‘Ð¸ Ð±Ð¾Ð» Ñ…Ò¯Ð½' },
			no: { 'I am human': 'Jeg er menneskelig' },
			fa: { 'I am human': 'Ù…Ù† Ø§Ù†Ø³Ø§Ù†ÛŒ Ù‡Ø³ØªÙ…' },
			pl: { 'I am human': 'Jestem czÅ‚owiekiem' },
			pt: { 'I am human': 'Sou humano' },
			ro: { 'I am human': 'Eu sunt om' },
			ru: { 'I am human': 'Ð¯ Ñ‡ÐµÐ»Ð¾Ð²ÐµÐº' },
			sr: { 'I am human': 'Ja sam ljudski' },
			si: { 'I am human': 'à¶¸à¶¸ à¶¸à·’à¶±à·’à·ƒà·Šà·ƒà·”' },
			sk: { 'I am human': 'Ja som Älovek' },
			sl: { 'I am human': 'Jaz sem ÄloveÅ¡ki' },
			es: { 'I am human': 'Soy humano' },
			sw: { 'I am human': 'Mimi ni binadamu' },
			sv: { 'I am human': 'Jag Ã¤r mÃ¤nniska' },
			ta: { 'I am human': 'à®¨à®¾à®©à¯ à®®à®©à®¿à®¤' },
			te: { 'I am human': 'à°¨à±‡à°¨à± à°®à°¨à°¿à°·à°¿à°¨à°¿' },
			th: { 'I am human': 'à¸œà¸¡à¸¡à¸™à¸¸à¸©à¸¢à¹Œ' },
			tr: { 'I am human': 'Ben bir insanÄ±m' },
			uk: { 'I am human': 'Ð¯ Ð»ÑŽÐ´Ð¸Ð½Ð¸' },
			ur: { 'I am human': 'Ù…ÛŒÚº Ø§Ù†Ø³Ø§Ù† ÛÙˆÚº' },
			vi: { 'I am human': 'TÃ´i lÃ  con ngÆ°á»i' },
			zu: { 'I am human': 'Ngingumuntu' }
		},
		Ze = null,
		et = {
			translate: function (e, t) {
				var n = et.getBestTrans(Ke),
					i = n && n[e];
				if (((i = i || e), t))
					for (var r = Object.keys(t), o = r.length; o--; )
						i = i.replace(
							new RegExp('{{' + r[o] + '}}', 'g'),
							t[r[o]]
						);
				return i;
			},
			getBestTrans: function (e) {
				var t = et.getLocale();
				return t in e
					? e[t]
					: et.getShortLocale(t) in e
					? e[et.getShortLocale(t)]
					: 'en' in e
					? e.en
					: null;
			},
			getLocale: function () {
				var e =
						Ze ||
						window.navigator.userLanguage ||
						window.navigator.language,
					t = et.getShortLocale(e);
				return (
					'in' === t && (e = 'id'),
					'iw' === t && (e = 'he'),
					'nb' === t && (e = 'no'),
					'ji' === t && (e = 'yi'),
					'zh-CN' === e && (e = 'zh'),
					'jv' === t && (e = 'jw'),
					Qe[e] ? e : Qe[t] ? t : 'en'
				);
			},
			setLocale: function (e) {
				Ze = e;
			},
			getShortLocale: function (e) {
				return e.indexOf('-') >= 0 ? e.substring(0, e.indexOf('-')) : e;
			},
			isShortLocale: function (e) {
				return 2 === e.length || 3 === e.length;
			},
			addTable: function (e, t) {
				if ((t || (t = Object.create(null)), Ke[e])) {
					var n = Ke[e];
					for (var i in t) n[i] = t[i];
				} else Ke[e] = t;
				return Ke[e];
			},
			getTable: function (e) {
				return Ke[e];
			},
			addTables: function (e) {
				for (var t in e) et.addTable(t, e[t]);
				return Ke;
			},
			getTables: function () {
				return Ke;
			}
		};
	function tt(e, t) {
		var n = e instanceof HTMLIFrameElement;
		try {
			n
				? e.parentNode &&
				  e.contentWindow.postMessage(JSON.stringify(t), '*')
				: e.postMessage(JSON.stringify(t), '*');
		} catch (ln) {
			ue(ln.message, 'error', 'messaging');
		}
	}
	function nt(e, t) {
		(this.target = e),
			(this.id = t),
			(this.messages = []),
			(this.incoming = []),
			(this.waiting = []);
	}
	function it(e, t) {
		var n = this,
			i = {},
			r = new Promise(function (e, t) {
				(i.resolve = e), (i.reject = t);
			}),
			o = {
				source: 'hcaptcha',
				label: e,
				id: n.id,
				promise: null,
				lookup: t
			};
		return (
			r
				.then(function (e) {
					(o.promise = 'resolve'),
						null !== e && (o.contents = e),
						tt(n.target, o);
				})
				['catch'](function (e) {
					(o.promise = 'reject'),
						null !== e && (o.error = e),
						tt(n.target, o);
				}),
			i
		);
	}
	(nt.prototype.setID = function (e) {
		this.id = e;
	}),
		(nt.prototype.contact = function (e, t) {
			if (!this.id)
				throw new Error(
					'Chat requires unique id to communicate between windows'
				);
			var n = this,
				i = Date.now().toString(36),
				r = {
					source: 'hcaptcha',
					label: e,
					id: this.id,
					promise: 'create',
					lookup: i
				};
			if (t) {
				if ('object' != typeof t)
					throw new Error('Message must be an object.');
				r.contents = t;
			}
			return new Promise(function (t, o) {
				n.waiting.push({ label: e, reject: o, resolve: t, lookup: i }),
					tt(n.target, r);
			});
		}),
		(nt.prototype.listen = function (e, t) {
			if (!this.id)
				throw new Error(
					'Chat requires unique id to communicate between windows'
				);
			for (var n = this.messages.length, i = !1; --n > -1 && !1 === i; )
				this.messages[n].label === e && (i = this.messages[n]);
			!1 === i &&
				((i = { label: e, listeners: [] }), this.messages.push(i)),
				i.listeners.push(t);
		}),
		(nt.prototype.answer = function (e, t) {
			if (!this.id)
				throw new Error(
					'Chat requires unique id to communicate between windows'
				);
			for (var n = this.incoming.length, i = !1; --n > -1 && !1 === i; )
				this.incoming[n].label === e && (i = this.incoming[n]);
			!1 === i &&
				((i = { label: e, listeners: [] }), this.incoming.push(i)),
				i.listeners.push(t);
		}),
		(nt.prototype.send = function (e, t) {
			if (!this.id)
				throw new Error(
					'Chat requires unique id to communicate between windows'
				);
			var n = { source: 'hcaptcha', label: e, id: this.id };
			if (t) {
				if ('object' != typeof t)
					throw new Error('Message must be an object.');
				n.contents = t;
			}
			tt(this.target, n);
		}),
		(nt.prototype.check = function (e, t) {
			for (
				var n = [].concat.apply(
						[],
						[this.messages, this.incoming, this.waiting]
					),
					i = [],
					r = -1;
				++r < n.length;

			)
				if (n[r].label === e) {
					if (t && n[r].lookup && t !== n[r].lookup) continue;
					i.push(n[r]);
				}
			return i;
		}),
		(nt.prototype.respond = function (e) {
			for (
				var t,
					n,
					i = -1,
					r = 0,
					o = [].concat.apply(
						[],
						[this.messages, this.incoming, this.waiting]
					);
				++i < o.length;

			)
				if (o[i].label === e.label) {
					if (e.lookup && o[i].lookup && e.lookup !== o[i].lookup)
						continue;
					var a = [];
					if (
						((t = o[i]),
						e.error && a.push(e.error),
						e.contents && a.push(e.contents),
						e.promise && 'create' !== e.promise)
					) {
						t[e.promise].apply(t[e.promise], a);
						for (
							var s = this.waiting.length, h = !1;
							--s > -1 && !1 === h;

						)
							this.waiting[s].label === t.label &&
								this.waiting[s].lookup === t.lookup &&
								((h = !0), this.waiting.splice(s, 1));
						continue;
					}
					for (r = 0; r < t.listeners.length; r++) {
						if (((n = t.listeners[r]), 'create' === e.promise)) {
							var c = it.call(this, t.label, e.lookup);
							a.push(c);
						}
						n.apply(n, a);
					}
				}
			o = null;
		}),
		(nt.prototype.destroy = function () {
			return (
				(this.messages = null),
				(this.incoming = null),
				(this.waiting = null),
				null
			);
		});
	var rt = {
		chats: [],
		isSupported: function () {
			return !!window.postMessage;
		},
		createChat: function (e, t) {
			var n = new nt(e, t);
			return rt.chats.push(n), n;
		},
		addChat: function (e) {
			rt.chats.push(e);
		},
		removeChat: function (e) {
			for (var t = !1, n = rt.chats.length; --n > -1 && !1 === t; )
				e.id === rt.chats[n].id &&
					e.target === rt.chats[n].target &&
					((t = rt.chats[n]), rt.chats.splice(n, 1));
			return t;
		},
		handle: function (e) {
			var t = e.data;
			if ('string' == typeof t)
				try {
					if (!(t.indexOf('hcaptcha') >= 0)) return;
					t = JSON.parse(t);
					for (var n, i = rt.chats, r = -1; ++r < i.length; )
						(n = i[r]).id === t.id && n.respond(t);
				} catch (ln) {
					pe('postMessage handler error', 'postMessage', 'debug', {
						event: e,
						error: ln
					});
				}
		}
	};
	function ot(e, t) {
		for (var n in t) {
			var i = t[n];
			switch (typeof i) {
				case 'string':
					e[n] = i;
					break;
				case 'object':
					(e[n] = e[n] || {}), ot(e[n], i);
					break;
				default:
					throw new Error(
						'Source theme contains invalid data types. Only string and object types are supported.'
					);
			}
		}
	}
	function at(e, t) {
		try {
			return e in t;
		} catch (n) {
			return !1;
		}
	}
	function st(e) {
		return !!e && 'object' == typeof e;
	}
	function ht(e) {
		return st(e) ? ct({}, e) : e;
	}
	function ct(e, t) {
		var n,
			i = {},
			r = Object.keys(e);
		for (n = 0; n < r.length; n++) i[r[n]] = ht(e[r[n]]);
		var o,
			a,
			s = Object.keys(t);
		for (n = 0; n < s.length; n++) {
			var h = s[n];
			if (
				!(
					!at((o = h), (a = e)) ||
					(Object.hasOwnProperty.call(a, o) &&
						Object.propertyIsEnumerable.call(a, o))
				)
			)
				return;
			at(h, e) && st(e[h]) ? (i[h] = ct(e[h], t[h])) : (i[h] = ht(t[h]));
		}
		return i;
	}
	window.addEventListener
		? window.addEventListener('message', rt.handle)
		: window.attachEvent('onmessage', rt.handle);
	var lt = { transparent: 'transparent', white: '#ffffff', black: '#000000' },
		dt = {
			100: '#fafafa',
			200: '#f5f5f5',
			300: '#E0E0E0',
			400: '#D7D7D7',
			500: '#BFBFBF',
			600: '#919191',
			700: '#555555',
			800: '#333333',
			900: '#222222',
			1e3: '#14191F'
		},
		ut = '#4DE1D2',
		pt = '#00838F',
		ft = {
			mode: 'light',
			grey: dt,
			primary: { main: pt },
			secondary: { main: ut },
			warn: { light: '#EB5757', main: '#EB5757', dark: '#DE3F3F' },
			text: { heading: dt[700], body: dt[700] }
		},
		mt = {
			mode: 'dark',
			grey: dt,
			primary: { main: pt },
			secondary: { main: ut },
			text: { heading: dt[200], body: dt[200] }
		};
	function gt(e, t) {
		return 'dark' === t && e in mt ? mt[e] : ft[e];
	}
	function yt() {
		(this._themes = Object.create(null)),
			(this._active = 'light'),
			this.add('light', {}),
			this.add('dark', { palette: { mode: 'dark' } });
	}
	(yt.prototype.get = function (e) {
		if (!e) return this._themes[this._active];
		var t = this._themes[e];
		if (!t) throw new Error('Cannot find theme with name: ' + e);
		return t;
	}),
		(yt.prototype.use = function (e) {
			this._themes[e]
				? (this._active = e)
				: console.error('Cannot find theme with name: ' + e);
		}),
		(yt.prototype.active = function () {
			return this._active;
		}),
		(yt.prototype.add = function (e, t) {
			t || (t = {}),
				(t.palette = (function (e) {
					e || (e = {});
					var t = e.mode || 'light',
						n = e.primary || gt('primary', t),
						i = e.secondary || gt('secondary', t),
						r = e.warn || gt('warn', t),
						o = e.grey || gt('grey', t),
						a = e.text || gt('text', t);
					return ct(
						{
							common: lt,
							mode: t,
							primary: n,
							secondary: i,
							grey: o,
							warn: r,
							text: a
						},
						e
					);
				})(t.palette)),
				(t.component = t.component || Object.create(null)),
				(this._themes[e] = t);
		}),
		(yt.prototype.extend = function (e, t) {
			'string' == typeof t && (t = JSON.parse(t));
			var n = JSON.parse(JSON.stringify(this.get(e)));
			return ot(n, t), n;
		}),
		(yt.merge = function (e, t) {
			return ct(e, t || {});
		});
	var vt = ['light', 'dark', 'contrast', 'grey-red'],
		wt = new yt();
	function bt() {
		try {
			return Object.keys(window).sort().join(',');
		} catch (dn) {
			return null;
		}
	}
	function _t(e, t) {
		(this.id = e),
			(this.width = null),
			(this.height = null),
			(this.mobile = !1),
			(this.ready = !1),
			(this.listeners = []),
			(this.config = t),
			(this._visible = !1),
			(this._selected = !1),
			(this.$iframe = new Se('iframe')),
			(this._host = se.host || window.location.hostname);
		var n = se.assetUrl;
		he.assethost &&
			(n = he.assethost + se.assetUrl.replace(se.assetDomain, '')),
			(this.$iframe.dom.src =
				n +
				'/hcaptcha-challenge.html#id=' +
				this.id +
				'&host=' +
				this._host +
				(t ? '&' + V(this.config) : '')),
			(this.$iframe.dom.title = 'Main content of the hCaptcha challenge'),
			(this.$iframe.dom.frameBorder = 0),
			(this.$iframe.dom.scrolling = 'no'),
			this.setupParentContainer(t),
			this._hasCustomContainer
				? (this._hideIframe(),
				  this._parent.appendChild(this.$iframe.dom))
				: ((this.$container = new Se('div')),
				  (this.$wrapper = this.$container.createElement('div')),
				  (this.$overlay = this.$container.createElement('div')),
				  (this.$arrow = this.$container.createElement('div')),
				  (this.$arrow.fg = this.$arrow.createElement('div')),
				  (this.$arrow.bg = this.$arrow.createElement('div')),
				  this.style.call(this),
				  this.$wrapper.appendElement(this.$iframe),
				  this._parent.appendChild(this.$container.dom),
				  this.$container.setAttribute('aria-hidden', !0)),
			(this.chat = rt.createChat(this.$iframe.dom, e));
	}
	function xt(e, t, n) {
		(this.id = t),
			(this.response = null),
			(this.location = { tick: null, offset: null, bounding: null }),
			(this.config = n),
			(this._ticked = !0),
			(this.$container = e instanceof Se ? e : new Se(e)),
			(this._host = se.host || window.location.hostname),
			(this.$iframe = new Se('iframe'));
		var i = se.assetUrl;
		he.assethost &&
			(i = he.assethost + se.assetUrl.replace(se.assetDomain, '')),
			(this.$iframe.dom.src =
				i +
				'/hcaptcha-checkbox.html#id=' +
				this.id +
				'&host=' +
				this._host +
				(n ? '&' + V(this.config) : '')),
			(this.$iframe.dom.title =
				'widget containing checkbox for hCaptcha security challenge'),
			(this.$iframe.dom.tabIndex = this.config.tabindex || 0),
			(this.$iframe.dom.frameBorder = '0'),
			(this.$iframe.dom.scrolling = 'no'),
			this.config.size &&
				'invisible' === this.config.size &&
				this.$iframe.setAttribute('aria-hidden', 'true'),
			this.$iframe.setAttribute('data-hcaptcha-widget-id', t),
			this.$iframe.setAttribute('data-hcaptcha-response', ''),
			this.$container.appendElement(this.$iframe),
			'off' !== he.recaptchacompat &&
				((this.$textArea0 = this.$container.createElement(
					'textarea',
					'#g-recaptcha-response-' + t
				)),
				(this.$textArea0.dom.name = 'g-recaptcha-response'),
				this.$textArea0.css({ display: 'none' })),
			(this.$textArea1 = this.$container.createElement(
				'textarea',
				'#h-captcha-response-' + t
			)),
			(this.$textArea1.dom.name = 'h-captcha-response'),
			this.$textArea1.css({ display: 'none' }),
			(this.chat = rt.createChat(this.$iframe.dom, t)),
			(this.clearLoading = this.clearLoading.bind(this));
	}
	function Ct(e, t, n) {
		if (!n.sitekey) throw new H();
		(this.id = t),
			(this.visible = !1),
			(this.overflow = {
				override: !1,
				cssUsed: !0,
				value: null,
				scroll: 0
			}),
			(this.onError = null),
			(this.onPass = null),
			(this.onExpire = null),
			(this.onChalExpire = null),
			(this.onOpen = null),
			(this.onClose = null),
			(this._ready = !1),
			(this._active = !1),
			(this._listeners = []),
			(this.config = n),
			vt.indexOf(n.theme) >= 0 && wt.use(n.theme),
			(this._state = {
				escaped: !1,
				passed: !1,
				expiredChallenge: !1,
				expiredResponse: !1
			}),
			(this._origData = null),
			(this._promise = null),
			(this._responseTimer = null),
			(this.challenge = new _t(t, n)),
			(this.checkbox = new xt(e, t, n)),
			(this.initChallenge = this.initChallenge.bind(this)),
			(this.closeChallenge = this.closeChallenge.bind(this)),
			(this.displayChallenge = this.displayChallenge.bind(this)),
			(this.getGetCaptchaManifest =
				this.getGetCaptchaManifest.bind(this));
	}
	function kt() {
		Ie(this, Se, 'canvas');
		var e = this;
		(this.element = this.dom),
			(this.ctx = this.element.getContext('2d')),
			(this.scale = 1),
			(this.dpr = window.devicePixelRatio || 1),
			(this.clearColor = '#fff'),
			(this.ctx.roundedRect = function (t, n, i, r, o) {
				var a = i > 0 ? o : -o,
					s = r > 0 ? o : -o;
				e.ctx.beginPath(),
					e.ctx.moveTo(t + a, n),
					e.ctx.lineTo(t + i - a, n),
					e.ctx.quadraticCurveTo(t + i, n, t + i, n + s),
					e.ctx.lineTo(t + i, n + r - s),
					e.ctx.quadraticCurveTo(t + i, n + r, t + i - a, n + r),
					e.ctx.lineTo(t + a, n + r),
					e.ctx.quadraticCurveTo(t, n + r, t, n + r - s),
					e.ctx.lineTo(t, n + s),
					e.ctx.quadraticCurveTo(t, n, t + a, n),
					e.ctx.closePath();
			});
	}
	function Et(e) {
		(e = e || {}),
			(this.x = e.x || 0),
			(this.y = e.y || 0),
			(this.rotate = this.rotate.bind(this)),
			(this.getDistance = this.getDistance.bind(this)),
			(this.radius = 0),
			(this.tolerance = 0),
			(this.fill = !1),
			(this.stroke = !1),
			(this.fillColor = '#fff'),
			(this.strokeColor = '#fff'),
			(this.strokeWidth = 1);
	}
	function Ot(e, t, n) {
		Ie(this, Et, e),
			(this.handleIn = new Et(t)),
			(this.handleOut = new Et(n)),
			(this.prev = null),
			(this.next = null),
			(this.index = 0);
	}
	function St(e) {
		if (null === e) return '';
		var t = [];
		return It(e, t), t.join('&');
	}
	function It(e, t) {
		var n, i;
		if ('object' == typeof e)
			for (i in e)
				!0 === Pt((n = e[i])) ? It(n, t) : (t[t.length] = Bt(i, n));
		else if (!0 === Array.isArray(e))
			for (var r = 0; r < e.length; r++)
				!0 === Pt((n = e[r])) ? It(e, t) : (t[t.length] = Bt(i, n));
		else t[t.length] = Bt(e);
	}
	function Pt(e) {
		return !0 === Array.isArray(e) || 'object' == typeof e;
	}
	function Bt(e, t) {
		return (
			encodeURIComponent(e) +
			'=' +
			encodeURIComponent(null === t ? '' : t)
		);
	}
	wt.add('contrast', {}),
		wt.add('grey-red', {
			component: { challenge: { main: { border: '#6a6a6a' } } }
		}),
		(_t.prototype.setupParentContainer = function (e) {
			var t,
				n = e['challenge-container'];
			n && (t = 'string' == typeof n ? document.getElementById(n) : n),
				t
					? ((this._hasCustomContainer = !0), (this._parent = t))
					: ((this._hasCustomContainer = !1),
					  (this._parent = document.body));
		}),
		(_t.prototype._hideIframe = function () {
			var e = {};
			'ie' !== ae.Browser.type ||
			('ie' === ae.Browser.type && 8 !== ae.Browser.version)
				? ((e.opacity = 0), (e.visibility = 'hidden'))
				: (e.display = 'none'),
				this.$iframe.setAttribute('aria-hidden', !0),
				this.$iframe.css(e);
		}),
		(_t.prototype._showIframe = function () {
			var e = {};
			'ie' !== ae.Browser.type ||
			('ie' === ae.Browser.type && 8 !== ae.Browser.version)
				? ((e.opacity = 1), (e.visibility = 'visible'))
				: (e.display = 'block'),
				this.$iframe.removeAttribute('aria-hidden'),
				this.$iframe.css(e);
		}),
		(_t.prototype.style = function () {
			var e = (function (e) {
				var t = e.palette,
					n = e.component;
				return yt.merge(
					{ main: { fill: t.common.white, border: t.grey[400] } },
					n.challenge
				);
			})(wt.get());
			if (this._hasCustomContainer)
				this.$iframe.css({
					border: 0,
					position: 'relative',
					backgroundColor: e.main.fill
				});
			else {
				var t = {
					backgroundColor: e.main.fill,
					border: '1px solid ' + e.main.border,
					boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 4px',
					borderRadius: 4,
					left: -1e4,
					top: -1e4,
					zIndex: -9999999999999,
					position: 'absolute'
				};
				'ie' !== ae.Browser.type ||
				('ie' === ae.Browser.type && 8 !== ae.Browser.version)
					? ((t.transition = 'opacity 0.15s ease-out'),
					  (t.opacity = 0),
					  (t.visibility = 'hidden'))
					: (t.display = 'none'),
					this.$container.css(t),
					this.$wrapper.css({ position: 'relative', zIndex: 1 }),
					this.$overlay.css({
						width: '100%',
						height: '100%',
						position: 'fixed',
						pointerEvents: 'none',
						top: 0,
						left: 0,
						zIndex: 0,
						backgroundColor: e.main.fill,
						opacity: 0.05
					}),
					this.$arrow.css({
						borderWidth: 11,
						position: 'absolute',
						pointerEvents: 'none',
						marginTop: -11,
						zIndex: 1,
						right: '100%'
					}),
					this.$arrow.fg.css({
						borderWidth: 10,
						borderStyle: 'solid',
						borderColor:
							'transparent rgb(255, 255, 255) transparent transparent',
						position: 'relative',
						top: 10,
						zIndex: 1
					}),
					this.$arrow.bg.css({
						borderWidth: 11,
						borderStyle: 'solid',
						borderColor:
							'transparent ' +
							e.main.border +
							' transparent transparent',
						position: 'relative',
						top: -11,
						zIndex: 0
					}),
					this.$iframe.css({
						border: 0,
						zIndex: 2e9,
						position: 'relative'
					});
			}
		}),
		(_t.prototype.setup = function (e) {
			return this.chat.send('create-challenge', e);
		}),
		(_t.prototype.sendTranslation = function (e) {
			var t = { locale: e, table: et.getTable(e) || {} };
			this.chat && this.chat.send('challenge-translate', t);
		}),
		(_t.prototype.isVisible = function () {
			return this._visible;
		}),
		(_t.prototype.getDimensions = function (e, t) {
			return this._visible
				? this.chat.contact('resize-challenge', { width: e, height: t })
				: Promise.resolve(null);
		}),
		(_t.prototype.show = function () {
			if (!0 !== this._visible)
				if (((this._visible = !0), this._hasCustomContainer))
					this._showIframe();
				else {
					var e = { zIndex: 9999999999999, display: 'block' };
					('ie' !== ae.Browser.type ||
						('ie' === ae.Browser.type &&
							8 !== ae.Browser.version)) &&
						((e.opacity = 1), (e.visibility = 'visible')),
						this.$container.css(e),
						this.$container.removeAttribute('aria-hidden'),
						this.$overlay.css({
							pointerEvents: 'auto',
							cursor: 'pointer'
						}),
						this.$iframe.dom.focus();
				}
		}),
		(_t.prototype.close = function (e) {
			if (((this._visible = !1), this._hasCustomContainer))
				return (
					this._hideIframe(),
					void this.chat.send('close-challenge', { event: e })
				);
			var t = { left: -1e4, top: -1e4, zIndex: -9999999999999 };
			'ie' !== ae.Browser.type ||
			('ie' === ae.Browser.type && 8 !== ae.Browser.version)
				? ((t.opacity = 0), (t.visibility = 'hidden'))
				: (t.display = 'none'),
				this.$container.css(t),
				this._hasCustomContainer ||
					this.$overlay.css({
						pointerEvents: 'none',
						cursor: 'default'
					}),
				this.chat.send('close-challenge', { event: e }),
				this.$container.setAttribute('aria-hidden', !0);
		}),
		(_t.prototype.size = function (e, t, n) {
			(this.width = e),
				(this.height = t),
				(this.mobile = n),
				this.$iframe.css({ width: e, height: t }),
				this._hasCustomContainer ||
					(this.$wrapper.css({ width: e, height: t }),
					n
						? this.$overlay.css({ opacity: 0.5 })
						: this.$overlay.css({ opacity: 0.05 }));
		}),
		(_t.prototype.position = function (e) {
			if (!this._hasCustomContainer && e) {
				var t = 10,
					n = window.document.documentElement,
					i = ae.Browser.scrollY(),
					r = ae.Browser.width(),
					o = ae.Browser.height(),
					a =
						this.mobile ||
						'invisible' === this.config.size ||
						e.offset.left + e.tick.x <= e.tick.width / 2,
					s = Math.round(e.bounding.top) + i !== e.offset.top,
					h = this.height > n.clientHeight,
					c = a
						? (r - this.width) / 2
						: e.bounding.left + e.tick.right + 10;
				(c + this.width + t > r || c < 0) &&
					((c = (r - this.width) / 2), (a = !0));
				var l =
						(n.scrollHeight < n.clientHeight
							? n.clientHeight
							: n.scrollHeight) -
						this.height -
						t,
					d = a
						? (o - this.height) / 2 + i
						: e.bounding.top + e.tick.y + i - this.height / 2;
				s && d < i && (d = i + t),
					s &&
						d + this.height >= i + o &&
						(d = i + o - (this.height + t)),
					(d = Math.max(Math.min(d, l), 10));
				var u = e.bounding.top + e.tick.y + i - d - 10,
					p = this.height - 10 - 30;
				return (
					(u = Math.max(Math.min(u, p), t)),
					this.$container.css({ left: c, top: d }),
					this.$arrow.fg.css({ display: a ? 'none' : 'block' }),
					this.$arrow.bg.css({ display: a ? 'none' : 'block' }),
					this.$arrow.css({ top: u }),
					(this.top = d),
					this.$container.dom.getBoundingClientRect(),
					h
				);
			}
		}),
		(_t.prototype.destroy = function () {
			this._visible && this.close.call(this),
				this._hasCustomContainer
					? this._parent.removeChild(this.$iframe.dom)
					: (this._parent.removeChild(this.$container.dom),
					  (this.$container = this.$container.__destroy())),
				(this.$iframe = this.$iframe.__destroy()),
				rt.removeChat(this.chat),
				(this.chat = this.chat.destroy());
		}),
		(_t.prototype.setReady = function (e) {
			if (((this.ready = e), this.ready))
				for (var t, n = this.listeners.length; --n > -1; )
					(t = this.listeners[n]), this.listeners.splice(n, 1), t();
		}),
		(_t.prototype.onReady = function (e) {
			var t = Array.prototype.slice.call(arguments, 1),
				n = function () {
					e.apply(null, t);
				};
			this.ready ? n() : this.listeners.push(n);
		}),
		(_t.prototype.onOverlayClick = function (e) {
			this._hasCustomContainer ||
				this.$overlay.addEventListener('click', e);
		}),
		(_t.prototype.setConfig = function (e) {
			return this.chat
				? this.chat.contact('challenge-update', e)
				: Promise.resolve();
		}),
		(_t.prototype.setData = function (e) {
			this.chat && this.chat.send('challenge-data', e);
		}),
		(xt.prototype.setResponse = function (e) {
			(this.response = e),
				this.$iframe.dom.setAttribute('data-hcaptcha-response', e),
				'off' !== he.recaptchacompat && (this.$textArea0.dom.value = e),
				(this.$textArea1.dom.value = e);
		}),
		(xt.prototype.style = function () {
			switch (this.config.size) {
				case 'compact':
					this.$iframe.css({ width: 164, height: 144 });
					break;
				case 'invisible':
					this.$iframe.css({ display: 'none' });
					break;
				default:
					this.$iframe.css({
						width: 303,
						height: 78,
						overflow: 'hidden'
					});
			}
		}),
		(xt.prototype.reset = function () {
			(this._ticked = !1), this.chat && this.chat.send('checkbox-reset');
		}),
		(xt.prototype.clearLoading = function () {
			this.chat && this.chat.send('checkbox-clear');
		}),
		(xt.prototype.sendTranslation = function (e) {
			var t = { locale: e, table: et.getTable(e) || {} };
			this.chat && this.chat.send('checkbox-translate', t);
		}),
		(xt.prototype.status = function (e, t) {
			this.chat &&
				this.chat.send('checkbox-status', {
					text: e || null,
					a11yOnly: t || !1
				});
		}),
		(xt.prototype.tick = function () {
			(this._ticked = !0), this.chat && this.chat.send('checkbox-tick');
		}),
		(xt.prototype.getTickLocation = function () {
			return this.chat.contact('checkbox-location');
		}),
		(xt.prototype.getOffset = function () {
			var e = this.$iframe.dom;
			e.offsetParent || (e = e.parentElement);
			for (var t = 0, n = 0; e; )
				(t += e.offsetLeft), (n += e.offsetTop), (e = e.offsetParent);
			return { top: n, left: t };
		}),
		(xt.prototype.getBounding = function () {
			return this.$iframe.dom.getBoundingClientRect();
		}),
		(xt.prototype.destroy = function () {
			this._ticked && this.reset(),
				this.$container.removeElement(this.$iframe),
				this.$container.removeElement(this.$textArea1),
				'off' !== he.recaptchacompat &&
					(this.$container.removeElement(this.$textArea0),
					(this.$textArea0 = this.$textArea0.__destroy())),
				(this.$textArea1 = this.$textArea1.__destroy()),
				(this.$container = this.$container.__destroy()),
				(this.$iframe = this.$iframe.__destroy()),
				rt.removeChat(this.chat),
				(this.chat = this.chat.destroy());
		}),
		(Ct.prototype._resetTimer = function () {
			null !== this._responseTimer &&
				(clearTimeout(this._responseTimer),
				(this._responseTimer = null));
		}),
		(Ct.prototype.initChallenge = function (e) {
			e || (e = {}), (this._origData = e);
			var t = this.getGetCaptchaManifest(),
				n = e.charity || null,
				i = e.a11yChallenge || !1,
				r = e.link || null,
				o = e.action || '',
				a = e.rqdata || null,
				s = ae.Browser.width(),
				h = ae.Browser.height();
			(this._active = !0),
				this._resetTimer(),
				this._resetState(),
				this.checkbox.setResponse(''),
				this.challenge.setup({
					a11yChallenge: i,
					manifest: t,
					width: s,
					height: h,
					charity: n,
					link: r,
					action: o,
					rqdata: a,
					wdata: bt()
				});
		}),
		(Ct.prototype.getGetCaptchaManifest = function () {
			var e = (this._origData || {}).manifest || null;
			return (
				e || ((e = Object.create(null)).st = Date.now()),
				(e.v = 1),
				(e.topLevel = Ye.getData()),
				(e.session = Y.getSession()),
				(e.widgetList = Y.getCaptchaIdList()),
				(e.widgetId = this.id),
				(e.href = window.location.href),
				(e.prev = JSON.parse(JSON.stringify(this._state))),
				e
			);
		}),
		(Ct.prototype.displayChallenge = function (e) {
			if (this._active) {
				var t = this;
				this.visible = !0;
				var n = this.checkbox,
					i = this.challenge,
					r = ae.Browser.height();
				if (!('ie' === ae.Browser.type && 8 === ae.Browser.version)) {
					var o = window
						.getComputedStyle(document.body)
						.getPropertyValue('overflow-y');
					(this.overflow.override = 'hidden' === o),
						this.overflow.override &&
							((this.overflow.cssUsed =
								'' === document.body.style.overflow &&
								'' === document.body.style.overflowY),
							this.overflow.cssUsed ||
								(this.overflow.value = '' === o ? 'auto' : o),
							(this.overflow.scroll = ae.Browser.scrollY()),
							(document.body.style.overflowY = 'auto'));
				}
				return new Promise(function (o) {
					n.status(),
						n.getTickLocation().then(function (a) {
							if (t._active) {
								if (
									(i.size(e.width, e.height, e.mobile),
									i.show(),
									n.clearLoading(),
									(n.location.bounding = n.getBounding()),
									(n.location.tick = a),
									(n.location.offset = n.getOffset()),
									i.position(n.location))
								)
									(
										window.document.scrollingElement ||
										document.getElementsByTagName('html')[0]
									).scrollTop =
										Math.abs(i.height - r) + i.top;
								o();
							}
						});
				}).then(function () {
					t.onOpen && me(t.onOpen);
				});
			}
		}),
		(Ct.prototype.resize = function (e, t, n) {
			var i = this,
				r = this.checkbox,
				o = this.challenge;
			o.getDimensions(e, t)
				.then(function (e) {
					e && o.size(e.width, e.height, e.mobile),
						(r.location.bounding = r.getBounding()),
						(r.location.offset = r.getOffset()),
						(ae.System.mobile && !n) || o.position(r.location);
				})
				['catch'](function (e) {
					i.closeChallenge.call(i, {
						event: R,
						message: 'Captcha resize caused error.',
						error: e
					});
				});
		}),
		(Ct.prototype.position = function () {
			var e = this.checkbox,
				t = this.challenge;
			ae.System.mobile ||
				((e.location.bounding = e.getBounding()),
				t.position(e.location));
		}),
		(Ct.prototype.reset = function () {
			this.checkbox.reset(),
				this.checkbox.setResponse(''),
				this._resetTimer(),
				this._resetState();
		}),
		(Ct.prototype._resetState = function () {
			for (var e in this._state) this._state[e] = !1;
		}),
		(Ct.prototype.closeChallenge = function (e) {
			(this.visible = !1), (this._active = !1);
			var t = this,
				n = this.checkbox,
				i = this.challenge;
			this.overflow.override &&
				(((
					window.document.scrollingElement ||
					document.getElementsByTagName('html')[0]
				).scrollTop = this.overflow.scroll),
				(this.overflow.override = !1),
				(this.overflow.scroll = 0),
				(document.body.style.overflowY = this.overflow.cssUsed
					? null
					: this.overflow.value));
			var r = e.response || '';
			switch (
				(n.setResponse(r),
				i.close(e.event),
				n.$iframe.dom.focus(),
				e.event)
			) {
				case B:
					(this._state.escaped = !0),
						n.reset(),
						t.onClose && me(t.onClose),
						t._promise && t._promise.reject(T);
					break;
				case M:
					(this._state.expiredChallenge = !0),
						n.reset(),
						n.status('hCaptcha window closed due to timeout.', !0),
						t.onChalExpire && me(t.onChalExpire),
						t._promise && t._promise.reject(M);
					break;
				case R:
				case j:
				case $:
					var o = e.event;
					n.reset(),
						e.event === $
							? (n.status(e.message),
							  429 === e.status
									? (o = L)
									: 'invalid-data' === e.message && (o = A))
							: e.event === j
							? (o = R)
							: e.event === R &&
							  'Answers are incomplete' === e.message &&
							  (o = D),
						this.onError && me(this.onError, o),
						t._promise && t._promise.reject(o);
					break;
				case P:
					(this._state.passed = !0),
						n.tick(),
						this.onPass && me(this.onPass, r),
						t._promise &&
							t._promise.resolve({
								response: r,
								key: Ve(this.id)
							}),
						'number' == typeof e.expiration &&
							(t._resetTimer(),
							(t._responseTimer = setTimeout(function () {
								try {
									n.reset(),
										n.setResponse(''),
										n.status(
											'hCaptcha security token has expired. Please complete the challenge again.',
											!0
										);
								} catch (dn) {
									ue(
										'Checkbox not present or could not destroy on expiration: ' +
											dn.message,
										'error',
										'global'
									);
								}
								t.onExpire && me(t.onExpire),
									(t._responseTimer = null),
									(t._state.expiredResponse = !0);
							}, 1e3 * e.expiration)));
			}
			t._promise = null;
		}),
		(Ct.prototype.updateTranslation = function (e) {
			this.checkbox.sendTranslation(e), this.challenge.sendTranslation(e);
		}),
		(Ct.prototype.isReady = function () {
			return this._ready;
		}),
		(Ct.prototype.setReady = function (e) {
			if (((this._ready = e), this._ready))
				for (var t, n = this._listeners.length; --n > -1; )
					(t = this._listeners[n]), this._listeners.splice(n, 1), t();
		}),
		(Ct.prototype.setPromise = function (e) {
			this._promise = e;
		}),
		(Ct.prototype.onReady = function (e) {
			var t = Array.prototype.slice.call(arguments, 1),
				n = function () {
					e.apply(null, t);
				};
			this._ready ? n() : this._listeners.push(n);
		}),
		(Ct.prototype.destroy = function () {
			(this._resetTimer(), this.overflow.override) &&
				(((
					window.document.scrollingElement ||
					document.getElementsByTagName('html')[0]
				).scrollTop = this.overflow.scroll),
				(this.overflow.override = !1),
				(this.overflow.scroll = 0),
				(document.body.style.overflowY = this.overflow.cssUsed
					? null
					: this.overflow.value));
			this.challenge.destroy(),
				this.checkbox.destroy(),
				(this.challenge = null),
				(this.checkbox = null);
		}),
		(Ct.prototype.setSiteConfig = function (e) {
			var t = e && e.features && e.features.custom_theme;
			if (this.config.themeConfig && t) {
				var n = 'custom-' + this.id;
				wt.add(n, wt.extend(wt.active(), this.config.themeConfig)),
					wt.use(n),
					this.challenge.style();
			}
			return this.challenge.setConfig({ siteConfig: e, wdata: bt() });
		}),
		Pe(kt, Se),
		(kt.prototype.dimensions = function (e, t) {
			this.css({ width: e, height: t }),
				(this.element.width = Math.round(e / this.scale) * this.dpr),
				(this.element.height = Math.round(t / this.scale) * this.dpr),
				this.ctx.scale(this.dpr, this.dpr),
				(this.width = Math.round(e / this.scale)),
				(this.height = Math.round(t / this.scale));
		}),
		(kt.prototype.clear = function () {
			this.ctx &&
				this.ctx.clearRect(
					0,
					0,
					this.element.width,
					this.element.height
				);
		}),
		(kt.prototype.draw = function () {
			this.ctx &&
				((this.ctx.fillStyle = this.clearColor),
				this.ctx.fillRect(
					0,
					0,
					this.element.width,
					this.element.height
				));
		}),
		(kt.prototype._destroy = function () {
			this.__destroy(),
				(this.element = null),
				(this.ctx = null),
				(this.width = null),
				(this.height = null);
		}),
		(Et.prototype.rotate = function (e, t) {
			var n = (function (e) {
					return e * (Math.PI / 180);
				})(t),
				i = Math.sin(n),
				r = Math.cos(n),
				o = this.x - e.x,
				a = this.y - e.y;
			(this.x = o * r - a * i + e.x), (this.y = o * i + a * r + e.y);
		}),
		(Et.prototype.getDistance = function (e) {
			return Math.sqrt(
				Math.pow(this.x - e.x, 2) + Math.pow(this.y - e.y, 2)
			);
		}),
		(Et.prototype.getAngle = function (e) {
			var t = e.x - this.x,
				n = e.y - this.y,
				i = (180 * Math.atan2(n, t)) / Math.PI;
			return i < 0 && (i += 360), i;
		}),
		(Et.prototype.hitTest = function (e) {
			return this.radius + this.tolerance >= this.getDistance(e);
		}),
		(Et.prototype.restrict = function (e, t, n, i) {
			if ('x' !== e && 'y' !== e)
				throw new Error('Point.restrict requires a value: x or y');
			return (
				t + this[e] < n
					? (t = this[e] - n)
					: t + this[e] > i && (t = i - this[e]),
				this[e] + t
			);
		}),
		(Et.prototype.draw = function (e) {
			e.ctx.beginPath(),
				e.ctx.arc(
					this.x,
					this.y,
					this.radius / e.scale,
					0,
					2 * Math.PI,
					!1
				),
				this.fill && ((e.ctx.fillStyle = this.fillColor), e.ctx.fill()),
				this.stroke &&
					((e.ctx.strokeStyle = this.strokeColor),
					(e.ctx.lineWidth = this.strokeWidth / e.scale),
					e.ctx.stroke());
		}),
		Pe(Ot, Et),
		(Ot.prototype.set = function (e, t, n) {
			(this.x = e.x || this.x),
				(this.y = e.y || this.y),
				t === undefined
					? ((this.handleIn.x = this.x), (this.handleIn.y = this.y))
					: ((this.handleIn.x = t.x), (this.handleIn.y = t.y)),
				n === undefined
					? ((this.handleOut.x = this.x), (this.handleOut.y = this.y))
					: ((this.handleOut.x = n.x), (this.handleOut.y = n.y));
		}),
		(Ot.prototype.clone = function () {
			var e = { x: this.x, y: this.y },
				t = { x: this.handleIn.x, y: this.handleIn.y },
				n = { x: this.handleOut.x, y: this.handleOut.y },
				i = new Ot();
			return (
				t.x === n.x && t.y === n.y ? i.set(e) : i.set(e, t, n),
				(i.index = this.index),
				(i.prev = this.prev),
				(i.next = this.next),
				(i.radius = this.radius),
				(i.tolerance = this.tolerance),
				(i.fill = this.fill),
				(i.stroke = this.stroke),
				(i.fillColor = this.fillColor),
				(i.strokeColor = this.strokeColor),
				(i.strokeWidth = this.strokeWidth),
				i
			);
		}),
		(Ot.prototype.move = function (e, t) {
			(this.x += e),
				(this.y += t),
				(this.handleIn.x += e),
				(this.handleIn.y += t),
				(this.handleOut.x += e),
				(this.handleOut.y += t);
		}),
		(Ot.prototype.render = function (e) {
			this.handleIn.x !== this.x &&
				this.handleIn.y !== this.y &&
				this.handleIn.draw(e),
				this.handleOut.x !== this.x &&
					this.handleOut.y !== this.y &&
					this.handleOut.draw(e),
				this.draw(e);
		});
	var Tt = {
			400: 'Rate limited or network error. Please retry.',
			429: 'Your computer or network has sent too many requests.',
			500: 'Cannot contact hCaptcha. Check your connection and try again.'
		},
		Mt = function (e) {
			try {
				return et.translate(Tt[e]);
			} catch (dn) {
				return !1;
			}
		},
		At =
			'undefined' != typeof XDomainRequest &&
			!('withCredentials' in XMLHttpRequest.prototype);
	function jt(e, t, n) {
		n = n || {};
		var i = {
			url: t,
			method: e.toUpperCase(),
			responseType: n.responseType || 'string',
			dataType: n.dataType || null,
			withCredentials: n.withCredentials || !1,
			headers: n.headers || null,
			data: n.data || null,
			timeout: n.timeout || null
		};
		return (
			(i.legacy = i.withCredentials && At),
			i.data &&
				('json' === i.dataType &&
					'object' == typeof i.data &&
					(i.data = JSON.stringify(i.data)),
				'query' === i.dataType && (i.data = St(i.data))),
			n.retry
				? ye(function () {
						return $t(i);
				  }, n.retry)
				: $t(i)
		);
	}
	function $t(e) {
		var t = e.legacy ? new XDomainRequest() : new XMLHttpRequest(),
			n = 'function' == typeof e.url ? e.url() : e.url;
		return new Promise(function (i, r) {
			var o,
				a = function (o) {
					return function () {
						var a = t.response || t.responseText,
							s = t.statusText || '',
							h = t.status,
							c = t.readyState;
						if (4 === c || e.legacy) {
							if ('json' === e.responseType && a)
								try {
									a = JSON.parse(a);
								} catch (l) {}
							if ('error' === o || (h >= 400 && h <= 511))
								return void r({
									event: $,
									endpoint: n,
									response: a,
									state: c,
									status: h,
									message: Mt(h || 400) || s
								});
							i({ state: c, status: h, body: a, message: s });
						}
					};
				};
			if (
				((t.onload = a('complete')),
				(t.onerror = t.ontimeout = a('error')),
				t.open(e.method, n),
				e.timeout && (t.timeout = e.timeout),
				!e.legacy) &&
				((t.withCredentials = e.withCredentials), e.headers)
			)
				for (var s in e.headers)
					(o = e.headers[s]), t.setRequestHeader(s, o);
			setTimeout(function () {
				t.send(e.data);
			}, 0);
		});
	}
	var Lt = function (e, t) {
			if (
				('object' == typeof e && t === undefined && (e = (t = e).url),
				null === e)
			)
				throw new Error('Url missing');
			return jt('GET', e, t);
		},
		Rt = function (e) {
			return e.toLowerCase().match(/\.(?:jpg|gif|png|jpeg|svg)$/g)
				? 'image'
				: e.toLowerCase().match(/\.(?:js)$/g)
				? 'script'
				: 'file';
		},
		Dt = function (e) {
			if (he.assethost && e.indexOf(se.assetDomain) >= 0)
				return he.assethost + e.replace(se.assetDomain, '');
			if (he.imghost && e.indexOf('imgs') >= 0) {
				var t =
					e.indexOf('.ai') >= 0
						? e.indexOf('.ai') + 3
						: e.indexOf('.com') + 4;
				return he.imghost + e.substr(t, e.length);
			}
			return e;
		},
		Nt = ['svg', 'gif', 'png'];
	function zt(e, t) {
		t = t || {};
		var n,
			i = e;
		if (0 === i.indexOf('data:image'))
			for (var r = !1, o = Nt.length, a = -1; a++ < o && !r; )
				(r = i.indexOf(Nt[a]) >= 0) && (n = Nt[a]);
		else n = i.substr(i.lastIndexOf('.') + 1, i.length);
		!!(
			!document.createElementNS ||
			!document.createElementNS('http://www.w3.org/2000/svg', 'svg')
				.createSVGRect
		) &&
			t.fallback &&
			(t.fallback.indexOf('.') >= 0
				? (n = (i = t.fallback).substr(
						i.lastIndexOf('.') + 1,
						i.length
				  ))
				: ((i = e.substr(0, e.indexOf(n)) + t.fallback),
				  (n = t.fallback))),
			t.prefix && (i = t.prefix + '/' + i),
			(this.attribs = { crossOrigin: t.crossOrigin || null }),
			(this.id = i),
			(this.src = Dt(i)),
			(this.ext = n),
			(this.width = 0),
			(this.height = 0),
			(this.aspect = 0),
			(this.loaded = !1),
			(this.error = !1),
			(this.element = null),
			(this.cb = { load: [], error: [] });
	}
	function Wt(e, t, n) {
		for (var i = e[t], r = i.length, o = null; --r > -1; )
			(o = i[r]), i.splice(r, 1), o(n);
		'error' === t ? (e.load = []) : (e.error = []);
	}
	function Ft(e, t) {
		var n = e;
		t || (t = {}),
			t.prefix && (n = t.prefix + '/' + e),
			(this.attribs = {
				defer: t.defer || null,
				async: t.async || null,
				crossOrigin: t.crossOrigin || null
			}),
			(this.id = n),
			(this.src = Dt(n)),
			(this.loaded = !1),
			(this.error = !1),
			(this.element = null),
			(this.cb = { load: [], error: [] });
	}
	function Ut(e, t, n) {
		for (var i = e[t], r = i.length, o = null; --r > -1; )
			(o = i[r]), i.splice(r, 1), o(n);
		'error' === t ? (e.load = []) : (e.error = []);
	}
	function Jt(e, t) {
		var n = e;
		t || (t = {}),
			t.prefix && (n = t.prefix + '/' + e),
			(this.id = n),
			(this.src = Dt(n)),
			(this.loaded = !1),
			(this.error = !1),
			(this.cb = { load: [], error: [] }),
			(this.data = null);
	}
	function Ht(e, t, n) {
		for (var i = e[t], r = i.length, o = null; --r > -1; )
			(o = i[r]), i.splice(r, 1), o(n);
		'error' === t ? (e.load = []) : (e.error = []);
	}
	(zt.prototype.load = function () {
		return ('svg' === this.ext ? this._loadSvg() : this._loadImg())[
			'catch'
		](function (e) {
			throw (ue('Asset failed', 'error', 'assets', { error: e }), e);
		});
	}),
		(zt.prototype._loadSvg = function () {
			var e,
				t = this,
				n = this.src,
				i = this.id;
			if (0 === n.indexOf('data:image/svg+xml')) {
				var r = n.slice('data:image/svg+xml,'.length);
				e = Promise.resolve(decodeURIComponent(r));
			} else
				e = Lt(n).then(function (e) {
					return e.body;
				});
			return e
				.then(function (e) {
					var n = new DOMParser().parseFromString(
							e,
							'image/svg+xml'
						).documentElement,
						i = parseInt(n.getAttribute('width')),
						r = parseInt(n.getAttribute('height'));
					return t._imgLoaded(n, i, r), t;
				})
				['catch'](function (e) {
					t.error = !0;
					var n =
						(e && e.message ? e.message : 'Loading Error') +
						': ' +
						i;
					throw (Wt(t.cb, 'error', n), n);
				});
		}),
		(zt.prototype._loadImg = function () {
			var e = this,
				t = this.attribs,
				n = this.src,
				i = this.id;
			return new Promise(function (r, o) {
				var a = new Image();
				t.crossOrigin && (a.crossOrigin = t.crossOrigin),
					(a.onerror = function (t) {
						(e.error = !0), (a.onload = a.onerror = null);
						var n =
							(t && t.message ? t.message : 'Loading Error') +
							': ' +
							i;
						Wt(e.cb, 'error', n), o(n);
					}),
					(a.onload = function () {
						e.loaded ||
							(e._imgLoaded(a, a.width, a.height),
							(a.onload = a.onerror = null),
							r(e));
					}),
					(a.src = n),
					a.complete && a.onload();
			});
		}),
		(zt.prototype._imgLoaded = function (e, t, n) {
			(this.element = new Se(e)),
				(this.width = t),
				(this.height = n),
				(this.aspect = t / n),
				(this.loaded = !0),
				Wt(this.cb, 'load', this);
		}),
		(zt.prototype.onload = function (e) {
			this.error || (this.loaded ? e(this) : this.cb.load.push(e));
		}),
		(zt.prototype.onerror = function (e) {
			(this.loaded && !this.error) ||
				(this.error ? e(this) : this.cb.error.push(e));
		}),
		(Ft.prototype.load = function () {
			var e = this,
				t = this.attribs,
				n = this.src,
				i = this.id;
			return new Promise(function (r, o) {
				var a = document.createElement('script');
				(e.element = a),
					(a.onerror = function (t) {
						(e.error = !0),
							(a.onload =
								a.onreadystatechange =
								a.onerror =
									null);
						var n = (t.message || 'Loading Error') + ': ' + i;
						Ut(e.cb, 'error', n), o(n);
					}),
					(a.onload = a.onreadystatechange =
						function () {
							this.loaded ||
								(a.readyState &&
									'loaded' !== a.readyState &&
									'complete' !== a.readyState) ||
								((e.loaded = !0),
								(a.onload =
									a.onreadystatechange =
									a.onerror =
										null),
								document.body.removeChild(a),
								Ut(e.cb, 'load', e),
								r(e));
						}),
					(a.type = 'text/javascript'),
					(a.src = n),
					t.crossOrigin && (a.crossorigin = t.crossOrigin),
					t.async && (a.async = !0),
					t.defer && (a.defer = !0),
					document.body.appendChild(a),
					a.complete && a.onload();
			});
		}),
		(Ft.prototype.onload = function (e) {
			this.error || (this.loaded ? e(this) : this.cb.load.push(e));
		}),
		(Ft.prototype.onerror = function (e) {
			(this.loaded && !this.error) ||
				(this.error ? e(this) : this.cb.error.push(e));
		}),
		(Jt.prototype.load = function () {
			var e = this,
				t = this.src,
				n = this.id;
			return new Promise(function (i, r) {
				var o = {};
				t.indexOf('json') >= 0 && (o.responseType = 'json'),
					Lt(t, o)
						.then(function (t) {
							(e.loaded = !0),
								(e.data = t.body),
								Ht(e.cb, 'load', e),
								i(e);
						})
						['catch'](function (t) {
							e.error = !0;
							var i =
								(t && t.message ? t.message : 'Loading Error') +
								': ' +
								n;
							Ht(e.cb, 'error', i), r(i);
						});
			});
		}),
		(Jt.prototype.onload = function (e) {
			this.error || (this.loaded ? e(this) : this.cb.load.push(e));
		}),
		(Jt.prototype.onerror = function (e) {
			(this.loaded && !this.error) ||
				(this.error ? e(this) : this.cb.error.push(e));
		});
	var qt = [],
		Xt = {
			add: function (e, t) {
				var n = Rt(e);
				return Xt[n] ? Xt[n](e, t) : Promise.resolve(null);
			},
			batch: function (e, t) {
				for (var n = [], i = -1; ++i < e.length; ) {
					var r = e[i];
					n.push(Xt.add(r, t));
				}
				return Promise.all(n)['finally'](function () {
					n = [];
				});
			},
			image: function (e, t) {
				var n = new zt(e, t);
				return qt.push(n), n.load();
			},
			script: function (e, t) {
				var n = new Ft(e, t);
				return qt.push(n), n.load();
			},
			file: function (e, t) {
				var n = new Jt(e, t);
				return qt.push(n), n.load();
			},
			retrieve: function (e) {
				return new Promise(function (t, n) {
					for (var i = qt.length, r = !1, o = null; --i > -1 && !r; )
						r =
							(o = qt[i]).id === e ||
							-1 !== o.id.indexOf('/' === e[0] ? '' : '/' + e);
					if (!r) return t(null);
					o.onload(t), o.onerror(n);
				});
			}
		};
	function Yt(e) {
		if ('en' === e) return Promise.resolve();
		var t = e + '.json';
		return new Promise(function (n, i) {
			Xt.retrieve(t)
				.then(function (n) {
					return (
						n ||
						Xt.file(t, {
							prefix: 'https://newassets.hcaptcha.com/captcha/v1/de47910/static/i18n'
						}).then(function (t) {
							return et.addTable(e, t.data), t;
						})
					);
				})
				.then(function (e) {
					n(e.data);
				})
				['catch'](function (e) {
					i(e);
				});
		});
	}
	var Gt = 0,
		Vt = [
			'hl',
			'custom',
			'tplinks',
			'sitekey',
			'theme',
			'size',
			'tabindex',
			'challenge-container'
		];
	var Qt = {
		render: function (e, t) {
			if (
				('string' == typeof e && (e = document.getElementById(e)),
				e && 1 === e.nodeType)
			)
				if (
					(function (e) {
						if (!e || !('challenge-container' in e)) return !0;
						var t = e['challenge-container'];
						return (
							'string' == typeof t &&
								(t = document.getElementById(t)),
							!!t && 1 === t.nodeType
						);
					})(t)
				) {
					if (!1 !== rt.isSupported()) {
						for (
							var n,
								i,
								r = e.getElementsByTagName('iframe'),
								o = -1;
							++o < r.length && !n;

						)
							(i = r[o].getAttribute(
								'data-hcaptcha-widget-id'
							)) && (n = !0);
						if (n)
							return (
								console.error(
									'Only one captcha is permitted per parent container.'
								),
								i
							);
						var a = (function (e, t) {
								for (
									var n = [
											'hl',
											'custom',
											'tplinks',
											'sitekey',
											'theme',
											'type',
											'size',
											'tabindex',
											'callback',
											'expired-callback',
											'chalexpired-callback',
											'error-callback',
											'open-callback',
											'close-callback',
											'endpoint',
											'challenge-container'
										],
										i = {},
										r = 0;
									r < n.length;
									r++
								) {
									var o = n[r],
										a = t && t[o];
									a || (a = e.getAttribute('data-' + o)),
										a && (i[o] = a);
								}
								return i;
							})(e, t),
							s = Gt++ + Math.random().toString(36).substr(2),
							h = Object.create(null);
						(h.sentry = le),
							(h.reportapi = he.reportapi),
							(h.recaptchacompat = he.recaptchacompat),
							(h.custom = he.custom),
							he.endpointOverride &&
								(h.endpoint = he.endpointOverride),
							null !== he.language && (h.hl = et.getLocale()),
							he.assethost && (h.assethost = he.assethost),
							he.imghost && (h.imghost = he.imghost),
							he.tplinks && (h.tplinks = he.tplinks),
							he.se && (h.se = he.se);
						for (var c = 0; c < Vt.length; c++) {
							var l = Vt[c];
							l in a && (h[l] = a[l]);
						}
						if (((h.theme = he.theme), a.theme))
							try {
								var d = a.theme;
								'string' == typeof d && (d = JSON.parse(d)),
									(h.themeConfig = d);
							} catch (dn) {
								h.theme = d;
							}
						if (
							e instanceof HTMLButtonElement ||
							e instanceof HTMLInputElement
						) {
							var u = new Se('div', '.h-captcha');
							u.css({ display: 'none' });
							for (
								var p = null, f = 0;
								f < e.attributes.length;
								f++
							)
								(p = e.attributes[f]).name.startsWith(
									'data-'
								) && u.setAttribute(p.name, p.value);
							var m =
								e.tagName.toLowerCase() +
								"[data-hcaptcha-widget-id='" +
								s +
								"']";
							e.setAttribute('data-hcaptcha-widget-id', s),
								u.setAttribute('data-hcaptcha-source-id', m),
								e.parentNode.insertBefore(u.dom, e),
								(e.onclick = function (e) {
									return e.preventDefault(), Ge(s);
								}),
								(e = u),
								(h.size = 'invisible');
						}
						try {
							var g = new Ct(e, s, h);
							g.challenge.style(), g.checkbox.style();
						} catch (ln) {
							var y =
								'Your browser plugins or privacy policies are blocking the hCaptcha service. Please disable them for hCaptcha.com';
							return (
								ln instanceof H &&
									((y =
										'hCaptcha has failed to initialize. Please see the developer tools console for more information.'),
									console.error(ln.message)),
								void ce(e, y)
							);
						}
						return (
							a.callback && (g.onPass = a.callback),
							a['expired-callback'] &&
								(g.onExpire = a['expired-callback']),
							a['chalexpired-callback'] &&
								(g.onChalExpire = a['chalexpired-callback']),
							a['open-callback'] &&
								(g.onOpen = a['open-callback']),
							a['close-callback'] &&
								(g.onClose = a['close-callback']),
							a['error-callback'] &&
								(g.onError = a['error-callback']),
							Ye.setData('inv', 'invisible' === h.size),
							g.checkbox.chat.listen(
								'checkbox-selected',
								function (e) {
									Ye.setData('exec', !1),
										g.onReady(g.initChallenge, e);
								}
							),
							g.checkbox.chat.listen(
								'checkbox-loaded',
								function (e) {
									(g.checkbox.location.bounding =
										g.checkbox.getBounding()),
										(g.checkbox.location.tick = e),
										(g.checkbox.location.offset =
											g.checkbox.getOffset()),
										g.checkbox.sendTranslation(h.hl);
								}
							),
							g.checkbox.chat.listen(
								'checkbox-setup',
								function (e) {
									he.endpointOverride && (e.endpoint = null),
										g.challenge.onReady(function () {
											g.setSiteConfig(e).then(
												function () {
													g.setReady(!0);
												}
											);
										});
								}
							),
							g.challenge.chat.listen(
								'challenge-loaded',
								function () {
									g.challenge.setReady(!0),
										g.challenge.sendTranslation(h.hl);
								}
							),
							g.challenge.chat.answer(
								'challenge-ready',
								function (e, t) {
									g.displayChallenge(e).then(t.resolve);
								}
							),
							g.challenge.chat.listen(
								'challenge-resize',
								function () {
									var e = ae.Browser.width(),
										t = ae.Browser.height();
									g.resize(e, t);
								}
							),
							g.challenge.chat.listen(T, g.closeChallenge),
							g.challenge.chat.answer('get-url', function (e) {
								e.resolve(window.location.href);
							}),
							g.challenge.chat.answer(
								'getcaptcha-manifest',
								function (e) {
									e.resolve(g.getGetCaptchaManifest());
								}
							),
							g.challenge.chat.answer('check-api', function (e) {
								e.resolve(Ye.getData());
							}),
							g.challenge.chat.listen(
								'challenge-key',
								function (e) {
									Y.pushSession(e.key, g.id);
								}
							),
							g.challenge.onOverlayClick(function () {
								g.closeChallenge({ event: B });
							}),
							g.challenge.chat.listen('challenge-language', v),
							v({ locale: h.hl }, !0),
							g.challenge.chat.answer('get-ac', function (e) {
								e.resolve(G.hasCookie('hc_accessibility'));
							}),
							Y.add(g),
							s
						);
					}
					ce(
						e,
						"Your browser is missing or has disabled Cross-Window Messaging. Please <a style='color:inherit;text-decoration:underline; font: inherit' target='_blank' href='https://www.whatismybrowser.com/guides/how-to-update-your-browser/auto'>upgrade your browser</a> or enable it for hCaptcha.com"
					);
				} else
					console.log(
						"[hCaptcha] render: invalid challenge container '" +
							t['challenge-container'] +
							"'."
					);
			else
				console.log(
					"[hCaptcha] render: invalid container '" + e + "'."
				);
			function v(e, t) {
				var n = e.locale;
				function i(e) {
					if (e)
						try {
							e.updateTranslation(n);
						} catch (ln) {
							ue(
								'Failed to update text translation: ' +
									JSON.stringify(ln),
								'error',
								'translation'
							);
						}
				}
				n &&
					Yt(n)
						.then(function () {
							t ? i(g) : Y.each(i);
						})
						['catch'](function (e) {
							ue('Language failed to load: ' + n, 'error', 'api');
						});
			}
		},
		reset: function (e) {
			var t;
			if (e) {
				if (!(t = Y.getById(e))) throw new U(e);
				t.reset();
			} else {
				if (!(t = Y.getByIndex(0))) throw new J();
				t.reset();
			}
		},
		remove: function (e) {
			var t = e ? Y.getById(e) : Y.getByIndex(0);
			if (!t) throw e ? new U(e) : new J();
			Y.remove(t), t.destroy(), (t = null);
		},
		execute: Ge,
		getResponse: function (e) {
			var t, n;
			if (
				((n = e ? Y.getById(e) : Y.getByIndex(0)) &&
					(t = n.checkbox.response || ''),
				void 0 !== t)
			)
				return t;
			throw e ? new U(e) : new J();
		},
		getRespKey: Ve,
		close: function (e) {
			var t = !1;
			if (!(t = e ? Y.getById(e) : Y.getByIndex(0)))
				throw e ? new U(e) : new J();
			t.closeChallenge({ event: B });
		},
		setData: function (e, t) {
			if (
				('object' != typeof e || t || ((t = e), (e = null)),
				!t || 'object' != typeof t)
			)
				throw Error('[hCaptcha] invalid data supplied');
			var n = !1;
			if (!(n = e ? Y.getById(e) : Y.getByIndex(0)))
				throw e ? new U(e) : new J();
			var i = n.challenge.setData.bind(n.challenge);
			n.onReady(i, t);
		},
		nodes: Y
	};
	se.file = 'hcaptcha';
	var Kt = document.currentScript,
		Zt = !1,
		en = !1,
		tn = 'on',
		nn = ae.Browser.width() / ae.Browser.height(),
		rn = window.hcaptcha || !1;
	function on() {
		var e = ae.Browser.width(),
			t = ae.Browser.height(),
			n = ae.System.mobile && nn !== e / t;
		(nn = e / t),
			hn(),
			Qt.nodes.each(function (i) {
				i.visible && i.resize(e, t, n);
			});
	}
	function an(e) {
		e.preventDefault && e.preventDefault(),
			sn(),
			Qt.nodes.each(function (e) {
				e.visible && e.position();
			});
	}
	function sn() {
		Ye.circBuffPush('xy', [
			ae.Browser.scrollX(),
			ae.Browser.scrollY(),
			document.documentElement.clientWidth / ae.Browser.width(),
			Date.now()
		]);
	}
	function hn() {
		Ye.circBuffPush('wn', [
			ae.Browser.width(),
			ae.Browser.height(),
			ae.System.dpr(),
			Date.now()
		]);
	}
	!(function (e) {
		var t = Array.prototype.slice.call(arguments, 1);
		!0 !== Ae &&
		'interactive' !== document.readyState &&
		'loaded' !== document.readyState &&
		'complete' !== document.readyState
			? (Te.push({ fn: e, args: t }), !1 === Me && je())
			: setTimeout(function () {
					e(t);
			  }, 1);
	})(function () {
		rn ||
			(!(function () {
				var e;
				e = Kt ? [Kt] : document.getElementsByTagName('script');
				var t = -1,
					n = !1,
					i = null,
					r = null;
				for (; ++t < e.length && !1 === n; )
					e[t] &&
						e[t].src &&
						((r = (i = e[t].src.split('?'))[0]),
						/\/(hcaptcha|1\/api)\.js$/.test(r) &&
							((n = e[t]),
							r &&
								-1 !== r.toLowerCase().indexOf('www.') &&
								console.warn(
									'[hCaptcha] JS API is being loaded from www.hcaptcha.com. Please use https://js.hcaptcha.com/1/api.js'
								)));
				if (!1 === n) return;
				var o = (function (e) {
					for (
						var t,
							n,
							i,
							r = {},
							o = e
								? e.indexOf('&') >= 0
									? e.split('&')
									: [e]
								: [],
							a = 0;
						a < o.length;
						a++
					)
						if (o[a].indexOf('=') >= 0) {
							if (
								((t = o[a].split('=')),
								(n = decodeURIComponent(t[0])),
								('false' !== (i = decodeURIComponent(t[1])) &&
									'true' !== i) ||
									(i = 'true' === i),
								'theme' === n || 'themeConfig' === n)
							)
								try {
									i = JSON.parse(i);
								} catch (dn) {}
							r[n] = i;
						}
					return r;
				})(i[1]);
				(Zt = o.onload || !1),
					(en = o.render || !1),
					'off' === o.tplinks && (tn = 'off');
				(he.tplinks = tn),
					(he.language = o.hl || null),
					o.endpoint && (he.endpointOverride = o.endpoint);
				(he.reportapi = o.reportapi || he.reportapi),
					(he.imghost = o.imghost || null),
					(he.custom = o.custom || he.custom),
					(he.se = o.se || null),
					(he.assethost = o.assethost || null),
					he.assethost &&
						!ge.URL(he.assethost) &&
						((he.assethost = null),
						console.error('Invalid assethost uri.'));
				(he.recaptchacompat = o.recaptchacompat || he.recaptchacompat),
					(se.host = o.host || window.location.hostname),
					(he.language =
						he.language ||
						window.navigator.userLanguage ||
						window.navigator.language),
					et.setLocale(he.language),
					(a = o.sentry === undefined || o.sentry),
					void (le = a),
					'off' === he.recaptchacompat
						? console.log('recaptchacompat disabled')
						: (window.grecaptcha = cn);
				var a;
			})(),
			(function () {
				var e = et.getLocale();
				if (e.indexOf('en') >= 0) return;
				Yt(e)
					.then(function () {
						Qt.nodes.each(function (t) {
							if (t)
								try {
									t.updateTranslation(e);
								} catch (ln) {
									ue(
										'Failed to update text translation: ' +
											JSON.stringify(ln),
										'error',
										'translation'
									);
								}
						});
					})
					['catch'](function () {
						ue('Language failed to load: ' + e, 'error', 'api');
					});
			})(),
			!1 === en || 'onload' === en
				? (function (e) {
						for (
							var t =
									document.getElementsByClassName(
										'h-captcha'
									),
								n = [],
								i = 0;
							i < t.length;
							i++
						)
							n.push(t[i]);
						var r = [];
						if ('off' !== he.recaptchacompat)
							for (
								var o =
										document.getElementsByClassName(
											'g-recaptcha'
										),
									a = 0;
								a < o.length;
								a++
							)
								r.push(o[a]);
						for (var s = [].concat(n, r), h = 0; h < s.length; h++)
							e(s[h]);
				  })(Qt.render)
				: 'explicit' !== en &&
				  console.log(
						"hcaptcha: invalid render parameter '" +
							en +
							"', using 'explicit' instead."
				  ),
			Zt &&
				setTimeout(function () {
					me(Zt);
				}, 1),
			(function () {
				try {
					Ye.record(),
						Ye.setData('sc', ae.Browser.getScreenDimensions()),
						Ye.setData('nv', ae.Browser.interrogateNavigator()),
						Ye.setData('dr', document.referrer),
						hn(),
						sn();
				} catch (ln) {}
			})(),
			Re.addEventListener('resize', on),
			Re.addEventListener('scroll', an));
	});
	var cn = {
		render: Qt.render,
		remove: Qt.remove,
		execute: Qt.execute,
		reset: Qt.reset,
		close: Qt.close,
		setData: Qt.setData,
		getResponse: Qt.getResponse,
		getRespKey: Qt.getRespKey
	};
	return cn;
})();
