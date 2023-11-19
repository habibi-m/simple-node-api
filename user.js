const client = require("./db");

const getUsers = (req, res) => {
    try {
        client.query('SELECT * FROM users ORDER BY user_id ASC', (error, results) => {
            if (error) throw error
            else res.status(200).json(results.rows)
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Failed to get users",
        });
    }
}

const getUserById = (req, res) => {
    try {
        const id = parseInt(req.params.id)

        if (!id) {
            throw Error("Invalid id!");
        }

        client.query('SELECT * FROM users WHERE user_id = $1', [id], (error, result) => {
            if (error) throw error
            else res.status(200).json(result.rows)
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Failed to get user",
        });
    }
}

const createUser = (req, res) => {
    try {
        const { first_name, last_name, user_role, avatar, member_date } = req.body

        if (!first_name || !last_name || !user_role || !member_date) {
            throw Error("Invalid data!");
        }

        client.query(
            "INSERT INTO users (first_name, last_name, user_role, avatar, member_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [first_name, last_name, user_role, avatar, member_date],
            (error, result) => {
                if (error) throw error
                else res.status(201).json({
                    message: `User created.`,
                    user: result.rows[0],
                });
            }
        );
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Failed to create new user",
        });
    }
};


const updateUser = (req, res) => {
    try {
        const user_id = parseInt(req.params.id)
        const { first_name, last_name, user_role, avatar, member_date } = req.body

        if (!user_id || !first_name || !last_name || !user_role || !member_date) {
            throw Error("Invalid data!");
        }

        client.query(
            'UPDATE users SET first_name=$1, last_name=$2, user_role=$3, avatar=$4, member_date=$5 WHERE user_id=$6 RETURNING *',
            [first_name, last_name, user_role, avatar, member_date, user_id],
            (error, result) => {
                if (error) throw error
                else if (result.rowCount == 0) {
                    res.status(401).json({
                        error: `User with id ${user_id} not found.`
                    });
                }
                else res.status(201).json({
                    message: `User modified.`,
                    user: result.rows[0]
                });
            }
        )
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Failed to update user",
        });
    }
}


const deleteUser = (req, res) => {
    const user_id = parseInt(req.params.id)

    if (!user_id) {
        throw Error("Invalid id!");
    }

    client.query(
        'DELETE FROM users WHERE user_id = $1 RETURNING *',
        [user_id],
        (error, result) => {
            if (error) throw error
            else if (result.rowCount == 0) {
                res.status(401).json({
                    error: `User with id ${user_id} not found.`
                });
            }
            else res.status(201).json({
                message: `User deleted.`,
                user: result.rows[0]
            });
        });
}


module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}