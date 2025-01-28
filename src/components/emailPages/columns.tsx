"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type EmailInterface = {
    id: string;
    snippet: string;
    onAddJobTrack: (snippet: string, id: string) => void;
    onDeleleEmail: (id: string) => void;
}

export const columns: ColumnDef<EmailInterface>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "snippet",
        header: () => <div className="ml-4 text-gray-200 w-2/3">Email Content</div>,
        cell: ({ row }) => <div className="text-gray-300 ml-4 w-2/3">{row.getValue("snippet")}</div>,
    },
    {
        accessorKey: "addToTrack",
        header: () => <div className="mr-4 text-gray-200">Track Job</div>,
        cell: ({ row }) => {
            const email = row.original;
            return (
                <button
                    className="px-4 py-2 bg-gray-200 text-neutral-800 font-semibold rounded-md"
                    onClick={() => email.onAddJobTrack?.(email.snippet, email.id)}
                >
                    Add
                </button>
            )
        },
        
    },
    {
        id: "deleteIcon",
        cell: ({row}) => {
            const email = row.original;
            return(
                <button onClick={() => email.onDeleleEmail?.(email.id)} className="text-gray-400 mr-8 hover:text-gray-100">
                    <Trash2 className="w-5 h-5" />
                </button>
            )
            
        },

    },
]
