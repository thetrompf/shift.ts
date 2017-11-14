import * as React from 'react';
import { requiredValidator, ValidationError } from 'validate.ts';
import { ShiftPasswordEditor as Password } from '../components/shift/editor/Password';
import { ShiftTextEditor as Text } from '../components/shift/editor/Text';
// import { ShiftTextEditor as Text } from '../components/shift/editor/Text';
import { ShiftField as Field } from '../components/shift/Field';
import { ShiftFieldError as FieldError } from '../components/shift/FieldError';
import { Props as FormProps, ShiftForm as Form } from '../components/shift/Form';
import { ShiftLabel as Label } from '../components/shift/Label';
import { ShiftReset as Reset } from '../components/shift/Reset';
import { ShiftSubmit as Submit } from '../components/shift/Submit';

const schema: FormProps['schema'] = {
    password: {
        editor: 'Password',
        editorProps: {},
        validators: [
            requiredValidator,
            async (value: any) => {
                if (value == null) {
                    return;
                }
                if (typeof value === 'string') {
                    if (value.length < 6) {
                        throw new ValidationError('Must be at least 6 chars');
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
        validators: [requiredValidator],
    },
};

export class FormPage extends React.Component {
    private onSubmit = (values: {}) => {
        window.alert(JSON.stringify(values));
    };

    public render() {
        return (
            <div>
                <h1>Sign up</h1>
                <Form onSubmit={this.onSubmit} schema={schema}>
                    <Field editorKey="username">
                        <div>
                            <Label>Username</Label>
                            <Text />
                            <div style={{ height: 80 }}>
                                <FieldError />
                            </div>
                        </div>
                    </Field>
                    <Field editorKey="password">
                        <div>
                            <Label>Password</Label>
                            <Password />
                            <div style={{ height: 80 }}>
                                <FieldError />
                            </div>
                        </div>
                    </Field>
                    <Field editorKey="password-repeat">
                        <div>
                            <Label>Repeat password</Label>
                            <Password />
                            <div style={{ height: 80 }}>
                                <FieldError />
                            </div>
                        </div>
                    </Field>
                    <div>
                        <Reset />
                        <Submit />
                    </div>
                </Form>
            </div>
        );
    }
}
