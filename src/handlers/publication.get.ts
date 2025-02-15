'use server';

import { apiInternalError } from '@/lib/constants';
import { ApiResponse } from '@/types/api';
import { PublicationWithAuthor } from '@/types/prisma';
import { PrismaClient, publications } from '@prisma/client';

const prisma = new PrismaClient();

const publicationGet = async (id: string): Promise<ApiResponse<publications>> => {
  try {
    const publication = await prisma.publications.findUnique({
      where: {
        id,
      },
    });

    if (!publication) {
      return {
        ok: false,
        message: 'Publication not found',
      };
    }

    return { ok: true, data: publication };
  } catch (error) {
    console.error(error);
    return apiInternalError;
  } finally {
    await prisma.$disconnect();
  }
};

const publicationGetAll = async (): Promise<ApiResponse<PublicationWithAuthor[]>> => {
  try {
    const publications = await prisma.publications.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            pseudo: true,
            email: true,
            phone: true,
            role: true,
            profile_img: true,
          },
        },
      },
    });
    return { ok: true, data: publications };
  } catch (error) {
    console.error(error);
    return apiInternalError;
  } finally {
    await prisma.$disconnect();
  }
};

const publicationGetByAuthor = async (idOrPseudo: string): Promise<ApiResponse<publications[]>> => {
  try {
    const author = await prisma.user.findFirst({
      where: {
        OR: [
          {
            id: idOrPseudo,
          },
          {
            pseudo: idOrPseudo,
          },
        ],
      },
    });

    if (!author) {
      return {
        ok: false,
        message: 'Author not found',
      };
    }

    const publications = await prisma.publications.findMany({
      where: {
        author_id: author.id,
      },
    });
    return { ok: true, data: publications };
  } catch (error) {
    console.error(error);
    return apiInternalError;
  } finally {
    await prisma.$disconnect();
  }
};

export { publicationGet, publicationGetAll, publicationGetByAuthor };
