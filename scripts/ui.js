// UI 헬퍼 함수 모듈

export function createElement(tag, className = '', content = '') {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (content) {
    if (typeof content === 'string') {
      element.textContent = content;
    } else {
      element.appendChild(content);
    }
  }
  return element;
}

export function createButton(text, className = '', onClick = null) {
  const button = createElement('button', `pixel-button ${className}`, text);
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

export function createBadge(text, color = 'secondary') {
  return createElement('span', `pixel-badge pixel-badge--${color}`, text);
}

export function createProgressBar(value, max = 100, showPercentage = false, color = 'accent') {
  const percentage = Math.min(100, (value / max) * 100);

  const container = createElement('div', 'pixel-progress');
  const bar = createElement('div', `pixel-progress-bar pixel-progress-bar--${color}`);
  bar.style.width = `${percentage}%`;
  container.appendChild(bar);

  if (showPercentage) {
    const text = createElement('div', 'pixel-progress-text', `${Math.round(percentage)}%`);
    container.appendChild(text);
  }

  return container;
}

export function updateProgressBar(progressBar, value, max = 100) {
  const percentage = Math.min(100, (value / max) * 100);
  const bar = progressBar.querySelector('.pixel-progress-bar');
  if (bar) {
    bar.style.width = `${percentage}%`;
  }
  const text = progressBar.querySelector('.pixel-progress-text');
  if (text) {
    text.textContent = `${Math.round(percentage)}%`;
  }
}

export function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

export function showElement(element) {
  element.classList.remove('hidden');
}

export function hideElement(element) {
  element.classList.add('hidden');
}

export function createCard(clickable = false) {
  const className = clickable ? 'pixel-card pixel-card--clickable' : 'pixel-card';
  return createElement('div', className);
}

export function createImage(src, alt = '', className = 'pixel-art') {
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.className = className;
  return img;
}
