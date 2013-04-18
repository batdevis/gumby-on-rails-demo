/**
* Gumby Framework
* ---------------
*
* Follow @gumbycss on twitter and spread the love.
* We worked super hard on making this awesome and released it to the web.
* All we ask is you leave this intact. #gumbyisawesome
*
* Gumby Framework
* http://gumbyframework.com
*
* Built with love by your friends @digitalsurgeons
* http://www.digitalsurgeons.com
*
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/
!function() {

	'use strict';

	function Gumby() {
		this.$dom = $(document);
		this.isOldie = !!this.$dom.find('html').hasClass('oldie');
		this.click = this.detectClickEvent();
		this.uiModules = {};
		this.inits = {};
		this.onReady = false;
		this.onOldie = false;

		var scope = this;

		// when document ready call oldie callback
		this.$dom.ready(function() {
			if(scope.isOldie && scope.onOldie) {
				scope.onOldie();
			}
		});
	}

	// initialize Gumby
	Gumby.prototype.init = function() {
		// init UI modules
		this.initUIModules();

		// call ready callback if available
		if(this.onReady) {
			this.onReady();
		}
	};

	// public helper - return debuggin object including uiModules object
	Gumby.prototype.debug = function() {
		return {
			$dom: this.$dom,
			isOldie: this.isOldie,
			uiModules: this.uiModules
		};
	};

	// public helper - set Gumby ready callback
	Gumby.prototype.ready = function(code) {
		if(code && typeof code === 'function') {
			this.onReady = code;
		}
	};

	// public helper - set oldie callback
	Gumby.prototype.oldie = function(code) {
		if(code && typeof code === 'function') {
			this.onOldie = code;
		}
	};

	// grab attribute value, testing data- gumby- and no prefix
	Gumby.prototype.selectAttr = function() {
		var i = 0;

		// any number of attributes can be passed
		for(; i < arguments.length; i++) {
			// various formats
			var attr = arguments[i],
				dataAttr = 'data-'+arguments[i],
				gumbyAttr = 'gumby-'+arguments[i];

			// first test for data-attr
			if(this.attr(dataAttr)) {
				return this.attr(dataAttr);

			// next test for gumby-attr
			} else if(this.attr(gumbyAttr)) {
				return this.attr(gumbyAttr);

			// finally no prefix
			} else if(this.attr(attr)) {
				return this.attr(attr);
			}
		}

		// none found
		return false;
	};

	// add an initialisation method
	Gumby.prototype.addInitalisation = function(ref, code) {
		this.inits[ref] = code;
	};

	// initialize a uiModule
	Gumby.prototype.initialize = function(ref) {
		if(this.inits[ref] && typeof this.inits[ref] === 'function') {
			this.inits[ref]();
		}
	};

	// store a UI module
	Gumby.prototype.UIModule = function(data) {
		var module = data.module;
		this.uiModules[module] = data;
	};

	// loop round and init all UI modules
	Gumby.prototype.initUIModules = function() {
		var x;
		for(x in this.uiModules) {
			this.uiModules[x].init();
		}
	};

	// use touchy events if available otherwise click
	Gumby.prototype.detectClickEvent = function() {
		if(Modernizr.touch) {
			this.setupTapEvent();
			return 'gumbyTap';
		} else {
			return 'click';
		}
	};

	// set up gumbyTap jQuery.specialEvent
	Gumby.prototype.setupTapEvent = function() {
		$.event.special.gumbyTap = {
			setup: function(data) {
				$(this).bind('touchstart touchend touchmove', $.event.special.gumbyTap.handler);
			},

			teardown: function() {
				$(this).unbind('touchstart touchend touchmove', $.event.special.gumbyTap.handler);
			},

			handler: function(event) {
				var $this = $(this);
				// touch start event so store ref to tap event starting
				if(event.type === 'touchstart') {
					$this.data('gumbyTouchStart', true);
				// touchmove event so cancel tap event
				} else if(event.type === 'touchmove') {
					$this.data('gumbyTouchStart', false);
				// touchend event so if tap event ref still present, we have a tap!
				} else if($this.data('gumbyTouchStart')) {
					$this.data('gumbyTouchStart', false);
					event.type = "gumbyTap";
					$this.click(function(e) { e.stopImmediatePropagation(); });
					$.event.handle.apply(this, arguments);
				}
			}
		};
	};

	window.Gumby = new Gumby();

}();
