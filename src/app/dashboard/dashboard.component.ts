import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms'; // Make sure to import FormGroup as well
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  deleteSuccessMsg: string=''
  deleteConfirmStatus=false
  isCollapse: boolean = false;
  fundTransfer: FormGroup; // Declare fundTransfer as a FormGroup
  displayUsername:any='';
  displayBalance:any='';
  currentAcno:string='';
  balance:any;
  transferError:any;
  transferSuccess:any;
  success:any;
  logOutRouter:any;
  loading:boolean = false;
  acno:any //for parent to child communication
  constructor(private fb: FormBuilder, private api:ApiService, private logOut:Router,private router: Router,private location: Location) {
    // Initialize fundTransfer here
    this.fundTransfer = this.fb.group({
      creditAcno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      amount: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      password: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9]*')]]
    });
  }
  ngOnInit(): void {

    if (!localStorage.getItem("token")) {
      alert("Please Login")
      this.logOut.navigateByUrl('')
    }

    if (localStorage.getItem('currentUser')) {
      this.displayUsername = localStorage.getItem('currentUser')
    }
    //to get balance
    // if (localStorage.getItem('currentBalance')) {
    //   this.displayBalance = localStorage.getItem('currentBalance')
    // }
    //to get current acno
    if (localStorage.getItem('currentAcno')) {
      this.currentAcno=localStorage.getItem('currentAcno')||''
    }
  }

  collapse() {
    this.isCollapse = !this.isCollapse;
  }

  formAlert() {
    if (this.fundTransfer.valid) {
      alert('Form is valid');
    } else {
      alert('Form is not valid');
    }
  }

  //fund transfer
  dashboardForm(){
    if (this.fundTransfer.valid) {
      let creditAcno = this.fundTransfer.value.creditAcno;
      let password = this.fundTransfer.value.password;
      let amount = this.fundTransfer.value.amount;
      this.api.fundtransfer(creditAcno,password,amount).subscribe((result:any)=>{
        console.log(result);
        this.transferSuccess=result.message
        this.success=true;
        // setTimeout(()=>{
        //   this.transferSuccess=''
        // })
      },(result:any)=>{
        console.log(result.error.message);
        this.transferError=result.error.message
        this.success=false;
      })
    }

    else{
      alert(' Please enter valid details')
    }
  }

  getBalance(){
    this.api.getBalance(this.currentAcno).subscribe((result:any)=>{
      this.balance=result.balance
    }),
    (result:any)=>{
      alert(result.error.message)
    }
  }

  reset(){
    this.success='';
    this.fundTransfer.reset()
  }

  logout() {
    this.loading = true;

    setTimeout(() => {
      this.logOut.navigateByUrl('/'); // Navigate to the root page
      localStorage.clear();
    }, 2000); // Adjust the delay time as needed
  }

  deleteAccount() {
    this.acno = localStorage.getItem('currentAcno');
    console.log(this.acno);
    this.deleteConfirmStatus = true;

    // Prevent redirection and stay on the current page
    this.router.navigateByUrl(this.router.url);
  }

  cancelDeleteConfirm(){
    this.acno = ''
    this.deleteConfirmStatus=false
  }

  deleteFromParent(){
    this.api.deleteAccount().subscribe((result:any)=>{
      localStorage.clear()
      this.deleteSuccessMsg=result.message
      setTimeout(() => {
        this.logOut.navigateByUrl('/')
      }, 3000);
    })
  }
}
