import { faFaceSmileBeam, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function IntegratedCompanies() {
    const postjson = {
        "title": "Technical Support Engineer",
        "company": "Salesforce",
        "link": "https://example.com/job/software-engineer",
        "referralPerson": "john-deo@test.mail.com",
        "email": "teamfree@example.com"
    };

    const putjson = {  
        "techguid": "cf9af17e-4017-408c-98c8-571f4f43e7f0",
       "status": "Accepted",
       "email": "teamfree@example.com"
    }

    return (
        <div>
            <h1 className="text-4xl font-semibold">Partnered Companies</h1>
            <h2 className="text-md mt-2">Integrate so that your candidate can track, analyze</h2>
            <div className="mt-8 text-xl flex gap-2 underline mb-1">
                <FontAwesomeIcon icon={faScrewdriverWrench} className="h-6" />
                <span className="mb-1">How to Integrate with us</span>
            </div>
            <div className="flex gap-2 text-md">
                <FontAwesomeIcon icon={faFaceSmileBeam} className="h-6" />
                <span className="mb-1">It&apos;s free for now.....</span>
            </div>
            <section className="max-w-5xl mx-auto mt-4">
                <div className="text-lg mt-4 text-green-400">Webhook Link</div>
                <Link
                    target='_blank'
                    rel='noopener noreferrer' 
                    href='https://jobpouch.vercel.app/api/webhook/job'
                    className="text-blue-500"
                >
                    https://jobpouch.vercel.app/api/webhook/job
                </Link>

                <div className="mt-4 bg-stone-800 py-2 px-4 ">
                    <h1>POST Method: creates and returns candidates techguid</h1>
                    <pre className=" text-red-400 p-4 rounded-lg whitespace-pre-wrap">
                        {JSON.stringify(postjson, null, 2)}
                    </pre>
                </div>

                <div className="mt-8 bg-stone-800 py-2 px-4 ">
                    <h1>PUT Method: updates status</h1>
                    <pre className=" text-yellow-400 p-4 rounded-lg whitespace-pre-wrap">
                        {JSON.stringify(putjson, null, 2)}
                    </pre>
                </div>
            </section>
        </div>
    );
}
