// lib/db-helper.js (Contoh dengan Prisma)
import prisma from './prisma'; // Asumsi Anda punya client Prisma

export async function getPostsFromDB(limit, offset) {
  // Ambil total item untuk menghitung totalPages
  const totalCount = await prisma.task.count();

  // Ambil data dengan limit dan offset
  const posts = await prisma.task.findMany({
    take: limit, // Batas jumlah item
    skip: offset, // Lewati sejumlah item
    orderBy: {
      id: 'asc',
    },
  });

  console.log("Data returned:", posts.length);

  return { posts, totalCount };
}