import { writable } from "svelte/store";
import { z } from "zod";

export const GroupSchema = z.object({
  good: z.string().array(),
  bad: z.string().array(),
  joined: z.string().array(),
  maxPlayers: z.number().nonnegative(),
});
export type Group = z.infer<typeof GroupSchema>;

export const group = writable<Group>({
  good: [],
  bad: [],
  joined: [],
  maxPlayers: 10,
});
