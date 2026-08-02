import { SubmissionFormQuestion } from "@/types";
import { pronouns, genderIdentities, orientations, ethnicities } from "@/lib/demographics";

export const builtInSubmissionQuestions: SubmissionFormQuestion[] = [
    { id: 'email', label: 'Email address', type: 'short_text', builtIn: 'email', requiredOption: true },
    { id: 'phone', label: 'Phone number', type: 'short_text', builtIn: 'phone', requiredOption: true },
    { id: 'why', label: 'Why are you interested in {verb} {name}?', type: 'long_text', builtIn: 'why' },
    { id: 'experience', label: 'Please describe your improv experience', type: 'long_text', builtIn: 'experience' },
    { id: 'pronouns', label: 'Preferred pronouns', type: 'autocomplete', builtIn: 'pronouns' },
    { id: 'gender_identity', label: 'Gender', type: 'autocomplete', builtIn: 'gender_identity' },
    { id: 'orientation', label: 'Orientation', type: 'autocomplete', builtIn: 'orientation' },
    { id: 'ethnicity', label: 'Race / ethnicity', type: 'autocomplete', builtIn: 'ethnicity' },
    { id: 'conflicts', label: 'Any known conflicts?', type: 'long_text', builtIn: 'conflicts' },
    { id: 'anything_else', label: 'Anything else we should know?', type: 'long_text', builtIn: 'anything_else' },
];

export const autocompleteOptions: { [key: string]: string[] } = {
    pronouns,
    gender_identity: genderIdentities,
    orientation: orientations,
    ethnicity: ethnicities,
}