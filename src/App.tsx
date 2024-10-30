import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [githubUrl, setGithubUrl] = useState<string>('');
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

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
      setError('Heavy traffic now, please try later');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGithubUrl(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-green-400 mb-6">
          Deploy Your GitHub Project
        </h1>
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
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {outputUrl && (
          <div className="mt-6">
            <p className="text-center mb-2">Deployed successfully! Copy the URL below:</p>
            <input
              type="text"
              value={outputUrl}
              readOnly
              className="w-full px-4 py-2 mb-2 rounded-md border border-gray-600 bg-gray-700 text-white"
            />
            <button
              className="w-full py-2 px-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
              onClick={() => navigator.clipboard.writeText(outputUrl)}
            >
              Copy URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;