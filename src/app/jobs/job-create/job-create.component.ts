import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

//import { PostsService } from "../posts.service";
import { Job } from "../job.model";
import { mimeType } from "../../posts/post-create/mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { JobsService } from "../jobs.service";

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

  constructor(
    public jobsService: JobsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}


  authenticationSetup(){
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe((authStatus) => {
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.authenticationSetup();
    this.form = new FormGroup({
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.jobsService.getJob(this.postId).subscribe((postData) => {
          this.isLoading = false;
          this.job = {
            id: postData._id,
            content: postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator,
            state: "new",
            substate: "new",
          };
          this.form.setValue({
            content: this.job.content,
            image: this.job.imagePath,
          });
        });
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
    console.log("onSavePost");
    if (this.form.invalid) {
      console.log("form is not valid!");
      return; 
    }
    this.isLoading = true;
    if (this.mode === "create") {
      console.log("on create");
      console.log("this.form.value.content:  "+this.form.value.content);
      this.jobsService.addJob(this.form.value.content, this.form.value.image);
    } else {
      console.log("onSavePost():: on update");
      this.jobsService.updateJob(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image,
        this.form.value.state,
        this.form.value.substate,
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
