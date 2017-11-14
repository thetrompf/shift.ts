import { css } from 'glamor';
import * as React from 'react';
import { Field as ShiftField, Props as ShiftFieldProps } from '../shift/Field';

export interface Props extends ShiftFieldProps {}

const fieldStyle = css({
    boxSizing: 'border-box',
    marginBottom: '1rem',
});

export class Field extends React.Component<Props> {
    public render() {
        return (
            <div className={fieldStyle.toString()}>
                <ShiftField {...this.props}>{this.props.children}</ShiftField>
            </div>
        );
    }
}
