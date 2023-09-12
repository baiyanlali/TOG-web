export async function get_file(file_name) {
    const file = await fetch(file_name)
    return await file.json()
}

export function New2DArray(j, k, fill) {
    return Array(j)
        .fill(fill)
        .map(() => Array(k).fill(fill));
}


/** 
* 填充二维矩阵
* @param {Array} array - 传入矩阵
* @param {Number} row - 矩阵长度
* @param {Number} column - 矩阵宽度
* @param {Number} sx - 矩阵x开始padding位置(在新的padding的数组中)
* @param {Number} sy - 矩阵y开始padding位置(在新的padding的数组中)
* @return {Array} 填充后的二维矩阵
*/

export const padding = (array, row, column, sx, sy, default_val = 0) => {
    const ret = New2DArray(row, column, default_val)
    for (let i = sx < 0 ? -sx : 0; i < Math.min(array.length, row - sx); i++) {
        for (let j = sy < 0 ? -sy : 0; j < Math.min(array[i].length, column - sy); j++) {
            ret[sx + i][sy + j] = array[i][j];
        }
    }
    return ret
}
/**
 * 将当前数组切出一部分
 * @param {Array} array 输入数组
 * @param {Number} sx 开始x(包括)
 * @param {Number} ex 结束x(不包括)
 * @param {Number} sy 开始y(包括)
 * @param {Number} ey 结束y(不包括)
 * @param {any} default_val 填充值
 * @returns 返回数组
 */
export const slice = (array, sx, ex, sy, ey, default_val = 'black') => {
    if (sx < 0 || ex >= array.length || sy < 0 || ey >= array[0].length) {
        //注释掉的这一段代码也可以用，但是为了universal选了使用padding的方法
        // const ret = New2DArray(ex - sx, ey - sy, default_val)

        // for (let i = Math.max(sx, 0); i < Math.min(ex, array.length); i++) {
        //     for (let j = Math.max(sy, 0); j < Math.min(ey, array[i].length); j++) {
        //         ret[i-sx][j-sy] = array[i][j]
        //     }
        // }

        // return ret

        //为了使用padding写了一段非常复杂的代码，但是 it just works
        const startx = Math.min(sx, 0)
        const endx = Math.max(ex, array.length)
        const starty = Math.min(sy, 0)
        const endy = Math.max(ey, array[0].length)
        const ret = padding(array, endx - startx, endy - starty, -startx, -starty, default_val)
        return ret.slice(sx < 0 ? 0 : sx, sx < 0 ? ex - sx : ex).map(i => i.slice(sy < 0 ? 0 : sy, sy < 0 ? ey - sy : ey))
    } else {
        return array.slice(sx, ex).map(i => i.slice(sy, ey))
    }
}

export const find = (array, key) => {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        for (let j = 0; j < element.length; j++) {
            const e = element[j];
            if (e.includes(key)) {
                return [i, j]
            }
        }
    }
    return [-1, -1]
}

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))


export function print2DArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        let row = "";
        for (let j = 0; j < arr[i].length; j++) {
            row += arr[i][j] + "\t"; // 使用制表符分隔每个元素
        }
        console.log(row);
    }
}

export function minus(arr1, arr2){
    const arr = []
    for (let i = 0; i < Math.min(arr1.length, arr2.length); i++) {
        arr.push(arr1[i] - arr2[i])        
    }
    return arr
}


// Code from https://stackoverflow.com/questions/65361477/how-to-generate-color-from-colormap-in-javascript
// Author: https://stackoverflow.com/users/12466239/robert


  
const scale = {
min: {value: -50, hue: 1},
max: {value: 50, hue: 245}
} 

export function temperatureToColor(temp){

    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
          const k = (n + h / 30) % 12;
          const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
          return Math.round(255 * color).toString(16).padStart(2, '0');  
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    temp = Math.min(scale.max.value, Math.max(scale.min.value, temp));
    const range = scale.max.value - scale.min.value;
    const hueRange = scale.max.hue - scale.min.hue;
    const value =  (temp - scale.min.value) / range;
    const hue = scale.max.hue - hueRange * value;
    
    return hslToHex(hue, 100, 50)
}
  