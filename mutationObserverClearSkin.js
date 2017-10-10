//
// mutation observer to check if a new (billboard+skin) is called on the page, and cleanup the page before it renders. Heavy on overhead
//

var clearSkins = function(){
    // dynamically select target node, takes id of container calculates class[0].id (US IGN container)
    var billboardElId = ( billboardDivEl && billboardDivEl.indexOf == -1 ) ? billboardDivEl : w.document.getElementsByClassName(billboardDivEl)[0].id
    var target = w.document.getElementById(billboardElId);     
    // create an observer instance
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        console.log(mutation.type);
        var params = {"artworkUrl": null, "clickTag": null, "impressionCounter":null, "extraHtml":null, "backgroundColor":bgColor};
        _doSkin(params)
        observer.disconnect(); //kill as soon as unneeded
      });    
    });     
    // observer cfg, scalable for other needs
    var config = { 
            attributes: true,
            attributeFilter: ['data-google-query-id']
     };
     
    // pass in the target node, as well as the observer options
    observer.observe(target, config);     
  }
