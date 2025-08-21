import"./assets/popup_menu-CeRdhb8B.js";import{S as A,a as y}from"./assets/vendor-CqPP30cW.js";const N=document.querySelector(".order-now-button"),T=document.querySelector(".order-now"),_=document.querySelector(".order-now-close-button");new A(".swiper",{slidesPerView:"auto",centeredSlides:!1,spaceBetween:16,pagination:{el:".swiper-pagination",clickable:!0}});N.addEventListener("click",()=>{T.classList.add("show-order-now")});_.addEventListener("click",()=>{T.classList.remove("show-order-now")});const L="https://tasty-treats-backend.p.goit.global/api",b=document.getElementById("category-list"),I=document.querySelector(".all-categories-button"),k=document.getElementById("search-input"),p=document.getElementById("recipe-grid"),x=document.getElementById("empty-recipe-grid"),q=document.getElementById("reset-button"),v=document.getElementById("time-select"),g=document.getElementById("area-select"),f=document.getElementById("ingredient-select"),r=document.getElementById("pagination");let l=null,B="",m="",h="",w="",a=1;const F=9;let u=[];function M(t){return u.some(e=>e._id===t)}function R(){localStorage.setItem("favorites",JSON.stringify(u))}function O(){const t=localStorage.getItem("favorites");if(t)try{JSON.parse(t).forEach(n=>u.push(n))}catch{localStorage.removeItem("favorites")}}async function G(){try{const e=(await y.get(`${L}/categories`)).data;b.innerHTML="",e.forEach(n=>{const o=document.createElement("li"),s=document.createElement("button");s.textContent=n.name,s.classList.add("category-btn"),s.addEventListener("click",()=>{l=n.name,a=1,C(),c()}),o.appendChild(s),b.appendChild(o)})}catch(t){console.error("Kategori yüklenirken hata:",t)}}function C(){I.classList.remove("active"),b.querySelectorAll("li").forEach(t=>t.classList.remove("active")),l===null?I.classList.add("active"):b.querySelectorAll("li").forEach(t=>{t.querySelector("button").textContent===l&&t.classList.add("active")})}I.addEventListener("click",()=>{l=null,a=1,C(),c()});k.addEventListener("input",()=>{B=k.value.trim(),a=1,c()});q.addEventListener("click",()=>{l=null,B="",m="",h="",w="",k.value="",v.value="",g.value="",f.value="",a=1,C(),c()});v.addEventListener("change",()=>{m=v.value,a=1,c()});g.addEventListener("change",()=>{h=g.value,a=1,c()});f.addEventListener("change",()=>{w=f.value,a=1,c()});function J(){const t=[15,30,45,60,90,120];v.innerHTML='<option value="">All times</option>',t.forEach(e=>{const n=document.createElement("option");n.value=e,n.textContent=`${e} minutes`,v.appendChild(n)})}async function U(){try{const e=(await y.get(`${L}/areas`)).data;g.innerHTML='<option value="">All areas</option>',e.forEach(n=>{const o=document.createElement("option");o.value=n.name,o.textContent=n.name,g.appendChild(o)})}catch(t){console.error("Area options yüklenirken hata:",t)}}async function V(){try{const e=(await y.get(`${L}/ingredients`)).data;f.innerHTML='<option value="">All ingredients</option>',e.forEach(n=>{const o=document.createElement("option");o.value=n._id,o.textContent=n.name,f.appendChild(o)})}catch(t){console.error("Ingredient options yüklenirken hata:",t)}}async function c(t=1){a=t,p.innerHTML="Loading...";try{const e={page:a,limit:F};l&&(e.category=l),B&&(e.title=B),m&&(e.time=m),h&&(e.area=h),w&&(e.ingredient=w);const n=await y.get(`${L}/recipes`,{params:e}),o=n.data.results||[],s=n.data.totalPages||1;if(!o.length){p.innerHTML="",x.innerHTML=`<svg
        class="icon-empty-recipes"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 97 83"
        width="97"
        height="83"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-recipes"></use>
        </svg>
        <p>No recipes found.</p>`,r.innerHTML="";return}x.innerHTML="",K(o),Q(s,a)}catch(e){console.error("Tarifler yüklenirken hata:",e),p.innerHTML="<p>Error loading recipes.</p>",r.innerHTML=""}}function D(t){let e="";for(let n=0;n<5;n++)n<parseInt(t)?e+=` <svg
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
        </svg>`;return e}function H(t){return M(t)?`<svg
            class="icon-white-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-white-heart"></use>
        </svg>`:`<svg
            class="icon-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-heart"></use>
        </svg>`}function $(t){return t?._id||t?.id}function K(t){p.innerHTML="",t.forEach(e=>{const n=document.createElement("div");n.className="recipe-card";const o=e.thumb||"https://via.placeholder.com/280x180?text=No+Image";n.style.backgroundImage=`linear-gradient(0.94deg, rgba(5, 5, 5, 0.6) 4.82%, rgba(5, 5, 5, 0.5) 18.72%), url(${o})`;const s=parseFloat(e.rating).toFixed(1);n.innerHTML=`
     <button id='favorite-button-${e._id}' class="favorite-btn">${H(e._id)}</button>
     
      <div class="recipe-card-bottom">
        <div class="recipe-card-desc">
            <h3>${e.title}</h3>
            <p>${e.description||""}</p>
        </div>
     
        <div class="recipe-card-button">
            <div class="stars">
                <div class="floatCount">
                ${s}
                </div>
                ${D(s)}
            </div>
            <button class="see-recipe-btn">See Recipe</button>
       </div>
      </div>
    `,n.querySelector(".favorite-btn").addEventListener("click",()=>{P(e)}),n.querySelector(".see-recipe-btn").addEventListener("click",()=>{const d=$(e);typeof window.openPopup=="function"?window.openPopup(d||e):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),p.appendChild(n)})}function P(t,e=!1){M(t._id)?u=u.filter(o=>o._id!==t._id):u.push(t);const n=document.getElementById(`favorite-button-${t._id}`);n&&(n.innerHTML=H(t._id)),!e&&R()}function Q(t,e){r.innerHTML="";const n=(o,s,d=!1,E=!1,S="")=>{const i=document.createElement("button");return i.innerHTML=o,i.className=S,E&&i.classList.add("active"),d&&i.classList.add("disabled"),i.disabled=d,i.addEventListener("click",()=>{d||c(s)}),i};r.appendChild(n(`<svg
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
        </svg>`,e-1,e===1,!1,"page-arrow-icon"));for(let o=1;o<=t;o++)if(o===1||o===t||Math.abs(e-o)<=1)r.appendChild(n(o,o,!1,e===o));else if(o===2&&e>3||o===t-1&&e<t-2){const s=document.createElement("span");s.textContent="...",s.classList.add("dots"),r.appendChild(s)}r.appendChild(n(`<svg
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
        </svg></span>`,t,e===t,!1,"page-arrow-icon"))}async function j(){try{const e=(await y.get(`${L}/recipes/popular`)).data,n=document.querySelector("#popular-list");n.innerHTML="",e.forEach(o=>{const s=document.createElement("li");s.classList.add("popular-card");const d=o.preview||o.thumb||"https://via.placeholder.com/100x70?text=No+Image",E=o.title||"Untitled",S=o.description||o.instructions||"No description available";s.className="popular-card",s.innerHTML=`
  <img src="${d}" alt="${E}" />
  <div class="popular-card-info">
    <h4 class="popular-card-title" >${E}</h4>
    <p class="popular-card-desc">${S}</p>
  </div>
`,s.addEventListener("click",()=>{const i=$(o);typeof window.openPopup=="function"?window.openPopup(i||o):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),n.appendChild(s)})}catch(t){console.error("Popüler tarifler alınamadı:",t)}}window.addEventListener("DOMContentLoaded",async()=>{O(),l=null,m="",h="",w="",C(),await G(),J(),await U(),await V(),await c(),await j()});
//# sourceMappingURL=index.js.map
