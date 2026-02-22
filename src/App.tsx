import './App.css'
import { useEffect, useState } from "react";
import { getCandidate, getJobs, applyToJob } from "./api/api";
import type { Candidate, Job } from "./types/types";
import { JobCard } from "./components/job-card";

function App() {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [loadingCandidate, setLoadingCandidate] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loadingApply, setLoadingApply] = useState<Record<string, boolean>>({});
  const [successApply, setSuccessApply] = useState<Record<string, boolean>>({});
  const [errorApply, setErrorApply] = useState<Record<string, string>>({});

  const EMAIL = "nahuelfariasc@gmail.com";

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingCandidate(true);
        const cand = await getCandidate(EMAIL);
        setCandidate(cand);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingCandidate(false);
      }

      try {
        setLoadingJobs(true);
        const jobsList = await getJobs();
        setJobs(jobsList);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoadingJobs(false);
      }
    }

    loadData();
  }, []);

  async function handleApply(jobId: string, repoUrl: string) {
    if (!candidate) return;

    setLoadingApply((p) => ({ ...p, [jobId]: true }));
    setErrorApply((p) => ({ ...p, [jobId]: "" }));

    try {
      await applyToJob({
        uuid: candidate.uuid,
        jobId,
        candidateId: candidate.candidateId,
        repoUrl,
      });

      setSuccessApply((p) => ({ ...p, [jobId]: true }));
    } catch (e: any) {
      setErrorApply((p) => ({ ...p, [jobId]: e.message }));
    } finally {
      setLoadingApply((p) => ({ ...p, [jobId]: false }));
    }
  }

  return (
    <div className="container">
      <h1>Job Application Challenge</h1>

      {loadingCandidate && <p>Loading candidate...</p>}
      {loadingJobs && <p>Loading jobs...</p>}
      {error && <p className="error">{error}</p>}

      {candidate && <p>Hi {candidate.firstName} 👋</p>}

      <div className="grid">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onApply={handleApply}
            loading={loadingApply[job.id]}
            success={successApply[job.id]}
            error={errorApply[job.id]}
          />
        ))}
      </div>
    </div>
  );
}

export default App
