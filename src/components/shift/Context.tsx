import { TabRegistry } from '@secoya/tab-navigation.ts';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ValidationAggregateError, ValidationError } from 'validate.ts';

interface Props {
    tabBoundaryKey?: string;
    tabCycle?: boolean;
}

interface State {}

export interface Context {
    shift: {
        addEditor: <T>(name: string, context: EditorContext<T>) => void;
        removeEditor: (name: string) => void;
    };
}

export interface EditorContext<T = any> {
    focus: () => boolean;
    getValue: () => T;
    setValidationErrors: (errors: ValidationError[]) => void;
}

export interface TabRegistryContext {
    tabRegistry?: TabRegistry;
}

export const TabRegistryContextTypes = {
    tabRegistry: PropTypes.instanceOf(TabRegistry),
};

export const ContextTypes = Object.assign({}, TabRegistryContextTypes, {
    shift: PropTypes.shape({
        addEditor: PropTypes.func.isRequired,
        removeEditor: PropTypes.func.isRequired,
    }),
});

export class ShiftContext extends React.Component<Props, State> {
    public static readonly childContextTypes = ContextTypes;

    private editors: Map<string, EditorContext>;
    private tabRegistry: TabRegistry<any>;

    private validationErrors: ValidationAggregateError<any> | null;

    public context: TabRegistryContext | undefined;

    public constructor(props: Props) {
        super(props);
        this.editors = new Map();
        this.tabRegistry = new TabRegistry({
            cycle: !!props.tabCycle,
        });
    }

    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add(this.props.tabBoundaryKey, this.tabRegistry);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete(this.props.tabBoundaryKey);
        }
    }

    private addEditor<T>(this: ShiftContext, name: string, editorContext: EditorContext<T>) {
        this.editors.set(name, editorContext);
        this.tabRegistry.add(name, editorContext.focus);
    }

    private onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab' && e.target != null && (e.target as any).name != null) {
            const name = (e.target as any).name as string;
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                this.tabRegistry.focusPrev(name);
            } else {
                this.tabRegistry.focusNext(name);
            }
        }
    };

    private removeEditor(name: string) {
        this.editors.delete(name);
        this.tabRegistry.delete(name);
    }

    public clearValidationErrors() {
        if (this.validationErrors != null) {
            for (const editor of Array.from(this.validationErrors.errors.keys())) {
                const editorContext = this.editors.get(editor);
                if (editorContext != null) {
                    editorContext.setValidationErrors([]);
                }
            }
            this.validationErrors = null;
        }
    }

    public getChildContext() {
        return {
            shift: { addEditor: this.addEditor.bind(this), removeEditor: this.removeEditor.bind(this) },
            tabRegistry: this.tabRegistry,
        };
    }

    public getValues() {
        const result = {};
        this.editors.forEach((value, key) => {
            result[key] = value.getValue();
        });
        return result;
    }
    public setValidationErrors(err: ValidationAggregateError<any>) {
        this.validationErrors = err;
        err.errors.forEach((errors, key) => {
            const editorContext = this.editors.get(key);
            if (editorContext != null) {
                editorContext.setValidationErrors(errors);
            }
        });
    }

    public render() {
        return <div onKeyDown={this.onKeyDown}>{this.props.children}</div>;
    }
}
