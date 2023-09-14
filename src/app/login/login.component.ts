import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginSuccess:boolean=false;
  loginError: String='';
  constructor(private fb:FormBuilder,private api:ApiService,private loginRouter:Router){}
  ngOnInit(): void {

  }
    loginForm=this.fb.group({ //FORM GROUP
       //form array
      acno:['',[Validators.required,Validators.pattern('[0-9]*')]],
      password:['',[Validators.required,Validators.pattern('[a-zA-Z0-9]*')]],
    })
    //form control passed to html form
  login(){
    if (this.loginForm.valid) {
      alert('register clicked')
      console.log(this.loginForm.value);
      let acno = this.loginForm.value.acno;
      let password = this.loginForm.value.password;
      this.api.login(acno,password).subscribe((response:any)=>{
        console.log(response);

        this.loginSuccess=true
        // //success

        //to set the current username to local storage
        localStorage.setItem('currentUser',response.currentUser)

        // to set the balance to local storage
        localStorage.setItem('currentBalance',response.currentBalance)

         // to set the current acno to local storage
        localStorage.setItem('currentAcno',response.acno)

        // to set the token to local storage
        localStorage.setItem('token',response.token)
        // alert('Login successful')
        setTimeout(() => {
          this.loginRouter.navigateByUrl('/dashboard')
        }, 2000);
        //error message
        this.loginError=response.error.message

        setTimeout(() => {
          this.loginForm.reset()
          this.loginError='Invalid Credentials'
        }, 2000);
      })
    }

    else{
      alert('invalid form')
    }
  }
}
