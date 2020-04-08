const { writeFileSync, readFileSync } = require('fs')

const quizletDir = __dirname + '/SOURCES_KEY/PRX301-P2.txt'
const quizletFileName = 'PRX301-P2.txt'
/**
 *
 * @param {String} txtFile
 */
const trimLine = (txtFile) => {
  let arryTrim = txtFile.split('\n\n')
  let result = []
  const regex = '!==='
  for (let item of arryTrim) {
    let [term, defination] = item.split(regex)
    defination = defination.toUpperCase().trimLeft()
    if (defination === 'T') defination = 'TRUE'
    if (defination === 'F') defination = 'FALSE'
    result.push(`${defination} ${regex} ${term} \n\n`)
  }
  return result
}

const transformArrayToTxt = (arrData) => arrData.join('\r\n')

const readAndWriteFile = async (fileName) => {
  const temp = readFileSync(quizletDir, { encoding: 'utf-8' })
  const dataArr = trimLine(temp)
  const resultFileName = `Quizlet_${fileName}`
  writeFileSync(__dirname + '/' + resultFileName, transformArrayToTxt(dataArr), {
    flag: 'w+',
    encoding: 'utf-8',
  })
}

const bootstrap = () => {
  readAndWriteFile(quizletFileName)
  console.log('🌈 Đã viết xong, ném lên Quizlet và học đi dmm 🥳')
}

bootstrap()
