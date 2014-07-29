var Checkbox;

Checkbox = (function() {
  Checkbox.uncheckRadio = false;

  Checkbox.prototype.checkedElms = {};

  function Checkbox(options) {
    this.options = options || {};
    this.checkboxes = options.checkboxes, this.uncheckRadio = options.uncheckRadio;
    this.uncheckRadio = this.uncheckRadio || false;
    $(this.checkboxes).each((function(index, element) {
      var elm, inner, other, outer;
      elm = $(element);
      outer = $("<div>", {
        "class": "outer-" + elm.attr("type")
      });
      inner = $("<div>", {
        "class": "inner-" + elm.attr("type")
      });
      if (elm.is(':checked') === true) {
        outer.addClass("checked");
        elm.closest(".list-group-item").addClass("checked");
        other = elm.closest(".list-group-item").children(".other");
        if (other.length > 0) {
          other.removeClass("hide");
        }
        this.checkedElms[$(elm).attr("name")] = $(elm);
      }
      outer.insertBefore(elm).append(inner);
      elm.click(this.checkboxChanged.bind({
        uncheckRadio: this.uncheckRadio,
        outer: outer,
        input: elm,
        scope: this
      })).addClass("hide").addClass("doValidate");
    }).bind(this));
    this.checkboxChanged.call({
      uncheckRadio: this.uncheckRadio,
      scope: this,
      options: this.options
    }, false);
  }

  Checkbox.prototype.resetCheckboxes = function() {
    return this.checkedElms = {};
  };

  Checkbox.prototype.checkboxChanged = function(e) {
    var elm, inputName, scope;
    elm = $(this.input);
    inputName = elm.attr("name");
    scope = this.scope;
    if (elm.attr("type") === "radio") {
      if (this.uncheckRadio === true) {
        if (inputName in scope.checkedElms) {
          if (scope.checkedElms[inputName].is(elm) === true) {
            elm.closest(".list-group-item").removeClass("checked");
            elm.prop('checked', false).prev().removeClass("checked");
            delete scope.checkedElms[inputName];
            elm.trigger("change");
            return;
          }
        }
      }
    }
    $('input[name="' + inputName + '"]').each(function(index, element) {
      var elm2;
      elm2 = $(element);
      if (elm2.is(':checked') === true) {
        elm2.prev().addClass("checked");
        elm2.closest(".list-group-item").addClass("checked");
      } else {
        elm2.prev().removeClass("checked");
        elm2.closest(".list-group-item").removeClass("checked");
      }
      scope.checkedElms[inputName] = $(elm);
    });
  };

  return Checkbox;

})();

var Questionnaire;

Questionnaire = (function() {
  function Questionnaire(options) {
    options = options || {};
    options.check = new Checkbox(options);
    options.scale = new ScaleTable(options);
    options.other = new Other(options);
    options.validation = new Validation(options);
    options.table = new Table(options);
    options.sortable = new SortableClass(options);
  }

  return Questionnaire;

})();

var Other;

Other = (function() {
  function Other(options) {
    this.options = options || {};
    this.options.other = this.options.other || false;
    this.options.other.each((function(index, element) {
      var elm, input, inputName;
      elm = $(element);
      input = elm.prev().find('input');
      inputName = input.attr("name");
      input.change(this.otherChanged.bind({
        input: input,
        container: elm,
        options: this.options
      }));
      $($('input[name="' + inputName + '"]')).each((function(ind, elm2) {
        elm2 = $(elm2);
        if (elm2.is(input) === false) {
          elm2.change(this.otherChanged.bind({
            input: input,
            container: elm,
            options: this.options
          }));
        }
      }).bind(this));
    }).bind(this));
  }

  Other.prototype.otherChanged = function(e) {
    if (this.input.is(":checked") === true) {
      this.container.removeClass("hide");
    } else {
      this.container.addClass("hide");
      this.container.parents('.has-error').each((function(ind, elm) {
        $(elm).removeClass('has-error');
      }).bind(this));
      this.container.removeClass('has-error');
      this.container.children('.help-block').each((function(ind, elm) {
        return $(elm).css('display', 'none');
      }).bind(this));
    }
  };

  return Other;

})();

