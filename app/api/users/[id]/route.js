// export async function GET(request, {params}){

//     const {id}= await params;
//     return Response.json({info: 'Anda mengakses ID: ${id}' });
// } 

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { success } from "zod";
    

export async function GET(request, {params}) {
    try{
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        if(isNaN(id)){
            return NextResponse.json(
                {message: "ID tidak valid"}, {status: 400}
            );
        }

        const user = await prisma.user.findUnique({
            where: {id: id}
        });

        if(!user){
            return NextResponse.json(
                {message: "User tidak ditemukan"},
                {status: 400}
            );
        }

        return NextResponse.json({
            success: true,
            message: "User detail fetched",
            data: user
        }, {status: 200});

    }catch(error){
        console.error("Error GET User:", error);
        return NextResponse.json(
            {message: "Error Server"},{status: 500}
        )
    }   
}

export async function PUT(request,{params}) {
    try{
        //ambil id dari params
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        //ambil data dari body
        const data = await request.json();

        //update user
        const updateUser = await prisma.user.update({
            where: {id: id},
            data:{
                name: data.name,
                email: data.email,
                password: data.password
            }
        });
        return NextResponse.json(
            {
                success: true,
                message: "Update berhasil",
                data: updateUser
            },
            {status: 200}
        );
    }catch(error){
        console.error("Error PUT/api/users/[id]:", error);

        return NextResponse.json(
            {
                message: "Terjadi kesalahan saat update user",
                error: error.message
            },
            {status: 500}
        );
    }
}

export async function DELETE(request, {params}) {
    try{
        //Ambil ID dari parameter URL
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.id);

        //hapus data user
        const deletedUser = await prisma.user.delete({
            where: {id: id}
        });

        return NextResponse.json(
            {
                success: true,
                message: "User berhasil dihapus",
                data: deletedUser
            },
            {status: 200}
        );
    }catch(error){
        console.error("Error DELETE /api/users/[id]:", error)

        return NextResponse.json(
            {
                message: "Terjadi keslahan saat menghapus user",
                error: error.message
            },
            {status : 500}
        );
    }
}