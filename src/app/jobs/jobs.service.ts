import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";
import { Job } from "./job.model";

const BACKEND_URL = environment.apiUrl + "/jobs/";

@Injectable({ providedIn: "root" })
export class JobsService {
  private jobs: Job[] = [];
  private jobsUpdated = new Subject<{ jobs: Job[]; jobCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getJobs(jobsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${jobsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; jobs: any; maxJobs: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(jobData => {
          return {
            jobs: jobData.jobs.map(job => {
              return {
                title: job.title,
                content: job.content,
                id: job._id,
                imagePath: job.imagePath,
                creator: job.creator
              };
            }),
            maxJobs: jobData.maxJobs
          };
        })
      )
      .subscribe(transformedJobData => {
        this.jobs = transformedJobData.jobs;
        this.jobsUpdated.next({
          jobs: [...this.jobs],
          jobCount: transformedJobData.maxJobs
        });
      }); 
  }

  getJobUpdateListener() {
    return this.jobsUpdated.asObservable();
  }

  getJob(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addJob(content: string, image: File) {
    const jobData = new FormData();
    jobData.append("content", content);
    jobData.append("image", image, content);
    console.log('trying to create job from fe');
    console.log('url trying to connect to make post request to:'+BACKEND_URL)
    this.http
      .post<{ message: string; job: Job }>(
        BACKEND_URL,
        jobData
      )
      .subscribe(responseData => {
        console.log('post redirect client')
        this.router.navigate(["/"]);
      });
  }

  updateJob(id: string, title: string, content: string, image: File | string) {
    let jobData: Job | FormData;
    if (typeof image === "object") {
      jobData = new FormData();
      jobData.append("id", id);
      jobData.append("title", title);
      jobData.append("content", content);
      jobData.append("image", image, title);
    } else {
      jobData = {
        id: id,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, jobData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteJob(jobId: string) {
    return this.http.delete(BACKEND_URL + jobId);
  }
}
