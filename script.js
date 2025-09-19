/* ============================
   script.js - global behaviors
   ============================ */

/* THEME toggle */
(function themeInit(){
  const btn = document.getElementById('theme-toggle');
  if(!btn) return;
  const saved = localStorage.getItem('theme-mode');
  if(saved === 'dark') {
    document.body.classList.add('dark');
    btn.textContent = '☀️';
  } else { btn.textContent = '🌙'; }
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const mode = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme-mode', mode);
    btn.textContent = mode === 'dark' ? '☀️' : '🌙';
  });
})();

/* MOBILE menu toggle */
(function menuInit(){
  const mBtn = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if(!mBtn || !nav) return;
  mBtn.addEventListener('click', () => nav.classList.toggle('show'));
})();

/* COUNTDOWN with next holiday */
(function countdownInit(){
  const elDays = document.getElementById('days');
  const elHours = document.getElementById('hours');
  const elMinutes = document.getElementById('minutes');
  const elSeconds = document.getElementById('seconds');
  const container = document.getElementById('countdown-timer');

  const holidays = [
    { date: '2025-10-10T00:00:00', label: 'Ngày Giải phóng Thủ đô' },
    { date: '2025-12-31T00:00:00', label: 'Tết Dương lịch' },
    { date: '2026-04-30T00:00:00', label: 'Giải phóng miền Nam' }
  ];

  function getNextHoliday(){
    const now = new Date();
    return holidays.find(h => new Date(h.date) > now);
  }

  let currentHoliday = getNextHoliday();

  function update(){
    if(!currentHoliday) return;
    const now = new Date();
    let diff = new Date(currentHoliday.date).getTime() - now.getTime();

    if(diff <= 0){
      currentHoliday = getNextHoliday();
      if(!currentHoliday){
        container.innerHTML = '<div style="color:#fff;padding:12px 18px;font-weight:700">🎉 Hết sự kiện!</div>';
        clearInterval(tick);
      }
      return;
    }

    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const minutes = Math.floor(diff / (1000*60));
    diff -= minutes * (1000*60);
    const seconds = Math.floor(diff / 1000);

    if(elDays) elDays.textContent = days;
    if(elHours) elHours.textContent = String(hours).padStart(2,'0');
    if(elMinutes) elMinutes.textContent = String(minutes).padStart(2,'0');
    if(elSeconds) elSeconds.textContent = String(seconds).padStart(2,'0');
  }

  update();
  const tick = setInterval(update, 1000);
})();

/* Calendar highlight + click to countdown */
(function holidayCalendar(){
  const table = document.getElementById('holiday-table');
  if(!table) return;
  const rows = table.querySelectorAll('tr[data-date]');
  const today = new Date();
  const todayStr = `${String(today.getDate()).padStart(2,'0')}/${String(today.getMonth()+1).padStart(2,'0')}`;

  rows.forEach(r=>{
    if(r.getAttribute('data-date')===todayStr){
      r.classList.add('highlight');
    }
    r.addEventListener('click', ()=>{
      const dateStr = r.getAttribute('data-date') + '/2025';
      const [day,month,year] = dateStr.split('/');
      const target = new Date(`${year}-${month}-${day}T00:00:00`);
      alert(`Đếm ngược đến: ${r.lastElementChild.textContent}`);
      // có thể trigger countdown thay thế
    });
  });
})();

/* BANNER parallax */
(function bannerParallax(){
  const banner = document.querySelector('.banner');
  if(!banner) return;
  const layer = banner.querySelector('.parallax-layer');
  if(!layer) return;

  let ticking = false;
  function onScroll(){
    if(ticking) return;
    window.requestAnimationFrame(()=>{
      const rect = banner.getBoundingClientRect();
      const winH = window.innerHeight;
      const progress = (rect.top+rect.height/2 - winH/2)/(winH/2);
      const move = Math.max(-18, Math.min(18, -progress*12));
      layer.style.transform = `translateY(${move}px)`;
      ticking = false;
    });
    ticking = true;
  }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  onScroll();
})();
