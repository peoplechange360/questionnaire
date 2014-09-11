#
# * Browser Detection
# * © 2010 DevSlide Labs
# *
# * Visit us at: www.devslide.com/labs
#
notSupportedBrowsers = [{'os': 'Any', 'browser': 'MSIE', 'version': 6}, {'os': 'Any', 'browser': 'MSIE', 'version': 7}, {'os': 'Any', 'browser': 'MSIE', 'version': 8}]
displayPoweredBy = false
noticeLang = "professional"
noticeLangCustom = null
supportedBrowsers = []
BrowserDetection =
  init: ->
    notSupportedBrowsers = @defaultNotSupportedBrowsers  if not notSupportedBrowsers? or notSupportedBrowsers.length < 1
    @detectBrowser()
    @detectOS()
    return  if @browser is "" or @browser is "Unknown" or @os is "" or @os is "Unknown" or @browserVersion is "" or @browserVersion is 0

    # Check if this is old browser
    oldBrowser = false
    i = 0

    while i < notSupportedBrowsers.length
      if notSupportedBrowsers[i].os is "Any" or notSupportedBrowsers[i].os is @os
        if notSupportedBrowsers[i].browser is "Any" or notSupportedBrowsers[i].browser is @browser
          if notSupportedBrowsers[i].version is "Any" or @browserVersion <= parseFloat(notSupportedBrowsers[i].version)
            oldBrowser = true
            break
      i++
    @displayNotice()  if oldBrowser
    return

  getEl: (id) ->
    window.document.getElementById id

  getElSize: (id) ->
    el = @getEl(id)
    return null  unless el?
    width: parseInt(el.offsetWidth)
    height: parseInt(el.offsetHeight)

  getWindowSize: ->
    unless typeof window.innerWidth is "undefined"
      width: parseInt(window.innerWidth)
      height: parseInt(window.innerHeight)
    else
      unless window.document.documentElement.clientWidth is 0
        width: parseInt(window.document.documentElement.clientWidth)
        height: parseInt(window.document.documentElement.clientHeight)
      else
        width: parseInt(window.document.body.clientWidth)
        height: parseInt(window.document.body.clientHeight)

  positionNotice: ->
    noticeSize = @getElSize("browser-detection")
    windowSize = @getWindowSize()
    noticeEl = @getEl("browser-detection")
    return  if not noticeEl? or not noticeSize? or not windowSize? or not windowSize.width or not windowSize.height
    noticeEl.style.left = (windowSize.width - noticeSize.width) / 2 + "px"
    offset = (if (@browser is "MSIE" and @browserVersion < 7) then ((if window.document.documentElement.scrollTop isnt 0 then window.document.documentElement.scrollTop else window.document.body.scrollTop)) else 0)
    #noticeEl.style.top = (windowSize.height - noticeSize.height - 20 + offset) + "px"
    noticeEl.style.top = 20
    @noticeHeight = noticeSize.height
    return

  displayNotice: ->
    return  if @readCookie("bdnotice") is 1
    @writeNoticeCode()
    @positionNotice()
    el = this
    window.onresize = ->
      el.positionNotice()
      return

    if @browser is "MSIE" and @browserVersion < 7
      window.onscroll = ->
        el.positionNotice()
        return
    @getEl("browser-detection-close").onclick = ->
      el.remindMe false
      return

    @getEl("browser-detection-remind-later").onclick = ->
      el.remindMe false
      return

    # @getEl("browser-detection-never-remind").onclick = ->
    #   el.remindMe true
    #   return

    return

  remindMe: (never) ->
    @writeCookie "bdnotice", 1, (if never is true then 365 else 7)
    @getEl("browser-detection").style.display = "none"
    @getEl("black_overlay").style.display = "none"
    return

  writeCookie: (name, value, days) ->
    expiration = ""
    if parseInt(days) > 0
      date = new Date()
      date.setTime date.getTime() + parseInt(days) * 24 * 60 * 60 * 1000
      expiration = "; expires=" + date.toGMTString()
    document.cookie = name + "=" + value + expiration + "; path=/"
    return

  readCookie: (name) ->
    return ""  unless document.cookie
    searchName = name + "="
    data = document.cookie.split(";")
    i = 0

    while i < data.length
      data[i] = data[i].substring(1, data[i].length)  while data[i].charAt(0) is " "
      return data[i].substring(searchName.length, data[i].length)  if data[i].indexOf(searchName) is 0
      i++
    ""

  writeNoticeCode: ->
    title = ""
    notice = ""
    selectBrowser = ""
    remindMeLater = ""
    neverRemindAgain = ""
    browsersList = null
    code = "<div id=\"black_overlay\"></div><div id=\"browser-detection\"><a href=\"javascript:;\" id=\"browser-detection-close\">Close</a>"
    if noticeLang is "custom" and noticeLangCustom?
      title = noticeLangCustom.title
      notice = noticeLangCustom.notice
      selectBrowser = noticeLangCustom.selectBrowser
      remindMeLater = noticeLangCustom.remindMeLater
      neverRemindAgain = noticeLangCustom.neverRemindAgain
    else
      noticeTextObj = null
      eval "noticeTextObj = this.noticeText." + noticeLang + ";"
      noticeTextObj = @noticeText.professional  unless noticeTextObj
      title = noticeTextObj.title
      notice = noticeTextObj.notice
      selectBrowser = noticeTextObj.selectBrowser
      remindMeLater = noticeTextObj.remindMeLater
      neverRemindAgain = noticeTextObj.neverRemindAgain
    notice = notice.replace("\n", "</p><p class=\"bd-notice\">")
    notice = notice.replace("{browser_name}", (@browser + " " + @browserVersion))
    code += "<p class=\"bd-title\">" + title + "</p><p class=\"bd-notice\">" + notice + "</p><p class=\"bd-notice\"><b>" + selectBrowser + "</b></p>"
    if supportedBrowsers.length > 0
      browsersList = supportedBrowsers
    else
      browsersList = @supportedBrowsers
    code += "<ul class=\"bd-browsers-list\">"
    i = 0

    while i < browsersList.length
      code += "<li class=\"" + browsersList[i].cssClass + "\"><a href=\"" + browsersList[i].downloadUrl + "\" target=\"_blank\">" + browsersList[i].name + "</a></li>"
      i++
    code += "</ul>"
    code += "<div class=\"bd-poweredby\">Powered by <a href=\"http://www.devslide.com/labs/browser-detection\" target=\"_blank\">DevSlide Labs</a></div>"  if displayPoweredBy
    code += "<ul class=\"bd-skip-buttons\">"
    code += "<li><button id=\"browser-detection-remind-later\" type=\"button\">" + remindMeLater + "</button></li>"
    #code += "<li><button id=\"browser-detection-never-remind\" type=\"button\">" + neverRemindAgain + "</button></li>"
    code += "</ul>"
    code += "</div>"
    window.document.body.innerHTML = code + window.document.body.innerHTML
    return

  detectBrowser: ->
    @browser = ""
    @browserVersion = 0
    if /Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)
      @browser = "Opera"
    else if /MSIE (\d+\.\d+);/.test(navigator.userAgent)
      @browser = "MSIE"
    else if /Navigator[\/\s](\d+\.\d+)/.test(navigator.userAgent)
      @browser = "Netscape"
    else if /Chrome[\/\s](\d+\.\d+)/.test(navigator.userAgent)
      @browser = "Chrome"
    else if /Safari[\/\s](\d+\.\d+)/.test(navigator.userAgent)
      @browser = "Safari"
      /Version[\/\s](\d+\.\d+)/.test navigator.userAgent
      @browserVersion = new Number(RegExp.$1)
    else @browser = "Firefox"  if /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)
    if @browser is ""
      @browser = "Unknown"
    else @browserVersion = parseFloat(new Number(RegExp.$1))  if @browserVersion is 0
    return


  # Detect operation system
  detectOS: ->
    i = 0

    while i < @operatingSystems.length
      unless @operatingSystems[i].searchString.indexOf(@operatingSystems[i].subStr) is -1
        @os = @operatingSystems[i].name
        return
      i++
    @os = "Unknown"
    return


  #	Variables
  noticeHeight: 0
  browser: ""
  os: ""
  browserVersion: ""
  supportedBrowsers: [
    {
      cssClass: "firefox"
      name: "Mozilla Firefox"
      downloadUrl: "http://www.getfirefox.com/"
    }
    {
      cssClass: "chrome"
      name: "Google Chrome"
      downloadUrl: "http://www.google.com/chrome/"
    }
    {
      cssClass: "msie"
      name: "Internet Explorer"
      downloadUrl: "http://www.getie.com/"
    }
    {
      cssClass: "opera"
      name: "Opera"
      downloadUrl: "http://www.opera.com/"
    }
    {
      cssClass: "safari"
      name: "Apple Safari"
      downloadUrl: "http://www.apple.com/safari/"
    }
  ]
  operatingSystems: [
    {
      searchString: navigator.platform
      name: "Windows"
      subStr: "Win"
    }
    {
      searchString: navigator.platform
      name: "Mac"
      subStr: "Mac"
    }
    {
      searchString: navigator.platform
      name: "Linux"
      subStr: "Linux"
    }
    {
      searchString: navigator.userAgent
      name: "iPhone"
      subStr: "iPhone/iPod"
    }
  ]
  defaultNotSupportedBrowsers: [
    os: "Any"
    browser: "MSIE"
    version: 6
  ]
  noticeText:
    professional:
      title: "Outdated Browser Detected"
      notice: "Our website has detected that you are using an outdated browser. Using your current browser will prevent you from accessing features on our website. An upgrade is not required, but is strongly recommend to improve your browsing experience on our website."
      selectBrowser: "Use the links below to download a new browser or upgrade your existing browser."
      remindMeLater: "Remind me later"
      neverRemindAgain: "No, don't remind me again"

    informal:
      title: "Whoaaa!"
      notice: "It appears you're using an outdated browser which prevents access to some of the features on our website. While it's not required, you really should <b>upgrade or install a new browser</b>!"
      selectBrowser: "Visit the official sites for popular browsers below:"
      remindMeLater: "Not now, but maybe later"
      neverRemindAgain: "No, don't remind me again"

    technical:
      title: "Old Browser Alert! <span class='bd-highlight'>DEFCON 5</span>"
      notice: "Come on! If you are hitting our site, then you must at least be partially tech savvy. So, why the older browser? We're not asking you to brush off your old Fibonacci Heap and share it with the class. Just upgrade!\nI know, I know. You don't like to be told what to do. But, we're only asking you to upgrade so you can access all the latest, greatest features on our site. It's quick and easy. But, if you still want to skip it, that's cool. We will still welcome you &mdash; and your creepy old browser. :P"
      selectBrowser: "Visit the official sites for popular browsers below:"
      remindMeLater: "Remind me later"
      neverRemindAgain: "No, don't remind me. I like my Commodore 64!"

    goofy:
      title: "Are You Serious?"
      notice: "Are you really using <b>{browser_name}</b> as your browser?\nYou're surfing the web on a dinosaur (a dangerous one too &mdash; like a Tyrannosaurus or Pterodactyl or something scary like that). <b>Get with it and upgrade now!</b> If you do, we promise you will enjoy our site a whole lot more. :)"
      selectBrowser: "Visit the official sites for popular browsers below:"
      remindMeLater: "Maybe Later"
      neverRemindAgain: "No, don't remind me again"

    mean:
      title: "Umm, Your Browser Sucks!"
      notice: "Get a new one here."
      selectBrowser: "Official sites for popular browsers:"
      remindMeLater: "Remind me later, a'hole"
      neverRemindAgain: "F' off! My browser rocks!"
