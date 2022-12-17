// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-job-list',
//   templateUrl: './job-list.component.html',
//   styleUrls: ['./job-list.component.css']
// })
// export class JobListComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";

import { Job } from "../job.model";
import { JobsService } from "../jobs.service";
import { AuthService } from "../../auth/auth.service";

@Component({
  selector: "app-Job-list",
  templateUrl: "./Job-list.component.html",
  styleUrls: ["./Job-list.component.css"]
})
export class JobListComponent implements OnInit, OnDestroy {

  jobs: Job[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public jobsService: JobsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    //this.isLoading = true;
    this.jobsService.getJobs(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.jobsService
      .getJobUpdateListener()
      .subscribe(
        (postData: { jobs: Job[]; jobCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.jobCount;
        this.jobs = postData.jobs;
      }
      );
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.jobsService.getJobs(this.postsPerPage, this.currentPage);
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.jobsService.deleteJob(postId).subscribe(() => {
      this.jobsService.getJobs(this.postsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
