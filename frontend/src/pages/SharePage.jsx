import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PageWrapper from 'src/components/layout/PageWrapper';
import ResultCard from 'src/components/detection/ResultCard';
import HeatmapViewer from 'src/components/detection/HeatmapViewer';
import ForensicsInspector from 'src/components/detection/ForensicsInspector';
import Spinner from 'src/components/common/Spinner';
import Button from 'src/components/common/Button';
import Card from 'src/components/common/Card';
import { ROUTES } from 'src/constants';

export const SharePage = () => {
  const { id } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/public-detect/${id}`);
        setScan(res.data);
        setFeedback(res.data.feedback);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load public scan record.');
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
  }, [id]);

  const handleFeedback = async (type) => {
    try {
      const res = await axios.put(`/api/public-detect/${id}/feedback`, { feedback: type });
      setFeedback(res.data.feedback);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <Spinner className="w-12 h-12 text-primary" />
          <p className="text-sm text-text-secondary">Loading shared analysis report...</p>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper>
        <div className="max-w-md mx-auto text-center py-10 flex flex-col gap-6">
          <Card className="p-6 border-danger/30 bg-danger/5">
            <h3 className="text-lg font-bold text-danger mb-2">Scan Not Found</h3>
            <p className="text-xs text-text-secondary leading-relaxed">{error}</p>
          </Card>
          <Link to={ROUTES.HOME}><Button variant="secondary" className="w-full">Back to Home</Button></Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
        <div className="text-center">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full border border-primary/25">
            Shared Report
          </span>
          <h1 className="text-3xl font-extrabold text-text mt-3 mb-1">DeepGuard Image Audit</h1>
          <p className="text-xs text-text-secondary">Scan ID: {id}</p>
        </div>

        {scan && (
          <>
            <ResultCard result={scan} />

            {/* Feedback Loops widget */}
            <Card className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 w-full bg-surface-light border border-border/80 rounded-2xl">
              <span className="text-xs font-semibold text-text-secondary">
                Was this image verification accurate?
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant={feedback === 'thumbs_up' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handleFeedback('thumbs_up')}
                >
                  👍 Yes
                </Button>
                <Button
                  variant={feedback === 'thumbs_down' ? 'danger' : 'ghost'}
                  size="sm"
                  onClick={() => handleFeedback('thumbs_down')}
                >
                  👎 No
                </Button>
              </div>
            </Card>

            {scan.heatmap_image_url && (
              <HeatmapViewer
                originalUrl={scan.original_image_url}
                heatmapUrl={scan.heatmap_image_url}
              />
            )}

            {scan.metadata && (
              <ForensicsInspector metadata={scan.metadata} />
            )}
          </>
        )}

        <div className="flex gap-4 w-full max-w-md mt-4">
          <Link to={ROUTES.HOME} className="flex-1"><Button variant="ghost" className="w-full">Back to Home</Button></Link>
          <Link to={ROUTES.DETECT} className="flex-1"><Button className="w-full">Try DeepGuard Free</Button></Link>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SharePage;
