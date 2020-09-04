const { readFileSync, writeFile, writeFileSync } = require('fs')
const { resolve } = require('path')

let uniqueResult = new Set()
const regexQuestion = ' | '
const data = readFileSync(resolve(`${__dirname}/SB_KEY/SUE201.txt`), { encoding: 'utf-8' }).toString()
const arrData = data.split('\n\n')
const dataLength = arrData.length

/**
 * @param {Array} question
 * @returns String
 */
const findResult = (lines) => {
  const trueAnswer = lines[0].split(regexQuestion)[0].toLowerCase()
  const question = lines[0].split(regexQuestion)[1]
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].substr(0, 1).toLowerCase() === trueAnswer) {
      return `${question.trim()} | ${lines[i].substring(3).trim()}`
    }
  }
}

const transformArrayToTxt = (arrData) => arrData.join('\r\n')

for (let i = 0; i < dataLength; i++) {
  const lines = arrData[i].split('\n')
  const question = lines[0]
  const result = findResult(lines)
  if (!uniqueResult.has(result)) {
    uniqueResult.add(result)
  }
}

writeFileSync(`${__dirname}/SUE201.txt`, transformArrayToTxt(Array.from(uniqueResult)), {
  flag: 'w+',
  encoding: 'utf-8',
})
