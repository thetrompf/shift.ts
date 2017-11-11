import * as React from 'react';
import { ShiftInputEditor as Input } from './Input';

interface Props {
    name: string;
    onChange?: (value: string | null) => void;
    value?: string;
}

export class ShiftTextEditor extends React.Component<Props> {
    public render() {
        return <Input name={this.props.name} onChange={this.props.onChange} type="text" value={this.props.value} />;
    }
}
