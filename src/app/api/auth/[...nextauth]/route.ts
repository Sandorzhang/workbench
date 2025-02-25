import NextAuth from "next-auth";
import { authOptions } from "@/lib/types/auth";

console.log('NextAuth handler initialized');
console.log('Available providers:', authOptions.providers.map(p => p.id).join(', '));
console.log('Session strategy:', authOptions.session?.strategy);
console.log('Debug mode:', authOptions.debug);

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 