import { PrismaClient } from "@prisma/client";
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
        return await prisma.jobApplication.findMany({ where: { candidateId } });
      }
    }),

    getUserByEmail: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { email } = input;
  
      if (!email) {
        throw new Error("Email not provided");
      }
  
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return user;
    }),
  
    
  createApplication: publicProcedure
    .input(
      z.object({
        candidateId: z.number(),
        jobTitle: z.string(),
        companyName: z.string(),
        status: z.string(),
        appliedDate: z.string().datetime(),
        referralPerson: z.string().optional(),
        jobLink: z.string(),
        techguid: z.string()
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
          referralPerson: input.referralPerson || null,
          jobLink: input.jobLink,
          techguid: input.techguid
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