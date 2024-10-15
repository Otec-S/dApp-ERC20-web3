import { ChangeEvent, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@shared/constants';

// import { rowsHistory } from './offers-table.mock';
import OffersTableBox from './offers-table-box';
import { OfferReal } from './offers-tables.types';

interface Props {
  rowsHistory: OfferReal[];
}

export const OffersTableHistory: FC<Props> = ({ rowsHistory }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeButton, setActiveButton] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const acceptedOffersCount = rowsHistory.filter((row) => row.status === 'Accepted').length;
  const cancelledOffersCount = rowsHistory.filter((row) => row.status === 'Cancelled').length;

  const navigate = useNavigate();

  const handleCheckboxChange = (rowId: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(rowId) ? prevSelectedRows.filter((id) => id !== rowId) : [...prevSelectedRows, rowId],
    );
  };

  const handleReOpenClick = () => {
    if (selectedRows.length > 0) {
      navigate(ROUTES.CREATE_OFFER, { replace: true });
    }
  };

  const handleStatusButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  const handleChangeOfferSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleClearOfferSearchInput = () => {
    setSearchText('');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredRows = rowsHistory.filter((row) => {
    if (activeButton === 'All') {
      return true;
    }
    return row.status === activeButton;
  });

  const searchedRows = filteredRows.filter((row) => {
    if (searchText === '') {
      return true;
    }
    return (
      row.id.toString().includes(searchText) ||
      row.fromTokenName.toLowerCase().includes(searchText.toLowerCase()) ||
      row.toTokenName.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const visibleRows = searchedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const tableConfig = {
    title: 'History',
    statusButtons: [
      { name: 'All', count: rowsHistory.length },
      { name: 'Accepted', count: acceptedOffersCount },
      { name: 'Cancelled', count: cancelledOffersCount },
    ],
    mainButton: 'Re-open',
  };

  return (
    <OffersTableBox
      title={tableConfig.title}
      statusButtons={tableConfig.statusButtons}
      activeButton={activeButton}
      mainButton={tableConfig.mainButton}
      rows={rowsHistory}
      visibleRows={visibleRows}
      searchText={searchText}
      selectedRows={selectedRows}
      filteredRows={filteredRows}
      rowsPerPage={rowsPerPage}
      page={page}
      onStatusButtonClick={handleStatusButtonClick}
      onMainButtonClick={handleReOpenClick}
      onSearchInputChange={handleChangeOfferSearchInput}
      onClearSearchInput={handleClearOfferSearchInput}
      onCheckboxChange={handleCheckboxChange}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
    />
  );
};
