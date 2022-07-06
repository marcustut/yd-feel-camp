import { writable } from "svelte/store";
import { z } from "zod";

export const GroupSchema = z.object({
  good: z.string().array(),
  bad: z.string().array(),
});
export type Group = z.infer<typeof GroupSchema>;

export const group = writable<Group>({
  good: [],
  bad: [],
});
