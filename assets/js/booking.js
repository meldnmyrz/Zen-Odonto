/**
 * ZEN ODONTO — CLÍNICA DENTAL Y FACIAL
 * Interactive Booking, Price Calculator & Smile Assessment Quiz
 */

document.addEventListener('DOMContentLoaded', () => {
  initTreatmentCalculator();
  initSmileQuiz();
  initBookingSystem();
  initTreatmentFilters();
});

/* ==========================================================================
   1. CALCULADORA DE TRATAMIENTOS INTERACTIVA
   ========================================================================== */
function initTreatmentCalculator() {
  const calcItems = document.querySelectorAll('.calc-checkbox-item');
  const selectedListEl = document.getElementById('calcSelectedItems');
  const subtotalEl = document.getElementById('calcSubtotal');
  const discountEl = document.getElementById('calcDiscount');
  const totalEl = document.getElementById('calcTotal');
  const sendCalcBtn = document.getElementById('sendCalcWhatsapp');

  if (!calcItems.length || !totalEl) return;

  function updateTotals() {
    let subtotal = 0;
    let selectedNames = [];

    calcItems.forEach(item => {
      if (item.classList.contains('checked')) {
        const price = parseFloat(item.getAttribute('data-price') || 0);
        const name = item.getAttribute('data-name');
        subtotal += price;
        selectedNames.push({ name, price });
      }
    });

    // Descuento de cortesía primera cita Zen (10% si se seleccionan 2 o más tratamientos)
    let discount = 0;
    if (selectedNames.length >= 2) {
      discount = subtotal * 0.10;
    }

    const total = Math.max(0, subtotal - discount);

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString('es-MX')} MXN`;
    if (discountEl) discountEl.textContent = discount > 0 ? `-$${discount.toLocaleString('es-MX')} MXN (10% Especial)` : `$0 MXN`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString('es-MX')} MXN`;

    if (selectedListEl) {
      if (selectedNames.length === 0) {
        selectedListEl.innerHTML = `<li class="calc-line-item"><em>Selecciona tratamientos de la lista</em></li>`;
      } else {
        selectedListEl.innerHTML = selectedNames.map(item => `
          <li class="calc-line-item">
            <span>${item.name}</span>
            <span>$${item.price.toLocaleString('es-MX')} MXN</span>
          </li>
        `).join('');
      }
    }

    // Actualizar enlace de WhatsApp
    if (sendCalcBtn) {
      if (selectedNames.length === 0) {
        sendCalcBtn.classList.add('disabled');
        sendCalcBtn.setAttribute('href', '#');
      } else {
        sendCalcBtn.classList.remove('disabled');
        const itemsText = selectedNames.map(i => `• ${i.name} ($${i.price} MXN)`).join('%0A');
        const text = `¡Hola Zen Odonto! 👋 Me interesa cotizar los siguientes tratamientos en la clínica de Costera 125:%0A%0A${itemsText}%0A%0ATotal estimado: $${total.toLocaleString('es-MX')} MXN%0A%0A¿Tienen disponibilidad esta semana?`;
        sendCalcBtn.setAttribute('href', `https://wa.me/527445060571?text=${text}`);
      }
    }
  }

  calcItems.forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      updateTotals();
    });
  });

  updateTotals();
}

/* ==========================================================================
   2. EVALUADOR DE SONRISA VIRTUAL (SMILE QUIZ)
   ========================================================================== */
function initSmileQuiz() {
  const quizSteps = document.querySelectorAll('.quiz-step');
  const progressFill = document.querySelector('.quiz-progress-fill');
  const nextBtns = document.querySelectorAll('.quiz-next-btn');
  const restartBtn = document.getElementById('restartQuizBtn');
  const quizResultBox = document.getElementById('quizResultBox');

  if (!quizSteps.length) return;

  let currentStep = 1;
  const answers = {
    objective: '',
    anxiety: '',
    timing: ''
  };

  // Click on options
  document.querySelectorAll('.quiz-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const parent = card.closest('.quiz-step');
      parent.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const field = card.getAttribute('data-field');
      const value = card.getAttribute('data-value');
      answers[field] = value;

      const nextBtn = parent.querySelector('.quiz-next-btn');
      if (nextBtn) nextBtn.removeAttribute('disabled');
    });
  });

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < 3) {
        currentStep++;
        goToStep(currentStep);
      } else {
        showResults();
      }
    });
  });

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentStep = 1;
      document.querySelectorAll('.quiz-option-card').forEach(c => c.classList.remove('selected'));
      goToStep(1);
    });
  }

  function goToStep(step) {
    quizSteps.forEach(s => s.classList.remove('active'));
    const target = document.querySelector(`.quiz-step[data-step="${step}"]`);
    if (target) target.classList.add('active');

    if (progressFill) {
      const pct = (step / 3) * 100;
      progressFill.style.width = `${pct}%`;
    }
  }

  function showResults() {
    quizSteps.forEach(s => s.classList.remove('active'));
    if (quizResultBox) quizResultBox.classList.add('active');
    if (progressFill) progressFill.style.width = '100%';

    let diagnosis = 'Diagnóstico Integral Zen Odonto';
    let recommendation = 'Evaluación personalizada con el Dr. JV en Costera 125.';
    let icon = '✨';

    if (answers.objective === 'blanqueamiento') {
      diagnosis = 'Candidato Ideal para Blanqueamiento Philips Zoom!®';
      recommendation = 'Tu objetivo de mejorar el brillo y eliminar pigmentaciones se logra en una sola sesión de 45 minutos con tecnología Philips Zoom! de luz fría LED sin sensibilidad extrema.';
      icon = '💎';
    } else if (answers.objective === 'alineacion') {
      diagnosis = 'Plan de Alineación & Estética Funcional';
      recommendation = 'Recomendamos escaneo clínico para valorar alineadores invisibles o brackets estéticos sin molestias y a costos accesibles.';
      icon = '🦷';
    } else if (answers.objective === 'facial') {
      diagnosis = 'Protocolo de Armonización Facial & Bichectomía';
      recommendation = 'Perfilado del tercio inferior del rostro para estilizar facciones y complementar tu sonrisa con máxima simetría.';
      icon = '🌿';
    } else if (answers.objective === 'salud') {
      diagnosis = 'Tratamiento Conservador Sin Dolor';
      recommendation = 'Eliminación suave de caries con resina estética de alta definición y protocolo anti-ansiedad Zen.';
      icon = '🩺';
    }

    const anxietyNote = answers.anxiety === 'mucha' 
      ? ' Nota: Activaremos protocolo de relajación Zen con aromaterapia y técnicas mínimamente invasivas para tu total confort.' 
      : '';

    const recTitle = document.getElementById('quizRecTitle');
    const recText = document.getElementById('quizRecText');
    const waLink = document.getElementById('quizWhatsappLink');

    if (recTitle) recTitle.textContent = `${icon} ${diagnosis}`;
    if (recText) recText.textContent = `${recommendation}${anxietyNote}`;

    if (waLink) {
      const text = `¡Hola Zen Odonto! 👋 Completé el test de sonrisa en su sitio web.%0A%0A• Diagnóstico sugerido: ${diagnosis}%0A• Mi objetivo: ${answers.objective}%0A• Nivel de sensibilidad/ansiedad: ${answers.anxiety}%0A%0AMe gustaría agendar mi cita en Costera 125.`;
      waLink.setAttribute('href', `https://wa.me/527445060571?text=${text}`);
    }
  }
}

