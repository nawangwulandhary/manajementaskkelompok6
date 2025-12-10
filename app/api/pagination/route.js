// app/api/pagination/route.js (INI BENAR)
import { NextResponse } from 'next/server';
import { getPostsFromDB } from '@/lib/db-helper'; // Pastikan path helper benar

// Named Export untuk metode GET
export async function GET(request) {
  try {
    // 1. Ambil Parameter Query dari URL
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 10;
    const page = parseInt(searchParams.get("page")) || 1;

    // Validasi Dasar
    if (limit <= 0 || page <= 0) {
      return NextResponse.json({ message: "Invalid page or limit value" }, { status: 400 });
    }

    // 2. Hitung OFFSET (Skip)
    const offset = (page - 1) * limit;

    console.log("Offset / Skip:", offset);


    // 3. Ambil Data dan Total Count dari Database
    const { posts, totalCount } = await getPostsFromDB(limit, offset);

    // 4. Hitung Metadata Pagination
    const totalPages = Math.ceil(totalCount / limit);

    // 5. Kembalikan Respons menggunakan NextResponse
    return NextResponse.json({
      message: "Data fetched successfully",
      data: posts,
      pagination: {
        totalItems: totalCount,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    // Mengembalikan Internal Server Error
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}