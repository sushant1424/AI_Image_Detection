import React, { useState } from 'react';
import PageWrapper from 'src/components/layout/PageWrapper';
import HistoryFilter from 'src/components/history/HistoryFilter';
import HistoryGrid from 'src/components/history/HistoryGrid';
import Modal from 'src/components/common/Modal';
import ResultCard from 'src/components/detection/ResultCard';
import HeatmapViewer from 'src/components/detection/HeatmapViewer';
import useHistory from 'src/hooks/useHistory';
import useModal from 'src/hooks/useModal';

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

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    open();
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
    close();
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
          <HistoryFilter activeFilter={filter} onChange={changeFilter} />
        </div>

        {/* Paginated Grid */}
        <HistoryGrid
          items={items}
          loading={loading}
          page={page}
          pages={pages}
          onPageChange={changePage}
          onView={handleViewDetails}
          onDelete={deleteItem}
        />

        {/* Detail Modal */}
        <Modal
          isOpen={isOpen}
          onClose={handleCloseDetails}
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
            </div>
          )}
        </Modal>
      </div>
    </PageWrapper>
  );
};

export default HistoryPage;
