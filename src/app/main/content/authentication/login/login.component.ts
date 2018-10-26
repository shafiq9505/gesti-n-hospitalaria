import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FuseConfigService } from '../../../../core/services/config.service';
import { UserLoginService } from '../../../../core/services/user-login.service';
import { fuseAnimations } from '../../../../core/animations';

import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '../../../../core/services/translation-loader.service';
import { FuseNavigationService } from '../../../../core/components/navigation/navigation.service';
import { FuseNavigationModel } from '../../../../navigation/navigation.model';
import { FuseBranchNavigationModel } from '../../../../navigation/branch-navigation.model';
import { locale as navigationEnglish } from '../../../../navigation/i18n/en';
import { locale as navigationTurkish } from '../../../../navigation/i18n/tr';


import { AngularFireAuth } from 'angularfire2/auth';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: fuseAnimations
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginFormErrors: any;

  constructor(
    private fuseConfig: FuseConfigService,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth,
    private router: Router,
    public snackBar: MatSnackBar,
    private fuseNavigationService: FuseNavigationService,
    public userlogin: UserLoginService,
    private translate: TranslateService,
    private translationLoader: FuseTranslationLoaderService
  ) {
    this.fuseConfig.setSettings({
      layout: {
        navigation: 'none',
        toolbar: 'none',
        footer: 'none',
      }
    });

    this.loginFormErrors = {
      email: {},
      password: {}
    };
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.onLoginFormValuesChanged();
    });
  }


  onLoginFormValuesChanged() {
    for (const field in this.loginFormErrors) {
      if (!this.loginFormErrors.hasOwnProperty(field)) {
        continue;
      }

      // Clear previous errors
      this.loginFormErrors[field] = {};

      // Get the control
      const control = this.loginForm.get(field);

      if (control && control.dirty && !control.valid) {
        this.loginFormErrors[field] = control.errors;
      }
    }
  }

  login() {
    // Add languages
    this.translate.addLangs(['en', 'tr']);

    // Set the default language
    this.translate.setDefaultLang('en');

    // Use a language
    this.translate.use('en');

    this.userlogin.login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(result => {

        if (result.result) {

          // if (this.userlogin.user.role == "Doctor") {

          // }

          switch (this.userlogin.user.role) {
            case "Doctor":
              // Set the navigation model
              this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
              // Set the navigation translations
              this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

              this.router.navigate(['/branches']);
              break;
            case "Nurse":
              // Set the navigation model
              this.fuseNavigationService.setNavigationModel(new FuseBranchNavigationModel());
              // Set the navigation translations
              this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

              this.router.navigate(['/branches']);

              break;

            // case "Admin":
            //   // Set the navigation model
            //   this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
            //   // Set the navigation translations
            //   this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

            //   this.router.navigate(['/users']);
            //   break;
            default:
              // Set the navigation model
              this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
              // Set the navigation translations
              this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

              this.router.navigate(['/users']);
              break;
          }

          //load the user and update the firebase
        } else {
          // console.log(result.data);
          // there was an error
          this.snackBar.open(result.data, 'OK', {
            verticalPosition: 'top',
            duration: 10000
          });
        }
      });
    
  }

}
