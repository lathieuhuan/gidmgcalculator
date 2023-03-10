import { Button } from "@Components/atoms";
import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  onUndo: () => void;
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
  };

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center">
          <div className="w-75 p-4 flex flex-col items-center bg-darkblue-1 rounded-lg">
            <p className="text-center text-lightred">An error has occured and broken the App. Try undo last action?</p>

            <Button className="mt-4" variant="positive" onClick={this.props.onUndo}>
              Undo
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
