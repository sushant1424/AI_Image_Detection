/**
 * Exports scan history items to a CSV file for auditing.
 * @param {Array} items - The scan history items to export
 */
export const exportToCSV = (items = []) => {
  if (items.length === 0) return;

  const headers = ['Scan ID', 'Date', 'Verdict', 'Confidence Score', 'Original Image Path'];
  const rows = items.map((item) => [
    item.id,
    new Date(item.created_at).toISOString(),
    item.verdict,
    `${(item.confidence_score * 100).toFixed(1)}%`,
    item.original_image_url,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `deepguard_scan_history_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default exportToCSV;
