(function(){
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

  function applyImages(s){
    if(!s.images) return;
    s.images.forEach(function(img){
      if(!img.src || img.src.indexOf('data:') === 0) return;
      document.querySelectorAll('img[data-img-id="'+img.id+'"]').forEach(function(el){
        el.src = img.src;
        el.style.opacity = '1';
      });
      if (img.id === 'founders') {
        document.querySelectorAll('img[alt*="Founders"], img[alt*="Jayashree"]').forEach(function(el){ el.src = img.src; });
      }
      if (img.id === 'hero-bg') {
        document.querySelectorAll('img[alt*="Mother and toddler"]').forEach(function(el){ el.src = img.src; });
      }
    });
  }

  function applySections(s){
    if(!s.sections) return;
    Object.keys(s.sections).forEach(function(key){
      var el = document.querySelector('[data-section="' + key + '"]');
      if (!el) return;
      el.style.display = s.sections[key].visible ? '' : 'none';
    });
  }

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

  function applyWorkshops(s){
    if(!s.workshops) return;
    var wsContainer = listAt('[data-sync-list="workshops"]') || (document.getElementById('workshops') && document.querySelector('#workshops .space-y-5'));
    if(!wsContainer) return;
    if(!s.workshops.length){
      wsContainer.innerHTML = '<div class="text-center py-10 text-on-surface-variant text-sm">No upcoming workshops. Check back soon!</div>';
      return;
    }
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

  function applyGallery(s){
    if(!s.gallery || !s.gallery.length) return;
    var container = listAt('[data-sync-list="gallery"]');
    if(!container) return;
    var hasAnySrc = s.gallery.some(function(g){ return !!imgOf(s, g.img); });
    if(!hasAnySrc && container.children.length > 0) return;
    var rotations = ['-2deg','1deg','3deg','-1deg','2deg','-3deg'];
    container.innerHTML = s.gallery.map(function(g,i){
      var src = imgOf(s, g.img) || '';
      if(!src) return '';
      return '<div class="af flex justify-center">'+
        '<div class="scrapbook w-full max-w-xs" style="transform:rotate('+rotations[i%rotations.length]+')">'+
          '<img alt="'+esc(g.label)+'" style="width:100%;height:200px;object-fit:cover;display:block;border-radius:2px" src="'+esc(src)+'"/>'+
          '<p class="mt-3 text-center font-[\'Noto_Serif\'] italic text-sm text-on-surface-variant">'+esc(g.label)+'</p>'+
        '</div>'+
      '</div>';
    }).join('');
  }

  function applyTestimonials(s){
    if(!s.testimonials || !s.testimonials.length) return;
    var container = listAt('[data-sync-list="testimonials"]');
    if(!container) return;
    var list = s.testimonials;
    var accentColors = ['#7c6100','#a74632','#5a8a5e','#c07820','#4a7ab5'];
    function makeCard(t, ci){
      var initials = t.initials || (t.name ? t.name.split(/\s+/).map(function(p){return p.charAt(0);}).join('').slice(0,2).toUpperCase() : '??');
      var color = t.color || accentColors[ci % accentColors.length];
      var quote = t.quote || '';
      var short = quote.length > 140 ? quote.slice(0,137)+'…' : quote;
      return '<div style="'+
        'background:rgba(255,255,255,0.88);'+
        'backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);'+
        'border-radius:1.5rem;'+
        'padding:22px 24px 20px;'+
        'min-width:280px;max-width:300px;'+
        'box-shadow:0 6px 28px rgba(124,97,0,0.09);'+
        'border:1.5px solid rgba(255,255,255,0.9);'+
        'flex-shrink:0;'+
        'border-top:3px solid '+color+';'+
        'display:flex;flex-direction:column;gap:14px'+
      '">'+
        '<p style="font-size:13px;line-height:1.7;color:#383833;margin:0;font-style:italic;">&ldquo;'+esc(short)+'&rdquo;</p>'+
        '<div style="display:flex;align-items:center;gap:10px;margin-top:auto">'+
          '<div style="width:40px;height:40px;border-radius:50%;background:'+esc(color)+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;letter-spacing:0.5px">'+esc(initials)+'</div>'+
          '<div>'+
            '<div style="font-size:13px;font-weight:700;color:#383833;line-height:1.2">'+esc(t.name)+'</div>'+
            '<div style="font-size:11px;color:#65655f;margin-top:2px">'+esc(t.role||'')+(t.location?' &middot; '+esc(t.location):'')+'</div>'+
          '</div>'+
        '</div>'+
      '</div>';
    }
    var cardsHTML = list.map(makeCard).join('');
    /* Duplicate for seamless infinite loop (translateX -50% = one full set width) */
    container.innerHTML = cardsHTML + cardsHTML;
    container.style.animation = 'testimonialScroll 32s linear infinite';
  }

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

  function applyTexts(s){
    if (!s.texts) return;
    Object.keys(s.texts).forEach(function(key){
      var val = s.texts[key];
      if (val == null) return;
      document.querySelectorAll('[data-text-key="'+key+'"]').forEach(function(el){
        var tag = el.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA') {
          if (el.value !== val) el.value = val;
        } else {
          var current = (el.textContent || '').trim();
          var next = String(val == null ? '' : val).trim();
          if (current !== next) el.textContent = val;
        }
      });
      document.querySelectorAll('[data-text-key-attr^="'+key+':"]').forEach(function(el){
        var spec = el.getAttribute('data-text-key-attr');
        if (!spec) return;
        var parts = spec.split(':');
        if (parts[0] !== key) return;
        var attr = parts[1];
        if (attr) el.setAttribute(attr, val);
      });
    });
  }

  function applyColors(s){
    if (!s.texts) return;
    var map = {
      color_primary: '--md-sys-color-primary',
      color_secondary: '--md-sys-color-secondary',
      color_gold: '--md-sys-color-tertiary',
      color_bg: '--md-sys-color-background'
    };
    var root = document.documentElement;
    Object.keys(map).forEach(function(k){
      var v = s.texts[k];
      if (v) root.style.setProperty(map[k], v);
    });
  }

  function applyLevelPrograms(s){
    if (!s.levelPrograms) return;
    if (window.__urjaaApplyLevelPrograms) {
      window.__urjaaApplyLevelPrograms(s.levelPrograms);
    }
  }

  function apply(s){
    if (!s) return;
    try { applyTexts(s); } catch(e) { console.error(e); }
    try { applyColors(s); } catch(e) { console.error(e); }
    try { applySections(s); } catch(e) { console.error(e); }
    try { applyPillars(s); } catch(e) { console.error(e); }
    try { applyPhilCards(s); } catch(e) { console.error(e); }
    try { applyBubbles(s); } catch(e) { console.error(e); }
    try { applyMontessori(s); } catch(e) { console.error(e); }
    try { applyDIY(s); } catch(e) { console.error(e); }
    try { applyWorkshops(s); } catch(e) { console.error(e); }
    try { applyChatRooms(s); } catch(e) { console.error(e); }
    try { applyGallery(s); } catch(e) { console.error(e); }
    try { applyTestimonials(s); } catch(e) { console.error(e); }
    try { applyWisdom(s); } catch(e) { console.error(e); }
    try { applyImages(s); } catch(e) { console.error(e); }
    try { applyLevelPrograms(s); } catch(e) { console.error(e); }
  }

  function fetchAndApply() {
    var url = SB_URL + '/rest/v1/site_settings?id=eq.admin_state&select=data';
    return fetch(url, {
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
          apply(rows[0].data);
        }
      })
      .catch(function(){});
  }

  function connectRealtime() {
    var wsUrl = SB_URL.replace(/^http/, 'ws') + '/realtime/v1/websocket?apikey=' + SB_KEY + '&vsn=1.0.0';
    var ws = new WebSocket(wsUrl);
    var heartbeatRef = 0;
    var heartbeatInterval = null;
    var ref = 0;

    function send(msg) {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(msg));
      }
    }

    ws.onopen = function() {
      ref++;
      send({
        topic: 'realtime:public:site_settings',
        event: 'phx_join',
        payload: {
          config: {
            broadcast: { self: false },
            presence: { key: '' },
            postgres_changes: [
              { event: '*', schema: 'public', table: 'site_settings', filter: 'id=eq.admin_state' }
            ]
          }
        },
        ref: String(ref)
      });

      heartbeatInterval = setInterval(function() {
        heartbeatRef++;
        send({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(heartbeatRef) });
      }, 30000);
    };

    ws.onmessage = function(evt) {
      try {
        var msg = JSON.parse(evt.data);
        if (msg.event === 'postgres_changes') {
          var payload = msg.payload;
          if (payload && payload.data && payload.data.record && payload.data.record.data) {
            apply(payload.data.record.data);
          } else {
            fetchAndApply();
          }
        }
      } catch(e) {}
    };

    ws.onclose = function() {
      clearInterval(heartbeatInterval);
      setTimeout(connectRealtime, 3000);
    };

    ws.onerror = function() {
      ws.close();
    };
  }

  function run(){
    fetchAndApply().then(function() {
      connectRealtime();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