var ScaleTable;

ScaleTable = (function() {
  function ScaleTable(options) {
    this.options = options || {};
    this.options.selectRequired = this.options.selectRequired || " -- Selecteer een optie --";
    this.scaleTable = options.scaleTable;
    $(this.scaleTable).each((function(index, element) {
      var elm;
      elm = $(element);
      $(elm.find('tbody tr')).each((function(trIndex, trElm) {
        var sel, td, tr;
        options = $(trElm).find('td:not(.title) input');
        $(trElm).addClass("input-row");
        tr = $("<tr>", {
          "class": 'select-row'
        });
        td = $('<td colspan="' + (options.length + 1) + '">');
        sel = $('<select>');
        tr.insertAfter($(trElm));
        tr.append(td);
        td.append(sel);
        sel.append($('<option>', {
          text: this.options.selectRequired,
          value: ""
        })).change(this.selectChanged.bind({
          select: sel,
          tr: $(trElm),
          options: this.options
        }));
        $(options).each((function(tdIndex, inputElm) {
          var tmp;
          inputElm = $(inputElm);
          tmp = $('<option>', {
            html: inputElm.data('label'),
            value: inputElm.val()
          });
          inputElm.change(this.inputChanged.bind({
            select: sel,
            input: inputElm,
            tr: $(trElm)
          }));
          inputElm.on("inputChanged", this.inputChanged.bind({
            select: sel,
            input: inputElm,
            tr: $(trElm)
          }));
          sel.append(tmp);
        }).bind(this));
      }).bind(this));
    }).bind(this));
  }

  ScaleTable.prototype.inputChanged = function(e) {
    if (this.tr.find(":checked").length === 0) {
      this.select.val("");
    } else {
      this.select.val(this.input.val());
    }
  };

  ScaleTable.prototype.selectChanged = function(e) {
    var active, input;
    active = this.select.find(":selected");
    input = this.tr.find("input[value='" + active.val() + "']");
    if (active.val() === "") {
      this.tr.find("input:checked").prop('checked', false);
      this.tr.find(".checked").removeClass('checked');
      this.options.check.resetCheckboxes();
    } else {
      input.prop('checked', true).prev().addClass('checked');
    }
    input.trigger('click');
  };

  return ScaleTable;

})();

var SortableClass;

SortableClass = (function() {
  SortableClass.prototype.list = "sortable-list";

  function SortableClass(options) {
    var scope;
    this.options = options || {};
    scope = this;
    $("#" + this.list + ' li').each(function(ind, elm) {
      var div;
      elm = $(elm);
      div = $('<div>', {
        'class': 'handle',
        'html': '<i class="fa fa-arrows"></i>'
      });
      elm.prepend(div).find('select').data('current-position', ind + 1).change(function(evt) {
        var currentListPosition, currentPosition, li, selectedPosition;
        selectedPosition = parseFloat($(this).find("option:selected").data('position'));
        currentPosition = selectedPosition - 1;
        currentListPosition = parseFloat($(this).data('current-position'));
        li = $(this).closest('li');
        if (currentPosition === 0) {
          $("#" + scope.list).prepend(li);
        } else if (currentPosition < currentListPosition) {
          $("#" + scope.list + ' li').eq(currentPosition).before(li);
        } else {
          $("#" + scope.list + ' li').eq(currentPosition).after(li);
        }
        scope.updateOrder.call(scope);
        scope.showOrder.call(scope, $(this).closest('li'));
      });
    });
    if (document.getElementById(this.list) != null) {
      this.sortableInstance = new Sortable(document.getElementById(this.list), {
        handle: '.handle',
        onEnd: function(evt) {
          scope.updateOrder.call(scope);
          scope.showOrder.call(scope, $(evt.item));
        }
      });
    }
    return;
  }

  SortableClass.prototype.showOrder = function(elm) {
    var orginalCss;
    orginalCss = elm.css('backgroundColor');
    elm.css("backgroundColor", "#fffbdf");
    setTimeout(function() {
      return elm.attr("style", "");
    }, 1200);
  };

  SortableClass.prototype.updateOrder = function() {
    $("#" + this.list + ' li').each((function(ind, elm) {
      var indx, selects;
      selects = $(elm).find('select');
      if (selects.length > 0) {
        indx = ind + 1;
        $(selects).data('current-position', indx).find('option[data-position="' + indx + '"]').prop('selected', 'selected');
      }
    }).bind(this));
  };

  return SortableClass;

})();

