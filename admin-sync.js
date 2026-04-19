// Urjaa Admin Sync — fetches latest admin state from Supabase and applies to the page.
// Included on every public page. Always fetches fresh data (cache-busted) so website
// reflects the most recent admin panel edits.
(function(){
  var KEY = 'urjaa_admin_state';
  var SB_URL = 'https://iqikqkprswelbthkuglg.supabase.co';
  var SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlxaWtxa3Byc3dlbGJ0aGt1Z2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NTY4MTcsImV4cCI6MjA5MjEzMjgxN30.7htC_YhKzhq3U-YTnsqlpYdJOX2w22AYy3W6iGFSPrM';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function imgOf(state, id){
    if(!state.images) return '';
    var m = state.images.find(function(x){return x.id===id;});
    return m ? m.src : '';
  }
  function listAt(selector){ return document.querySelector(selector); }

  // ── Images ────────────────────────────────────────────────────────────────
  function applyImages(s){
    if(!s.images) return;
    s.images.forEach(function(img){
      document.querySelectorAll('img[data-img-id="'+img.id+'"]').forEach(function(el){
        el.src = img.src;
      });
      if (img.id === 'founders') {
        document.querySelectorAll('img[alt*="Founders"], img[alt*="Jayashree"]').forEach(function(el){ el.src = img.src; });
      }
      if (img.id === 'hero-bg') {
        document.querySelectorAll('img[alt*="Mother and toddler"]').forEach(function(el){ el.src = img.src; });
      }
    });
  }

  // ── Section visibility ────────────────────────────────────────────────────
  function applySections(s){
    if(!s.sections) return;
    Object.keys(s.sections).forEach(function(key){
      var el = document.querySelector('[data-section="' + key + '"]');
      if (!el) return;
      el.style.display = s.sections[key].visible ? '' : 'none';
    });
  }

  // ── Pillars (home) ────────────────────────────────────────────────────────
  function applyPillars(s){
    if(!s.pillars || !s.pillars.length) return;
    var container = listAt('[data-sync-list="pillars"]');
    if (!container) {
      var anchor = document.querySelector('.pillar-love');
      if (anchor) container = anchor.parentElement;
    }
    if (!container) return;
    container.innerHTML = s.pillars.map(function(p,i){
      return '<div class="glass-card rounded-2xl p-7 soft-card border-b-4 border-secondary/30'+(i===0?' sm:col-span-2 lg:col-span-1':'')+'">'+
        '<div class="flex items-center gap-3 mb-3">'+
          '<span class="text-3xl">'+esc(p.emoji)+'</span>'+
          '<h3 class="serif-text text-2xl font-bold text-secondary">'+esc(p.title)+'</h3>'+
        '</div>'+
        '<p class="text-sm text-on-secondary-container font-medium mb-4 italic">&ldquo;'+esc(p.quote)+'&rdquo;</p>'+
        '<div class="bg-white/50 px-4 py-2 rounded-xl"><p class="text-xs font-bold text-secondary">'+esc(p.focus)+'</p></div>'+
      '</div>';
    }).join('');
  }

  // ── Philosophy Cards (home) ───────────────────────────────────────────────
  function applyPhilCards(s){
    if(!s.philCards || !s.philCards.length) return;
    var container = listAt('[data-sync-list="philCards"]');
    if(!container) return;
    container.innerHTML = s.philCards.map(function(c){
      return '<div class="flex gap-4 items-start glass-card rounded-2xl p-4">'+
        '<span class="material-symbols-outlined text-primary text-3xl shrink-0 bg-primary-container/30 p-2 rounded-xl">'+esc(c.icon||'psychology')+'</span>'+
        '<div>'+
          '<h4 class="font-bold text-on-surface text-base mb-1">'+esc(c.title)+'</h4>'+
          '<p>'+esc(c.desc)+'</p>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  // ── Brain-Boosting Programs (index/programs) ──────────────────────────────
  function applyBubbles(s){
    if(!s.bubbles || !s.bubbles.length) return;
    var container = listAt('[data-sync-list="bubbles"]');
    if(!container) return;
    container.innerHTML = s.bubbles.map(function(b){
      var src = imgOf(s, b.img) || '';
      return '<div class="glass-card program-bubble soft-card border border-primary-container/20">'+
        '<div style="width:130px;height:130px;min-width:130px;min-height:130px;border-radius:50%;overflow:hidden;margin-bottom:1.5rem;flex-shrink:0;box-shadow:0 4px 20px rgba(124,97,0,0.15)">'+
          '<img alt="'+esc(b.title)+'" style="width:130px;height:130px;object-fit:cover;display:block" src="'+esc(src)+'"/>'+
        '</div>'+
        '<h3 class="font-[\'Noto_Serif\'] text-xl font-bold mb-3">'+esc(b.title)+'</h3>'+
        '<p class="text-on-surface-variant text-sm mb-5">'+esc(b.desc)+'</p>'+
      '</div>';
    }).join('');
  }

  // ── Montessori Activities (index/programs) ────────────────────────────────
  function applyMontessori(s){
    if(!s.montessori || !s.montessori.length) return;
    var container = listAt('[data-sync-list="montessori"]');
    if(!container) return;
    container.innerHTML = s.montessori.map(function(m,i){
      var src = imgOf(s, m.img) || '';
      var reverse = i % 2 === 1;
      var imgBlock = '<div class="w-full md:w-1/2 flex justify-center">'+
          '<div class="relative group">'+
            '<div style="position:absolute;inset:-16px;background:rgba(124,97,0,0.08);border-radius:40% 60% 70% 30%/40% 50% 60% 50%;filter:blur(20px)"></div>'+
            '<img alt="'+esc(m.title)+'" style="width:100%;max-width:360px;height:320px;object-fit:cover;border-radius:40% 60% 70% 30%/40% 50% 60% 50%;box-shadow:0 20px 60px rgba(0,0,0,0.12);display:block;position:relative;z-index:1" src="'+esc(src)+'"/>'+
          '</div>'+
        '</div>';
      var textBlock = '<div class="w-full md:w-1/2 text-center md:text-left">'+
          '<h3 class="font-[\'Noto_Serif\'] text-3xl font-bold mb-4">'+esc(m.title)+'</h3>'+
          '<p class="text-on-surface-variant text-base mb-6 leading-relaxed">'+esc(m.desc)+'</p>'+
        '</div>';
      return '<div class="flex flex-col '+(reverse?'md:flex-row-reverse':'md:flex-row')+' items-center gap-10 lg:gap-16">'+imgBlock+textBlock+'</div>';
    }).join('');
  }

  // ── DIY Activities (index/programs) ───────────────────────────────────────
  function applyDIY(s){
    if(!s.diy || !s.diy.length) return;
    var container = listAt('[data-sync-list="diy"]');
    if(!container) return;
    var borders = ['#fccc38','#a74632','#ff9734'];
    container.innerHTML = s.diy.map(function(d,i){
      var src = imgOf(s, d.img) || '';
      var border = borders[i % borders.length];
      return '<div class="glass-card rounded-2xl p-5 soft-card" style="border:3px solid '+border+'">'+
        '<div style="width:100%;height:180px;border-radius:1rem;overflow:hidden;margin-bottom:1.25rem">'+
          '<img alt="'+esc(d.title)+'" style="width:100%;height:180px;object-fit:cover;display:block" src="'+esc(src)+'"/>'+
        '</div>'+
        '<h3 class="font-[\'Noto_Serif\'] text-xl font-bold mb-3 text-primary">'+esc(d.title)+'</h3>'+
        '<p class="text-on-surface-variant text-sm mb-6">'+esc(d.desc)+'</p>'+
      '</div>';
    }).join('');
  }

  // ── Workshops (index/community) ───────────────────────────────────────────
  function applyWorkshops(s){
    if(!s.workshops) return;
    var wsContainer = listAt('[data-sync-list="workshops"]') || (document.getElementById('workshops') && document.querySelector('#workshops .space-y-5'));
    if(!wsContainer) return;
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    wsContainer.innerHTML = s.workshops.map(function(w){
      var d = new Date(w.date);
      var mon = isNaN(d) ? 'TBD' : months[d.getMonth()];
      var day = isNaN(d) ? '??' : d.getDate();
      var badgeStyle = w.badge === 'Limited Spots' ? 'background:rgba(167,70,50,0.12);color:#a74632' :
                      w.badge === 'Online Only' ? 'background:rgba(124,97,0,0.08);color:#7c6100' :
                      'background:rgba(167,70,50,0.12);color:#a74632';
      return '<div class="glass-card flex flex-col md:flex-row items-center p-5 rounded-2xl gap-6 soft-card">'+
        '<div class="bg-primary-container text-on-primary-container p-5 rounded-xl text-center min-w-[100px]">'+
          '<span class="block text-xs font-bold uppercase tracking-widest">'+mon+'</span>'+
          '<span class="block text-3xl font-black">'+day+'</span>'+
        '</div>'+
        '<div class="flex-1">'+
          '<h4 class="font-[\'Noto_Serif\'] text-lg font-bold mb-1">'+esc(w.title)+'</h4>'+
          '<p class="text-on-surface-variant text-sm">'+esc(w.desc)+'</p>'+
        '</div>'+
        '<div class="flex items-center gap-3 flex-wrap justify-center md:justify-end">'+
          '<span class="text-xs font-medium px-4 py-1 rounded-full" style="'+badgeStyle+'">'+esc(w.badge||'')+'</span>'+
          '<button onclick="(window.openJoinPopup&&window.openJoinPopup())" class="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm">Register</button>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  // ── Chat Rooms (community) ────────────────────────────────────────────────
  function applyChatRooms(s){
    if(!s.chatRooms || !s.chatRooms.length) return;
    var container = document.getElementById('room-list') || listAt('[data-sync-list="chatRooms"]');
    if(!container) return;
    container.innerHTML = s.chatRooms.map(function(r){
      return '<button class="room-btn glass-card rounded-2xl p-3 text-left w-full">'+
        '<div class="flex items-center gap-3">'+
          '<div class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style="background:rgba(124,97,0,0.08)">'+
            '<span class="material-symbols-outlined room-icon" style="font-size:18px;color:#7c6100">'+esc(r.icon||'chat')+'</span>'+
          '</div>'+
          '<div class="flex-1 min-w-0">'+
            '<p class="room-label text-sm font-bold truncate" style="color:#383833">'+esc(r.label)+'</p>'+
            '<p class="text-xs truncate" style="color:#65655f">'+esc(r.members||0)+' members</p>'+
          '</div>'+
        '</div>'+
      '</button>';
    }).join('');
  }

  // ── Gallery (community) ───────────────────────────────────────────────────
  function applyGallery(s){
    if(!s.gallery || !s.gallery.length) return;
    var container = listAt('[data-sync-list="gallery"]');
    if(!container) return;
    var rotations = ['-2deg','1deg','3deg','-1deg','2deg','-3deg'];
    container.innerHTML = s.gallery.map(function(g,i){
      var src = imgOf(s, g.img) || '';
      return '<div class="af flex justify-center">'+
        '<div class="scrapbook w-full max-w-xs" style="transform:rotate('+rotations[i%rotations.length]+')">'+
          '<img alt="'+esc(g.label)+'" style="width:100%;height:200px;object-fit:cover;display:block;border-radius:2px" src="'+esc(src)+'"/>'+
          '<p class="mt-3 text-center font-[\'Noto_Serif\'] italic text-sm text-on-surface-variant">'+esc(g.label)+'</p>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  // ── Sanskrit Wisdom (toolkit area on index) ───────────────────────────────
  function applyWisdom(s){
    if(!s.wisdom || !s.wisdom.length) return;
    var container = listAt('[data-sync-list="wisdom"]');
    if(!container) return;
    container.innerHTML = s.wisdom.map(function(w){
      return '<div class="glass-card rounded-2xl p-6 soft-card">'+
        '<h3 class="font-[\'Noto_Serif\'] text-xl font-bold mb-2 text-primary">'+esc(w.title)+'</h3>'+
        '<p class="text-on-surface-variant text-sm leading-relaxed">'+esc(w.desc)+'</p>'+
      '</div>';
    }).join('');
  }

  // ── PDF Guides (toolkit) ──────────────────────────────────────────────────
  function applyPdfGuides(s){
    if(!s.pdfGuides || !s.pdfGuides.length) return;
    var container = listAt('[data-sync-list="pdfGuides"]');
    if(!container) return;
    container.innerHTML = s.pdfGuides.map(function(p){
      var src = imgOf(s, p.img) || '';
      return '<div class="pdf-card group cursor-pointer soft-card rounded-2xl overflow-hidden">'+
        '<div style="aspect-ratio:3/4;min-height:200px;position:relative;overflow:hidden">'+
          '<img alt="'+esc(p.title)+'" style="width:100%;height:100%;object-fit:cover;display:block;transition:transform 0.5s ease" src="'+esc(src)+'"/>'+
        '</div>'+
        '<div class="p-3">'+
          '<h4 class="font-bold text-sm group-hover:text-primary transition-colors">'+esc(p.title)+'</h4>'+
          '<p class="text-xs text-on-surface-variant mt-0.5">'+esc(p.age||'')+' &middot; PDF Guide</p>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  // ── Articles (toolkit) ────────────────────────────────────────────────────
  function applyArticles(s){
    if(!s.articles || !s.articles.length) return;
    var container = listAt('[data-sync-list="articles"]');
    if(!container) return;
    container.innerHTML = s.articles.map(function(a){
      var src = imgOf(s, a.img) || '';
      return '<article class="flex flex-col sm:flex-row gap-6 items-start glass-card p-5 rounded-2xl soft-card">'+
        '<div style="width:160px;height:160px;min-width:160px;border-radius:1rem;overflow:hidden;flex-shrink:0;box-shadow:0 4px 16px rgba(0,0,0,0.08)">'+
          '<img alt="'+esc(a.title)+'" style="width:100%;height:100%;object-fit:cover;display:block" src="'+esc(src)+'"/>'+
        '</div>'+
        '<div>'+
          '<div class="flex items-center gap-3 mb-2">'+
            '<span class="text-secondary font-black text-xs uppercase tracking-widest">'+esc(a.cat||'')+'</span>'+
          '</div>'+
          '<h3 class="font-[\'Noto_Serif\'] text-lg font-bold text-on-surface mb-2">'+esc(a.title)+'</h3>'+
        '</div>'+
      '</article>';
    }).join('');
  }

  function apply(s){
    if (!s) return;
    try { applyImages(s); } catch(e) { console.error(e); }
    try { applySections(s); } catch(e) { console.error(e); }
    try { applyPillars(s); } catch(e) { console.error(e); }
    try { applyPhilCards(s); } catch(e) { console.error(e); }
    try { applyBubbles(s); } catch(e) { console.error(e); }
    try { applyMontessori(s); } catch(e) { console.error(e); }
    try { applyDIY(s); } catch(e) { console.error(e); }
    try { applyWorkshops(s); } catch(e) { console.error(e); }
    try { applyChatRooms(s); } catch(e) { console.error(e); }
    try { applyGallery(s); } catch(e) { console.error(e); }
    try { applyWisdom(s); } catch(e) { console.error(e); }
    try { applyPdfGuides(s); } catch(e) { console.error(e); }
    try { applyArticles(s); } catch(e) { console.error(e); }
  }

  function run(){
    // 1) Fast paint from localStorage (may be stale on other devices, but smooth UX)
    try {
      var cached = localStorage.getItem(KEY);
      if (cached) apply(JSON.parse(cached));
    } catch(e) {}

    // 2) Always fetch fresh from Supabase with cache-busting, then apply again
    var url = SB_URL + '/rest/v1/site_settings?id=eq.admin_state&select=data&_=' + Date.now();
    fetch(url, {
      cache: 'no-store',
      headers: {
        apikey: SB_KEY,
        Authorization: 'Bearer ' + SB_KEY,
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    })
      .then(function(r){ return r.ok ? r.json() : []; })
      .then(function(rows){
        if (rows && rows[0] && rows[0].data) {
          try { localStorage.setItem(KEY, JSON.stringify(rows[0].data)); } catch(e) {}
          apply(rows[0].data);
        }
      })
      .catch(function(){});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
