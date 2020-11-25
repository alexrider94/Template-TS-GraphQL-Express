// To safely escape values, you need to use mysql.escape()/mysql.escapeId() or use ?
// COALESCE()
/* 유저 쿼리 */
export const getAllUsers = "SELECT * FROM users";
export const findUser = "SELECT * FROM users WHERE email = ?";
export const getUserByUserNo = "SELECT * FROM users WHERE no = ?";
export const getCompanyUsers = "SELECT * FROM users WHERE companyNo = ?";

export const insertUser = "INSERT INTO users (companyNo, email, password, name, contact, department, position, status, salt, role) VALUES ( ?,?,?,?,?,?,?,?,?,? )";
export const upsertUser = "INSERT INTO users (companyNo, email, password, name, contact, department, position, status, salt, role) VALUES ( ?,?,?,?,?,?,?,?,?,? ) ON DUPLICATE KEY UPDATE password=?, name=?, contact=?, department=?, position=?, salt=?, role=?";

export const updateUser = "UPDATE users SET companyNo=?, email=?, name=?, contact=?, department=?, position=?, status=?, role=? modifiedDate=now() WHERE no = ?";
export const updatePassword = "UPDATE users SET password=?, salt = ? WHERE no = ?";

export const loginUser = "SELECT * FROM users WHERE email = ?";
// https://github.com/mariadb-corporation/mariadb-connector-nodejs/issues/120
export const getUserByCompanyNoPaging = (order:any,type:any) => {return `SELECT * FROM users WHERE companyNo = ? ORDER BY ${order} ${type} LIMIT ? OFFSET ?`}
export const getEmail = "SELECT * FROM users WHERE email IN ?";
