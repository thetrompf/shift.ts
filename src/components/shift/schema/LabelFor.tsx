import * as React from 'react';
import { FieldContext, FieldContextTypes } from '../Field';
import { Label } from '../Label';

interface State {}

export interface Props {
    Component?: React.ReactType;
}

export class LabelFor extends React.Component<Props, State> {
    public static readonly contextTypes = FieldContextTypes;
    public context: FieldContext;

    public constructor(props: Props) {
        super(props);
        this.state = {};
    }

    public render() {
        if (this.context.schema == null) {
            return null;
        }
        const Component = this.props.Component || Label;
        return <Component>{this.context.schema.label}</Component>;
    }
}
