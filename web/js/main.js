var BrowserDetection, displayPoweredBy, notSupportedBrowsers, noticeLang, noticeLangCustom, supportedBrowsers;

notSupportedBrowsers = [
  {
    'os': 'Any',
    'browser': 'MSIE',
    'version': 6
  }, {
    'os': 'Any',
    'browser': 'MSIE',
    'version': 7
  }, {
    'os': 'Any',
    'browser': 'MSIE',
    'version': 8
  }
];

displayPoweredBy = false;

noticeLang = "professional";

noticeLangCustom = null;

supportedBrowsers = [];

BrowserDetection = {
  init: function() {
    var i, oldBrowser;
    if ((notSupportedBrowsers == null) || notSupportedBrowsers.length < 1) {
      notSupportedBrowsers = this.defaultNotSupportedBrowsers;
    }
    this.detectBrowser();
    this.detectOS();
    if (this.browser === "" || this.browser === "Unknown" || this.os === "" || this.os === "Unknown" || this.browserVersion === "" || this.browserVersion === 0) {
      return;
    }
    oldBrowser = false;
    i = 0;
    while (i < notSupportedBrowsers.length) {
      if (notSupportedBrowsers[i].os === "Any" || notSupportedBrowsers[i].os === this.os) {
        if (notSupportedBrowsers[i].browser === "Any" || notSupportedBrowsers[i].browser === this.browser) {
          if (notSupportedBrowsers[i].version === "Any" || this.browserVersion <= parseFloat(notSupportedBrowsers[i].version)) {
            oldBrowser = true;
            break;
          }
        }
      }
      i++;
    }
    if (oldBrowser) {
      this.displayNotice();
    }
  },
  getEl: function(id) {
    return window.document.getElementById(id);
  },
  getElSize: function(id) {
    var el;
    el = this.getEl(id);
    if (el == null) {
      return null;
    }
    return {
      width: parseInt(el.offsetWidth),
      height: parseInt(el.offsetHeight)
    };
  },
  getWindowSize: function() {
    if (typeof window.innerWidth !== "undefined") {
      return {
        width: parseInt(window.innerWidth),
        height: parseInt(window.innerHeight)
      };
    } else {
      if (window.document.documentElement.clientWidth !== 0) {
        return {
          width: parseInt(window.document.documentElement.clientWidth),
          height: parseInt(window.document.documentElement.clientHeight)
        };
      } else {
        return {
          width: parseInt(window.document.body.clientWidth),
          height: parseInt(window.document.body.clientHeight)
        };
      }
    }
  },
  positionNotice: function() {
    var noticeEl, noticeSize, offset, windowSize;
    noticeSize = this.getElSize("browser-detection");
    windowSize = this.getWindowSize();
    noticeEl = this.getEl("browser-detection");
    if ((noticeEl == null) || (noticeSize == null) || (windowSize == null) || !windowSize.width || !windowSize.height) {
      return;
    }
    noticeEl.style.left = (windowSize.width - noticeSize.width) / 2 + "px";
    offset = (this.browser === "MSIE" && this.browserVersion < 7 ? (window.document.documentElement.scrollTop !== 0 ? window.document.documentElement.scrollTop : window.document.body.scrollTop) : 0);
    noticeEl.style.top = 20;
    this.noticeHeight = noticeSize.height;
  },
  displayNotice: function() {
    var el;
    if (this.readCookie("bdnotice") === 1) {
      return;
    }
    this.writeNoticeCode();
    this.positionNotice();
    el = this;
    window.onresize = function() {
      el.positionNotice();
    };
    if (this.browser === "MSIE" && this.browserVersion < 7) {
      window.onscroll = function() {
        el.positionNotice();
      };
    }
    this.getEl("browser-detection-close").onclick = function() {
      el.remindMe(false);
    };
    this.getEl("browser-detection-remind-later").onclick = function() {
      el.remindMe(false);
    };
  },
  remindMe: function(never) {
    this.writeCookie("bdnotice", 1, (never === true ? 365 : 7));
    this.getEl("browser-detection").style.display = "none";
    this.getEl("black_overlay").style.display = "none";
  },
  writeCookie: function(name, value, days) {
    var date, expiration;
    expiration = "";
    if (parseInt(days) > 0) {
      date = new Date();
      date.setTime(date.getTime() + parseInt(days) * 24 * 60 * 60 * 1000);
      expiration = "; expires=" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expiration + "; path=/";
  },
  readCookie: function(name) {
    var data, i, searchName;
    if (!document.cookie) {
      return "";
    }
    searchName = name + "=";
    data = document.cookie.split(";");
    i = 0;
    while (i < data.length) {
      while (data[i].charAt(0) === " ") {
        data[i] = data[i].substring(1, data[i].length);
      }
      if (data[i].indexOf(searchName) === 0) {
        return data[i].substring(searchName.length, data[i].length);
      }
      i++;
    }
    return "";
  },
  writeNoticeCode: function() {
    var browsersList, code, i, neverRemindAgain, notice, noticeTextObj, remindMeLater, selectBrowser, title;
    title = "";
    notice = "";
    selectBrowser = "";
    remindMeLater = "";
    neverRemindAgain = "";
    browsersList = null;
    code = "<div id=\"black_overlay\"></div><div id=\"browser-detection\"><a href=\"javascript:;\" id=\"browser-detection-close\">Close</a>";
    if (noticeLang === "custom" && (noticeLangCustom != null)) {
      title = noticeLangCustom.title;
      notice = noticeLangCustom.notice;
      selectBrowser = noticeLangCustom.selectBrowser;
      remindMeLater = noticeLangCustom.remindMeLater;
      neverRemindAgain = noticeLangCustom.neverRemindAgain;
    } else {
      noticeTextObj = null;
      eval("noticeTextObj = this.noticeText." + noticeLang + ";");
      if (!noticeTextObj) {
        noticeTextObj = this.noticeText.professional;
      }
      title = noticeTextObj.title;
      notice = noticeTextObj.notice;
      selectBrowser = noticeTextObj.selectBrowser;
      remindMeLater = noticeTextObj.remindMeLater;
      neverRemindAgain = noticeTextObj.neverRemindAgain;
    }
    notice = notice.replace("\n", "</p><p class=\"bd-notice\">");
    notice = notice.replace("{browser_name}", this.browser + " " + this.browserVersion);
    code += "<p class=\"bd-title\">" + title + "</p><p class=\"bd-notice\">" + notice + "</p><p class=\"bd-notice\"><b>" + selectBrowser + "</b></p>";
    if (supportedBrowsers.length > 0) {
      browsersList = supportedBrowsers;
    } else {
      browsersList = this.supportedBrowsers;
    }
    code += "<ul class=\"bd-browsers-list\">";
    i = 0;
    while (i < browsersList.length) {
      code += "<li class=\"" + browsersList[i].cssClass + "\"><a href=\"" + browsersList[i].downloadUrl + "\" target=\"_blank\">" + browsersList[i].name + "</a></li>";
      i++;
    }
    code += "</ul>";
    if (displayPoweredBy) {
      code += "<div class=\"bd-poweredby\">Powered by <a href=\"http://www.devslide.com/labs/browser-detection\" target=\"_blank\">DevSlide Labs</a></div>";
    }
    code += "<ul class=\"bd-skip-buttons\">";
    code += "<li><button id=\"browser-detection-remind-later\" type=\"button\">" + remindMeLater + "</button></li>";
    code += "</ul>";
    code += "</div>";
    window.document.body.innerHTML = code + window.document.body.innerHTML;
  },
  detectBrowser: function() {
    this.browser = "";
    this.browserVersion = 0;
    if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
      this.browser = "Opera";
    } else if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      this.browser = "MSIE";
    } else if (/Navigator[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
      this.browser = "Netscape";
    } else if (/Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
      this.browser = "Chrome";
    } else if (/Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
      this.browser = "Safari";
      /Version[\/\s](\d+\.\d+)/.test(navigator.userAgent);
      this.browserVersion = new Number(RegExp.$1);
    } else {
      if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        this.browser = "Firefox";
      }
    }
    if (this.browser === "") {
      this.browser = "Unknown";
    } else {
      if (this.browserVersion === 0) {
        this.browserVersion = parseFloat(new Number(RegExp.$1));
      }
    }
  },
  detectOS: function() {
    var i;
    i = 0;
    while (i < this.operatingSystems.length) {
      if (this.operatingSystems[i].searchString.indexOf(this.operatingSystems[i].subStr) !== -1) {
        this.os = this.operatingSystems[i].name;
        return;
      }
      i++;
    }
    this.os = "Unknown";
  },
  noticeHeight: 0,
  browser: "",
  os: "",
  browserVersion: "",
  supportedBrowsers: [
    {
      cssClass: "firefox",
      name: "Mozilla Firefox",
      downloadUrl: "http://www.getfirefox.com/"
    }, {
      cssClass: "chrome",
      name: "Google Chrome",
      downloadUrl: "http://www.google.com/chrome/"
    }, {
      cssClass: "msie",
      name: "Internet Explorer",
      downloadUrl: "http://www.getie.com/"
    }, {
      cssClass: "opera",
      name: "Opera",
      downloadUrl: "http://www.opera.com/"
    }, {
      cssClass: "safari",
      name: "Apple Safari",
      downloadUrl: "http://www.apple.com/safari/"
    }
  ],
  operatingSystems: [
    {
      searchString: navigator.platform,
      name: "Windows",
      subStr: "Win"
    }, {
      searchString: navigator.platform,
      name: "Mac",
      subStr: "Mac"
    }, {
      searchString: navigator.platform,
      name: "Linux",
      subStr: "Linux"
    }, {
      searchString: navigator.userAgent,
      name: "iPhone",
      subStr: "iPhone/iPod"
    }
  ],
  defaultNotSupportedBrowsers: [
    {
      os: "Any",
      browser: "MSIE",
      version: 6
    }
  ],
  noticeText: {
    professional: {
      title: "Outdated Browser Detected",
      notice: "Our website has detected that you are using an outdated browser. Using your current browser will prevent you from accessing features on our website. An upgrade is not required, but is strongly recommend to improve your browsing experience on our website.",
      selectBrowser: "Use the links below to download a new browser or upgrade your existing browser.",
      remindMeLater: "Remind me later",
      neverRemindAgain: "No, don't remind me again"
    },
    informal: {
      title: "Whoaaa!",
      notice: "It appears you're using an outdated browser which prevents access to some of the features on our website. While it's not required, you really should <b>upgrade or install a new browser</b>!",
      selectBrowser: "Visit the official sites for popular browsers below:",
      remindMeLater: "Not now, but maybe later",
      neverRemindAgain: "No, don't remind me again"
    },
    technical: {
      title: "Old Browser Alert! <span class='bd-highlight'>DEFCON 5</span>",
      notice: "Come on! If you are hitting our site, then you must at least be partially tech savvy. So, why the older browser? We're not asking you to brush off your old Fibonacci Heap and share it with the class. Just upgrade!\nI know, I know. You don't like to be told what to do. But, we're only asking you to upgrade so you can access all the latest, greatest features on our site. It's quick and easy. But, if you still want to skip it, that's cool. We will still welcome you &mdash; and your creepy old browser. :P",
      selectBrowser: "Visit the official sites for popular browsers below:",
      remindMeLater: "Remind me later",
      neverRemindAgain: "No, don't remind me. I like my Commodore 64!"
    },
    goofy: {
      title: "Are You Serious?",
      notice: "Are you really using <b>{browser_name}</b> as your browser?\nYou're surfing the web on a dinosaur (a dangerous one too &mdash; like a Tyrannosaurus or Pterodactyl or something scary like that). <b>Get with it and upgrade now!</b> If you do, we promise you will enjoy our site a whole lot more. :)",
      selectBrowser: "Visit the official sites for popular browsers below:",
      remindMeLater: "Maybe Later",
      neverRemindAgain: "No, don't remind me again"
    },
    mean: {
      title: "Umm, Your Browser Sucks!",
      notice: "Get a new one here.",
      selectBrowser: "Official sites for popular browsers:",
      remindMeLater: "Remind me later, a'hole",
      neverRemindAgain: "F' off! My browser rocks!"
    }
  }
};

