import { CONFIG } from './config.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const configured = Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);
const supabase = configured ? createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey) : null;
const $ = id => document.getElementById(id);

if(!configured){$('setupNote').classList.remove('hidden');$('loginBtn').disabled=true;$('loginStatus').textContent='Complete the Supabase setup first. See README_TAMIL.txt.'}

async function boot(){if(!supabase)return; const {data:{session}}=await supabase.auth.getSession(); toggle(Boolean(session)); if(session){await loadSettings();await loadProducts();}}
function toggle(logged){$('loginPanel').classList.toggle('hidden',logged);$('adminPanel').classList.toggle('hidden',!logged)}

$('loginBtn').addEventListener('click',async()=>{
  $('loginStatus').textContent='Logging in...';
  const {error}=await supabase.auth.signInWithPassword({email:$('loginEmail').value.trim(),password:$('loginPassword').value});
  if(error){$('loginStatus').textContent=error.message;return}
  $('loginStatus').textContent='';toggle(true);await loadSettings();await loadProducts();
});
$('logoutBtn').addEventListener('click',async()=>{await supabase.auth.signOut();toggle(false)});

$('pImage').addEventListener('change',()=>{const f=$('pImage').files[0];if(!f)return;$('pPreview').src=URL.createObjectURL(f);$('pPreview').style.display='block'});

$('productForm').addEventListener('submit',async e=>{
  e.preventDefault();const f=$('pImage').files[0];if(!f)return;
  if(f.size>5*1024*1024){$('productStatus').textContent='Photo must be below 5MB.';return}
  $('productStatus').textContent='Uploading photo...';
  const ext=(f.name.split('.').pop()||'jpg').toLowerCase();const path=`products/${crypto.randomUUID()}.${ext}`;
  const {error:uploadError}=await supabase.storage.from('product-images').upload(path,f,{cacheControl:'3600',upsert:false});
  if(uploadError){$('productStatus').textContent=uploadError.message;return}
  const {data:pub}=supabase.storage.from('product-images').getPublicUrl(path);
  const payload={name:$('pName').value.trim(),category:$('pCategory').value,price:$('pPrice').value.trim(),description:$('pDescription').value.trim(),image_url:pub.publicUrl,storage_path:path,featured:$('pFeatured').checked,active:$('pActive').checked,sort_order:Number($('pSort').value||0)};
  const {error}=await supabase.from('products').insert(payload);
  if(error){$('productStatus').textContent=error.message;return}
  e.target.reset();$('pPreview').style.display='none';$('pFeatured').checked=true;$('pActive').checked=true;$('productStatus').textContent='Product added successfully.';await loadProducts();
});

async function loadProducts(){
  const {data,error}=await supabase.from('products').select('*').order('created_at',{ascending:false});
  if(error)return;
  $('adminProducts').innerHTML=(data||[]).map(p=>`<article class="admin-product"><img src="${esc(p.image_url)}" alt=""><div class="admin-product-body"><span class="badge">${esc(p.category)}</span><h3>${esc(p.name)}</h3><p>${esc(p.price||'')}</p><div class="admin-actions"><button class="btn outline toggle-btn" data-id="${p.id}" data-active="${p.active}">${p.active?'Hide':'Show'}</button><button class="btn danger delete-btn" data-id="${p.id}" data-path="${esc(p.storage_path||'')}">Delete</button></div></div></article>`).join('');
  document.querySelectorAll('.toggle-btn').forEach(b=>b.addEventListener('click',async()=>{await supabase.from('products').update({active:b.dataset.active!=='true'}).eq('id',b.dataset.id);await loadProducts()}));
  document.querySelectorAll('.delete-btn').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Delete this product?'))return;if(b.dataset.path)await supabase.storage.from('product-images').remove([b.dataset.path]);await supabase.from('products').delete().eq('id',b.dataset.id);await loadProducts()}));
}

async function loadSettings(){
  const {data}=await supabase.from('site_settings').select('*').eq('id',1).maybeSingle(); const s={...CONFIG.defaultSettings,...(data||{})};
  $('sBusiness').value=s.business_name||'';$('sTagline').value=s.tagline||'';$('sPhone').value=s.phone||'';$('sWhatsapp').value=s.whatsapp||'';$('sEmail').value=s.email||'';$('sGstin').value=s.gstin||'';$('sAddress').value=s.address||'';$('sFacebook').value=s.facebook||'';$('sInstagram').value=s.instagram||'';$('sMapsUrl').value=s.maps_url||'';$('sMapsEmbed').value=s.maps_embed||'';$('sAnnouncement').value=s.announcement||'';$('sHeroTitle').value=s.hero_title||'';$('sHeroText').value=s.hero_text||'';
}

$('settingsForm').addEventListener('submit',async e=>{
  e.preventDefault();$('settingsStatus').textContent='Saving...';
  const payload={id:1,business_name:$('sBusiness').value.trim(),tagline:$('sTagline').value.trim(),phone:$('sPhone').value.trim(),whatsapp:$('sWhatsapp').value.trim(),email:$('sEmail').value.trim(),gstin:$('sGstin').value.trim(),address:$('sAddress').value.trim(),facebook:$('sFacebook').value.trim(),instagram:$('sInstagram').value.trim(),maps_url:$('sMapsUrl').value.trim(),maps_embed:$('sMapsEmbed').value.trim(),announcement:$('sAnnouncement').value.trim(),hero_title:$('sHeroTitle').value.trim(),hero_text:$('sHeroText').value.trim(),updated_at:new Date().toISOString()};
  const {error}=await supabase.from('site_settings').upsert(payload);$('settingsStatus').textContent=error?error.message:'Website settings saved successfully.';
});
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
boot();
