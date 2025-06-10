import z from "zod";

const readingSchema = z.object({
    date: z.string(),
    time: z.string(),
    systolic: z.string().min(1, "Obrigatório"),
    diastolic: z.string().min(1, "Obrigatório"),
    heartRate: z.string().min(1, "Obrigatório"),
    notes: z.string().optional(),
})
export { readingSchema }
export type ZodReading = z.infer<typeof readingSchema>;
