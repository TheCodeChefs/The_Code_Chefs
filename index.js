/* empty css                      */import{S as ft,a as F}from"./assets/vendor-BeeM0YqF.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const d of i)if(d.type==="childList")for(const v of d.addedNodes)v.tagName==="LINK"&&v.rel==="modulepreload"&&r(v)}).observe(document,{childList:!0,subtree:!0});function a(i){const d={};return i.integrity&&(d.integrity=i.integrity),i.referrerPolicy&&(d.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?d.credentials="include":i.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function r(i){if(i.ep)return;i.ep=!0;const d=a(i);fetch(i.href,d)}})();new ft(".swiper",{slidesPerView:"auto",centeredSlides:!1,spaceBetween:16,pagination:{el:".swiper-pagination",clickable:!0}});const R="https://tasty-treats-backend.p.goit.global/api",P=document.getElementById("category-list"),G=document.querySelector(".all-categories-button"),V=document.getElementById("search-input"),T=document.getElementById("recipe-grid"),K=document.getElementById("empty-recipe-grid"),pt=document.getElementById("reset-button"),B=document.getElementById("time-select"),_=document.getElementById("area-select"),A=document.getElementById("ingredient-select"),L=document.getElementById("pagination");let x=null,j="",H="",q="",N="",h=1;const vt=9;let k=[];function Z(o){return k.some(s=>s._id===o)}function yt(){localStorage.setItem("favorites",JSON.stringify(k))}function ht(){const o=localStorage.getItem("favorites");if(o)try{JSON.parse(o).forEach(a=>k.push(a))}catch{localStorage.removeItem("favorites")}}async function bt(){try{const s=(await F.get(`${R}/categories`)).data;P.innerHTML="",s.forEach(a=>{const r=document.createElement("li"),i=document.createElement("button");i.textContent=a.name,i.classList.add("category-btn"),i.addEventListener("click",()=>{x=a.name,h=1,D(),E()}),r.appendChild(i),P.appendChild(r)})}catch(o){console.error("Kategori yüklenirken hata:",o)}}function D(){G.classList.remove("active"),P.querySelectorAll("li").forEach(o=>o.classList.remove("active")),x===null?G.classList.add("active"):P.querySelectorAll("li").forEach(o=>{o.querySelector("button").textContent===x&&o.classList.add("active")})}G.addEventListener("click",()=>{x=null,h=1,D(),E()});V.addEventListener("input",()=>{j=V.value.trim(),h=1,E()});pt.addEventListener("click",()=>{x=null,j="",H="",q="",N="",V.value="",B.value="",_.value="",A.value="",h=1,D(),E()});B.addEventListener("change",()=>{H=B.value,h=1,E()});_.addEventListener("change",()=>{q=_.value,h=1,E()});A.addEventListener("change",()=>{N=A.value,h=1,E()});function wt(){const o=[15,30,45,60,90,120];B.innerHTML='<option value="">All times</option>',o.forEach(s=>{const a=document.createElement("option");a.value=s,a.textContent=`${s} minutes`,B.appendChild(a)})}async function Lt(){try{const s=(await F.get(`${R}/areas`)).data;_.innerHTML='<option value="">All areas</option>',s.forEach(a=>{const r=document.createElement("option");r.value=a.name,r.textContent=a.name,_.appendChild(r)})}catch(o){console.error("Area options yüklenirken hata:",o)}}async function Et(){try{const s=(await F.get(`${R}/ingredients`)).data;A.innerHTML='<option value="">All ingredients</option>',s.forEach(a=>{const r=document.createElement("option");r.value=a._id,r.textContent=a.name,A.appendChild(r)})}catch(o){console.error("Ingredient options yüklenirken hata:",o)}}async function E(o=1){h=o,T.innerHTML="Loading...";try{const s={page:h,limit:vt};x&&(s.category=x),j&&(s.title=j),H&&(s.time=H),q&&(s.area=q),N&&(s.ingredient=N);const a=await F.get(`${R}/recipes`,{params:s}),r=a.data.results||[],i=a.data.totalPages||1;if(!r.length){T.innerHTML="",K.innerHTML=`<svg
        class="icon-empty-recipes"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 97 83"
        width="97"
        height="83"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-recipes"></use>
        </svg>
        <p>No recipes found.</p>`,L.innerHTML="";return}K.innerHTML="",St(r),$t(i,h)}catch(s){console.error("Tarifler yüklenirken hata:",s),T.innerHTML="<p>Error loading recipes.</p>",L.innerHTML=""}}function xt(o){let s="";for(let a=0;a<5;a++)a<parseInt(o)?s+=` <svg
        class="icon-yellow-star"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <use href="../svg/symbol-defs.svg#icon-yellow-star"></use>
        </svg>`:s+=` <svg
        class="icon-empty-star"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-star"></use>
        </svg>`;return s}function Y(o){return Z(o)?`<svg
            class="icon-white-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-white-heart"></use>
        </svg>`:`<svg
            class="icon-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-heart"></use>
        </svg>`}function Q(o){return(o==null?void 0:o._id)||(o==null?void 0:o.id)}function St(o){T.innerHTML="",o.forEach(s=>{const a=document.createElement("div");a.className="recipe-card";const r=s.thumb||"https://via.placeholder.com/280x180?text=No+Image";a.style.backgroundImage=`linear-gradient(0.94deg, rgba(5, 5, 5, 0.6) 4.82%, rgba(5, 5, 5, 0.5) 18.72%), url(${r})`;const i=parseFloat(s.rating).toFixed(1);a.innerHTML=`
     <button id='favorite-button-${s._id}' class="favorite-btn">${Y(s._id)}</button>
     
      <div class="recipe-card-bottom">
        <div class="recipe-card-desc">
            <h3>${s.title}</h3>
            <p>${s.description||""}</p>
        </div>
     
        <div class="recipe-card-button">
            <div class="stars">
                <div class="floatCount">
                ${i}
                </div>
                ${xt(i)}
            </div>
            <button class="see-recipe-btn">See Recipe</button>
       </div>
      </div>
    `,a.querySelector(".favorite-btn").addEventListener("click",()=>{W(s)}),a.querySelector(".see-recipe-btn").addEventListener("click",()=>{const d=Q(s);typeof window.openPopup=="function"?window.openPopup(d||s):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),T.appendChild(a)})}function W(o,s=!1){Z(o._id)?k=k.filter(r=>r._id!==o._id):k.push(o);const a=document.getElementById(`favorite-button-${o._id}`);a&&(a.innerHTML=Y(o._id)),!s&&yt()}function $t(o,s){L.innerHTML="";const a=(r,i,d=!1,v=!1,C="")=>{const y=document.createElement("button");return y.innerHTML=r,y.className=C,v&&y.classList.add("active"),d&&y.classList.add("disabled"),y.disabled=d,y.addEventListener("click",()=>{d||E(i)}),y};L.appendChild(a(`<svg
            class="icon-left-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(20, 0)"></use>
        </svg>`,1,s===1,!1,"page-arrow-icon")),L.appendChild(a(`<svg
            class="icon-left-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1"></use>
        </svg>`,s-1,s===1,!1,"page-arrow-icon"));for(let r=1;r<=o;r++)if(r===1||r===o||Math.abs(s-r)<=1)L.appendChild(a(r,r,!1,s===r));else if(r===2&&s>3||r===o-1&&s<o-2){const i=document.createElement("span");i.textContent="...",i.classList.add("dots"),L.appendChild(i)}L.appendChild(a(`<svg
            class="icon-right-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1"></use>
        </svg>`,s+1,s===o,!1,"page-arrow-icon")),L.appendChild(a(`<span><svg
            class="icon-right-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(20, 0)"></use>
        </svg></span>`,o,s===o,!1,"page-arrow-icon"))}async function kt(){try{const s=(await F.get(`${R}/recipes/popular`)).data,a=document.querySelector("#popular-list");a.innerHTML="",s.forEach(r=>{const i=document.createElement("li");i.classList.add("popular-card");const d=r.preview||r.thumb||"https://via.placeholder.com/100x70?text=No+Image",v=r.title||"Untitled",C=r.description||r.instructions||"No description available";i.className="popular-card",i.innerHTML=`
  <img src="${d}" alt="${v}" />
  <div class="popular-card-info">
    <h4 class="popular-card-title" >${v}</h4>
    <p class="popular-card-desc">${C}</p>
  </div>
