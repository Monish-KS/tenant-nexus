import mongoose, { Connection } from 'mongoose';

export class CollectionService {
  private connection: Connection;

  constructor(connection: Connection) {
    this.connection = connection;
  }

  async createCollection(organizationName: string): Promise<string> {
    const collectionName = `org_${organizationName.toLowerCase().replace(/\s+/g, '_')}`;
    
    const collections = await this.connection.db.listCollections({ name: collectionName }).toArray();
    if (collections.length > 0) {
      throw new Error(`Collection ${collectionName} already exists`);
    }

    const collection = this.connection.db.collection(collectionName);
    
    await collection.insertOne({
      _schemaVersion: 1,
      _initializedAt: new Date(),
      _note: 'Organization collection initialized',
    });

    await collection.deleteOne({ _schemaVersion: 1 });

    console.log(`Created collection: ${collectionName}`);
    return collectionName;
  }

  async renameCollection(oldCollectionName: string, newCollectionName: string): Promise<void> {
    const oldCollection = this.connection.db.collection(oldCollectionName);
    const newCollection = this.connection.db.collection(newCollectionName);

    const existing = await this.connection.db.listCollections({ name: newCollectionName }).toArray();
    if (existing.length > 0) {
      throw new Error(`Collection ${newCollectionName} already exists`);
    }

    const documents = await oldCollection.find({}).toArray();

    if (documents.length > 0) {
      await newCollection.insertMany(documents);
    }

    await oldCollection.drop();

    console.log(`Renamed collection from ${oldCollectionName} to ${newCollectionName}`);
  }

  async dropCollection(collectionName: string): Promise<void> {
    const collection = this.connection.db.collection(collectionName);
    await collection.drop();
    console.log(`Dropped collection: ${collectionName}`);
  }

  async collectionExists(collectionName: string): Promise<boolean> {
    const collections = await this.connection.db.listCollections({ name: collectionName }).toArray();
    return collections.length > 0;
  }
}

export const collectionService = new CollectionService(mongoose.connection);

