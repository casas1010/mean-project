import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { JobCreateComponent } from "./job-create/job-create.component";
//import { JobListComponent } from "./post-list/post-list.component";
import { AngularMaterialModule } from "../angular-material.module";
import { MatSelectModule } from "@angular/material";

@NgModule({
  declarations: [JobCreateComponent, ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,MatSelectModule
  ]
})
export class JobsModule {}
