import React from 'react';

const APIResponseFormatter = ({ response }) => {
  // Parse the JSON if it's a string
  const parsedResponse = typeof response === 'string' 
    ? JSON.parse(response) 
    : response;

  return (
    <div className="space-y-4">
      {/* Main Response */}
      <div className="text-gray-400 whitespace-pre-wrap">
        {parsedResponse.response}
      </div>

      {/* Intermediate Steps */}
      {parsedResponse.intermediate_steps && (
        <div className="mt-4">
          <h3 className="text-gray-300 font-semibold mb-2">Intermediate Steps:</h3>
          {parsedResponse.intermediate_steps.map((step, index) => (
            <div key={index} className="mb-3">
              {/* Action */}
              <div className="text-gray-400">
                <strong>Action:</strong>
                <pre className="whitespace-pre-wrap">{JSON.stringify(step.action, null, 2)}</pre>
              </div>

              {/* Observation */}
              <div className="text-gray-400 mt-2">
                <strong>Observation:</strong>
                <pre className="whitespace-pre-wrap">{step.observation}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default APIResponseFormatter;