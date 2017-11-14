import * as React from 'react';
import { validate } from 'validate.ts';
import { Constraints } from 'validate.ts';
import { ShiftContextProvider as ContextProvider } from './ContextProvider';

interface FormField {
    editor: string;
    editorProps: {};
}

export interface FormSchema {
    [key: string]: FormField;
}

export interface Props {
    onSubmit: (value: {}) => void;
    schema?: FormSchema & Constraints<any>;
    tabBoundaryKey?: string;
}

interface State { }

export class ShiftForm extends React.Component<Props, State> {
    public static readonly displayName = 'Shift.Form';
    private refContext: ContextProvider | null;

    public componentWillUnmount() {
        if (this.refContext != null) {
            this.refContext.cancelLiveValidation();
        }
        this.refContext = null;
    }
    private bindContextRef = (ref: ContextProvider) => {
        this.refContext = ref;
    };

    private internalValidate(values: any): Promise<void> {
        if (this.props.schema != null) {
            return validate(values, this.props.schema);
        }
        return Promise.resolve();
    }

    private onReset = (e: React.FormEvent<HTMLFormElement>) => {
        if (this.refContext == null) {
            return;
        }

        e.stopPropagation();
        e.preventDefault();

        this.refContext.cancelLiveValidation();
        this.refContext.clearValidationErrors();

        if (this.refContext.tabRegistry != null) {
            this.refContext.tabRegistry.focusFirst();
        }

        this.refContext.clearValues();
    };

    private onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.refContext == null) {
            return;
        }
        const values = this.refContext.getValues();
        try {
            this.refContext.clearValidationErrors();
            await this.internalValidate(values);
        } catch (e) {
            this.refContext.setValidationErrors(e);
            if (this.props.schema != null) {
                this.refContext.liveValidate(this.props.schema);
            }
            return;
        }
        this.refContext.cancelLiveValidation();
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
            <form onReset={this.onReset} onSubmit={this.onSubmit}>
                <ContextProvider ref={this.bindContextRef} tabBoundaryKey={this.props.tabBoundaryKey} tabCycle>
                    {this.props.children}
                </ContextProvider>
            </form>
        );
    }
}
