import { CONFIG } from './config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const settings = { ...CONFIG.defaultSettings };
let products = [];
let activeFilter = 'All';
let supabase = null;

const demoProducts = [
  {id:'demo-1',name:'Silk Style Saree',category:'Sarees',price:'Contact for price',description:'Elegant saree collection for functions and festive occasions.',image_url:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',featured:true},
  {id:'demo-2',name:'Women Readymade Collection',category:'Women',price:'New Arrival',description:'Comfortable and stylish women’s readymade collection.',image_url:'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=900&q=80',featured:true},
  {id:'demo-3',name:'Men Casual Shirt',category:'Men',price:'Contact for price',description:'Everyday men’s shirts with modern colours and patterns.',image_url:'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80',featured:true},
  {id:'demo-4',name:'Kids Party Wear',category:'Kids',price:'New Arrival',description:'Colourful and comfortable outfits for children.',image_url:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=900&q=80',featured:true}
];

function getClient(){
  if (!CONFIG.supabaseUrl || !CONFIG.supabaseAnonKey) return null;
  if (!supabase) supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  return supabase;
}

async function loadData(){
  const client = getClient();
  if (!client){ products = demoProducts; applySettings(); renderProducts(); renderGallery(); return; }
  try{
    const [{data:s},{data:p,error}] = await Promise.all([
      client.from('site_settings').select('*').eq('id',1).maybeSingle(),
      client.from('products').select('*').eq('active',true).order('sort_order',{ascending:true}).order('created_at',{ascending:false})
    ]);
    if (s) Object.assign(settings,s);
    products = error ? demoProducts : (p?.length ? p : demoProducts);
  }catch(e){ products = demoProducts; }
  applySettings(); renderProducts(); renderGallery();
}

function applySettings(){
  document.title = settings.business_name || 'Sonika Textiles';
  setText('brandName', settings.business_name?.replace(' & Readymades','') || 'Sonika Textiles');
  setText('footerName', settings.business_name);
  setText('heroTitle', settings.hero_title);
  setText('heroText', settings.hero_text);
  setText('announcement', settings.announcement);
  setText('addressText', settings.address);
  setText('gstText', settings.gstin);
  setText('year', new Date().getFullYear());
  const phone = document.getElementById('phoneLink'); phone.textContent=settings.phone; phone.href=`tel:${String(settings.phone).replace(/\s/g,'')}`;
  const email = document.getElementById('emailLink'); email.textContent=settings.email; email.href=`mailto:${settings.email}`;
  setLink('facebookLink', settings.facebook); setLink('instagramLink', settings.instagram); setLink('mapLink', settings.maps_url);
  document.getElementById('mapFrame').src = settings.maps_embed || '';
  const wa = `https://wa.me/${String(settings.whatsapp).replace(/\D/g,'')}?text=${encodeURIComponent('Hello Sonika Textiles, I would like to know about your collections.')}`;
  ['heroWhatsapp','floatWhatsapp'].forEach(id=>document.getElementById(id).href=wa);
}

function setText(id,value=''){const el=document.getElementById(id);if(el)el.textContent=value||''}
function setLink(id,url=''){const el=document.getElementById(id);if(!el)return;el.href=url||'#';el.style.display=url?'inline-flex':'none'}

function renderProducts(){
  const grid=document.getElementById('productGrid');
  const list=products.filter(p=>activeFilter==='All'||p.category===activeFilter);
  grid.innerHTML=list.map(p=>`<article class="product-card" data-id="${p.id}"><div class="product-img"><img src="${safe(p.image_url)}" alt="${safe(p.name)}" loading="lazy"></div><div class="product-body"><span class="badge">${safe(p.category)}</span><h3>${safe(p.name)}</h3><div class="price">${safe(p.price||'Contact for price')}</div></div></article>`).join('');
  document.getElementById('emptyProducts').classList.toggle('hidden',list.length>0);
  grid.querySelectorAll('.product-card').forEach(card=>card.addEventListener('click',()=>openProduct(card.dataset.id)));
}
function renderGallery(){
  const pics=products.filter(p=>p.image_url).slice(0,10);
  document.getElementById('galleryGrid').innerHTML=pics.map(p=>`<img src="${safe(p.image_url)}" alt="${safe(p.name)}" loading="lazy">`).join('');
}
function openProduct(id){
  const p=products.find(x=>String(x.id)===String(id)); if(!p)return;
  document.getElementById('dialogImage').src=p.image_url;
  setText('dialogCategory',p.category);setText('dialogName',p.name);setText('dialogPrice',p.price||'Contact for price');setText('dialogDescription',p.description||'Contact us for more details.');
  document.getElementById('dialogWhatsapp').href=`https://wa.me/${String(settings.whatsapp).replace(/\D/g,'')}?text=${encodeURIComponent(`Hello Sonika Textiles, I am interested in: ${p.name}`)}`;
  document.getElementById('productDialog').showModal();
}
function safe(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}

document.getElementById('menuBtn').addEventListener('click',()=>{const n=document.getElementById('mainNav');n.classList.toggle('open');document.getElementById('menuBtn').setAttribute('aria-expanded',n.classList.contains('open'))});
document.querySelectorAll('.main-nav a').forEach(a=>a.addEventListener('click',()=>document.getElementById('mainNav').classList.remove('open')));
document.getElementById('filters').addEventListener('click',e=>{if(!e.target.matches('.chip'))return;document.querySelectorAll('.chip').forEach(b=>b.classList.remove('active'));e.target.classList.add('active');activeFilter=e.target.dataset.filter;renderProducts()});
document.querySelectorAll('.category-card').forEach(b=>b.addEventListener('click',()=>{activeFilter=b.dataset.filter;document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.filter===activeFilter));renderProducts();document.getElementById('products').scrollIntoView()}));
document.getElementById('dialogClose').addEventListener('click',()=>document.getElementById('productDialog').close());
loadData();
