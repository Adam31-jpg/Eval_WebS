const axios = require('axios');

const BASE_URL = process.env.API_GRAPHQL_URL || 'http://localhost:3000/graphql';

const graphqlQuery = async (query, variables, token) => {
  try {
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

    console.log('Response:', JSON.stringify(response.data, null, 2));
    return response.data.data;
  } catch (error) {
    console.log('ERROR DETAILS:', error.response?.data);
    throw error;
  }
};

module.exports = {
  graphqlRequest: graphqlQuery,
};
