import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { JOBTYPES } from "../job.model";

//import { PostsService } from "../posts.service";
import { Job } from "../job.model";
import { mimeType } from "../../posts/post-create/mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { JobsService } from "../jobs.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

@Component({
  selector: "app-job-create",
  templateUrl: "./job-create.component.html",
  styleUrls: ["./job-create.component.css"],
})
export class JobCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  job: Job;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;

  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;
  //jobTypes = new FormControl(""); // how do i install this properly? if I comment out this whole line, i get an error
  jobTypesArr: string[];

  constructor(
    public jobsService: JobsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  authenticationSetup() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  ngOnInit() {
    this.jobTypesArr = JOBTYPES;

    this.authenticationSetup();
    this.form = new FormGroup({
     // jobTypes: this.jobTypes, // this line works, but I feel there is a better way of doing this
       jobTypes: new FormControl(''), // i wan to use this line, but it does not work when i try to print the content of the form later on
      content: new FormControl(null, { validators: [Validators.required] }),
      address: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        // this.mode = "edit";
        // this.postId = paramMap.get("postId");
        // this.isLoading = true;
        // this.jobsService.getJob(this.postId).subscribe((postData) => {
        //   this.isLoading = false;
        //   this.job = {
        //     id: postData._id,
        //     content: postData.content,
        //     imagePath: postData.imagePath,
        //     creator: postData.creator,
        //     state: "new",
        //     substate: "new",
        //     jobType: postData.jobType
        //   };
        //   this.form.setValue({
        //     content: this.job.content,
        //     image: this.job.imagePath,
        //   });
        // });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    console.log("job-create.component:   onSavePost");
    if (this.form.invalid) {
      console.log("form is not valid!");
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      console.log("on create");

      this.jobsService.addJob(
        this.form.value.content,
        this.form.value.image,
        this.form.value.address,
        this.form.value.jobTypes
      );
    } else {
      console.log("onSavePost():: on update");
      console.log();
      // this.jobsService.updateJob(
      //   this.postId,
      //   this.form.value.title,
      //   this.form.value.content,
      //   this.form.value.image,
      //   this.form.value.state,
      //   this.form.value.substate,
      // );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
