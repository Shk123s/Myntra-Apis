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

const getAllRolesWithPermissions = async (req, res) => {
  const query = `
     SELECT roles.name AS role_name, 
            permissions.name AS permission_name, 
            resources.resource_name AS resource_name
     FROM role_permission
     JOIN roles ON role_permission.role_id = roles.id
     JOIN permissions ON role_permission.permission_id = permissions.id
     JOIN resources ON role_permission.resource_id = resources.id;
  `;

  try {
    const [results] = await connection.promise().execute(query);
    const rolesWithPermissions = results.reduce((acc, row) => {
      const { role_name, permission_name, resource_name } = row;

      if (!acc[role_name]) {
        acc[role_name] = {};
      }

      if (!acc[role_name][resource_name]) {
        acc[role_name][resource_name] = [];
      }

      acc[role_name][resource_name].push(permission_name);
      return acc;
    }, {});
    return rolesWithPermissions;
  } catch (error) {
    console.error(
      'Error fetching roles with permissions and resources:',
      error
    );
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
//resource add remaining
const addRolesAndPermission = async (req, res) => {
  try {
    const { role_id, permission_id, resource_id } = req.body;

    if (!role_id || !permission_id || !resource_id) {
      return res
        .status(400)
        .send({ message: 'role_id and permission_id must be provided.' });
    }

    const sqlquery =
      'INSERT INTO role_permission(role_id, permission_id,resource_id) VALUES(?, ?,?)';

    const [result] = await connection
      .promise()
      .execute(sqlquery, [role_id, permission_id, resource_id]);

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

const addResources = async (req, res) => {
  try {
    const { resource_name } = req.body;
    id = 9;
    isActive = 1;
    if (resource_name === undefined || isActive === undefined) {
      return res
        .status(400)
        .send({ message: 'resource_name must be provided.' });
    }
    connection.beginTransaction();
    const sqlquery =
      'INSERT INTO resources(id,resource_name, is_active) VALUES(?,?, ?)';

    const [result] = await connection
      .promise()
      .execute(sqlquery, [id, resource_name, isActive]);

    connection.commit();
    if (result.affectedRows === 0) {
      res.status(200).send({ message: 'Error occurs.' });
    } else {
      res
        .status(200)
        .send({ message: 'Resources added successfully.', data: result });
    }
  } catch (error) {
    connection.rollback();
    console.log(error);
    res.status(500).send({ res, message: 'Internal server error.' });
  }
};

module.exports = {
  fetchAllRoles,
  addRoles,
  addRolesAndPermission,
  fetchAllPermissions,
  fetchAllRolePermissions,
  getAllRolesWithPermissions,
  addResources,
};
