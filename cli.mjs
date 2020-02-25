import * as client from './client.mjs'
import * as display from './display.mjs'
import { GREEN, NC } from './utils.mjs'
import fetch from 'node-fetch'
import tests from './tests/index.mjs'
import surrogate from './tests/surrogate-control.mjs'
import createHttpProxyAgent from 'http-proxy-agent'

tests.push(surrogate)

const baseUrl = process.env.npm_config_base || process.env.npm_package_config_base
const testId = process.env.npm_config_id || process.env.npm_package_config_id

var testsToRun
if (testId !== '') {
  console.log(`Running ${testId}`)
  tests.forEach(suite => {
    suite.tests.forEach(test => {
      if (test.id === testId) {
        test.dump = true
        testsToRun = [{
          name: suite.name,
          id: suite.id,
          description: suite.description,
          tests: [test]
        }]
      }
    })
  })
} else {
  testsToRun = tests
}

const pFetch = (u, o) => {
  if (!o) {
    o = {}
  }
  if (process.env.http_proxy) {
    o.agent = createHttpProxyAgent(process.env.http_proxy)
  }
  return fetch(u, o)
}
client.runTests(testsToRun, pFetch, false, baseUrl)
  .then(() => {
    if (testId !== '') {
      console.log(`${GREEN}==== Results${NC}`)
      var result = client.getResults()
      var resultSymbol = display.determineTestResult(tests, testId, result, false)
      var resultDetails = result[1] || ''
      console.log(`${resultSymbol} - ${resultDetails}`)
    } else {
      console.log(JSON.stringify(client.getResults(), null, 2))
    }
  })
  .catch(err => {
    console.error(err)
  })
