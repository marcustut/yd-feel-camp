import { writable } from "svelte-local-storage-store";
import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  role: z.enum(["good", "bad"]).optional(),
});
export type User = z.infer<typeof UserSchema>;

export const user = writable<User>("user", {
  name: "",
});
