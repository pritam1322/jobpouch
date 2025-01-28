"use client"

import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export type JobApplication = {
    id: number
    status: string
    candidateId: number
    jobTitle: string
    companyName: string
    appliedDate: Date // Properly typed as Date
    referralPerson: string | null
    jobLink: string | null
    onStatusUpdate?: (job: JobApplication) => void
    onDeleteJob?: (job: JobApplication) => void
  }

export const columns: ColumnDef<JobApplication>[] = [
      
    {
        accessorKey: "companyName",
        header: () => <div className="ml-4">Company</div>,
        cell: ({ row }) => <div className="text-gray-400 ml-4">{row.getValue("companyName")}</div>,
    },
    {
        accessorKey: "jobTitle",
        header: () => <div className="ml-6">Position</div>,
        cell: ({ row }) => {
        const job = row.original
        const jobLink = job.jobLink;

        return (
            <div className="w-72 ml-6">
            <Link
                href={jobLink?? "#"}
                target={jobLink ? "_blank" : "_self"}
                rel={jobLink ? "noopener noreferrer" : undefined}
                className="font-semibold text-blue-400 hover:text-blue-700"
            >
                {row.getValue("jobTitle") }
            </Link>
            </div>
        );
        }
    },
    {
        accessorKey: "status",
        header: () => <div className=" text-center mr-2">Status</div>,
        cell: ({ row }) => {
        const job = row.original;
        const color =
            job.status === "Applied"
            ? "bg-blue-500/20 text-blue-400"
            : job.status === "Accepted"
            ? "bg-yellow-500/20 text-yellow-400"
            : job.status === "Rejected"
            ? "bg-red-500/20 text-red-400"
            : job.status === "Interview"
            ? "bg-green-500/20 text-green-400"
            : job.status === "Offer"
            ? "bg-orange-500/20 text-orange-400"
            : "";
    
        return ( // ✅ Explicitly returning JSX
            <div className={`px-3 py-1 text-center rounded-full text-sm ${color}`}>
            {row.getValue("status")}
            </div>
        );
        },
    }, 
    {
        accessorKey: "appliedDate",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Applied Date
                <ArrowUpDown className="h-4 w-4" />
            </Button>
            )
        },
        cell: ({row}) => {
            const appliedDate = new Date(row.getValue("appliedDate"))
            return <div className="text-gray-400 ml-4">{appliedDate.toDateString()}</div>
        }
    }, 
    {
        accessorKey: "referralPerson",
        header: ({ column }) => {
            return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Referred By
                <ArrowUpDown className="h-4 w-4" />
            </Button>
            )
        },
        cell: ({ row }) => <div className="text-gray-400 ml-4">{row.getValue("referralPerson")}</div>,

    },
    {
        id: "actions",
        cell: ({ row }) => {
            const job = row.original
            const jobId = job.id

        return (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(jobId.toString())}
                >
                Copy Job ID
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => job.onStatusUpdate?.(job)} 
                >
                Update job
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => job.onDeleteJob?.(job)} 
                >
                Delete Job
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        )
        },
    },
]
