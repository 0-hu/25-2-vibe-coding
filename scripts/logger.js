// ============================================
// Logger System - 로그를 수집하고 저장
// ============================================

const LOG_STORAGE_KEY = 'uc:debug_logs';
const MAX_LOGS = 1000;

class Logger {
  constructor() {
    this.logs = [];
    this.startTime = Date.now();
    this.isPanelOpen = false;
    this.interceptConsole();
    this.createDebugIcon();
  }

  getTimestamp() {
    const elapsed = Date.now() - this.startTime;
    const seconds = (elapsed / 1000).toFixed(3);
    return `[${seconds}s]`;
  }

  addLog(level, args) {
    const timestamp = this.getTimestamp();
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');

    const logEntry = {
      timestamp: new Date().toISOString(),
      elapsed: timestamp,
      level,
      message
    };

    this.logs.push(logEntry);

    // localStorage에 저장 (최대 개수 제한)
    if (this.logs.length > MAX_LOGS) {
      this.logs.shift();
    }

    try {
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      // localStorage가 가득 찬 경우
      this.logs = this.logs.slice(-500);
      localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(this.logs));
    }
  }

  interceptConsole() {
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args) => {
      this.addLog('LOG', args);
      originalLog.apply(console, args);
    };

    console.error = (...args) => {
      this.addLog('ERROR', args);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.addLog('WARN', args);
      originalWarn.apply(console, args);
    };
  }

  downloadLogs() {
    const logText = this.logs.map(log =>
      `${log.timestamp} ${log.elapsed} [${log.level}] ${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unsplash-worldcup-log-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('📥 로그 파일 다운로드 완료');
  }

  clearLogs() {
    this.logs = [];
    localStorage.removeItem(LOG_STORAGE_KEY);
    console.log('🗑️ 로그 초기화 완료');
  }

  getLogs() {
    return this.logs;
  }

  createDebugIcon() {
    // 페이지 로드 후 아이콘 생성
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this._createIcon());
    } else {
      this._createIcon();
    }
  }

  _createIcon() {
    const icon = document.createElement('div');
    icon.id = 'debug-icon';
    icon.textContent = '🐛';
    icon.title = '디버그 콘솔 열기 (F2)';
    icon.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: rgba(0, 255, 0, 0.8);
      border: 2px solid #0f0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      z-index: 9998;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
      transition: transform 0.2s, background 0.2s;
    `;

    icon.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.1)';
      icon.style.background = 'rgba(0, 255, 0, 1)';
    });

    icon.addEventListener('mouseleave', () => {
      icon.style.transform = 'scale(1)';
      icon.style.background = 'rgba(0, 255, 0, 0.8)';
    });

    icon.addEventListener('click', () => {
      this.toggleDebugPanel();
    });

    document.body.appendChild(icon);
  }

  toggleDebugPanel() {
    const existingPanel = document.getElementById('debug-panel');
    if (existingPanel) {
      existingPanel.remove();
      this.isPanelOpen = false;
    } else {
      this.showDebugPanel();
      this.isPanelOpen = true;
    }
  }

  showDebugPanel() {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = `
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      max-height: 300px;
      background: rgba(0, 0, 0, 0.95);
      color: #0f0;
      font-family: 'Courier New', monospace;
      font-size: 10px;
      overflow-y: auto;
      padding: 10px;
      border-top: 2px solid #0f0;
      z-index: 9999;
    `;

    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #0f0;
    `;

    const title = document.createElement('span');
    title.textContent = '🐛 DEBUG LOG';
    title.style.fontWeight = 'bold';

    const buttons = document.createElement('div');

    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '💾 다운로드';
    downloadBtn.style.cssText = 'margin: 0 5px; padding: 2px 8px; background: #0f0; color: #000; border: none; cursor: pointer;';
    downloadBtn.onclick = () => this.downloadLogs();

    const clearBtn = document.createElement('button');
    clearBtn.textContent = '🗑️ 초기화';
    clearBtn.style.cssText = 'margin: 0 5px; padding: 2px 8px; background: #f00; color: #fff; border: none; cursor: pointer;';
    clearBtn.onclick = () => {
      this.clearLogs();
      logContent.innerHTML = '';
    };

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✖ 닫기';
    closeBtn.style.cssText = 'margin: 0 5px; padding: 2px 8px; background: #ff0; color: #000; border: none; cursor: pointer;';
    closeBtn.onclick = () => {
      panel.remove();
      this.isPanelOpen = false;
    };

    buttons.appendChild(downloadBtn);
    buttons.appendChild(clearBtn);
    buttons.appendChild(closeBtn);

    header.appendChild(title);
    header.appendChild(buttons);

    const logContent = document.createElement('div');
    logContent.id = 'log-content';
    logContent.style.cssText = 'white-space: pre-wrap; line-height: 1.4;';

    // 기존 로그 표시
    this.logs.forEach(log => {
      const color = {
        'ERROR': '#f00',
        'WARN': '#ff0',
        'LOG': '#0f0'
      }[log.level] || '#0f0';

      const line = document.createElement('div');
      line.style.color = color;
      line.textContent = `${log.elapsed} [${log.level}] ${log.message}`;
      logContent.appendChild(line);
    });

    // 스크롤을 맨 아래로
    setTimeout(() => {
      logContent.scrollTop = logContent.scrollHeight;
    }, 100);

    panel.appendChild(header);
    panel.appendChild(logContent);
    document.body.appendChild(panel);

    // 새 로그가 추가될 때마다 업데이트
    const originalAddLog = this.addLog.bind(this);
    this.addLog = (level, args) => {
      originalAddLog(level, args);

      const color = {
        'ERROR': '#f00',
        'WARN': '#ff0',
        'LOG': '#0f0'
      }[level] || '#0f0';

      const line = document.createElement('div');
      line.style.color = color;
      line.textContent = `${this.getTimestamp()} [${level}] ${args.join(' ')}`;

      const panel = document.getElementById('log-content');
      if (panel) {
        panel.appendChild(line);
        panel.scrollTop = panel.scrollHeight;
      }
    };

    console.log('🐛 디버그 패널 활성화');
  }
}

// 전역 로거 인스턴스 생성
window.logger = new Logger();

console.log('✅ Logger system initialized');
