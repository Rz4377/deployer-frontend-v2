import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';
import { FiCopy } from 'react-icons/fi'; // Import copy icon from react-icons

const App: React.FC = () => {
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);



  const validateGithubUrl = (url: string): boolean => {
    const regex = /^(https:\/\/github\.com\/)([\w.-]+)\/([\w.-]+)(\.git)?$/;
    return regex.test(url);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setOutputUrl('');

    if (!validateGithubUrl(githubUrl)) {
      setError('Please enter a valid GitHub URL');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post<{ siteUrl: string }>(
        'https://api.tallentgallery.online:446/deploy',
        { url: githubUrl }
      );
      setOutputUrl(response.data.siteUrl);
    } catch (err) {
      setError('Deployment failed check the essential points');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(e.target.value);
  };

  const handleCopy = () => {
    if (outputUrl) {
      navigator.clipboard.writeText(outputUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br flex flex-col from-gray-900 gap-20 via-gray-800 to-black text-white items-center  px-4">
      <div className="mt-16 ">
          <h2 className="text-lg font-semibold text-center text-gray-300 mb-4 font-mono">Essential Points</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-400 font-mono">
            <li>Ensure the repository has a valid build script that creates a dist folder.</li>
            <li>Provide a valid GitHub repository URL.</li>
            <li>Wait for the deployment process to complete.</li>
            <br/>
            <li>TEST URL : https://github.com/Rz4377/react-boiler-plate.git </li>

          </ul>
        </div>
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-2xl font-bold text-center text-green-400">Deploy Your GitHub Project</h1>
        

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            placeholder="Enter a valid GitHub URL"
            value={githubUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-700 text-white"
            required
          />
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md text-white transition ${
              loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={loading || !githubUrl}
          >
            {loading ? 'Deploying...' : 'Deploy'}
          </button>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {outputUrl && (
          <div className="mt-4 space-y-2">
            <p className="text-center">Deployed successfully! Copy the URL below:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={outputUrl}
                readOnly
                className="w-full px-4 py-2 rounded-md border border-gray-600 bg-gray-700 text-white"
              />
              <FiCopy
                className="text-white cursor-pointer hover:text-blue-500"
                size={24}
                onClick={handleCopy}
              />
            </div>
            {copied && <p className="text-green-500 text-center">Copied!</p>}
          </div>
        )}

        
      </div>
    </div>
  );
};

export default App;