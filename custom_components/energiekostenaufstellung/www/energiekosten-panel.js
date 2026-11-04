var oe=Object.defineProperty;var ae=(o,t,s)=>t in o?oe(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var y=(o,t,s)=>ae(o,typeof t!="symbol"?t+"":t,s);var tt=globalThis,et=tt.ShadowRoot&&(tt.ShadyCSS===void 0||tt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,dt=Symbol(),St=new WeakMap,F=class{constructor(t,s,e){if(this._$cssResult$=!0,e!==dt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o,s=this.t;if(et&&t===void 0){let e=s!==void 0&&s.length===1;e&&(t=St.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&St.set(s,t))}return t}toString(){return this.cssText}},Et=o=>new F(typeof o=="string"?o:o+"",void 0,dt),k=(o,...t)=>{let s=o.length===1?o[0]:t.reduce((e,r,i)=>e+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new F(s,o,dt)},Ct=(o,t)=>{if(et)o.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of t){let e=document.createElement("style"),r=tt.litNonce;r!==void 0&&e.setAttribute("nonce",r),e.textContent=s.cssText,o.appendChild(e)}},ht=et?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let s="";for(let e of t.cssRules)s+=e.cssText;return Et(s)})(o):o;var{is:ne,defineProperty:le,getOwnPropertyDescriptor:ce,getOwnPropertyNames:de,getOwnPropertySymbols:he,getPrototypeOf:pe}=Object,st=globalThis,Dt=st.trustedTypes,ue=Dt?Dt.emptyScript:"",ge=st.reactiveElementPolyfillSupport,I=(o,t)=>o,pt={toAttribute(o,t){switch(t){case Boolean:o=o?ue:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let s=o;switch(t){case Boolean:s=o!==null;break;case Number:s=o===null?null:Number(o);break;case Object:case Array:try{s=JSON.parse(o)}catch{s=null}}return s}},Nt=(o,t)=>!ne(o,t),Mt={attribute:!0,type:String,converter:pt,reflect:!1,useDefault:!1,hasChanged:Nt};Symbol.metadata??=Symbol("metadata"),st.litPropertyMetadata??=new WeakMap;var S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=Mt){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){let e=Symbol(),r=this.getPropertyDescriptor(t,e,s);r!==void 0&&le(this.prototype,t,r)}}static getPropertyDescriptor(t,s,e){let{get:r,set:i}=ce(this.prototype,t)??{get(){return this[s]},set(a){this[s]=a}};return{get:r,set(a){let n=r?.call(this);i?.call(this,a),this.requestUpdate(t,n,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Mt}static _$Ei(){if(this.hasOwnProperty(I("elementProperties")))return;let t=pe(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(I("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(I("properties"))){let s=this.properties,e=[...de(s),...he(s)];for(let r of e)this.createProperty(r,s[r])}let t=this[Symbol.metadata];if(t!==null){let s=litPropertyMetadata.get(t);if(s!==void 0)for(let[e,r]of s)this.elementProperties.set(e,r)}this._$Eh=new Map;for(let[s,e]of this.elementProperties){let r=this._$Eu(s,e);r!==void 0&&this._$Eh.set(r,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let s=[];if(Array.isArray(t)){let e=new Set(t.flat(1/0).reverse());for(let r of e)s.unshift(ht(r))}else t!==void 0&&s.push(ht(t));return s}static _$Eu(t,s){let e=s.attribute;return e===!1?void 0:typeof e=="string"?e:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,s=this.constructor.elementProperties;for(let e of s.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ct(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,e){this._$AK(t,e)}_$ET(t,s){let e=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,e);if(r!==void 0&&e.reflect===!0){let i=(e.converter?.toAttribute!==void 0?e.converter:pt).toAttribute(s,e.type);this._$Em=t,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,s){let e=this.constructor,r=e._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let i=e.getPropertyOptions(r),a=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:pt;this._$Em=r;let n=a.fromAttribute(s,i.type);this[r]=n??this._$Ej?.get(r)??n,this._$Em=null}}requestUpdate(t,s,e,r=!1,i){if(t!==void 0){let a=this.constructor;if(r===!1&&(i=this[t]),e??=a.getPropertyOptions(t),!((e.hasChanged??Nt)(i,s)||e.useDefault&&e.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,e))))return;this.C(t,s,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:e,reflect:r,wrapped:i},a){e&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??s??this[t]),i!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||e||(s=void 0),this._$AL.set(t,s)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[r,i]of e){let{wrapped:a}=i,n=this[r];a!==!0||this._$AL.has(r)||n===void 0||this.C(r,void 0,i,n)}}let t=!1,s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(s)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[I("elementProperties")]=new Map,S[I("finalized")]=new Map,ge?.({ReactiveElement:S}),(st.reactiveElementVersions??=[]).push("2.1.2");var bt=globalThis,Ut=o=>o,rt=bt.trustedTypes,zt=rt?rt.createPolicy("lit-html",{createHTML:o=>o}):void 0,Ht="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Ft="?"+C,me=`<${Ft}>`,P=document,V=()=>P.createComment(""),G=o=>o===null||typeof o!="object"&&typeof o!="function",vt=Array.isArray,_e=o=>vt(o)||typeof o?.[Symbol.iterator]=="function",ut=`[ 	
\f\r]`,L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Pt=/-->/g,Tt=/>/g,U=RegExp(`>|${ut}(?:([^\\s"'>=/]+)(${ut}*=${ut}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ot=/'/g,Rt=/"/g,It=/^(?:script|style|textarea|title)$/i,xt=o=>(t,...s)=>({_$litType$:o,strings:t,values:s}),c=xt(1),D=xt(2),Ue=xt(3),T=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),jt=new WeakMap,z=P.createTreeWalker(P,129);function Lt(o,t){if(!vt(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return zt!==void 0?zt.createHTML(t):t}var $e=(o,t)=>{let s=o.length-1,e=[],r,i=t===2?"<svg>":t===3?"<math>":"",a=L;for(let n=0;n<s;n++){let l=o[n],h,g,p=-1,$=0;for(;$<l.length&&(a.lastIndex=$,g=a.exec(l),g!==null);)$=a.lastIndex,a===L?g[1]==="!--"?a=Pt:g[1]!==void 0?a=Tt:g[2]!==void 0?(It.test(g[2])&&(r=RegExp("</"+g[2],"g")),a=U):g[3]!==void 0&&(a=U):a===U?g[0]===">"?(a=r??L,p=-1):g[1]===void 0?p=-2:(p=a.lastIndex-g[2].length,h=g[1],a=g[3]===void 0?U:g[3]==='"'?Rt:Ot):a===Rt||a===Ot?a=U:a===Pt||a===Tt?a=L:(a=U,r=void 0);let f=a===U&&o[n+1].startsWith("/>")?" ":"";i+=a===L?l+me:p>=0?(e.push(h),l.slice(0,p)+Ht+l.slice(p)+C+f):l+C+(p===-2?n:f)}return[Lt(o,i+(o[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),e]},B=class o{constructor({strings:t,_$litType$:s},e){let r;this.parts=[];let i=0,a=0,n=t.length-1,l=this.parts,[h,g]=$e(t,s);if(this.el=o.createElement(h,e),z.currentNode=this.el.content,s===2||s===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=z.nextNode())!==null&&l.length<n;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(Ht)){let $=g[a++],f=r.getAttribute(p).split(C),_=/([.?@])?(.*)/.exec($);l.push({type:1,index:i,name:_[2],strings:f,ctor:_[1]==="."?mt:_[1]==="?"?_t:_[1]==="@"?$t:j}),r.removeAttribute(p)}else p.startsWith(C)&&(l.push({type:6,index:i}),r.removeAttribute(p));if(It.test(r.tagName)){let p=r.textContent.split(C),$=p.length-1;if($>0){r.textContent=rt?rt.emptyScript:"";for(let f=0;f<$;f++)r.append(p[f],V()),z.nextNode(),l.push({type:2,index:++i});r.append(p[$],V())}}}else if(r.nodeType===8)if(r.data===Ft)l.push({type:2,index:i});else{let p=-1;for(;(p=r.data.indexOf(C,p+1))!==-1;)l.push({type:7,index:i}),p+=C.length-1}i++}}static createElement(t,s){let e=P.createElement("template");return e.innerHTML=t,e}};function R(o,t,s=o,e){if(t===T)return t;let r=e!==void 0?s._$Co?.[e]:s._$Cl,i=G(t)?void 0:t._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,s,e)),e!==void 0?(s._$Co??=[])[e]=r:s._$Cl=r),r!==void 0&&(t=R(o,r._$AS(o,t.values),r,e)),t}var gt=class{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:s},parts:e}=this._$AD,r=(t?.creationScope??P).importNode(s,!0);z.currentNode=r;let i=z.nextNode(),a=0,n=0,l=e[0];for(;l!==void 0;){if(a===l.index){let h;l.type===2?h=new W(i,i.nextSibling,this,t):l.type===1?h=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(h=new ft(i,this,t)),this._$AV.push(h),l=e[++n]}a!==l?.index&&(i=z.nextNode(),a++)}return z.currentNode=P,r}p(t){let s=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(t,e,s),s+=e.strings.length-2):e._$AI(t[s])),s++}},W=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,e,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=e,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=R(this,t,s),G(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==T&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):_e(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&G(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){let{values:s,_$litType$:e}=t,r=typeof e=="number"?this._$AC(t):(e.el===void 0&&(e.el=B.createElement(Lt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===r)this._$AH.p(s);else{let i=new gt(r,this),a=i.u(this.options);i.p(s),this.T(a),this._$AH=i}}_$AC(t){let s=jt.get(t.strings);return s===void 0&&jt.set(t.strings,s=new B(t)),s}k(t){vt(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,e,r=0;for(let i of t)r===s.length?s.push(e=new o(this.O(V()),this.O(V()),this,this.options)):e=s[r],e._$AI(i),r++;r<s.length&&(this._$AR(e&&e._$AB.nextSibling,r),s.length=r)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){let e=Ut(t).nextSibling;Ut(t).remove(),t=e}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},j=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,e,r,i){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=s,this._$AM=r,this.options=i,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=d}_$AI(t,s=this,e,r){let i=this.strings,a=!1;if(i===void 0)t=R(this,t,s,0),a=!G(t)||t!==this._$AH&&t!==T,a&&(this._$AH=t);else{let n=t,l,h;for(t=i[0],l=0;l<i.length-1;l++)h=R(this,n[e+l],s,l),h===T&&(h=this._$AH[l]),a||=!G(h)||h!==this._$AH[l],h===d?t=d:t!==d&&(t+=(h??"")+i[l+1]),this._$AH[l]=h}a&&!r&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},mt=class extends j{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},_t=class extends j{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},$t=class extends j{constructor(t,s,e,r,i){super(t,s,e,r,i),this.type=5}_$AI(t,s=this){if((t=R(this,t,s,0)??d)===T)return;let e=this._$AH,r=t===d&&e!==d||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,i=t!==d&&(e===d||r);r&&this.element.removeEventListener(this.name,this,e),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ft=class{constructor(t,s,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){R(this,t)}};var fe=bt.litHtmlPolyfillSupport;fe?.(B,W),(bt.litHtmlVersions??=[]).push("3.3.3");var Vt=(o,t,s)=>{let e=s?.renderBefore??t,r=e._$litPart$;if(r===void 0){let i=s?.renderBefore??null;e._$litPart$=r=new W(t.insertBefore(V(),i),i,void 0,s??{})}return r._$AI(o),r};var yt=globalThis,w=class extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Vt(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return T}};w._$litElement$=!0,w.finalized=!0,yt.litElementHydrateSupport?.({LitElement:w});var be=yt.litElementPolyfillSupport;be?.({LitElement:w});(yt.litElementVersions??=[]).push("4.2.2");var Kt=[{id:"day",label:"Tag"},{id:"week",label:"Woche"},{id:"month",label:"Monat"},{id:"year",label:"Jahr"}],O=[{id:"energie",label:"Energie"},{id:"netz",label:"Netz"},{id:"abgaben",label:"Abgaben"}],Gt=["J\xE4nner","Februar","M\xE4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],ve=["So","Mo","Di","Mi","Do","Fr","Sa"];function wt(o,t){let s=new Date(t),e=s.getFullYear(),r=s.getMonth(),i,a;if(o==="day")i=new Date(e,r,s.getDate()),a=new Date(e,r,s.getDate()+1);else if(o==="week"){let n=(s.getDay()+6)%7;i=new Date(e,r,s.getDate()-n),a=new Date(e,r,s.getDate()-n+7)}else o==="month"?(i=new Date(e,r,1),a=new Date(e,r+1,1)):(i=new Date(e,0,1),a=new Date(e+1,0,1));return{start:i,end:a}}function Jt(o,t,s){let e=new Date(t);return o==="day"?e.setDate(e.getDate()+s):o==="week"?e.setDate(e.getDate()+7*s):o==="month"?e.setMonth(e.getMonth()+s,1):e.setFullYear(e.getFullYear()+s,0,1),e}function xe(o){let t=new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate())),s=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-s);let e=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-e)/864e5+1)/7)}var Bt=o=>String(o).padStart(2,"0"),Wt=o=>`${Bt(o.getDate())}.${Bt(o.getMonth()+1)}.`;function Yt(o,t,s){if(o==="day")return`${ve[t.getDay()]}, ${t.getDate()}. ${Gt[t.getMonth()]} ${t.getFullYear()}`;if(o==="week"){let e=new Date(s.getFullYear(),s.getMonth(),s.getDate()-1);return`KW ${xe(t)} \xB7 ${Wt(t)}\u2013${Wt(e)}${e.getFullYear()}`}return o==="month"?`${Gt[t.getMonth()]} ${t.getFullYear()}`:String(t.getFullYear())}var ye=new Intl.NumberFormat("de-AT",{style:"currency",currency:"EUR"}),we=new Intl.NumberFormat("de-AT",{minimumFractionDigits:2,maximumFractionDigits:2}),ke=new Intl.NumberFormat("de-AT",{style:"percent",maximumFractionDigits:1}),M=o=>o==null||Number.isNaN(o)?"\u2013":ye.format(o);var it=o=>o==null?"\u2013":`${we.format(o)} kWh`,ot=o=>o==null||!Number.isFinite(o)?"\u2013":ke.format(o),at=o=>JSON.parse(JSON.stringify(o));function qt(){return{valid_from:`${new Date().getFullYear()}-01-01`,vat_percent:20,reduced_window:{months:[4,5,6,7,8,9],start_hour:10,end_hour:16},variable:[{name:"Verbrauchspreis Energie",category:"energie",price_ct:10.5,price_reduced_ct:6.9},{name:"Verbrauchspreis Netznutzung",category:"netz",price_ct:8.79,price_reduced_ct:7.03},{name:"Verbrauchspreis Netzverlust",category:"netz",price_ct:.384,price_reduced_ct:null},{name:"Elektrizit\xE4tsabgabe",category:"abgaben",price_ct:.1,price_reduced_ct:null},{name:"Erneuerbaren-F\xF6rderbeitrag Netznutzung",category:"abgaben",price_ct:.583,price_reduced_ct:null},{name:"Erneuerbaren-F\xF6rderbeitrag Netzverlust",category:"abgaben",price_ct:.037,price_reduced_ct:null}],fixed:[{name:"Grundpreis Energie",category:"energie",eur_per_year:72},{name:"Grundpreis Netz",category:"netz",eur_per_year:54},{name:"Entgelt f\xFCr Messleistungen",category:"netz",eur_per_year:26.16},{name:"Erneuerbaren-F\xF6rderpauschale",category:"abgaben",eur_per_year:19.02},{name:"Erneuerbaren-F\xF6rderbeitrag Grundpreis",category:"abgaben",eur_per_year:3.8}]}}function Zt(){return{valid_from:new Date().toISOString().slice(0,10),vat_percent:20,reduced_window:null,variable:[{name:"Energie",category:"energie",price_ct:0,price_reduced_ct:null}],fixed:[]}}var Xt=["J\xE4n","Feb","M\xE4r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],nt=(o,t)=>t==="kwh"?it(o):M(o);function te(o){if(!(o>0))return 1;let t=Math.pow(10,Math.floor(Math.log10(o)));for(let s of[1,1.5,2,2.5,3,4,5,6,8,10])if(s*t>=o)return s*t;return 10*t}function Qt(o,t,s=!1){let e=new Date(o);return t==="hour"?s?`${String(e.getHours()).padStart(2,"0")}:00`:String(e.getHours()):t==="day"?s?`${e.getDate()}.${e.getMonth()+1}.${e.getFullYear()}`:String(e.getDate()):s?`${Xt[e.getMonth()]} ${e.getFullYear()}`:Xt[e.getMonth()]}var q=class extends w{connectedCallback(){super.connectedCallback(),this._ro=new ResizeObserver(t=>{let s=Math.round(t[0].contentRect.width);s&&s!==this._w&&(this._w=s)}),this._ro.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._ro?.disconnect()}};y(q,"properties",{_w:{state:!0}});var K=class extends q{constructor(){super(),this.height=260,this.unit="eur"}render(){let t=this._w||600,s=this.height,e=this.keys||[],r=this.stacks||[],i=e.length;if(!i)return c`<div class="empty">Keine Daten</div>`;let a=this.compact?4:56,n=8,l=10,h=this.compact?4:24,g=t-a-n,p=s-l-h,$=e.map((x,A)=>r.reduce((H,lt)=>H+Math.max(0,lt.values[A]||0),0)),f=te(Math.max(...$)),_=g/i,m=Math.max(1,_*.7),v=x=>l+p-x/f*p,u=[0,.25,.5,.75,1].map(x=>x*f),b=Math.max(1,Math.ceil(i/Math.max(1,Math.floor(g/34)))),E=[];e.forEach((x,A)=>{let H=0,lt=a+A*_+(_-m)/2;r.forEach(kt=>{let ct=Math.max(0,kt.values[A]||0);if(ct<=0)return;let At=v(H+ct),ie=v(H);E.push(D`<rect x=${lt} y=${At} width=${m} height=${Math.max(.5,ie-At)} fill=${kt.color} rx="1.5"></rect>`),H+=ct})});let N=this._hover;return c`
      <div class="wrap" @mouseleave=${()=>this._hover=null}>
        <svg width=${t} height=${s}>
          ${this.compact?d:u.map(x=>D`<line x1=${a} x2=${t-n} y1=${v(x)} y2=${v(x)} class="grid"></line>
                  <text x=${a-6} y=${v(x)+4} text-anchor="end" class="axis">${this.unit==="kwh"?x.toLocaleString("de-AT",{maximumFractionDigits:2}):M(x)}</text>`)}
          ${E}
          ${N!=null?D`<rect x=${a+N*_} y=${l} width=${_} height=${p} class="hl"></rect>`:d}
          ${this.compact?d:e.map((x,A)=>A%b===0?D`<text x=${a+A*_+_/2} y=${s-6} text-anchor="middle" class="axis">${Qt(x,this.bucket)}</text>`:d)}
          ${e.map((x,A)=>D`<rect x=${a+A*_} y=${l} width=${_} height=${p} fill="transparent"
              @mouseenter=${()=>this._hover=A}></rect>`)}
        </svg>
        ${N!=null?this._tooltip(N,a+N*_+_/2,t):d}
      </div>
      ${this.compact?d:c`<div class="legend">
            ${r.map(x=>c`<span><i style="background:${x.color}"></i>${x.name}</span>`)}
          </div>`}
    `}_tooltip(t,s,e){let r=this.stacks.map(n=>({...n,v:n.values[t]||0})).filter(n=>Math.abs(n.v)>1e-9).sort((n,l)=>l.v-n.v),i=r.reduce((n,l)=>n+Math.max(0,l.v),0),a=s>e/2;return c`<div class="tip" style="${a?`right:${e-s+10}px`:`left:${s+10}px`}">
      <b>${Qt(this.keys[t],this.bucket,!0)}</b>
      ${r.map(n=>c`<div><i style="background:${n.color}"></i>${n.name}<span>${nt(n.v,this.unit)}</span></div>`)}
      <div class="sum">Summe<span>${nt(i,this.unit)}</span></div>
    </div>`}};y(K,"properties",{...q.properties,keys:{attribute:!1},bucket:{},stacks:{attribute:!1},unit:{},height:{type:Number},compact:{type:Boolean},_hover:{state:!0}}),y(K,"styles",k`
    :host { display: block; position: relative; }
    .wrap { position: relative; }
    svg { display: block; }
    .grid { stroke: var(--divider-color); stroke-width: 1; }
    .axis { fill: var(--secondary-text-color); font-size: 11px; }
    .hl { fill: var(--primary-text-color); opacity: 0.06; }
    .legend { display: flex; flex-wrap: wrap; gap: 6px 16px; justify-content: center; font-size: 12px; margin-top: 6px; color: var(--secondary-text-color); }
    .legend i, .tip i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 6px; vertical-align: -1px; }
    .tip {
      position: absolute; top: 8px; pointer-events: none; z-index: 3; min-width: 200px;
      background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 8px;
      padding: 8px 10px; font-size: 12px; box-shadow: 0 2px 8px rgba(0,0,0,.3);
    }
    .tip div { display: flex; align-items: center; gap: 2px; margin-top: 3px; }
    .tip span { margin-left: auto; padding-left: 14px; font-variant-numeric: tabular-nums; }
    .tip .sum { border-top: 1px solid var(--divider-color); padding-top: 3px; font-weight: 500; }
    .empty { color: var(--secondary-text-color); padding: 24px; text-align: center; }
  `);customElements.get("ekd-stacked-chart")||customElements.define("ekd-stacked-chart",K);var J=class extends w{render(){let t=(this.segments||[]).filter(h=>h.value>0),s=t.reduce((h,g)=>h+g.value,0),e=80,r=52,i=100,a=-Math.PI/2,n=t.map((h,g)=>{let p=h.value/s,$=a+p*2*Math.PI,f=$-a>Math.PI?1:0,_=(v,u)=>`${i+u*Math.cos(v)} ${i+u*Math.sin(v)}`,m=p>=.9999?`M ${i} ${i-e} A ${e} ${e} 0 1 1 ${i-.01} ${i-e} L ${i-.01} ${i-r} A ${r} ${r} 0 1 0 ${i} ${i-r} Z`:`M ${_(a,e)} A ${e} ${e} 0 ${f} 1 ${_($,e)} L ${_($,r)} A ${r} ${r} 0 ${f} 0 ${_(a,r)} Z`;return a=$,D`<path d=${m} fill=${h.color} opacity=${this._hover==null||this._hover===g?1:.35}
        @mouseenter=${()=>this._hover=g} @mouseleave=${()=>this._hover=null}></path>`}),l=this._hover!=null?t[this._hover]:null;return c`
      <div class="box">
        <svg viewBox="0 0 200 200" width="200" height="200">
          ${s>0?n:D`<circle cx=${i} cy=${i} r=${(e+r)/2} fill="none" stroke="var(--divider-color)" stroke-width=${e-r}></circle>`}
          <text x=${i} y=${i-4} text-anchor="middle" class="big">${nt(l?l.value:s,this.unit)}</text>
          <text x=${i} y=${i+16} text-anchor="middle" class="small">${l?l.name:this.label||"Gesamt"}</text>
        </svg>
        <div class="list">
          ${t.map((h,g)=>c`<div @mouseenter=${()=>this._hover=g} @mouseleave=${()=>this._hover=null}>
              <i style="background:${h.color}"></i>${h.name}<span>${ot(h.value/s)}</span>
            </div>`)}
        </div>
      </div>
    `}};y(J,"properties",{segments:{attribute:!1},unit:{},label:{},_hover:{state:!0}}),y(J,"styles",k`
    .box { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; justify-content: center; }
    .big { fill: var(--primary-text-color); font-size: 18px; font-weight: 500; }
    .small { fill: var(--secondary-text-color); font-size: 11px; }
    path { cursor: default; transition: opacity .15s; }
    .list { font-size: 13px; min-width: 180px; }
    .list div { display: flex; align-items: center; padding: 2px 0; }
    .list i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 8px; }
    .list span { margin-left: auto; padding-left: 16px; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  `);customElements.get("ekd-donut")||customElements.define("ekd-donut",J);var Y=class extends w{render(){let t=[...this.items||[]].sort((e,r)=>r.value-e.value),s=te(Math.max(0,...t.map(e=>e.value)));return c`${t.map(e=>c`<div class="row">
        <div class="name" title=${e.name}>${e.name}</div>
        <div class="track"><div class="bar" style="width:${Math.max(0,e.value/s*100)}%;background:${e.color}"></div></div>
        <div class="val">${nt(e.value,this.unit)}</div>
      </div>`)}`}};y(Y,"properties",{items:{attribute:!1},unit:{}}),y(Y,"styles",k`
    :host { display: block; }
    .row { display: grid; grid-template-columns: minmax(90px, 160px) 1fr auto; gap: 10px; align-items: center; margin: 7px 0; font-size: 13px; }
    .name { text-align: right; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .track { height: 16px; background: var(--secondary-background-color); border-radius: 4px; overflow: hidden; }
    .bar { height: 100%; border-radius: 4px; opacity: .85; }
    .val { min-width: 84px; text-align: right; font-variant-numeric: tabular-nums; color: var(--secondary-text-color); }
  `);customElements.get("ekd-hbars")||customElements.define("ekd-hbars",Y);var se="energiekostenaufstellung",ee=`${se}_display`,Z=class extends w{constructor(){super(),this._period="month",this._anchor=new Date,this._display=null,this._collapsed=new Set,this._loading=!1}connectedCallback(){super.connectedCallback(),this._loadUserDisplay().then(()=>this.refresh()),this._timer=setInterval(()=>{this._report?.period?.is_current&&this.refresh()},300*1e3)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._timer)}async _loadUserDisplay(){try{let t=await this.hass.callWS({type:"frontend/get_user_data",key:ee});t?.value&&(this._display=t.value.display??null,t.value.period&&(this._period=t.value.period))}catch{}}_saveUserDisplay(){this.hass.callWS({type:"frontend/set_user_data",key:ee,value:{display:this._display,period:this._period}}).catch(()=>{})}get _effectiveDisplay(){return{charts:!0,chartUnit:"eur",...this._display??this._report?.display??{gross:!0,breakdown:!0,projection:!1}}}async refresh(){let{start:t,end:s}=wt(this._period,this._anchor);this._loading=!0;try{let e={day:"hour",week:"day",month:"day",year:"month"}[this._period];this._report=await this.hass.callWS({type:`${se}/report`,start:t.toISOString(),end:s.toISOString(),bucket:e}),this._error=null}catch(e){this._error=e?.message||String(e)}finally{this._loading=!1}}_setPeriod(t){this._period=t,this._anchor=new Date,this._saveUserDisplay(),this.refresh()}_shift(t){this._anchor=Jt(this._period,this._anchor,t),this.refresh()}_today(){this._anchor=new Date,this.refresh()}_setChartUnit(t){this._display={...this._effectiveDisplay,chartUnit:t},this._saveUserDisplay()}_renderCharts(){let t=this._report,s=t.series;if(!s)return d;let e=this._effectiveDisplay,r=e.chartUnit,i=r==="kwh"?2:e.gross?0:1,a="#7a7a7a",n="#4a4a4a",l=t.devices.map(m=>({name:m.name,color:m.color,values:(s.devices[m.stat_id]||[]).map(v=>v[i])}));l.push({name:"Nicht erfasst",color:a,values:s.rest.map(m=>m[i])});let h=m=>r==="kwh"?m.kwh:e.gross?m.gross:m.net,g=t.devices.map(m=>({name:m.name,color:m.color,value:h(m.cost)})),p=m=>e.gross?m.gross:m.net,$=t.fixed.reduce((m,v)=>m+(e.gross?v.gross:v.net),0),f=[...t.devices.map(m=>({name:m.name,color:m.color,value:p(m.cost)})),{name:"Nicht erfasst",color:a,value:Math.max(0,p(t.rest.cost))},{name:"Fixkosten",color:n,value:$}],_=r==="kwh"?"Verbrauch":e.gross?"Kosten brutto":"Kosten netto";return c`
      <div class="card chart">
        <div class="chead">
          <h3>Verlauf · ${_}</h3>
          <div class="seg small">
            <button class=${r==="eur"?"on":""} @click=${()=>this._setChartUnit("eur")}>€</button>
            <button class=${r==="kwh"?"on":""} @click=${()=>this._setChartUnit("kwh")}>kWh</button>
          </div>
        </div>
        <ekd-stacked-chart .keys=${s.keys} .bucket=${s.bucket} .stacks=${l} .unit=${r}></ekd-stacked-chart>
      </div>
      <div class="grid2">
        <div class="card chart">
          <h3>Aufteilung ${e.gross?"brutto":"netto"}</h3>
          <ekd-donut .segments=${f} unit="eur" label="inkl. Fixkosten"></ekd-donut>
        </div>
        <div class="card chart">
          <h3>Geräte-Vergleich · ${_}</h3>
          <ekd-hbars .items=${g} .unit=${r}></ekd-hbars>
        </div>
      </div>
    `}_toggle(t){this._display={...this._effectiveDisplay,[t]:!this._effectiveDisplay[t]},this._saveUserDisplay()}_toggleGroup(t){let s=new Set(this._collapsed);s.has(t)?s.delete(t):s.add(t),this._collapsed=s}_val(t,s){return t?s?t.gross:t.net:null}_cells(t,s,e){return e?c`
      ${O.map(r=>c`<td class="num">${t&&t[`net_${r.id}`]!=null?M(t[`net_${r.id}`]):""}</td>`)}
      ${s?c`<td class="num">${M(t?t.vat:null)}</td>`:d}
    `:d}_fixedAsCost(t){let s={kwh:null,net:t.net,vat:t.vat,gross:t.gross};for(let e of O)s[`net_${e.id}`]=e.id===t.category?t.net:null;return s}_sumCosts(t){let s={kwh:0,net:0,vat:0,gross:0};for(let e of O)s[`net_${e.id}`]=0;for(let e of t)if(e)for(let r of Object.keys(s))s[r]+=e[r]??0;return s}_row({name:t,color:s,cost:e,projection:r,share:i,cls:a="",disp:n,indent:l=!1,kwh:h=!0,onClick:g}){let{gross:p,breakdown:$,projection:f}=n,_=f&&this._report.period.is_current;return c`
      <tr class=${a} @click=${g??d}>
        <td class=${l?"name indent":"name"}>
          ${s?c`<span class="dot" style="background:${s}"></span>`:d}${t}
        </td>
        <td class="num">${h&&e?.kwh!=null?it(e.kwh):""}</td>
        ${this._cells(e,p,$)}
        <td class="num strong">${M(this._val(e,p))}</td>
        <td class="share">
          ${i!=null?c`<div class="bar"><div style="width:${Math.max(0,Math.min(1,i))*100}%;background:${s||"var(--primary-color)"}"></div></div>
                <span>${ot(i)}</span>`:d}
        </td>
        ${_?c`<td class="num">${r?M(this._val(r,p)):""}</td>`:d}
      </tr>
    `}_renderTable(){let t=this._report,s=this._effectiveDisplay,{gross:e,breakdown:r,projection:i}=s,a=i&&t.period.is_current,n=this._val(t.total.cost,e)||0,l=u=>n>0?(this._val(u,e)||0)/n:null,h=new Map;for(let u of t.devices){let b=u.group||"";h.has(b)||h.set(b,[]),h.get(b).push(u)}let g=u=>this._val(u.cost,e)||0,p=[...h.entries()].map(([u,b])=>({name:u,devs:b.sort((E,N)=>g(N)-g(E)),cost:this._sumCosts(b.map(E=>E.cost)),projection:a?this._sumCosts(b.map(E=>E.projection)):null}));p.sort((u,b)=>u.name==="Ohne Gruppe"?1:b.name==="Ohne Gruppe"?-1:this._val(b.cost,e)-this._val(u.cost,e));let $=p.length>1||p.length===1&&p[0].name!=="",f=this._sumCosts(t.fixed.map(u=>this._fixedAsCost(u))),_=a?this._sumCosts(t.fixed.map(u=>u.projection?this._fixedAsCost({...u,...u.projection}):null)):null,m=this._sumCosts([t.total.cost,f]);m.kwh=t.total.cost.kwh;let v=a?this._sumCosts([t.total.projection,_]):null;return v&&(v.kwh=t.total.projection?.kwh??null),c`
      <table>
        <thead>
          <tr>
            <th class="name">Gerät</th>
            <th class="num">Verbrauch</th>
            ${r?c`${O.map(u=>c`<th class="num">${u.label}</th>`)}${e?c`<th class="num">USt</th>`:d}`:d}
            <th class="num">${e?"Gesamt brutto":"Gesamt netto"}</th>
            <th class="share">Anteil</th>
            ${a?c`<th class="num">Hochrechnung</th>`:d}
          </tr>
        </thead>
        <tbody>
          ${p.map(u=>c`
              ${$?this._row({name:c`<span class="chev">${this._collapsed.has(u.name)?"\u25B8":"\u25BE"}</span>${u.name}`,cost:u.cost,projection:u.projection,share:l(u.cost),cls:"group",disp:s,onClick:()=>this._toggleGroup(u.name)}):d}
              ${this._collapsed.has(u.name)?d:u.devs.map(b=>this._row({name:b.name,color:b.color,cost:b.cost,projection:b.projection,share:l(b.cost),disp:s,indent:$}))}
            `)}
          ${this._row({name:"Nicht erfasst",color:"var(--disabled-text-color, #888)",cost:t.rest.cost,projection:t.rest.projection,share:l(t.rest.cost),cls:"rest",disp:s})}
          ${this._row({name:"Variable Kosten gesamt",cost:t.total.cost,projection:t.total.projection,cls:"subtotal",disp:s})}
          <tr class="section"><td colspan="20">Fixkosten (unabhängig vom Verbrauch)</td></tr>
          ${t.fixed.length===0?c`<tr><td class="name indent muted" colspan="20">Keine Fixkosten im Tarif hinterlegt</td></tr>`:t.fixed.map(u=>this._row({name:u.name,cost:this._fixedAsCost(u),projection:u.projection?this._fixedAsCost({...u,...u.projection}):null,disp:s,indent:!0,kwh:!1}))}
          ${this._row({name:"Fixkosten gesamt",cost:f,projection:_,cls:"subtotal",disp:s,kwh:!1})}
          ${this._row({name:"Summe",cost:m,projection:v,cls:"total",disp:s})}
        </tbody>
      </table>
    `}render(){let{start:t,end:s}=wt(this._period,this._anchor),e=this._effectiveDisplay,r=this._report;return c`
      <div class="toolbar">
        <div class="seg">
          ${Kt.map(i=>c`<button class=${i.id===this._period?"on":""} @click=${()=>this._setPeriod(i.id)}>${i.label}</button>`)}
        </div>
        <div class="nav">
          <button class="icon" title="Zurück" @click=${()=>this._shift(-1)}>‹</button>
          <span class="label">${Yt(this._period,t,s)}</span>
          <button class="icon" title="Weiter" @click=${()=>this._shift(1)}>›</button>
          <button @click=${this._today}>Heute</button>
        </div>
      </div>
      <div class="toolbar">
        <div class="seg">
          <button class=${e.gross?"":"on"} @click=${()=>e.gross&&this._toggle("gross")}>Netto</button>
          <button class=${e.gross?"on":""} @click=${()=>!e.gross&&this._toggle("gross")}>Brutto</button>
        </div>
        <label><input type="checkbox" .checked=${e.breakdown} @change=${()=>this._toggle("breakdown")} /> Aufschlüsselung</label>
        <label><input type="checkbox" .checked=${e.projection} @change=${()=>this._toggle("projection")} /> Hochrechnung</label>
        <label><input type="checkbox" .checked=${e.charts} @change=${()=>this._toggle("charts")} /> Diagramme</label>
        ${this._loading?c`<span class="muted">lädt …</span>`:d}
      </div>
      ${this._error?c`<div class="warn">Fehler: ${this._error}</div>`:d}
      ${r?.warnings?.map(i=>c`<div class="warn">${i}</div>`)}
      ${r&&e.charts?this._renderCharts():d}
      ${r?c`<div class="card">${this._renderTable()}</div>`:d}
      ${r&&e.projection&&!r.period.is_current?c`<div class="muted small">Hochrechnung gibt es nur für den laufenden Zeitraum.</div>`:d}
      ${r?.ignored?.length?c`<div class="muted small">Ignoriert: ${r.ignored.map(i=>i.name).join(", ")}</div>`:d}
    `}};y(Z,"properties",{hass:{attribute:!1},_period:{state:!0},_anchor:{state:!0},_report:{state:!0},_error:{state:!0},_loading:{state:!0},_display:{state:!0},_collapsed:{state:!0}}),y(Z,"styles",k`
    :host { display: block; }
    .toolbar { display: flex; flex-wrap: wrap; gap: 12px 20px; align-items: center; margin-bottom: 12px; }
    .seg { display: inline-flex; border: 1px solid var(--divider-color); border-radius: 18px; overflow: hidden; }
    .seg button { border: none; border-radius: 0; }
    button {
      background: transparent; color: var(--primary-text-color); border: 1px solid var(--divider-color);
      border-radius: 18px; padding: 6px 14px; font: inherit; cursor: pointer;
    }
    button.on { background: var(--primary-color); color: var(--text-primary-color, #fff); }
    button.icon { font-size: 20px; line-height: 1; padding: 2px 12px; }
    .nav { display: flex; align-items: center; gap: 8px; }
    .label { min-width: 190px; text-align: center; font-weight: 500; }
    label { display: inline-flex; align-items: center; gap: 6px; cursor: pointer; }
    .card {
      background: var(--card-background-color); border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color); overflow-x: auto; margin-bottom: 16px;
    }
    .card.chart { padding: 12px 16px 14px; overflow: visible; }
    .card h3 { margin: 0 0 10px; font-size: 16px; font-weight: 500; }
    .chead { display: flex; align-items: center; justify-content: space-between; }
    .chead h3 { margin: 0; }
    .seg.small button { padding: 3px 12px; }
    .grid2 { display: grid; grid-template-columns: minmax(300px, 1fr) 2fr; gap: 16px; }
    .grid2 .card { margin-bottom: 16px; }
    @media (max-width: 900px) { .grid2 { grid-template-columns: 1fr; } }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th, td { padding: 8px 12px; border-bottom: 1px solid var(--divider-color); white-space: nowrap; }
    th { text-align: left; font-weight: 500; color: var(--secondary-text-color); }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .strong { font-weight: 500; }
    .name.indent { padding-left: 32px; }
    .dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
    .chev { display: inline-block; width: 16px; color: var(--secondary-text-color); }
    tr.group { cursor: pointer; background: var(--secondary-background-color); font-weight: 500; }
    tr.rest td.name { font-style: italic; }
    tr.subtotal td { font-weight: 500; border-top: 2px solid var(--divider-color); }
    tr.total td { font-weight: 700; border-top: 3px double var(--divider-color); font-size: 15px; }
    tr.section td { color: var(--secondary-text-color); font-size: 12px; text-transform: uppercase; letter-spacing: .04em; padding-top: 18px; }
    .share { min-width: 140px; }
    .share .bar { display: inline-block; width: 80px; height: 8px; background: var(--divider-color); border-radius: 4px; overflow: hidden; vertical-align: middle; margin-right: 8px; }
    .share .bar div { height: 100%; }
    .share span { font-size: 12px; color: var(--secondary-text-color); }
    .warn { background: var(--warning-color, #ffa600); color: #000; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; }
    .muted { color: var(--secondary-text-color); }
    .small { font-size: 12px; margin-top: 8px; }
  `);customElements.get("ekd-overview")||customElements.define("ekd-overview",Z);var re="energiekostenaufstellung",Ae=["J\xE4n","Feb","M\xE4r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],Se=[{id:"none",label:"Keine"},{id:"area",label:"Bereich"},{id:"floor",label:"Stockwerk (sonst Bereich)"},{id:"custom",label:"Eigene Gruppen"}],X=class extends w{connectedCallback(){super.connectedCallback(),this._load()}async _load(){try{this._info=await this.hass.callWS({type:`${re}/settings`}),this._s=at(this._info.settings),this._dirty=!1,this._msg=null}catch(t){this._msg={error:!0,text:t?.message||String(t)}}}get _ro(){return!this._info?.can_edit}_change(t){let s=at(this._s);t(s),this._s=s,this._dirty=!0}async _save(){try{await this.hass.callWS({type:`${re}/save_settings`,settings:this._s}),this._msg={text:"Gespeichert."},await this._load(),this._msg={text:"Gespeichert."},this.dispatchEvent(new CustomEvent("settings-saved",{bubbles:!0,composed:!0}))}catch(t){this._msg={error:!0,text:t?.message||String(t)}}}_addVersion(t){this._change(s=>{let e=s.tariff.versions,r;if(t?r=qt():e.length?(r=at(e[e.length-1]),r.valid_from=new Date().toISOString().slice(0,10)):r=Zt(),e.some(i=>i.valid_from===r.valid_from)){let i=new Date(r.valid_from);i.setDate(i.getDate()+1),r.valid_from=i.toISOString().slice(0,10)}e.push(r),e.sort((i,a)=>i.valid_from.localeCompare(a.valid_from))})}_fmt(t){return t==null?"":String(t).replace(".",",")}_num(t){if(t===""||t==null)return null;let s=Number(String(t).replace(",","."));return Number.isFinite(s)?s:null}_renderVersion(t,s){let e=this._ro,r=a=>this._change(n=>a(n.tariff.versions[s])),i=t.reduced_window;return c`
      <div class="version">
        <div class="row">
          <label>Gültig ab <input type="date" .value=${t.valid_from} ?disabled=${e}
            @change=${a=>r(n=>n.valid_from=a.target.value)} /></label>
          <label>USt % <input class="short" type="text" inputmode="decimal" .value=${this._fmt(t.vat_percent)} ?disabled=${e}
            @change=${a=>r(n=>n.vat_percent=this._num(a.target.value)??0)} /></label>
          ${e?d:c`<button class="danger" @click=${()=>this._change(a=>a.tariff.versions.splice(s,1))}>Version löschen</button>`}
        </div>

        <div class="row">
          <label><input type="checkbox" .checked=${!!i} ?disabled=${e}
            @change=${a=>r(n=>n.reduced_window=a.target.checked?{months:[4,5,6,7,8,9],start_hour:10,end_hour:16}:null)} />
            Rabattfenster (z. B. SNAP / Nebenzeit)</label>
        </div>
        ${i?c`<div class="row indent">
              <span class="months">${Ae.map((a,n)=>c`<label class="chip"><input type="checkbox" .checked=${i.months.includes(n+1)} ?disabled=${e}
                  @change=${l=>r(h=>{let g=new Set(h.reduced_window.months);l.target.checked?g.add(n+1):g.delete(n+1),h.reduced_window.months=[...g].sort((p,$)=>p-$)})} />${a}</label>`)}</span>
              <label>von <input class="short" type="number" min="0" max="23" .value=${String(i.start_hour)} ?disabled=${e}
                @change=${a=>r(n=>n.reduced_window.start_hour=Number(a.target.value))} /> Uhr</label>
              <label>bis <input class="short" type="number" min="1" max="24" .value=${String(i.end_hour)} ?disabled=${e}
                @change=${a=>r(n=>n.reduced_window.end_hour=Number(a.target.value))} /> Uhr</label>
            </div>`:d}

        <h4>Verbrauchsabhängig (netto, ct/kWh)</h4>
        <table>
          <tr><th>Bezeichnung</th><th>Kategorie</th><th>Normal</th>${i?c`<th>Rabattfenster</th>`:d}<th></th></tr>
          ${t.variable.map((a,n)=>c`<tr>
              <td><input class="wide" .value=${a.name} ?disabled=${e} @change=${l=>r(h=>h.variable[n].name=l.target.value)} /></td>
              <td>${this._catSelect(a.category,e,l=>r(h=>h.variable[n].category=l))}</td>
              <td><input class="short" inputmode="decimal" .value=${this._fmt(a.price_ct)} ?disabled=${e}
                @change=${l=>r(h=>h.variable[n].price_ct=this._num(l.target.value)??0)} /></td>
              ${i?c`<td><input class="short" inputmode="decimal" placeholder="wie normal" .value=${this._fmt(a.price_reduced_ct)} ?disabled=${e}
                    @change=${l=>r(h=>h.variable[n].price_reduced_ct=this._num(l.target.value))} /></td>`:d}
              <td>${e?d:c`<button class="icon" title="Entfernen" @click=${()=>r(l=>l.variable.splice(n,1))}>✕</button>`}</td>
            </tr>`)}
        </table>
        ${e?d:c`<button @click=${()=>r(a=>a.variable.push({name:"",category:"energie",price_ct:0,price_reduced_ct:null}))}>+ Position</button>`}

        <h4>Fixkosten (netto, € pro Jahr)</h4>
        <table>
          <tr><th>Bezeichnung</th><th>Kategorie</th><th>€/Jahr</th><th></th></tr>
          ${t.fixed.map((a,n)=>c`<tr>
              <td><input class="wide" .value=${a.name} ?disabled=${e} @change=${l=>r(h=>h.fixed[n].name=l.target.value)} /></td>
              <td>${this._catSelect(a.category,e,l=>r(h=>h.fixed[n].category=l))}</td>
              <td><input class="short" inputmode="decimal" .value=${this._fmt(a.eur_per_year)} ?disabled=${e}
                @change=${l=>r(h=>h.fixed[n].eur_per_year=this._num(l.target.value)??0)} /></td>
              <td>${e?d:c`<button class="icon" title="Entfernen" @click=${()=>r(l=>l.fixed.splice(n,1))}>✕</button>`}</td>
            </tr>`)}
        </table>
        ${e?d:c`<button @click=${()=>r(a=>a.fixed.push({name:"",category:"netz",eur_per_year:0}))}>+ Fixkosten</button>`}
      </div>
    `}_catSelect(t,s,e){return c`<select ?disabled=${s} @change=${r=>e(r.target.value)}>
      ${O.map(r=>c`<option value=${r.id} ?selected=${r.id===t}>${r.label}</option>`)}
    </select>`}_dev(t){return this._s.devices[t]||{}}_updDev(t,s){this._change(e=>{e.devices[t]={...e.devices[t]||{},...s}})}_renderDevices(){let t=this._ro,s=this._s.grouping==="custom",e=Object.entries(this._s.devices).filter(([i,a])=>a.manual&&!this._info.devices.some(n=>n.stat_id===i)).map(([i])=>({stat_id:i,name:i,source:"manual",color:"#888"})),r=[...this._info.devices,...e];return c`
      <table>
        <tr><th></th><th>Name</th><th>Entity</th><th>${s?"Gruppe":"Gruppe (leer = automatisch)"}</th><th>Farbe</th><th>Ignorieren</th><th></th></tr>
        ${r.map(i=>{let a=this._dev(i.stat_id);return c`<tr class=${a.ignored?"ignored":""}>
            <td><span class="tag">${i.source==="energy"?"auto":"manuell"}</span></td>
            <td><input class="wide" placeholder=${i.name} .value=${a.name||""} ?disabled=${t}
              @change=${n=>this._updDev(i.stat_id,{name:n.target.value||null})} /></td>
            <td class="muted">${i.stat_id}</td>
            <td><input placeholder=${i.group||""} .value=${a.group||""} ?disabled=${t}
              @change=${n=>this._updDev(i.stat_id,{group:n.target.value||null})} /></td>
            <td><input type="color" .value=${a.color||i.color||"#888888"} ?disabled=${t}
              @change=${n=>this._updDev(i.stat_id,{color:n.target.value})} /></td>
            <td><input type="checkbox" .checked=${!!a.ignored} ?disabled=${t}
              @change=${n=>this._updDev(i.stat_id,{ignored:n.target.checked})} /></td>
            <td>${!t&&i.source==="manual"?c`<button class="icon" title="Entfernen" @click=${()=>this._change(n=>delete n.devices[i.stat_id])}>✕</button>`:d}</td>
          </tr>`})}
      </table>
      ${t?d:c`<div class="row">
            <select id="addsel" @change=${i=>this._addSel=i.target.value}>
              <option value="">Energiesensor auswählen …</option>
              ${this._info.candidates.filter(i=>!this._s.devices[i.entity_id]?.manual).map(i=>c`<option value=${i.entity_id}>${i.name} (${i.entity_id})</option>`)}
            </select>
            <button ?disabled=${!this._addSel}
              @click=${()=>{this._updDev(this._addSel,{manual:!0,ignored:!1}),this._addSel="",this.shadowRoot.getElementById("addsel").value=""}}>+ Gerät hinzufügen</button>
          </div>`}
      <div class="muted small">Geräte aus dem HA-Energie-Dashboard werden automatisch übernommen. Ignorierte Geräte zählen zu „Nicht erfasst“.</div>
    `}_actions(){return c`<div class="actions">
      <button class="primary" ?disabled=${!this._dirty} @click=${this._save}>Speichern</button>
      <button ?disabled=${!this._dirty} @click=${this._load}>Verwerfen</button>
      ${this._dirty?c`<span class="muted">Ungespeicherte Änderungen</span>`:d}
      ${this._msg?c`<span class=${this._msg.error?"err":"ok"}>${this._msg.text}</span>`:d}
    </div>`}render(){if(!this._s)return c`${this._msg?c`<div class="warn">${this._msg.text}</div>`:c`lädt …`}`;let t=this._ro,s=this._s;return c`
      ${t?c`<div class="info">Nur Administratoren können die Einstellungen ändern (angemeldet als: ${this.hass?.user?.name??"?"}).</div>`:this._actions()}

      <section>
        <h3>Tarif</h3>
        ${s.tariff.versions.length===0?c`<div class="muted">Noch kein Tarif hinterlegt.</div>`:d}
        ${s.tariff.versions.map((e,r)=>this._renderVersion(e,r))}
        ${t?d:c`<div class="row">
              <button @click=${()=>this._addVersion(!1)}>+ Neue Tarifversion</button>
              <button @click=${()=>this._addVersion(!0)}>Beispiel einfügen: EVN NÖ „Optima Garant Sonne“ 2026</button>
            </div>`}
      </section>

      <section>
        <h3>Netzbezug</h3>
        <div class="row">
          <label>Statistik des Hauptzählers
            <input class="wide" placeholder=${this._info.grid_stat_auto||"sensor.\u2026"} .value=${s.grid_stat||""} ?disabled=${t}
              @change=${e=>this._change(r=>r.grid_stat=e.target.value||null)} /></label>
        </div>
        <div class="muted small">Leer lassen = Netzquelle aus dem HA-Energie-Dashboard (${this._info.grid_stat_auto||"keine gefunden"}).</div>
      </section>

      <section>
        <h3>Geräte</h3>
        <div class="row">
          <label>Gruppierung
            <select ?disabled=${t} @change=${e=>this._change(r=>r.grouping=e.target.value)}>
              ${Se.map(e=>c`<option value=${e.id} ?selected=${e.id===s.grouping}>${e.label}</option>`)}
            </select></label>
        </div>
        ${this._renderDevices()}
      </section>

      <section>
        <h3>Anzeige (Standard für alle)</h3>
        <div class="row">
          <label><input type="checkbox" .checked=${s.display.gross} ?disabled=${t}
            @change=${e=>this._change(r=>r.display.gross=e.target.checked)} /> Brutto anzeigen</label>
          <label><input type="checkbox" .checked=${s.display.breakdown} ?disabled=${t}
            @change=${e=>this._change(r=>r.display.breakdown=e.target.checked)} /> Aufschlüsselung</label>
          <label><input type="checkbox" .checked=${s.display.projection} ?disabled=${t}
            @change=${e=>this._change(r=>r.display.projection=e.target.checked)} /> Hochrechnung</label>
        </div>
        <div class="muted small">Die Umschalter in der Übersicht merken sich pro Benutzer die eigene Wahl.</div>
      </section>

      ${t?d:this._actions()}

    `}};y(X,"properties",{hass:{attribute:!1},_info:{state:!0},_s:{state:!0},_dirty:{state:!0},_msg:{state:!0},_addSel:{state:!0}}),y(X,"styles",k`
    :host { display: block; }
    section {
      background: var(--card-background-color); border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px); padding: 8px 16px 16px; margin-bottom: 16px;
    }
    h3 { margin: 8px 0 12px; font-weight: 500; }
    h4 { margin: 16px 0 6px; font-weight: 500; font-size: 14px; color: var(--secondary-text-color); }
    .version { border-left: 3px solid var(--primary-color); padding: 4px 0 12px 12px; margin-bottom: 16px; }
    .row { display: flex; flex-wrap: wrap; gap: 10px 18px; align-items: center; margin: 8px 0; }
    .indent { margin-left: 24px; }
    label { display: inline-flex; align-items: center; gap: 6px; }
    input, select {
      font: inherit; color: var(--primary-text-color); background: var(--secondary-background-color);
      border: 1px solid var(--divider-color); border-radius: 6px; padding: 5px 8px;
    }
    input[type="checkbox"] { width: auto; padding: 0; }
    input[type="color"] { padding: 0; width: 36px; height: 28px; }
    input.short { width: 70px; }
    input.wide { width: 320px; }
    table { border-collapse: collapse; }
    th { text-align: left; font-weight: 500; font-size: 12px; color: var(--secondary-text-color); padding: 4px 6px; }
    td { padding: 3px 6px; }
    tr.ignored td { opacity: 0.5; }
    .months { display: inline-flex; flex-wrap: wrap; gap: 4px; }
    .chip { border: 1px solid var(--divider-color); border-radius: 12px; padding: 2px 8px; font-size: 12px; }
    .tag { font-size: 11px; border-radius: 8px; padding: 1px 6px; background: var(--secondary-background-color); color: var(--secondary-text-color); }
    button {
      background: transparent; color: var(--primary-text-color); border: 1px solid var(--divider-color);
      border-radius: 18px; padding: 6px 14px; font: inherit; cursor: pointer;
    }
    button:disabled { opacity: 0.5; cursor: default; }
    button.primary { background: var(--primary-color); color: var(--text-primary-color, #fff); border-color: var(--primary-color); }
    button.danger { color: var(--error-color, #db4437); border-color: var(--error-color, #db4437); }
    button.icon { border: none; padding: 2px 8px; color: var(--secondary-text-color); }
    .muted { color: var(--secondary-text-color); }
    .small { font-size: 12px; }
    .info { background: var(--info-color, #039be5); color: #fff; padding: 8px 12px; border-radius: 8px; margin-bottom: 12px; }
    .warn { background: var(--warning-color, #ffa600); color: #000; padding: 8px 12px; border-radius: 8px; }
    .actions {
      display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin: 0 0 16px;
      padding: 10px 16px; border: 1px solid var(--divider-color); border-radius: var(--ha-card-border-radius, 12px);
      background: var(--card-background-color);
    }
    .ok { color: var(--success-color, #43a047); }
    .err { color: var(--error-color, #db4437); }
  `);customElements.get("ekd-settings")||customElements.define("ekd-settings",X);var Q=class extends w{constructor(){super(),this._tab="overview"}_onSaved(){this.shadowRoot.querySelector("ekd-overview")?.refresh()}render(){return c`
      <div class="header">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <div class="title">Energiekosten</div>
        <div class="tabs">
          <button class=${this._tab==="overview"?"on":""} @click=${()=>this._tab="overview"}>Übersicht</button>
          <button class=${this._tab==="settings"?"on":""} @click=${()=>this._tab="settings"}>Einstellungen</button>
        </div>
      </div>
      <div class="content" @settings-saved=${this._onSaved}>
        <ekd-overview .hass=${this.hass} ?hidden=${this._tab!=="overview"}></ekd-overview>
        ${this._tab==="settings"?c`<ekd-settings .hass=${this.hass}></ekd-settings>`:""}
      </div>
    `}};y(Q,"properties",{hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1},_tab:{state:!0}}),y(Q,"styles",k`
    :host {
      display: block; min-height: 100vh; background: var(--primary-background-color);
      color: var(--primary-text-color); font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
    }
    .header {
      display: flex; align-items: center; gap: 12px; height: 56px; padding: 0 12px;
      background: var(--app-header-background-color, var(--primary-background-color));
      color: var(--app-header-text-color, var(--primary-text-color));
      border-bottom: 1px solid var(--divider-color); position: sticky; top: 0; z-index: 2;
    }
    .title { font-size: 20px; flex: 1; }
    .tabs button {
      background: transparent; border: none; color: inherit; font: inherit; padding: 16px 14px;
      cursor: pointer; border-bottom: 2px solid transparent; opacity: 0.75;
    }
    .tabs button.on { border-bottom-color: var(--primary-color); opacity: 1; }
    .content { padding: 16px; max-width: 1400px; margin: 0 auto; }
    [hidden] { display: none !important; }
  `);customElements.get("energiekosten-panel")||customElements.define("energiekosten-panel",Q);
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
