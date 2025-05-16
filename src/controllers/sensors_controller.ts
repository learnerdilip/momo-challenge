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
    try {
      const { success, data } = z
        .object({
          id: z.coerce.number().nonnegative(),
        })
        .safeParse(ctx.params);

      if (!success) {
        throw new Error("params are invalid");
      }

      const sensor = await SensorsRepository.read(data.id);
      const values = await SensorValuesRepository.list(
        (value) => value.sensor_id === data.id
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
    } catch (err: any) {
      ctx.status = 400;
      ctx.body = { error: err.message };
    }
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
