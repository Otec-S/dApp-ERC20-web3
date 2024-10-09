import { ChangeEvent, FC, useState } from 'react';
import { Box, Checkbox } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import cn from 'classnames';

import Close from '@assets/icons/close.svg';
import CopyIcon from '@assets/icons/copy_icon.svg';
import EtherScanLogo from '@assets/icons/etherscan.svg';
import Search from '@assets/icons/search.svg';
import CancelOffer from '@components/cancel-offer-popup/CancelOffer';

import SquareArrowIcon from '../../assets/icons/square_arrow.svg';
import getTokenIcon from '../../shared/utils/getTokenIcon';
import { shortenHash } from '../../shared/utils/shortenHash';
import { rows } from './offers-table.mock';
import styles from './offers-table.module.css';

interface Offer {
  id: number;
  fromTokenAddress: string;
  fromTokenName: string;
  toTokenAddress: string;
  toTokenName: string;
  amount1: number;
  amount2: number;
  rate: number;
  hash: string;
  status: 'Open' | 'For me';
  receiver: string;
}

export const OffersTable: FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [activeButton, setActiveButton] = useState('All');
  const [searchText, setSearchText] = useState('');

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);

  const [offerToCancel, setOfferToCancel] = useState<Offer | null>(null);

  const handleCheckboxChange = (rowId: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(rowId) ? prevSelectedRows.filter((id) => id !== rowId) : [...prevSelectedRows, rowId],
    );
  };

  const handleCancelOffer = () => {
    if (selectedRows.length > 0) {
      const selectedOffer = rows.find((row) => row.id === selectedRows[0]);
      setOfferToCancel(selectedOffer || null);
      setIsCancelPopupOpen(true);
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

  const openOffersCount = rows.filter((row) => row.status === 'Open').length;
  const forMeOffersCount = rows.filter((row) => row.status === 'For me').length;

  // Фильтруем строки по активной кнопке
  const filteredRows = rows.filter((row) => {
    if (activeButton === 'All') {
      return true;
    }
    return row.status === activeButton;
  });

  // TODO:
  // Фильтруем строки по поисковому запросу
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

  // Вычисляем видимые строки
  const visibleRows = searchedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // TODO: расширить надо будет
  const handleCloseCancelOfferPopup = () => {
    setIsCancelPopupOpen(false);
  };

  return (
    <>
      <Box sx={{ width: '100%', backgroundColor: '#FFE5A1', borderRadius: '16px' }}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>My offers</h1>
          <div className={styles.statusButtons}>
            <button
              className={cn(styles.statusButton, {
                [styles.statusButtonActive]: activeButton === 'All',
              })}
              onClick={() => handleStatusButtonClick('All')}
            >
              All
            </button>
            <button
              className={cn(styles.statusButton, {
                [styles.statusButtonActive]: activeButton === 'Open',
              })}
              onClick={() => handleStatusButtonClick('Open')}
            >
              Open <span className={styles.offersCount}>{openOffersCount}</span>
            </button>
            <button
              className={cn(styles.statusButton, {
                [styles.statusButtonActive]: activeButton === 'For me',
              })}
              onClick={() => handleStatusButtonClick('For me')}
            >
              For me <span className={styles.offersCount}>{forMeOffersCount}</span>
            </button>
          </div>
          <div className={styles.buttonsAndPagination}>
            <div className={styles.cancelAndSearchButtons}>
              <button className={styles.cancelOfferButton} onClick={handleCancelOffer}>
                Cancel offer
              </button>
              <div className={styles.searchRow}>
                <div className={styles.searchIcon}>
                  <Search />
                </div>
                <input
                  value={searchText}
                  className={styles.input}
                  placeholder="Offer ID or Asset"
                  onChange={handleChangeOfferSearchInput}
                />
                <div className={styles.inputCLoseIcon} onClick={handleClearOfferSearchInput}>
                  <Close />
                </div>
              </div>
            </div>
            <div className={styles.pagination}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </div>

        <Paper sx={{ width: '100%', mb: 2 }}>
          <TableContainer className={styles.container}>
            <Table sx={{ minWidth: 650 }} aria-label="table of offers">
              <TableHead>
                <TableRow sx={{ fontWeight: 'bold', backgroundColor: '#FFE5A1', fontFamily: 'Open Sans, sans serif' }}>
                  <TableCell></TableCell>
                  <TableCell>Offer ID</TableCell>
                  <TableCell align="left">From Asset 1</TableCell>
                  <TableCell align="left">To Asset 2</TableCell>
                  <TableCell align="right">Amount 1</TableCell>
                  <TableCell align="right">Amount 2</TableCell>
                  <TableCell align="right">Rate</TableCell>
                  <TableCell align="left">Tx hash</TableCell>
                  <TableCell align="left">Status</TableCell>
                  <TableCell align="left">Receiver</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleRows.map((row) => (
                  <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell padding="none">
                      <Checkbox
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleCheckboxChange(row.id)}
                        sx={{
                          '& .MuiSvgIcon-root': { fontSize: 15 },
                          '&.Mui-checked': {
                            color: 'black',
                          },
                        }}
                        className={styles.checkbox}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="left">
                      <div className={styles.token}>
                        <div className={styles.tokenLogo}>{getTokenIcon(row.fromTokenAddress)}</div>
                        {row.fromTokenName}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={styles.token}>
                        <div className={styles.tokenLogo}>{getTokenIcon(row.toTokenAddress)}</div>
                        {row.toTokenName}
                      </div>
                    </TableCell>
                    <TableCell align="right">{row.amount1}</TableCell>
                    <TableCell align="right">{row.amount2}</TableCell>
                    <TableCell align="right">{row.rate}</TableCell>
                    <TableCell align="left">
                      <div className={styles.hash}>
                        {shortenHash(row.hash)}
                        <div className={styles.icons}>
                          <div className={styles.etherscanIcon}>
                            <EtherScanLogo />
                          </div>
                          <div className={styles.copyIcon}>
                            <CopyIcon />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={styles.status}>
                        {row.status}
                        {row.status === 'For me' && <SquareArrowIcon />}
                      </div>
                    </TableCell>
                    <TableCell align="left">
                      <div className={styles.receiver}>
                        {shortenHash(row.receiver)} <CopyIcon />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {isCancelPopupOpen && offerToCancel && (
        <div className={styles.overlay}>
          <CancelOffer
            tradeId={BigInt(offerToCancel.id)}
            tokenFromName={offerToCancel.fromTokenName}
            tokenToName={offerToCancel.toTokenName}
            amountFrom={offerToCancel.amount1}
            amountTo={offerToCancel.amount2}
            // onClose={(successfullyDeleted) => {
            //   if (successfullyDeleted) {
            //     setIsCancelPopupOpen(false);
            //   }
            // }}
            onClose={handleCloseCancelOfferPopup}
          />
        </div>
      )}
    </>
  );
};
