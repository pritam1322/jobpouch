'use client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { faBolt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React, { useState } from 'react';

interface ResumeFile {
    version: string;
    file: File | null;
}

export default function Resume() {
    const [resumes, setResumes] = useState<ResumeFile[]>([]);
    const [version, setVersion] = useState<string>('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVersion(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (file && version) {
            const newResume: ResumeFile = { version, file };
            setResumes([...resumes, newResume]);
            setFile(null);
            setVersion('');
        }
    };

    return (
        <section>
            <div className="max-w-5xl mx-auto my-8 pb-24">
                <div className='btn btn-active bg-bgcolor text-gray-400 hover:bg-btncolor border border-bgcolor hover:border-btncolor  my-2'>
                    <FontAwesomeIcon icon={faBolt} className="h-6 text-orange-500" />
                    <h1 className="">Resume</h1>
                </div>
                <form onSubmit={handleSubmit} className="bg-bgcolor p-8 rounded-md">
                    <div className="grid w-full max-w-lg items-center gap-1.5">
                        <Label htmlFor="resumeTitle" className='text-gray-200 my-1'>Title</Label>
                        <Input type="text" id="resumeTitle" className='bg-neutral-900 text-gray-100 '/>
                    </div>
                    <div className="mt-4 mb-8">
                        <label htmlFor="resume" className="block text-sm font-medium my-2 text-gray-400">
                            Upload your latest resume
                        </label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered file-input-primary w-full max-w-lg bg-neutral-900 text-gray-100"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        Upload
                    </button>
                </form>

               
            </div>
            <div className="text-center">Development in progress</div>
        </section>
    );
}
