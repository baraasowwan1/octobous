import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  errorMsg: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMsg: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMsg: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
          <div className="bg-gray-900 border border-red-500/50 rounded-2xl p-6 md:p-8 flex flex-col items-center max-w-sm text-center shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-white text-xl font-bold mb-2">Model Not Found</h2>
            <p className="text-gray-400 text-sm mb-4">
              It looks like this 3D model hasn't been uploaded yet. Please ensure the `.glb` file is in the `public` folder.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
