
/**
 * Given a starting point, a margin, a size, and a count, return the next point.
 * @param start - The starting position of the first item
 * @param margin - the margin between each element
 * @param size - the size of the element
 * @param count - The number of the item in the list.
 * @returns The value of the calculation.
 */
const calculate = (start, margin, size, count) => {
    return (start) + (count * size) + (margin * count)
}

/**
 * It takes a size, row, and column and returns an object with x and y coordinates.
 * @param startX - The starting position of the first item on the X axis
 * @param startY - The starting position of the first item on the Y axis
 * @param marginX - the margin between each element on the X axis
 * @param marginY - the margin between each element on the Y axis
 * @param size - the size of the square
 * @param row - the row number on the page
 * @param column - the column number in the row
 * @returns An object with two properties, x and y.
 */
const getCoordinates = (startX, startY, marginX, marginY, size, row, column) => {
    const x = calculate(startX, marginX, size, column);
    const y = calculate(startY, marginY, size, row);
    return { x, y }
}

const coordinates = {
    get: getCoordinates
}
//module.exports = { coordinates };
export default { coordinates };
