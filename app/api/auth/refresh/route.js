import { NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

export async function POST(request) {
    try {
        const refreshToken = request.cookies.get("refresh_token")?.value;

        if (!refreshToken) {
            return NextResponse.json({ error: "No refresh token" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        // Verifikasi refresh token
        const { payload } = await jwtVerify(refreshToken, secret);

        // Buat access token baru
        const newAccessToken = await new SignJWT({
            id: payload.id,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(secret);

        return NextResponse.json({
            message: "Token refreshed",
            accessToken: newAccessToken,
        });

    } catch (error) {
        return NextResponse.json({ error: "Invalid Refresh Token" }, { status: 401 });
    }
}