var Table;

Table = (function() {
  function Table(options) {
    var num;
    num = 0;
    $('table[data-type="scale"] tbody tr.input-row').each((function(trIndex, trElm) {
      var className, elm;
      elm = $(trElm);
      className = num === 0 ? "odd" : "even";
      if (elm.hasClass('input-row')) {
        elm.addClass(className);
        if (elm.next().hasClass('select-row')) {
          elm.next().addClass(className);
        }
      }
      if (num === 0) {
        num = 1;
      } else {
        num = 0;
      }
    }).bind(this));
    return;
  }

  return Table;

})();

var Validation;

Validation = (function() {
  Validation.prototype.form = $("#questionnaireForm");

  Validation.prototype.bootstrap = {
    input: '.form-group',
    inputContainer: '.input',
    inputGroup: '.input-group',
    radioGroup: '.list-group',
    questionGroup: '.list-group-item',
    panelGroup: '.panel',
    panelGroupErrorClass: 'panel-danger',
    errorClass: 'has-error',
    errorElement: 'span',
    errorElementClass: 'help-block',
    radioErrorText: 'Selecteer één van de verplichten opties.',
    checkboxErrorText: 'Selecteer minimaal één optie.',
    scaleErrorText: 'Selecteer één van de verplichten opties.'
  };

  function Validation(options) {
    var bootstrap;
    this.options = options || {};
    this.form = options.form || this.form || false;
    bootstrap = this.bootstrap;
    this.setCustomMessages();
    this.validation = this.form.validate({
      errorElement: bootstrap.errorElement,
      errorClass: bootstrap.errorElementClass,
      ignore: ":hidden:not(.doValidate), .noValidation",
      highlight: function(element) {
        element = $(element);
        element.closest(bootstrap.input).addClass(bootstrap.errorClass);
        if (element.parents('table[data-type="scale"]').length > 0) {
          element.closest("tr").addClass(bootstrap.errorClass).next().addClass(bootstrap.errorClass);
        } else if (element.attr("type") === "checkbox" || element.attr("type") === "radio") {
          element.closest(bootstrap.radioGroup).addClass(bootstrap.errorClass);
        } else {
          element.closest(bootstrap.questionGroup).addClass(bootstrap.errorClass);
        }
      },
      unhighlight: function(element) {
        element = $(element);
        element.closest(bootstrap.input).removeClass(bootstrap.errorClass);
        if (element.parents('table[data-type="scale"]').length > 0) {
          element.closest("tr").removeClass(bootstrap.errorClass).next().removeClass(bootstrap.errorClass);
        } else if (element.attr("type") === "checkbox" || element.attr("type") === "radio") {
          element.closest(bootstrap.radioGroup).removeClass(bootstrap.errorClass);
        } else {
          element.closest(bootstrap.questionGroup).removeClass(bootstrap.errorClass);
        }
      },
      submitHandler: function(form) {
        form.submit();
      },
      errorPlacement: function(error, element) {
        if (element.data('questionnaire-type') === "scale") {
          element.closest("tr").children('.title').append(error);
        } else if (element.attr("type") === "checkbox" || element.attr("type") === "radio") {
          element.closest(bootstrap.radioGroup).parent().prepend(error);
          error.attr("class", error.attr("class") + " checkboxes-check");
        } else {
          if ((element.parent(bootstrap.inputGroup).length)) {
            error.insertAfter(element.parent());
          } else {
            error.insertAfter(element);
          }
        }
      }
    });
    return;
  }

  Validation.prototype.setCustomMessages = function() {
    var bootstrap;
    bootstrap = this.bootstrap;
    $('input[type="radio"]').each((function(index, element) {
      $(element).data('msg-required', bootstrap.radioErrorText);
    }).bind(this));
    $('input[type="checkbox"]').each((function(index, element) {
      $(element).data('msg-required', bootstrap.checkboxErrorText);
    }).bind(this));
    $('table[data-type="scale"]').each((function(index, element) {
      $(element).find('input').each((function(ind, elm) {
        $(elm).data('questionnaire-type', 'scale').data('msg-required', bootstrap.scaleErrorText);
      }).bind(this));
    }).bind(this));
  };

  return Validation;

})();

