import { css } from 'glamor';
import * as React from 'react';
import { requiredValidator, ValidationError } from 'validate.ts';
import { PasswordEditor as Password } from '../components/shift/editor/Password';
import { TextEditor as Text } from '../components/shift/editor/Text';
// import { ShiftTextEditor as Text } from '../components/shift/editor/Text';
import { Field } from '../components/shift/Field';
import { FieldError } from '../components/shift/FieldError';
import { Form, Props as FormProps } from '../components/shift/Form';
import { HelpText } from '../components/shift/HelpText';
import { Label } from '../components/shift/Label';
import { Reset } from '../components/shift/Reset';
import { Submit } from '../components/shift/Submit';

const schema: FormProps['schema'] = {
    password: {
        editor: 'Password',
        editorProps: {},
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
        editor: 'Password',
        editorProps: {},
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
    username: {
        editor: 'Text',
        editorProps: {},
        label: 'Username',
        validators: [requiredValidator],
    },
};

const containerStyle = css({ textAlign: 'initial', padding: 15 });

export class FormPage extends React.Component {
    private onSubmit = (values: {}) => {
        window.alert(JSON.stringify(values));
    };

    public render() {
        return (
            <div className={containerStyle.toString()}>
                <h1>Sign up</h1>
                <Form onSubmit={this.onSubmit} schema={schema}>
                    <Field editorKey="username">
                        <div>
                            <Label>Username</Label>
                            <Text />
                            <div>
                                <HelpText text="We'll never share you email with anyone else." />
                            </div>
                            <div>
                                <FieldError />
                            </div>
                        </div>
                    </Field>
                    <Field editorKey="password">
                        <div>
                            <Label>Password</Label>
                            <Password />
                            <div>
                                <HelpText />
                            </div>
                            <div>
                                <FieldError />
                            </div>
                        </div>
                    </Field>
                    <Field editorKey="password-repeat">
                        <div>
                            <Label>Repeat password</Label>
                            <Password />
                            <div>
                                <HelpText />
                            </div>
                            <div>
                                <FieldError />
                            </div>
                        </div>
                    </Field>
                    <div>
                        <Reset /> <Submit />
                    </div>
                </Form>
            </div>
        );
    }
}
