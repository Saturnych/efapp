'use strict';

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
try {

  var config = { debug: false };
  config.debug = (process && process.env && process.env.NODE_ENV && process.env.NODE_ENV === 'dev');
  if (config.debug) console.log("preload config: \n", JSON.stringify(config,null,2));

  window.addEventListener('DOMContentLoaded', () => {

    const removeById = (selector) => {
      const element = document.getElementById(selector);
      if (element) {
        element.innerHTML = '';
        if (element.parentNode) element.parentNode.removeChild(element);
      }
    };

    const replaceById = (selector, text) => {
      const element = document.getElementById(selector);
      if (element) {
        element.innerText = text.toString();
        if (element.parentNode && element.parentNode.classList.contains("hide")) element.parentNode.classList.remove("hide");
      }
    };

    const replaceByTagName = (selector, texts, all) => {
      const elements = document.getElementsByTagName(selector);
      var text = (Array.isArray(texts)) ? texts[0].toString() : texts.toString();
      if (elements && elements.length) {
        if (!all) elements[0].innerText = text;
        else {
          for (let i=0;i<elements.length;i++){
	           elements[i].innerText = (Array.isArray(texts) && texts[i]) ? texts[i].toString() : text;
	        }
        }
      }
    };

    if (config.debug && process.versions)
      for (const type of ['chrome', 'node', 'electron']) {
        replaceById(`${type}-version`, process.versions[type]);
      }
    else
      removeById('versions');

    var appName = '';
    if (process.env && process.env.APP_NAME) appName = process.env.APP_NAME;
    if (appName.length && process.env && process.env.APP_VER) appName += ` v.${process.env.APP_VER}`;
    if (appName.length) replaceByTagName(`title`, appName, false);

  });

} catch (e) {
  if (typeof(config)!=='undefined' && config.debug) console.log(`preload error: "${e}"`);
}
