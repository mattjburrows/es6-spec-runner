export function getBreakpoint() {
  if (window.matchMedia('(min-width: 1280px)').matches) {
    return 5;
  }

  if (window.matchMedia('(min-width: 1008px)').matches) {
    return 4;
  }

  if (window.matchMedia('(min-width: 600px)').matches) {
    return 3;
  }

  if (window.matchMedia('(min-width: 400px)').matches) {
    return 2;
  }
  
  return 1;
}
