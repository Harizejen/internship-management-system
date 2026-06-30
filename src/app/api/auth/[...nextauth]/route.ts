import { handlers } from "@/auth";

// Expose the Auth.js core engine handlers to incoming HTTP network requests
export const { GET, POST } = handlers;
