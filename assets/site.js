// 小量互動：手機選單、分頁、checklist 記憶、截止期倒數。
(function () {
  var btn = document.getElementById('menuBtn');
  var rail = document.getElementById('rail');
  if (btn && rail) {
    btn.addEventListener('click', function () {
      var open = rail.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- tabs (河內 2 日) ---------- */
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

  /* ---------- 截止期倒數 ---------- */
  var start = document.body.getAttribute('data-start');
  if (start) {
    var daysLeft = Math.ceil((Date.parse(start + 'T00:00:00') - Date.now()) / 86400000);
    [].forEach.call(document.querySelectorAll('[data-lead]'), function (el) {
      var need = daysLeft - Number(el.getAttribute('data-lead'));
      if (daysLeft < 0) {
        el.textContent = '已出發';
      } else if (need > 0) {
        el.textContent = need + ' 日內';
      } else {
        el.textContent = '即訂';
        el.classList.add('now');
      }
    });
  }

  /* ---------- booking checklist ---------- */
  var list = document.getElementById('checklist') || document.querySelector('.booklist');
  if (!list) return;

  var KEY = 'hanoi-sapa-booking-v3';
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
