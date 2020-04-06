const { once } = require('events')
const { createReadStream, createWriteStream, writeFileSync, readdirSync } = require('fs')
const { createInterface } = require('readline')

/**
 *
 * @param {String} line
 */
const trimLine = (line) => {
  if (line === '') return
  let lineTrim = line.split('|')
  lineTrim[0] = lineTrim[0].trimRight()
  lineTrim[1] = lineTrim[1].trimLeft().toLowerCase()
  return lineTrim.join(' | ')
}

const modifyArr = (arr) => {
  let temp = []
  for (let i of arr) {
    temp.push(i)
  }
  return temp
}

const processLineByLine = async (filePath) => {
  let uniqueValue = new Set()
  try {
    const rl = await createInterface({
      input: createReadStream('SOURCES_KEY/' + filePath),
      crlfDelay: 5000,
    })
    await rl.on('line', (line) => {
      line = trimLine(line)
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

const transformArrayToTxt = (arrData) => arrData.join('\r\n')

const removeDuplicateAndWrite = async (fileName) => {
  const dataFile = await processLineByLine(fileName)
  const resultFileName = `R-${fileName}`
  writeFileSync(__dirname + '/SUCCESS_KEY/' + resultFileName, transformArrayToTxt(dataFile), {
    flag: 'w+',
    encoding: 'utf-8',
  })
}

const getKeyName = (dirPath = __dirname + '/SOURCES_KEY') => {
  return readdirSync(dirPath)
}

const bootstrap = () => {
  const keysName = getKeyName()
  keysName.forEach((keyName) => {
    removeDuplicateAndWrite(keyName)
  })
  console.log('🌈 Đã xoá hết những dòng lặp! Bây h 1 là dùng tool, 2 là tự ôn cmm đi 🥳')
}

bootstrap()
