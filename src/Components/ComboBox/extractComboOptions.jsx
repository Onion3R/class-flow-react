export function extractComboOptions(data, columnKey, prefix = "") {
  const unique = [...new Set(data.map((item) => item[columnKey]))]
  return unique.map((value) => ({
    label: prefix ? `${prefix} ${value}` : String(value),
    value: value
  }))
}
