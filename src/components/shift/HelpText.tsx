import * as React from 'react';

export interface Props {
    className?: string;
    text?: string;
}

export class HelpText extends React.Component<Props> {
    public render() {
        if (this.props.text == null) {
            return null;
        }
        return <small className={this.props.className}>{this.props.text}</small>;
    }
}
