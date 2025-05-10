import React, { useState } from 'react';
import { runTests } from '../tests/api.test';

const APITest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAPITests = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Override console.log and console.error to capture output
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
      setTestResults(prev => [...prev, args.join(' ')]);
      originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
      setTestResults(prev => [...prev, `Error: ${args.join(' ')}`]);
      originalError.apply(console, args);
    };

    try {
      await runTests();
    } finally {
      // Restore original console methods
      console.log = originalLog;
      console.error = originalError;
      setIsRunning(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">API Tests</h2>
      <button
        onClick={runAPITests}
        disabled={isRunning}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isRunning ? 'Running Tests...' : 'Run API Tests'}
      </button>
      
      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-2">Test Results:</h3>
        <div className="bg-gray-100 p-4 rounded">
          {testResults.map((result, index) => (
            <div key={index} className="mb-1">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default APITest; 