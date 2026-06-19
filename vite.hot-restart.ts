import type { Plugin } from 'vite';

// Перезапускает Electron main-процесс через встроенный в forge механизм `rs`
// (forge слушает stdin: строка "rs" триггерит рестарт main-процесса).
//
// Первый (initial) билд пропускаем — иначе рестарт случился бы сразу на старте.
// В проде (`make`/`package`) closeBundle срабатывает ровно один раз, поэтому
// 'rs' там никогда не эмитится — плагин безопасно держать в конфиге всегда.
export function hotRestart(): Plugin {
  let started = false;
  return {
    name: 'electron-forge:hot-restart',
    closeBundle() {
      if (!started) {
        started = true;
        return;
      }
      process.stdin.emit('data', 'rs');
    },
  };
}
