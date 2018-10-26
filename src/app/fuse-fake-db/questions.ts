export class QuestionsFakeDb
{
    public static set = [
        {
            'id'            : '5725a680b3249760ea21de52',
            'title'         : 'Set 1',
            'note'          : 'Soalan Lazim',
            'questionList'  : []
        },
        {
            'id'            : '5725a680606588342058356d',
            'title'         : 'Set 2',
            'note'          : 'Soalan self-esteem',
            'questionList'  : []
        },
        {
            'id'            : '5725a68009e20d0a9e9acf2a',
            'title'         : 'Set 2015',
            'note'          : 'Soalan untuk kemurungan',
            'questionList'  : []
        }
    ];

    public static questions = [
        {
            'id'              : '5725a6802d10e277a0f35724',
            'name'            : 'John Doe',
            'avatar'          : 'assets/images/avatars/profile.jpg',
            'starred'         : [
                '5725a680b3249760ea21de52',
                '5725a68009e20d0a9e9acf2a'
            ],
            'frequentAssessments': [
                '5725a680b3249760ea21de52'
            ],            
        }
    ];
}
