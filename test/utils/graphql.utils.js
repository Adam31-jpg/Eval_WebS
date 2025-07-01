const axios = require('axios');
const { AxiosError } = require('axios');

// Correction: utiliser la bonne URL GraphQL selon votre configuration
const BASE_URL = process.env.API_GRAPHQL_URL || 'http://localhost:3000/graphql';

/**
 * Fonction utilitaire pour envoyer des requêtes GraphQL.
 * @param {string} query - La requête ou mutation GraphQL.
 * @param {object} variables - Les variables associées à la requête/mutation.
 * @param {string} token - Le token Keycloak.
 * @returns {Promise<any>} - Retourne la partie "data" de la réponse GraphQL.
 */
const graphqlQuery = async (query, variables, token) => {
  try {
    console.log('🔵 GraphQL Request to:', BASE_URL);
    console.log('🔍 Query:', query.slice(0, 100) + '...');
    console.log('📊 Variables:', JSON.stringify(variables, null, 2));
    console.log(
      '🔑 Token:',
      token ? `${token.substring(0, 20)}...` : 'No token',
    );

    const response = await axios.post(
      BASE_URL,
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('✅ GraphQL Response status:', response.status);

    if (response.data.errors) {
      console.error(
        '❌ GraphQL Errors:',
        JSON.stringify(response.data.errors, null, 2),
      );
      throw new Error(
        `GraphQL Errors: ${JSON.stringify(response.data.errors, null, 2)}`,
      );
    }

    console.log(
      '📄 GraphQL Data:',
      JSON.stringify(response.data.data, null, 2),
    );
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('❌ Axios Error Response:', error.response?.data);
      console.error('❌ Axios Error Status:', error.response?.status);
      console.error('❌ Axios Error Headers:', error.response?.headers);
    }
    console.error('❌ GraphQL Request Error:', error.message);
    throw new Error(`Erreur GraphQL: ${error.message}`);
  }
};

module.exports = {
  graphqlRequest: graphqlQuery,
};
