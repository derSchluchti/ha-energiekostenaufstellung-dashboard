var Vt=Object.defineProperty;var Gt=(o,t,s)=>t in o?Vt(o,t,{enumerable:!0,configurable:!0,writable:!0,value:s}):o[t]=s;var v=(o,t,s)=>Gt(o,typeof t!="symbol"?t+"":t,s);var G=globalThis,L=G.ShadowRoot&&(G.ShadyCSS===void 0||G.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Y=Symbol(),dt=new WeakMap,P=class{constructor(t,s,e){if(this._$cssResult$=!0,e!==Y)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=s}get styleSheet(){let t=this.o,s=this.t;if(L&&t===void 0){let e=s!==void 0&&s.length===1;e&&(t=dt.get(s)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&dt.set(s,t))}return t}toString(){return this.cssText}},ht=o=>new P(typeof o=="string"?o:o+"",void 0,Y),w=(o,...t)=>{let s=o.length===1?o[0]:t.reduce((e,r,i)=>e+(n=>{if(n._$cssResult$===!0)return n.cssText;if(typeof n=="number")return n;throw Error("Value passed to 'css' function must be a 'css' function result: "+n+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+o[i+1],o[0]);return new P(s,o,Y)},pt=(o,t)=>{if(L)o.adoptedStyleSheets=t.map(s=>s instanceof CSSStyleSheet?s:s.styleSheet);else for(let s of t){let e=document.createElement("style"),r=G.litNonce;r!==void 0&&e.setAttribute("nonce",r),e.textContent=s.cssText,o.appendChild(e)}},q=L?o=>o:o=>o instanceof CSSStyleSheet?(t=>{let s="";for(let e of t.cssRules)s+=e.cssText;return ht(s)})(o):o;var{is:Lt,defineProperty:Bt,getOwnPropertyDescriptor:Wt,getOwnPropertyNames:Kt,getOwnPropertySymbols:Jt,getPrototypeOf:Yt}=Object,B=globalThis,ut=B.trustedTypes,qt=ut?ut.emptyScript:"",Zt=B.reactiveElementPolyfillSupport,T=(o,t)=>o,Z={toAttribute(o,t){switch(t){case Boolean:o=o?qt:null;break;case Object:case Array:o=o==null?o:JSON.stringify(o)}return o},fromAttribute(o,t){let s=o;switch(t){case Boolean:s=o!==null;break;case Number:s=o===null?null:Number(o);break;case Object:case Array:try{s=JSON.parse(o)}catch{s=null}}return s}},_t=(o,t)=>!Lt(o,t),gt={attribute:!0,type:String,converter:Z,reflect:!1,useDefault:!1,hasChanged:_t};Symbol.metadata??=Symbol("metadata"),B.litPropertyMetadata??=new WeakMap;var y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=gt){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){let e=Symbol(),r=this.getPropertyDescriptor(t,e,s);r!==void 0&&Bt(this.prototype,t,r)}}static getPropertyDescriptor(t,s,e){let{get:r,set:i}=Wt(this.prototype,t)??{get(){return this[s]},set(n){this[s]=n}};return{get:r,set(n){let a=r?.call(this);i?.call(this,n),this.requestUpdate(t,a,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??gt}static _$Ei(){if(this.hasOwnProperty(T("elementProperties")))return;let t=Yt(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(T("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(T("properties"))){let s=this.properties,e=[...Kt(s),...Jt(s)];for(let r of e)this.createProperty(r,s[r])}let t=this[Symbol.metadata];if(t!==null){let s=litPropertyMetadata.get(t);if(s!==void 0)for(let[e,r]of s)this.elementProperties.set(e,r)}this._$Eh=new Map;for(let[s,e]of this.elementProperties){let r=this._$Eu(s,e);r!==void 0&&this._$Eh.set(r,s)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let s=[];if(Array.isArray(t)){let e=new Set(t.flat(1/0).reverse());for(let r of e)s.unshift(q(r))}else t!==void 0&&s.push(q(t));return s}static _$Eu(t,s){let e=s.attribute;return e===!1?void 0:typeof e=="string"?e:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){let t=new Map,s=this.constructor.elementProperties;for(let e of s.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this._$Ep=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return pt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,s,e){this._$AK(t,e)}_$ET(t,s){let e=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,e);if(r!==void 0&&e.reflect===!0){let i=(e.converter?.toAttribute!==void 0?e.converter:Z).toAttribute(s,e.type);this._$Em=t,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(t,s){let e=this.constructor,r=e._$Eh.get(t);if(r!==void 0&&this._$Em!==r){let i=e.getPropertyOptions(r),n=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:Z;this._$Em=r;let a=n.fromAttribute(s,i.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(t,s,e,r=!1,i){if(t!==void 0){let n=this.constructor;if(r===!1&&(i=this[t]),e??=n.getPropertyOptions(t),!((e.hasChanged??_t)(i,s)||e.useDefault&&e.reflect&&i===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,e))))return;this.C(t,s,e)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,s,{useDefault:e,reflect:r,wrapped:i},n){e&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??s??this[t]),i!==!0||n!==void 0)||(this._$AL.has(t)||(this.hasUpdated||e||(s=void 0),this._$AL.set(t,s)),r===!0&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(s){Promise.reject(s)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let e=this.constructor.elementProperties;if(e.size>0)for(let[r,i]of e){let{wrapped:n}=i,a=this[r];n!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,i,a)}}let t=!1,s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(s)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(s)}willUpdate(t){}_$AE(t){this._$EO?.forEach(s=>s.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(s=>this._$ET(s,this[s])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[T("elementProperties")]=new Map,y[T("finalized")]=new Map,Zt?.({ReactiveElement:y}),(B.reactiveElementVersions??=[]).push("2.1.2");var it=globalThis,mt=o=>o,W=it.trustedTypes,bt=W?W.createPolicy("lit-html",{createHTML:o=>o}):void 0,wt="$lit$",x=`lit$${Math.random().toFixed(9).slice(2)}$`,At="?"+x,Qt=`<${At}>`,k=document,O=()=>k.createComment(""),z=o=>o===null||typeof o!="object"&&typeof o!="function",ot=Array.isArray,Xt=o=>ot(o)||typeof o?.[Symbol.iterator]=="function",Q=`[ 	
\f\r]`,M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,$t=/-->/g,ft=/>/g,A=RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),vt=/'/g,yt=/"/g,St=/^(?:script|style|textarea|title)$/i,nt=o=>(t,...s)=>({_$litType$:o,strings:t,values:s}),c=nt(1),_e=nt(2),me=nt(3),E=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),xt=new WeakMap,S=k.createTreeWalker(k,129);function kt(o,t){if(!ot(o)||!o.hasOwnProperty("raw"))throw Error("invalid template strings array");return bt!==void 0?bt.createHTML(t):t}var te=(o,t)=>{let s=o.length-1,e=[],r,i=t===2?"<svg>":t===3?"<math>":"",n=M;for(let a=0;a<s;a++){let l=o[a],h,g,p=-1,_=0;for(;_<l.length&&(n.lastIndex=_,g=n.exec(l),g!==null);)_=n.lastIndex,n===M?g[1]==="!--"?n=$t:g[1]!==void 0?n=ft:g[2]!==void 0?(St.test(g[2])&&(r=RegExp("</"+g[2],"g")),n=A):g[3]!==void 0&&(n=A):n===A?g[0]===">"?(n=r??M,p=-1):g[1]===void 0?p=-2:(p=n.lastIndex-g[2].length,h=g[1],n=g[3]===void 0?A:g[3]==='"'?yt:vt):n===yt||n===vt?n=A:n===$t||n===ft?n=M:(n=A,r=void 0);let b=n===A&&o[a+1].startsWith("/>")?" ":"";i+=n===M?l+Qt:p>=0?(e.push(h),l.slice(0,p)+wt+l.slice(p)+x+b):l+x+(p===-2?a:b)}return[kt(o,i+(o[s]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),e]},j=class o{constructor({strings:t,_$litType$:s},e){let r;this.parts=[];let i=0,n=0,a=t.length-1,l=this.parts,[h,g]=te(t,s);if(this.el=o.createElement(h,e),S.currentNode=this.el.content,s===2||s===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(r=S.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(let p of r.getAttributeNames())if(p.endsWith(wt)){let _=g[n++],b=r.getAttribute(p).split(x),f=/([.?@])?(.*)/.exec(_);l.push({type:1,index:i,name:f[2],strings:b,ctor:f[1]==="."?tt:f[1]==="?"?et:f[1]==="@"?st:N}),r.removeAttribute(p)}else p.startsWith(x)&&(l.push({type:6,index:i}),r.removeAttribute(p));if(St.test(r.tagName)){let p=r.textContent.split(x),_=p.length-1;if(_>0){r.textContent=W?W.emptyScript:"";for(let b=0;b<_;b++)r.append(p[b],O()),S.nextNode(),l.push({type:2,index:++i});r.append(p[_],O())}}}else if(r.nodeType===8)if(r.data===At)l.push({type:2,index:i});else{let p=-1;for(;(p=r.data.indexOf(x,p+1))!==-1;)l.push({type:7,index:i}),p+=x.length-1}i++}}static createElement(t,s){let e=k.createElement("template");return e.innerHTML=t,e}};function D(o,t,s=o,e){if(t===E)return t;let r=e!==void 0?s._$Co?.[e]:s._$Cl,i=z(t)?void 0:t._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(o),r._$AT(o,s,e)),e!==void 0?(s._$Co??=[])[e]=r:s._$Cl=r),r!==void 0&&(t=D(o,r._$AS(o,t.values),r,e)),t}var X=class{constructor(t,s){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=s}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:s},parts:e}=this._$AD,r=(t?.creationScope??k).importNode(s,!0);S.currentNode=r;let i=S.nextNode(),n=0,a=0,l=e[0];for(;l!==void 0;){if(n===l.index){let h;l.type===2?h=new R(i,i.nextSibling,this,t):l.type===1?h=new l.ctor(i,l.name,l.strings,this,t):l.type===6&&(h=new rt(i,this,t)),this._$AV.push(h),l=e[++a]}n!==l?.index&&(i=S.nextNode(),n++)}return S.currentNode=k,r}p(t){let s=0;for(let e of this._$AV)e!==void 0&&(e.strings!==void 0?(e._$AI(t,e,s),s+=e.strings.length-2):e._$AI(t[s])),s++}},R=class o{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,s,e,r){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=s,this._$AM=e,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,s=this._$AM;return s!==void 0&&t?.nodeType===11&&(t=s.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,s=this){t=D(this,t,s),z(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Xt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==d&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){let{values:s,_$litType$:e}=t,r=typeof e=="number"?this._$AC(t):(e.el===void 0&&(e.el=j.createElement(kt(e.h,e.h[0]),this.options)),e);if(this._$AH?._$AD===r)this._$AH.p(s);else{let i=new X(r,this),n=i.u(this.options);i.p(s),this.T(n),this._$AH=i}}_$AC(t){let s=xt.get(t.strings);return s===void 0&&xt.set(t.strings,s=new j(t)),s}k(t){ot(this._$AH)||(this._$AH=[],this._$AR());let s=this._$AH,e,r=0;for(let i of t)r===s.length?s.push(e=new o(this.O(O()),this.O(O()),this,this.options)):e=s[r],e._$AI(i),r++;r<s.length&&(this._$AR(e&&e._$AB.nextSibling,r),s.length=r)}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(!1,!0,s);t!==this._$AB;){let e=mt(t).nextSibling;mt(t).remove(),t=e}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},N=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,s,e,r,i){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=s,this._$AM=r,this.options=i,e.length>2||e[0]!==""||e[1]!==""?(this._$AH=Array(e.length-1).fill(new String),this.strings=e):this._$AH=d}_$AI(t,s=this,e,r){let i=this.strings,n=!1;if(i===void 0)t=D(this,t,s,0),n=!z(t)||t!==this._$AH&&t!==E,n&&(this._$AH=t);else{let a=t,l,h;for(t=i[0],l=0;l<i.length-1;l++)h=D(this,a[e+l],s,l),h===E&&(h=this._$AH[l]),n||=!z(h)||h!==this._$AH[l],h===d?t=d:t!==d&&(t+=(h??"")+i[l+1]),this._$AH[l]=h}n&&!r&&this.j(t)}j(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tt=class extends N{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===d?void 0:t}},et=class extends N{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},st=class extends N{constructor(t,s,e,r,i){super(t,s,e,r,i),this.type=5}_$AI(t,s=this){if((t=D(this,t,s,0)??d)===E)return;let e=this._$AH,r=t===d&&e!==d||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,i=t!==d&&(e===d||r);r&&this.element.removeEventListener(this.name,this,e),i&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},rt=class{constructor(t,s,e){this.element=t,this.type=6,this._$AN=void 0,this._$AM=s,this.options=e}get _$AU(){return this._$AM._$AU}_$AI(t){D(this,t)}};var ee=it.litHtmlPolyfillSupport;ee?.(j,R),(it.litHtmlVersions??=[]).push("3.3.3");var Et=(o,t,s)=>{let e=s?.renderBefore??t,r=e._$litPart$;if(r===void 0){let i=s?.renderBefore??null;e._$litPart$=r=new R(t.insertBefore(O(),i),i,void 0,s??{})}return r._$AI(o),r};var at=globalThis,$=class extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let s=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Et(s,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}};$._$litElement$=!0,$.finalized=!0,at.litElementHydrateSupport?.({LitElement:$});var se=at.litElementPolyfillSupport;se?.({LitElement:$});(at.litElementVersions??=[]).push("4.2.2");var Ut=[{id:"day",label:"Tag"},{id:"week",label:"Woche"},{id:"month",label:"Monat"},{id:"year",label:"Jahr"}],C=[{id:"energie",label:"Energie"},{id:"netz",label:"Netz"},{id:"abgaben",label:"Abgaben"}],Ct=["J\xE4nner","Februar","M\xE4rz","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"],re=["So","Mo","Di","Mi","Do","Fr","Sa"];function lt(o,t){let s=new Date(t),e=s.getFullYear(),r=s.getMonth(),i,n;if(o==="day")i=new Date(e,r,s.getDate()),n=new Date(e,r,s.getDate()+1);else if(o==="week"){let a=(s.getDay()+6)%7;i=new Date(e,r,s.getDate()-a),n=new Date(e,r,s.getDate()-a+7)}else o==="month"?(i=new Date(e,r,1),n=new Date(e,r+1,1)):(i=new Date(e,0,1),n=new Date(e+1,0,1));return{start:i,end:n}}function Pt(o,t,s){let e=new Date(t);return o==="day"?e.setDate(e.getDate()+s):o==="week"?e.setDate(e.getDate()+7*s):o==="month"?e.setMonth(e.getMonth()+s,1):e.setFullYear(e.getFullYear()+s,0,1),e}function ie(o){let t=new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate())),s=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-s);let e=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-e)/864e5+1)/7)}var Dt=o=>String(o).padStart(2,"0"),Nt=o=>`${Dt(o.getDate())}.${Dt(o.getMonth()+1)}.`;function Tt(o,t,s){if(o==="day")return`${re[t.getDay()]}, ${t.getDate()}. ${Ct[t.getMonth()]} ${t.getFullYear()}`;if(o==="week"){let e=new Date(s.getFullYear(),s.getMonth(),s.getDate()-1);return`KW ${ie(t)} \xB7 ${Nt(t)}\u2013${Nt(e)}${e.getFullYear()}`}return o==="month"?`${Ct[t.getMonth()]} ${t.getFullYear()}`:String(t.getFullYear())}var oe=new Intl.NumberFormat("de-AT",{style:"currency",currency:"EUR"}),ne=new Intl.NumberFormat("de-AT",{minimumFractionDigits:2,maximumFractionDigits:2}),ae=new Intl.NumberFormat("de-AT",{style:"percent",maximumFractionDigits:1}),H=o=>o==null||Number.isNaN(o)?"\u2013":oe.format(o);var Mt=o=>o==null?"\u2013":`${ne.format(o)} kWh`,Ot=o=>o==null||!Number.isFinite(o)?"\u2013":ae.format(o),K=o=>JSON.parse(JSON.stringify(o));function zt(){return{valid_from:`${new Date().getFullYear()}-01-01`,vat_percent:20,reduced_window:{months:[4,5,6,7,8,9],start_hour:10,end_hour:16},variable:[{name:"Verbrauchspreis Energie",category:"energie",price_ct:10.5,price_reduced_ct:6.9},{name:"Verbrauchspreis Netznutzung",category:"netz",price_ct:8.79,price_reduced_ct:7.03},{name:"Verbrauchspreis Netzverlust",category:"netz",price_ct:.384,price_reduced_ct:null},{name:"Elektrizit\xE4tsabgabe",category:"abgaben",price_ct:.1,price_reduced_ct:null},{name:"Erneuerbaren-F\xF6rderbeitrag Netznutzung",category:"abgaben",price_ct:.583,price_reduced_ct:null},{name:"Erneuerbaren-F\xF6rderbeitrag Netzverlust",category:"abgaben",price_ct:.037,price_reduced_ct:null}],fixed:[{name:"Grundpreis Energie",category:"energie",eur_per_year:72},{name:"Grundpreis Netz",category:"netz",eur_per_year:54},{name:"Entgelt f\xFCr Messleistungen",category:"netz",eur_per_year:26.16},{name:"Erneuerbaren-F\xF6rderpauschale",category:"abgaben",eur_per_year:19.02},{name:"Erneuerbaren-F\xF6rderbeitrag Grundpreis",category:"abgaben",eur_per_year:3.8}]}}function jt(){return{valid_from:new Date().toISOString().slice(0,10),vat_percent:20,reduced_window:null,variable:[{name:"Energie",category:"energie",price_ct:0,price_reduced_ct:null}],fixed:[]}}var Ht="energiekostenaufstellung",Rt=`${Ht}_display`,F=class extends ${constructor(){super(),this._period="month",this._anchor=new Date,this._display=null,this._collapsed=new Set,this._loading=!1}connectedCallback(){super.connectedCallback(),this._loadUserDisplay().then(()=>this.refresh()),this._timer=setInterval(()=>{this._report?.period?.is_current&&this.refresh()},300*1e3)}disconnectedCallback(){super.disconnectedCallback(),clearInterval(this._timer)}async _loadUserDisplay(){try{let t=await this.hass.callWS({type:"frontend/get_user_data",key:Rt});t?.value&&(this._display=t.value.display??null,t.value.period&&(this._period=t.value.period))}catch{}}_saveUserDisplay(){this.hass.callWS({type:"frontend/set_user_data",key:Rt,value:{display:this._display,period:this._period}}).catch(()=>{})}get _effectiveDisplay(){return this._display??this._report?.display??{gross:!0,breakdown:!0,projection:!1}}async refresh(){let{start:t,end:s}=lt(this._period,this._anchor);this._loading=!0;try{this._report=await this.hass.callWS({type:`${Ht}/report`,start:t.toISOString(),end:s.toISOString()}),this._error=null}catch(e){this._error=e?.message||String(e)}finally{this._loading=!1}}_setPeriod(t){this._period=t,this._anchor=new Date,this._saveUserDisplay(),this.refresh()}_shift(t){this._anchor=Pt(this._period,this._anchor,t),this.refresh()}_today(){this._anchor=new Date,this.refresh()}_toggle(t){this._display={...this._effectiveDisplay,[t]:!this._effectiveDisplay[t]},this._saveUserDisplay()}_toggleGroup(t){let s=new Set(this._collapsed);s.has(t)?s.delete(t):s.add(t),this._collapsed=s}_val(t,s){return t?s?t.gross:t.net:null}_cells(t,s,e){return e?c`
      ${C.map(r=>c`<td class="num">${t&&t[`net_${r.id}`]!=null?H(t[`net_${r.id}`]):""}</td>`)}
      ${s?c`<td class="num">${H(t?t.vat:null)}</td>`:d}
    `:d}_fixedAsCost(t){let s={kwh:null,net:t.net,vat:t.vat,gross:t.gross};for(let e of C)s[`net_${e.id}`]=e.id===t.category?t.net:null;return s}_sumCosts(t){let s={kwh:0,net:0,vat:0,gross:0};for(let e of C)s[`net_${e.id}`]=0;for(let e of t)if(e)for(let r of Object.keys(s))s[r]+=e[r]??0;return s}_row({name:t,color:s,cost:e,projection:r,share:i,cls:n="",disp:a,indent:l=!1,kwh:h=!0,onClick:g}){let{gross:p,breakdown:_,projection:b}=a,f=b&&this._report.period.is_current;return c`
      <tr class=${n} @click=${g??d}>
        <td class=${l?"name indent":"name"}>
          ${s?c`<span class="dot" style="background:${s}"></span>`:d}${t}
        </td>
        <td class="num">${h&&e?.kwh!=null?Mt(e.kwh):""}</td>
        ${this._cells(e,p,_)}
        <td class="num strong">${H(this._val(e,p))}</td>
        <td class="share">
          ${i!=null?c`<div class="bar"><div style="width:${Math.max(0,Math.min(1,i))*100}%;background:${s||"var(--primary-color)"}"></div></div>
                <span>${Ot(i)}</span>`:d}
        </td>
        ${f?c`<td class="num">${r?H(this._val(r,p)):""}</td>`:d}
      </tr>
    `}_renderTable(){let t=this._report,s=this._effectiveDisplay,{gross:e,breakdown:r,projection:i}=s,n=i&&t.period.is_current,a=this._val(t.total.cost,e)||0,l=u=>a>0?(this._val(u,e)||0)/a:null,h=new Map;for(let u of t.devices){let m=u.group||"";h.has(m)||h.set(m,[]),h.get(m).push(u)}let g=u=>this._val(u.cost,e)||0,p=[...h.entries()].map(([u,m])=>({name:u,devs:m.sort((U,It)=>g(It)-g(U)),cost:this._sumCosts(m.map(U=>U.cost)),projection:n?this._sumCosts(m.map(U=>U.projection)):null}));p.sort((u,m)=>u.name==="Ohne Gruppe"?1:m.name==="Ohne Gruppe"?-1:this._val(m.cost,e)-this._val(u.cost,e));let _=p.length>1||p.length===1&&p[0].name!=="",b=this._sumCosts(t.fixed.map(u=>this._fixedAsCost(u))),f=n?this._sumCosts(t.fixed.map(u=>u.projection?this._fixedAsCost({...u,...u.projection}):null)):null,ct=this._sumCosts([t.total.cost,b]);ct.kwh=t.total.cost.kwh;let J=n?this._sumCosts([t.total.projection,f]):null;return J&&(J.kwh=t.total.projection?.kwh??null),c`
      <table>
        <thead>
          <tr>
            <th class="name">Gerät</th>
            <th class="num">Verbrauch</th>
            ${r?c`${C.map(u=>c`<th class="num">${u.label}</th>`)}${e?c`<th class="num">USt</th>`:d}`:d}
            <th class="num">${e?"Gesamt brutto":"Gesamt netto"}</th>
            <th class="share">Anteil</th>
            ${n?c`<th class="num">Hochrechnung</th>`:d}
          </tr>
        </thead>
        <tbody>
          ${p.map(u=>c`
              ${_?this._row({name:c`<span class="chev">${this._collapsed.has(u.name)?"\u25B8":"\u25BE"}</span>${u.name}`,cost:u.cost,projection:u.projection,share:l(u.cost),cls:"group",disp:s,onClick:()=>this._toggleGroup(u.name)}):d}
              ${this._collapsed.has(u.name)?d:u.devs.map(m=>this._row({name:m.name,color:m.color,cost:m.cost,projection:m.projection,share:l(m.cost),disp:s,indent:_}))}
            `)}
          ${this._row({name:"Nicht erfasst",color:"var(--disabled-text-color, #888)",cost:t.rest.cost,projection:t.rest.projection,share:l(t.rest.cost),cls:"rest",disp:s})}
          ${this._row({name:"Variable Kosten gesamt",cost:t.total.cost,projection:t.total.projection,cls:"subtotal",disp:s})}
          <tr class="section"><td colspan="20">Fixkosten (unabhängig vom Verbrauch)</td></tr>
          ${t.fixed.length===0?c`<tr><td class="name indent muted" colspan="20">Keine Fixkosten im Tarif hinterlegt</td></tr>`:t.fixed.map(u=>this._row({name:u.name,cost:this._fixedAsCost(u),projection:u.projection?this._fixedAsCost({...u,...u.projection}):null,disp:s,indent:!0,kwh:!1}))}
          ${this._row({name:"Fixkosten gesamt",cost:b,projection:f,cls:"subtotal",disp:s,kwh:!1})}
          ${this._row({name:"Summe",cost:ct,projection:J,cls:"total",disp:s})}
        </tbody>
      </table>
    `}render(){let{start:t,end:s}=lt(this._period,this._anchor),e=this._effectiveDisplay,r=this._report;return c`
      <div class="toolbar">
        <div class="seg">
          ${Ut.map(i=>c`<button class=${i.id===this._period?"on":""} @click=${()=>this._setPeriod(i.id)}>${i.label}</button>`)}
        </div>
        <div class="nav">
          <button class="icon" title="Zurück" @click=${()=>this._shift(-1)}>‹</button>
          <span class="label">${Tt(this._period,t,s)}</span>
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
        ${this._loading?c`<span class="muted">lädt …</span>`:d}
      </div>
      ${this._error?c`<div class="warn">Fehler: ${this._error}</div>`:d}
      ${r?.warnings?.map(i=>c`<div class="warn">${i}</div>`)}
      ${r?c`<div class="card">${this._renderTable()}</div>`:d}
      ${r&&e.projection&&!r.period.is_current?c`<div class="muted small">Hochrechnung gibt es nur für den laufenden Zeitraum.</div>`:d}
      ${r?.ignored?.length?c`<div class="muted small">Ignoriert: ${r.ignored.map(i=>i.name).join(", ")}</div>`:d}
    `}};v(F,"properties",{hass:{attribute:!1},_period:{state:!0},_anchor:{state:!0},_report:{state:!0},_error:{state:!0},_loading:{state:!0},_display:{state:!0},_collapsed:{state:!0}}),v(F,"styles",w`
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
      border: 1px solid var(--divider-color); overflow-x: auto;
    }
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
  `);customElements.define("ekd-overview",F);var Ft="energiekostenaufstellung",le=["J\xE4n","Feb","M\xE4r","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"],ce=[{id:"none",label:"Keine"},{id:"area",label:"Bereich"},{id:"floor",label:"Stockwerk (sonst Bereich)"},{id:"custom",label:"Eigene Gruppen"}],I=class extends ${connectedCallback(){super.connectedCallback(),this._load()}async _load(){try{this._info=await this.hass.callWS({type:`${Ft}/settings`}),this._s=K(this._info.settings),this._dirty=!1,this._msg=null}catch(t){this._msg={error:!0,text:t?.message||String(t)}}}get _ro(){return!this._info?.can_edit}_change(t){let s=K(this._s);t(s),this._s=s,this._dirty=!0}async _save(){try{await this.hass.callWS({type:`${Ft}/save_settings`,settings:this._s}),this._msg={text:"Gespeichert."},await this._load(),this._msg={text:"Gespeichert."},this.dispatchEvent(new CustomEvent("settings-saved",{bubbles:!0,composed:!0}))}catch(t){this._msg={error:!0,text:t?.message||String(t)}}}_addVersion(t){this._change(s=>{let e=s.tariff.versions,r;if(t?r=zt():e.length?(r=K(e[e.length-1]),r.valid_from=new Date().toISOString().slice(0,10)):r=jt(),e.some(i=>i.valid_from===r.valid_from)){let i=new Date(r.valid_from);i.setDate(i.getDate()+1),r.valid_from=i.toISOString().slice(0,10)}e.push(r),e.sort((i,n)=>i.valid_from.localeCompare(n.valid_from))})}_fmt(t){return t==null?"":String(t).replace(".",",")}_num(t){if(t===""||t==null)return null;let s=Number(String(t).replace(",","."));return Number.isFinite(s)?s:null}_renderVersion(t,s){let e=this._ro,r=n=>this._change(a=>n(a.tariff.versions[s])),i=t.reduced_window;return c`
      <div class="version">
        <div class="row">
          <label>Gültig ab <input type="date" .value=${t.valid_from} ?disabled=${e}
            @change=${n=>r(a=>a.valid_from=n.target.value)} /></label>
          <label>USt % <input class="short" type="text" inputmode="decimal" .value=${this._fmt(t.vat_percent)} ?disabled=${e}
            @change=${n=>r(a=>a.vat_percent=this._num(n.target.value)??0)} /></label>
          ${e?d:c`<button class="danger" @click=${()=>this._change(n=>n.tariff.versions.splice(s,1))}>Version löschen</button>`}
        </div>

        <div class="row">
          <label><input type="checkbox" .checked=${!!i} ?disabled=${e}
            @change=${n=>r(a=>a.reduced_window=n.target.checked?{months:[4,5,6,7,8,9],start_hour:10,end_hour:16}:null)} />
            Rabattfenster (z. B. SNAP / Nebenzeit)</label>
        </div>
        ${i?c`<div class="row indent">
              <span class="months">${le.map((n,a)=>c`<label class="chip"><input type="checkbox" .checked=${i.months.includes(a+1)} ?disabled=${e}
                  @change=${l=>r(h=>{let g=new Set(h.reduced_window.months);l.target.checked?g.add(a+1):g.delete(a+1),h.reduced_window.months=[...g].sort((p,_)=>p-_)})} />${n}</label>`)}</span>
              <label>von <input class="short" type="number" min="0" max="23" .value=${String(i.start_hour)} ?disabled=${e}
                @change=${n=>r(a=>a.reduced_window.start_hour=Number(n.target.value))} /> Uhr</label>
              <label>bis <input class="short" type="number" min="1" max="24" .value=${String(i.end_hour)} ?disabled=${e}
                @change=${n=>r(a=>a.reduced_window.end_hour=Number(n.target.value))} /> Uhr</label>
            </div>`:d}

        <h4>Verbrauchsabhängig (netto, ct/kWh)</h4>
        <table>
          <tr><th>Bezeichnung</th><th>Kategorie</th><th>Normal</th>${i?c`<th>Rabattfenster</th>`:d}<th></th></tr>
          ${t.variable.map((n,a)=>c`<tr>
              <td><input class="wide" .value=${n.name} ?disabled=${e} @change=${l=>r(h=>h.variable[a].name=l.target.value)} /></td>
              <td>${this._catSelect(n.category,e,l=>r(h=>h.variable[a].category=l))}</td>
              <td><input class="short" inputmode="decimal" .value=${this._fmt(n.price_ct)} ?disabled=${e}
                @change=${l=>r(h=>h.variable[a].price_ct=this._num(l.target.value)??0)} /></td>
              ${i?c`<td><input class="short" inputmode="decimal" placeholder="wie normal" .value=${this._fmt(n.price_reduced_ct)} ?disabled=${e}
                    @change=${l=>r(h=>h.variable[a].price_reduced_ct=this._num(l.target.value))} /></td>`:d}
              <td>${e?d:c`<button class="icon" title="Entfernen" @click=${()=>r(l=>l.variable.splice(a,1))}>✕</button>`}</td>
            </tr>`)}
        </table>
        ${e?d:c`<button @click=${()=>r(n=>n.variable.push({name:"",category:"energie",price_ct:0,price_reduced_ct:null}))}>+ Position</button>`}

        <h4>Fixkosten (netto, € pro Jahr)</h4>
        <table>
          <tr><th>Bezeichnung</th><th>Kategorie</th><th>€/Jahr</th><th></th></tr>
          ${t.fixed.map((n,a)=>c`<tr>
              <td><input class="wide" .value=${n.name} ?disabled=${e} @change=${l=>r(h=>h.fixed[a].name=l.target.value)} /></td>
              <td>${this._catSelect(n.category,e,l=>r(h=>h.fixed[a].category=l))}</td>
              <td><input class="short" inputmode="decimal" .value=${this._fmt(n.eur_per_year)} ?disabled=${e}
                @change=${l=>r(h=>h.fixed[a].eur_per_year=this._num(l.target.value)??0)} /></td>
              <td>${e?d:c`<button class="icon" title="Entfernen" @click=${()=>r(l=>l.fixed.splice(a,1))}>✕</button>`}</td>
            </tr>`)}
        </table>
        ${e?d:c`<button @click=${()=>r(n=>n.fixed.push({name:"",category:"netz",eur_per_year:0}))}>+ Fixkosten</button>`}
      </div>
    `}_catSelect(t,s,e){return c`<select ?disabled=${s} @change=${r=>e(r.target.value)}>
      ${C.map(r=>c`<option value=${r.id} ?selected=${r.id===t}>${r.label}</option>`)}
    </select>`}_dev(t){return this._s.devices[t]||{}}_updDev(t,s){this._change(e=>{e.devices[t]={...e.devices[t]||{},...s}})}_renderDevices(){let t=this._ro,s=this._s.grouping==="custom",e=Object.entries(this._s.devices).filter(([i,n])=>n.manual&&!this._info.devices.some(a=>a.stat_id===i)).map(([i])=>({stat_id:i,name:i,source:"manual",color:"#888"})),r=[...this._info.devices,...e];return c`
      <table>
        <tr><th></th><th>Name</th><th>Entity</th><th>${s?"Gruppe":"Gruppe (leer = automatisch)"}</th><th>Farbe</th><th>Ignorieren</th><th></th></tr>
        ${r.map(i=>{let n=this._dev(i.stat_id);return c`<tr class=${n.ignored?"ignored":""}>
            <td><span class="tag">${i.source==="energy"?"auto":"manuell"}</span></td>
            <td><input class="wide" placeholder=${i.name} .value=${n.name||""} ?disabled=${t}
              @change=${a=>this._updDev(i.stat_id,{name:a.target.value||null})} /></td>
            <td class="muted">${i.stat_id}</td>
            <td><input placeholder=${i.group||""} .value=${n.group||""} ?disabled=${t}
              @change=${a=>this._updDev(i.stat_id,{group:a.target.value||null})} /></td>
            <td><input type="color" .value=${n.color||i.color||"#888888"} ?disabled=${t}
              @change=${a=>this._updDev(i.stat_id,{color:a.target.value})} /></td>
            <td><input type="checkbox" .checked=${!!n.ignored} ?disabled=${t}
              @change=${a=>this._updDev(i.stat_id,{ignored:a.target.checked})} /></td>
            <td>${!t&&i.source==="manual"?c`<button class="icon" title="Entfernen" @click=${()=>this._change(a=>delete a.devices[i.stat_id])}>✕</button>`:d}</td>
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
              ${ce.map(e=>c`<option value=${e.id} ?selected=${e.id===s.grouping}>${e.label}</option>`)}
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

    `}};v(I,"properties",{hass:{attribute:!1},_info:{state:!0},_s:{state:!0},_dirty:{state:!0},_msg:{state:!0},_addSel:{state:!0}}),v(I,"styles",w`
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
  `);customElements.define("ekd-settings",I);var V=class extends ${constructor(){super(),this._tab="overview"}_onSaved(){this.shadowRoot.querySelector("ekd-overview")?.refresh()}render(){return c`
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
    `}};v(V,"properties",{hass:{attribute:!1},narrow:{type:Boolean},route:{attribute:!1},panel:{attribute:!1},_tab:{state:!0}}),v(V,"styles",w`
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
  `);customElements.define("energiekosten-panel",V);
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
