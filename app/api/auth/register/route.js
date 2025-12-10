import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try{
        const{name, email, password,role} = await request.json();

        //1.Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        //2.simpan ke DB
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword, //simpan yang sudah di-hash!
                role: role || "USER",
            },
        });

        return NextResponse.json({message: "User Created"}, {status: 201});
    }catch(error){
        console.error("Error GET User:", error);
        return NextResponse.json({message: "Error"},{status: 500});
    }
    
}