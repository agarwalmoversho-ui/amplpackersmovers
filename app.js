document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const openBtns = document.querySelectorAll('[data-drawer-open]');
  const closeEls = document.querySelectorAll('[data-drawer-close]');
  const overlay = document.querySelector('.drawer-overlay');
  const drawer = document.querySelector('.drawer');
  function openDrawer(){ body.classList.add('drawer-open'); openBtns.forEach(b=>b.setAttribute('aria-expanded','true')); drawer?.setAttribute('aria-hidden','false'); }
  function closeDrawer(){ body.classList.remove('drawer-open'); openBtns.forEach(b=>b.setAttribute('aria-expanded','false')); drawer?.setAttribute('aria-hidden','true'); }
  openBtns.forEach(btn=>btn.addEventListener('click',openDrawer));
  closeEls.forEach(el=>el.addEventListener('click',closeDrawer));
  overlay?.addEventListener('click',closeDrawer);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('[data-nav]').forEach(a=>{if(a.getAttribute('href')===current)a.classList.add('active')});
  const cfg = window.AGARWAL_FORM_CONFIG || {};
  const isPlaceholder = endpoint => !endpoint || endpoint.includes('REPLACE_');
  document.querySelectorAll('form[data-live-form]').forEach(form=>{
    form.addEventListener('submit', async e=>{
      e.preventDefault(); const type=form.dataset.liveForm; const endpoint=type==='quote'?cfg.quoteEndpoint:cfg.contactEndpoint;
      const msg=form.querySelector('[data-form-message]'); const button=form.querySelector('button[type="submit"],button:not([type])');
      if(msg){msg.classList.remove('hidden','text-green-700','text-red-700');msg.classList.add('text-slate-700');msg.setAttribute('role','status');msg.textContent='';}
      if(isPlaceholder(endpoint)){if(msg){msg.classList.remove('hidden');msg.classList.add('text-red-700');msg.textContent='Form is not connected yet. Configure the Formspree endpoint in assets/form-config.js before publishing.';}return;}
      if(button){button.disabled=true;button.dataset.originalText=button.textContent;button.textContent='Sending…';}
      try{
        const payload=Object.fromEntries(new FormData(form).entries()); payload._subject=type==='quote'?'New moving quote request':'New website contact enquiry'; payload.form_type=type; payload.page_url=location.href;
        const response=await fetch(endpoint,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify(payload)});
        if(!response.ok)throw new Error('Submission failed');
        if(msg){msg.classList.remove('hidden','text-slate-700');msg.classList.add('text-green-700');msg.textContent=type==='quote'?'Quote request sent successfully! We will contact you soon.':'Enquiry sent successfully! We will get back to you soon.';} form.reset();
      }catch(err){if(msg){msg.classList.remove('hidden','text-slate-700');msg.classList.add('text-red-700');msg.textContent='Submission failed. Please retry or call 9300 300 300.';}}
      finally{if(button){button.disabled=false;button.textContent=button.dataset.originalText||'Submit';}}
    });
  });
  const citySearch=document.querySelector('[data-city-search]'); citySearch?.addEventListener('input',()=>{const q=citySearch.value.toLowerCase();document.querySelectorAll('[data-city]').forEach(city=>city.classList.toggle('hidden',!city.textContent.toLowerCase().includes(q)))});
});
