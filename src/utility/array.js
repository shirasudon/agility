// @format

export function insertOrdered(array, element, comparator = (a, b) => a - b) {
  const index = locationOf(array, element, 0, array.length, comparator)
  array.splice(index + 1, 0, element)
  return array
}

export function locationOf(
  array,
  element,
  start,
  end,
  comparator = (a, b) => a - b
) {
  const pivot = parseInt(start + (end - start) / 2, 10)
  if (end - start <= 1 || !comparator(array[pivot], element)) {
    return pivot
  }
  if (comparator(array[pivot], element) < 0) {
    return locationOf(array, element, pivot, end)
  } else {
    return locationOf(array, element, start, pivot)
  }
}
