import { NextResponse } from "next/server";
import {prisma} from "@/lib/prisma";
import { connect } from "http2";

export async function GET() {
    try{
        const students = await prisma.student.findMany();

        return NextResponse.json(tasks, {status: 201});
    }catch(error){
        console.error("Server error", error);
        return NextResponse.json({error: "Internal Server Errror"}, {status: 500});
    }
    
}
export async function POST(request) {
    try{
        const data = await request.json();
        const newCategory = await prisma.category.create({
            data:{
                name: data.name
                
            },
        });
     
        return NextResponse.json(newCategory);
    }catch(error){
        console.error("Server error", error);
        return NextResponse.json({error:"Internal Server Error"}, {status: 500});
    }
    
}