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
      scope: this
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
        container: elm
      }));
      $($('input[name="' + inputName + '"]')).each((function(ind, elm2) {
        elm2 = $(elm2);
        if (elm2.is(input) === false) {
          elm2.change(this.otherChanged.bind({
            input: input,
            container: elm
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

var Table;

Table = (function() {
  function Table(options) {
    var num;
    num = 0;
    $('table[data-type="scale"] tbody tr.input-row').each((function(trIndex, trElm) {
      var className, elm;
      elm = $(trElm);
      className = num === 0 ? "odd" : "even";
      console.log(elm, num, elm.hasClass('input-row'), className);
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
    this.form.validate({
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
          element.closest(bootstrap.inputContainer).addClass(bootstrap.errorClass);
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
          element.closest(bootstrap.inputContainer).removeClass(bootstrap.errorClass);
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
