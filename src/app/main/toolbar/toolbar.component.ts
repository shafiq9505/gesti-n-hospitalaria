import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { UserLoginService } from '../../core/services/user-login.service';
import { Contact } from '../../main/content/users/contact.model';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { FuseTranslationLoaderService } from '../../core/services/translation-loader.service';
import { FuseNavigationService } from '../../core/components/navigation/navigation.service';
import { ToolbarService } from './toolbar.service';

import { FuseNavigationModel } from '../../navigation/navigation.model'; 
import { FuseBranchNavigationModel } from '../../navigation/branch-navigation.model';

import { locale as navigationEnglish } from '../../navigation/i18n/en';
import { locale as navigationTurkish } from '../../navigation/i18n/tr';

export interface Branch {
    name: string;
    guid: string
}

@Component({
    selector   : 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss']
})

export class FuseToolbarComponent
{
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;
    userEmail: string;
    user: Contact;
    branchList: Branch[];

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private translate: TranslateService,
        private afAuth: AngularFireAuth,
        private userlogin: UserLoginService,
        private fuseNavigationService: FuseNavigationService,
        private translationLoader: FuseTranslationLoaderService,
        private toolbarService: ToolbarService
    )
    {
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id'   : 'en',
                'title': 'English',
                'flag' : 'us'
            },
            {
                'id'   : 'tr',
                'title': 'Turkish',
                'flag' : 'tr'
            },
            {
                'id'   : 'my',
                'title': 'Malay',
                'flag' : 'my'
            }
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showLoadingBar = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
        });

        this.afAuth.auth.onAuthStateChanged(user => {
          if(user){
            this.userEmail = user.email;
            // this.userlogin.updateUser(user.uid);
            this.user = JSON.parse(localStorage.getItem('currentuser'));
            console.log('curr-user', this.user.name)
            // console.log(this.user);
            switch(this.user.role){
            //   case "Doctor":
            //     // Set the navigation model
            //     console.log("Doctor");
            //     this.fuseNavigationService.setNavigationModel(new FuseBranchNavigationModel());
            //     // Set the navigation translations
            //     this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

            //     this.router.navigate(['/branches']);
            //     break;
            //   case "Nurse":
            //     // Set the navigation model
            //     this.fuseNavigationService.setNavigationModel(new FuseBranchNavigationModel());
            //     // Set the navigation translations
            //     this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

            //     this.router.navigate(['/branches']);

            //     break;
              case "Admin":
                // Set the navigation model
                this.fuseNavigationService.setNavigationModel(new FuseNavigationModel());
                // Set the navigation translations
                this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);

                this.router.navigate(['/users']);
                break;
              default:
                // Set the navigation model
                this.fuseNavigationService.setNavigationModel(new FuseBranchNavigationModel());
                // Set the navigation translations
                this.translationLoader.loadTranslations(navigationEnglish, navigationTurkish);
                
                this.router.navigate(['/branches']);
              break
            }

          }
        });

        
    }

    ngOnInit(): void {
        this.toolbarService.onBranchChanged.subscribe( branch => {
            this.branchList = branch;
            // console.log('branch',this.branchList)
        })
    }

    signOut(){
      // return this.afAuth.auth.signOut().then(() => this.router.navigate(['/login']));
      this.userlogin.logout().then(() => {
        this.router.navigate(['/login']);
      });
    }

    search(value)
    {
        // Do your search here...
        console.log(value);
    }

    setLanguage(lang)
    {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
    }
}
