import { css } from 'glamor';
import * as React from 'react';
import { Form as ShiftForm, Props as ShiftFormProps } from '../shift/Form';

export interface Props extends ShiftFormProps {}
const formStyle = css({
    boxSizing: 'border-box',
});

export class Form extends React.Component<Props> {
    public render() {
        return (
            <ShiftForm {...this.props} className={formStyle.toString()}>
                {this.props.children}
            </ShiftForm>
        );
    }
}
