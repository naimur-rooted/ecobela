import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { handleRouteError, jsonError, jsonOk, zodResponse } from "@/lib/http";
import { registerSchema } from "@/lib/validators";

/**
 * Public customer registration.
 * The role is ALWAYS forced to CUSTOMER — admin accounts can only be created
 * through `npm run admin:create` or by an existing admin.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return zodResponse(parsed.error);

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return jsonError("An account with this email already exists.", 409);

    const user = await prisma.user.create({
      data: { name, email, password: await bcrypt.hash(password, 12), role: "CUSTOMER" },
      select: { id: true, name: true, email: true, role: true },
    });

    return jsonOk({ user }, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "auth/register");
  }
}