var Checkbox;

Checkbox = (function() {
  Checkbox.uncheckRadio = false;

  Checkbox.prototype.checkedElms = {};

  function Checkbox(options) {
    this.options = options || {};
    this.checkboxes = options.checkboxes, this.uncheckRadio = options.uncheckRadio, this.allowedAnswers = options.allowedAnswers;
    this.uncheckRadio = this.uncheckRadio || false;
    this.allowedAnswers = this.allowedAnswers || null;
    this.generateCheckboxes.call(this, false);
  }

  Checkbox.prototype.maximumCheckboxes = function() {
    if (this.allowedAnswers !== null) {
      if (this.checkboxes.filter(":checked").length >= this.allowedAnswers) {
        $(this.checkboxes.filter(":not(:checked)")).each(function(index, element) {
          $(element).prop("disabled", true).closest(".list-group-item").addClass("disabled");
        });
      } else {
        $(this.checkboxes).each(function(index, element) {
          $(element).prop("disabled", false).closest(".list-group-item").removeClass("disabled");
        });
      }
    }
  };

  Checkbox.prototype.generateCheckboxes = function() {
    var _self;
    _self = this;
    $(this.checkboxes).each(function(index, element) {
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
        _self.checkedElms[$(elm).attr("name")] = $(elm);
      }
      outer.insertBefore(elm).append(inner);
      elm.click($.proxy(_self.checkboxChanged, {
        uncheckRadio: _self.uncheckRadio,
        outer: outer,
        input: elm,
        scope: _self
      })).addClass("hide").addClass("doValidate");
    });
    this.checkboxChanged.call({
      uncheckRadio: this.uncheckRadio,
      scope: this,
      options: this.options
    }, false);
  };

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
            scope.maximumCheckboxes.call(scope, false);
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
    scope.maximumCheckboxes.call(scope, false);
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
    options.tabindex = new TabIndex(options);
    options.sortable = new SortableClass(options);
    options.supportBrowser = BrowserDetection.init();
  }

  return Questionnaire;

})();

