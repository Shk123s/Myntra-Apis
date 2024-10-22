const connection = require('../../database');

const fetchAllRoles = async (req, res) => {
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
const fetchAllPermissions = async (req, res) => {
  try {
    const strquery = 'SELECT *  FROM permissions WHERE is_active = 1 ;';
    const countsquery =
      'SELECT COUNT(*) as total_permissions FROM permissions  WHERE is_active = 1  ; ';

    const [result] = await connection.promise().query(strquery);
    const [resultcount] = await connection.promise().query(countsquery);
    if (result.length === 0) {
      return res.status(400).send({ message: 'No permissions !' });
    } else {
      return res.status(200).send({
        message: 'Here are the permissions',
        result: result,
        Total: resultcount,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const fetchAllRolePermissions = async (req, res) => {
  try {
    const strquery = 'SELECT *  FROM role_permission  ;';
    const countsquery =
      'SELECT COUNT(*) as total_role_permission FROM  role_permission ; ';

    const [result] = await connection.promise().query(strquery);
    const [resultcount] = await connection.promise().query(countsquery);
    if (result.length === 0) {
      return res.status(400).send({ message: 'No role permissions !' });
    } else {
      return res.status(200).send({
        message: 'Here are the role permissions',
        result: result,
        Total: resultcount,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error.' });
  }
};

const getAllRolesWithPermissions = async () => {
  const query = `
     SELECT roles.name AS role_name, permissions.name AS permission_name
     FROM role_permission
    JOIN roles ON role_permission.role_id = roles.id
    JOIN permissions ON role_permission.permission_id = permissions.id;
  `;

  try {
    const [results] = await connection.promise().execute(query);
    // Group by role and permissions
    const rolesWithPermissions = results.reduce((acc, row) => {
      const { role_name, permission_name } = row;
      if (!acc[role_name]) {
        acc[role_name] = [];
      }
      acc[role_name].push(permission_name);
      return acc;
    }, {});
    //  res.send({data:rolesWithPermissions})
    return rolesWithPermissions;
  } catch (error) {
    console.error('Error fetching permissions:', error);
    throw error;
  }
};

const addRoles = async (req, res) => {
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
const addRolesAndPermission = async (req, res) => {
  try {
    const { role_id, permission_id } = req.body;

    if (!role_id || !permission_id) {
      return res
        .status(400)
        .send({ message: 'role_id and permission_id must be provided.' });
    }

    const sqlquery =
      'INSERT INTO role_permission(role_id, permission_id) VALUES(?, ?)';

    const [result] = await connection
      .promise()
      .execute(sqlquery, [role_id, permission_id]);

    if (result.affectedRows === 0) {
      res.status(200).send({ message: 'Not created' });
    } else {
      res.status(200).send({
        message: 'Role and permission updated successfully.',
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: 'Internal server error.' });
  }
};

module.exports = {
  fetchAllRoles,
  addRoles,
  addRolesAndPermission,
  fetchAllPermissions,
  fetchAllRolePermissions,
  getAllRolesWithPermissions,
};
