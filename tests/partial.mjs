export default {
  name: 'Partial Content',
  id: 'partial',
  description: 'These tests check for conformance to requirements regarding partial content (also known as `Range` requests). See the [partial content specification](https://httpwg.org/specs/rfc7233.html) and the [relevant part of the HTTP caching specification](https://httpwg.org/specs/rfc7234.html#combining.responses).',
  tests: [
    {
      name: 'An optimal HTTP cache stores partial content and reuses it',
      id: 'partial-store-partial-reuse-partial',
      kind: 'optimal',
      requests: [
        {
          request_headers: [
            ['Range', 'bytes=-5']
          ],
          response_status: [206, 'Partial Content'],
          response_headers: [
            ['Cache-Control', 'max-age=3600'],
            ['Content-Range', 'bytes 4-9/10']
          ],
          response_body: '01234',
          expected_request_headers: [
            ['Range', 'bytes=-5']
          ],
          setup: true
        },
        {
          request_headers: [
            ['Range', 'bytes=-5']
          ],
          expected_type: 'cached',
          expected_status: 206,
          expected_response_text: '01234'
        }
      ]
    },
    {
      name: 'An optimal HTTP cache stores complete responses and serves smaller ranges from them (byte-range-spec)',
      id: 'partial-store-complete-reuse-partial',
      kind: 'optimal',
      requests: [
        {
          response_headers: [
            ['Cache-Control', 'max-age=3600']
          ],
          response_body: '01234567890',
          setup: true
        },
        {
          request_headers: [
            ['Range', 'bytes=0-1']
          ],
          expected_type: 'cached',
          expected_status: 206,
          expected_response_text: '01'
        }
      ]
    },
    {
      name: 'An optimal HTTP cache stores complete responses and serves smaller ranges from them (absent last-byte-pos)',
      id: 'partial-store-complete-reuse-partial-no-last',
      kind: 'optimal',
      requests: [
        {
          response_headers: [
            ['Cache-Control', 'max-age=3600']
          ],
          response_body: '01234567890',
          setup: true
        },
        {
          request_headers: [
            ['Range', 'bytes=1-']
          ],
          expected_type: 'cached',
          expected_status: 206,
          expected_response_text: '1234567890'
        }
      ]
    },
    {
      name: 'An optimal HTTP cache stores complete responses and serves smaller ranges from them (suffix-byte-range-spec)',
      id: 'partial-store-complete-reuse-partial-suffix',
      kind: 'optimal',
      requests: [
        {
          response_headers: [
            ['Cache-Control', 'max-age=3600']
          ],
          response_body: '0123456789A',
          setup: true
        },
        {
          request_headers: [
            ['Range', 'bytes=-1']
          ],
          expected_type: 'cached',
          expected_status: 206,
          expected_response_text: 'A'
        }
      ]
    },
    {
      name: 'An optimal HTTP cache stores partial responses and serves smaller ranges from them (byte-range-spec)',
      id: 'partial-store-partial-reuse-partial-byterange',
      kind: 'optimal',
      requests: [
        {
          request_headers: [
            ['Range', 'bytes=-5']
          ],
          response_status: [206, 'Partial Content'],
          response_headers: [
            ['Cache-Control', 'max-age=3600'],
            ['Content-Range', 'bytes 4-9/10']
          ],
          response_body: '01234',
          setup: true
        },
        {
          request_headers: [
            ['Range', 'bytes=6-8']
          ],
          expected_type: 'cached',
          expected_status: 206,
          expected_response_text: '234'
        }
      ]
    },
    {
      name: 'An optimal HTTP cache stores partial responses and serves smaller ranges from them (absent last-byte-pos)',
      id: 'partial-store-partial-reuse-partial-absent',
      kind: 'optimal',
      requests: [
        {
          request_headers: [
            ['Range', 'bytes=-5']
          ],
          response_status: [206, 'Partial Content'],
          response_headers: [
            ['Cache-Control', 'max-age=3600'],
            ['Content-Range', 'bytes 4-9/10']
          ],
          response_body: '01234',
          setup: true
        },
        {
          request_headers: [
            ['Range', 'bytes=6-']
          ],
          expected_type: 'cached',
          expected_status: 206,
          expected_response_text: '234'
        }
      ]
    },
    {
      name: 'An optimal HTTP cache stores partial responses and serves smaller ranges from them (suffix-byte-range-spec)',
      id: 'partial-store-partial-reuse-partial-suffix',
      kind: 'optimal',
      requests: [
        {
          request_headers: [
            ['Range', 'bytes=-5']
          ],
          response_status: [206, 'Partial Content'],
          response_headers: [
            ['Cache-Control', 'max-age=3600'],
            ['Content-Range', 'bytes 4-9/10']
          ],
          response_body: '01234',
          setup: true
        },
        {
          request_headers: [
            ['Range', 'bytes=-1']
          ],
          expected_type: 'cached',
          expected_status: 206,
          expected_response_text: '4'
        }
      ]
    },
    {
      name: 'An optimal HTTP cache stores partial content and completes it',
      id: 'partial-store-partial-complete',
      kind: 'optimal',
      requests: [
        {
          request_headers: [
            ['Range', 'bytes=-5']
          ],
          response_status: [206, 'Partial Content'],
          response_headers: [
            ['Cache-Control', 'max-age=3600'],
            ['Content-Range', 'bytes 0-4/10']
          ],
          response_body: '01234',
          setup: true
        },
        {
          expected_request_headers: [
            ['range', 'bytes=5-']
          ]
        }
      ]
    }
  ]
}
