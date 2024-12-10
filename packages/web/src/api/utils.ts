export const toQueryString = <T extends object>(opts?: T) => {
  if (!opts) return ''
  const keys = Object.keys(opts)
  const queryString = keys.reduce((all, key) => (all += `&${key}=${opts[key as keyof T]}`), '')
  return queryString.replace(/^&/, '?')
}
