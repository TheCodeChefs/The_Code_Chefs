import"./assets/popup_menu-C-lSVEW9.js";import{S as $,a as w}from"./assets/vendor-C5cLWRW_.js";new $(".swiper",{slidesPerView:"auto",centeredSlides:!1,spaceBetween:16,pagination:{el:".swiper-pagination",clickable:!0}});const E="https://tasty-treats-backend.p.goit.global/api",L=document.getElementById("category-list"),x=document.querySelector(".all-categories-button"),S=document.getElementById("search-input"),u=document.getElementById("recipe-grid"),k=document.getElementById("empty-recipe-grid"),A=document.getElementById("reset-button"),v=document.getElementById("time-select"),g=document.getElementById("area-select"),f=document.getElementById("ingredient-select"),r=document.getElementById("pagination");let l=null,C="",m="",h="",y="",a=1;const _=9;let p=[];function T(t){return p.some(e=>e._id===t)}function F(){localStorage.setItem("favorites",JSON.stringify(p))}function N(){const t=localStorage.getItem("favorites");if(t)try{JSON.parse(t).forEach(n=>p.push(n))}catch{localStorage.removeItem("favorites")}}async function R(){try{const e=(await w.get(`${E}/categories`)).data;L.innerHTML="",e.forEach(n=>{const s=document.createElement("li"),o=document.createElement("button");o.textContent=n.name,o.classList.add("category-btn"),o.addEventListener("click",()=>{l=n.name,a=1,B(),c()}),s.appendChild(o),L.appendChild(s)})}catch(t){console.error("Kategori yüklenirken hata:",t)}}function B(){x.classList.remove("active"),L.querySelectorAll("li").forEach(t=>t.classList.remove("active")),l===null?x.classList.add("active"):L.querySelectorAll("li").forEach(t=>{t.querySelector("button").textContent===l&&t.classList.add("active")})}x.addEventListener("click",()=>{l=null,a=1,B(),c()});S.addEventListener("input",()=>{C=S.value.trim(),a=1,c()});A.addEventListener("click",()=>{l=null,C="",m="",h="",y="",S.value="",v.value="",g.value="",f.value="",a=1,B(),c()});v.addEventListener("change",()=>{m=v.value,a=1,c()});g.addEventListener("change",()=>{h=g.value,a=1,c()});f.addEventListener("change",()=>{y=f.value,a=1,c()});function q(){const t=[15,30,45,60,90,120];v.innerHTML='<option value="">All times</option>',t.forEach(e=>{const n=document.createElement("option");n.value=e,n.textContent=`${e} minutes`,v.appendChild(n)})}async function O(){try{const e=(await w.get(`${E}/areas`)).data;g.innerHTML='<option value="">All areas</option>',e.forEach(n=>{const s=document.createElement("option");s.value=n.name,s.textContent=n.name,g.appendChild(s)})}catch(t){console.error("Area options yüklenirken hata:",t)}}async function G(){try{const e=(await w.get(`${E}/ingredients`)).data;f.innerHTML='<option value="">All ingredients</option>',e.forEach(n=>{const s=document.createElement("option");s.value=n._id,s.textContent=n.name,f.appendChild(s)})}catch(t){console.error("Ingredient options yüklenirken hata:",t)}}async function c(t=1){a=t,u.innerHTML="Loading...";try{const e={page:a,limit:_};l&&(e.category=l),C&&(e.title=C),m&&(e.time=m),h&&(e.area=h),y&&(e.ingredient=y);const n=await w.get(`${E}/recipes`,{params:e}),s=n.data.results||[],o=n.data.totalPages||1;if(!s.length){u.innerHTML="",k.innerHTML=`<svg
        class="icon-empty-recipes"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 97 83"
        width="97"
        height="83"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-recipes"></use>
        </svg>
        <p>No recipes found.</p>`,r.innerHTML="";return}k.innerHTML="",U(s),D(o,a)}catch(e){console.error("Tarifler yüklenirken hata:",e),u.innerHTML="<p>Error loading recipes.</p>",r.innerHTML=""}}function J(t){let e="";for(let n=0;n<5;n++)n<parseInt(t)?e+=` <svg
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
        </svg>`;return e}function M(t){return T(t)?`<svg
            class="icon-white-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-white-heart"></use>
        </svg>`:`<svg
            class="icon-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-heart"></use>
        </svg>`}function H(t){return t?._id||t?.id}function U(t){u.innerHTML="",t.forEach(e=>{const n=document.createElement("div");n.className="recipe-card";const s=e.thumb||"https://via.placeholder.com/280x180?text=No+Image";n.style.backgroundImage=`linear-gradient(0.94deg, rgba(5, 5, 5, 0.6) 4.82%, rgba(5, 5, 5, 0.5) 18.72%), url(${s})`;const o=parseFloat(e.rating).toFixed(1);n.innerHTML=`
     <button id='favorite-button-${e._id}' class="favorite-btn">${M(e._id)}</button>
     
      <div class="recipe-card-bottom">
        <div class="recipe-card-desc">
            <h3>${e.title}</h3>
            <p>${e.description||""}</p>
        </div>
     
        <div class="recipe-card-button">
            <div class="stars">
                <div class="floatCount">
                ${o}
                </div>
                ${J(o)}
            </div>
            <button class="see-recipe-btn">See Recipe</button>
       </div>
      </div>
    `,n.querySelector(".favorite-btn").addEventListener("click",()=>{V(e)}),n.querySelector(".see-recipe-btn").addEventListener("click",()=>{const d=H(e);typeof window.openPopup=="function"?window.openPopup(d||e):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),u.appendChild(n)})}function V(t,e=!1){T(t._id)?p=p.filter(s=>s._id!==t._id):p.push(t);const n=document.getElementById(`favorite-button-${t._id}`);n&&(n.innerHTML=M(t._id)),!e&&F()}function D(t,e){r.innerHTML="";const n=(s,o,d=!1,b=!1,I="")=>{const i=document.createElement("button");return i.innerHTML=s,i.className=I,b&&i.classList.add("active"),d&&i.classList.add("disabled"),i.disabled=d,i.addEventListener("click",()=>{d||c(o)}),i};r.appendChild(n(`<svg
            class="icon-left-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(20, 0)"></use>
        </svg>`,1,e===1,!1,"page-arrow-icon")),r.appendChild(n(`<svg
            class="icon-left-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1"></use>
        </svg>`,e-1,e===1,!1,"page-arrow-icon"));for(let s=1;s<=t;s++)if(s===1||s===t||Math.abs(e-s)<=1)r.appendChild(n(s,s,!1,e===s));else if(s===2&&e>3||s===t-1&&e<t-2){const o=document.createElement("span");o.textContent="...",o.classList.add("dots"),r.appendChild(o)}r.appendChild(n(`<svg
            class="icon-right-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1"></use>
        </svg>`,e+1,e===t,!1,"page-arrow-icon")),r.appendChild(n(`<span><svg
            class="icon-right-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(20, 0)"></use>
        </svg></span>`,t,e===t,!1,"page-arrow-icon"))}async function K(){try{const e=(await w.get(`${E}/recipes/popular`)).data,n=document.querySelector("#popular-list");n.innerHTML="",e.forEach(s=>{const o=document.createElement("li");o.classList.add("popular-card");const d=s.preview||s.thumb||"https://via.placeholder.com/100x70?text=No+Image",b=s.title||"Untitled",I=s.description||s.instructions||"No description available";o.className="popular-card",o.innerHTML=`
  <img src="${d}" alt="${b}" />
  <div class="popular-card-info">
    <h4 class="popular-card-title" >${b}</h4>
    <p class="popular-card-desc">${I}</p>
  </div>
`,o.addEventListener("click",()=>{const i=H(s);typeof window.openPopup=="function"?window.openPopup(i||s):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),n.appendChild(o)})}catch(t){console.error("Popüler tarifler alınamadı:",t)}}window.addEventListener("DOMContentLoaded",async()=>{N(),l=null,m="",h="",y="",B(),await R(),q(),await O(),await G(),await c(),await K()});
//# sourceMappingURL=index.js.map
