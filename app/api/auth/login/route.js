import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        // Cari user
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        // Cek password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        // Access Token — expired cepat
        const accessToken = await new SignJWT({
            id: user.id,
            email: user.email,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(secret);

        // Refresh Token — expired lama
        const refreshToken = await new SignJWT({
            id: user.id,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("7d")
            .sign(secret);

        // Simpan refresh token di cookie HttpOnly
        const response = NextResponse.json({
            message: "Login Success",
            accessToken: accessToken,
        });

        response.cookies.set("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true, 
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
