import { SubmissionFormQuestion } from "@/types";

export const builtInSubmissionQuestions: SubmissionFormQuestion[] = [
    { id: 'pronouns', label: 'Pronouns', type: 'short_text', builtIn: 'pronouns' },
    { id: 'gender_identity', label: 'Gender identity', type: 'short_text', builtIn: 'gender_identity' },
    { id: 'orientation', label: 'Sexual orientation', type: 'short_text', builtIn: 'orientation' },
    { id: 'ethnicity', label: 'Race / ethnicity', type: 'short_text', builtIn: 'ethnicity' },
    { id: 'experience', label: 'Improv experience', type: 'long_text', builtIn: 'experience' },
    { id: 'conflicts', label: 'Known conflicts', type: 'long_text', builtIn: 'conflicts' },
    { id: 'anything_else', label: 'Anything else we should know?', type: 'long_text', builtIn: 'anything_else' },
];
