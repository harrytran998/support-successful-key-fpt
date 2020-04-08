const { once } = require('events')
const { createReadStream, createWriteStream, writeFileSync, readdirSync } = require('fs')
const { createInterface } = require('readline')

/**
 * @description Cắt dòng và xử lý nó trả về format sau: question | answer
 * @param {String} line
 */
const trimLine = (line) => {
  const regex = ' | '
  // Nếu dòng ấy null => Chỉ lấy 1 dòng duy nhất trong cả file
  if (line === '') return
  // Chỉ khi nào thoả mãn thì mới xử lý, không thì next
  if (line.includes(regex)) {
    let lineTrim = line.split(regex)
    // Cho lower case xuống để loại bớt trùng lặp
    lineTrim[0] = lineTrim[0].trimRight().toLowerCase()
    lineTrim[1] = lineTrim[1].trimLeft().toLowerCase()
    return lineTrim.join(regex)
  }
}

/**
 * @description Đọc file và trả về 1 array Data tương ứng với format
 * @param {String} filePath
 */
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
    return Array.from(uniqueValue)
  } catch (err) {
    console.error(err)
  }
}

/**
 * @description Convert data phù hợp để in vào file TXT đúng định dạng
 * @param {Array} arrData
 */
const transformArrayToTxt = (arrData) => arrData.join('\r\n')

/**
 * @description Tạo file kết quả
 * @param {String} fileName
 */
const removeDuplicateAndWrite = async (fileName) => {
  const dataFile = await processLineByLine(fileName)
  const resultFileName = `R-${fileName}`
  writeFileSync(__dirname + '/SUCCESS_KEY/' + resultFileName, transformArrayToTxt(dataFile), {
    flag: 'w+',
    encoding: 'utf-8',
  })
}

/**
 * @description Đọc tất cả các file trong thư mục chỉ định
 * @param {String} dirPath
 */
const getKeyName = (dirPath = __dirname + '/SOURCES_KEY') => {
  return readdirSync(dirPath)
}

/**
 * Hàm main
 * @description Với mỗi file tương ứng => Lọc và viết file trả về key text tương ứng
 */
const bootstrap = () => {
  const keysName = getKeyName()
  keysName.forEach((keyName) => {
    removeDuplicateAndWrite(keyName)
  })
  console.log('🌈 Đã xoá hết những dòng lặp! Bây h 1 là dùng tool, 2 là tự ôn cmm đi 🥳')
}

bootstrap()
