import analytics from "@/lib/analytics";
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log({ error, errorInfo });
    const { message, stack } = error;
    analytics("s_error_boundary", {
      message,
      stack,
    });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="h-[100vh] w-[100vw] flex justify-center items-center flex-col">
          <h2>Oops, there is an error!</h2>
          <button type="button" className="bg-primary text-white px-4 py-2 mt-4 rounded-lg" onClick={() => this.setState({ hasError: false })}>
            Try again?
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
