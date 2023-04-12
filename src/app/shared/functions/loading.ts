/**
 * Function to toggle loading state display
 *
 * @param ms - time to toggle loading state
 * @returns resolves promise within specified time
 */
export function sleep(ms: number): Promise<any> {
  return new Promise((res) => setTimeout(res, ms));
}