`,i.addEventListener("click",()=>{const y=Q(r);typeof window.openPopup=="function"?window.openPopup(y||r):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),a.appendChild(i)})}catch(o){console.error("Popüler tarifler alınamadı:",o)}}window.addEventListener("DOMContentLoaded",async()=>{ht(),x=null,H="",q="",N="",D(),await bt(),wt(),await Lt(),await Et(),await E(),await kt()});console.log("✅ popup_menu.js yüklendi");(function(){const o="https://tasty-treats-backend.p.goit.global/api",s="favorites",a=()=>{try{return JSON.parse(localStorage.getItem(s)||"[]")}catch{return[]}},r=t=>localStorage.setItem(s,JSON.stringify(t)),i=t=>a().some(n=>n&&(n._id===t||n.id===t)),d={ingredientsMap:null,recipes:new Map},v=async t=>{const n=await fetch(t,{cache:"no-store"});if(!n.ok)throw new Error(`${n.status} ${n.statusText}`);return n.json()};async function C(){if(d.ingredientsMap)return d.ingredientsMap;const t=await v(`${o}/ingredients`),n=new Map;return(t||[]).forEach(e=>{const c=e._id||e.id,l=e.ttl||e.title||e.name||e.ingredient||"";n.set(c,{id:c,name:l})}),d.ingredientsMap=n,n}async function y(t){if(d.recipes.has(t))return d.recipes.get(t);const n=await v(`${o}/recipes/${t}`);return d.recipes.set(t,n),n}const b=t=>(t??"").toString().replace(/[&<>"']/g,n=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[n]),X='<svg class="star" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',tt='<svg class="star empty" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24zm-10 6.11l-3.76 2.27 1-4.28L5.5 10.5l4.38-.38L12 6.1l2.12 4.02 4.38.38-3.74 3.84 1 4.28L12 15.35z"/></svg>',et=(t=0)=>`<span class="star-row">${X.repeat(Math.min(5,Math.max(0,Math.floor(+t||0))))}${tt.repeat(5-Math.min(5,Math.max(0,Math.floor(+t||0))))}</span>`,S=t=>String((t==null?void 0:t._id)||(t==null?void 0:t.id)||""),nt=(t,n)=>{var c;if(!t)return"";if(typeof t=="string")return t;const e=(c=n==null?void 0:n.get)==null?void 0:c.call(n,t.id||t._id);return t.name??t.title??(e==null?void 0:e.name)??t.ingredient??t.product??t.description??t.item??""},st=t=>{var c;if(!t||typeof t=="string")return"";if(typeof t.measure=="string")return t.measure;const n=t.quantity??t.qty??t.amount??t.value??t.count??t.number,e=t.unit??t.unitShort??t.unitLong??t.measureUnit??t.units;if(n||e)return[n,e].filter(Boolean).join(" ");if(t.measure&&typeof t.measure=="object"){const l=t.measure.quantity??t.measure.amount??t.measure.value,g=t.measure.unit??t.measure.unitShort??t.measure.units;if(l||g)return[l,g].filter(Boolean).join(" ")}if((c=t.measures)!=null&&c.metric){const l=t.measures.metric,g=l.amount??l.quantity??l.value,m=l.unitShort??l.unit;if(g||m)return[g,m].filter(Boolean).join(" ")}return""},ot=t=>Array.isArray(t==null?void 0:t.ingredients)?t.ingredients:typeof(t==null?void 0:t.ingredients)=="string"?t.ingredients.split(`
`).map(n=>n.trim()).filter(Boolean).map(n=>({name:n})):Array.isArray(t==null?void 0:t.components)?t.components:Array.isArray(t==null?void 0:t.extendedIngredients)?t.extendedIngredients:[];function at(t=""){const n=String(t).trim();if(!n)return"";if(/^[a-zA-Z0-9_-]{11}$/.test(n))return n;const e=n.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)||n.match(/[?&]v=([a-zA-Z0-9_-]{11})/);return e?e[1]:""}function rt(t){const n=(t==null?void 0:t.youtube)||(t==null?void 0:t.video)||(t==null?void 0:t.youtubeUrl)||(t==null?void 0:t.youtubeLink)||(t==null?void 0:t.yt)||"",e=at(n);return e?`https://www.youtube.com/embed/${e}?rel=0&modestbranding=1`:""}window.__pmEscHandler=window.__pmEscHandler||null,window.openPopup=async function(t){const n=document.getElementById("home-filter-popup-overlay"),e=document.getElementById("home-filter-popup-content");if(!n||!e)return console.error("❌ #popup-overlay/#popup-content yok.");n.setAttribute("role","dialog"),n.setAttribute("aria-modal","true");let c=typeof t=="object"?t:a().find(l=>S(l)===String(t))||{_id:t};lt(e,c),n.classList.remove("hidden"),document.body.style.overflow="hidden";try{const l=S(c),[g,m]=await Promise.all([l?y(l):Promise.resolve(null),C()]);c={...c,...g||{}},ct(e,n,c,m)}catch(l){console.error("Popup fetch error:",l),e.innerHTML=dt(l),z(n)}},window.closePopup=function(){const t=document.getElementById("home-filter-popup-overlay");t&&(t.classList.add("hidden"),document.body.style.overflow="",window.__pmEscHandler&&(document.removeEventListener("keydown",window.__pmEscHandler),window.__pmEscHandler=null))};function it(t){const n=rt(t);return n?`
        <div class="video-wrapper">
          <iframe class="video-iframe" src="${n}" title="Recipe video" frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen></iframe>
        </div>`:`<div class="media-frame" style="background-image:url('${b((t==null?void 0:t.preview)||(t==null?void 0:t.thumb)||"")}')"></div>`}function lt(t,n){t.innerHTML=`
      <button class="popup-x" type="button" aria-label="Close">×</button>
      <div class="media-wrapper"><div class="media-frame sk-bg"></div></div>
      <h2 class="recipe-title">${b((n==null?void 0:n.title)||"Loading...")}</h2>
      <div class="meta-line sk-line" style="height:16px;width:160px;"></div>
      <div class="ingredients">
        ${["","","","",""].map(()=>'<div class="ing-row"><span class="ing-name sk-line" style="width:60%"></span><span class="ing-measure sk-line" style="width:20%"></span></div>').join("")}
      </div>
      <div class="tags">${["","",""].map(()=>'<span class="tag-chip sk-line" style="width:90px;height:28px;"></span>').join("")}</div>
      <div class="recipe-description sk-block" style="height:90px"></div>
      <div class="popup-actions">
        <button class="btn btn-green" disabled>…</button>
        <button class="btn btn-outline" disabled>…</button>
      </div>`,z(document.getElementById("home-filter-popup-overlay"))}function ct(t,n,e,c){var O;const l=((O=e==null?void 0:e.time)==null?void 0:O.minutes)??(e==null?void 0:e.time)??"",g=((e==null?void 0:e.tags)||[]).map(p=>`<span class="tag-chip">#${b(p)}</span>`).join(""),f=ot(e).map(p=>{const w=nt(p,c),$=st(p);return`<div class="ing-row"><span class="ing-name">${b(w)}</span><span class="ing-measure">${b($)}</span></div>`}).join(""),M=i(S(e))?"Remove from favorite":"Add to favorite";t.innerHTML=`
      <button class="popup-x" type="button" aria-label="Close">×</button>

      <div class="media-wrapper">
        ${it(e)}
      </div>

      <h2 class="recipe-title">${b((e==null?void 0:e.title)||"Untitled")}</h2>

      <div class="meta-line">
        <span class="rating-val">${(Number(e==null?void 0:e.rating)||0).toFixed(1)}</span>
        ${et(e==null?void 0:e.rating)}
        ${l?`<span class="dot">•</span><span class="cook-time">${b(l)} min</span>`:""}
      </div>

      <div class="ingredients">
        ${f||'<div class="ing-row"><span class="ing-name">Ingredients</span><span class="ing-measure">N/A</span></div>'}
      </div>

      <div class="tags">${g}</div>

      <div class="recipe-description">
        ${b((e==null?void 0:e.description)||(e==null?void 0:e.instructions)||"")}
      </div>

      <div class="popup-actions">
        <button class="btn btn-green" id="pm-fav-btn">${M}</button>
        <button class="btn btn-outline" id="pm-rate-btn">Give a rating</button>
      </div>
    `,z(n),t.querySelector("#pm-fav-btn").addEventListener("click",()=>{const p=a(),w=S(e);W(e,!0),i(w)?(r(p.filter($=>S($)!==w)),t.querySelector("#pm-fav-btn").textContent="Add to favorite"):(r([{...e},...p]),t.querySelector("#pm-fav-btn").textContent="Remove from favorite")}),t.querySelector("#pm-rate-btn").addEventListener("click",()=>{mt(e)})}function dt(t){return`
      <button class="popup-x" type="button" aria-label="Close" onclick="closePopup()">×</button>
      <div style="padding:12px">
        <h3 style="margin:8px 0;color:#b00020">Failed to load recipe</h3>
        <p style="color:#666;font-size:14px;">${b((t==null?void 0:t.message)||"Unknown error")}</p>
      </div>`}function z(t){const n=document.querySelector(".popup-x");n&&(n.onclick=()=>window.closePopup()),t.onclick=e=>{e.target===t&&window.closePopup()},window.__pmEscHandler&&document.removeEventListener("keydown",window.__pmEscHandler),window.__pmEscHandler=e=>{e.key==="Escape"&&window.closePopup()},document.addEventListener("keydown",window.__pmEscHandler)}async function ut(t,n,e){const c=S(t);if(!c)throw new Error("Missing recipe id");const l=`${o}/recipes/${c}/rating`,g={rate:Number(n)};e&&(g.email=e);const m=await fetch(l,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(g),mode:"cors",cache:"no-store"});let f="";try{f=await m.clone().text()}catch{}if(console.groupCollapsed("[rating] response"),console.log("URL:",l),console.log("Status:",m.status,m.statusText),console.log("Headers:",Object.fromEntries(m.headers.entries())),console.log("Body:",f),console.groupEnd(),!m.ok)try{const M=JSON.parse(f||"{}");throw new Error(M.message||`${m.status} ${m.statusText}`)}catch{throw new Error(f||`${m.status} ${m.statusText}`)}try{return JSON.parse(f||"{}")}catch{return{}}}function mt(t){const n=document.getElementById("home-filter-popup-content");if(!n)return;const e=n.querySelector(".rating-overlay");e&&e.remove();const c=document.createElement("div");c.className="rating-overlay",c.innerHTML=`
      <div class="rating-card" role="dialog" aria-label="Rate recipe">
        <button class="rating-x" type="button" aria-label="Close">×</button>
        <h3 class="rating-title">Rating</h3>
        <div class="rating-row">
          <span class="rating-value">0.0</span>
          <div class="rating-stars" aria-label="Stars">
            ${[1,2,3,4,5].map(u=>`
              <div class="star-container" data-star="${u}">
                <button class="half-btn left"  data-val="${u-1+.5}" aria-label="${u-.5} stars"></button>
                <button class="half-btn right" data-val="${u}" aria-label="${u} stars"></button>
                <svg viewBox="0 0 24 24" width="28" height="28">
                  <defs>
                    <linearGradient id="halfGradient-${u}" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="50%" stop-color="#FFC107"></stop>
                      <stop offset="50%" stop-color="#D6D6D6"></stop>
                    </linearGradient>
                  </defs>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#D6D6D6"/>
                </svg>
              </div>
            `).join("")}
          </div>
        </div>

        <label class="rating-label">
          <input type="email" class="rating-email" placeholder="Enter email" />
        </label>

        <button class="btn rating-send" disabled>Send</button>
        <p class="rating-hint"></p>
      </div>
    `,n.appendChild(c);const l=c.querySelector(".rating-card"),g=l.querySelector(".rating-x"),m=l.querySelector(".rating-email"),f=l.querySelector(".rating-send"),M=l.querySelector(".rating-stars"),O=l.querySelector(".rating-value"),p=l.querySelector(".rating-hint");let w=0;const $=(u="")=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(u),gt=u=>{w=u,O.textContent=u.toFixed(1),l.querySelectorAll(".star-container").forEach(I=>{const J=Number(I.dataset.star),U=I.querySelector("svg path");u>=J?U.setAttribute("fill","#FFC107"):u>=J-.5?U.setAttribute("fill",`url(#halfGradient-${J})`):U.setAttribute("fill","#D6D6D6")}),f.disabled=!(w&&$(m.value))};M.addEventListener("click",u=>{const I=u.target.closest(".half-btn");I&&gt(Number(I.dataset.val))}),m.addEventListener("input",()=>{f.disabled=!(w&&$(m.value))}),g.onclick=()=>c.remove(),c.addEventListener("click",u=>{u.target===c&&c.remove()}),f.addEventListener("click",async()=>{p.textContent="",f.disabled=!0;try{await ut(t,w,m.value.trim()),p.textContent="Thanks for your rating!",p.classList.add("ok"),setTimeout(()=>c.remove(),900)}catch(u){p.textContent=String((u==null?void 0:u.message)||"Failed to send rating. Please try again."),p.classList.remove("ok"),f.disabled=!1}})}})();
//# sourceMappingURL=index.js.map
