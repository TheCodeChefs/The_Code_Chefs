import{a as C}from"./vendor-C5cLWRW_.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&a(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(i){if(i.ep)return;i.ep=!0;const r=n(i);fetch(i.href,r)}})();const T="https://tasty-treats-backend.p.goit.global/api",k=document.getElementById("category-list"),_=document.querySelector(".all-categories-button"),R=document.getElementById("search-input"),h=document.getElementById("recipe-grid"),O=document.getElementById("empty-recipe-grid"),te=document.getElementById("reset-button"),w=document.getElementById("time-select"),E=document.getElementById("area-select"),b=document.getElementById("ingredient-select"),f=document.getElementById("pagination");let g=null,B="",I="",L="",S="",d=1;const ne=9;let y=[];function q(t){return y.some(e=>e._id===t)}function ae(){localStorage.setItem("favorites",JSON.stringify(y))}function ie(){const t=localStorage.getItem("favorites");if(t)try{JSON.parse(t).forEach(n=>y.push(n))}catch{localStorage.removeItem("favorites")}}async function re(){try{const e=(await C.get(`${T}/categories`)).data;k.innerHTML="",e.forEach(n=>{const a=document.createElement("li"),i=document.createElement("button");i.textContent=n.name,i.classList.add("category-btn"),i.addEventListener("click",()=>{g=n.name,d=1,H(),u()}),a.appendChild(i),k.appendChild(a)})}catch(t){console.error("Kategori yüklenirken hata:",t)}}function H(){_.classList.remove("active"),k.querySelectorAll("li").forEach(t=>t.classList.remove("active")),g===null?_.classList.add("active"):k.querySelectorAll("li").forEach(t=>{t.querySelector("button").textContent===g&&t.classList.add("active")})}_.addEventListener("click",()=>{g=null,d=1,H(),u()});R.addEventListener("input",()=>{B=R.value.trim(),d=1,u()});te.addEventListener("click",()=>{g=null,B="",I="",L="",S="",R.value="",w.value="",E.value="",b.value="",d=1,H(),u()});w.addEventListener("change",()=>{I=w.value,d=1,u()});E.addEventListener("change",()=>{L=E.value,d=1,u()});b.addEventListener("change",()=>{S=b.value,d=1,u()});function oe(){const t=[15,30,45,60,90,120];w.innerHTML='<option value="">All times</option>',t.forEach(e=>{const n=document.createElement("option");n.value=e,n.textContent=`${e} minutes`,w.appendChild(n)})}async function se(){try{const e=(await C.get(`${T}/areas`)).data;E.innerHTML='<option value="">All areas</option>',e.forEach(n=>{const a=document.createElement("option");a.value=n.name,a.textContent=n.name,E.appendChild(a)})}catch(t){console.error("Area options yüklenirken hata:",t)}}async function ce(){try{const e=(await C.get(`${T}/ingredients`)).data;b.innerHTML='<option value="">All ingredients</option>',e.forEach(n=>{const a=document.createElement("option");a.value=n._id,a.textContent=n.name,b.appendChild(a)})}catch(t){console.error("Ingredient options yüklenirken hata:",t)}}async function u(t=1){d=t,h.innerHTML="Loading...";try{const e={page:d,limit:ne};g&&(e.category=g),B&&(e.title=B),I&&(e.time=I),L&&(e.area=L),S&&(e.ingredient=S);const n=await C.get(`${T}/recipes`,{params:e}),a=n.data.results||[],i=n.data.totalPages||1;if(!a.length){h.innerHTML="",O.innerHTML=`<svg
        class="icon-empty-recipes"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 97 83"
        width="97"
        height="83"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-recipes"></use>
        </svg>
        <p>No recipes found.</p>`,f.innerHTML="";return}O.innerHTML="",de(a),pe(i,d)}catch(e){console.error("Tarifler yüklenirken hata:",e),h.innerHTML="<p>Error loading recipes.</p>",f.innerHTML=""}}function le(t){let e="";for(let n=0;n<5;n++)n<parseInt(t)?e+=` <svg
        class="icon-yellow-star"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <use href="../svg/symbol-defs.svg#icon-yellow-star"></use>
        </svg>`:e+=` <svg
        class="icon-empty-star"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-star"></use>
        </svg>`;return e}function P(t){return q(t)?`<svg
            class="icon-white-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-white-heart"></use>
        </svg>`:`<svg
            class="icon-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-heart"></use>
        </svg>`}function U(t){return t?._id||t?.id}function de(t){h.innerHTML="",t.forEach(e=>{const n=document.createElement("div");n.className="recipe-card";const a=e.thumb||"https://via.placeholder.com/280x180?text=No+Image";n.style.backgroundImage=`linear-gradient(0.94deg, rgba(5, 5, 5, 0.6) 4.82%, rgba(5, 5, 5, 0.5) 18.72%), url(${a})`;const i=parseFloat(e.rating).toFixed(1);n.innerHTML=`
     <button id='favorite-button-${e._id}' class="favorite-btn">${P(e._id)}</button>
     
      <div class="recipe-card-bottom">
        <div class="recipe-card-desc">
            <h3>${e.title}</h3>
            <p>${e.description||""}</p>
        </div>
     
        <div class="recipe-card-button">
            <div class="stars">
                <div class="floatCount">
                ${i}
                </div>
                ${le(i)}
            </div>
            <button class="see-recipe-btn">See Recipe</button>
       </div>
      </div>
    `,n.querySelector(".favorite-btn").addEventListener("click",()=>{D(e)}),n.querySelector(".see-recipe-btn").addEventListener("click",()=>{const r=U(e);typeof window.openPopup=="function"?window.openPopup(r||e):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),h.appendChild(n)})}function D(t,e=!1){q(t._id)?y=y.filter(a=>a._id!==t._id):y.push(t);const n=document.getElementById(`favorite-button-${t._id}`);n&&(n.innerHTML=P(t._id)),!e&&ae()}function pe(t,e){f.innerHTML="";const n=(a,i,r=!1,s=!1,l="")=>{const p=document.createElement("button");return p.innerHTML=a,p.className=l,s&&p.classList.add("active"),r&&p.classList.add("disabled"),p.disabled=r,p.addEventListener("click",()=>{r||u(i)}),p};f.appendChild(n(`<svg
            class="icon-left-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(20, 0)"></use>
        </svg>`,1,e===1,!1,"page-arrow-icon")),f.appendChild(n(`<svg
            class="icon-left-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1"></use>
        </svg>`,e-1,e===1,!1,"page-arrow-icon"));for(let a=1;a<=t;a++)if(a===1||a===t||Math.abs(e-a)<=1)f.appendChild(n(a,a,!1,e===a));else if(a===2&&e>3||a===t-1&&e<t-2){const i=document.createElement("span");i.textContent="...",i.classList.add("dots"),f.appendChild(i)}f.appendChild(n(`<svg
            class="icon-right-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1"></use>
        </svg>`,e+1,e===t,!1,"page-arrow-icon")),f.appendChild(n(`<span><svg
            class="icon-right-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(20, 0)"></use>
        </svg></span>`,t,e===t,!1,"page-arrow-icon"))}async function me(){try{const e=(await C.get(`${T}/recipes/popular`)).data,n=document.querySelector("#popular-list");n.innerHTML="",e.forEach(a=>{const i=document.createElement("li");i.classList.add("popular-card");const r=a.preview||a.thumb||"https://via.placeholder.com/100x70?text=No+Image",s=a.title||"Untitled",l=a.description||a.instructions||"No description available";i.className="popular-card",i.innerHTML=`
  <img src="${r}" alt="${s}" />
  <div class="popular-card-info">
    <h4 class="popular-card-title" >${s}</h4>
    <p class="popular-card-desc">${l}</p>
  </div>
