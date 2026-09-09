// * Carga el .env antes de que arranque el test runner. Usamos dotenv en vez
// * de process.loadEnvFile porque es mas confiable dentro del entorno
// * sandboxeado que arma Jest para cada archivo de test.
require("dotenv").config()