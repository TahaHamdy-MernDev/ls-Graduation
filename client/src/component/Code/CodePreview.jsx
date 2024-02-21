import React from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodePreview = ({ codeString, language }) => {
  return (
    <div className="code-preview-container" dir='ltr' style={{ margin: '20px 0', borderRadius: '5px', overflow: 'hidden' }}>
      <SyntaxHighlighter language={language} style={vscDarkPlus}>
        {codeString}
      </SyntaxHighlighter>
    </div>
  );
};

// Define prop types for CodePreview
CodePreview.propTypes = {
  codeString: PropTypes.string.isRequired,
  language: PropTypes.string 
};

export default CodePreview;
