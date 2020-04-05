const { once } = require('events')
const { createReadStream, writeFile, readdir } = require('fs')
const { createInterface } = require('readline')

let uniqueValue = new Set()

const modifyArr = (arr) => {
  let temp = []
  // for (let i of arr) {
  //   temp.push(i + '\n')
  // }
  for (let i = 0; i < 2; i++) {
    temp.push(arr[i] + '\n')
  }
  return temp
}

const processLineByLine = async (filePath) => {
  try {
    const rl = createInterface({
      input: createReadStream('SUCCES_KEY/' + filePath),
      crlfDelay: Infinity,
    })

    rl.on('line', (line) => {
      if (!uniqueValue.has(line)) {
        uniqueValue.add(line)
      }
    })
    await once(rl, 'close')

    return modifyArr(Array.from(uniqueValue))
  } catch (err) {
    console.error(err)
  }
}

const removeDuplicateAndWrite = async (fileName) => {
  const dataFile = await processLineByLine(fileName)
  const resultFileName = `R-${fileName}`
  await writeFile(resultFileName, dataFile, { flag: 'w+' }, (err) => console.error(err))
}

const FUCK_ALL_KEYS = (dirPath = __dirname + '/SUCCES_KEY') => {
  readdir(dirPath, async (err, fileNames) => {
    if (err) console.log(err)
    await fileNames.forEach(async (fileName) => {
      if (/.txt$/.test(fileName)) {
        await removeDuplicateAndWrite(fileName)
      }
    })
  })
  console.log('🌈 Đã xoá hết những dòng lặp! Bây h 1 là dùng tool, 2 là tự ôn cmm đi 🥳')
}

FUCK_ALL_KEYS()
