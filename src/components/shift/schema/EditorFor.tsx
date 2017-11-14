import * as React from 'react';
import { FieldContext, FieldContextTypes } from '../Field';

interface State {}

export interface Props {}

export class EditorFor extends React.Component<Props, State> {
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

        const Editor = schema.editor;
        return <Editor {...schema.editorProps}>{this.props.children}</Editor>;
    }
}