var Other;

Other = (function() {
  function Other(options) {
    var _self;
    this.options = options || {};
    this.options.other = this.options.other || false;
    _self = this;
    this.options.other.each(function(index, element) {
      var elm, input, inputName;
      elm = $(element);
      input = elm.prev().find('input');
      inputName = input.attr("name");
      input.change($.proxy(_self.otherChanged, {
        input: input,
        container: elm,
        options: this.options
      }));
      $($('input[name="' + inputName + '"]')).each(function(ind, elm2) {
        elm2 = $(elm2);
        if (elm2.is(input) === false) {
          elm2.change($.proxy(_self.otherChanged, {
            input: input,
            container: elm,
            options: this.options
          }));
        }
      });
    });
  }

  Other.prototype.otherChanged = function(e) {
    if (this.input.is(":checked") === true) {
      this.container.removeClass("hide");
    } else {
      this.container.addClass("hide");
      this.container.parents('.has-error').each(function(ind, elm) {
        $(elm).removeClass('has-error');
      });
      this.container.removeClass('has-error');
      this.container.children('.help-block').each(function(ind, elm) {
        $(elm).css('display', 'none');
      });
    }
  };

  return Other;

})();

var ScaleTable;

ScaleTable = (function() {
  function ScaleTable(options) {
    var _self;
    this.options = options || {};
    this.options.selectRequired = this.options.selectRequired || " -- Selecteer een optie --";
    this.scaleTable = options.scaleTable;
    _self = this;
    $(this.scaleTable).each(function(index, element) {
      var elm, headers, trs;
      elm = $(element);
      headers = elm.find('thead th:not(.title)');
      trs = elm.find('tbody tr');
      $(trs).each(function(trIndex, trElm) {
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
          text: _self.options.selectRequired,
          value: ""
        })).change($.proxy(_self.selectChanged, {
          select: sel,
          tr: $(trElm),
          options: _self.options
        }));
        $(options).each(function(tdIndex, inputElm) {
          var tmp;
          inputElm = $(inputElm);
          tmp = $('<option>', {
            html: $(headers[tdIndex]).text() || "",
            value: inputElm.val() || ""
          });
          inputElm.change($.proxy(_self.inputChanged, {
            select: sel,
            input: inputElm,
            tr: $(trElm)
          }));
          inputElm.on("inputChanged", $.proxy(_self.inputChanged, {
            select: sel,
            input: inputElm,
            tr: $(trElm)
          }));
          sel.append(tmp);
        });
      });
    });
  }

  ScaleTable.prototype.inputChanged = function(e) {
    e.preventDefault();
    if (this.tr.find(":checked").length === 0) {
      this.select.val("");
    } else {
      this.select.val(this.input.val());
    }
  };

  ScaleTable.prototype.selectChanged = function(e) {
    var active, input;
    e.preventDefault();
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
    scope.initOrder.call(scope);
    scope.updateOrder.call(scope);
    scope.showOrder.call(scope, $(this).closest('li'));
    return;
  }

  SortableClass.prototype.initOrder = function() {
    var _self, positions;
    _self = this;
    positions = [];
    $("#" + this.list + ' li').each(function(ind, elm) {
      var selects;
      selects = $(elm).find('option[selected="selected"]');
      $(selects).each(function(ind, elm) {
        var curPosition;
        curPosition = $(elm).data('position');
        if (positions[curPosition] != null) {
          throw new Error("Order module position conflict: " + curPosition + " is selected twice.");
        } else {
          positions[curPosition] = elm;
        }
      });
    });
    $(positions).each(function(ind, elm) {
      $("#" + _self.list).append($(elm).closest("li"));
    });
  };

  SortableClass.prototype.showOrder = function(elm) {
    var orginalCss;
    orginalCss = elm.css('backgroundColor');
    elm.css("backgroundColor", "#fffbdf");
    setTimeout(function() {
      return elm.attr("style", "");
    }, 1200);
  };

  SortableClass.prototype.updateOrder = function() {
    $("#" + this.list + ' li').each(function(ind, elm) {
      var indx, selects;
      selects = $(elm).find('select');
      if (selects.length > 0) {
        indx = ind + 1;
        $(selects).data('current-position', indx).find('option[data-position="' + indx + '"]').prop('selected', 'selected');
      }
    });
  };

  return SortableClass;

})();

