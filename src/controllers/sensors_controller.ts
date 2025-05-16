import { z } from "zod";
import { SensorValuesRepository } from "../repositories/sensor_values_repository";
import { Sensor, SensorsRepository } from "../repositories/sensors_repository";
import { Controller } from "./_controller";

export const SensorsController: Controller = {
  async list(ctx) {
    const list = await SensorsRepository.list();
    ctx.body = list;
  },

  async read(ctx) {
    const { id } = z
      .object({
        id: z.coerce.number().nonnegative(),
      })
      .parse(ctx.params);

    const sensor = await SensorsRepository.read(id);
    const values = await SensorValuesRepository.list(
      (value) => value.sensor_id === id
    );

    ctx.body = {
      ...sensor,
      values: values.map((value) => {
        return [
          value.timestamp,
          value.values.reduce((agg, curr) => {
            return agg + curr;
          }, 0) / value.values.length,
        ];
      }),
    };
  },

  async update(ctx) {
    const { id } = z
      .object({
        id: z.coerce.number().nonnegative(),
      })
      .parse(ctx.params);

    const validatedUpdateSensor = z
      .object({ name: z.string() })
      .parse(ctx.request.body);

    const sensor = await SensorsRepository.update(id, validatedUpdateSensor);

    ctx.body = {
      ...sensor,
    };
  },
};
