<script>
  // topbar currency toggle — clicking jumps straight into the matching pricing plans
  var preferredCurrency = null;
  function setCurrency(cur){
    document.getElementById('curNGN').classList.toggle('active', cur==='NGN');
    document.getElementById('curUSD').classList.toggle('active', cur==='USD');
    preferredCurrency = cur;
    openPricing();
  }

  // feature accordion (smooth height animation)
  function toggleFeat(btn){
    var item = btn.closest('.feat-item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.feat-item').forEach(function(fi){
      fi.classList.remove('open');
      fi.querySelector('.feat-body-wrap').style.maxHeight = null;
    });
    if(!wasOpen){
      item.classList.add('open');
      var wrap = item.querySelector('.feat-body-wrap');
      wrap.style.maxHeight = wrap.scrollHeight + 'px';
    }
  }
  window.addEventListener('load', function(){
    var firstOpen = document.querySelector('.feat-item.open .feat-body-wrap');
    if(firstOpen) firstOpen.style.maxHeight = firstOpen.scrollHeight + 'px';
  });

  // pricing modal
  function openPricing(){
    document.getElementById('pricingOverlay').classList.add('open');
    if(preferredCurrency){
      selectPricingCurrency(preferredCurrency);
    } else {
      document.getElementById('pricingStep1').classList.remove('hidden');
      document.getElementById('pricingStep2').classList.add('hidden');
    }
  }
  function closePricing(){
    document.getElementById('pricingOverlay').classList.remove('open');
  }
  document.getElementById('pricingOverlay').addEventListener('click', function(e){
    if(e.target === this) closePricing();
  });
  function selectPricingCurrency(cur){
    document.getElementById('pricingStep1').classList.add('hidden');
    document.getElementById('pricingStep2').classList.remove('hidden');
    document.getElementById('planGrid-USD').classList.toggle('hidden', cur !== 'USD');
    document.getElementById('planGrid-NGN').classList.toggle('hidden', cur !== 'NGN');
  }
  function backToCurrency(){
    document.getElementById('pricingStep1').classList.remove('hidden');
    document.getElementById('pricingStep2').classList.add('hidden');
  }

  // dashboard tab switch
  function switchDash(btn, id){
    document.querySelectorAll('.dash-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.dash-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('dash-'+id).classList.add('active');
  }

  // calendar / history toggle
  function toggleHistory(key){
    var cal = document.getElementById('calView-'+key);
    var hist = document.getElementById('histView-'+key);
    var btn = document.getElementById('histBtn-'+key);
    var showingHistory = hist.classList.contains('active');
    if(showingHistory){
      hist.classList.remove('active');
      cal.classList.remove('hidden');
      btn.textContent = 'View history';
    } else {
      hist.classList.add('active');
      cal.classList.add('hidden');
      btn.textContent = 'Back to calendar';
    }
  }

  // calculator
  var calcExpr = '';
  function toggleCalc(open){
    document.getElementById('calcOverlay').classList.toggle('open', open);
    if(open){ calcExpr=''; document.getElementById('calcDisplay').textContent='0'; }
  }
  document.getElementById('calcOverlay').addEventListener('click', function(e){
    if(e.target === this) toggleCalc(false);
  });
  function calcInput(v){
    calcExpr += v;
    document.getElementById('calcDisplay').textContent = calcExpr;
  }
  function calcClear(){
    calcExpr = '';
    document.getElementById('calcDisplay').textContent = '0';
  }
  function calcEquals(){
    try{
      if(!/^[0-9+\-*/.\s]+$/.test(calcExpr)) throw new Error('invalid');
      var result = Function('"use strict"; return (' + calcExpr + ')')();
      document.getElementById('calcDisplay').textContent = String(result);
      calcExpr = String(result);
    }catch(e){
      document.getElementById('calcDisplay').textContent = 'Error';
      calcExpr = '';
    }
  }

  // scroll reveal
  var revealEls = document.querySelectorAll('.reveal, .reveal-card');
  var singleCard = document.querySelector('.single-card');
  if(singleCard) singleCard.classList.add('reveal-target');
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
      }
    });
  }, {threshold:0.2});
  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });
  if(singleCard) observer.observe(singleCard);

  // counters
  function formatCounter(el, val){
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var compact = el.getAttribute('data-compact') === 'true';
    var display;
    if(compact){
      display = (val/1000000).toFixed(1) + 'M';
    } else {
      display = Math.round(val).toLocaleString();
    }
    el.textContent = prefix + display + suffix;
  }
  var counterFrames = {};
  function animateCounter(el, idx){
    if(counterFrames[idx]) cancelAnimationFrame(counterFrames[idx]);
    var target = parseFloat(el.getAttribute('data-target'));
    var duration = 1400;
    var start = null;
    function step(ts){
      if(!start) start = ts;
      var progress = Math.min((ts-start)/duration, 1);
      var eased = 1 - Math.pow(1-progress, 3);
      formatCounter(el, target*eased);
      if(progress < 1) counterFrames[idx] = requestAnimationFrame(step);
      else formatCounter(el, target);
    }
    counterFrames[idx] = requestAnimationFrame(step);
  }
  var counterRow = document.getElementById('counterRow');
  var counterObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        document.querySelectorAll('.counter .num').forEach(function(el, i){
          formatCounter(el, 0);
          animateCounter(el, i);
        });
      } else {
        document.querySelectorAll('.counter .num').forEach(function(el, i){
          if(counterFrames[i]) cancelAnimationFrame(counterFrames[i]);
          formatCounter(el, 0);
        });
      }
    });
  }, {threshold:0.4});
  if(counterRow) counterObserver.observe(counterRow);
</script>