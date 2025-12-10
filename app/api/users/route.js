import {prisma} from "@/lib/prisma";
import { error } from "console";
import { NextResponse } from "next/server";
import {email, success, z} from "zod";

const UserSchema = z.object({
    name: z.string().min(3,{message: "Nama minimal harus 3 karakter"}),
    email: z.string().email({message: "Format email tidak valid"}),
    password: z.string().min(8,{message: "Password minimal harus 8 karakter"}),
});

//GET : Ambil semua data user
export async function GET() {
    try{
    const users =await prisma.user.findMany();
    return NextResponse.json({
        success: true,
        message: "All users fetched",
        data: users
    });    
}catch(error){
    return NextResponse.json({
        success: false,
        error: "Server Error",
        code: 500
    }, {status: 500});
}
}

//POST : Tambah user baru
export async function POST(request) {
    try{
    const body =await request.json();
    const validation = UserSchema.safeParse(body);
    if(!validation.success){
        return NextResponse.json({
            message: "Input Tidak Valid",
            error: validation.error.flatten().fieldErrors
        },
    {status: 400});
    }
    const newUser =await prisma.user.create({
        data: body
    });
    return NextResponse.json({
        success: true,
        message: "User created",
        data: newUser
    },{status: 200});
}catch(error){
    console.error("ERROR POST User: ", error);
    NextResponse.json({message: "Server Error"}, {status: 500});
}

}