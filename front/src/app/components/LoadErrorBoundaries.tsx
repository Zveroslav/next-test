import React from "react";

interface LoadErrorBoundariesProps {
  loading?: boolean;
  error?: boolean | string;
  children?: React.ReactNode;
}

interface LoadErrorBoundariesState {
  renderError: boolean;
}

const DefaultLoader = () => (
  <div
    data-testid="default-loader"
    className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75"
  >
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

export class LoadErrorBoundaries extends React.Component<
  LoadErrorBoundariesProps,
  LoadErrorBoundariesState
> {
  constructor(props: LoadErrorBoundariesProps) {
    super(props);
    this.state = { renderError: false };
  }

  componentDidCatch() {
    this.setState({ renderError: true });
  }

  render() {
    const { loading, error, children, } = this.props;
    const { renderError } = this.state;

    if (error || renderError) {
      return (
        <div className="p-4 border border-red-500 bg-red-50 text-red-600 rounded-md">
          <h2 className="font-bold text-lg mb-2">An Error Occurred</h2>
          <p>{typeof error === "string" ? error : "Something went wrong."}</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="relative h-10">
            <DefaultLoader />
        </div>
      );
    }

    return <>{children}</>;
  }
}
