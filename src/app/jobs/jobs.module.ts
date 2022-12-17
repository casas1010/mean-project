import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { JobCreateComponent } from "./job-create/job-create.component";
import { AngularMaterialModule } from "../angular-material.module";
import { MatSelectModule } from "@angular/material";
import { JobListComponent } from './job-list/job-list.component';

@NgModule({
  declarations: [JobCreateComponent, JobListComponent, ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,MatSelectModule
  ]
})
export class JobsModule {}