/* ========================================================================
 * Bootstrap: collapse.js v3.1.1
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') option = !option
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.1.1
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.1.1
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);

/**!
 * Sortable
 * @author	RubaXa   <trash@rubaxa.org>
 * @license MIT
 */


(function (factory){
	"use strict";

	if( typeof define === "function" && define.amd ){
		define(factory);
	}
	else if( typeof module != "undefined" && typeof module.exports != "undefined" ){
		module.exports = factory();
	}
	else {
		window["Sortable"] = factory();
	}
})(function (){
	"use strict";

	var
		  dragEl
		, ghostEl
		, rootEl
		, nextEl

		, lastEl
		, lastCSS
		, lastRect

		, activeGroup

		, tapEvt
		, touchEvt

		, expando = 'Sortable' + (new Date).getTime()

		, win = window
		, document = win.document
		, parseInt = win.parseInt
		, supportIEdnd = !!document.createElement('div').dragDrop

		, _silent = false

		, _createEvent = function (event/**String*/, item/**HTMLElement*/){
			var evt = document.createEvent('Event');
			evt.initEvent(event, true, true);
			evt.item = item;
			return evt;
		}

		, noop = function (){}
		, slice = [].slice

		, touchDragOverListeners = []

		, pointerdown
		, pointerup
		, pointermove
		, pointercancel
	;


	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}  [options]
	 * @constructor
	 */
	function Sortable(el, options){
		this.el = el; // root element
		this.options = options = (options || {});


		// Defaults
		options.group = options.group || Math.random();
		options.handle = options.handle || null;
		options.draggable = options.draggable || el.children[0] && el.children[0].nodeName || (/[uo]l/i.test(el.nodeName) ? 'li' : '*');
		options.ghostClass = options.ghostClass || 'sortable-ghost';
		options.ignore = options.ignore || 'a, img';

		options.onAdd = _bind(this, options.onAdd || noop);
		options.onUpdate = _bind(this, options.onUpdate || noop);
		options.onRemove = _bind(this, options.onRemove || noop);
		options.onStart = _bind(this, options.onStart || noop);
		options.onEnd = _bind(this, options.onEnd || noop);


		// Export group name
		el[expando] = options.group;


		// Bind all private methods
		for( var fn in this ){
			if( fn.charAt(0) === '_' ){
				this[fn] = _bind(this, this[fn]);
			}
		}

		// Detect IE10/IE11+
		if (window.onpointerdown !== undefined) {
			pointerdown = 'pointerdown';
			pointerup = 'pointerup';
			pointermove = 'pointermove';
			pointercancel = 'pointercancel';
		} else {
			pointerdown = 'MSPointerDown';
			pointerup = 'MSPointerUp';
			pointermove = 'MSPointerMove';
			pointercancel = 'MSPointerCancel';
		}

		// Bind events
		_on(el, 'add', options.onAdd);
		_on(el, 'update', options.onUpdate);
		_on(el, 'remove', options.onRemove);
		_on(el, 'start', options.onStart);
		_on(el, 'stop', options.onEnd);

		_on(el, 'mousedown', this._onTapStart);
		_on(el, 'touchstart', this._onTapStart);
		supportIEdnd && _on(el, 'selectstart', this._onTapStart);

		_on(el, 'dragover', this._onDragOver);
		_on(el, 'dragenter', this._onDragOver);
		_on(el, pointerdown, this._onTapStart);

		_css(el, 'touch-action', 'none');
		_css(el, '-ms-touch-action', 'none');

		touchDragOverListeners.push(this._onDragOver);
	}


	Sortable.prototype = {
		constructor: Sortable,


		_applyEffects: function (){
			_toggleClass(dragEl, this.options.ghostClass, true);
		},


		_onTapStart: function (evt/**Event|TouchEvent|PointerEvent*/){
			var
				  touch = evt.touches && evt.touches[0]
				, target = (touch || evt).target
				, options =  this.options
				, el = this.el
			;

			if( options.handle ){
				target = _closest(target, options.handle, el);
			}

			target = _closest(target, options.draggable, el);

			// IE 9 Support
			if( target && evt.type == 'selectstart' ){
				if( target.tagName != 'A' && target.tagName != 'IMG'){
					target.dragDrop();
				}
			}

			if( target && !dragEl && (target.parentNode === el) ){
				tapEvt = evt;
				target.draggable = true;

				// Disable "draggable"
				Array.prototype.forEach.call(options.ignore.split(','), function (criteria) {
					_find(target, criteria.trim(), _disableDraggable);
				});

				if( touch ){
					// Touch device support
					tapEvt = {
						  target:  target
						, clientX: touch.clientX
						, clientY: touch.clientY
					};
					this._onDragStart(tapEvt, true);
					evt.preventDefault();
				}
				
				if (evt.type == 'pointerdown' || evt.type == 'MSPointerDown') {
					this._onDragStart(tapEvt, true);
					evt.preventDefault();
				}

				_on(this.el, 'dragstart', this._onDragStart);
				_on(this.el, 'dragend', this._onDrop);
				_on(document, 'dragover', _globalDragOver);


				try {
					if( document.selection ){
						document.selection.empty();
					} else {
						window.getSelection().removeAllRanges()
					}
				} catch (err){ }
			}
		},


		_emulateDragOver: function (){
			if( touchEvt ){
				_css(ghostEl, 'display', 'none');

				var
					  target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY)
					, parent = target
					, group = this.options.group
					, i = touchDragOverListeners.length
				;

				if( parent ){
					do {
						if( parent[expando] === group ){
							while( i-- ){
								touchDragOverListeners[i]({
									clientX: touchEvt.clientX,
									clientY: touchEvt.clientY,
									target: target,
									rootEl: parent
								});
							}
							break;
						}

						target = parent; // store last element
					}
					while( parent = parent.parentNode );
				}

				_css(ghostEl, 'display', '');
			}
		},


		_onTouchMove: function (evt/**TouchEvent|PointerEvent*/){
			if( tapEvt ){
				var
					  touch = evt.touches[0]
					, dx = touch.clientX - tapEvt.clientX
					, dy = touch.clientY - tapEvt.clientY
				;

				touchEvt = touch;
				_css(ghostEl, 'webkitTransform', 'translate3d('+dx+'px,'+dy+'px,0)');
				_css(ghostEl, 'mozTransform', 'translate3d('+dx+'px,'+dy+'px,0)');
				_css(ghostEl, 'msTransform', 'translate3d('+dx+'px,'+dy+'px,0)');
				_css(ghostEl, 'transform', 'translate3d('+dx+'px,'+dy+'px,0)');
				evt.preventDefault();
			}
		},


		_onDragStart: function (evt/**Event*/, isTouch/**Boolean*/){
			var
				  target = evt.target
				, dataTransfer = evt.dataTransfer
			;

			rootEl = this.el;
			dragEl = target;
			nextEl = target.nextSibling;
			activeGroup = this.options.group;

			if( isTouch ){
				var
					  rect = target.getBoundingClientRect()
					, css = _css(target)
					, ghostRect
				;

				ghostEl = target.cloneNode(true);

				_css(ghostEl, 'top', rect.top - parseInt(css.marginTop, 10));
				_css(ghostEl, 'left', rect.left - parseInt(css.marginLeft, 10));
				_css(ghostEl, 'width', rect.width);
				_css(ghostEl, 'height', rect.height);
				_css(ghostEl, 'opacity', '0.8');
				_css(ghostEl, 'position', 'fixed');
				_css(ghostEl, 'zIndex', '100000');

				rootEl.appendChild(ghostEl);

				// Fixing dimensions.
				ghostRect = ghostEl.getBoundingClientRect();
				_css(ghostEl, 'width', rect.width*2 - ghostRect.width);
				_css(ghostEl, 'height', rect.height*2 - ghostRect.height);

				// Bind touch events
				_on(document, 'touchmove', this._onTouchMove);
				_on(document, 'touchend', this._onDrop);
				_on(document, 'touchcancel', this._onDrop);
				_on(document, pointermove, this._onTouchMove);
				_on(document, pointerup, this._onDrop);
				_on(document, pointercancel, this._onDrop);

				this._loopId = setInterval(this._emulateDragOver, 150);
			}
			else {
				dataTransfer.effectAllowed = 'move';
				dataTransfer.setData('Text', target.textContent);

				_on(document, 'drop', this._onDrop);
			}

			dragEl.dispatchEvent(_createEvent('start', dragEl));
			setTimeout(this._applyEffects);
		},


		_onDragOver: function (evt/**Event*/){
			if( !_silent && (activeGroup === this.options.group) && (evt.rootEl === void 0 || evt.rootEl === this.el) ){
				var
					  el = this.el
					, target = _closest(evt.target, this.options.draggable, el)
				;

				if( el.children.length === 0 || el.children[0] === ghostEl || (el === evt.target) && _ghostInBottom(el, evt) ){
					el.appendChild(dragEl);
				}
				else if( target && target !== dragEl && (target.parentNode[expando] !== void 0) ){
					if( lastEl !== target ){
						lastEl = target;
						lastCSS = _css(target);
						lastRect = target.getBoundingClientRect();
					}


					var
						  rect = lastRect
						, width = rect.right - rect.left
						, height = rect.bottom - rect.top
						, floating = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display)
						, skew = (floating ? (evt.clientX - rect.left)/width : (evt.clientY - rect.top)/height) > .5
						, isWide = (target.offsetWidth > dragEl.offsetWidth)
						, isLong = (target.offsetHeight > dragEl.offsetHeight)
						, nextSibling = target.nextSibling
						, after
					;

					_silent = true;
					setTimeout(_unsilent, 30);

					if( floating ){
						after = (target.previousElementSibling === dragEl) && !isWide || (skew > .5) && isWide
					} else {
						after = (target.nextElementSibling !== dragEl) && !isLong || (skew > .5) && isLong;
					}

					if( after && !nextSibling ){
						el.appendChild(dragEl);
					} else {
						target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
					}
				}
			}
		},


		_onDrop: function (evt/**Event*/){
			clearInterval(this._loopId);

			// Unbind events
			_off(document, 'drop', this._onDrop);
			_off(document, 'dragover', _globalDragOver);

			_off(this.el, 'dragend', this._onDrop);
			_off(this.el, 'dragstart', this._onDragStart);
			_off(this.el, 'selectstart', this._onTapStart);

			_off(document, 'touchmove', this._onTouchMove);
			_off(document, 'touchend', this._onDrop);
			_off(document, 'touchcancel', this._onDrop);
			_off(document, pointermove, this._onTouchMove);
			_off(document, pointerup, this._onDrop);
			_off(document, pointercancel, this._onDrop);


			if( evt ){
				evt.preventDefault();
				evt.stopPropagation();

				if( ghostEl ){
					ghostEl.parentNode.removeChild(ghostEl);
				}

				if( dragEl ){
					_disableDraggable(dragEl);
					_toggleClass(dragEl, this.options.ghostClass, false);

					if( !rootEl.contains(dragEl) ){
						// Remove event
						rootEl.dispatchEvent(_createEvent('remove', dragEl));

						// Add event
						dragEl.dispatchEvent(_createEvent('add', dragEl));
					}
					else if( dragEl.nextSibling !== nextEl ){
						// Update event
						dragEl.dispatchEvent(_createEvent('update', dragEl));
					}
					dragEl.dispatchEvent(_createEvent('stop', dragEl));
				}

				// Set NULL
				rootEl =
				dragEl =
				ghostEl =
				nextEl =

				tapEvt =
				touchEvt =

				lastEl =
				lastCSS =

				activeGroup = null;
			}
		},


		destroy: function (){
			var el = this.el, options = this.options;

			_off(el, 'add', options.onAdd);
			_off(el, 'update', options.onUpdate);
			_off(el, 'remove', options.onRemove);
			_off(el, 'start', options.onStart);
			_off(el, 'stop', options.onEnd);
			_off(el, 'mousedown', this._onTapStart);
			_off(el, 'touchstart', this._onTapStart);
			_off(el, 'selectstart', this._onTapStart);
			_off(el, pointerdown, this._onTapStart);

			_off(el, 'dragover', this._onDragOver);
			_off(el, 'dragenter', this._onDragOver);

			//remove draggable attributes
			Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function(el) {
				el.removeAttribute('draggable');
			});

			touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

			this._onDrop();

			this.el = null;
		}
	};

	function _bind(ctx, fn){
		var args = slice.call(arguments, 2);
		return	fn.bind ? fn.bind.apply(fn, [ctx].concat(args)) : function (){
			return fn.apply(ctx, args.concat(slice.call(arguments)));
		};
	}


	function _closest(el, selector, ctx){
		if( selector === '*' ){
			return el;
		}
		else if( el ){
			ctx = ctx || document;
			selector = selector.split('.');

			var
				  tag = selector.shift().toUpperCase()
				, re = new RegExp('\\s('+selector.join('|')+')\\s', 'g')
			;

			do {
				if(
					   (tag === '' || el.nodeName == tag)
					&& (!selector.length || ((' '+el.className+' ').match(re) || []).length == selector.length)
				){
					return	el;
				}
			}
			while( el !== ctx && (el = el.parentNode) );
		}

		return	null;
	}


	function _globalDragOver(evt){
		evt.dataTransfer.dropEffect = 'move';
		evt.preventDefault();
	}


	function _on(el, event, fn){
		el.addEventListener(event, fn, false);
	}


	function _off(el, event, fn){
		el.removeEventListener(event, fn, false);
	}


	function _toggleClass(el, name, state){
		if( el ){
			if( el.classList ){
				el.classList[state ? 'add' : 'remove'](name);
			}
			else {
				var className = (' '+el.className+' ').replace(/\s+/g, ' ').replace(' '+name+' ', '');
				el.className = className + (state ? ' '+name : '')
			}
		}
	}


	function _css(el, prop, val){
		if( el && el.style ){
			if( val === void 0 ){
				if( document.defaultView && document.defaultView.getComputedStyle ){
					val = document.defaultView.getComputedStyle(el, '');
				}
				else if( el.currentStyle ){
					val	= el.currentStyle;
				}
				return	prop === void 0 ? val : val[prop];
			} else {
				el.style[prop] = val + (typeof val === 'string' ? '' : 'px');
			}
		}
	}


	function _find(ctx, tagName, iterator){
		if( ctx ){
			var list = ctx.getElementsByTagName(tagName), i = 0, n = list.length;
			if( iterator ){
				for( ; i < n; i++ ){
					iterator(list[i], i);
				}
			}
			return	list;
		}
		return	[];
	}


	function _disableDraggable(el){
		return el.draggable = false;
	}


	function _unsilent(){
		_silent = false;
	}


	function _ghostInBottom(el, evt){
		var last = el.lastElementChild.getBoundingClientRect();
		return evt.clientY - (last.top + last.height) > 5; // min delta
	}



	// Export utils
	Sortable.utils = {
		on: _on,
		off: _off,
		css: _css,
		find: _find,
		bind: _bind,
		closest: _closest,
		toggleClass: _toggleClass
	};


	Sortable.version = '0.3.0';

	// Export
	return	Sortable;
});
