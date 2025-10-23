declare module 'dateformat' {
  function dateFormat(date: Date | string | number, mask?: string, utc?: boolean): string
  export = dateFormat
}
