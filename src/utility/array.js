// @format

export function insertOrdered(array, element, comparer = (a, b) => a - b) {
  const index = locationOf(array, element, 0, array.length, comparer)
  array.splice(index + 1, 0, element)
  return array
}

export function locationOf(
  array,
  element,
  start,
  end,
  comparer = (a, b) => a - b
) {
  if (array.length === 0) {
    return -1
  }

  start = start || 0
  end = end || array.length
  const pivot = (start + end) >> 1

  const c = comparer(element, array[pivot])
  if (end - start <= 1) {
    return c < 0 ? pivot - 1 : pivot
  }

  if (c < 0) {
    return locationOf(array, element, start, pivot, comparer)
  } else if (c === 0) {
    return pivot
  } else {
    return locationOf(array, element, pivot, end, comparer)
  }
}
