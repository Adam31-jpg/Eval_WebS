// Chargement des variables d'environnement
require('dotenv').config();

// Vérification et configuration des variables par défaut
const requiredEnvVars = {
  KEYCLOAK_URL: 'http://localhost:8080',
  KEYCLOAK_REALM: 'myrealm',
  KEYCLOAK_CLIENT_ID: 'myclient',
  KEYCLOAK_CLIENT_SECRET: 'mysecret',
  KEYCLOAK_TEST_USR_USERNAME: 'testuser2@example.com',
  KEYCLOAK_TEST_USR_PASSWORD: 'password',
  KEYCLOAK_TEST_ADM_USERNAME: 'admin@example.com',
  KEYCLOAK_TEST_ADM_PASSWORD: 'admin',
  KEYCLOAK_ADMIN_USERNAME: 'admin',
  KEYCLOAK_ADMIN_PASSWORD: 'admin',
  API_REST_URL: 'http://localhost:3000',
};

// Assigner les valeurs par défaut si elles ne sont pas définies
Object.keys(requiredEnvVars).forEach((key) => {
  if (!process.env[key]) {
    process.env[key] = requiredEnvVars[key];
    console.warn(
      `⚠️ Variable d'environnement ${key} non définie, utilisation de la valeur par défaut: ${requiredEnvVars[key]}`,
    );
  }
});

console.log("🔧 Variables d'environnement chargées:");
console.log('KEYCLOAK_URL:', process.env.KEYCLOAK_URL);
console.log('KEYCLOAK_REALM:', process.env.KEYCLOAK_REALM);
console.log('API_REST_URL:', process.env.API_REST_URL);
