import { FC } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import NotFoundTokenLogo from '@assets/icons/not_found_token_logo.svg';
import getTokenIcon from '@src/utils/getTokenIcon';
import { shortenHash } from '@src/utils/shortenHash';

import { rows } from './offers-table.mock';
import styles from './offers-table.module.css';

export const OffersTable: FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
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
          {rows.map((row) => (
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
              <TableCell align="left">{shortenHash(row.hash)}</TableCell>
              <TableCell align="left">{row.status}</TableCell>
              <TableCell align="left">{shortenHash(row.receiver)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
