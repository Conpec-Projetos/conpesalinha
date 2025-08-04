import { z } from "zod";

export const createReservationSchema = z.object({
  title: z.string().min(1, "Título é obrigatório").max(100, "Título deve ter menos de 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter menos de 500 caracteres").optional(),
  startTime: z.date({
    message: "Hora de início é obrigatória",
  }),
  endTime: z.date({
    message: "Hora de fim é obrigatória",
  }),
  reservedBy: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter menos de 50 caracteres"),
  room: z.enum(["salinha", "sede"], {
    message: "Sala é obrigatória",
  }),
}).refine((data) => data.endTime > data.startTime, {
  message: "Hora de fim deve ser após a hora de início",
  path: ["endTime"],
});

export const updateReservationSchema = createReservationSchema.partial();

export type CreateReservationForm = z.infer<typeof createReservationSchema>;
export type UpdateReservationForm = z.infer<typeof updateReservationSchema>;
