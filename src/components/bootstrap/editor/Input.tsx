import { css } from 'glamor';
import * as React from 'react';
import { InputEditor as ShiftInputEditor, Props as ShiftInputEditorProps } from '../../shift/editor/Input';
import { FieldContext, FieldContextTypes } from '../../shift/Field';

export interface Props extends ShiftInputEditorProps {}

const inputStyle = css({
    '&.is-invalid': {
        ':focus': {
            borderColor: '#dc3545',
            boxShadow: '0 0 0 0.2rem rgba(220,53,69,.25)',
        },
        borderColor: '#dc3545',
    },
    ':focus': {
        backgroundColor: '#fff',
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        color: '#495057',
        outline: 0,
    },
    backgroundClip: 'padding-box',
    backgroundColor: '#fff',
    backgroundImage: 'none',
    border: '1px solid #ced4da',
    borderRadius: '.25rem',
    boxSizing: 'border-box',
    color: '#495057',
    display: 'block',
    fontFamily: 'inherit',
    fontSize: '1rem',
    lineHeight: '1.5',
    margin: 0,
    overflow: 'visible',
    padding: '.375rem .75rem',
    touchAction: 'manipulation',
    transition: 'border-color ease-in-out .15s,box-shadow ease-in-out .15s',
    width: '100%',
});

export class InputEditor extends React.Component<Props> {
    public static readonly contextTypes = FieldContextTypes;
    public context: FieldContext;

    public render() {
        return (
            <ShiftInputEditor
                {...this.props}
                className={inputStyle.toString() + (this.context.hasErrors ? ' is-invalid' : '')}
            />
        );
    }
}
