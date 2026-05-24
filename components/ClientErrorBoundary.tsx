'use client';

import {Component, type ErrorInfo, type ReactNode} from 'react';

type Props = {children: ReactNode; fallback: ReactNode};
type State = {error: Error | null};

/** Catches crashes in descendant client renders (maps, widgets, …). */
export class ClientErrorBoundary extends Component<Props, State> {
  state: State = {error: null};

  static getDerivedStateFromError(error: Error): State {
    return {error};
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ClientErrorBoundary]', error.message, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.error) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
