const connection = require('../../database');

exports.fetchAllRoles = async (req, res) => {
  try {
    const strquery = 'SELECT *  FROM roles WHERE is_active = 1 ;';
    const countsquery =
      'SELECT COUNT(*) as total_roles FROM roles  WHERE is_active = 1  ; ';

    const [result] = await connection.promise().query(strquery);
    const [resultcount] = await connection.promise().query(countsquery);
    if (result.length === 0) {
      return res.status(400).send({ message: 'No user found !' });
    } else {
      return res.status(200).send({
        message: 'Here are the users',
        result: result,
        Total: resultcount,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addRoles = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    // Check if name and isactive are defined
    if (name === undefined || isActive === undefined) {
      return res
        .status(400)
        .send({ message: 'Name and isActive must be provided.' });
    }

    const sqlquery = 'INSERT INTO roles(name, is_active) VALUES(?, ?)';

    const [result] = await connection
      .promise()
      .execute(sqlquery, [name, isActive]);

    if (result.affectedRows === 0) {
      res.status(200).send({ message: 'Not created' });
    } else {
      res
        .status(200)
        .send({ message: 'Role added successfully.', data: result });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error.' });
  }
};
