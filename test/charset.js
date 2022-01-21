
var accepts = require('..')
var assert = require('assert')
var deepEqual = require('deep-equal')

describe('accepts.charsets()', function () {
  describe('with no arguments', function () {
    describe('when Accept-Charset is populated', function () {
      it('should return accepted types', function () {
        var req = createRequest('utf-8, iso-8859-1;q=0.2, utf-7;q=0.5')
        var accept = accepts(req)
        assert.ok(deepEqual(accept.charsets(), ['utf-8', 'utf-7', 'iso-8859-1']))
      })
    })

    describe('when Accept-Charset is not in request', function () {
      it('should return *', function () {
        var req = createRequest()
        var accept = accepts(req)
        assert.ok(deepEqual(accept.charsets(), ['*']))
      })
    })

    describe('when Accept-Charset is empty', function () {
      it('should return an empty array', function () {
        var req = createRequest('')
        var accept = accepts(req)
        assert.ok(deepEqual(accept.charsets(), []))
      })
    })
  })

  describe('with multiple arguments', function () {
    describe('when Accept-Charset is populated', function () {
      describe('if any types match', function () {
        it('should return the best fit', function () {
          var req = createRequest('utf-8, iso-8859-1;q=0.2, utf-7;q=0.5')
          var accept = accepts(req)
          assert.strictEqual(accept.charsets('utf-7', 'utf-8'), 'utf-8')
        })
      })

      describe('if no types match', function () {
        it('should return false', function () {
          var req = createRequest('utf-8, iso-8859-1;q=0.2, utf-7;q=0.5')
          var accept = accepts(req)
          assert.strictEqual(accept.charsets('utf-16'), false)
        })
      })
    })

    describe('when Accept-Charset is not populated', function () {
      it('should return the first type', function () {
        var req = createRequest()
        var accept = accepts(req)
        assert.strictEqual(accept.charsets('utf-7', 'utf-8'), 'utf-7')
      })
    })
  })

  describe('with an array', function () {
    it('should return the best fit', function () {
      var req = createRequest('utf-8, iso-8859-1;q=0.2, utf-7;q=0.5')
      var accept = accepts(req)
      assert.strictEqual(accept.charsets(['utf-7', 'utf-8']), 'utf-8')
    })
  })
})

function createRequest (charset) {
  return {
    headers: {
      'accept-charset': charset
    }
  }
}
