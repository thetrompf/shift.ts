import * as React from 'react';
import { FieldContext, FieldContextTypes } from '../Field';
import { FieldError } from '../FieldError';

interface State {}

export interface Props {
    Component?: React.ReactType;
}

export class FieldErrorFor extends React.Component<Props, State> {
    public static readonly contextTypes = FieldContextTypes;
    public context: FieldContext;

    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        const schema = this.context.schema;
        if (schema == null) {
            return null;
        }

        const Component = this.props.Component;
        if (Component == null) {
            return <FieldError />;
        } else {
            return <Component />;
        }
    }
}
