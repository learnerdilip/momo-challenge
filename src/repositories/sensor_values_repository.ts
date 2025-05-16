import { database } from "../database";
import { autoIncrement } from "../utils/identifiers";
import { WithoutIdRepository } from "./_repository";

export type SensorValue = {
  timestamp: number;
  sensor_id: number;
  values: number[];
};

export const SensorValuesRepository: WithoutIdRepository<SensorValue> = {
  async list(filter) {
    if (filter) {
      return database.sensorValues.filter(filter);
    }
    return database.sensorValues;
  },

  async create(data) {
    const value: SensorValue = {
      ...data,
    };
    database.sensorValues.push(value);
    return value;
  },

  async read(id) {
    const value = database.sensorValues.find((value) => value.timestamp === id);
    if (!value) {
      throw new Error(`Failed to find SensorValue with id '${id}'`);
    }
    return value;
  },

  async update(id, data) {
    const index = database.sensorValues.findIndex(
      (value) => value.timestamp === id
    );
    if (!index) {
      throw new Error(`Failed to find SensorValue with id '${id}'`);
    }
    const value = { id, ...data };
    database.sensorValues[index] = value;
    return value;
  },

  async delete(id) {},
};
