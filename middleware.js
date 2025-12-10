import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    const{pathname} = request.nextUrl;

    //1.Public : /api/auth/*
    if(pathname.startsWith("/api/auth")){
        return NextResponse.next();
    }

    //2. cek header token
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer")){
        return NextResponse.json(
            {success: false, error: "Unathorized", code: 401},
            {status: 401}
        );
    }    
    const token = authHeader.split(" ")[1]; //ambil string setelah "bearer"

    try{
        //2.verfikasi token
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const {payload} = await jwtVerify(token, secret);

        //admin only delete produk
        if (pathname.startsWith("/api/tasks")&& request.method === "DELETE"){
            if (payload.role !== "ADMIN"){
                return NextResponse.json({
                    success: false,
                    error: "Delete only untuk Admin",
                    code: 403
                }, {status: 403});
            }
        }

        //3. Admin only: api.users/*
        if(pathname.startsWith("/api/users")&& payload.role !=="ADMIN"){
        return NextResponse.json(
            {success: false, error: "Akses hanya untuk Admin", code: 403},
            {status: 403}
        );
        }

        //3. Admin only: api.categories/*
        if(pathname.startsWith("/api/categories")&& payload.role !=="ADMIN"){
        return NextResponse.json(
            {success: false, error: "Akses hanya untuk Admin", code: 403},
            {status: 403}
        );
        }

        //4. Users: /api/tasks/*
        if(pathname.startsWith("/api/tasks")&& !payload.id){
            return NextResponse.json(
                {success: false, error: "Invalid User Token", code: 403},
                {status: 403}
            );
        }

        //5.lolos
        return NextResponse.next();
    }catch(error){
        //6. Jika token salah/expired
        return NextResponse.json(
            {success:false, error: "Invalid Token", code: 401},
            {status: 401}
        );
    }
}

export const config = {
    matcher: ["/api/users/:path*", "/api/tasks/:path*", "/api/categories/:path*"],
};