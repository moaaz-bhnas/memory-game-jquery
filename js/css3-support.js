"use strict";

// Function from: https://stackoverflow.com/a/36191841/7982963
var isValueSupported = function isValueSupported(prop, value) {
  var el = document.createElement('div');
  el.style[prop] = value;
  return el.style[prop] === value;
}; // Function from: http://lea.verou.me/2009/02/check-if-a-css-property-is-supported/


var isPropertySupported = function isPropertySupported(property) {
  return property in document.body.style;
};
/* Tests --- */
// 2d transforms


if (isPropertySupported('transform') && isValueSupported('transform', 'rotate(-30deg)')) {
  document.documentElement.classList.add('csstransforms');
} else {
  document.documentElement.classList.add('no-csstransforms');
} // 3d transforms


if (isValueSupported('perspective', '400px') && isValueSupported('transform-style', 'preserve-3d') && isValueSupported('backface-visibility', 'hidden') && isValueSupported('transform', 'rotateY(-180deg)') && isPropertySupported('perspective') && isPropertySupported('transform-style') && isPropertySupported('backface-visibility') && isPropertySupported('transform') && !navigator.userAgent.includes('Firefox')) {
  document.documentElement.classList.add('csstransforms3d');
} else {
  document.documentElement.classList.add('no-csstransforms3d');
} // /* Detect unpopular browsers --- */
// // The are likely to have bugs in displaying 3d animation, so I'm just gonna give them the second style
// // Mobile Browsers
// const isMobile = () => {
//   const ua = (navigator || {}).userAgent;
//   if (ua) {
//     return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua))
//   }
//   return false;
// }
// // Opera 8.0+
// const isOpera = () => {
//   let opr = window.opr || {};
//   return (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
// }
// // Firefox 1.0+
// const isFirefox = () => typeof InstallTrigger !== 'undefined';
// // Safari 3.0+ "[object HTMLElementConstructor]" 
// const isSafari = () => {
//   let safari = window.safari || {};
//   return /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
// }
// // Internet Explorer 6-11
// const isIE = () => /*@cc_on!@*/false || !!document.documentMode;
// // Edge 20+
// const isEdge = () => !isIE() && !!window.StyleMedia;
// // Chrome 1+
// const isChrome = () => !!window.chrome && !!window.chrome.webstore;
// if (!(isMobile() || isOpera() || isFirefox() || isSafari() || isIE() || isEdge() || isChrome())) {
//   document.documentElement.classList.add('no-csstransforms3d');
// }