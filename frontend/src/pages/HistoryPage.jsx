import React, { useState } from 'react';
import PageWrapper from 'src/components/layout/PageWrapper';
import HistoryFilter from 'src/components/history/HistoryFilter';
import HistoryGrid from 'src/components/history/HistoryGrid';
import Modal from 'src/components/common/Modal';
import ConfirmDialog from 'src/components/common/ConfirmDialog';
import ResultCard from 'src/components/detection/ResultCard';
import HeatmapViewer from 'src/components/detection/HeatmapViewer';
import ForensicsInspector from 'src/components/detection/ForensicsInspector';
import Button from 'src/components/common/Button';
import useHistory from 'src/hooks/useHistory';
import useModal from 'src/hooks/useModal';
import { exportToCSV } from 'src/utils';

export const HistoryPage = () => {
  const {
    items,
    loading,
    page,
    pages,
    filter,
    deleteItem,
    changePage,
    changeFilter,
  } = useHistory();

  const { isOpen, open, close } = useModal();
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    open();
  };

  const handleDeleteTrigger = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      await deleteItem(deleteId);
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8 w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text mb-1.5">
              Scan History
            </h1>
            <p className="text-sm text-text-secondary">
              Review and audit all your past AI image detection results.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <HistoryFilter activeFilter={filter} onChange={changeFilter} />
            <Button
              onClick={() => exportToCSV(items)}
              disabled={items.length === 0}
              variant="ghost"
              size="sm"
              className="border border-border/80"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </Button>
          </div>
        </div>

        {/* Paginated Grid */}
        <HistoryGrid
          items={items}
          loading={loading}
          page={page}
          pages={pages}
          onPageChange={changePage}
          onView={handleViewDetails}
          onDelete={handleDeleteTrigger}
        />

        {/* Detail Modal */}
        <Modal
          isOpen={isOpen}
          onClose={() => { setSelectedItem(null); close(); }}
          title="Analysis Audit details"
          maxWidth="max-w-4xl"
        >
          {selectedItem && (
            <div className="flex flex-col gap-6 py-2">
              <ResultCard result={selectedItem} />
              {selectedItem.heatmap_image_url && (
                <HeatmapViewer
                  originalUrl={selectedItem.original_image_url}
                  heatmapUrl={selectedItem.heatmap_image_url}
                />
              )}
              {selectedItem.metadata && (
                <ForensicsInspector metadata={selectedItem.metadata} />
              )}
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Scan Record"
          description="Are you sure you want to delete this scan record? This will permanently remove the record and its heatmap files from the server."
          confirmText="Delete Record"
        />
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;
