import { executeQuery, selectQuery } from "../db/queryUtils.js";

async function putNewAddress(
  addressId: number,
  country: string,
  state: string,
  city: string,
  district: string,
  neighbourhood: string,
  postcode: string
): Promise<any> {
  const query = `
    INSERT INTO addresses (
      address_id,
      country, 
      state, 
      city, 
      district, 
      neighbourhood, 
      postcode
    ) VALUES 
      (?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    addressId,
    country,
    state,
    city,
    district,
    neighbourhood,
    postcode,
  ];

  return await executeQuery(query, values);
}

async function getAddressById(addressId: number): Promise<any> {
  const query = `
    SELECT 
        id,
        country,
        state,
        city,
        district,
        address,
        neighbourhood,
        postcode
    FROM addresses
    WHERE id = ?
    `;

  return await selectQuery<any>(query, [addressId]);
}

async function getAddressesByIds(addressIds: number[]): Promise<any[]> {
  const query = `
    SELECT 
        id,
        country,
        state,
        city,
        district,
        address,
        neighbourhood,
        postcode
    FROM addresses
    WHERE id IN (?)
    `;

  return await selectQuery<any[]>(query, [addressIds]);
}

async function checkAddressExist(
  country: string,
  state: string,
  city: string,
  district: string,
  neighbourhood: string,
  postcode: string
): Promise<number | null> {
  const query = `
    SELECT 
        address_id as addressId
    FROM 
        addresses 
    WHERE 
        country = ? AND
        state = ? AND
        city = ? AND
        district = ? AND
        neighbourhood = ? AND
        postcode = ?
    ;`;

  const result = await selectQuery<number>(query, [
    country,
    state,
    city,
    district,
    neighbourhood,
    postcode,
  ]);
  return result.length > 0 ? result[0] : null;
}

export { putNewAddress, getAddressById, getAddressesByIds, checkAddressExist };
