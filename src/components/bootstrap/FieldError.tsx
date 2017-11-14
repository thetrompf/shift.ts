import { css } from 'glamor';
import * as React from 'react';
import { FieldError as ShiftFieldError, Props as ShiftFieldErrorProps } from '../shift/FieldError';

export interface Props extends ShiftFieldErrorProps {}

const helpTextStyle = css({
    boxSizing: 'border-box',
    color: '#dc3545',
    display: 'block',
    fontSize: '.875rem',
    marginTop: '.25rem',
});

export class FieldError extends React.Component<Props> {
    public render() {
        return <ShiftFieldError {...this.props} className={helpTextStyle.toString()} />;
    }
}
