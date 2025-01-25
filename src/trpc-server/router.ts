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
        techguid: z.string(),
        referralPersonName: z.string().optional(),
        salaryRange: z.string().optional(),
        followupDate:  z.string().datetime()
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
          techguid: input.techguid,
          referralPersonName: input.referralPersonName || undefined,
          salaryRange: input.salaryRange || null,
          followupDate: input.followupDate
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
    updateUserPassword: publicProcedure.input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { email: input.email},
        data: { password : input.password },
      })
    }),

    createTemplates: publicProcedure
  .input(
    z.object({
      name: z.string(),
      emailtemplate: z.string(),
      linkedintemplate: z.string(),
      userId: z.number(),
    })
  )
  .mutation(async ({ input }) => {
    const template = await prisma.emailTemplate.upsert({
      where: {
        userId: input.userId, // Use a unique identifier to find the record
      },
      update: {
        name: input.name,
        emailtemplate: input.emailtemplate,
        linkedintemplate: input.linkedintemplate,
      },
      create: {
        name: input.name,
        emailtemplate: input.emailtemplate,
        linkedintemplate: input.linkedintemplate,
        userId: input.userId,
      },
    });
    return template;
  }),


    getEmailTemplate: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
  
      if (!userId) {
        throw new Error("user Id not provided");
      }
  
      const user = await prisma.emailTemplate.findUnique({
        where: {
          userId
        },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
  
      return user;
    }),

  createAICreds: publicProcedure
  .input(
    z.object({
      userId: z.number(),
    })
  )
  .mutation(async ({ input }) => {
    const aicred = await prisma.aICred.upsert({
      where: {
        userId: input.userId, // Use a unique identifier to find the record
      },
      create: {            // If not, create a new one
        userId: input.userId,
        count: 1,
      },
      update: {            // If exists, increment the count
        count: { increment: 1 },
      },
    });
    return aicred;
  }),
  getAICred: publicProcedure
    .input(
      z.object({
        userId: z.number(),
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;

      // Check if the userId is provided
      if (!userId) {
        throw new Error("UserId is required");
      }

      // Fetch AICred for the userId
      const aicred = await prisma.aICred.findUnique({
        where: {
          userId: userId, // Use userId to find the record
        },
      });

      // If AICred does not exist, return a message or handle the error
      if (!aicred) {
        throw new Error("AICred not found for the provided userId");
      }

      return aicred;
    }),
    updateUserNameEmail: publicProcedure.input(
      z.object({
        userId: z.number(),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.user.update({
        where: { id: input.userId},
        data: { 
          name : input.name
         },
      })
    }),

    // Add project
    addNewProject: publicProcedure.input(
      z.object({
        userId: z.number(),
        title: z.string(),
        description: z.string(),
        techstack: z.string(),
        githubLink: z.string().optional(),
        liveLink: z.string().optional(),
        thumbnail: z.string()
      })
    )
    .mutation(async ({ input }) => {
      return prisma.projects.create({
        data: {
          userId: input.userId,
          title: input.title,
          description: input.description,
          techstack: input.techstack,
          githubLink: input.githubLink || null,
          liveLink: input.liveLink || null,
          thumbnail: input.thumbnail
        },
      });
    }),

    getProjects: publicProcedure.input(
      z.object({
        userId: z.number() 
      })
    )
    .query(async ({ input }) => {
      const { userId } = input;
      return await prisma.projects.findMany({ where: { userId } })
    }),
    getProjectById: publicProcedure.input(
      z.object({
        projectId: z.string()
      })
    )
    .query(async({input}) => {
      const { projectId } = input;
      return await prisma.projects.findUnique({ where: { id: projectId } })
    }),

    deleteApplication: publicProcedure.input(
      z.object({
        applicationId: z.number()
      })
    )
    .mutation(async ({ input }) => {
        return prisma.jobApplication.delete({
          where: {
            id: input.applicationId,
          },
        })
    })
});

export type AppRouter = typeof appRouter;