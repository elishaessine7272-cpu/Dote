// ---------- footer: back to top ----------
  function scrollToTop(e){
    if(e) e.preventDefault();
    window.scrollTo({top:0, behavior:'smooth'});
    return false;
  }

// ---------- dashboard comfort (dark) mode — scoped to the preview only ----------
  function toggleDashDark(){
    var wrap = document.getElementById('dash-preview-anchor');
    var sw = document.getElementById('dashModeSwitch');
    var on = wrap.classList.toggle('dash-dark');
    sw.classList.toggle('on', on);
    sw.setAttribute('aria-pressed', on ? 'true' : 'false');
    try{ sessionStorage.setItem('sp-dash-dark', on ? '1' : '0'); }catch(e){}
  }
  (function initDashDark(){
    try{
      if(sessionStorage.getItem('sp-dash-dark') === '1'){
        document.addEventListener('DOMContentLoaded', function(){
          document.getElementById('dash-preview-anchor').classList.add('dash-dark');
          var sw = document.getElementById('dashModeSwitch');
          sw.classList.add('on');
          sw.setAttribute('aria-pressed', 'true');
        });
      }
    }catch(e){}
  })();

  // ---------- talk to us / contact modal ----------
  function toggleContact(open){
    document.getElementById('contactOverlay').classList.toggle('open', open);
    if(open){
      document.getElementById('contactFormWrap').style.display = 'block';
      document.getElementById('contactSuccess').classList.remove('show');
      document.getElementById('contactForm').reset();
    }
  }
  document.getElementById('contactOverlay').addEventListener('click', function(e){
    if(e.target === this) toggleContact(false);
  });
  function submitContact(e){
    e.preventDefault();
    document.getElementById('contactFormWrap').style.display = 'none';
    document.getElementById('contactSuccess').classList.add('show');
    return false;
  }

  // ---------- nav: mobile drawer ----------
  function toggleMobileDrawer(){
    var drawer = document.getElementById('mobileDrawer');
    var toggle = document.getElementById('navToggle');
    var open = drawer.classList.toggle('open');
    toggle.classList.toggle('open', open);
  }
  function toggleMobileSub(head){
    head.classList.toggle('open');
    var sub = head.nextElementSibling;
    sub.classList.toggle('open');
  }

  // ---------- nav: Industries dropdown, click fallback for touch/no-hover devices ----------
  function toggleDropdown(e){
    e.stopPropagation();
    document.getElementById('industriesDropdown').classList.toggle('dd-open');
  }
  document.addEventListener('click', function(e){
    var dd = document.getElementById('industriesDropdown');
    if(dd && !dd.contains(e.target)) dd.classList.remove('dd-open');
  });

  // ---------- nav: jump straight to a dashboard tab from the Industries menu ----------
  function goToDashboard(e, key){
    e.preventDefault();
    document.getElementById('industriesDropdown').classList.remove('dd-open');
    document.getElementById('mobileDrawer').classList.remove('open');
    document.getElementById('navToggle').classList.remove('open');
    var tabBtn = document.querySelector('.dash-tab[onclick*="\'' + key + '\'"]');
    if(tabBtn){ switchDash(tabBtn, key); }
    document.getElementById('dash-preview-anchor').scrollIntoView({behavior:'smooth', block:'start'});
    return false;
  }

  // nav auto-hide on scroll (mobile only)
  var lastScrollY = window.scrollY;
  var navEl = document.getElementById('siteNav');
  window.addEventListener('scroll', function(){
    if(window.innerWidth > 860){ navEl.classList.remove('nav-hidden'); lastScrollY = window.scrollY; return; }
    var currentY = window.scrollY;
    if(currentY > lastScrollY && currentY > 90){
      navEl.classList.add('nav-hidden');
    } else {
      navEl.classList.remove('nav-hidden');
    }
    lastScrollY = currentY;
  });

  // dashboard tab switch
  function switchDash(btn, id){
    document.querySelectorAll('.dash-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.dash-panel').forEach(p=>p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('dash-'+id).classList.add('active');
  }

  // ---------- branch switcher ----------
  var branchData = {
    super:  {label:'Kate B. Stores',   branches:['Ikeja (HQ)','Lekki Phase 1','Wuse, Abuja']},
    pharm:  {label:'Kate B. Pharmacy', branches:['Ikeja (HQ)','Yaba','Surulere']},
    rest:   {label:'Kate B Kitchen',   branches:['Ikeja (HQ)','Victoria Island','Ikoyi']},
    hotel:  {label:'Kate B Suites',    branches:['Ikeja (HQ)','Lekki']},
    school: {label:'Kate B Academy',   branches:['Main Campus','Annex Campus']}
  };
  var branchCurrent = {};
  var currentBranchKey = null;
  function openBranchSwitch(key){
    currentBranchKey = key;
    var data = branchData[key];
    var selected = branchCurrent[key] || 0;
    document.getElementById('branchModalTitle').textContent = 'Switch branch — ' + data.label;
    var list = document.getElementById('branchList');
    list.innerHTML = data.branches.map(function(b, i){
      var active = i === selected;
      return '<div class="branch-option' + (active ? ' active' : '') + '" onclick="selectBranch(' + i + ')">' +
        '<span>' + b + '</span>' + (active ? '<span class="bo-check">✓ Viewing</span>' : '') + '</div>';
    }).join('');
    document.getElementById('branchOverlay').classList.add('open');
  }
  function closeBranch(){
    document.getElementById('branchOverlay').classList.remove('open');
  }
  document.getElementById('branchOverlay').addEventListener('click', function(e){
    if(e.target === this) closeBranch();
  });
  function selectBranch(i){
    branchCurrent[currentBranchKey] = i;
    var data = branchData[currentBranchKey];
    var span = document.getElementById('branchLabel-' + currentBranchKey);
    if(span){ span.textContent = i === 0 ? data.label : data.label + ' — ' + data.branches[i]; }
    closeBranch();
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

  // supermarket: staff attendance mode toggle (digital scan vs manual)
  function toggleAttendModeSuper(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('attendView-super-digital').classList.toggle('active', mode === 'digital');
    document.getElementById('attendView-super-manual').classList.toggle('active', mode === 'manual');
  }

  // supermarket: switch payments panel between WhatsApp and POS records
  function togglePayViewSuper(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('payView-super-whatsapp').classList.toggle('active', mode === 'whatsapp');
    document.getElementById('payView-super-pos').classList.toggle('active', mode === 'pos');
  }

  // any dashboard: accept an incoming WhatsApp order
  function acceptWaOrder(btn){
    btn.textContent = 'Accepted ✓';
    btn.disabled = true;
    var row = btn.closest('.wa-order-row');
    if(row) row.style.opacity = '.6';
  }

  // supermarket: tap a till to see the items that made up its total
  function toggleTillBreakdown(rowEl){
    var block = rowEl.closest('.till-block');
    var panel = block.parentElement;
    var wasOpen = block.classList.contains('open');
    panel.querySelectorAll('.till-block').forEach(function(b){
      b.classList.remove('open');
      var bd = b.querySelector('.till-breakdown');
      if(bd) bd.style.maxHeight = null;
    });
    if(!wasOpen){
      block.classList.add('open');
      var bd = block.querySelector('.till-breakdown');
      bd.style.maxHeight = bd.scrollHeight + 'px';
    }
  }

  // any dashboard: click Early / Late / Absent on a staff attendance row
  function markAttend(btn, status){
    var row = btn.closest('.m-manual-row-v2');
    if(!row) return;
    row.querySelectorAll('.ab-btn').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
  }

  // any dashboard: attendance summary — reads the actual Early/Late/Absent
  // marks in the manual view and turns them into who's late, who's absent,
  // what it costs, and a button to push that to payroll.
  var payrollManualMap = {
    super:'attendView-super-manual', pharm:'attendView-pharm-manual',
    rest:'attendView-rest-manual', hotel:'attendView-hotel-manual', school:'attendView-manual'
  };
  var LATE_FEE = 500, ABSENT_FEE = 2500;
  function buildPayrollSummaryHTML(key){
    var manualId = payrollManualMap[key];
    var container = document.getElementById(manualId);
    var late = [], absent = [];
    if(container){
      container.querySelectorAll('.m-manual-row-v2').forEach(function(row){
        var nameEl = row.querySelector('.m-attend-name');
        var activeBtn = row.querySelector('.ab-btn.active');
        if(!nameEl || !activeBtn) return;
        var name = nameEl.textContent;
        if(activeBtn.classList.contains('late')) late.push(name);
        if(activeBtn.classList.contains('absent')) absent.push(name);
      });
    }
    if(late.length === 0 && absent.length === 0){
      return '<div class="ms-line">Everyone clocked in on time today — nothing to deduct, nothing to flag for payroll.</div>' +
             '<button class="m-receipt-btn payroll-send-btn" onclick="sendToPayroll(this)">Send info to payroll</button>';
    }
    var total = late.length*LATE_FEE + absent.length*ABSENT_FEE;
    var rows = '';
    late.forEach(function(n){ rows += '<div class="payroll-row"><span>'+n+' <i class="pr-tag late">Late</i></span><span class="pr-ded">-\u20a6'+LATE_FEE.toLocaleString()+'</span></div>'; });
    absent.forEach(function(n){ rows += '<div class="payroll-row"><span>'+n+' <i class="pr-tag absent">Absent</i></span><span class="pr-ded">-\u20a6'+ABSENT_FEE.toLocaleString()+'</span></div>'; });
    return '<div class="ms-line" style="margin-bottom:8px;"><b>Today\u2019s deductions, based on the manual attendance marks:</b></div>' +
           rows +
           '<div class="payroll-row payroll-total"><span>Total to deduct</span><span class="pr-ded">-\u20a6'+total.toLocaleString()+'</span></div>' +
           '<button class="m-receipt-btn payroll-send-btn" onclick="sendToPayroll(this)">Send info to payroll</button>';
  }
  function togglePayrollSolution(key, btn){
    var panel = document.getElementById('payrollSolution-'+key);
    if(!panel) return;
    var open = panel.classList.toggle('active');
    if(open){ panel.innerHTML = buildPayrollSummaryHTML(key); }
    btn.textContent = open ? 'Hide summary' : 'Attendance summary';
  }
  function sendToPayroll(btn){
    btn.textContent = 'Sent to payroll \u2713';
    btn.disabled = true;
  }

  // any dashboard: confirm an incoming WhatsApp payment — this now actually changes state
  function confirmPayment(btn, waId){
    var bubble = document.getElementById(waId);
    if(bubble){
      bubble.classList.add('confirmed');
      var meta = bubble.querySelector('.m-wa-meta');
      if(meta && meta.textContent.indexOf('Confirmed') === -1){ meta.textContent += ' · Confirmed'; }
    }
    btn.textContent = 'Confirmed ✓';
    btn.disabled = true;
  }

  // any dashboard: send-receipt button gives real feedback instead of doing nothing visible
  function simulateSend(btn){
    var original = btn.textContent;
    btn.textContent = 'Sent ✓';
    btn.disabled = true;
    setTimeout(function(){ btn.textContent = original; btn.disabled = false; }, 2200);
  }

  // school: staff attendance mode toggle (digital scan vs manual)
  function toggleAttendMode(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('attendView-digital').classList.toggle('active', mode === 'digital');
    document.getElementById('attendView-manual').classList.toggle('active', mode === 'manual');
  }

  // school: student roster level toggle (primary vs secondary)
  function toggleRoster(btn, level){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('rosterView-primary').classList.toggle('active', level === 'primary');
    document.getElementById('rosterView-secondary').classList.toggle('active', level === 'secondary');
  }

  // school: click a name to flip present/absent (works for both staff and student rows)
  function toggleManualMark(row){
    row.classList.toggle('is-absent');
    var check = row.querySelector('.m-manual-check, .mr-tick');
    if(!check) return;
    if(row.classList.contains('is-absent')){
      check.textContent = '–';
    } else {
      check.textContent = '✓';
    }
  }

  // school: expand/collapse a class in the "By class" roster view, one open at a time per list
  function toggleClassAcc(item){
    var wasOpen = item.classList.contains('open');
    var list = item.parentElement;
    list.querySelectorAll('.m-class-acc-item').forEach(function(i){
      i.classList.remove('open');
      i.querySelector('.m-class-acc-body').style.maxHeight = null;
    });
    if(!wasOpen){
      item.classList.add('open');
      var body = item.querySelector('.m-class-acc-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  }

  // school: show/hide the attendance summary panel
  function toggleAttendSummary(){
    var summary = document.getElementById('attendSummary');
    var open = summary.classList.toggle('active');
    document.getElementById('attendSummaryBtn').textContent = open ? 'Hide summary' : 'Summary';
  }

  // school: term calendar — let a user opt parents into automatic break/holiday alerts
  function toggleCalAlerts(switchEl){
    var on = switchEl.classList.toggle('on');
    document.getElementById('parentAlertLabel').textContent = on ? 'On' : 'Off';
    document.getElementById('calAlertConfirm').classList.toggle('show', on);
  }

  // school: add an expense row and keep the running total accurate
  function addExpense(){
    var amountInput = document.getElementById('expAmountInput');
    var noteInput = document.getElementById('expNoteInput');
    var amount = parseFloat((amountInput.value || '').replace(/[^0-9.]/g,''));
    if(!amount || amount <= 0){ amountInput.focus(); return; }
    var note = noteInput.value.trim() || 'Miscellaneous';
    var totalRow = document.getElementById('schoolExpenseTotal');
    var row = document.createElement('div');
    row.className = 'm-expense-row';
    row.innerHTML = '<div><div class="m-expense-desc"><span class="m-expense-cat">Other</span>' + note + '</div></div><span class="m-expense-amt">₦' + amount.toLocaleString() + '</span>';
    totalRow.parentElement.insertBefore(row, totalRow);
    var totalSpan = totalRow.querySelector('span:last-child');
    var current = parseFloat(totalSpan.textContent.replace(/[^0-9.]/g,'')) || 0;
    totalSpan.textContent = '₦' + (current + amount).toLocaleString();
    amountInput.value = '';
    noteInput.value = '';
  }

  // pharmacy: staff shift attendance toggle (digital scan vs manual)
  function toggleAttendModePharm(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('attendView-pharm-digital').classList.toggle('active', mode === 'digital');
    document.getElementById('attendView-pharm-manual').classList.toggle('active', mode === 'manual');
  }

  // restaurant: staff attendance mode toggle (digital scan vs manual)
  function toggleAttendModeRest(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('attendView-rest-digital').classList.toggle('active', mode === 'digital');
    document.getElementById('attendView-rest-manual').classList.toggle('active', mode === 'manual');
  }

  // restaurant: switch payments panel between WhatsApp and POS records
  function togglePayViewRest(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('payView-rest-whatsapp').classList.toggle('active', mode === 'whatsapp');
    document.getElementById('payView-rest-pos').classList.toggle('active', mode === 'pos');
  }

  // pharmacy: switch payments panel between WhatsApp and POS records
  function togglePayViewPharm(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('payView-pharm-whatsapp').classList.toggle('active', mode === 'whatsapp');
    document.getElementById('payView-pharm-pos').classList.toggle('active', mode === 'pos');
  }

  // pharmacy: show/hide the lab revenue summary
  function toggleLabSummary(){
    var summary = document.getElementById('labSummary');
    var open = summary.classList.toggle('active');
    document.getElementById('labSummaryBtn').textContent = open ? 'Hide summary' : 'Summary';
  }

  // school: switch roster between individual list and grouped-by-class view
  function toggleRosterView(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.querySelectorAll('.m-class-view').forEach(function(v){
      v.classList.toggle('active', v.getAttribute('data-mode') === mode);
    });
  }

  // school: switch payments panel between WhatsApp and POS records
  function togglePayView(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('payView-whatsapp').classList.toggle('active', mode === 'whatsapp');
    document.getElementById('payView-pos').classList.toggle('active', mode === 'pos');
  }

  // hotel: staff attendance mode toggle (digital scan vs manual)
  function toggleAttendModeHotel(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('attendView-hotel-digital').classList.toggle('active', mode === 'digital');
    document.getElementById('attendView-hotel-manual').classList.toggle('active', mode === 'manual');
  }

  // hotel: switch payments panel between WhatsApp and POS records
  function togglePayViewHotel(btn, mode){
    btn.parentElement.querySelectorAll('button').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    document.getElementById('payView-hotel-whatsapp').classList.toggle('active', mode === 'whatsapp');
    document.getElementById('payView-hotel-pos').classList.toggle('active', mode === 'pos');
  }

  // hotel: housekeeping mark-done toggle
  function markHouseDone(btn){
    var row = btn.closest('.m-house-row');
    var isDone = row.classList.toggle('done');
    btn.textContent = isDone ? 'Undo' : 'Mark done';
  }

  // hotel: room board click-to-see price and amenities, now with a working edit affordance
  var roomData = {
    '101': {tier:'standard', price:'₦18,000 / night', amenities:['AC','Queen bed','Wi-Fi','TV']},
    '102': {tier:'vip', price:'₦35,000 / night', amenities:['AC','King bed','Wi-Fi','TV','Mini fridge','Balcony']},
    '103': {tier:'standard', price:'₦18,000 / night', amenities:['AC','Queen bed','Wi-Fi','TV']},
    '104': {tier:'standard', price:'₦18,000 / night', amenities:['AC','Queen bed','Wi-Fi','TV']},
    '105': {tier:'premium', price:'₦55,000 / night', amenities:['AC','King bed','Wi-Fi','Smart TV','Mini bar','Jacuzzi','Balcony']},
    '106': {tier:'vip', price:'₦35,000 / night', amenities:['AC','King bed','Wi-Fi','TV','Mini fridge','Balcony']},
    '201': {tier:'standard', price:'₦18,000 / night', amenities:['AC','Queen bed','Wi-Fi','TV']},
    '202': {tier:'vip', price:'₦35,000 / night', amenities:['AC','King bed','Wi-Fi','TV','Mini fridge','Balcony']},
    '203': {tier:'standard', price:'₦18,000 / night', amenities:['AC','Queen bed','Wi-Fi','TV']},
    '204': {tier:'premium', price:'₦55,000 / night', amenities:['AC','King bed','Wi-Fi','Smart TV','Mini bar','Jacuzzi','Balcony']},
    '205': {tier:'standard', price:'₦18,000 / night', amenities:['AC','Queen bed','Wi-Fi','TV']},
    '206': {tier:'vip', price:'₦35,000 / night', amenities:['AC','King bed','Wi-Fi','TV','Mini fridge','Balcony']}
  };
  var tierLabels = {standard:'Standard', vip:'VIP', premium:'Premium'};
  var currentRoom = null;
  function showRoomDetail(roomNum){
    currentRoom = roomNum;
    var data = roomData[roomNum];
    var panel = document.getElementById('roomDetail');
    if(!data){ return; }
    panel.classList.remove('empty');
    panel.innerHTML =
      '<div class="rd-head"><b>Room ' + roomNum + '</b><span class="rd-tier ' + data.tier + '">' + tierLabels[data.tier] + '</span></div>' +
      '<div class="rd-price" id="rdPriceDisplay">' + data.price + '</div>' +
      '<div class="rd-edit-row" id="rdPriceEditRow"><input type="text" id="rdPriceInput" value="' + data.price + '"></div>' +
      '<div class="rd-amenities" id="rdAmenities">' + data.amenities.map(function(a){ return '<span>' + a + '</span>'; }).join('') + '</div>' +
      '<div class="rd-saved-note" id="rdSavedNote"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14M13 6l6 6-6 6"/></svg> Saved</div>' +
      '<button class="btn btn-outline-deep btn-sm rd-edit-btn" id="rdEditBtn" onclick="toggleRoomEdit()">Edit room details</button>';
    if(window.innerWidth <= 860){
      setTimeout(function(){ panel.scrollIntoView({behavior:'smooth', block:'nearest'}); }, 50);
    }
  }
  function toggleRoomEdit(){
    var editRow = document.getElementById('rdPriceEditRow');
    var priceDisplay = document.getElementById('rdPriceDisplay');
    var amenitiesBox = document.getElementById('rdAmenities');
    var btn = document.getElementById('rdEditBtn');
    var editing = editRow.classList.contains('show');
    if(!editing){
      editRow.classList.add('show');
      priceDisplay.style.display = 'none';
      amenitiesBox.classList.add('editing');
      amenitiesBox.querySelectorAll('span').forEach(function(span){
        if(span.querySelector('.rm-x')) return;
        var x = document.createElement('span');
        x.className = 'rm-x';
        x.textContent = '×';
        x.onclick = function(){ span.remove(); };
        span.appendChild(x);
      });
      btn.textContent = 'Save changes';
    } else {
      var newPrice = document.getElementById('rdPriceInput').value.trim();
      if(newPrice){
        priceDisplay.textContent = newPrice;
        if(currentRoom && roomData[currentRoom]) roomData[currentRoom].price = newPrice;
      }
      editRow.classList.remove('show');
      priceDisplay.style.display = 'block';
      amenitiesBox.classList.remove('editing');
      amenitiesBox.querySelectorAll('.rm-x').forEach(function(x){ x.remove(); });
      btn.textContent = 'Edit room details';
      var note = document.getElementById('rdSavedNote');
      note.classList.add('show');
      setTimeout(function(){ note.classList.remove('show'); }, 1800);
    }
  }

  // hotel: live guest checkout timers
  var guestDueTimes = {
    g1: Date.now() + 110*60000,   // due in ~1h50m
    g2: Date.now() + 15*60000,    // due in 15 minutes, ending soon
    g3: Date.now() - 20*60000,    // already overdue by 20 minutes
    g4: Date.now() + 1620*60000   // due in ~27 hours
  };
  function formatCountdown(ms){
    var overdue = ms < 0;
    var abs = Math.abs(ms);
    var totalMinutes = Math.floor(abs/60000);
    var days = Math.floor(totalMinutes/1440);
    var hours = Math.floor((totalMinutes%1440)/60);
    var mins = totalMinutes%60;
    var text;
    if(days > 0){ text = days + 'd ' + hours + 'h left'; }
    else if(hours > 0){ text = hours + 'h ' + mins + 'm left'; }
    else { text = mins + 'm left'; }
    if(overdue){ text = 'Overdue ' + text.replace(' left',''); }
    return text;
  }
  function updateGuestTimers(){
    Object.keys(guestDueTimes).forEach(function(id){
      var el = document.getElementById('timer-'+id);
      if(!el) return;
      var diff = guestDueTimes[id] - Date.now();
      el.textContent = formatCountdown(diff);
      el.classList.remove('warn','overdue');
      if(diff < 0){ el.classList.add('overdue'); }
      else if(diff < 30*60000){ el.classList.add('warn'); }
    });
  }
  function renewGuest(id){
    guestDueTimes[id] = Math.max(guestDueTimes[id], Date.now()) + 120*60000;
    updateGuestTimers();
    var dot = document.getElementById('renewed-'+id);
    if(dot) dot.classList.add('show');
  }

  // renewal requires a confirmed payment before the timer moves at all
  var pendingRenew = null;
  function openRenew(id, name, room){
    pendingRenew = id;
    var price = (roomData[room] && roomData[room].price) || 'Room rate';
    document.getElementById('renewGuestName').textContent = name;
    document.getElementById('renewGuestRoom').textContent = 'Room ' + room;
    document.getElementById('renewAmount').textContent = price;
    document.getElementById('renewOverlay').classList.add('open');
  }
  function closeRenew(){
    pendingRenew = null;
    document.getElementById('renewOverlay').classList.remove('open');
  }
  function confirmRenew(){
    if(pendingRenew){ renewGuest(pendingRenew); }
    closeRenew();
  }
  document.getElementById('renewOverlay').addEventListener('click', function(e){
    if(e.target === this) closeRenew();
  });
  updateGuestTimers();
  setInterval(updateGuestTimers, 15000);

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

  // barcode: open/close the scan modal, reset to step 1 each time
  function toggleBarcode(open){
    document.getElementById('barcodeOverlay').classList.toggle('open', open);
    if(open){
      document.getElementById('barcodeStep1').style.display = 'block';
      document.getElementById('barcodeStep2').classList.remove('show');
      document.getElementById('barcodeSuccess').classList.remove('show');
    }
  }
  document.getElementById('barcodeOverlay').addEventListener('click', function(e){
    if(e.target === this) toggleBarcode(false);
  });
  function simulateScan(){
    document.getElementById('barcodeStep1').style.display = 'none';
    document.getElementById('barcodeStep2').classList.add('show');
  }
  function confirmBarcodeAdd(){
    var qty = parseInt(document.getElementById('barcodeQty').value, 10) || 0;
    document.getElementById('barcodeStep2').classList.remove('show');
    document.getElementById('barcodeSuccess').classList.add('show');
    document.getElementById('barcodeSuccess').textContent = 'Stock updated, ' + (18+qty) + ' units now on hand.';
    var log = document.getElementById('scanLogList');
    if(log && qty > 0){
      var now = new Date();
      var h = now.getHours() % 12 || 12;
      var m = ('0'+now.getMinutes()).slice(-2);
      var ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      var row = document.createElement('div');
      row.className = 'scan-log-row';
      row.innerHTML = '<span><b>Peak Milk Tin</b>, +' + qty + ' units</span><span>' + h + ':' + m + ' ' + ampm + '</span>';
      log.insertBefore(row, log.firstChild);
    }
    setTimeout(function(){ toggleBarcode(false); }, 1400);
  }
  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
      }
    });
  }, {threshold:0.2});
  document.querySelectorAll('.reveal').forEach(function(el){ observer.observe(el); });

  // testimonials: reveal the second row instead of linking nowhere
  function toggleMoreTestimonials(){
    var more = document.getElementById('testGridMore');
    var btn = document.getElementById('seeMoreBtn');
    var open = more.classList.toggle('show');
    btn.textContent = open ? 'See fewer stories' : 'See more stories';
  }

  // counters
  function formatCounter(el, val){
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var compact = el.getAttribute('data-compact') === 'true';
    var display;
    if(compact){ display = (val/1000000).toFixed(1) + 'M'; }
    else { display = Math.round(val).toLocaleString(); }
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

  // =========================================================
// STANDPOINT — BUILD MY BUSINESS
// SECTION 01 NAVIGATION
// =========================================================


/* ---------------------------------------------------------
   DESKTOP MEGA MENUS
--------------------------------------------------------- */

function toggleBuildDropdown(event, dropdownId) {

    event.preventDefault();

    event.stopPropagation();


    const clickedDropdown =
        document.getElementById(dropdownId);


    if (!clickedDropdown) return;


    const allDropdowns =
        document.querySelectorAll(
            ".sp-build-dropdown"
        );


    allDropdowns.forEach(function (dropdown) {

        const trigger =
            dropdown.querySelector(
                ".sp-build-nav-trigger"
            );


        if (dropdown.id === dropdownId) {

            const isOpen =
                dropdown.classList.toggle("open");


            if (trigger) {

                trigger.classList.toggle(
                    "active",
                    isOpen
                );

                trigger.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }

        } else {

            dropdown.classList.remove("open");


            if (trigger) {

                trigger.classList.remove("active");

                trigger.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }

    });

}



/* ---------------------------------------------------------
   CLOSE DESKTOP MENUS
--------------------------------------------------------- */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.closest(
                ".sp-build-dropdown"
            )
        ) {

            return;

        }


        document
            .querySelectorAll(
                ".sp-build-dropdown"
            )
            .forEach(function (dropdown) {

                dropdown.classList.remove(
                    "open"
                );


                const trigger =
                    dropdown.querySelector(
                        ".sp-build-nav-trigger"
                    );


                if (trigger) {

                    trigger.classList.remove(
                        "active"
                    );

                    trigger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            });

    }
);



