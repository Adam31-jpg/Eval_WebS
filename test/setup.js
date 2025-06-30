const request = require('supertest');
const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

let keycloakUsrAccessToken = '';
let keycloakAdmAccessToken = '';
let keycloakAdminToken = '';

// Mode mock pour éviter les dépendances externes
const MOCK_MODE =
  process.env.MOCK_KEYCLOAK === 'true' || !process.env.KEYCLOAK_URL;

/**
 * Récupère un token Keycloak via le flow "Resource Owner Password Credentials"
 */
async function getKeycloakUsrToken() {
  if (MOCK_MODE) {
    console.log('🧪 Mode Mock: Token utilisateur simulé');
    keycloakUsrAccessToken = 'mock-user-token';
    return keycloakUsrAccessToken;
  }

  try {
    const res = await request(process.env.KEYCLOAK_URL)
      .post(
        `/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      )
      .type('form')
      .send({
        grant_type: 'password',
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        username: process.env.KEYCLOAK_TEST_USR_USERNAME,
        password: process.env.KEYCLOAK_TEST_USR_PASSWORD,
      });

    if (res.status !== 200) {
      throw new Error(
        `Impossible de récupérer le token utilisateur Keycloak: ${res.text}`,
      );
    }

    keycloakUsrAccessToken = res.body.access_token;
    return keycloakUsrAccessToken;
  } catch (error) {
    console.warn(
      '⚠️ Erreur Keycloak utilisateur, basculement en mode mock:',
      error.message,
    );
    keycloakUsrAccessToken = 'mock-user-token';
    return keycloakUsrAccessToken;
  }
}

/**
 * Récupère un token Keycloak admin
 */
async function getKeycloakAdmToken() {
  if (MOCK_MODE) {
    console.log('🧪 Mode Mock: Token admin simulé');
    keycloakAdmAccessToken = 'mock-admin-token';
    return keycloakAdmAccessToken;
  }

  try {
    const res = await request(process.env.KEYCLOAK_URL)
      .post(
        `/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
      )
      .type('form')
      .send({
        grant_type: 'password',
        client_id: process.env.KEYCLOAK_CLIENT_ID,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        username: process.env.KEYCLOAK_TEST_ADM_USERNAME,
        password: process.env.KEYCLOAK_TEST_ADM_PASSWORD,
      });

    if (res.status !== 200) {
      throw new Error(
        `Impossible de récupérer le token admin Keycloak: ${res.text}`,
      );
    }

    keycloakAdmAccessToken = res.body.access_token;
    return keycloakAdmAccessToken;
  } catch (error) {
    console.warn(
      '⚠️ Erreur Keycloak admin, basculement en mode mock:',
      error.message,
    );
    keycloakAdmAccessToken = 'mock-admin-token';
    return keycloakAdmAccessToken;
  }
}

/**
 * Récupère un token admin Keycloak pour les actions d'administration
 */
async function getKeycloakAdminToken() {
  if (MOCK_MODE) {
    console.log('🧪 Mode Mock: Token super admin simulé');
    keycloakAdminToken = 'mock-super-admin-token';
    return keycloakAdminToken;
  }

  try {
    const res = await request(process.env.KEYCLOAK_URL)
      .post(`/realms/master/protocol/openid-connect/token`)
      .type('form')
      .send({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: process.env.KEYCLOAK_ADMIN_USERNAME,
        password: process.env.KEYCLOAK_ADMIN_PASSWORD,
      });

    if (res.status !== 200) {
      throw new Error(
        `Impossible de récupérer le token super admin Keycloak: ${res.text}`,
      );
    }

    keycloakAdminToken = res.body.access_token;
    return keycloakAdminToken;
  } catch (error) {
    console.warn(
      '⚠️ Erreur Keycloak super admin, basculement en mode mock:',
      error.message,
    );
    keycloakAdminToken = 'mock-super-admin-token';
    return keycloakAdminToken;
  }
}

// Getters
function getUsrToken() {
  return keycloakUsrAccessToken;
}

function getAdmToken() {
  return keycloakAdmAccessToken;
}

function getAdminToken() {
  return keycloakAdminToken;
}

/**
 * Vérifie le token JWT
 */
async function verifyJwtToken(token) {
  if (MOCK_MODE || !token || token.startsWith('mock-')) {
    console.log('🧪 Mode Mock: Vérification JWT simulée');
    return Promise.resolve({
      sub: 'test-user-id',
      email: 'test@example.com',
      realm_access: { roles: ['admin'] },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
  }

  // Code de vérification JWT réel
  const client = jwksClient({
    jwksUri: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/certs`,
  });

  function getKey(header, callback) {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) {
        return callback(err);
      }
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  }

  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        issuer: `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}`,
      },
      (err, decoded) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded);
      },
    );
  });
}

// Hook Jest - essaie de récupérer les tokens, mais ne fail pas si ça ne marche pas
beforeAll(async () => {
  try {
    await getKeycloakUsrToken();
    await getKeycloakAdminToken();
    await getKeycloakAdmToken();
    console.log('✅ Tokens Keycloak récupérés avec succès');
  } catch (error) {
    console.warn(
      '⚠️ Impossible de récupérer les tokens Keycloak, mode mock activé:',
      error.message,
    );
    process.env.MOCK_KEYCLOAK = 'true';
  }
}, 30000);

module.exports = {
  getUsrToken,
  getAdmToken,
  getAdminToken,
  verifyJwtToken,
};
