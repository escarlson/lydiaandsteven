import pool from "./db"

export type SettingRow = {
  setting_id: string;
  created_at: Date | null;
  updated_at: Date | null;
  name: string;
  value: string | null;
};

const fetchAllSettings = async (): Promise<SettingRow[]> => {
  try {
    const [result] = await pool.query(
      `SELECT *
      FROM system_settings
      ORDER BY created_at`
    );

    return result as SettingRow[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export const updateSetting = async (
  settingId: string,
  value: string | null
): Promise<SettingRow | null> => {
  try {
    const [updateResult] = await pool.query(
      `UPDATE system_settings
       SET value = ?, updated_at = CURRENT_TIMESTAMP
       WHERE setting_id = ?
       LIMIT 1`,
      [value ?? null, settingId]
    );

    const result = updateResult as { affectedRows?: number };
    if (!result.affectedRows) {
      return null;
    }

    const [rows] = await pool.query(
      `SELECT *
       FROM system_settings
       WHERE setting_id = ?
       LIMIT 1`,
      [settingId]
    );

    const settingRows = rows as SettingRow[];
    return settingRows[0] ?? null;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
};

export default fetchAllSettings;