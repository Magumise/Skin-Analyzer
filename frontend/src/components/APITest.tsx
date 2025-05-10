import React, { useState } from 'react';
import { runTests } from '../tests/api.test';

const APITest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runAPITests = async () => {
    setIsRunning(true);
    setError(null);
    setTestResults([]);

    // Store original console methods
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    try {
      // Override console methods to capture output
      console.log = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        setTestResults(prev => [...prev, message]);
        originalConsoleLog.apply(console, args);
      };

      console.error = (...args) => {
        const message = args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        setTestResults(prev => [...prev, `❌ ${message}`]);
        originalConsoleError.apply(console, args);
      };

      await runTests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      // Restore original console methods
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      setIsRunning(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">API Test Suite</h2>
      <p className="text-gray-600 mb-4">
        This test suite will verify the functionality of the authentication API endpoints.
        It will test registration, login, token verification, and logout.
      </p>
      
      <button
        onClick={runAPITests}
        disabled={isRunning}
        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
          isRunning 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isRunning ? 'Running Tests...' : 'Run API Tests'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {testResults.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">Test Results:</h3>
          <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`mb-2 p-2 rounded ${
                  result.includes('❌') 
                    ? 'bg-red-50 text-red-700' 
                    : 'bg-green-50 text-green-700'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default APITest; 