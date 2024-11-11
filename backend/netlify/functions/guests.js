const faunadb = require('faunadb');
const q = faunadb.query;

const client = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
});

exports.handler = async (event, context) => {
  if (event.httpMethod === 'POST') {
    const { name, status } = JSON.parse(event.body);
    const result = await client.query(
      q.Create(q.Collection('guests'), {
        data: { name, status },
      })
    );
    return {
      statusCode: 201,
      body: JSON.stringify(result.data),
    };
  }

  if (event.httpMethod === 'GET') {
    const result = await client.query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('guests'))),
        q.Lambda((x) => q.Get(x))
      )
    );
    const guests = result.data.map((item) => item.data);
    return {
      statusCode: 200,
      body: JSON.stringify(guests),
    };
  }

  if (event.httpMethod === 'DELETE') {
    const { name } = event.queryStringParameters;
    const result = await client.query(
      q.Delete(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('guest_by_name'), name))
        )
      )
    );
    return {
      statusCode: 204,
      body: '',
    };
  }

  return {
    statusCode: 405,
    body: 'Method Not Allowed',
  };
};