/* ==========================================================================
   3. SISTEMA DE RESERVAS INTELIGENTE + EXPORTACIÓN .ICS
   ========================================================================== */
function initBookingSystem() {
  const form = document.getElementById('zenBookingForm');
  const slotBtns = document.querySelectorAll('.time-slot-btn');
  const dateInput = document.getElementById('bookingDate');

  if (dateInput) {
    // Establecer fecha mínima como hoy
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  let selectedTime = '11:00 AM';

  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTime = btn.getAttribute('data-time') || btn.textContent.trim();
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName')?.value.trim();
      const phone = document.getElementById('bookingPhone')?.value.trim();
      const service = document.getElementById('bookingService')?.value;
      const date = document.getElementById('bookingDate')?.value;
      const notes = document.getElementById('bookingNotes')?.value.trim() || 'Sin observaciones adicionales';

      if (!name || !phone || !service || !date) {
        alert('Por favor completa todos los campos requeridos para coordinar tu cita.');
        return;
      }

      // 1. Mensaje de WhatsApp
      const waMsg = `¡Hola Zen Odonto! 👋 Deseo agendar mi cita:%0A%0A• Nombre: ${name}%0A• Teléfono: ${phone}%0A• Tratamiento: ${service}%0A• Fecha solicitada: ${date}%0A• Horario preferido: ${selectedTime}%0A• Notas: ${notes}%0A%0A¿Tienen disponibilidad en este horario en Costera 125?`;
      const waUrl = `https://wa.me/527445060571?text=${waMsg}`;

      // 2. Generar archivo .ics para el calendario del paciente
      downloadIcsCalendar(name, service, date, selectedTime);

      // 3. Abrir WhatsApp en nueva pestaña
      window.open(waUrl, '_blank');

      if (typeof showToast === 'function') {
        showToast('¡Cita registrada! Se descargó tu recordatorio y se abrió WhatsApp');
      }
    });
  }
}

function downloadIcsCalendar(name, service, dateStr, timeStr) {
  try {
    const [year, month, day] = dateStr.split('-');
    let hour = 11;
    let min = 0;

    if (timeStr.includes('PM')) {
      const match = timeStr.match(/(\d+):(\d+)/);
      if (match) {
        hour = parseInt(match[1]) + (parseInt(match[1]) === 12 ? 0 : 12);
        min = parseInt(match[2]);
      }
    } else if (timeStr.includes('AM')) {
      const match = timeStr.match(/(\d+):(\d+)/);
      if (match) {
        hour = parseInt(match[1]) === 12 ? 0 : parseInt(match[1]);
        min = parseInt(match[2]);
      }
    }

    const pad = n => String(n).padStart(2, '0');
    const startIso = `${year}${pad(month)}${pad(day)}T${pad(hour)}${pad(min)}00`;
    const endIso = `${year}${pad(month)}${pad(day)}T${pad(hour + 1)}${pad(min)}00`;

    const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Zen Odonto//Cita Dental//ES
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:Cita Dental Zen Odonto: ${service}
DESCRIPTION:Cita confirmada para ${name}. Servicio: ${service}. Clínica Zen Odonto, Costera 125, Acapulco. Tel: 744 506 0571.
LOCATION:Zen Odonto, Costera 125, Acapulco, Gro.
DTSTART:${startIso}
DTEND:${endIso}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Cita_Zen_Odonto_${dateStr}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Error generating calendar file:', err);
  }
}

/* ==========================================================================
   4. FILTRADO INTERACTIVO DE TRATAMIENTOS
   ========================================================================== */
function initTreatmentFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.treatment-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (category === 'all' || cardCat === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
