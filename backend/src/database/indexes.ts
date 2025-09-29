import { Connection } from 'mongoose';

export async function createDatabaseIndexes(connection: Connection) {
  // Indexes for Order collection
  await connection.collection('orders').createIndex({ school_id: 1 });
  await connection.collection('orders').createIndex({ collect_request_id: 1 });
  await connection.collection('orders').createIndex({ status: 1 });

  // Indexes for OrderStatus collection  
  await connection.collection('orderstatuses').createIndex({ collect_id: 1 });
  await connection.collection('orderstatuses').createIndex({ status: 1 });
  await connection.collection('orderstatuses').createIndex({ payment_time: -1 });

  // Indexes for User collection
  await connection.collection('users').createIndex({ email: 1 }, { unique: true });
  // await connection.collection('users').createIndex({ school_id: 1 });

  console.log('Database indexes created successfully');
}