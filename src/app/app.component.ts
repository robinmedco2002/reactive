import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';
import { forbiddenNameValidator } from './shared/user-name.validator';
import { PasswordValidator } from './shared/password.validator';
import { RegistrationService } from './shared/registration.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  registrationForm: FormGroup;

get userName(){
  return this.registrationForm.get('userName');
}

get email(){
  return this.registrationForm.get('email');
}
 get alternateEmails() {
   return this.registrationForm.get('alternateEmails') as FormArray;
 }

 addAlternateEmail() {
   this.alternateEmails.push(this.fb.control(''));
 }


  constructor(private fb: FormBuilder, private _registrationService: RegistrationService){}

  ngOnInit() {
 
    this.registrationForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), forbiddenNameValidator(/password/)]],
      password: [''],
      confirmPassword: [''],
      name: [''],
      mobile: [''],
      email: [''],
      subscribe: [false],
      address: this.fb.group({
        city: [''],
        state: [''],
        postalCode: [''],
      }),
      alternateEmails: this.fb.array([])
    }, {validator: PasswordValidator});

    this.registrationForm.get('subscribe').valueChanges
    .subscribe(checkedValue => {
      const email = this.registrationForm.get('email');
      if (checkedValue) {
        email.setValidators(Validators.required);
         } else {
           email.clearValidators();
         }
         email.updateValueAndValidity();
    });

  }



//  registrationForm = new FormGroup({
//    userName: new FormControl('Robin'),
//    password: new FormControl(''),
//    confirmPassword: new FormControl(' '),

//    address: new FormGroup({
//      city:  new FormControl(''),
//      state: new FormControl(''),
//      postalCode: new FormControl('')
//    })
//   });

  loadApiData(){
    this.registrationForm.patchValue({
      userName: 'Robin',
      password: 'test',
      confirmPassword: 'test'
      
    });
  }

onSubmit(){
  console.log(this.registrationForm.value);
  this._registrationService.register(this.registrationForm.value)
  .subscribe(
    response => console.log('Sucess!', response),
    error => console.error('Error!, error')
  );
}

}
