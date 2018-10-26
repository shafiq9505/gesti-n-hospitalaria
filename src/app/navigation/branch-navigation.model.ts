import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';

export class FuseBranchNavigationModel implements FuseNavigationModelInterface
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'applications',
                'title'   : 'Applications',
                'translate': 'BRANCH',
                'type'    : 'group',
                'children': [
                    {
                        'id'   : 'dashboard',
                        'title': 'Dashboard',
                        'translate': 'NAVBRANCH.DASHBOARD',
                        'type' : 'item',
                        'icon' : 'dashboard',
                        'url'   : '/dashboard'
                    },


                    {
                        'id'   : 'calendar',
                        'title': 'Calendar',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/calendar',
                    },

                    {
                        'id'   : 'sample',
                        'title': 'Patients',
                        'translate': 'NAVBRANCH.PATIENTS.TITLE',
                        'badge'   : {
                          'title' : 200,
                          'bg'   : '#F44336',
                          'fg'   : '#FFFFFF'
                        },
                        'type' : 'item',
                        'icon' : 'perm_contact_calendar',
                        'url'   : '/branches'
                    },
                    // {
                    //     'id'   : 'branch',
                    //     'title': 'TEAM',
                    //     'translate': 'NAVBRANCH.TEAM_MEMBERS',
                    //     'type' : 'item',
                    //     'icon' : 'people',
                    //     'url'  : '/team_members',
                    //     'badge': {
                    //         'title': 25,
                    //         // 'translate': 'NAV.BRANCH.BADGE',
                    //         'bg'   : '#F44336',
                    //         'fg'   : '#FFFFFF'
                    //     }
                    // },
                    // {
                    //     'id'   : 'branch',
                    //     'title': 'TEAM',
                    //     'translate': 'NAVBRANCH.OCCASIONOFSERVICE',
                    //     'type' : 'item',
                    //     'icon' : 'people',
                    //     'url'  : '/team_members',
                    //     'badge': {
                    //         'title': 25,
                    //         // 'translate': 'NAV.BRANCH.BADGE',
                    //         'bg'   : '#F44336',
                    //         'fg'   : '#FFFFFF'
                    //     }
                    // },
                    {
                      'id'   : 'OccassionService',
                      'title': 'Occassion Of Service',
                      //translate': 'NAV.BRANCHMGT.TITLE',
                      'type' : 'item',
                      'icon' : 'assignment_turned_in',
                      'url'  : '/occassionsevice'
                    },


                  // {
                  //       'id': 'branch',
                  //       'title': 'TEAM',
                  //       'translate': 'NAVBRANCH.MEDICATIONISSUED',
                  //       'type': 'item',
                  //       'icon': 'people',
                  //       'url': '/team_members',
                  //       'badge': {
                  //           'title': 25,
                  //           // 'translate': 'NAV.BRANCH.BADGE',
                  //           'bg': '#F44336',
                  //           'fg': '#FFFFFF'
                  //       }
                  //   },

                  {
                      'id'   : 'medication',
                      'title': 'Medication',
                      //translate': 'NAV.BRANCHMGT.TITLE',
                      'type' : 'item',
                      'icon' : 'format_list_bulleted',
                      'url'  : '/medication'
                  },

                    {
                        'id': 'patient-reg',
                        'title': 'Patient Register',
                        'translate': 'NAV.PATIENTS.TITLE',
                        'type': 'item',
                        'icon': 'add_circle_outline',
                        'url': '/patient-register'

                    }



                ]
            }
        ];
    }
}
