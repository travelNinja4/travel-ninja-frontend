/**
 * used to handle api error
 *
 */

export const errorHandler = (err: any): string[] => {
  if (err && !err.success && err.message) {
    return [err.message];
  }

  if (Array.isArray(err)) {
    return err.map((e) => e.msg);
  }

  return [err?.message || 'Something went wrong'];
};
