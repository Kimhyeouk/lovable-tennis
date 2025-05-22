// 1) 초기 데이터
const coaches = [
  { id: 1, name: '박소연 프로' },
  { id: 2, name: '현종호 코치' },
  { id: 3, name: '이민정 코치' },
];

let reservations = []; 
// { date: '2025-05-22', slot: '06:00', coachId: 1, member: '홍길동', type: 'individual' }

const datePicker = document.getElementById('datePicker');
const lessonType = document.getElementById('lessonType');
const scheduleEl = document.getElementById('schedule');
const modal = document.getElementById('modal');
const coachSelect = document.getElementById('coachSelect');
const memberName = document.getElementById('memberName');
const reservationForm = document.getElementById('reservationForm');
const cancelBtn = document.getElementById('cancelBtn');

let selectedSlot = null;

// 2) 날짜 초기값 세팅 (오늘)
datePicker.valueAsDate = new Date();

// 3) 코치 셀렉트 옵션 생성
coaches.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c.id;
  opt.textContent = c.name;
  coachSelect.appendChild(opt);
});

// 4) 스케줄 생성 함수
function generateSlots() {
  scheduleEl.innerHTML = '';
  const date = datePicker.value;
  const type = lessonType.value;
  
  // 06:00 ~ 23:00, 20분 단위
  for (let h = 6; h < 23; h++) {
    for (let m = 0; m < 60; m += 20) {
      const time = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      const slotEl = document.createElement('div');
      slotEl.className = 'slot';
      slotEl.textContent = time;
      slotEl.dataset.time = time;
      
      // 이미 예약된 경우
      const booked = reservations.find(r => r.date === date && r.slot === time && r.type === type);
      if (booked) {
        slotEl.classList.add('booked');
        slotEl.textContent += `\n(${coaches.find(c=>c.id===booked.coachId).name})`;
      } else {
        slotEl.addEventListener('click', openModal);
      }
      
      scheduleEl.appendChild(slotEl);
    }
  }
}

// 5) 모달 열기
function openModal(e) {
  selectedSlot = e.currentTarget.dataset.time;
  modal.classList.remove('hidden');
}

// 6) 예약 폼 제출
reservationForm.addEventListener('submit', evt => {
  evt.preventDefault();
  reservations.push({
    date: datePicker.value,
    slot: selectedSlot,
    coachId: parseInt(coachSelect.value),
    member: memberName.value.trim(),
    type: lessonType.value
  });
  modal.classList.add('hidden');
  memberName.value = '';
  generateSlots();
});

// 7) 모달 취소
cancelBtn.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// 8) 날짜/레슨 종류 변경 시 재생성
datePicker.addEventListener('change', generateSlots);
lessonType.addEventListener('change', generateSlots);

// 초기 렌더
generateSlots();
