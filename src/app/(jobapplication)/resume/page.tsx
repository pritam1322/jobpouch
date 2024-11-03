'use client';
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
            <div className="max-w-5xl mx-auto my-16">
                <h1 className="text-4xl font-bold">Resume</h1>
                <form onSubmit={handleSubmit}>
                    <div className="my-4">
                        <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                            Resume Version
                        </label>
                        <input
                            type="text"
                            id="version"
                            value={version}
                            onChange={handleVersionChange}
                            className="block w-full my-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                            required
                        />
                    </div>
                    <div className="my-4">
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
                            Upload your latest resume
                        </label>
                        <input
                            type="file"
                            id="resume"
                            name="resume"
                            onChange={handleFileChange}
                            className="block w-full my-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600">
                        Upload
                    </button>
                </form>

                {/* Display uploaded resumes */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold">Uploaded Resumes</h2>
                    <ul className="mt-4 space-y-2">
                        {resumes.map((resume, index) => (
                            <li key={index} className="flex items-center justify-between p-2 border rounded-md">
                                <span>{resume.version}</span>
                                <span>{resume.file?.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="text-center">Development in progress</div>
        </section>
    );
}
