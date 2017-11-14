import * as React from 'react';
import { FormContext, FormContextTypes } from '../ContextProvider';
import { Field } from '../Field';

const Children = React.Children;

interface State {}

export interface Props {
    Component?: React.ReactType;
}

export class FieldsFor extends React.Component<Props, State> {
    public static readonly contextTypes = FormContextTypes;

    private fieldTemplate: React.ReactElement<any>;
    public context: FormContext;

    public constructor(props: Props) {
        super(props);
        this.fieldTemplate = Children.only(this.props.children);
        this.state = {};
    }

    private renderField = (editorKey: string) => {
        const schema = this.context.shift.schema;
        const Component = this.props.Component || Field;
        return (
            <Component editorKey={editorKey} key={editorKey} schema={(schema as any)[editorKey]}>
                {React.cloneElement(this.fieldTemplate)}
            </Component>
        );
    };
    public render() {
        if (this.context.shift.schema == null) {
            return null;
        }
        const schema = this.context.shift.schema;
        const editorKeys = Object.keys(schema);

        return editorKeys.map(this.renderField);
    }
}
