import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';

export class FuseNavigationModel implements FuseNavigationModelInterface
{
    public model: any[];

    constructor() {
        this.model = [
            {
                'id': 'applications',
                'title': 'Applications',
                'translate': 'ADMIN',
                'type': 'group',
                'children': [
                    {
                        'id': 'dashboard',
                        'title': 'Dashboard',
                        'translate': 'NAV.DASHBOARD.TITLE',
                        'type': 'item',
                        'icon': 'dashboard',
                        'url': '/dashboard',
                    },
                    {
                        'id': 'sample',
                        'title': 'Users',
                        'translate': 'NAV.SAMPLE.TITLE',
                        'type': 'item',
                        'icon': 'people',
                        'url': '/users',
                        'badge': {
                            'title': 25,
                            'translate': 'NAV.BRANCH.BADGE',
                            'bg': '#F44336',
                            'fg': '#FFFFFF'
                        }
                    },
                  {
                      'id'   : 'assessments',
                      'title': 'Assessments',
                      //'translate': 'NAV.PATIENTS.TITLE',
                      'type' : 'item',
                      'icon' : 'email',
                      'url'  : '/boards',
                  },
                  {
                      'id'   : 'branchmgt',
                      'title': 'Branch Management',
                      'translate': 'NAV.BRANCHMGT.TITLE',
                      'type' : 'item',
                      'icon' : 'format_list_bulleted',
                      'url'  : '/branchmgt'
                  },
                  {
                      'id'   : 'template',
                      'title': 'Template',
                      'translate': 'NAV.TEMPLATE.TITLE',
                      'type' : 'item',
                      'icon' : 'format_list_bulleted',
                      'url'  : '/template'
                  },
                  {
                    'id'   : 'icd10',
                    'title': 'Icd10',
                    //translate': 'NAV.BRANCHMGT.TITLE',
                    'type' : 'item',
                    'icon' : 'note_add',
                    'url'  : '/icd10'
                },
                {
                      'id'   : 'masterconfig',
                      'title': 'MasterConfig',
                      //translate': 'NAV.BRANCHMGT.TITLE',
                      'type' : 'item',
                      'icon' : 'format_list_bulleted',
                      'url'  : '/masterconfig'
                  },
                  {
                    'id'   : 'medicationConfig',
                    'title': 'Medication Configuration',
                    //translate': 'NAV.BRANCHMGT.TITLE',
                    'type' : 'item',
                    'icon' : 'local_hospital',
                    'url'  : '/medicationConfig'
                },

                  {
                      'id' : 'report',
                      'title': 'Reports',
                      //'translate': 'NAV.REPORT.TITLE',
                      'type': 'item',
                      'icon': '',
                      'url': '/reports',
                  }
                ]
            }
        ];
    }
}
