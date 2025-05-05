import { ResultSetHeader } from 'mysql2';
import pool from './connection.js';

async function countQuery(query: string, params: any[]): Promise<number> {
    try {
        const [results] = await pool.execute(query, params);
        const count = (results as any)[0]?.count || 0;
        return count;
    } catch (error) {
        console.error('❌ Error executing count query:', error);
        throw new Error('Database error');
    }
}

async function selectQuery<T>(query: string, params: any[]): Promise<T[]> {
    try {
        const [results] = await pool.execute(query, params);
        return results as T[];
    } catch (error) {
        console.error('❌ Error executing query:', error);
        throw new Error('Database error');
    }
}

async function executeQuery(query: string, params: any[]): Promise<ResultSetHeader> {
    try {
        const [result] = await pool.execute(query, params);
        return result as ResultSetHeader;
    } catch (error) {
        console.error('❌ Error executing insert query:', error);
        throw new Error('Database error');
    }
}

export { selectQuery, executeQuery, countQuery };