// 小量互動：手機選單、checklist 記憶。
(function () {
  var btn = document.getElementById('menuBtn');
  var rail = document.getElementById('rail');
  if (btn && rail) {
    btn.addEventListener('click', function () {
      var open = rail.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  var tablist = document.querySelector('.tabs');
  if (tablist) {
    var tabs = [].slice.call(tablist.querySelectorAll('[role="tab"]'));

    var activate = function (tab) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (history.replaceState) history.replaceState(null, '', '#' + tab.id);
    };

    tabs.forEach(function (t, i) {
      t.tabIndex = i === 0 ? 0 : -1;
      t.addEventListener('click', function () { activate(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        var n = (i + d + tabs.length) % tabs.length;
        tabs[n].focus();
        activate(tabs[n]);
      });
    });

    var fromHash = tabs.filter(function (t) { return '#' + t.id === location.hash; })[0];
    if (fromHash) activate(fromHash);
  }

  var list = document.getElementById('checklist');
  if (!list) return;
  var KEY = 'hanoi-sapa-booking-v2';
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) {}

  [].forEach.call(list.querySelectorAll('input[data-k]'), function (box) {
    var k = box.getAttribute('data-k');
    box.checked = !!saved[k];
    box.closest('li').classList.toggle('done', box.checked);
    box.addEventListener('change', function () {
      saved[k] = box.checked;
      box.closest('li').classList.toggle('done', box.checked);
      try { localStorage.setItem(KEY, JSON.stringify(saved)); } catch (e) {}
    });
  });
})();
