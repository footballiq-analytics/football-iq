/** Keep quarter-million prices visible; never round 5.25M up to 5.3M. */
export function formatFantasyPrice(value: number): string {
 return value.toFixed(2).replace(/0$/, "");
}
