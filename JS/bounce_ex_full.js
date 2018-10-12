//FFerazza - exit intent logic to detect out of document mouseouts on desktop / scroll exit intents on mobile
//logic fully speccable as per instructions below
//

function ZDExitIntent(callback, options) {
 // defaults to become options - Scrollinterval > ms delay between event listeners to avoid mem hogging
 //
 // triggers: 
 // timeout sets a timeout trigger
 // target sets a trigger when content scrolls up to an element
 // exitIntent - detects when user cursor leaves document. Mouseback parameter can prevent this from firing if user gets back to document within "mouseback milliseconds"
 // 
 // EXAMPLE
 // bounceEx mobile  after 5 seconds from trigger init, if user scrolls down 60% of the page, then scrolls up 10%, show modal
 // var _ZDExitIntent = new ZDExitIntent(function() {
 //   var _ZDExitIntent = new ZDExitIntent(showMailSubModal, { trigger: 'scrollup', percentup: 10 });
 //   }, { trigger: 'scrolldown', percentdown: 60 },{ trigger: 'timeout', timeout: 5000 });
 
  var defaults = {trigger:"timeout", target:"", timeout:0, percentDown:50, percentUp:10, scrollInterval:1000, mouseback: 1000};
  this.complete = false;
  this.callback = callback;
  this.timer = null;
  this.interval = null;
  this.options = jQuery.extend(defaults, options);
  this.init = function() {
    if (jQuery.cookie.call().zdExitIntent || jQuery.cookie.call().techDealSub ) {
      return {};
    }
    if (this.options.trigger == "exitIntent") {
      var parentThis = this;
      var reEnterTime = this.options.mouseback
      jQuery(document).mouseleave(function(e) {
      timer = setTimeout(function(){
        if (!parentThis.complete && e.clientY < 0) {
          parentThis.callback();
          parentThis.complete = true;
          jQuery(document).off("mouseleave");
        }
        }, reEnterTime )
      }).mouseenter(function() {
      clearTimeout(timer);
});
    } else {
      //check trigger existance
      if (this.options.trigger == "target") {
        if (this.options.target !== "") {
          if (jQuery(this.options.target).length == 0) {
            this.complete = true;
          } else {
            var targetScroll = jQuery(this.options.target).offset().top;
            var parentThis = this;
            this.interval = setInterval(function() {
              if (jQuery(window).scrollTop() >= targetScroll) {
                clearInterval(parentThis.interval);
                parentThis.interval = null;
                if (!parentThis.complete) {
                  parentThis.callback();
                  parentThis.complete = true;
                }
              }
            }, this.options.scrollInterval);
          }
        }
      } else {
        if (this.options.trigger == "scrollDown") {
         // Let the user scroll down by some significant amount
          var scrollStart = jQuery(window).scrollTop();
          var pageHeight = jQuery(document).height();
          var parentThis = this;
          if (pageHeight > 0) {
            this.interval = setInterval(function() {
              var scrollAmount = jQuery(window).scrollTop() - scrollStart;
              if (scrollAmount < 0) {
                scrollAmount = 0;
                scrollStart = jQuery(window).scrollTop();
              }
              var downScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
              if (downScrollPercent > parseFloat(parentThis.options.percentDown) / 100) {
                clearInterval(parentThis.interval);
                parentThis.interval = null;
                if (!parentThis.complete) {
                  parentThis.callback();
                  parentThis.complete = true;
                }
              }
            }, this.options.scrollInterval);
          }
        } else {
          if (this.options.trigger == "scrollUp") {
           // Let the user scroll down by some significant amount
            var scrollStart = jQuery(window).scrollTop();
            var pageHeight = jQuery(document).height();
            var parentThis = this;
            if (pageHeight > 0) {
              this.interval = setInterval(function() {
                var scrollAmount = scrollStart - jQuery(window).scrollTop();
                if (scrollAmount < 0) {
                  scrollAmount = 0;
                  scrollStart = jQuery(window).scrollTop();
                }
                var upScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
                if (upScrollPercent > parseFloat(parentThis.options.percentUp) / 100) {
                  clearInterval(parentThis.interval);
                  parentThis.interval = null;
                  if (!parentThis.complete) {
                    parentThis.callback();
                    parentThis.complete = true;
                  }
                }
              }, this.options.scrollInterval);
            }
          } else {
            if (this.options.trigger == "timeout") {
              this.timer = setTimeout(this.callback, this.options.timeout);
            }
          }
        }
      }
    }
  };
  this.cancel = function() {
    if (this.timer !== null) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.complete = true;
  };
  this.init();
}
;