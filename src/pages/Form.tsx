import * as React from 'react';
import { ShiftPasswordEditor as Password } from '../components/shift/editor/Password';
import { ShiftTextEditor as Text } from '../components/shift/editor/Text';
import { ShiftForm as Form } from '../components/shift/Form';
import { ShiftSubmit as Submit } from '../components/shift/Submit';

export class FormPage extends React.Component {
    private onSubmit = (values: {}) => {
        window.alert(JSON.stringify(values));
    };

    public render() {
        return (
            <div>
                <h1>Sign up</h1>
                <Form onSubmit={this.onSubmit}>
                    <p>
                        <label>Username</label>
                        <Text name="username" />
                    </p>
                    <p>
                        <label>Password</label>
                        <Password name="password" />
                    </p>
                    <p>
                        <label>Repeat password</label>
                        <Password name="password-repeat" />
                    </p>
                    <Submit />
                </Form>
            </div>
        );
    }
}
