import { css } from 'glamor';
import * as React from 'react';
import { Props as ShiftResetProps, Reset as ShiftReset } from '../shift/Reset';

export interface Props extends ShiftResetProps {}

const resetStyle = css({
    ':focus': {
        boxShadow: '0 0 0 0.2rem rgba(220,53,69,.5)',
        outline: 0,
        textDecoration: 'none',
    },
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    WebkitAppearance: 'button',
    WebkitUserSelect: 'none',
    backgroundColor: '#c82333',
    border: '1px solid transparent',
    borderColor: '#bd2130',
    borderRadius: '.25rem',
    boxSizing: 'border-box',
    color: '#fff',
    display: 'inline-block',
    fontFamily: 'inherit',
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5,
    margin: 0,
    overflow: 'visible',
    padding: '.375rem .75rem',
    textAlign: 'center',
    textTransform: 'none',
    touchAction: 'manipulation',
    transition: 'background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out',
    userSelect: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
});

export class Reset extends React.Component<Props> {
    public render() {
        return <ShiftReset {...this.props} className={resetStyle.toString()} />;
    }
}
