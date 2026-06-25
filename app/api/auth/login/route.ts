import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { apiLogin, setAuthCookies } from "@/lib/auth/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return NextResponse.json({ message: "البريد الإلكتروني وكلمة المرور مطلوبان" }, { status: 400 });
    }

    const data = await apiLogin(body.email, body.password);
    const cookieStore = await cookies();
    setAuthCookies(cookieStore, data);

    return NextResponse.json({ user: data.user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "فشل تسجيل الدخول";
    const status = message === "بيانات الدخول غير صحيحة" ? 401 : 500;
    return NextResponse.json({ message }, { status });
  }
}
