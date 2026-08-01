import { SubmissionFormQuestion } from "@/types";

export const builtInSubmissionQuestions: SubmissionFormQuestion[] = [
    { id: 'email', label: 'Email address', type: 'short_text', builtIn: 'email' },
    { id: 'phone', label: 'Phone number', type: 'short_text', builtIn: 'phone' },
    { id: 'why', label: 'Why are you interested in {verb} {name}?', type: 'long_text', builtIn: 'why' },
    { id: 'experience', label: 'Please describe your improv experience', type: 'long_text', builtIn: 'experience' },
    { id: 'pronouns', label: 'Preferred pronouns', type: 'short_text', builtIn: 'pronouns' },
    { id: 'gender_identity', label: 'Gender', type: 'short_text', builtIn: 'gender_identity' },
    { id: 'orientation', label: 'Orientation', type: 'short_text', builtIn: 'orientation' },
    { id: 'ethnicity', label: 'Race / ethnicity', type: 'short_text', builtIn: 'ethnicity' },
    { id: 'headshot', label: 'Upload headshot', type: 'image', builtIn: 'headshot' },
    { id: 'conflicts', label: 'Any known conflicts?', type: 'long_text', builtIn: 'conflicts' },
    { id: 'anything_else', label: 'Anything else we should know?', type: 'long_text', builtIn: 'anything_else' },
];
