import { css } from 'glamor';
import * as React from 'react';
import { requiredValidator, ValidationError } from 'validate.ts';
import { PasswordEditor as Password } from '../components/bootstrap/editor/Password';
import { TextEditor as Text } from '../components/bootstrap/editor/Text';
import { Field } from '../components/bootstrap/Field';
import { FieldError } from '../components/bootstrap/FieldError';
import { HelpText } from '../components/bootstrap/HelpText';
import { Label } from '../components/bootstrap/Label';
import { Reset } from '../components/bootstrap/Reset';
import { Submit } from '../components/bootstrap/Submit';
import { Form, Props as FormProps } from '../components/shift/Form';
import { EditorFor } from '../components/shift/schema/EditorFor';
import { FieldErrorFor } from '../components/shift/schema/FieldErrorFor';
import { FieldsFor } from '../components/shift/schema/FieldsFor';
import { HelpTextFor } from '../components/shift/schema/HelpTextFor';
import { LabelFor } from '../components/shift/schema/LabelFor';

// tslint:disable object-literal-sort-keys
const schema: FormProps['schema'] = {
    username: {
        editor: Text,
        editorProps: {
            placeholder: 'Enter email',
        },
        label: 'Username',
        helpText: "We'll never share you email with anyone else.",
        validators: [requiredValidator],
    },
    password: {
        editor: Password,
        editorProps: {
            placeholder: 'Password',
        },
        label: 'Password',
        validators: [
            requiredValidator,
            async (value: any) => {
                if (value == null) {
                    return;
                }
                if (typeof value === 'string') {
                    if (value.length < 6) {
                        if (6 - value.length === 1) {
                            throw new ValidationError(`Must be at least one more character`);
                        } else {
                            throw new ValidationError(`Must be at least ${6 - value.length} more characters`);
                        }
                    }
                } else {
                    throw new ValidationError('Must be string');
                }
            },
        ],
    },
    'password-repeat': {
        dependencies: ['password'],
        editor: Password,
        editorProps: {
            placeholder: 'Password',
        },
        label: 'Repeat password',
        validators: [
            async (value: any, dependencies: Map<string, any>) => {
                const passwordValue = dependencies.get('password');
                if (value == null && passwordValue == null) {
                    return;
                }
                if (value !== passwordValue) {
                    throw new ValidationError('Must match password');
                }
            },
        ],
    },
};
// tslint:enable object-literal-sort-keys

const containerStyle = css({ textAlign: 'initial', padding: 15 });

export class SchemaPage extends React.Component {
    private onSubmit = (values: {}) => {
        window.alert(JSON.stringify(values));
    };

    public render() {
        return (
            <div className={containerStyle.toString()}>
                <h1>Sign up</h1>
                <Form onSubmit={this.onSubmit} schema={schema}>
                    <FieldsFor Component={Field}>
                        <div>
                            <LabelFor Component={Label} />
                            <EditorFor />
                            <div>
                                <HelpTextFor Component={HelpText} />
                            </div>
                            <div>
                                <FieldErrorFor Component={FieldError} />
                            </div>
                        </div>
                    </FieldsFor>
                    <div>
                        <Reset /> <Submit />
                    </div>
                </Form>
            </div>
        );
    }
}
