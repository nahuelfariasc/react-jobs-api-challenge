import { useState } from "react";
import type { Job } from "../types/types";

interface Props {
    job: Job;
    onApply: (jobId: string, repoUrl: string) => void;
    loading?: boolean;
    success?: boolean;
    error?: string;
}

export function JobCard({ job, onApply, loading, success, error }: Props) {
    const [repoUrl, setRepoUrl] = useState("");

    return (
    <div className="card">
        <h3>{job.title}</h3>

        <div className="card__content">
            <input
            name="repoUrl"
            placeholder="https://github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
        />

        <button
            onClick={() => onApply(job.id, repoUrl)}
            disabled={loading || !repoUrl}
        >
            {loading ? "Submitting..." : "Submit"}
        </button>
        </div>

        {success && <p className="success">Applied successfully</p>}
        {error && <p className="error">{error}</p>}
        </div>
    );
}