import { FC, useState } from 'react';
import { Box } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import CopyIcon from '@assets/icons/copy_icon.svg';
import EtherScanLogo from '@assets/icons/etherscan.svg';
import { SquareArrowIcon } from '@src/assets/icons';
import getTokenIcon from '@src/utils/getTokenIcon';
import { shortenHash } from '@src/utils/shortenHash';

import { rows } from './offers-table.mock';
import styles from './offers-table.module.css';

export const OffersTable: FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(3);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Вычисляем видимые строки
  const visibleRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer className={styles.container}>
          <Table sx={{ minWidth: 650 }} aria-label="table of offers">
            <TableHead>
              <TableRow sx={{ fontWeight: 'bold', backgroundColor: '#FFE5A1', fontFamily: 'Open Sans, sans serif' }}>
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
        <TablePagination
          rowsPerPageOptions={[3, 5, 10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
};
