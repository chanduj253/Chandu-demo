/* BussMetrics — portal interactions (no external libraries) */
(function () {
  'use strict';

  /* ---------------------------------------------------------- data ---- */
  var SCHEMES = [
    { name: 'MSME Credit Guarantee Programme', org: 'MSME Council', img: 'assets/img/cat-msme.jpg',
      tags: ['credit', 'msme', 'guarantee'], types: ['msme', 'medium'], sectors: ['manufacturing', 'services', 'agriculture'],
      blurb: 'Collateral-free working capital up to INR 5 crore with a sovereign guarantee.' },
    { name: 'Startup Innovation Grant', org: 'Department of Innovation', img: 'assets/img/part-innovate.jpg',
      tags: ['startup', 'grant', 'r&d'], types: ['startup'], sectors: ['digital', 'manufacturing', 'services'],
      blurb: 'Non-dilutive grants for prototyping, testing and first-commercialisation costs.' },
    { name: 'Export Market Access Scheme', org: 'Trade Commission', img: 'assets/img/svc-trade.jpg',
      tags: ['export', 'trade', 'subsidy'], types: ['exporter', 'medium', 'msme'], sectors: ['manufacturing', 'agriculture', 'services'],
      blurb: 'Rebates on freight, certification and overseas exhibition participation.' },
    { name: 'Green Transition Fund for Industry', org: 'Climate & Industry Bureau', img: 'assets/img/spotlight-2.jpg',
      tags: ['green', 'manufacturing', 'fund'], types: ['medium', 'msme', 'exporter'], sectors: ['manufacturing'],
      blurb: 'Low-interest lines for energy efficiency, solar rooftop and process retrofits.' },
    { name: 'Skilling & Apprenticeship Subsidy', org: 'National Skill Board', img: 'assets/img/cat-labour.jpg',
      tags: ['employment', 'skilling', 'subsidy'], types: ['msme', 'medium', 'startup', 'exporter'], sectors: ['manufacturing', 'services', 'digital', 'agriculture'],
      blurb: 'Per-apprentice monthly subsidy for certified on-the-job training seats.' },
    { name: 'Digital Payments Adoption Drive', org: 'Financial Inclusion Cell', img: 'assets/img/purple-digital.jpg',
      tags: ['digital', 'payments', 'msme'], types: ['msme', 'startup'], sectors: ['services', 'digital', 'agriculture'],
      blurb: 'Zero MDR acceptance devices and cashback incentives for small merchants.' }
  ];

  var NEWS = [
    { type: 'press', title: 'Q2 Business Confidence Index rises to 118.4 on capex rebound', src: 'Statistical Office', date: '17 Sep 2026', img: 'assets/img/news-1.jpg' },
    { type: 'press', title: 'Composite leading indicator signals steady industrial recovery', src: 'Market Analysis Wing', date: '15 Sep 2026', img: 'assets/img/news-2.jpg' },
    { type: 'news', title: 'Skill economy adds 2.1 million certified workers in FY26', src: 'Labour & Skills Desk', date: '12 Sep 2026', img: 'assets/img/news-3.jpg' },
    { type: 'news', title: 'National data centre expands open APIs for firm-level research', src: 'Digital Economy Cell', date: '09 Sep 2026', img: 'assets/img/news-4.jpg' },
    { type: 'announce', title: 'Chief Economist quarterly review: public consultation now open', src: 'Chief Economist Office', date: '05 Sep 2026', img: 'assets/img/news-5.jpg' },
    { type: 'press', title: 'State economy profiles: eight states climb the competitiveness ladder', src: 'Statistical Office', date: '02 Sep 2026', img: 'assets/img/purple-regions.jpg' },
    { type: 'news', title: 'Logistics cost falls to 7.8 percent of GDP on corridor upgrades', src: 'Trade & Supply Chain Desk', date: '28 Aug 2026', img: 'assets/img/cat-trade.jpg' },
    { type: 'announce', title: 'Economic Outlook 2026 survey: enumerator enrolment closes 30 Sep', src: 'Field Operations', date: '24 Aug 2026', img: 'assets/img/part-do.jpg' }
  ];

  var SEARCH_INDEX = [
    { title: 'Market Analytics Desk', sub: 'Online service: live price and output dashboards', scope: 'data', href: '#services', kw: 'analytics dashboard prices demand output market gdp growth rate inflation index' },
    { title: 'Registration & Compliance', sub: 'Online service: filings, licences, annual returns', scope: 'directory', href: '#services', kw: 'registration compliance licence filing returns' },
    { title: 'Credit & Funding Access', sub: 'Online service: credit lines, guarantees, grants', scope: 'data', href: '#services', kw: 'credit funding loan guarantee grant msme credit startup funding' },
    { title: 'Trade & Export Intelligence', sub: 'Online service: tariffs, shipping flows, export data', scope: 'data', href: '#services', kw: 'trade export data tariffs shipping export data' },
    { title: 'Macroeconomy & Growth', sub: 'Category: GDP, investment, prices, business cycle', scope: 'data', href: '#categories', kw: 'macroeconomy gdp growth rate inflation index prices investment' },
    { title: 'Banking & Financial Markets', sub: 'Category: liquidity, credit flow, market depth', scope: 'data', href: '#categories', kw: 'banking financial markets liquidity stocks bonds' },
    { title: 'MSME & Startups', sub: 'Category: registration, credit, incubation', scope: 'data', href: '#categories', kw: 'msme startup funding incubation enterprise' },
    { title: 'Employment & Labour', sub: 'Category: workforce surveys, wage indices, skilling', scope: 'data', href: '#categories', kw: 'employment survey labour jobs wages skilling' },
    { title: 'Public Finance & Taxation', sub: 'Category: budgets, tax policy, subsidies', scope: 'publications', href: '#categories', kw: 'public finance taxation budget subsidy fiscal' },
    { title: 'Trade & Supply Chains', sub: 'Category: exports, imports, logistics cost', scope: 'data', href: '#categories', kw: 'trade supply chain export data logistics imports' },
    { title: 'Open Data Catalogue', sub: 'Directory: downloadable series, APIs, metadata', scope: 'data', href: '#directories', kw: 'open data catalogue series api download' },
    { title: 'Publications Library', sub: 'Directory: reports, working papers, handbooks', scope: 'publications', href: '#directories', kw: 'publications library reports working papers handbook' },
    { title: 'Who’s Who', sub: 'Directory: economists, board, leadership', scope: 'directory', href: '#directories', kw: 'whos who economists leadership board directory' },
    { title: 'Contact Directory', sub: 'Directory: helplines, regional offices', scope: 'directory', href: '#directories', kw: 'contact directory helpline office phone' },
    { title: 'Events & Tenders', sub: 'Directory: conferences, consultations, tenders', scope: 'directory', href: '#directories', kw: 'events tenders conference consultation' }
  ];
  SCHEMES.forEach(function (s) {
    SEARCH_INDEX.push({ title: s.name, sub: 'Scheme: ' + s.org, scope: 'schemes', href: '#schemes', kw: (s.name + ' ' + s.tags.join(' ')).toLowerCase() });
  });
  NEWS.forEach(function (n) {
    SEARCH_INDEX.push({ title: n.title, sub: n.src + ' · ' + n.date, scope: 'news', href: '#news', kw: n.title.toLowerCase() });
  });

  /* ------------------------------------------------------- helpers ---- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  var toastEl = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.setAttribute('role', 'status');
      toastEl.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#0d2240;color:#fff;' +
        'padding:11px 20px;border-radius:6px;font:600 .88rem/1.3 "Segoe UI",Roboto,Arial,sans-serif;z-index:300;box-shadow:0 8px 24px rgba(0,0,0,.3);max-width:90vw;text-align:center';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.opacity = '1';
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.style.opacity = '0'; }, 2600);
  }

  /* ------------------------------------------------- schemes render ---- */
  var schemeGrid = $('#schemeGrid');
  function schemeCard(s) {
    return '<article class="scheme-card"><img src="' + s.img + '" alt="" loading="lazy">' +
      '<div><strong>' + s.name + '</strong><small>' + s.org + ' — ' + s.blurb + '</small>' +
      '<span class="scheme-tags">' + s.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</span></div></article>';
  }
  function renderSchemes(list) {
    schemeGrid.innerHTML = list.length
      ? list.map(schemeCard).join('')
      : '<p class="scheme-empty">No scheme matches those terms. Try "credit", "export", "green" or "skilling".</p>';
  }
  renderSchemes(SCHEMES);

  $('#schemeSearch').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = $('#schemeQ').value.trim().toLowerCase();
    if (!q) { renderSchemes(SCHEMES); return; }
    renderSchemes(SCHEMES.filter(function (s) {
      return (s.name + ' ' + s.org + ' ' + s.blurb + ' ' + s.tags.join(' ')).toLowerCase().indexOf(q) > -1;
    }));
  });
  $('#schemeQ').addEventListener('input', function () {
    if (!this.value.trim()) renderSchemes(SCHEMES);
  });

  /* -------------------------------------------- eligibility modal ------ */
  var modal = $('#eligModal');
  $('#eligibilityBtn').addEventListener('click', function () {
    modal.hidden = false;
    $('#eligResult').hidden = true;
    $('#eligType').focus();
  });
  function closeModal() { modal.hidden = true; }
  $('#eligClose').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  $('#eligForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var type = $('#eligType').value, sector = $('#eligSector').value, size = $('#eligSize').value;
    var state = $('#eligState').value;
    var matches = SCHEMES.filter(function (s) {
      return s.types.indexOf(type) > -1 && s.sectors.indexOf(sector) > -1;
    }).map(function (s) {
      var note = '';
      if (size === 's' && s.tags.indexOf('skilling') > -1) note = ' Priority queue for units with fewer than 50 employees.';
      if (sector === 'digital' && s.tags.indexOf('digital') > -1) note = ' Fast-track window for digital-sector applicants.';
      s._note = note;
      return s;
    });
    var box = $('#eligResult');
    box.hidden = false;
    box.innerHTML = '<h4>' + (matches.length ? matches.length + ' scheme' + (matches.length > 1 ? 's' : '') +
      ' match a ' + type + ' unit in ' + sector + ' (' + state + '):' : 'No exact match yet — our desk can advise:') + '</h4>' +
      (matches.length ? matches.map(function (s) {
        return schemeCard(s) + (s._note ? '<p style="font-size:.8rem;color:#55636f;margin:-4px 0 12px">' + s._note + '</p>' : '');
      }).join('') : schemeCard(SCHEMES[4]));
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* --------------------------------------------------- news render ---- */
  var newsList = $('#newsList');
  function renderNews(filter) {
    var items = NEWS.filter(function (n) { return filter === 'all' || n.type === filter; }).slice(0, 5);
    newsList.innerHTML = items.map(function (n) {
      return '<li><a class="news-item" href="#news"><img src="' + n.img + '" alt="" loading="lazy">' +
        '<div><strong>' + n.title + '</strong>' +
        '<span class="news-meta"><span class="src">' + n.src + '</span><span>' + n.date + '</span></span></div></a></li>';
    }).join('');
  }
  renderNews('all');
  $$('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.tab').forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
      renderNews(tab.dataset.tab);
    });
  });

  /* ------------------------------------------------------ carousel ---- */
  var slides = $$('#carousel .slide'), dotsBox = $('#carDots'), cur = 0, timer = null;
  slides.forEach(function (_, i) {
    var b = document.createElement('button');
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', 'Slide ' + (i + 1));
    b.addEventListener('click', function () { go(i); restart(); });
    dotsBox.appendChild(b);
  });
  var dots = $$('button', dotsBox);
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(function (s, k) { s.classList.toggle('active', k === cur); });
    dots.forEach(function (d, k) { d.classList.toggle('active', k === cur); });
  }
  function restart() { clearInterval(timer); timer = setInterval(function () { go(cur + 1); }, 6000); }
  $('#carPrev').addEventListener('click', function () { go(cur - 1); restart(); });
  $('#carNext').addEventListener('click', function () { go(cur + 1); restart(); });
  $('#carousel').addEventListener('mouseenter', function () { clearInterval(timer); });
  $('#carousel').addEventListener('mouseleave', restart);
  go(0); restart();

  /* ----------------------------------------------- animated counters --- */
  var counters = $$('.stat-num');
  function fmt(n) { return n.toLocaleString('en-IN'); }
  var seen = false;
  function runCounters() {
    if (seen) return; seen = true;
    counters.forEach(function (el) {
      var target = +el.dataset.count, t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1400, 1);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) { if (en.isIntersecting) { runCounters(); obs.disconnect(); } });
    }, { threshold: .3 }).observe($('.stats'));
  } else { runCounters(); }

  /* -------------------------------------------------- unified search --- */
  var resultsBox = $('#searchResults');
  function doSearch(q, scope) {
    q = (q || '').trim().toLowerCase();
    if (!q) { resultsBox.hidden = true; return; }
    var hits = SEARCH_INDEX.filter(function (it) {
      var okScope = scope === 'all' || it.scope === scope;
      return okScope && (it.title.toLowerCase().indexOf(q) > -1 || it.kw.indexOf(q) > -1);
    }).slice(0, 8);
    resultsBox.hidden = false;
    resultsBox.innerHTML = hits.length
      ? hits.map(function (h) {
          return '<a class="sr-item" href="' + h.href + '"><strong>' + h.title + '</strong><small>' + h.sub + '</small></a>';
        }).join('')
      : '<p class="sr-empty">No matches for “' + q + '”. Try “GDP growth rate”, “MSME credit” or “export data”.</p>';
  }
  $$('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = $('[data-search-input]', form);
      var scopeEl = $('[data-search-scope]', form);
      var scope = scopeEl ? scopeEl.value : 'all';
      var q = input.value;
      if (form.id !== 'heroSearch') {           // top bar form delegates to hero search
        $('#heroQ').value = q;
        if (scopeEl) $('#heroCat').value = scope;
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        doSearch(q, scope);
        return;
      }
      doSearch(q, scope);
    });
  });
  $('#heroQ').addEventListener('input', function () {
    doSearch(this.value, $('#heroCat').value);
  });
  $('#heroCat').addEventListener('change', function () {
    doSearch($('#heroQ').value, this.value);
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#heroSearch')) resultsBox.hidden = true;
  });
  $$('.pill').forEach(function (p) {
    p.addEventListener('click', function () {
      $('#heroQ').value = p.dataset.trend;
      $('#heroCat').value = 'all';
      doSearch(p.dataset.trend, 'all');
      $('#heroQ').focus();
    });
  });

  /* --------------------------------------------- nav / a11y / misc ---- */
  var navToggle = $('#navToggle'), navLinks = $('#navLinks');
  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      $$('#navLinks a').forEach(function (x) { x.classList.remove('active'); });
      a.classList.add('active');
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  var sizes = [87.5, 100, 112.5], sizeIdx = 1;
  $$('[data-font]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.font === 'up') sizeIdx = Math.min(sizeIdx + 1, 2);
      else if (b.dataset.font === 'down') sizeIdx = Math.max(sizeIdx - 1, 0);
      else sizeIdx = 1;
      document.documentElement.style.fontSize = sizes[sizeIdx] + '%';
      toast('Text size: ' + (sizeIdx === 0 ? 'small' : sizeIdx === 1 ? 'normal' : 'large'));
    });
  });
  var contrastBtn = $('#contrastBtn');
  contrastBtn.addEventListener('click', function () {
    var on = document.body.classList.toggle('high-contrast');
    contrastBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    toast(on ? 'High contrast on' : 'High contrast off');
  });
  $('#langSelect').addEventListener('change', function () {
    toast('The ' + this.options[this.selectedIndex].text + ' edition is being translated by the Editorial Desk.');
  });

  var toTop = $('#toTop');
  window.addEventListener('scroll', function () {
    toTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  $('#year').textContent = '© ' + new Date().getFullYear() + ' BussMetrics';
})();
