export async function get_file(file_name){
    const file = await fetch(file_name)
    return await file.json()
}

export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
