const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#main-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const expanded = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!expanded));
  menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('is-open', !expanded);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

// Decorative waveform, not a visualization of real patient audio.
const waveform = document.querySelector('.waveform');
for (let index = 0; index < 55; index++) {
  const bar = document.createElement('span');
  const envelope = Math.sin((index / 54) * Math.PI);
  const height = 5 + envelope * (12 + Math.abs(Math.sin(index * 1.73)) * 34);
  bar.style.setProperty('--height', `${height}px`);
  bar.style.setProperty('--opacity', String(0.25 + envelope * 0.7));
  bar.style.setProperty('--delay', `${-index * 0.11}s`);
  waveform.appendChild(bar);
}

const scenarios = {
  booking: {
    title: '“I’d like to see a cardiologist tomorrow.”',
    description: 'The patient gives a speciality and date. Voice-IQ checks the doctor’s schedule before offering a slot.',
    quote: '“Let me check the available slots. I’ll confirm the doctor, date and time with you before booking.”',
    steps: [
      ['Understand the request', 'Identify doctor or speciality and date.'],
      ['Check the right availability', 'Read the doctor schedule, leave and slots.'],
      ['Confirm, then book', 'Collect details and verify the selected appointment.'],
      ['Keep the outcome visible', 'The appointment is available to the hospital team.']
    ]
  },
  enquiry: {
    title: '“Is the thyroid test available at your hospital?”',
    description: 'The caller needs a specific answer. Voice-IQ looks up the hospital’s configured lab test information.',
    quote: '“Let me check the test information for you. If the details aren’t available, I can arrange a callback from the team.”',
    steps: [
      ['Identify the question', 'Capture the test name in the patient’s words.'],
      ['Look up hospital information', 'Use the configured lab test information source.'],
      ['Give a supported answer', 'Share available details without guessing.'],
      ['Keep context for review', 'The call transcript and summary remain available.']
    ]
  },
  callback: {
    title: '“Could someone help me reschedule my visit?”',
    description: 'A request needs staff support. Voice-IQ captures the reason and context for a callback rather than claiming the change is complete.',
    quote: '“I’ll note your reschedule request for the hospital team to follow up. Your appointment has not been changed yet.”',
    steps: [
      ['Recognise the follow-up need', 'Identify a reschedule or unresolved request.'],
      ['Create a callback request', 'Record the reason and available patient context.'],
      ['Give staff the full picture', 'Review the linked call, notes and callback history.'],
      ['Track the next action', 'Log attempts, schedule a callback and record resolution.']
    ]
  }
};
const tabs = [...document.querySelectorAll('[data-scenario]')];
function selectScenario(tab) {
  const scenario = scenarios[tab.dataset.scenario];
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
  });
  document.querySelector('#scenario-panel').setAttribute('aria-labelledby', tab.id);
  document.querySelector('#scenario-title').textContent = scenario.title;
  document.querySelector('#scenario-description').textContent = scenario.description;
  document.querySelector('#scenario-quote').textContent = scenario.quote;
  const steps = document.querySelector('#scenario-steps');
  steps.replaceChildren();
  scenario.steps.forEach(([title, description]) => {
    const row = document.createElement('div');
    const check = document.createElement('span');
    check.className = 'step-check';
    check.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-check"/></svg>';
    const text = document.createElement('p');
    text.textContent = title;
    const detail = document.createElement('span');
    detail.textContent = description;
    text.appendChild(detail);
    row.append(check, text);
    steps.appendChild(row);
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectScenario(tab));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex !== undefined) {
      event.preventDefault();
      selectScenario(tabs[nextIndex]);
      tabs[nextIndex].focus();
    }
  });
});
