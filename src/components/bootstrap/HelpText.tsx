import { css } from 'glamor';
import * as React from 'react';
import { HelpText as ShiftHelpText, Props as ShiftHelpTextProps } from '../shift/HelpText';

export interface Props extends ShiftHelpTextProps {}

const helpTextStyle = css({
    boxSizing: 'border-box',
    color: '#868e96',
    display: 'block',
    fontSize: '80%',
    fontWeight: '400',
    marginTop: '.25rem',
});

export class HelpText extends React.Component<Props> {
    public render() {
        return <ShiftHelpText {...this.props} className={helpTextStyle.toString()} />;
    }
}