`,i.addEventListener("click",()=>{const p=U(a);typeof window.openPopup=="function"?window.openPopup(p||a):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),n.appendChild(i)})}catch(t){console.error("Popüler tarifler alınamadı:",t)}}window.addEventListener("DOMContentLoaded",async()=>{ie(),g=null,I="",L="",S="",H(),await re(),oe(),await se(),await ce(),await u(),await me()});const A="https://tasty-treats-backend.p.goit.global/api",o=(t,e=document)=>e.querySelector(t),J=(t,e=document)=>[...e.querySelectorAll(t)],$=t=>t&&t.classList.remove("hidden"),v=t=>t&&t.classList.add("hidden"),fe=t=>(t??"").toString().replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),j=t=>{const e=Number.parseFloat(String(t??"").replace(",","."));return Number.isFinite(e)?(Math.trunc(e*100)/100).toFixed(2):"0.00"},ue="../img/icons.svg";function G(t,e=""){return`<svg class="icon ${e}" aria-hidden="true" focusable="false">
    <use href="${ue}#icon-${t}"></use>
  </svg>`}function K(){try{const t=JSON.parse(localStorage.getItem("favorites"));return Array.isArray(t)?t:[]}catch{return[]}}function F(t){localStorage.setItem("favorites",JSON.stringify(t||[])),window.dispatchEvent(new Event("favorites:updated"))}function z(t){return t?._id||t?.id||t?.recipeId||""}function Q(t,e){const n=String(e);return(t||[]).findIndex(a=>String(z(a))===n)}function W(t){return Q(K(),t)!==-1}function ge(t){const e=z(t),n=t?.title||"",a=t?.description||"",i=Number(t?.rating)||0,r=t?.preview||t?.thumb||t?.image_url||t?.imageUrl||"";let s=t?.category;return s||(s=t?.category?.name||t?.categoryName||""),{...t,_id:e,title:n,description:a,rating:i,preview:r,category:typeof s=="string"?{name:s}:s||{}}}function ve(t,e){const n=K(),a=Q(n,t);if(D(e,!0),a!==-1)return n.splice(a,1),F(n),!1;const i=ge(e||{_id:t});return n.unshift(i),F(n),!0}let m=null,M=0;window.__currentRecipeId="";function c(){return{overlay:o("#popup-overlay"),content:o("#popup-content"),pmVideo:o("#pm-video"),pmIframe:o("#pm-iframe"),pmImage:o("#pm-image"),pmTitle:o("#pm-title"),pmRatingVal:o("#pm-rating-val"),pmStars:o("#pm-stars"),pmTime:o("#pm-time"),pmIngredients:o("#pm-ingredients"),pmTags:o("#pm-tags"),pmDesc:o("#pm-desc"),favBtn:o("#pm-fav-btn"),rateBtn:o("#pm-rate-btn"),ratingOverlay:o("#rating-overlay"),ratingStars:o("#rating-stars"),ratingValueEl:o("#rating-value"),ratingEmail:o("#rating-email"),ratingSend:o("#rating-send"),ratingHint:o("#rating-hint"),playBtn:o("#pm-play-btn"),clickCatcher:o("#pm-click-catcher")}}const ye=`<span class="star filled">${G("Star")}</span>`,he=`<span class="star empty">${G("Star-empty")}</span>`;function Z(t,e){if(!t)return;const n=Number.parseFloat(String(e??"").replace(",",".")),a=Number.isFinite(n)?n:0,i=Math.max(0,Math.min(5,Math.floor(a))),r=5-i;t.innerHTML=`<span class="star-row">
    ${ye.repeat(i)}${he.repeat(r)}
  </span>`}function X(t){t&&J("svg path",t).forEach(e=>e.setAttribute("fill","#dcdcdc"))}function we(t,e){if(!t)return;X(t);const n=Math.floor(e),a=e%1>=.5;J(".star-container",t).forEach((i,r)=>{const s=r+1,l=o("path",i);l&&(s<=n?l.setAttribute("fill","#eea10b"):s===n+1&&a&&l.setAttribute("fill",`url(#halfGradient-${s})`))})}function Y(t){const e=t.ratingEmail?.value.trim()||"",n=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e),a=M>0&&n;t.ratingSend&&(t.ratingSend.disabled=!a),t.ratingHint&&(t.ratingHint.textContent=a?"":"Enter valid email and select rating.")}let x=!1;const Ee=780;function ee(){const t=c();if(!t.content)return;const e=t.pmIngredients,n=t.pmTags,a=o(".meta-line",t.content);if(!(!n||!a)){if(window.innerWidth>=Ee){if(!x){const i=document.createElement("div");i.className="top-row",t.content.insertBefore(i,e),i.appendChild(n),i.appendChild(a),x=!0}}else if(x){t.content.insertBefore(a,e),t.content.insertBefore(n,t.pmDesc);const i=o(".top-row",t.content);i&&i.remove(),x=!1}}}function N(t){const e=c();if(!e.content)return;const n=String(t._id||t.id||"");n&&(e.content.dataset.recipeId=n,e.ratingOverlay&&(e.ratingOverlay.dataset.recipeId=n),window.__currentRecipeId=n),e.pmTitle&&(e.pmTitle.textContent=t.title||"Untitled"),e.pmRatingVal&&(e.pmRatingVal.textContent=j(t.rating)),Z(e.pmStars,t.rating||0),e.pmTime&&(e.pmTime.textContent=t.time?t.time+" min":"");const a=t.youtube||t.youtubeUrl||"";if(a){$(e.pmVideo),v(e.pmImage);const i=a.match(/(?:v=|\/)([0-9A-Za-z_-]{11})(?:\b|&|$)/)?.[1]||a;e.pmIframe&&(e.pmIframe.src=`https://www.youtube.com/embed/${i}?enablejsapi=1&rel=0&modestbranding=1&playsinline=1`)}else{v(e.pmVideo),$(e.pmImage);const i=t.image_url||t.imageUrl||t.preview||t.thumb||"";e.pmImage&&(e.pmImage.style.backgroundImage=i?`url('${fe(i)}')`:"")}e.pmIngredients&&(e.pmIngredients.innerHTML="",(t.ingredients||[]).forEach(i=>{const r=typeof i=="string"?i:i?.name||"",s=typeof i=="string"?"":i?.measure||"",l=document.createElement("div");l.className="ing-row",l.innerHTML=`<span class="ing-name">${r}</span><span class="ing-measure">${s}</span>`,e.pmIngredients.appendChild(l)})),e.pmTags&&(e.pmTags.innerHTML="",(t.tags||[]).forEach(i=>{const r=document.createElement("span");r.className="tag-chip",r.textContent=`#${i}`,e.pmTags.appendChild(r)})),e.pmDesc&&(e.pmDesc.textContent=t.description||""),e.favBtn&&n&&(e.favBtn.textContent=W(n)?"Remove favorite":"Add to favorite"),ee()}function V(){const t=c(),e=t.content?.dataset?.recipeId||window.__currentRecipeId||"";!t.favBtn||!e||(t.favBtn.textContent=W(e)?"Remove favorite":"Add to favorite")}window.openPopup=async function(e){const n=c();if(!n.overlay)return;document.documentElement.style.overflow="hidden",typeof e=="object"&&e?m=e:m={_id:String(e??"")},N(m),$(n.overlay),V();const a=String(m._id||m.id||"");if(a)try{const i=await fetch(`${A}/recipes/${encodeURIComponent(a)}`);if(i.ok){const r=await i.json();m={...m,...r},N(m),V()}}catch{}};document.addEventListener("click",t=>{const e=c();(t.target.closest(".popup-x")||e.overlay&&t.target===e.overlay)&&(v(e.overlay),document.documentElement.style.overflow="",e.pmIframe&&(e.pmIframe.src=""))});window.addEventListener("keydown",t=>{if(!(t.key==="Escape"&&!o("#rating-overlay.hidden"))&&t.key==="Escape"){const e=c();v(e.overlay),document.documentElement.style.overflow="",e.pmIframe&&(e.pmIframe.src="")}});document.addEventListener("click",t=>{const e=c();if(!t.target.closest("#pm-fav-btn"))return;const n=e.content?.dataset?.recipeId||window.__currentRecipeId||"";if(!n)return;const a=ve(n,m);e.favBtn&&(e.favBtn.textContent=a?"Remove favorite":"Add to favorite"),window.dispatchEvent(new Event("favorites:updated"))});(function(){const e=c();e.pmVideo&&(e.playBtn?.addEventListener("click",()=>{if(!e.pmIframe?.src)return;const n=e.pmIframe.src.includes("?")?"&":"?";e.pmIframe.src.includes("autoplay=1")||(e.pmIframe.src+=`${n}autoplay=1`),e.pmVideo.classList.add("is-playing")}),e.clickCatcher?.addEventListener("click",()=>{e.pmIframe?.src&&(e.pmIframe.src=e.pmIframe.src.replace(/[?&]autoplay=1/,""),e.pmVideo.classList.remove("is-playing"))}))})();document.addEventListener("click",t=>{const e=c();if(t.target.closest("#pm-rate-btn")){M=0,e.ratingValueEl&&(e.ratingValueEl.textContent="0.00"),e.ratingEmail&&(e.ratingEmail.value=""),e.ratingHint&&(e.ratingHint.textContent=""),e.ratingSend&&(e.ratingSend.disabled=!0),X(e.ratingStars),$(e.ratingOverlay);return}(t.target.closest("#rating-close")||e.ratingOverlay&&t.target===e.ratingOverlay)&&v(e.ratingOverlay)});window.addEventListener("keydown",t=>{if(t.key!=="Escape")return;const e=c();e.ratingOverlay?.classList.contains("hidden")||v(e.ratingOverlay)});document.addEventListener("click",t=>{const e=c(),n=t.target.closest(".half-btn");if(!n||!e.ratingStars?.contains(n))return;const a=parseFloat(n.dataset.val||n.dataset.value);a&&(M=a,e.ratingValueEl&&(e.ratingValueEl.textContent=a.toFixed(2)),we(e.ratingStars,a),Y(e))});document.addEventListener("input",t=>{const e=c();t.target===e.ratingEmail&&Y(e)});document.addEventListener("click",async t=>{const e=c();if(!t.target.closest("#rating-send"))return;const n=e.ratingOverlay?.dataset?.recipeId||e.content?.dataset?.recipeId||"";if(!n)return;const a={rate:M,email:e.ratingEmail?.value.trim()||""};try{if(e.ratingSend&&(e.ratingSend.disabled=!0),!(await fetch(`${A}/recipes/${encodeURIComponent(n)}/rating`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).ok)throw new Error("Failed to send rating");e.ratingHint&&(e.ratingHint.textContent="Thanks for rating!",e.ratingHint.classList.add("ok"));try{const r=await fetch(`${A}/recipes/${encodeURIComponent(n)}`).then(s=>s.json());e.pmRatingVal&&(e.pmRatingVal.textContent=j(r?.rating)),Z(e.pmStars,r?.rating??0)}catch{}setTimeout(()=>v(e.ratingOverlay),900)}catch(i){e.ratingHint&&(e.ratingHint.textContent=i?.message||"Error sending rating.",e.ratingHint.classList.remove("ok"))}finally{e.ratingSend&&(e.ratingSend.disabled=!1)}});window.addEventListener("resize",ee);
//# sourceMappingURL=popup_menu-Ev2JoY5L.js.map
