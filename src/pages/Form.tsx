import * as React from 'react';
import { requiredValidator, ValidationError } from 'validate.ts';
import { PasswordEditor as Password } from '../components/shift/editor/Password';
import { TextEditor as Text } from '../components/shift/editor/Text';
// import { ShiftTextEditor as Text } from '../components/shift/editor/Text';
import { Field } from '../components/shift/Field';
import { FieldError } from '../components/shift/FieldError';
import { Form, Props as FormProps } from '../components/shift/Form';
import { Label } from '../components/shift/Label';
import { ResetRenderer } from '../components/shift/Reset';
import { SubmitRenderer } from '../components/shift/Submit';

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
    private refResetInput: HTMLInputElement | null = null;
    private refSubmitInput: HTMLInputElement | null = null;

    private bindResetInputRef = (ref: HTMLInputElement) => {
        this.refResetInput = ref;
    };

    private bindSubmitInputRef = (ref: HTMLInputElement) => {
        this.refSubmitInput = ref;
    };

    private focusReset = () => {
        if (this.refResetInput == null) {
            return false;
        }
        this.refResetInput.focus();
        return true;
    };

    private focusSubmit = () => {
        if (this.refSubmitInput == null) {
            return false;
        }
        this.refSubmitInput.focus();
        return true;
    };

    private onSubmit = (values: {}) => {
        window.alert(JSON.stringify(values));
    };

    private renderReset: ResetRenderer['props']['render'] = ({ onReset, registerFocusHandler }) => {
        registerFocusHandler(this.focusReset);
        return <input onClick={onReset} ref={this.bindResetInputRef} type="reset" />;
    };

    private renderSubmit: SubmitRenderer['props']['render'] = ({ onSubmit, registerFocusHandler }) => {
        registerFocusHandler(this.focusSubmit);
        return <input onClick={onSubmit} ref={this.bindSubmitInputRef} type="submit" />;
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
                        <ResetRenderer render={this.renderReset} />
                        <SubmitRenderer render={this.renderSubmit} />
                    </div>
                </Form>
            </div>
        );
    }
}
