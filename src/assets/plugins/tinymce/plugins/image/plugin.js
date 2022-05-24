/**
 * Copyright (c) Tiny Technologies, Inc. All rights reserved.
 * Licensed under the LGPL or a commercial license.
 * For LGPL see License.txt in the project root for license information.
 * For commercial licenses see https://www.tiny.cloud/
 *
 * Version: 5.0.11 (2019-07-04)
 */
!function(l){"use strict";var t,e,n,r,i=tinymce.util.Tools.resolve("tinymce.PluginManager"),a=function(){},o=function(t){return function(){return t}},u=function(t){return t},c=o(!1),s=o(!0),f=c,m=s,d=function(){return g},g=(r={fold:function(t,e){return t()},is:f,isSome:f,isNone:m,getOr:n=function(t){return t},getOrThunk:e=function(t){return t()},getOrDie:function(t){throw new Error(t||"error: getOrDie called on none.")},getOrNull:function(){return null},getOrUndefined:function(){return undefined},or:n,orThunk:e,map:d,ap:d,each:function(){},bind:d,flatten:d,exists:f,forall:m,filter:d,equals:t=function(t){return t.isNone()},equals_:t,toArray:function(){return[]},toString:o("none()")},Object.freeze&&Object.freeze(r),r),p=function(n){var t=function(){return n},e=function(){return i},r=function(t){return t(n)},i={fold:function(t,e){return e(n)},is:function(t){return n===t},isSome:m,isNone:f,getOr:t,getOrThunk:t,getOrDie:t,getOrNull:t,getOrUndefined:t,or:e,orThunk:e,map:function(t){return p(t(n))},ap:function(t){return t.fold(d,function(t){return p(t(n))})},each:function(t){t(n)},bind:r,flatten:t,exists:r,forall:r,filter:function(t){return t(n)?i:g},equals:function(t){return t.is(n)},equals_:function(t,e){return t.fold(f,function(t){return e(n,t)})},toArray:function(){return[n]},toString:function(){return"some("+n+")"}};return i},w={some:p,none:d,from:function(t){return null===t||t===undefined?g:p(t)}},h=function(e){return function(t){return function(t){if(null===t)return"null";var e=typeof t;return"object"===e&&(Array.prototype.isPrototypeOf(t)||t.constructor&&"Array"===t.constructor.name)?"array":"object"===e&&(String.prototype.isPrototypeOf(t)||t.constructor&&"String"===t.constructor.name)?"string":e}(t)===e}},U=h("string"),b=h("object"),v=h("boolean"),y=h("function"),S=Array.prototype.slice,D=Array.prototype.push,A=function(t){for(var e=[],n=0,r=t.length;n<r;++n){if(!Array.prototype.isPrototypeOf(t[n]))throw new Error("Arr.flatten item "+n+" was not an array, input: "+t);D.apply(e,t[n])}return e},T=(y(Array.from)&&Array.from,function(){return(T=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++)for(var i in e=arguments[n])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t}).apply(this,arguments)}),O=function(t){var n=w.none(),e=[],r=function(t){i()?o(t):e.push(t)},i=function(){return n.isSome()},a=function(t){!function(t,e){for(var n=0,r=t.length;n<r;n++)e(t[n],n,t)}(t,o)},o=function(e){n.each(function(t){l.setTimeout(function(){e(t)},0)})};return t(function(t){n=w.some(t),a(e),e=[]}),{get:r,map:function(n){return O(function(e){r(function(t){e(n(t))})})},isReady:i}},C={nu:O,pure:function(e){return O(function(t){t(e)})}},x=function(e){var t=function(t){var r;e((r=t,function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var n=this;l.setTimeout(function(){r.apply(n,t)},0)}))},n=function(){return C.nu(t)};return{map:function(r){return x(function(n){t(function(t){var e=r(t);n(e)})})},bind:function(n){return x(function(e){t(function(t){n(t).get(e)})})},anonBind:function(n){return x(function(e){t(function(t){n.get(e)})})},toLazy:n,toCached:function(){var e=null;return x(function(t){null===e&&(e=n()),e.get(t)})},get:t}},I={nu:x,pure:function(e){return x(function(t){t(e)})}},P=function(n){return{is:function(t){return n===t},isValue:s,isError:c,getOr:o(n),getOrThunk:o(n),getOrDie:o(n),or:function(t){return P(n)},orThunk:function(t){return P(n)},fold:function(t,e){return e(n)},map:function(t){return P(t(n))},mapError:function(t){return P(n)},each:function(t){t(n)},bind:function(t){return t(n)},exists:function(t){return t(n)},forall:function(t){return t(n)},toOption:function(){return w.some(n)}}},N=function(n){return{is:c,isValue:c,isError:s,getOr:u,getOrThunk:function(t){return t()},getOrDie:function(){return t=String(n),function(){throw new Error(t)}();var t},or:function(t){return t},orThunk:function(t){return t()},fold:function(t,e){return t(n)},map:function(t){return N(n)},mapError:function(t){return N(t(n))},each:a,bind:function(t){return N(n)},exists:c,forall:s,toOption:w.none}},L={value:P,error:N,fromOption:function(t,e){return t.fold(function(){return N(e)},P)}},_=function(a){return T({},a,{toCached:function(){return _(a.toCached())},bindFuture:function(e){return _(a.bind(function(t){return t.fold(function(t){return I.pure(L.error(t))},function(t){return e(t)})}))},bindResult:function(e){return _(a.map(function(t){return t.bind(e)}))},mapResult:function(e){return _(a.map(function(t){return t.map(e)}))},mapError:function(e){return _(a.map(function(t){return t.mapError(e)}))},foldResult:function(e,n){return a.map(function(t){return t.fold(e,n)})},withTimeout:function(t,i){return _(I.nu(function(e){var n=!1,r=l.setTimeout(function(){n=!0,e(L.error(i()))},t);a.get(function(t){n||(l.clearTimeout(r),e(t))})}))}})},E=function(t){return _(I.nu(t))},R=E,z=Object.prototype.hasOwnProperty,k=function(o){return function(){for(var t=new Array(arguments.length),e=0;e<t.length;e++)t[e]=arguments[e];if(0===t.length)throw new Error("Can't merge zero objects");for(var n={},r=0;r<t.length;r++){var i=t[r];for(var a in i)z.call(i,a)&&(n[a]=o(n[a],i[a]))}return n}},H=k(function(t,e){return b(t)&&b(e)?H(t,e):e}),j=k(function(t,e){return e}),B="undefined"!=typeof l.window?l.window:Function("return this;")(),M=function(t,e){return function(t,e){for(var n=e!==undefined&&null!==e?e:B,r=0;r<t.length&&n!==undefined&&null!==n;++r)n=n[t[r]];return n}(t.split("."),e)},F={getOrDie:function(t,e){var n=M(t,e);if(n===undefined||null===n)throw t+" not available on this browser";return n}},G=function(){return F.getOrDie("URL")},W=function(t){return G().createObjectURL(t)},q=function(t){G().revokeObjectURL(t)},$=function(t){var e=t.imageList.map(function(t){return{name:"images",type:"selectbox",label:"Image list",items:t}}),n=t.classList.map(function(t){return{name:"classes",type:"selectbox",label:"Class",items:t}});return A([[{name:"src",type:"urlinput",filetype:"image",label:"Source"}],e.toArray(),t.hasDescription?[{name:"alt",type:"input",label:"Image description"}]:[],t.hasImageTitle?[{name:"title",type:"input",label:"Image title"}]:[],t.hasDimensions?[{name:"dimensions",type:"sizeinput"}]:[],[{type:"grid",columns:2,items:A([n.toArray(),t.hasImageCaption?[{type:"label",label:"Caption",items:[{type:"checkbox",name:"caption",label:"Show caption"}]}]:[]])}]])},J=function(t){return{title:"General",name:"general",items:$(t)}},V=$,X=tinymce.util.Tools.resolve("tinymce.dom.DOMUtils");var Z=tinymce.util.Tools.resolve("tinymce.util.Promise"),K=tinymce.util.Tools.resolve("tinymce.util.XHR"),Q=function(t){return t.getParam("images_upload_url","","string")},Y=function(t){return t.getParam("images_upload_handler",undefined,"function")},tt={hasDimensions:function(t){return t.getParam("image_dimensions",!0,"boolean")},hasUploadTab:function(t){return t.getParam("image_uploadtab",!0,"boolean")},hasAdvTab:function(t){return t.getParam("image_advtab",!1,"boolean")},getPrependUrl:function(t){return t.getParam("image_prepend_url","","string")},getClassList:function(t){return t.getParam("image_class_list")},hasDescription:function(t){return t.getParam("image_description",!0,"boolean")},hasImageTitle:function(t){return t.getParam("image_title",!1,"boolean")},hasImageCaption:function(t){return t.getParam("image_caption",!1,"boolean")},getImageList:function(t){return t.getParam("image_list",!1)},hasUploadUrl:function(t){return!!Q(t)},hasUploadHandler:function(t){return!!Y(t)},getUploadUrl:Q,getUploadHandler:Y,getUploadBasePath:function(t){return t.getParam("images_upload_base_path",undefined,"string")},getUploadCredentials:function(t){return t.getParam("images_upload_credentials",!1,"boolean")}},et=function(t,e){return Math.max(parseInt(t,10),parseInt(e,10))},nt=function(t,e){var n=l.document.createElement("img"),r=function(t){n.parentNode&&n.parentNode.removeChild(n),e(t)};n.onload=function(){var t={width:et(n.width,n.clientWidth),height:et(n.height,n.clientHeight)};r(L.value(t))},n.onerror=function(){r(L.error("Failed to get image dimensions for: "+t))};var i=n.style;i.visibility="hidden",i.position="fixed",i.bottom=i.left="0px",i.width=i.height="auto",l.document.body.appendChild(n),n.src=t},rt=function(t){return t&&(t=t.replace(/px$/,"")),t},it=function(t){return 0<t.length&&/^[0-9]+$/.test(t)&&(t+="px"),t},at=function(t){if(t.margin){var e=String(t.margin).split(" ");switch(e.length){case 1:t["margin-top"]=t["margin-top"]||e[0],t["margin-right"]=t["margin-right"]||e[0],t["margin-bottom"]=t["margin-bottom"]||e[0],t["margin-left"]=t["margin-left"]||e[0];break;case 2:t["margin-top"]=t["margin-top"]||e[0],t["margin-right"]=t["margin-right"]||e[1],t["margin-bottom"]=t["margin-bottom"]||e[0],t["margin-left"]=t["margin-left"]||e[1];break;case 3:t["margin-top"]=t["margin-top"]||e[0],t["margin-right"]=t["margin-right"]||e[1],t["margin-bottom"]=t["margin-bottom"]||e[2],t["margin-left"]=t["margin-left"]||e[1];break;case 4:t["margin-top"]=t["margin-top"]||e[0],t["margin-right"]=t["margin-right"]||e[1],t["margin-bottom"]=t["margin-bottom"]||e[2],t["margin-left"]=t["margin-left"]||e[3]}delete t.margin}return t},ot=function(t,e){var n=tt.getImageList(t);"string"==typeof n?K.send({url:n,success:function(t){e(JSON.parse(t))}}):"function"==typeof n?n(e):e(n)},ut=function(t,e,n){var r=function(){n.onload=n.onerror=null,t.selection&&(t.selection.select(n),t.nodeChanged())};n.onload=function(){e.width||e.height||!tt.hasDimensions(t)||t.dom.setAttribs(n,{width:String(n.clientWidth),height:String(n.clientHeight)}),r()},n.onerror=r},lt=function(i){return new Z(function(t,e){var n=function r(){return new(F.getOrDie("FileReader"))}();n.onload=function(){t(n.result)},n.onerror=function(){e(n.error.message)},n.readAsDataURL(i)})},ct=function(t){return"IMG"===t.nodeName&&(t.hasAttribute("data-mce-object")||t.hasAttribute("data-mce-placeholder"))},st=X.DOM,ft=function(t){return t.style.marginLeft&&t.style.marginRight&&t.style.marginLeft===t.style.marginRight?rt(t.style.marginLeft):""},mt=function(t){return t.style.marginTop&&t.style.marginBottom&&t.style.marginTop===t.style.marginBottom?rt(t.style.marginTop):""},dt=function(t){return t.style.borderWidth?rt(t.style.borderWidth):""},gt=function(t,e){return t.hasAttribute(e)?t.getAttribute(e):""},pt=function(t,e){return t.style[e]?t.style[e]:""},ht=function(t){return null!==t.parentNode&&"FIGURE"===t.parentNode.nodeName},bt=function(t,e,n){t.setAttribute(e,n)},vt=function(t){var e,n,r,i;ht(t)?(i=(r=t).parentNode,st.insertAfter(r,i),st.remove(i)):(e=t,n=st.create("figure",{"class":"image"}),st.insertAfter(n,e),n.appendChild(e),n.appendChild(st.create("figcaption",{contentEditable:"true"},"Caption")),n.contentEditable="false")},yt=function(t,e){var n=t.getAttribute("style"),r=e(null!==n?n:"");0<r.length?(t.setAttribute("style",r),t.setAttribute("data-mce-style",r)):t.removeAttribute("style")},wt=function(t,r){return function(t,e,n){t.style[e]?(t.style[e]=it(n),yt(t,r)):bt(t,e,n)}},Ut=function(t,e){return t.style[e]?rt(t.style[e]):gt(t,e)},St=function(t,e){var n=it(e);t.style.marginLeft=n,t.style.marginRight=n},Dt=function(t,e){var n=it(e);t.style.marginTop=n,t.style.marginBottom=n},At=function(t,e){var n=it(e);t.style.borderWidth=n},Tt=function(t,e){t.style.borderStyle=e},Ot=function(t){return"FIGURE"===t.nodeName},Ct=function(t,e){var n=l.document.createElement("img");return bt(n,"style",e.style),(ft(n)||""!==e.hspace)&&St(n,e.hspace),(mt(n)||""!==e.vspace)&&Dt(n,e.vspace),(dt(n)||""!==e.border)&&At(n,e.border),(pt(n,"borderStyle")||""!==e.borderStyle)&&Tt(n,e.borderStyle),t(n.getAttribute("style"))},xt=function(t,e){return{src:gt(e,"src"),alt:gt(e,"alt"),title:gt(e,"title"),width:Ut(e,"width"),height:Ut(e,"height"),"class":gt(e,"class"),style:t(gt(e,"style")),caption:ht(e),hspace:ft(e),vspace:mt(e),border:dt(e),borderStyle:pt(e,"borderStyle")}},It=function(t,e,n,r,i){n[r]!==e[r]&&i(t,r,n[r])},Pt=function(r,i){return function(t,e,n){r(t,n),yt(t,i)}},Nt=function(t,e,n){var r=xt(t,n);It(n,r,e,"caption",function(t,e,n){return vt(t)}),It(n,r,e,"src",bt),It(n,r,e,"alt",bt),It(n,r,e,"title",bt),It(n,r,e,"width",wt(0,t)),It(n,r,e,"height",wt(0,t)),It(n,r,e,"class",bt),It(n,r,e,"style",Pt(function(t,e){return bt(t,"style",e)},t)),It(n,r,e,"hspace",Pt(St,t)),It(n,r,e,"vspace",Pt(Dt,t)),It(n,r,e,"border",Pt(At,t)),It(n,r,e,"borderStyle",Pt(Tt,t))},Lt=function(t,e){var n=t.dom.styles.parse(e),r=at(n),i=t.dom.styles.parse(t.dom.styles.serialize(r));return t.dom.styles.serialize(i)},_t=function(t){var e=t.selection.getNode(),n=t.dom.getParent(e,"figure.image");return n?t.dom.select("img",n)[0]:e&&("IMG"!==e.nodeName||ct(e))?null:e},Et=function(e,t){var n=e.dom,r=n.getParent(t.parentNode,function(t){return e.schema.getTextBlockElements()[t.nodeName]},e.getBody());return r?n.split(r,t):t},Rt=function(e,t){var n=function(t,e){var n=l.document.createElement("img");if(Nt(t,j(e,{caption:!1}),n),bt(n,"alt",e.alt),e.caption){var r=st.create("figure",{"class":"image"});return r.appendChild(n),r.appendChild(st.create("figcaption",{contentEditable:"true"},"Caption")),r.contentEditable="false",r}return n}(function(t){return Lt(e,t)},t);e.dom.setAttrib(n,"data-mce-id","__mcenew"),e.focus(),e.selection.setContent(n.outerHTML);var r=e.dom.select('*[data-mce-id="__mcenew"]')[0];if(e.dom.setAttrib(r,"data-mce-id",null),Ot(r)){var i=Et(e,r);e.selection.select(i)}else e.selection.select(r)},zt=function(t,e){var n=_t(t);n?e.src?function(e,t){var n,r=_t(e);if(Nt(function(t){return Lt(e,t)},t,r),n=r,e.dom.setAttrib(n,"src",n.getAttribute("src")),Ot(r.parentNode)){var i=r.parentNode;Et(e,i),e.selection.select(r.parentNode)}else e.selection.select(r),ut(e,t,r)}(t,e):function(t,e){if(e){var n=t.dom.is(e.parentNode,"figure.image")?e.parentNode:e;t.dom.remove(n),t.focus(),t.nodeChanged(),t.dom.isEmpty(t.getBody())&&(t.setContent(""),t.selection.setCursorLocation())}}(t,n):e.src&&Rt(t,e)},kt=tinymce.util.Tools.resolve("tinymce.util.Tools"),Ht=function(t){return U(t.value)?t.value:""},jt=function(t,i){var a=[];return kt.each(t,function(t){var e=U(t.text)?t.text:U(t.title)?t.title:"";if(t.menu!==undefined){var n=jt(t.menu,i);a.push({text:e,items:n})}else{var r=i(t);a.push({text:e,value:r})}}),a},Bt=function(e){return void 0===e&&(e=Ht),function(t){return t?w.from(t).map(function(t){return jt(t,e)}):w.none()}},Mt=function(t,n){return function(t,e){for(var n=0;n<t.length;n++){var r=e(t[n],n);if(r.isSome())return r}return w.none()}(t,function(t){return e=t,Object.prototype.hasOwnProperty.call(e,"items")?Mt(t.items,n):t.value===n?w.some(t):w.none();var e})},Ft=Bt,Gt=function(t){return Bt(Ht)(t)},Wt=function(t,e){return t.bind(function(t){return Mt(t,e)})};function qt(u){var e=function(t,r,i,e){var a,n;(a=function o(){return new(F.getOrDie("XMLHttpRequest"))}()).open("POST",u.url),a.withCredentials=u.credentials,a.upload.onprogress=function(t){e(t.loaded/t.total*100)},a.onerror=function(){i("Image upload failed due to a XHR Transport error. Code: "+a.status)},a.onload=function(){var t,e,n;a.status<200||300<=a.status?i("HTTP Error: "+a.status):(t=JSON.parse(a.responseText))&&"string"==typeof t.location?r((e=u.basePath,n=t.location,e?e.replace(/\/$/,"")+"/"+n.replace(/^\//,""):n)):i("Invalid JSON: "+a.responseText)},(n=new l.FormData).append("file",t.blob(),t.filename()),a.send(n)};return u=kt.extend({credentials:!1,handler:e},u),{upload:function(t){return u.url||u.handler!==e?(r=t,i=u.handler,new Z(function(t,e){try{i(r,t,e,a)}catch(n){e(n.message)}})):Z.reject("Upload url missing from the settings.");var r,i}}}var $t=function(t){return{title:"Advanced",name:"advanced",items:[{type:"input",label:"Style",name:"style"},{type:"grid",columns:2,items:[{type:"input",label:"Vertical space",name:"vspace"},{type:"input",label:"Horizontal space",name:"hspace"},{type:"input",label:"Border width",name:"border"},{type:"selectbox",name:"borderstyle",label:"Border style",items:[{text:"Select...",value:""},{text:"Solid",value:"solid"},{text:"Dotted",value:"dotted"},{text:"Dashed",value:"dashed"},{text:"Double",value:"double"},{text:"Groove",value:"groove"},{text:"Ridge",value:"ridge"},{text:"Inset",value:"inset"},{text:"Outset",value:"outset"},{text:"None",value:"none"},{text:"Hidden",value:"hidden"}]}]}]}},Jt=function(n){var e,t,r=Ft(function(t){return n.convertURL(t.value||t.url,"src")}),i=I.nu(function(e){ot(n,function(t){e(r(t).map(function(t){return A([[{text:"None",value:""}],t])}))})}),a=Gt(tt.getClassList(n)),o=tt.hasAdvTab(n),u=tt.hasUploadTab(n),l=tt.hasUploadUrl(n),c=tt.hasUploadHandler(n),s=(t=_t(e=n))?xt(function(t){return Lt(e,t)},t):{src:"",alt:"",title:"",width:"",height:"","class":"",style:"",caption:!1,hspace:"",vspace:"",border:"",borderStyle:""},f=tt.hasDescription(n),m=tt.hasImageTitle(n),d=tt.hasDimensions(n),g=tt.hasImageCaption(n),p=tt.getUploadUrl(n),h=tt.getUploadBasePath(n),b=tt.getUploadCredentials(n),v=tt.getUploadHandler(n),y=w.some(tt.getPrependUrl(n)).filter(function(t){return U(t)&&0<t.length});return i.map(function(t){return{image:s,imageList:t,classList:a,hasAdvTab:o,hasUploadTab:u,hasUploadUrl:l,hasUploadHandler:c,hasDescription:f,hasImageTitle:m,hasDimensions:d,hasImageCaption:g,url:p,basePath:h,credentials:b,handler:v,prependURL:y}})},Vt=function(t){return{title:"Upload",name:"upload",items:[{type:"dropzone",name:"fileinput"}]}},Xt=function(t){return{src:{value:t.src,meta:{}},images:t.src,alt:t.alt,title:t.title,dimensions:{width:t.width,height:t.height},classes:t["class"],caption:t.caption,style:t.style,vspace:t.vspace,border:t.border,hspace:t.hspace,borderstyle:t.borderStyle,fileinput:[]}},Zt=function(t){return{src:t.src.value,alt:t.alt,title:t.title,width:t.dimensions.width,height:t.dimensions.height,"class":t.classes,style:t.style,caption:t.caption,hspace:t.hspace,vspace:t.vspace,border:t.border,borderStyle:t.borderstyle}},Kt=function(t,e){var n,r,i=e.getData();(n=t,r=i.src.value,/^(?:[a-zA-Z]+:)?\/\//.test(r)?w.none():n.prependURL.bind(function(t){return r.substring(0,t.length)!==t?w.some(t+r):w.none()})).each(function(t){e.setData({src:{value:t,meta:i.src.meta}})})},Qt=function(t,e){var n,r,i,a=e.getData(),o=a.src.meta;if(o!==undefined){var u=H({},a);r=u,i=o,(n=t).hasDescription&&U(i.alt)&&(r.alt=i.alt),n.hasImageTitle&&U(i.title)&&(r.title=i.title),n.hasDimensions&&(U(i.width)&&(r.dimensions.width=i.width),U(i.height)&&(r.dimensions.height=i.height)),U(i["class"])&&Wt(n.classList,i["class"]).each(function(t){r.classes=t.value}),n.hasImageCaption&&v(i.caption)&&(r.caption=i.caption),n.hasAdvTab&&(U(i.vspace)&&(r.vspace=i.vspace),U(i.border)&&(r.border=i.border),U(i.hspace)&&(r.hspace=i.hspace),U(i.borderstyle)&&(r.borderstyle=i.borderstyle)),e.setData(u)}},Yt=function(t,e,n,r){var i,a,o,u,l,c,s,f,m,d,g,p;Kt(e,r),Qt(e,r),i=t,a=e,o=n,l=(u=r).getData(),c=l.src.value,(s=l.src.meta||{}).width||s.height||!a.hasDimensions||i.imageSize(c).get(function(t){t.each(function(t){o.open&&u.setData({dimensions:t})})}),f=e,m=n,g=(d=r).getData(),p=Wt(f.imageList,g.src.value),m.prevImage=p,d.setData({images:p.map(function(t){return t.value}).getOr("")})},te=function(t,e,n){var r,i,a,o,u,l=at(t(n.style)),c=H({},n);return c.vspace=(r=l)["margin-top"]&&r["margin-bottom"]&&r["margin-top"]===r["margin-bottom"]?rt(String(r["margin-top"])):"",c.hspace=(i=l)["margin-right"]&&i["margin-left"]&&i["margin-right"]===i["margin-left"]?rt(String(i["margin-right"])):"",c.border=(a=l)["border-width"]?rt(String(a["border-width"])):"",c.borderstyle=(o=l)["border-style"]?String(o["border-style"]):"",c.style=(u=e)(t(u(l))),c},ee=function(o,u,l,c){var t,e=c.getData();c.block("Uploading image"),(t=e.fileinput,0===t.length?w.none():w.some(t[0])).fold(function(){c.unblock()},function(n){var r=W(n),i=qt({url:u.url,basePath:u.basePath,credentials:u.credentials,handler:u.handler}),a=function(){c.unblock(),q(r)};lt(n).then(function(t){var e=o.createBlobCache(n,r,t);i.upload(e).then(function(t){c.setData({src:{value:t,meta:{}}}),c.showTab("general"),Yt(o,u,l,c),a()})["catch"](function(t){a(),o.alertErr(c,t)})})})},ne=function(h,b,v){return function(t,e){var n,r,i,a,o,u,l,c,s,f,m,d,g,p;"src"===e.name?Yt(h,b,v,t):"images"===e.name?(s=h,f=b,m=v,g=(d=t).getData(),(p=Wt(f.imageList,g.images)).each(function(t){""===g.alt||m.prevImage.map(function(t){return t.text===g.alt}).getOr(!1)?""===t.value?d.setData({src:t,alt:m.prevAlt}):d.setData({src:t,alt:t.text}):d.setData({src:t})}),m.prevImage=p,Yt(s,f,m,d)):"alt"===e.name?v.prevAlt=t.getData().alt:"style"===e.name?(o=h,l=(u=t).getData(),c=te(o.parseStyle,o.serializeStyle,l),u.setData(c)):"vspace"===e.name||"hspace"===e.name||"border"===e.name||"borderstyle"===e.name?(n=h,r=t,i=H(Xt(b.image),r.getData()),a=Ct(n.normalizeCss,Zt(i)),r.setData({style:a})):"fileinput"===e.name&&ee(h,b,v,t)}},re=function(a){return function(t){var e,n,r,i={prevImage:Wt((e=t).imageList,e.image.src),prevAlt:e.image.alt,open:!0};return{title:"Insert/Edit Image",size:"normal",body:(r=t,r.hasAdvTab||r.hasUploadUrl||r.hasUploadHandler?{type:"tabpanel",tabs:A([[J(r)],r.hasAdvTab?[$t(r)]:[],r.hasUploadTab&&(r.hasUploadUrl||r.hasUploadHandler)?[Vt(r)]:[]])}:{type:"panel",items:V(r)}),buttons:[{type:"cancel",name:"cancel",text:"Cancel"},{type:"submit",name:"save",text:"Save",primary:!0}],initialData:Xt(t.image),onSubmit:a.onSubmit(t),onChange:ne(a,t,i),onClose:(n=i,function(){n.open=!1})}}},ie=function(e){var n,r,i,a,o,u,l,t={onSubmit:(l=e,function(n){return function(t){var e=H(Xt(n.image),t.getData());l.undoManager.transact(function(){zt(l,Zt(e))}),l.editorUpload.uploadImagesAuto(),t.close()}}),imageSize:(u=e,function(t){return R(function(n){nt(u.documentBaseURI.toAbsolute(t),function(t){var e=t.map(function(t){return{width:String(t.width),height:String(t.height)}});n(e)})})}),createBlobCache:(o=e,function(t,e,n){return o.editorUpload.blobCache.create({blob:t,blobUri:e,name:t.name?t.name.replace(/\.[^\.]+$/,""):null,base64:n.split(",")[1]})}),alertErr:(a=e,function(t,e){a.windowManager.alert(e,t.close)}),normalizeCss:(i=e,function(t){return Lt(i,t)}),parseStyle:(r=e,function(t){return r.dom.parseStyle(t)}),serializeStyle:(n=e,function(t,e){return n.dom.serializeStyle(t,e)})};return{open:function(){return Jt(e).map(re(t)).get(function(t){e.windowManager.open(t)})}}},ae=function(t){t.addCommand("mceImage",ie(t).open)},oe=function(a){return function(t){for(var e,n=t.length,r=function(t){t.attr("contenteditable",a?"true":null)};n--;){var i=t[n];void 0,(e=i.attr("class"))&&/\bimage\b/.test(e)&&(i.attr("contenteditable",a?"false":null),kt.each(i.getAll("figcaption"),r))}}},ue=function(t){t.on("PreInit",function(){t.parser.addNodeFilter("figure",oe(!0)),t.serializer.addNodeFilter("figure",oe(!1))})},le=function(e){e.ui.registry.addToggleButton("image",{icon:"image",tooltip:"Insert/edit image",onAction:ie(e).open,onSetup:function(t){return e.selection.selectorChangedWithUnbind("img:not([data-mce-object],[data-mce-placeholder]),figure.image",t.setActive).unbind}}),e.ui.registry.addMenuItem("image",{icon:"image",text:"Image...",onAction:ie(e).open}),e.ui.registry.addContextMenu("image",{update:function(t){return Ot(t)||"IMG"===t.nodeName&&!ct(t)?["image"]:[]}})};!function ce(){i.add("image",function(t){ue(t),le(t),ae(t)})}()}(window);