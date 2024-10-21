import authOptions from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { publicProcedure, router } from "./index";

const prisma = new PrismaClient();

export const appRouter = router({
  getApplication: publicProcedure
    .input(
      z.object({
        where: z.object({
          candidateId: z.number().optional(),
        }),
      })
    )
    .query(async ({ input }) => {
      const { candidateId } = input.where;
      if (!candidateId) {
        throw new Error("Not authenticated");
      } else {
        return await prisma.jobApplication.findFirst({ where: { candidateId } });
      }
    }),

  createApplication: publicProcedure
    .input(
      z.object({
        candidateId: z.number(),
        jobTitle: z.string(),
        companyName: z.string(),
        status: z.string(),
        appliedDate: z.string().datetime(),
      })
    )
    .mutation(async ({ input}) => {


      // Create a new job application record
      const newApplication = await prisma.jobApplication.create({
        data: {
          candidateId: input.candidateId,
          jobTitle: input.jobTitle,
          companyName: input.companyName,
          status: input.status,
          appliedDate: input.appliedDate,
        },
      });

      return newApplication;
    }),
    updateApplicationStatus: publicProcedure.input(
      z.object({
        applicationId: z.number(),
        status: z.string(),
      })
    ).mutation(async ({ input }) => {
      return prisma.jobApplication.update({
        where: { id: input.applicationId },
        data: { status: input.status },
      });
    }),
});

export type AppRouter = typeof appRouter;