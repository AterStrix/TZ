import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  userStatus: Object;
  errorMessage: string;
  apiUrl = 'https://api.amalyze.com/0.0.12/';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password_md5: ['', Validators.required]
    });
  }

  ngOnInit() { }

  submitForm(captcha: string): void {
    if (this.loginForm.valid) {
      const data = this.loginForm.value;
      data.captcha = captcha;
      this.http.post(`${this.apiUrl}system.user.login`, data).subscribe(() => {
        this.http.post(`${this.apiUrl}system.user.status`, {}).subscribe(response => {
          this.userStatus = response;
        }, ({ error }) => this.errorMessage = error.request.error.message);
      }, ({ error }) => this.errorMessage = error.request.error.message);
    } else {
      Object
        .keys(this.loginForm.controls)
        .forEach(controlKey => this.loginForm.controls[controlKey].markAsTouched());
    }
  }
}
