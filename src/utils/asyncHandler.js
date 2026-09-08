// * Envuelve un controller async para que cualquier error (rechazo de
// * promesa) se derive automaticamente al middleware global de errores
// * via next(), sin repetir try/catch en cada controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

module.exports = { asyncHandler }