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

  var list = document.getElementById('checklist') || document.querySelector('.booklist');
  var start = document.body.getAttribute('data-start');

  // 截止期：按今日重算，唔靠 build 當日
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
