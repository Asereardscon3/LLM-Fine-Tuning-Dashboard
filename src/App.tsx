
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrainingLog {
  epoch: number;
  loss: number;
  learningRate: number;
  timestamp: string;
}

const FineTuningDashboard: React.FC = () => {
  const [logs, setLogs] = useState<TrainingLog[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');

  // Simulated WebSocket or API polling for logs
  useEffect(() => {
    if (status === 'running') {
      const interval = setInterval(() => {
        setLogs(prevLogs => {
          const nextEpoch = prevLogs.length + 1;
          const newLog: TrainingLog = {
            epoch: nextEpoch,
            loss: Math.max(0.1, 5 * Math.exp(-nextEpoch / 10) + Math.random() * 0.2),
            learningRate: 5e-5 * Math.exp(-nextEpoch / 20),
            timestamp: new Date().toLocaleTimeString()
          };
          return [...prevLogs, newLog];
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [status]);

  const startTraining = () => {
    setLogs([]);
    setStatus('running');
  };

  const stopTraining = () => setStatus('idle');

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">LLM Fine-Tuning Dashboard</h1>
        <div className="space-x-4">
          <button 
            onClick={startTraining}
            disabled={status === 'running'}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Start Training
          </button>
          <button 
            onClick={stopTraining}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Stop
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Loss Curve</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="loss" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Learning Rate Decay</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={logs}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="epoch" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="learningRate" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow overflow-hidden">
        <h2 className="text-xl font-semibold mb-4">Training Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="border-b bg-gray-100">
              <tr>
                <th className="px-4 py-2">Epoch</th>
                <th className="px-4 py-2">Loss</th>
                <th className="px-4 py-2">Learning Rate</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice().reverse().map((log, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{log.epoch}</td>
                  <td className="px-4 py-2">{log.loss.toFixed(4)}</td>
                  <td className="px-4 py-2">{log.learningRate.toExponential(2)}</td>
                  <td className="px-4 py-2 text-gray-500">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FineTuningDashboard;
