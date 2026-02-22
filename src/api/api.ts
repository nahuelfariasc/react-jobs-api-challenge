import type { Candidate, Job, ApplyRequest } from "../types/types";

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

export async function getCandidate(email: string): Promise<Candidate> {
    const res = await fetch(`${BASE_URL}/api/candidate/get-by-email?email=${email}`);
    if (!res.ok) throw new Error("Failed to fetch candidate");
    return res.json();
}

export async function getJobs(): Promise<Job[]> {
    const res = await fetch(`${BASE_URL}/api/jobs/get-list`);
    if (!res.ok) throw new Error("Failed to fetch jobs");
    return res.json();
}

export async function applyToJob(body: ApplyRequest) {
    const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
    }

    return res.json();
}