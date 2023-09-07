import { New2DArray, padding, print2DArray, slice } from "../utils.js";

const testPadding = () => {

    const originArr = New2DArray(2, 3, 0)

    print2DArray(originArr)

    console.log()

    print2DArray(padding(originArr, 7, 7, 1, 0, 2))

    console.log()

    print2DArray(padding(originArr, 7, 7, 1, 1, 2))

    console.log()

    print2DArray(padding(originArr, 7, 7, 5, 1, 2))


    console.log()

    print2DArray(padding(originArr, 7, 7, 6, 1, 2))

    console.log()

    print2DArray(padding(originArr, 7, 7, 7, 1, 2))

    console.log()

    print2DArray(padding(originArr, 7, 7, 1, 5, 2))

    console.log()

    print2DArray(padding(originArr, 7, 7, -1, 0, 2))
}

const testPadding2 = () => {
    const originArr = New2DArray(5, 5, 1)

    print2DArray(originArr)

    console.log()

    print2DArray(padding(originArr, 9, 9, -1, 0, 'a'))
}

const testSlice = () => {
    const arr = New2DArray(5, 5, 0)
    print2DArray(arr)
    console.log()
    print2DArray(slice(arr, 0, 3, 0, 3, 'a'))
    console.log()
    print2DArray(slice(arr, -1, 3, -1, 3, 'a'))
    console.log()
    print2DArray(slice(arr, -1, 8, -1, 8, 'a'))
}

// testPadding()
// testPadding2()

testSlice()