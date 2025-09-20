// database.js
import mongoose from "mongoose";

class MongoDatabase {
  constructor() {
    this.connection = null;
    this.models = {}; // cache models dynamically
  }

  async connect(uri = process.env.MONGO_URI) {
    if (this.connection) return this.connection; // Already connected
    this.connection = await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
    return this.connection;
  }

  // Get or create a dynamic model for a collection
  getModel(collectionName) {
    if (!this.models[collectionName]) {
      const schema = new mongoose.Schema(
        { any: {} },
        { strict: false, timestamps: true, collection: collectionName }
      );
      this.models[collectionName] = mongoose.model(collectionName, schema);
    }
    return this.models[collectionName];
  }

  // === CRUD Methods ===
  async insertOne(collectionName, document) {
    const Model = this.getModel(collectionName);
    const doc = new Model(document);
    return await doc.save();
  }

  async insertMany(collectionName, documents) {
    const Model = this.getModel(collectionName);
    return await Model.insertMany(documents);
  }

  async find(collectionName, query = {}) {
    const Model = this.getModel(collectionName);
    return await Model.find(query);
  }

  async updateOne(collectionName, filter, update, options = { new: true }) {
    const Model = this.getModel(collectionName);
    return await Model.findOneAndUpdate(filter, update, options);
  }

  async updateMany(collectionName, filter, update) {
    const Model = this.getModel(collectionName);
    return await Model.updateMany(filter, update);
  }

  async deleteOne(collectionName, filter) {
    const Model = this.getModel(collectionName);
    return await Model.deleteOne(filter);
  }

  async deleteMany(collectionName, filter) {
    const Model = this.getModel(collectionName);
    return await Model.deleteMany(filter);
  }

  // === Aggregation Methods (MongoDB supports natively) ===
  async aggregate(collectionName, pipeline = []) {
    const Model = this.getModel(collectionName);
    return await Model.aggregate(pipeline);
  }

  // === Helper Methods (kept for compatibility with your mock) ===

  async filterDocuments(documents, query) {
    // In real MongoDB, use find(). This is just a local JS filter fallback.
    return documents.filter((doc) => this.matchesCondition(doc, query));
  }

  matchesCondition(doc, condition) {
    for (const [key, value] of Object.entries(condition)) {
      const docValue = this.getNestedValue(doc, key);

      if (typeof value === "object" && value !== null) {
        if (value.$gte && docValue < value.$gte) return false;
        if (value.$lte && docValue > value.$lte) return false;
        if (value.$gt && docValue <= value.$gt) return false;
        if (value.$lt && docValue >= value.$lt) return false;
        if (value.$in && !value.$in.includes(docValue)) return false;
        if (value.$regex) {
          const regex = new RegExp(value.$regex, value.$options || "");
          if (!regex.test(docValue)) return false;
        }
      } else if (docValue !== value) {
        return false;
      }
    }
    return true;
  }

  getNestedValue(obj, path) {
    return path.split(".").reduce((cur, key) => cur?.[key], obj);
  }

  groupDocuments(documents, groupSpec) {
    const groups = {};
    const { _id, ...aggregations } = groupSpec;

    for (const doc of documents) {
      const groupKey = this.evaluateGroupKey(doc, _id);
      const keyString = JSON.stringify(groupKey);

      if (!groups[keyString]) {
        groups[keyString] = { _id: groupKey, docs: [] };
      }
      groups[keyString].docs.push(doc);
    }

    return Object.values(groups).map((group) => {
      const result = { _id: group._id };

      for (const [field, operation] of Object.entries(aggregations)) {
        if (operation.$sum) {
          if (operation.$sum === 1) {
            result[field] = group.docs.length;
          } else {
            const fieldName = operation.$sum.replace("$", "");
            result[field] = group.docs.reduce(
              (sum, d) => sum + (this.getNestedValue(d, fieldName) || 0),
              0
            );
          }
        } else if (operation.$avg) {
          const fieldName = operation.$avg.replace("$", "");
          const sum = group.docs.reduce(
            (sum, d) => sum + (this.getNestedValue(d, fieldName) || 0),
            0
          );
          result[field] = group.docs.length > 0 ? sum / group.docs.length : 0;
        } else if (operation.$max) {
          const fieldName = operation.$max.replace("$", "");
          result[field] = Math.max(
            ...group.docs.map((d) => this.getNestedValue(d, fieldName) || 0)
          );
        } else if (operation.$min) {
          const fieldName = operation.$min.replace("$", "");
          result[field] = Math.min(
            ...group.docs.map((d) => this.getNestedValue(d, fieldName) || 0)
          );
        } else if (operation.$first) {
          const fieldName = operation.$first.replace("$", "");
          result[field] = this.getNestedValue(group.docs[0], fieldName);
        } else if (operation.$push) {
          const fieldName = operation.$push.replace("$", "");
          result[field] = group.docs.map((d) =>
            this.getNestedValue(d, fieldName)
          );
        }
      }

      return result;
    });
  }

  evaluateGroupKey(doc, groupId) {
    if (typeof groupId === "string") {
      return this.getNestedValue(doc, groupId.replace("$", ""));
    } else if (typeof groupId === "object") {
      const result = {};
      for (const [key, value] of Object.entries(groupId)) {
        if (typeof value === "string" && value.startsWith("$")) {
          result[key] = this.getNestedValue(doc, value.replace("$", ""));
        } else {
          result[key] = value;
        }
      }
      return result;
    }
    return groupId;
  }

  sortDocuments(documents, sortSpec) {
    return documents.sort((a, b) => {
      for (const [field, order] of Object.entries(sortSpec)) {
        const aVal = this.getNestedValue(a, field);
        const bVal = this.getNestedValue(b, field);

        if (aVal < bVal) return order === 1 ? -1 : 1;
        if (aVal > bVal) return order === 1 ? 1 : -1;
      }
      return 0;
    });
  }

  projectDocuments(documents, projectSpec) {
    return documents.map((doc) => {
      const result = {};
      for (const [field, value] of Object.entries(projectSpec)) {
        if (value === 1) {
          result[field] = this.getNestedValue(doc, field);
        } else if (typeof value === "string" && value.startsWith("$")) {
          result[field] = this.getNestedValue(doc, value.replace("$", ""));
        } else {
          result[field] = value;
        }
      }
      return result;
    });
  }

  async lookupDocuments(documents, lookupSpec) {
    const { from, localField, foreignField, as } = lookupSpec;
    const Model = this.getModel(from);
    const foreignDocs = await Model.find();

    return documents.map((doc) => {
      const localValue = this.getNestedValue(doc, localField);
      const matches = foreignDocs.filter(
        (f) => this.getNestedValue(f, foreignField) === localValue
      );
      return { ...doc, [as]: matches };
    });
  }

  unwindDocuments(documents, unwindPath) {
    const field =
      typeof unwindPath === "string"
        ? unwindPath.replace("$", "")
        : unwindPath.path.replace("$", "");
    const result = [];

    for (const doc of documents) {
      const arrayValue = this.getNestedValue(doc, field);
      if (Array.isArray(arrayValue)) {
        for (const item of arrayValue) {
          result.push({ ...doc, [field]: item });
        }
      } else {
        result.push(doc);
      }
    }

    return result;
  }

  generateObjectId() {
    return new mongoose.Types.ObjectId().toString();
  }
}

export const db = new MongoDatabase();
export default db;
