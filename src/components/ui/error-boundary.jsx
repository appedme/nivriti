'use client';

import { Component } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
              <p className="text-gray-600">
                We encountered an unexpected error. Please try refreshing the page or go back to the homepage.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error page component for custom error pages
export function ErrorPage({ 
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  statusCode,
  showHomeButton = true 
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          {statusCode && (
            <div className="text-6xl font-bold text-gray-300 mb-2">{statusCode}</div>
          )}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-600">{message}</p>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.history.back()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Go Back
          </Button>
          
          {showHomeButton && (
            <Link href="/" className="block">
              <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          )}
        </div>
      </Card>
    </div>
  );
}

// 404 Not Found component
export function NotFoundPage() {
  return (
    <ErrorPage
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      statusCode="404"
    />
  );
}

// 500 Server Error component
export function ServerErrorPage() {
  return (
    <ErrorPage
      title="Server Error"
      message="Our servers are having trouble right now. Please try again in a few minutes."
      statusCode="500"
    />
  );
}

export default ErrorBoundary;
