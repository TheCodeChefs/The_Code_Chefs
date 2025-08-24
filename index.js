import"./assets/popup_menu-CLelK5HP.js";import{S as N,a as y}from"./assets/vendor-C5cLWRW_.js";const _=document.querySelector(".order-now-button"),$=document.querySelector(".order-now"),F=document.querySelector(".order-now-close-button");new N(".swiper",{slidesPerView:"auto",loop:!0,pagination:{el:".swiper-pagination",clickable:!0}});_.addEventListener("click",()=>{$.classList.add("show-order-now")});F.addEventListener("click",()=>{$.classList.remove("show-order-now")});const E="https://tasty-treats-backend.p.goit.global/api",b=document.getElementById("category-list"),x=document.querySelector(".all-categories-button"),T=document.getElementById("search-input"),p=document.getElementById("recipe-grid"),M=document.getElementById("empty-recipe-grid"),R=document.getElementById("reset-button"),v=document.getElementById("time-select"),f=document.getElementById("area-select"),g=document.getElementById("ingredient-select"),a=document.getElementById("pagination");let d=null,S="",m="",h="",w="",i=1;const O=9;let l=[];function A(t){return l.some(e=>String(e._id)===String(t))}function V(){localStorage.setItem("favorites",JSON.stringify(l))}function B(){const t=localStorage.getItem("favorites");if(t)try{const e=JSON.parse(t);l=Array.isArray(e)?e:[]}catch{localStorage.removeItem("favorites"),l=[]}else l=[]}async function G(){try{const e=(await y.get(`${E}/categories`)).data;b.innerHTML="",e.forEach(n=>{const o=document.createElement("li"),s=document.createElement("button");s.textContent=n.name,s.classList.add("category-btn"),s.addEventListener("click",()=>{d=n.name,i=1,I(),c()}),o.appendChild(s),b.appendChild(o)})}catch(t){console.error("Kategori yüklenirken hata:",t)}}function I(){x.classList.remove("active"),b.querySelectorAll("li").forEach(t=>t.classList.remove("active")),d===null?x.classList.add("active"):b.querySelectorAll("li").forEach(t=>{t.querySelector("button").textContent===d&&t.classList.add("active")})}x.addEventListener("click",()=>{d=null,i=1,I(),c()});T.addEventListener("input",()=>{S=T.value.trim(),i=1,c()});R.addEventListener("click",()=>{d=null,S="",m="",h="",w="",T.value="",v.value="",f.value="",g.value="",i=1,I(),c()});v.addEventListener("change",()=>{m=v.value,i=1,c()});f.addEventListener("change",()=>{h=f.value,i=1,c()});g.addEventListener("change",()=>{w=g.value,i=1,c()});function J(){const t=[15,30,45,60,90,120];v.innerHTML='<option value="">All times</option>',t.forEach(e=>{const n=document.createElement("option");n.value=e,n.textContent=`${e} minutes`,v.appendChild(n)})}async function U(){try{const e=(await y.get(`${E}/areas`)).data;f.innerHTML='<option value="">All areas</option>',e.forEach(n=>{const o=document.createElement("option");o.value=n.name,o.textContent=n.name,f.appendChild(o)})}catch(t){console.error("Area options yüklenirken hata:",t)}}async function D(){try{const e=(await y.get(`${E}/ingredients`)).data;g.innerHTML='<option value="">All ingredients</option>',e.forEach(n=>{const o=document.createElement("option");o.value=n._id,o.textContent=n.name,g.appendChild(o)})}catch(t){console.error("Ingredient options yüklenirken hata:",t)}}async function c(t=1){i=t,p.innerHTML="Loading...";try{const e={page:i,limit:O};d&&(e.category=d),S&&(e.title=S),m&&(e.time=m),h&&(e.area=h),w&&(e.ingredient=w);const n=await y.get(`${E}/recipes`,{params:e}),o=n.data.results||[],s=n.data.totalPages||1;if(!o.length){p.innerHTML="",M.innerHTML=`<svg
        class="icon-empty-recipes"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 97 83"
        width="97"
        height="83"
      >
        <use href="../svg/symbol-defs.svg#icon-empty-recipes"></use>
        </svg>
        <p>No recipes found.</p>`,a.innerHTML="";return}M.innerHTML="",Q(o),H(),z(s,i)}catch(e){console.error("Tarifler yüklenirken hata:",e),p.innerHTML="<p>Error loading recipes.</p>",a.innerHTML=""}}function K(t){let e="";for(let n=0;n<5;n++)n<parseInt(t)?e+=` <svg
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
        </svg>`;return e}function C(t){return A(t)?`<svg
            class="icon-white-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-white-heart"></use>
        </svg>`:`<svg
            class="icon-heart"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-heart"></use>
        </svg>`}function P(t){const e=String(t),n=document.getElementById(`favorite-button-${e}`);n&&(n.innerHTML=C(e))}function H(){const t=document.querySelectorAll('.favorite-btn[id^="favorite-button-"]');t.length&&t.forEach(e=>{const n=e.id.replace("favorite-button-","");e.innerHTML=C(n)})}function q(t){return t?._id||t?.id}function Q(t){p.innerHTML="",t.forEach(e=>{const n=document.createElement("div");n.className="home-recipe-card";const o=e.thumb||"https://via.placeholder.com/280x180?text=No+Image";n.style.backgroundImage=`linear-gradient(0.94deg, rgba(5, 5, 5, 0.6) 4.82%, rgba(5, 5, 5, 0.5) 18.72%), url(${o})`;const s=parseFloat(e.rating).toFixed(1);n.innerHTML=`
     <button id='favorite-button-${e._id}' class="favorite-btn">${C(e._id)}</button>
     
      <div class="home-recipe-card-bottom">
        <div class="home-recipe-card-desc">
            <h3>${e.title}</h3>
            <p>${e.description||""}</p>
        </div>
     
        <div class="home-recipe-card-button">
            <div class="stars">
                <div class="floatCount">
                ${s}
                </div>
                ${K(s)}
            </div>
            <button class="see-recipe-btn">See Recipe</button>
       </div>
      </div>
    `,n.querySelector(".favorite-btn").addEventListener("click",()=>{j(e)}),n.querySelector(".see-recipe-btn").addEventListener("click",()=>{const u=q(e);typeof window.openPopup=="function"?window.openPopup(u||e):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),p.appendChild(n)})}function j(t,e=!1){A(t._id)?l=l.filter(o=>String(o._id)!==String(t._id)):l.push(t);const n=document.getElementById(`favorite-button-${t._id}`);n&&(n.innerHTML=C(t._id)),!e&&V(),window.dispatchEvent(new Event("favorites:updated")),document.dispatchEvent(new Event("favorites:updated"))}function z(t,e){a.innerHTML="";const n=(o,s,u=!1,L=!1,k="")=>{const r=document.createElement("button");return r.innerHTML=o,r.className=k,L&&r.classList.add("active"),u&&r.classList.add("disabled"),r.disabled=u,r.addEventListener("click",()=>{u||c(s)}),r};a.appendChild(n(`<svg
            class="icon-left-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1" transform="translate(20, 0)"></use>
        </svg>`,1,e===1,!1,"page-arrow-icon")),a.appendChild(n(`<svg
            class="icon-left-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-left-arrow-1"></use>
        </svg>`,e-1,e===1,!1,"page-arrow-icon"));for(let o=1;o<=t;o++)if(o===1||o===t||Math.abs(e-o)<=1)a.appendChild(n(o,o,!1,e===o));else if(o===2&&e>3||o===t-1&&e<t-2){const s=document.createElement("span");s.textContent="...",s.classList.add("dots"),a.appendChild(s)}a.appendChild(n(`<svg
            class="icon-right-arrow-1"
            viewBox="0 0 24 24"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1"></use>
        </svg>`,e+1,e===t,!1,"page-arrow-icon")),a.appendChild(n(`<span><svg
            class="icon-right-arrow-1 double"
            viewBox="0 0 48 48"
        >
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(-7, 0)"></use>
            <use href="../svg/symbol-defs.svg#icon-right-arrow-1" transform="translate(20, 0)"></use>
        </svg></span>`,t,e===t,!1,"page-arrow-icon"))}async function W(){try{const e=(await y.get(`${E}/recipes/popular`)).data,n=document.querySelector("#popular-list");n.innerHTML="",e.forEach(o=>{const s=document.createElement("li");s.classList.add("popular-card");const u=o.preview||o.thumb||"https://via.placeholder.com/100x70?text=No+Image",L=o.title||"Untitled",k=o.description||o.instructions||"No description available";s.className="popular-card",s.innerHTML=`
  <img src="${u}" alt="${L}" />
  <div class="popular-card-info">
    <h4 class="popular-card-title" >${L}</h4>
    <p class="popular-card-desc">${k}</p>
  </div>
`,s.addEventListener("click",()=>{const r=q(o);typeof window.openPopup=="function"?window.openPopup(r||o):console.error("⚠️ openPopup fonksiyonu tanımlı değil!")}),n.appendChild(s)})}catch(t){console.error("Popüler tarifler alınamadı:",t)}}window.addEventListener("favorites:sync",t=>{const e=t?.detail?.id;e&&(B(),P(e))});window.addEventListener("favorites:updated",()=>{B(),H()});window.addEventListener("storage",t=>{t.key==="favorites"&&(B(),H())});window.addEventListener("DOMContentLoaded",async()=>{B(),d=null,m="",h="",w="",I(),await G(),J(),await U(),await D(),await c(),await W()});
//# sourceMappingURL=index.js.map
