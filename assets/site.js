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
