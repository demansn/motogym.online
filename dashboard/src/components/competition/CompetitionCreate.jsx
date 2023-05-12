import * as React from 'react';
import {
    Create,
    TabbedForm,
    TextInput,
    required,
    ImageInput,
    ImageField,
    DateInput, TranslatableInputs
} from 'react-admin';
import {RichTextInput} from "ra-input-rich-text";
import {LocalesList} from "../../configs";
import {CompetitionsTypesInput} from "../CompetitionsTypesInput";

const CompetitionCreate = () => (
    <Create>
        <TabbedForm defaultValues={{description: {en: '', ua: '', ru: '', ja: ''}}} >
            <TabbedForm.Tab
                label="details"
                path="details"
                sx={{ maxWidth: '40em' }}
            >
                <TextInput source="name" validate={required()} name={'name'} />
                <DateInput source={'start'} label={'Start date'} name={'start'}/>
                <DateInput source={'finish'} label={'Finish date'} name={'finish'}/>
                <ImageInput validate={required()} source="racetrack" label="Racetrack pictures" name='racetrack' >
                    <ImageField source="src" title="title" />
                </ImageInput>
                <CompetitionsTypesInput name={'type'} source={'type'} />
            </TabbedForm.Tab>
            <TabbedForm.Tab
                label="description"
                path="description"
            >
                <TranslatableInputs locales={LocalesList} defaultLocale={'en'} groupKey={'sd'} >
                    <RichTextInput source="description" label="" />
                </TranslatableInputs>
            </TabbedForm.Tab>
        </TabbedForm>
    </Create>
);

export default CompetitionCreate;
