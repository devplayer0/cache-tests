
const useBrowserCache = false

export function loadResults(resultFiles) {
  return Promise.all(resultFiles.map(fileName =>
      fetch(`results/${fileName}`)
      .then(response => {
        return response.json()
      })
      .then(results => {
        return {
          'name': fileName.split('.').slice(0, -1).join('.'),
          'results': results
        }
      }
  ))
  )
}

export function showResults(target, tests, results) {
  tests.forEach(testSuite => {
    target.appendChild(showHeader(testSuite.name, results))
    testSuite.tests.forEach(test => {
      target.appendChild(showTest(testSuite.name, test, results))
    })
  })
}

function showHeader(headerName, results) {
  var headerRow = tableRow()
  var firstHeader = tableCell('th', headerName, 'name category')
  headerRow.appendChild(firstHeader)
  results.forEach(implementation => {
    headerRow.appendChild(tableCell('th', implementation.name, 'category'))
  })
  return headerRow
}

function showTest(suiteName, test, results) {
  var testRow = tableRow()
  testRow.appendChild(tableCell('th', test.name, 'name'))
  results.forEach(implementation => {
    var result = implementation.results[test.id]
    var signal
    var hint
    if (result === undefined) {
      signal = "-"
    }
    else if (result === true) {
      signal = "✅"
      hint = false
    }
    else if (test.required === false){
      signal = "⚠️"
      hint = result
    }
    else {
      signal = "⛔️"
      hint = result
    }
    testRow.appendChild(tableCell('th', signal, false, hint))
  })
  return testRow
}

function tableRow() {
  var rowElement = document.createElement('tr')
  return rowElement
}

function tableCell(cellType, content, CssClass, hint) {
  var cellElement = document.createElement(cellType)
  if (CssClass) {
    cellElement.setAttribute('class', CssClass)
  }
  var cellText = document.createTextNode(content)
  cellElement.appendChild(cellText)
  if (hint) {
    cellElement.title = hint
  }
  return cellElement
}
