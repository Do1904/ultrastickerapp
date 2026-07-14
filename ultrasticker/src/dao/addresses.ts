import { executeQuery, selectQuery } from "../db/queryUtils.js";

export interface AddressInput {
  country: string;
  state: string;
  city: string;
  district: string;
  neighbourhood: string;
  postcode: string;
}

/**
 * 住所を検索し、存在しなければ作成して address_id を返す。
 * addresses には (country, state, city, district, neighbourhood, postcode) の
 * UNIQUE KEY があるため INSERT ... ON DUPLICATE KEY UPDATE で
 * 既存行の address_id を LAST_INSERT_ID 経由で取得できる。
 */
async function findOrCreateAddress(address: AddressInput): Promise<number> {
  const query = `
    INSERT INTO addresses (
      country, state, city, district, neighbourhood, postcode
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE address_id = LAST_INSERT_ID(address_id)`;

  const values = [
    address.country ?? "",
    address.state ?? "",
    address.city ?? "",
    address.district ?? "",
    address.neighbourhood ?? "",
    address.postcode ?? "",
  ];

  const result = await executeQuery(query, values);
  return result.insertId;
}

async function getAddressById(addressId: number): Promise<any> {
  const query = `
    SELECT
        address_id as addressId,
        country,
        state,
        city,
        district,
        neighbourhood,
        postcode
    FROM addresses
    WHERE address_id = ?
    `;

  return await selectQuery<any>(query, [addressId]);
}

async function getAddressesByIds(addressIds: number[]): Promise<any[]> {
  if (addressIds.length === 0) return [];

  const placeholders = addressIds.map(() => "?").join(",");
  const query = `
    SELECT
        address_id as addressId,
        country,
        state,
        city,
        district,
        neighbourhood,
        postcode
    FROM addresses
    WHERE address_id IN (${placeholders})
    `;

  return await selectQuery<any[]>(query, addressIds);
}

export { findOrCreateAddress, getAddressById, getAddressesByIds };
