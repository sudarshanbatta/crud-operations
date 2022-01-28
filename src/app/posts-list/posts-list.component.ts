import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PostsService } from '../shared/services/posts.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss'],
})
export class PostsListComponent implements OnInit {
  postList: any = [];
  commentsList: any = [];
  pageSize;
  page = 1;
  closeResult = '';
  spinner: any = false;
  postEdit: Boolean = false;
  showComment: Boolean = false;
  selectedPost: any;
  title: any;
  body: any;
  name: any;
  email: any;
  submitted: Boolean = false;
  postForm: FormGroup;
  commentsForm: FormGroup;
  searchFilter: any;
  addnewPost: Boolean = false;
  filteredDatas: any = [];
  addComments: Boolean = false;
  sortDir = 1;//1= 'ASE' -1= DSC;

  constructor(
    private postsService: PostsService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.pageSize = 10;
    this.postsList();
    this.sortArr('title');
    this.postForm = this.formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required],
    });
    this.commentsForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      body: ['', Validators.required],
    });
  }
  get f() {
    return this.postForm.controls;
  }
  get c() {
    return this.commentsForm.controls;
  }
  postsList() {
    this.spinner = true;
    this.postsService.getPostList().subscribe((res: any) => {
      this.postList = res;
      this.filteredDatas = res;
      this.spinner = false;
    });
  }
  deletePost(index: any) {
    this.spinner = true;
    this.postsService.deletePost(index).subscribe((res: any) => {
      this.postList.splice(index, 1);
      this.spinner = false;
    });
  }
  deleteComment(index: any) {
    this.commentsList.splice(index, 1);
  }
  showComments(item, content) {
    this.modalService.open(content, { size: 'lg', centered: true });
    this.spinner = true;
    this.showComment = true;
    this.postEdit = false;
    this.postsService.getCommets(item.id).subscribe((res: any) => {
      this.commentsList = res;
      console.log(res);
      this.spinner = false;
    });
  }
  editPost(item, content) {
    console.log(item);
    this.title = item.title;
    this.body = item.body;
    this.postEdit = true;
    this.showComment = false;
    this.selectedPost = item.id;
    this.modalService.open(content, { centered: true });
  }
  addPost(content) {
    this.addnewPost = true;
    this.postEdit = true;
    this.showComment = false;
    this.modalService.open(content, { centered: true });
  }
  addComment() {
    this.addComments = !this.addComments;
  }
  savePost() {
    this.submitted = true;

    if (this.postForm.invalid) {
      return;
    } else {
      const reqData = {
        id: this.postList.length + 1,
        title: this.postForm.controls['title'].value,
        body: this.postForm.controls['body'].value,
      };
      if ((this.addnewPost = false)) {
        // this.postsService
        // .updatePost(this.selectedPost, reqData)
        // .subscribe((res: any) => {
        //   console.log(res);
        //   this.modalService.dismissAll();
        // });
        this.filteredDatas.push(reqData);
        console.log(this.filteredDatas);
      } else {
        console.log(reqData);
        this.filteredDatas.push(reqData);
        console.log(this.filteredDatas);
        this.modalService.dismissAll();
      }
    }
  }
  saveComments() {
    this.submitted = true;
    if (this.commentsForm.invalid) {
      return;
    } else {
      const reqData = {
        id: this.commentsList.length + 1,
        name: this.commentsForm.controls['name'].value,
        email: this.commentsForm.controls['email'].value,
        body: this.commentsForm.controls['body'].value,
      };
      console.log(reqData);
      this.commentsList.push(reqData);
      this.addComments = false;
      console.log(this.commentsList);
    }
  }
  search(): any {
    if (this.postList && this.searchFilter.length > 0) {
      this.filteredDatas = this.postList.filter((res: any) => {
        console.log(res.title);
        return res.title
          .toLowerCase()
          .includes(this.searchFilter.toLowerCase());
      });
    } else {
      this.filteredDatas = this.postList;
    }
  }
  resetSearch(): any {
    this.filteredDatas = this.postList;
    this.searchFilter = '';
  }
  onSortClick(event) {
    let target = event.currentTarget,
      classList = target.classList;

    if (classList.contains('fa-chevron-up')) {
      classList.remove('fa-chevron-up');
      classList.add('fa-chevron-down');
      this.sortDir=-1;
    } else {
      classList.add('fa-chevron-up');
      classList.remove('fa-chevron-down');
      this.sortDir=1;
    }
    this.sortArr('title');
  }

  sortArr(colName:any){
    this.filteredDatas.sort((a,b)=>{
      a= a[colName].toLowerCase();
      b= b[colName].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }
}
