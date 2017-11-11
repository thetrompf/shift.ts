import * as React from 'react';
import { validate } from 'validate.ts';
import { requiredValidator } from 'validate.ts';
import { ShiftContext } from './Context';

interface Props {
    onSubmit: (value: {}) => void;
    tabBoundaryKey?: string;
}

interface State {}

export class ShiftForm extends React.Component<Props, State> {
    private refContext: ShiftContext | null;
    private bindContextRef = (ref: ShiftContext) => {
        this.refContext = ref;
    };

    private internalValidate(values: any): Promise<void> {
        return validate(values, { username: { validators: [requiredValidator] } });
    }

    private onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.refContext == null) {
            return;
        }
        const values = this.refContext.getValues();
        try {
            await this.internalValidate(values);
            this.refContext.clearValidationErrors();
        } catch (e) {
            this.refContext.setValidationErrors(e);
            return;
        }
        this.props.onSubmit(values);
    };

    public validate() {
        if (this.refContext == null) {
            return;
        }
        const values = this.refContext.getValues();
        return this.internalValidate(values);
    }

    public render() {
        return (
            <form onSubmit={this.onSubmit}>
                <ShiftContext ref={this.bindContextRef} tabBoundaryKey={this.props.tabBoundaryKey} tabCycle>
                    {this.props.children}
                </ShiftContext>
            </form>
        );
    }
}
