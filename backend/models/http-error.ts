// class HttpError extends Error {
//   constructor(message, errorCode) {
//     super(message)
//     this.code = errorCode
//   }
// }

function HttpError(message: string, errorCode: number) {
  this.message = message
  this.code = errorCode
}

HttpError.prototype = Object.create(Error.prototype)
HttpError.prototype.constructor = HttpError

export default HttpError
