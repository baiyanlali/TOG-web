export async function get_file(file_name){
    const file = await fetch(file_name)
    return await file.json()
}

export const slice = (array, sx, ex, sy, ey) => array.slice(sx, ex + 1).map(i => i.slice(sy, ey + 1))

export const find = (array, key) => {
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        for (let j = 0; j < element.length; j++) {
            const e = element[j];
            if(e === key){
                return [i, j]
            }
        }
    }
    return [-1, -1]
}

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