var TabIndex;

TabIndex = (function() {
  TabIndex.prototype.form = $("#questionnaireForm");

  function TabIndex(options) {
    this.options = options || {};
    this.form = options.form || this.form || false;
    this.form.find("input, button[data-type='next']").each(function(index, element) {
      $(element).attr("tabindex", index + 1).on("focus", function() {
        if ($(this).attr("type") === "radio" || $(this).attr("type") === "checkbox") {
          return $(this).closest(".list-group-item").addClass("focused");
        }
      }).on("blur", function() {
        if ($(this).attr("type") === "radio" || $(this).attr("type") === "checkbox") {
          return $(this).closest(".list-group-item").removeClass("focused");
        }
      });
    });
  }

  return TabIndex;

})();

var Table;

Table = (function() {
  function Table(options) {
    var num;
    num = 0;
    $('table[data-type="scale"] tbody tr.input-row').each(function(trIndex, trElm) {
      var className, elm;
      elm = $(trElm);
      className = num === 0 ? "odd" : "even";
      if (elm.hasClass('input-row')) {
        elm.addClass(className);
        if (elm.next().hasClass('select-row')) {
          elm.next().addClass(className);
        }
      }
      num = num === 0 ? 1 : 0;
    });
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
    radioErrorText: 'Selecteer één van de verplichte opties.',
    checkboxErrorText: 'Selecteer minimaal één optie.',
    scaleErrorText: 'Selecteer één van de verplichte opties.',
    errorRequireFromGroup: 'U dient tenminste {0} velden in te vullen.'
  };

  function Validation(options) {
    var _self, bootstrap;
    this.options = options || {};
    this.form = options.form || this.form || false;
    this.allowedAnswers = options.allowedAnswers || this.allowedAnswers || null;
    this.bootstrap.radioErrorText = options.radioErrorText || this.bootstrap.radioErrorText;
    this.bootstrap.checkboxErrorText = options.checkboxErrorText || this.bootstrap.checkboxErrorText;
    this.bootstrap.scaleErrorText = options.scaleErrorText || this.bootstrap.scaleErrorText;
    this.bootstrap.errorRequireFromGroup = options.errorRequireFromGroup || this.bootstrap.errorRequireFromGroup;
    bootstrap = this.bootstrap;
    _self = this;
    this.addCustomMethods();
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
    if ($('#sonata_user_registration_form_plainPassword_first').length) {
      if ($('#sonata_user_registration_form_plainPassword_second').length) {
        $('#sonata_user_registration_form_plainPassword_second').rules("add", {
          equalTo: "#sonata_user_registration_form_plainPassword_first"
        });
      }
    }
    if (this.allowedAnswers !== null) {
      if (this.allowedAnswers > 1) {
        $(_self.form.selector + " .checkbox input").each(function(index, element) {
          $(element).rules("add", {
            require_from_group: [_self.allowedAnswers, ".checkbox input"]
          });
        });
      }
    }
    return;
  }

  Validation.prototype.setCustomMessages = function() {
    var bootstrap;
    bootstrap = this.bootstrap;
    $('input[type="radio"]').each(function(index, element) {
      $(element).data('msg-required', bootstrap.radioErrorText);
    });
    $('input[type="checkbox"]').each(function(index, element) {
      $(element).data('msg-required', bootstrap.checkboxErrorText);
    });
    $('table[data-type="scale"]').each(function(index, element) {
      $(element).find('input').each(function(ind, elm) {
        $(elm).data('questionnaire-type', 'scale').data('msg-required', bootstrap.scaleErrorText);
      });
    });
  };

  Validation.prototype.addCustomMethods = function() {
    var bootstrap;
    bootstrap = this.bootstrap;
    jQuery.validator.addMethod("require_from_group", function(value, element, options) {
      var $fields, $fieldsFirst, isValid, ref, validator;
      $fields = $(options[1], element.form);
      $fieldsFirst = $fields.eq(0);
      validator = (ref = $fieldsFirst.data("valid_req_grp")) != null ? ref : $.extend({}, this);
      isValid = $fields.filter(function() {
        return $(this).is(":checked");
      }).length >= options[0];
      $fieldsFirst.data("valid_req_grp", validator);
      if (!$(element).data("being_validated")) {
        $fields.data("being_validated", true);
        $fields.each(function() {
          validator.element(this);
        });
        $fields.data("being_validated", false);
      }
      return isValid;
    }, jQuery.validator.format(bootstrap.errorRequireFromGroup));
  };

  return Validation;

})();
