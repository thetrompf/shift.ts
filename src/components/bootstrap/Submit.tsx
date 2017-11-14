import { css } from 'glamor';
import * as React from 'react';
import { Props as ShiftSubmitProps, Submit as ShiftSubmit } from '../shift/Submit';

export interface Props extends ShiftSubmitProps {}

const submitStyle = css({
    ':focus': {
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
        outline: 0,
        textDecoration: 'none',
    },
    MozUserSelect: 'none',
    MsUserSelect: 'none',
    WebkitAppearance: 'button',
    WebkitUserSelect: 'none',
    backgroundColor: '#007bff',
    border: '1px solid transparent',
    borderColor: '#007bff',
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

export class Submit extends React.Component<Props> {
    public render() {
        return <ShiftSubmit {...this.props} className={submitStyle.toString()} />;
    }
}
