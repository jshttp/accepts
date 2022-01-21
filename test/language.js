
var accepts = require('..')
var assert = require('assert')
var deepEqual = require('deep-equal')

describe('accepts.languages()', function () {
  describe('with no arguments', function () {
    describe('when Accept-Language is populated', function () {
      it('should return accepted types', function () {
        var req = createRequest('en;q=0.8, es, pt')
        var accept = accepts(req)
        assert.ok(deepEqual(accept.languages(), ['es', 'pt', 'en']))
      })
    })

    describe('when Accept-Language is not in request', function () {
      it('should return *', function () {
        var req = createRequest()
        var accept = accepts(req)
        assert.ok(deepEqual(accept.languages(), ['*']))
      })
    })

    describe('when Accept-Language is empty', function () {
      it('should return an empty array', function () {
        var req = createRequest('')
        var accept = accepts(req)
        assert.ok(deepEqual(accept.languages(), []))
      })
    })
  })

  describe('with multiple arguments', function () {
    describe('when Accept-Language is populated', function () {
      describe('if any types types match', function () {
        it('should return the best fit', function () {
          var req = createRequest('en;q=0.8, es, pt')
          var accept = accepts(req)
          assert.strictEqual(accept.languages('es', 'en'), 'es')
        })
      })

      describe('if no types match', function () {
        it('should return false', function () {
          var req = createRequest('en;q=0.8, es, pt')
          var accept = accepts(req)
          assert.strictEqual(accept.languages('fr', 'au'), false)
        })
      })
    })

    describe('when Accept-Language is not populated', function () {
      it('should return the first type', function () {
        var req = createRequest()
        var accept = accepts(req)
        assert.strictEqual(accept.languages('es', 'en'), 'es')
      })
    })
  })

  describe('with an array', function () {
    it('should return the best fit', function () {
      var req = createRequest('en;q=0.8, es, pt')
      var accept = accepts(req)
      assert.strictEqual(accept.languages(['es', 'en']), 'es')
    })
  })
})

function createRequest (language) {
  return {
    headers: {
      'accept-language': language
    }
  }
}