/* ---------------------------------------------------------
   MOBILE DRAWER
--------------------------------------------------------- */

function toggleBuildMobile() {

    const drawer =
        document.getElementById(
            "spBuildMobileDrawer"
        );


    const button =
        document.getElementById(
            "spBuildMobileToggle"
        );


    if (!drawer || !button) return;


    const isOpen =
        drawer.classList.toggle("open");


    button.classList.toggle(
        "open",
        isOpen
    );


    button.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
    );

}



/* ---------------------------------------------------------
   MOBILE SUBMENUS
--------------------------------------------------------- */

function toggleBuildMobileSub(button) {

    if (!button) return;


    const submenu =
        button.nextElementSibling;


    if (!submenu) return;


    const isOpen =
        submenu.classList.toggle("open");


    button.classList.toggle(
        "open",
        isOpen
    );


    button.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
    );

}



/* ---------------------------------------------------------
   CLOSE MOBILE DRAWER AFTER LINK CLICK
--------------------------------------------------------- */

document.addEventListener(
    "click",
    function (event) {

        const link =
            event.target.closest(
                ".sp-build-mobile-drawer a"
            );


        if (!link) return;


        const drawer =
            document.getElementById(
                "spBuildMobileDrawer"
            );


        const button =
            document.getElementById(
                "spBuildMobileToggle"
            );


        if (drawer) {

            drawer.classList.remove(
                "open"
            );

        }


        if (button) {

            button.classList.remove(
                "open"
            );

            button.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);



/* ---------------------------------------------------------
   ESCAPE KEY
--------------------------------------------------------- */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") return;


        document
            .querySelectorAll(
                ".sp-build-dropdown"
            )
            .forEach(function (dropdown) {

                dropdown.classList.remove(
                    "open"
                );

                const trigger =
                    dropdown.querySelector(
                        ".sp-build-nav-trigger"
                    );


                if (trigger) {

                    trigger.classList.remove(
                        "active"
                    );

                    trigger.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            });


        const drawer =
            document.getElementById(
                "spBuildMobileDrawer"
            );


        const mobileButton =
            document.getElementById(
                "spBuildMobileToggle"
            );


        if (drawer) {

            drawer.classList.remove(
                "open"
            );

        }


        if (mobileButton) {

            mobileButton.classList.remove(
                "open"
            );

            mobileButton.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);