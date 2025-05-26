const pool = require('../config/db');

exports.uploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const userId = req.user.id;  // From auth middleware
    const { path: fileUrl, originalname: fileName, size, mimetype: type } = req.file;

    const result = await pool.query(
      `INSERT INTO files (user_id, file_url, file_name, size, type, uploaded_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [userId, fileUrl, fileName, size, type]
    );

    res.status(201).json({ file: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserFiles = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT id, file_url, file_name, size, type, uploaded_at FROM files WHERE user_id = $1',
      [userId]
    );

    res.status(200).json({ files: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;

    // Check ownership before deletion
    const fileCheck = await pool.query(
      'SELECT * FROM files WHERE id = $1 AND user_id = $2',
      [fileId, userId]
    );
    if (fileCheck.rows.length === 0) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }

    await pool.query('DELETE FROM files WHERE id = $1', [fileId]);

    res.status(200).json({ message: `Deleted file with id ${fileId}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
