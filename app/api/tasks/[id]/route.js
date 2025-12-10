import { NextResponse } from "next/server";
import  { prisma } from "@/lib/prisma";
import { disconnect } from "process";
import { success } from "zod";

export async function PUT(request, {params}) {
    try{
        const resolvedParams= await params;
        const idTask = parseInt(resolvedParams.id);

        const data = await request.json();

        //1.siapkan objek data untuk update
        let updateData = {
            title: data.title,
            status: data.status,
            description: data.description
        };
        //2. logika disconnect
        if(data.hapusKategori==true){
            updateData.category={
                disconnect: true
            };
        }
        else if(data.categoryId){
            updateData.category={
                connect:{
                    id: data.categoryId
                }
            };
        }
        //3.update data
        const updateTask = await prisma.task.update({
            where: {id: idTask},
            data: updateData,
            include: {
                category: true
            }
        });
        return NextResponse.json(
            {
                success: true,
                message: "Tugas berhasil diupdate",
                data: updateTask
            },
            {status: 200}
        );
    }catch(error){
        console.error("Server Error", error);
        return NextResponse.json({error: "Internal Server Error"}, {status:500})
    }
    
}

export async function DELETE(request, {params}) {
    try{
        const resolvedParams= await params;
        const id = parseInt(resolvedParams.id);
        // const id =parseInt(params.id);
        const deletedTask = await prisma.task.delete({
            where: {id}
        });

        return NextResponse.json({
            success: true,
            message: "List terhapus",
            data: deletedTask
        });
    }catch(error){
        console.error("Error DELETE /api/tasks/[id]:",error);

        return NextResponse.json({
            success: false,
            error: "Gagal menghapus list",
            code: 500
        }, {status: 500});
    }
    
}