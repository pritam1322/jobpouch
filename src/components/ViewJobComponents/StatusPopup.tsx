// StatusPopup.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

interface JobApplication {
    id: number;
    status: string;
    candidateId: number;
    jobTitle: string;
    companyName: string;
    appliedDate: Date; // Properly typed as Date
    referralPerson: string | null;
    jobLink: string | null;
  }

interface StatusPopupProps {
  selectedJob: JobApplication | null;
  newStatus: string;
  setNewStatus: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const StatusPopup: React.FC<StatusPopupProps> = ({ newStatus, setNewStatus, onClose, onSubmit }) => (
  <>
    <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={onClose}></div>
    <div className="fixed top-10 left-1/2 w-1/2 h-3/4 transform -translate-x-1/2 bg-white border rounded shadow-2xl z-20">
      <div className="flex justify-between p-4 text-gray-900">
        <h2 className="text-lg font-semibold">Update Job Status</h2>
        <button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100">
          <FontAwesomeIcon icon={faXmark} className="h-5" />
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col ml-6 p-2 text-neutral-600">
          <label htmlFor="status" className="mb-2">Current Status</label>
          <select id="status" name="status" value={newStatus} 
                  onChange={(e) => setNewStatus(e.target.value)} 
                  className="select select-ghost text-neutral-800 bg-gray-200" required>
            <option value="Applied">Applied</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
          </select>
        </div>
        <div className="flex justify-end p-4">
          <button type="submit" className="bg-blue-700 text-white p-2 px-6 rounded-full">Save</button>
        </div>
      </form>
    </div>
  </>
);

export default StatusPopup;
