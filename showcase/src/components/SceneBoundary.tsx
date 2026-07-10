import { Component, type ErrorInfo, type ReactNode } from "react";
import { GraphicsFallback } from "./GraphicsFallback";

type Props = Readonly<{
  children: ReactNode;
  containerClass: string;
  title: string;
  description: string;
  variant: "pressure" | "glass" | "cloth";
}>;

type State = Readonly<{ failed: boolean }>;

export class SceneBoundary extends Component<Props, State> {
  state: State = Object.freeze({ failed: false });

  static getDerivedStateFromError(): State {
    return Object.freeze({ failed: true });
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    window.dispatchEvent(new CustomEvent("demeta-scene-error", {
      detail: Object.freeze({
        message: error.message,
        componentStack: info.componentStack || ""
      })
    }));
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className={this.props.containerClass} data-testid="primary-visual">
        <GraphicsFallback
          title={this.props.title}
          description={this.props.description}
          variant={this.props.variant}
        />
        <span className="visual-status" aria-live="polite">
          The enhanced scene could not load. The authored static composition is active.
        </span>
      </div>
    );
  }
}
