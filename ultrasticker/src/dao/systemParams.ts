import { executeQuery, selectQuery } from "../db/queryUtils.js";

async function getSystemParamByKey(paramKey: string): Promise<number> {
  const query = `
    SELECT 
        param_value
    FROM 
        system_params 
    WHERE 
        param_key = ?;`;

  const result = await selectQuery<any>(query, [paramKey]);
  return result[0].param_value;
}

async function setSystemParam(
  paramKey: string,
  paramValue: number
): Promise<any> {
  const query = `
        INSERT INTO system_params (param_key, param_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE param_value = VALUES(param_value);`;
  return executeQuery(query, [paramKey, paramValue]);
}

export { getSystemParamByKey, setSystemParam };
