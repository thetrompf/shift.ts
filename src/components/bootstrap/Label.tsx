import { css } from 'glamor';
import * as React from 'react';
import { Label as ShiftLabel, Props as ShiftLabelProps } from '../shift/Label';

export interface Props extends ShiftLabelProps {
    children?: string;
}

const labelStyle = css({
    boxSizing: 'border-box',
    cursor: 'default',
    display: 'inline-block',
    marginBottom: '.5rem',
    touchAction: 'manipulation',
});

export class Label extends React.Component<Props> {
    public render() {
        return (
            <ShiftLabel {...this.props} className={labelStyle.toString()}>
                {this.props.children}
            </ShiftLabel>
        );
    }
}
