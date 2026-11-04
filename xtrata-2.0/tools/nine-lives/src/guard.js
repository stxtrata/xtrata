(function(){
 'use strict';
 function show(title,detail){var l=document.getElementById('loading');if(!l||window.__bfReady)return;l.innerHTML='<div class="error-panel"><h2>'+title+'</h2><p>'+detail+'</p></div>';l.style.opacity=1;}
 var missing=[];
 try{new Function('var a={b:1};return a?.b??2;');}catch(e){missing.push('modern JavaScript (optional chaining)');}
 if(!(window.crypto&&crypto.getRandomValues))missing.push('secure random numbers');
 if(!(window.HTMLDialogElement&&HTMLDialogElement.prototype.showModal))missing.push('dialog windows');
 var c=document.createElement('canvas');if(!(c.getContext&&c.getContext('2d')))missing.push('canvas graphics');
 if(!Array.prototype.at)Object.defineProperty(Array.prototype,'at',{value:function(i){i=Math.trunc(i)||0;if(i<0)i+=this.length;return i<0||i>=this.length?undefined:this[i];},writable:true,configurable:true});
 var P=window.CanvasRenderingContext2D&&CanvasRenderingContext2D.prototype;
 if(P&&!P.roundRect)P.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(typeof r==='number'?r:(r&&r[0])||0,w/2,h/2));this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath();};
 if(missing.length){window.__bfUnsupported=true;show('This browser is too old','Nine Lives needs '+missing.join(', ')+'. Please open it in an up-to-date Chrome, Edge, Firefox or Safari.');return;}
 window.addEventListener('error',function(e){show('Something went wrong','The machine could not start ('+(e&&e.message?String(e.message).slice(0,140):'unknown error')+'). Try reloading the page or another browser.');});
 window.addEventListener('unhandledrejection',function(e){show('Something went wrong','The machine could not start ('+String((e&&e.reason&&e.reason.message)||e.reason||'unknown error').slice(0,140)+').');});
})();
