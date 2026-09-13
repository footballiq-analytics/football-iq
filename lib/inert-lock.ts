/** Multiple dialogs can lock the same shell during an orientation change. */
const locks = new WeakMap<HTMLElement, { count: number; previous: boolean }>();
export function lockInert(elements: HTMLElement[]) {
 for (const element of elements) {
  const entry = locks.get(element) ?? { count: 0, previous: element.inert };
  entry.count++; locks.set(element, entry); element.inert = true;
 }
 let released = false;
 return () => {
  if (released) return;
  released = true;
  for (const element of elements) {
   const entry = locks.get(element);
   if (!entry) continue;
   if (--entry.count === 0) { element.inert = entry.previous; locks.delete(element); }
  }
 };
}
