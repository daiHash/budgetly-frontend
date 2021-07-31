export const undefinedToZero = (data: Array<number | undefined>) => {
  return data.map((v) => {
    return v ?? 0
  })
}
