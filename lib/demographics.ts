export const pronouns = [
    'she/her',
    'he/him',
    'they/them',
    'she/they',
    'he/they',
    'they/she',
    'they/he',
    'ze/zir',
    'xe/xem',
    'ey/em',
    've/ver',
    'ne/nem',
    'fae/faer',
    'any pronouns'
];

export const getPronounForm = (pronouns: string, pronounFormIndex: number): string => {
    const pronounForms: { [key: string]: string[] } = {
        they: ['they', 'them', 'their', 'theirs'],
        she: ['she', 'her', 'her', 'hers'],
        he: ['he', 'him', 'his', 'his'],
        ze: ['ze', 'zir', 'zir', 'zirs'],
        xe: ['xe', 'xem', 'xyr', 'xyrs'],
        ey: ['ey', 'em', 'eir', 'eirs'],
        ve: ['ve', 'ver', 'vis', 'vers'],
        ne: ['ne', 'nem', 'nir', 'nirs'],
        fae: ['fae', 'faer', 'faer', 'faers']
    }
    let key = 'they';
    const givenPronoun = pronouns.split(/\W+/)[0].toLowerCase();
    if (Object.keys(pronounForms).includes(givenPronoun)) {
        key = givenPronoun;
    }
    return pronounForms[key][pronounFormIndex]
}

export const genderIdentities = [
    'Male',
    'Female',
    'Non-binary',
    'Transgender',
    'Genderqueer',
    'Genderfluid',
    'Agender',
];

export const orientations = [
    'Straight',
    'Gay',
    'Lesbian',
    'Bisexual',
    'Pansexual',
    'Asexual',
    'Queer',
];

export const ethnicities = [
    'Asian / Pacific Islander',
    'Black / African American',
    'Hispanic / Latino',
    'Middle Eastern / North African',
    'South Asian',
    'Native American / Indigenous',
    'White / Caucasian',
    'Multiracial',
];

