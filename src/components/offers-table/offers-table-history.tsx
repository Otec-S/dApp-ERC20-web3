import { ChangeEvent, FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseUnits, zeroAddress } from 'viem';

import { ROUTES } from '@shared/constants';

// import { rowsHistory } from './offers-table.mock';
import OffersTableBox from './offers-table-box';
import { OfferReal } from './offers-tables.types';

interface Props {
  rowsHistory: OfferReal[];
}

export const OffersTableHistory: FC<Props> = ({ rowsHistory }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
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

  // const handleReOpenClick = () => {
  //   if (selectedRows.length > 0) {
  //     navigate(ROUTES.CREATE_OFFER, { replace: true });
  //   }
  // };

  // export interface OfferReal {
  //   id: number;
  //   fromTokenAddress: Address;
  //   fromTokenName: string;
  //   toTokenAddress: Address;
  //   toTokenName: string;
  //   amount1: number;
  //   amount2: number;
  //   rate: number;
  //   // hash: Address;
  //   // status: 'Open' | 'For me' | 'Cancelled' | 'Accepted';
  //   status: string;
  //   receiver: Address | string;
  // }

  const handleReOpenClick = () => {
    if (selectedRows.length === 1) {
      // Продолжаем, только если выбран один ряд
      const selectedRow = rowsHistory.find((row) => row.id === selectedRows[0]);
      if (selectedRow) {
        const queryParams = new URLSearchParams({
          tokenToName: selectedRow.toTokenName,
          tokenFromAddress: selectedRow.fromTokenAddress,
          tokenToAddress: selectedRow.toTokenAddress,
          tokenFromName: selectedRow.fromTokenName,
          // FIXME: разберись с decimals
          tokenToDecimals: '18',
          tokenFromDecimals: '18',
          tokenFromAmount: selectedRow.amount1.toString(),

          // Первый способ: используя parseUnits, если он доступен
          // const bigintValue = parseUnits(numberValue.toString(), decimals);
          // FIXME: разберись с decimals
          // tokenFromAmount: parseUnits(selectedRow.amount1.toString(), 18).toString(),
          tokenToAmount: selectedRow.amount2.toString(),
          // tokenToAmount: parseUnits(selectedRow.amount2.toString(), 18).toString(),
          // optionalTaker: selectedRow.receiver || '', // Предполагается, что optionalTaker — необязательный
          optionalTaker: selectedRow.receiver === 'Any' ? zeroAddress : selectedRow.receiver, // Предполагается, что optionalTaker — необязательный
        });

        navigate(`${ROUTES.CREATE_OFFER}?${queryParams.toString()}`, { replace: true });
      }
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
      // rows={rowsHistory}
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
