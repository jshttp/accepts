
var accepts = require('..')
var assert = require('assert')
var deepEqual = require('deep-equal')

describe('accepts.types()', function () {
  describe('with no arguments', function () {
    describe('when Accept is populated', function () {
      it('should return all accepted types', function () {
        var req = createRequest('application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain')
        var accept = accepts(req)
        assert.ok(deepEqual(accept.types(), ['text/html', 'text/plain', 'image/jpeg', 'application/*']))
      })
    })

    describe('when Accept not in request', function () {
      it('should return */*', function () {
        var req = createRequest()
        var accept = accepts(req)
        assert.ok(deepEqual(accept.types(), ['*/*']))
      })
    })

    describe('when Accept is empty', function () {
      it('should return []', function () {
        var req = createRequest('')
        var accept = accepts(req)
        assert.ok(deepEqual(accept.types(), []))
      })
    })
  })

  describe('with no valid types', function () {
    describe('when Accept is populated', function () {
      it('should return false', function () {
        var req = createRequest('application/*;q=0.2, image/jpeg;q=0.8, text/html, text/plain')
        var accept = accepts(req)
        assert.strictEqual(accept.types('image/png', 'image/tiff'), false)
      })
    })

    describe('when Accept is not populated', function () {
      it('should return the first type', function () {
        var req = createRequest()
        var accept = accepts(req)
        assert.strictEqual(accept.types('text/html', 'text/plain', 'image/jpeg', 'application/*'), 'text/html')
      })
    })
  })

  describe('when extensions are given', function () {
    it('should convert to mime types', function () {
      var req = createRequest('text/plain, text/html')
      var accept = accepts(req)
      assert.strictEqual(accept.types('html'), 'html')
      assert.strictEqual(accept.types('.html'), '.html')
      assert.strictEqual(accept.types('txt'), 'txt')
      assert.strictEqual(accept.types('.txt'), '.txt')
      assert.strictEqual(accept.types('png'), false)
      assert.strictEqual(accept.types('bogus'), false)
    })
  })

  describe('when an array is given', function () {
    it('should return the first match', function () {
      var req = createRequest('text/plain, text/html')
      var accept = accepts(req)
      assert.strictEqual(accept.types(['png', 'text', 'html']), 'text')
      assert.strictEqual(accept.types(['png', 'html']), 'html')
      assert.strictEqual(accept.types(['bogus', 'html']), 'html')
    })
  })

  describe('when multiple arguments are given', function () {
    it('should return the first match', function () {
      var req = createRequest('text/plain, text/html')
      var accept = accepts(req)
      assert.strictEqual(accept.types('png', 'text', 'html'), 'text')
      assert.strictEqual(accept.types('png', 'html'), 'html')
      assert.strictEqual(accept.types('bogus', 'html'), 'html')
    })
  })

  describe('when present in Accept as an exact match', function () {
    it('should return the type', function () {
      var req = createRequest('text/plain, text/html')
      var accept = accepts(req)
      assert.strictEqual(accept.types('text/html'), 'text/html')
      assert.strictEqual(accept.types('text/plain'), 'text/plain')
    })
  })

  describe('when present in Accept as a type match', function () {
    it('should return the type', function () {
      var req = createRequest('application/json, */*')
      var accept = accepts(req)
      assert.strictEqual(accept.types('text/html'), 'text/html')
      assert.strictEqual(accept.types('text/plain'), 'text/plain')
      assert.strictEqual(accept.types('image/png'), 'image/png')
    })
  })

  describe('when present in Accept as a subtype match', function () {
    it('should return the type', function () {
      var req = createRequest('application/json, text/*')
      var accept = accepts(req)
      assert.strictEqual(accept.types('text/html'), 'text/html')
      assert.strictEqual(accept.types('text/plain'), 'text/plain')
      assert.strictEqual(accept.types('image/png'), false)
    })
  })
})

function createRequest (type) {
  return {
    headers: {
      accept: type
    }
  }
}
